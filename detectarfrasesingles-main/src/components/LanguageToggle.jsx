import React from 'react'
import { Globe, Languages } from 'lucide-react'

const LanguageToggle = ({ currentLanguage, onLanguageChange }) => {
  const languages = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ]

  return (
    <div className="language-toggle">
      <div className="language-toggle-header">
        <Languages size={18} />
        <span>Language</span>
      </div>
      <div className="language-options">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => onLanguageChange(lang.code)}
            className={`language-option ${currentLanguage === lang.code ? 'active' : ''}`}
          >
            <span className="flag">{lang.flag}</span>
            <span className="lang-name">{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default LanguageToggle