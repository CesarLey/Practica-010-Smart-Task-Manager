/**
 * tenseDetector.js - Professional English Tense Detection Utility
 * @version 2.1.0
 * @author Continuous Tense Detector Team
 * @license MIT
 * @description Advanced utility for detecting English grammatical tenses with caching, validation, and error handling
 */

// Configuration constants for maintainability
const CONFIG = Object.freeze({
  MAX_TEXT_LENGTH: 5000,
  CACHE_SIZE: 50,
  PERFORMANCE_MODE: process.env.NODE_ENV === 'production',
  LOG_LEVEL: process.env.LOG_LEVEL || 'warn', // 'debug', 'info', 'warn', 'error'
  ENABLE_CACHE: true
})

// Enhanced logger with configurable levels
const logger = {
  levels: { debug: 0, info: 1, warn: 2, error: 3 },
  currentLevel: CONFIG.LOG_LEVEL,

  _shouldLog(level) {
    return this.levels[level] >= this.levels[this.currentLevel]
  },

  debug: (message, data) => {
    if (CONFIG.PERFORMANCE_MODE || !logger._shouldLog('debug')) return
    console.debug(`[TenseDetector:DEBUG] ${message}`, data || '')
  },

  info: (message, data) => {
    if (!logger._shouldLog('info')) return
    console.info(`[TenseDetector:INFO] ${message}`, data || '')
  },

  warn: (message, data) => {
    if (!logger._shouldLog('warn')) return
    console.warn(`[TenseDetector:WARN] ${message}`, data || '')
  },

  error: (message, error) => {
    if (!logger._shouldLog('error')) return
    console.error(`[TenseDetector:ERROR] ${message}`, error)
  }
}

// Patrones para detectar tiempos continuos y conectores
const patterns = {
  // Presente continuo: am/is/are + verb+ing
  presentContinuous: /\b(am|is|are)\s+\w+ing\b/gi,

  // Pasado continuo: was/were + verb+ing
  pastContinuous: /\b(was|were)\s+\w+ing\b/gi,

  // Pasado continuo negativo: wasn't/weren't + verb+ing
  pastContinuousNegative: /\b(wasn't|weren't)\s+\w+ing\b/gi,

  // Pasado continuo interrogativo: Was/Were + subject + verb+ing?
  pastContinuousInterrogative: /\b(Was|Were)\s+\w+\s+\w+ing\??\b/gi,

  // Futuro continuo: will be + verb+ing
  futureContinuous: /\bwill\s+be\s+\w+ing\b/gi,

  // Presente perfecto continuo: have/has been + verb+ing
  presentPerfectContinuous: /\b(has|have)\s+been\s+\w+ing\b/gi,

  // Pasado perfecto continuo: had been + verb+ing
  pastPerfectContinuous: /\bhad\s+been\s+\w+ing\b/gi,

  // Pasado simple positivo: verbos regulares en -ed o irregulares comunes
  simplePastPositive: /\b(ate|began|broke|brought|built|bought|caught|chose|came|did|drew|drank|drove|ate|fell|felt|fought|found|flew|forgot|got|gave|went|grew|had|heard|held|kept|knew|left|let|lay|lost|made|meant|met|paid|put|quit|read|rode|rang|rose|ran|said|saw|sold|sent|set|shook|shot|showed|shut|sang|sank|sat|slept|spoke|spent|spread|sprang|stood|stole|struck|swore|swam|swung|took|taught|tore|told|thought|threw|understood|woke|wore|won|wrote)\b/gi,

  // Pasado simple negativo: didn't + verb
  simplePastNegative: /\bdidn't\s+\w+\b/gi,

  // Pasado simple interrogativo: Did + subject + verb?
  simplePastInterrogative: /\bDid\s+\w+\s+\w+\??\b/gi,

  // Conectores temporales
  whileConnector: /\bwhile\b/gi,
  whenConnector: /\bwhen\b/gi,
  asSoonAsConnector: /\bas\s+soon\s+as\b/gi,
  untilConnector: /\buntil\b/gi,
  beforeConnector: /\bbefore\b/gi,
  afterConnector: /\bafter\b/gi,
  sinceConnector: /\bsince\b/gi,

  // Verbos auxiliares y modales
  modals: /\b(can|could|may|might|must|shall|should|will|would)\s+be\s+\w+ing\b/gi,

  // Formas negativas
  negativeContinuous: /\b(am|is|are|was|were|will|has|have|had)\s+not\s+\w+ing\b/gi
}

