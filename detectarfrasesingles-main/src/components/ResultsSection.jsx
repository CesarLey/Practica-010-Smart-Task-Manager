import React from 'react'
import { CheckCircle, AlertCircle, Link, Clock, FileText, Brain, Copy, Check } from 'lucide-react'

const ResultsSection = ({ analysis, isAnalyzing, t }) => {
  const [copied, setCopied] = React.useState(false)

  if (!analysis && !isAnalyzing) return null

  if (isAnalyzing) {
    return (
      <div className="results-section analyzing">
        <div className="loading-card">
          <div className="loading-spinner"></div>
          <p>{t.analyzing}</p>
        </div>
      </div>
    )
  }

  const copyToClipboard = async () => {
    const resultText = generateResultText(analysis, t)
    try {
      await navigator.clipboard.writeText(resultText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  if (analysis?.error === 'empty') {
    return (
      <div className="results-section">
        <div className="no-input-card">
          <FileText size={48} className="no-input-icon" />
          <h3>{t.writePhrase}</h3>
          <p>{t.writePhraseDesc}</p>
        </div>
      </div>
    )
  }

  const hasDetections = analysis.presentContinuous.length > 0 || 
                       analysis.pastContinuous.length > 0 || 
                       analysis.pastContinuousNegative.length > 0 ||
                       analysis.pastContinuousInterrogative.length > 0 ||
                       analysis.futureContinuous.length > 0 ||
                       analysis.presentPerfectContinuous.length > 0 ||
                       analysis.pastPerfectContinuous.length > 0 ||
                       analysis.simplePastPositive.length > 0 ||
                       analysis.simplePastNegative.length > 0 ||
                       analysis.simplePastInterrogative.length > 0 ||
                       analysis.modals.length > 0 ||
                       analysis.negatives.length > 0 ||
                       analysis.connectors.length > 0

  if (!hasDetections) {
    return (
      <div className="results-section">
        <div className="no-detection-card">
          <AlertCircle size={48} className="no-detection-icon" />
          <h3>{t.noPatterns}</h3>
          <p>{t.noPatternsDesc}</p>
          <div className="suggestions">
            <p>{t.suggestions}</p>
            <ul>
              {t.suggestionsList.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="results-section">
      <div className="result-card">
        <div className="result-header">
          <Brain size={24} className="success-icon" />
          <h3>{t.analysisTitle}</h3>
          <button
            onClick={copyToClipboard}
            className="copy-button"
            title={copied ? t.copied || 'Copied!' : t.copyResults || 'Copy results'}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
        
        <div className="detected-phrase">
          <SyntaxHighlightedText text={analysis.originalText} analysis={analysis} />
        </div>

        <div className="detections-grid">
          {analysis.presentContinuous.length > 0 && (
            <div className="detection-badge present-continuous">
              <Clock size={16} />
              <div>
                <span className="badge-title">{t.presentContinuous}</span>
                <span className="badge-content">{analysis.presentContinuous.join(', ')}</span>
              </div>
            </div>
          )}

          {analysis.pastContinuous.length > 0 && (
            <div className="detection-badge past-continuous">
              <Clock size={16} />
              <div>
                <span className="badge-title">{t.pastContinuous}</span>
                <span className="badge-content">{analysis.pastContinuous.join(', ')}</span>
              </div>
            </div>
          )}

          {analysis.futureContinuous.length > 0 && (
            <div className="detection-badge future-continuous">
              <Clock size={16} />
              <div>
                <span className="badge-title">{t.futureContinuous}</span>
                <span className="badge-content">{analysis.futureContinuous.join(', ')}</span>
              </div>
            </div>
          )}

          {analysis.presentPerfectContinuous.length > 0 && (
            <div className="detection-badge present-perfect-continuous">
              <Clock size={16} />
              <div>
                <span className="badge-title">{t.presentPerfectContinuous}</span>
                <span className="badge-content">{analysis.presentPerfectContinuous.join(', ')}</span>
              </div>
            </div>
          )}

          {analysis.pastPerfectContinuous.length > 0 && (
            <div className="detection-badge past-perfect-continuous">
              <Clock size={16} />
              <div>
                <span className="badge-title">{t.pastPerfectContinuous}</span>
                <span className="badge-content">{analysis.pastPerfectContinuous.join(', ')}</span>
              </div>
            </div>
          )}

          {analysis.pastContinuousNegative.length > 0 && (
            <div className="detection-badge past-continuous-negative">
              <Clock size={16} />
              <div>
                <span className="badge-title">{t.pastContinuousNegative}</span>
                <span className="badge-content">{analysis.pastContinuousNegative.join(', ')}</span>
              </div>
            </div>
          )}

          {analysis.pastContinuousInterrogative.length > 0 && (
            <div className="detection-badge past-continuous-interrogative">
              <Clock size={16} />
              <div>
                <span className="badge-title">{t.pastContinuousInterrogative}</span>
                <span className="badge-content">{analysis.pastContinuousInterrogative.join(', ')}</span>
              </div>
            </div>
          )}

          {analysis.simplePastPositive.length > 0 && (
            <div className="detection-badge simple-past-positive">
              <Clock size={16} />
              <div>
                <span className="badge-title">{t.simplePastPositive}</span>
                <span className="badge-content">{analysis.simplePastPositive.join(', ')}</span>
              </div>
            </div>
          )}

          {analysis.simplePastNegative.length > 0 && (
            <div className="detection-badge simple-past-negative">
              <Clock size={16} />
              <div>
                <span className="badge-title">{t.simplePastNegative}</span>
                <span className="badge-content">{analysis.simplePastNegative.join(', ')}</span>
              </div>
            </div>
          )}

          {analysis.simplePastInterrogative.length > 0 && (
            <div className="detection-badge simple-past-interrogative">
              <Clock size={16} />
              <div>
                <span className="badge-title">{t.simplePastInterrogative}</span>
                <span className="badge-content">{analysis.simplePastInterrogative.join(', ')}</span>
              </div>
            </div>
          )}

          {analysis.modals.length > 0 && (
            <div className="detection-badge modals">
              <Brain size={16} />
              <div>
                <span className="badge-title">{t.modals}</span>
                <span className="badge-content">{analysis.modals.join(', ')}</span>
              </div>
            </div>
          )}

          {analysis.negatives.length > 0 && (
            <div className="detection-badge negatives">
              <AlertCircle size={16} />
              <div>
                <span className="badge-title">{t.negatives}</span>
                <span className="badge-content">{analysis.negatives.join(', ')}</span>
              </div>
            </div>
          )}

          {analysis.connectors.length > 0 && (
            <div className="detection-badge connector">
              <Link size={16} />
              <div>
                <span className="badge-title">{t.connectors}</span>
                <span className="badge-content">{analysis.connectors.join(', ')}</span>
              </div>
            </div>
          )}
        </div>

        <AnalysisDetails analysis={analysis} t={t} />
      </div>
    </div>
  )
}

const SyntaxHighlightedText = ({ text, analysis }) => {
  let highlightedText = text

  // Highlight "while" and "when"
  highlightedText = highlightedText.replace(/\b(while)\b/gi, '<span class="syntax-while">$1</span>')
  highlightedText = highlightedText.replace(/\b(when)\b/gi, '<span class="syntax-when">$1</span>')
  
  // Highlight continuous tenses
  highlightedText = highlightedText.replace(/\b(am|is|are|was|were)\s+(\w+ing)\b/gi, 
    '<span class="syntax-highlight">$1</span> <span class="syntax-verb">$2</span>')

  // Highlight negative continuous
  highlightedText = highlightedText.replace(/\b(wasn't|weren't)\s+(\w+ing)\b/gi, 
    '<span class="syntax-highlight">$1</span> <span class="syntax-verb">$2</span>')

  // Highlight interrogative continuous
  highlightedText = highlightedText.replace(/\b(Was|Were)\s+\w+\s+\w+ing\??\b/gi, 
    '<span class="syntax-highlight">$1</span> <span class="syntax-verb">$&</span>')

  // Highlight simple past
  highlightedText = highlightedText.replace(/\bdidn't\s+\w+\b/gi, 
    '<span class="syntax-highlight">didn\'t</span> <span class="syntax-verb">$&</span>')

  highlightedText = highlightedText.replace(/\bDid\s+\w+\s+\w+\??\b/gi, 
    '<span class="syntax-highlight">Did</span> <span class="syntax-verb">$&</span>')

  return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />
}

const AnalysisDetails = ({ analysis, t }) => {
  const details = []

  if (analysis.presentContinuous.length > 0) {
    details.push(t.grammarDetails.presentRule)
  }

  if (analysis.pastContinuous.length > 0) {
    details.push(t.grammarDetails.pastRule)
  }

  if (analysis.futureContinuous.length > 0) {
    details.push(t.grammarDetails.futureRule)
  }

  if (analysis.presentPerfectContinuous.length > 0) {
    details.push(t.grammarDetails.presentPerfectRule)
  }

  if (analysis.pastPerfectContinuous.length > 0) {
    details.push(t.grammarDetails.pastPerfectRule)
  }

  if (analysis.pastContinuousNegative.length > 0) {
    details.push(t.grammarDetails.pastContinuousNegativeRule)
  }

  if (analysis.pastContinuousInterrogative.length > 0) {
    details.push(t.grammarDetails.pastContinuousInterrogativeRule)
  }

  if (analysis.simplePastPositive.length > 0) {
    details.push(t.grammarDetails.simplePastPositiveRule)
  }

  if (analysis.simplePastNegative.length > 0) {
    details.push(t.grammarDetails.simplePastNegativeRule)
  }

  if (analysis.simplePastInterrogative.length > 0) {
    details.push(t.grammarDetails.simplePastInterrogativeRule)
  }

  if (analysis.hasWhile) {
    details.push(t.grammarDetails.whileRule)
  }

  if (analysis.hasWhen) {
    details.push(t.grammarDetails.whenRule)
  }

  if (analysis.hasAsSoonAs) {
    details.push(t.grammarDetails.asSoonAsRule)
  }

  if (analysis.hasUntil) {
    details.push(t.grammarDetails.untilRule)
  }

  if (analysis.hasBefore) {
    details.push(t.grammarDetails.beforeRule)
  }

  if (analysis.hasAfter) {
    details.push(t.grammarDetails.afterRule)
  }

  if (analysis.hasSince) {
    details.push(t.grammarDetails.sinceRule)
  }

  if (analysis.modals.length > 0) {
    details.push(t.grammarDetails.modalRule)
  }

  if (analysis.negatives.length > 0) {
    details.push(t.grammarDetails.negativeRule)
  }

  if (analysis.presentContinuous.length > 0 && analysis.pastContinuous.length > 0) {
    details.push(t.grammarDetails.mixWarning)
  }

  if (analysis.complexity === 'advanced') {
    details.push(t.grammarDetails.complexityNote)
  }

  return (
    <div className="analysis-details">
      <h4>{t.analysisDetails}</h4>
      <ul>
        {details.map((detail, index) => (
          <li key={index}>{detail}</li>
        ))}
      </ul>
    </div>
  )
}

const generateResultText = (analysis, t) => {
  let result = `${t.analysisTitle.toUpperCase()}\n`
  result += `Original: "${analysis.originalText}"\n\n`

  if (analysis.presentContinuous.length > 0) {
    result += `${t.presentContinuous}: ${analysis.presentContinuous.join(', ')}\n`
  }
  if (analysis.pastContinuous.length > 0) {
    result += `${t.pastContinuous}: ${analysis.pastContinuous.join(', ')}\n`
  }
  if (analysis.futureContinuous.length > 0) {
    result += `${t.futureContinuous}: ${analysis.futureContinuous.join(', ')}\n`
  }
  if (analysis.presentPerfectContinuous.length > 0) {
    result += `${t.presentPerfectContinuous}: ${analysis.presentPerfectContinuous.join(', ')}\n`
  }
  if (analysis.pastPerfectContinuous.length > 0) {
    result += `${t.pastPerfectContinuous}: ${analysis.pastPerfectContinuous.join(', ')}\n`
  }
  if (analysis.modals.length > 0) {
    result += `${t.modals}: ${analysis.modals.join(', ')}\n`
  }
  if (analysis.negatives.length > 0) {
    result += `${t.negatives}: ${analysis.negatives.join(', ')}\n`
  }
  if (analysis.connectors.length > 0) {
    result += `${t.connectors}: ${analysis.connectors.join(', ')}\n`
  }

  result += `\n${t.sentenceType}: ${analysis.sentenceType}\n`
  result += `${t.complexity}: ${analysis.complexity}\n`

  return result
}

export default ResultsSection