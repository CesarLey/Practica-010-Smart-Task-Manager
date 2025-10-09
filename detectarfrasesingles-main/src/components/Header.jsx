import React from 'react'
import { Terminal } from 'lucide-react'

const Header = ({ t }) => {
  return (
    <header className="header">
      <div className="header-content">
        <h1>{t.title}<span className="terminal-cursor"></span></h1>
        <p>{t.subtitle}</p>
      </div>
    </header>
  )
}

export default Header