// Enhanced LRU cache with statistics and memory management
class SmartCache {
  constructor(maxSize = CONFIG.CACHE_SIZE) {
    this.maxSize = maxSize
    this.cache = new Map()
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      size: 0
    }
  }

  get(key) {
    if (this.cache.has(key)) {
      this.stats.hits++
      const value = this.cache.get(key)
      // Move to end (most recently used)
      this.cache.delete(key)
      this.cache.set(key, value)
      return value
    }
    this.stats.misses++
    return null
  }

  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key)
    } else if (this.cache.size >= this.maxSize) {
      // Remove least recently used
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
      this.stats.evictions++
    }

    this.cache.set(key, value)
    this.stats.size = this.cache.size
  }

  clear() {
    this.cache.clear()
    this.stats.size = 0
    this.stats.evictions = 0
  }

  getStats() {
    const hitRate = this.stats.hits + this.stats.misses > 0
      ? (this.stats.hits / (this.stats.hits + this.stats.misses) * 100).toFixed(1)
      : '0.0'
    return {
      ...this.stats,
      hitRate: `${hitRate}%`,
      maxSize: this.maxSize
    }
  }
}

const analysisCache = new SmartCache()
// Enhanced input validation with security checks
const validateInput = (text) => {
  try {
    // Type validation
    if (typeof text !== 'string') {
      logger.warn('Invalid input type', { type: typeof text, value: text })
      return { isValid: false, reason: 'invalid_type', message: 'Input must be a string' }
    }

    // Length validation
    if (text.length > CONFIG.MAX_TEXT_LENGTH) {
      logger.warn('Input text too long', { length: text.length, max: CONFIG.MAX_TEXT_LENGTH })
      return {
        isValid: false,
        reason: 'too_long',
        message: `Input text exceeds maximum length of ${CONFIG.MAX_TEXT_LENGTH} characters`
      }
    }

    // Empty/whitespace validation
    const trimmed = text.trim()
    if (!trimmed) {
      logger.debug('Empty input received')
      return { isValid: false, reason: 'empty', message: 'Input text is empty or contains only whitespace' }
    }

    // Security validation - check for potentially dangerous patterns
    const dangerousPatterns = [
      /<script[^>]*>[\s\S]*?<\/script>/gi,
      /javascript:/gi,
      /vbscript:/gi,
      /on\w+\s*=/gi,
      /<iframe[^>]*>/gi,
      /<object[^>]*>/gi,
      /<embed[^>]*>/gi
    ]

    for (const pattern of dangerousPatterns) {
      if (pattern.test(text)) {
        logger.error('Potentially dangerous input detected', { pattern: pattern.source, text: text.substring(0, 100) })
        return {
          isValid: false,
          reason: 'security_risk',
          message: 'Input contains potentially unsafe content'
        }
      }
    }

    // Content validation - ensure it looks like English text
    const wordCount = trimmed.split(/\s+/).length
    const hasLetters = /[a-zA-Z]/.test(trimmed)
    const hasTooManyNumbers = (trimmed.match(/\d/g) || []).length > wordCount * 0.5

    if (!hasLetters || hasTooManyNumbers) {
      logger.warn('Input does not appear to be natural English text', {
        hasLetters,
        wordCount,
        numberRatio: hasTooManyNumbers ? 'high' : 'normal'
      })
      return {
        isValid: false,
        reason: 'invalid_content',
        message: 'Input does not appear to be valid English text'
      }
    }

    return { isValid: true }

  } catch (error) {
    logger.error('Error during input validation', error)
    return { isValid: false, reason: 'validation_error', message: 'An error occurred while validating input' }
  }
}

// Helper to ensure regex matching is done with a fresh RegExp (avoids g-flag lastIndex bugs)
const flagsWithG = (pattern) => (pattern.flags.includes('g') ? pattern.flags : pattern.flags + 'g')

const findMatches = (pattern, text) => {
  const re = new RegExp(pattern.source, flagsWithG(pattern))
  return Array.from(text.matchAll(re), (m) => m[0])
}

const hasPattern = (pattern, text) => {
  // Use a non-global RegExp for test/search to avoid stateful .test behaviour
  const re = new RegExp(pattern.source, pattern.flags.replace('g', ''))
  return re.test(text)
}

const normalizeText = (text) => text.replace(/\s+/g, ' ').trim()

