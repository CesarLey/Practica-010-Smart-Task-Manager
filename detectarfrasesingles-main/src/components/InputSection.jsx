import React from 'react'
import { Play, Loader2 } from 'lucide-react'

const InputSection = ({ inputText, onInputChange, onAnalyze, isAnalyzing, t }) => {
  const [charCount, setCharCount] = React.useState(0)
  const maxChars = 5000

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isAnalyzing && inputText.trim()) {
      e.preventDefault()
      onAnalyze()
    }
  }

  const handleChange = (value) => {
    setCharCount(value.length)
    onInputChange(value)
  }

  const isNearLimit = charCount > maxChars * 0.9
  const isOverLimit = charCount > maxChars

  return (
    <div className="input-section">
      <div className="input-header">
        <label htmlFor="textInput" className="input-label">
          {t.inputLabel}
        </label>
        <span className={`char-counter ${isNearLimit ? 'warning' : ''} ${isOverLimit ? 'error' : ''}`}>
          {charCount} / {maxChars}
        </span>
      </div>
      
      <div className="input-container">
        <div className="textarea-wrapper">
          <textarea
            id="textInput"
            value={inputText}
            onChange={(e) => handleChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t.inputPlaceholder}
            className="text-input"
            rows={3}
            maxLength={maxChars}
            aria-label={t.inputLabel}
            aria-describedby="char-count"
          />
        </div>
        
        <button 
          onClick={onAnalyze}
          disabled={isAnalyzing || !inputText.trim() || isOverLimit}
          className={`analyze-btn ${isAnalyzing ? 'analyzing' : ''}`}
          aria-busy={isAnalyzing}
          aria-label={isAnalyzing ? t.analyzing : t.analyzeButton}
        >
          {isAnalyzing ? (
            <>
              <Loader2 size={14} className="spinner" />
              {t.analyzing}
            </>
          ) : (
            <>
              <Play size={14} />
              {t.analyzeButton}
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default InputSection