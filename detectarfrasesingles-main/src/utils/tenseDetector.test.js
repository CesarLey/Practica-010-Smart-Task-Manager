import { describe, it, expect } from 'vitest'
import { analyzeSentence } from '../utils/tenseDetector'

describe('Tense Detector', () => {
  describe('Present Continuous', () => {
    it('should detect present continuous tenses', () => {
      const result = analyzeSentence('I am reading while she is cooking')
      expect(result.presentContinuous).toContain('am reading')
      expect(result.presentContinuous).toContain('is cooking')
    })

    it('should handle case insensitive detection', () => {
      const result = analyzeSentence('She IS studying now')
      expect(result.presentContinuous).toContain('is studying')
    })
  })

  describe('Past Continuous', () => {
    it('should detect past continuous tenses', () => {
      const result = analyzeSentence('I was reading when she arrived')
      expect(result.pastContinuous).toContain('was reading')
    })

    it('should detect were forms', () => {
      const result = analyzeSentence('They were playing football')
      expect(result.pastContinuous).toContain('were playing')
    })
  })

  describe('Future Continuous', () => {
    it('should detect future continuous tenses', () => {
      const result = analyzeSentence('I will be waiting for you')
      expect(result.futureContinuous).toContain('will be waiting')
    })
  })

  describe('Perfect Continuous Tenses', () => {
    it('should detect present perfect continuous', () => {
      const result = analyzeSentence('I have been working here for 5 years')
      expect(result.presentPerfectContinuous).toContain('have been working')
    })

    it('should detect past perfect continuous', () => {
      const result = analyzeSentence('She had been studying before the exam')
      expect(result.pastPerfectContinuous).toContain('had been studying')
    })
  })

  describe('Connectors', () => {
    it('should detect while and when connectors', () => {
      const result = analyzeSentence('While I was sleeping, she was working')
      expect(result.connectors).toContain('while')
      expect(result.hasWhile).toBe(true)
    })

    it('should detect multiple connectors', () => {
      const result = analyzeSentence('As soon as I finish, I will call you')
      expect(result.connectors).toContain('as soon as')
      expect(result.hasAsSoonAs).toBe(true)
    })
  })

  describe('Modal Verbs', () => {
    it('should detect modal continuous forms', () => {
      const result = analyzeSentence('I can be working from home')
      expect(result.modals).toContain('can be working')
    })

    it('should detect multiple modals', () => {
      const result = analyzeSentence('She may be studying and he might be sleeping')
      expect(result.modals).toContain('may be studying')
      expect(result.modals).toContain('might be sleeping')
    })
  })

  describe('Negative Forms', () => {
    it('should detect negative continuous forms', () => {
      const result = analyzeSentence('I am not working today')
      expect(result.negatives).toContain('am not working')
    })

    it('should detect various negative forms', () => {
      const result = analyzeSentence('She was not studying and he is not sleeping')
      expect(result.negatives).toContain('was not studying')
      expect(result.negatives).toContain('is not sleeping')
    })
  })

  describe('Sentence Analysis', () => {
    it('should identify complex sentences', () => {
      const result = analyzeSentence('While I was reading, she was cooking dinner')
      expect(result.sentenceType).toBe('complex')
    })

    it('should identify compound sentences', () => {
      const result = analyzeSentence('I am reading and she is cooking')
      expect(result.sentenceType).toBe('compound')
    })

    it('should detect advanced complexity', () => {
      const result = analyzeSentence('I cannot be working while you are not listening')
      expect(result.complexity).toBe('advanced')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty input', () => {
      const result = analyzeSentence('')
      expect(result.presentContinuous).toHaveLength(0)
      expect(result.connectors).toHaveLength(0)
    })

    it('should handle sentences without continuous tenses', () => {
      const result = analyzeSentence('I eat breakfast every day')
      expect(result.presentContinuous).toHaveLength(0)
      expect(result.pastContinuous).toHaveLength(0)
    })

    it('should handle mixed case and punctuation', () => {
      const result = analyzeSentence('WHILE I am reading, she IS cooking!')
      expect(result.connectors).toContain('while')
      expect(result.presentContinuous).toContain('am reading')
      expect(result.presentContinuous).toContain('is cooking')
    })
  })
})