/**
 * Analyze a single English sentence and detect continuous and past/simple tenses.
 *
 * This function includes comprehensive input validation, caching for performance,
 * and detailed error handling. It returns an object with arrays for each detected
 * pattern and metadata about sentence structure and complexity.
 *
 * @param {string} text - The sentence to analyze (max 5000 characters)
 * @returns {object} analysis - Object containing detected patterns and metadata
 * @property {string} originalText - The original input text
 * @property {string[]} presentContinuous - Array of present continuous forms found
 * @property {string[]} pastContinuous - Array of past continuous forms found
 * @property {string[]} simplePastPositive - Array of simple past positive forms found
 * @property {string[]} connectors - Array of temporal connectors found
 * @property {string} sentenceType - 'simple', 'compound', or 'complex'
 * @property {string} complexity - 'basic', 'intermediate', or 'advanced'
 * @property {string} [error] - Error type if validation failed
 * @property {string} [message] - Human-readable error message
 */
export const analyzeSentence = (text) => {
  const startTime = performance.now()

  try {
    // Input validation
    const validation = validateInput(text)
    if (!validation.isValid) {
      logger.warn('Input validation failed', validation)
      return {
        originalText: text,
        error: validation.reason,
        message: validation.message,
        presentContinuous: [],
        pastContinuous: [],
        pastContinuousNegative: [],
        pastContinuousInterrogative: [],
        futureContinuous: [],
        presentPerfectContinuous: [],
        pastPerfectContinuous: [],
        simplePastPositive: [],
        simplePastNegative: [],
        simplePastInterrogative: [],
        modals: [],
        negatives: [],
        connectors: [],
        sentenceType: 'simple',
        complexity: 'basic',
        processingTime: performance.now() - startTime
      }
    }

    const normalized = normalizeText(text)

    // Check cache first
    if (CONFIG.ENABLE_CACHE) {
      const cached = analysisCache.get(normalized)
      if (cached) {
        logger.debug('Cache hit', { text: normalized.substring(0, 50) })
        cached.processingTime = performance.now() - startTime
        cached.fromCache = true
        return cached
      }
    }

    logger.debug('Analyzing sentence', { length: normalized.length, text: normalized.substring(0, 50) })

    const lower = normalized.toLowerCase()
    const analysis = {
      originalText: text,
      hasWhile: hasPattern(patterns.whileConnector, lower),
      hasWhen: hasPattern(patterns.whenConnector, lower),
      hasAsSoonAs: hasPattern(patterns.asSoonAsConnector, lower),
      hasUntil: hasPattern(patterns.untilConnector, lower),
      hasBefore: hasPattern(patterns.beforeConnector, lower),
      hasAfter: hasPattern(patterns.afterConnector, lower),
      hasSince: hasPattern(patterns.sinceConnector, lower),
      presentContinuous: [],
      pastContinuous: [],
      pastContinuousNegative: [],
      pastContinuousInterrogative: [],
      futureContinuous: [],
      presentPerfectContinuous: [],
      pastPerfectContinuous: [],
      simplePastPositive: [],
      simplePastNegative: [],
      simplePastInterrogative: [],
      modals: [],
      negatives: [],
      connectors: [],
      sentenceType: 'simple',
      complexity: 'basic'
    }

  // Detectar tiempos continuos y otras formas usando helpers
  const presentMatches = findMatches(patterns.presentContinuous, lower)
  if (presentMatches.length) analysis.presentContinuous = [...new Set(presentMatches.map(m => m.toLowerCase()))]

  const pastMatches = findMatches(patterns.pastContinuous, lower)
  if (pastMatches.length) analysis.pastContinuous = [...new Set(pastMatches.map(m => m.toLowerCase()))]

  const pastContinuousNegativeMatches = findMatches(patterns.pastContinuousNegative, lower)
  if (pastContinuousNegativeMatches.length) analysis.pastContinuousNegative = [...new Set(pastContinuousNegativeMatches.map(m => m.toLowerCase()))]

  const pastContinuousInterrogativeMatches = findMatches(patterns.pastContinuousInterrogative, lower)
  if (pastContinuousInterrogativeMatches.length) analysis.pastContinuousInterrogative = [...new Set(pastContinuousInterrogativeMatches.map(m => m.toLowerCase()))]

  const futureMatches = findMatches(patterns.futureContinuous, lower)
  if (futureMatches.length) analysis.futureContinuous = [...new Set(futureMatches.map(m => m.toLowerCase()))]

  const presentPerfectMatches = findMatches(patterns.presentPerfectContinuous, lower)
  if (presentPerfectMatches.length) analysis.presentPerfectContinuous = [...new Set(presentPerfectMatches.map(m => m.toLowerCase()))]

  const pastPerfectMatches = findMatches(patterns.pastPerfectContinuous, lower)
  if (pastPerfectMatches.length) analysis.pastPerfectContinuous = [...new Set(pastPerfectMatches.map(m => m.toLowerCase()))]

  const simplePastPositiveMatches = findMatches(patterns.simplePastPositive, lower)
  if (simplePastPositiveMatches.length) analysis.simplePastPositive = [...new Set(simplePastPositiveMatches.map(m => m.toLowerCase()))]

  const simplePastNegativeMatches = findMatches(patterns.simplePastNegative, lower)
  if (simplePastNegativeMatches.length) analysis.simplePastNegative = [...new Set(simplePastNegativeMatches.map(m => m.toLowerCase()))]

  const simplePastInterrogativeMatches = findMatches(patterns.simplePastInterrogative, lower)
  if (simplePastInterrogativeMatches.length) analysis.simplePastInterrogative = [...new Set(simplePastInterrogativeMatches.map(m => m.toLowerCase()))]

  // Modals and negatives
  const modalMatches = findMatches(patterns.modals, lower)
  if (modalMatches.length) analysis.modals = [...new Set(modalMatches.map(m => m.toLowerCase()))]

  const negativeMatches = findMatches(patterns.negativeContinuous, lower)
  if (negativeMatches.length) analysis.negatives = [...new Set(negativeMatches.map(m => m.toLowerCase()))]

  // Conectores
  if (analysis.hasWhile) analysis.connectors.push('while')
  if (analysis.hasWhen) analysis.connectors.push('when')
  if (analysis.hasAsSoonAs) analysis.connectors.push('as soon as')
  if (analysis.hasUntil) analysis.connectors.push('until')
  if (analysis.hasBefore) analysis.connectors.push('before')
  if (analysis.hasAfter) analysis.connectors.push('after')
  if (analysis.hasSince) analysis.connectors.push('since')

  // Determinar tipo de oración
  const totalTenses = analysis.presentContinuous.length + analysis.pastContinuous.length +
                     analysis.pastContinuousNegative.length + analysis.pastContinuousInterrogative.length +
                     analysis.futureContinuous.length + analysis.presentPerfectContinuous.length +
                     analysis.pastPerfectContinuous.length + analysis.simplePastPositive.length +
                     analysis.simplePastNegative.length + analysis.simplePastInterrogative.length

  if (analysis.connectors.length > 0 && totalTenses >= 2) {
    analysis.sentenceType = 'complex'
  } else if (totalTenses >= 2) {
    analysis.sentenceType = 'compound'
  }

  // Determinar complejidad
  if (analysis.modals.length > 0 || analysis.negatives.length > 0) {
    analysis.complexity = 'advanced'
  } else if (analysis.connectors.length > 1 || totalTenses > 2) {
    analysis.complexity = 'intermediate'
  }

  // Cache and return
  if (CONFIG.ENABLE_CACHE) {
    analysisCache.set(normalized, analysis)
  }

  analysis.processingTime = performance.now() - startTime
  logger.debug('Analysis completed', {
    sentenceType: analysis.sentenceType,
    complexity: analysis.complexity,
    totalTenses,
    processingTime: analysis.processingTime
  })

  return analysis

  } catch (error) {
    logger.error('Error during sentence analysis', error)
    return {
      originalText: text,
      error: 'analysis_error',
      message: 'An error occurred while analyzing the sentence',
      presentContinuous: [],
      pastContinuous: [],
      pastContinuousNegative: [],
      pastContinuousInterrogative: [],
      futureContinuous: [],
      presentPerfectContinuous: [],
      pastPerfectContinuous: [],
      simplePastPositive: [],
      simplePastNegative: [],
      simplePastInterrogative: [],
      modals: [],
      negatives: [],
      connectors: [],
      sentenceType: 'simple',
      complexity: 'basic',
      processingTime: performance.now() - startTime
    }
  }
}

/**
 * Get system statistics and performance metrics
 * @returns {object} stats - System statistics
 */
export const getSystemStats = () => {
  return {
    cache: analysisCache.getStats(),
    config: { ...CONFIG },
    version: '2.1.0',
    timestamp: new Date().toISOString()
  }
}

/**
 * Clear the analysis cache
 * @returns {boolean} success - Whether cache was cleared successfully
 */
export const clearCache = () => {
  try {
    analysisCache.clear()
    logger.info('Cache cleared successfully')
    return true
  } catch (error) {
    logger.error('Error clearing cache', error)
    return false
  }
}