# 🔍 Continuous Tense Detector

> A professional terminal-style web application for detecting English grammatical tenses with advanced analysis capabilities.

[![Tests](https://img.shields.io/badge/tests-19%20passing-brightgreen)]() 
[![React](https://img.shields.io/badge/React-18.2.0-blue)]()
[![Vite](https://img.shields.io/badge/Vite-4.4.5-purple)]()
[![License](https://img.shields.io/badge/license-MIT-orange)]()

## ✨ Features

### 🎯 Core Functionality
- **Comprehensive Tense Detection**: Detects 10+ different English tense patterns
  - Present Continuous (am/is/are + verb+ing)
  - Past Continuous (was/were + verb+ing)
  - Future Continuous (will be + verb+ing)
  - Present Perfect Continuous (has/have been + verb+ing)
  - Past Perfect Continuous (had been + verb+ing)
  - Simple Past (positive, negative, interrogative)
  - Modal verbs with continuous forms
  - Negative forms and connectors (while/when)

### 🚀 Performance & Quality
- **Smart Caching**: LRU cache system for optimal performance
- **Input Validation**: Multi-layer validation with error handling
- **Performance Monitoring**: Built-in logging and metrics
- **Character Counter**: Real-time feedback with 5000 char limit
- **Error Handling**: Comprehensive try-catch blocks and user feedback

### 🎨 User Experience
- **Terminal Theme**: Professional GitHub Dark color scheme
- **Bilingual Support**: Spanish and English interface
- **Syntax Highlighting**: Color-coded grammatical elements
- **Interactive Examples**: 15+ pre-loaded test sentences
- **Responsive Design**: Mobile-first approach
- **Accessibility**: ARIA labels, keyboard navigation, focus states
- **Smooth Animations**: Staggered fade-in effects
- **Copy to Clipboard**: Export analysis results

### 🔒 Code Quality
- **19 Passing Tests**: Comprehensive test suite with Vitest
- **JSDoc Documentation**: Full API documentation
- **TypeScript-ready**: Clean, typed code structure
- **Error Boundaries**: Graceful error handling
- **Performance Mode**: Production optimizations

## 🛠️ Technologies

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | React | 18.2.0 | UI Components |
| **Build Tool** | Vite | 4.4.5 | Fast HMR & Bundling |
| **Styling** | CSS3 | - | Custom Terminal Theme |
| **Icons** | Lucide React | 0.263.1 | Modern Icon Set |
| **Testing** | Vitest | 1.0.4 | Unit Testing |
| **DOM Testing** | jsdom | 23.0.1 | Test Environment |
| **Fonts** | Fira Code, JetBrains Mono | - | Monospace Typography |

## 🏗️ Project Structure

```
detectarfrasesingles-main/
├── src/
│   ├── components/
│   │   ├── Header.jsx              # App header with title
│   │   ├── InputSection.jsx        # Text input with char counter
│   │   ├── ResultsSection.jsx      # Analysis results display
│   │   ├── ExamplesSection.jsx     # Example sentences
│   │   └── LanguageToggle.jsx      # Language switcher
│   ├── utils/
│   │   ├── tenseDetector.js        # Core detection logic
│   │   ├── tenseDetector.test.js   # Test suite (19 tests)
│   │   └── translations.js         # i18n translations
│   ├── App.jsx                     # Main app component
│   ├── App.css                     # Global styles
│   ├── main.jsx                    # App entry point
│   └── index.css                   # CSS reset
├── public/                         # Static assets
├── index.html                      # HTML template
├── vite.config.js                  # Vite configuration
├── package.json                    # Dependencies
└── README.md                       # Documentation
```

## 🔧 Configuration

### Environment Variables
```env
# Optional: Set log level (debug, info, warn, error)
LOG_LEVEL=warn

# Optional: Disable cache in development
NODE_ENV=development
```

### Vite Config
- **Port**: 3000
- **Auto-open**: Browser opens automatically
- **HMR**: Hot Module Replacement enabled
- **Test**: Vitest with jsdom environment

## 📚 API Documentation

### `analyzeSentence(text: string): Analysis`

Main analysis function with comprehensive tense detection.

**Parameters:**
- `text` (string): The sentence to analyze (max 5000 chars)

**Returns:**
```typescript
{
  originalText: string,
  presentContinuous: string[],
  pastContinuous: string[],
  pastContinuousNegative: string[],
  pastContinuousInterrogative: string[],
  futureContinuous: string[],
  presentPerfectContinuous: string[],
  pastPerfectContinuous: string[],
  simplePastPositive: string[],
  simplePastNegative: string[],
  simplePastInterrogative: string[],
  modals: string[],
  negatives: string[],
  connectors: string[],
  complexity: 'simple' | 'compound' | 'complex'
}
```

**Example:**
```javascript
import { analyzeSentence } from './utils/tenseDetector'

const result = analyzeSentence('I was reading while she cooked')
console.log(result.pastContinuous) // ['was reading']
console.log(result.connectors) // ['while']
```

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/[your-username]/continuous-tense-detector.git

# Navigate to project directory
cd continuous-tense-detector

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser at http://localhost:3000
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests in watch mode
npm test -- --watch
```

## 🏗️ Build & Deploy

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# The build output will be in the `dist/` folder
```

## 🎯 Usage

### Basic Analysis
1. Select your preferred language (Spanish 🇪🇸 / English 🇬🇧)
2. Enter an English sentence in the text area (max 5000 characters)
3. Click "run_analysis()" or press Enter
4. View the syntax-highlighted results
5. Copy results to clipboard with the copy button

### Keyboard Shortcuts
- `Enter`: Analyze text (without Shift)
- `Shift + Enter`: New line in text area
- `Tab`: Navigate through examples
- `Enter/Space`: Activate example (when focused)

### Analysis Output
The detector provides:
- **Detected Tense**: What grammatical tense was found
- **Matched Patterns**: The exact words/phrases detected
- **Sentence Complexity**: Simple, compound, or complex
- **Connectors**: Temporal linking words (while, when)
- **Modals**: Modal verbs in continuous form
- **Negatives**: Negative constructions

## 📝 Examples

```javascript
// Example 1: Past Continuous with Connector
Input: "I was reading while she was cooking dinner"
Output: 
  ✓ Past Continuous: "was reading", "was cooking"
  ✓ Connector: "while"
  ✓ Complexity: Compound

// Example 2: Present Continuous
Input: "When I am studying, I listen to music"
Output:
  ✓ Present Continuous: "am studying"
  ✓ Connector: "when"
  ✓ Complexity: Complex

// Example 3: Mixed Tenses
Input: "She has been working here since 2019"
Output:
  ✓ Present Perfect Continuous: "has been working"
  ✓ Complexity: Simple
```

## 🎨 Theme & Design

### Color Palette
- **Background**: GitHub Dark (#0d1117, #161b22)
- **Primary Text**: Light Gray (#c9d1d9)
- **Accents**: 
  - Blue (#58a6ff) - Interactive elements
  - Green (#238636) - Success states
  - Purple (#7c3aed) - Highlights
  - Orange (#f0883e) - Labels
  - Red (#f85149) - Errors

### Typography
- **Primary**: JetBrains Mono, Fira Code
- **Fallback**: Consolas, Monaco, Courier New
- **Weight**: 300-700 variable

### Effects
- Scanline overlay for retro terminal feel
- Gradient backgrounds with radial overlays
- Smooth transitions (cubic-bezier easing)
- Hover effects with elevation
- Focus states for accessibility

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Getting Started
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Commit with clear messages (`git commit -m 'Add amazing feature'`)
6. Push to your branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Guidelines
- ✅ Write tests for new features
- ✅ Follow existing code style
- ✅ Update documentation
- ✅ Keep commits atomic and descriptive
- ✅ Ensure all tests pass
- ✅ Check for accessibility issues

### Areas for Contribution
- 🌐 Additional language support
- 🎨 New themes (light mode, high contrast)
- 🔍 More tense patterns
- 📱 Mobile UX improvements
- 🧪 Additional test cases
- 📖 Documentation translations

## 🐛 Bug Reports

Found a bug? Please open an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Browser and OS information
- Screenshots if applicable

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License - Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## 🎓 Educational Purpose

This tool was created as an educational project for English grammar learning, specifically focusing on:
- Continuous/Progressive tenses
- Temporal connectors (while, when)
- Sentence complexity analysis
- Modal verbs
- Negative constructions

**Target Audience:**
- English language learners (ESL/EFL)
- Grammar students
- Teachers creating exercises
- Linguists studying tense patterns

## 🙏 Acknowledgments

- **Fonts**: [Google Fonts](https://fonts.google.com/) - Fira Code & JetBrains Mono
- **Icons**: [Lucide Icons](https://lucide.dev/) - Beautiful open-source icons
- **Theme**: Inspired by [GitHub Dark](https://github.com/primer/github-vscode-theme)
- **Testing**: [Vitest](https://vitest.dev/) - Blazing fast unit testing

## 📞 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/[your-username]/continuous-tense-detector/issues)
- **Discussions**: [GitHub Discussions](https://github.com/[your-username]/continuous-tense-detector/discussions)

## 🚀 Roadmap

- [ ] Add more tense patterns (Present Perfect, Past Perfect)
- [ ] Implement voice recognition for input
- [ ] Add export to PDF/Word
- [ ] Create mobile app version
- [ ] Add gamification elements
- [ ] Support for other languages
- [ ] AI-powered suggestions
- [ ] Integration with learning platforms

---

<div align="center">

**Made with ❤️ for English learners worldwide**

⭐ Star this repo if you find it helpful!

</div>