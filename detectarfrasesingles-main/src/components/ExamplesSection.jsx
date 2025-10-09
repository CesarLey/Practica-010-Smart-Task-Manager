import React from 'react'
import { Play, Code } from 'lucide-react'

const ExamplesSection = ({ onExampleClick, t }) => {
  const examples = [
    {
      text: "I was reading while she was cooking dinner",
      type: t.exampleTypes.pastContinuous,
      description: t.exampleDescriptions.simultaneous
    },
    {
      text: "When I am studying, I listen to music",
      type: t.exampleTypes.presentContinuous,
      description: t.exampleDescriptions.habitual
    },
    {
      text: "She was crying when he arrived",
      type: t.exampleTypes.pastContinuous,
      description: t.exampleDescriptions.interrupted
    },
    {
      text: "While we are working, they are playing",
      type: t.exampleTypes.presentContinuous,
      description: t.exampleDescriptions.parallel
    },
    {
      text: "I will be waiting until you finish",
      type: t.exampleTypes.futureContinuous,
      description: "Acción futura continua"
    },
    {
      text: "I wasn't sleeping when you called",
      type: t.exampleTypes.pastContinuousNegative,
      description: "Acción negativa en el pasado continuo"
    },
    {
      text: "Were you working when I arrived?",
      type: t.exampleTypes.pastContinuousInterrogative,
      description: "Pregunta en pasado continuo"
    },
    {
      text: "I ate breakfast yesterday",
      type: t.exampleTypes.simplePastPositive,
      description: "Acción completada en el pasado"
    },
    {
      text: "I didn't go to the party",
      type: t.exampleTypes.simplePastNegative,
      description: "Acción negativa en el pasado simple"
    },
    {
      text: "Did you see the movie?",
      type: t.exampleTypes.simplePastInterrogative,
      description: "Pregunta en pasado simple"
    },
    {
      text: "She has been working here since 2019",
      type: t.exampleTypes.presentPerfectContinuous,
      description: "Acción que comenzó en el pasado y continúa"
    },
    {
      text: "They had been living there before the war",
      type: t.exampleTypes.pastPerfectContinuous,
      description: "Acción que terminó antes de otra en el pasado"
    },
    {
      text: "As soon as I finish, I will be calling you",
      type: "Futuro continuo",
      description: "Acción inmediata seguida de otra"
    },
    {
      text: "I cannot be working while you are talking",
      type: "Modal continuo",
      description: "Verbo modal con forma continua"
    },
    {
      text: "She is not studying because she was not listening",
      type: "Formas negativas",
      description: "Oraciones con negación en continuo"
    }
  ]

  return (
    <div className="examples-section">
      <div className="examples-header">
        <Code size={16} />
        <h3>{t.examplesTitle}</h3>
      </div>
      <div className="examples-grid">
        {examples.map((example, index) => (
          <div 
            key={index}
            className="example-card"
            onClick={() => onExampleClick(example.text)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onExampleClick(example.text)
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`${t.exampleTypes ? 'Example' : 'Ejemplo'}: ${example.text}`}
          >
            <div className="example-header">
              <span className="example-type">{example.type}</span>
              <Play size={12} className="play-icon" aria-hidden="true" />
            </div>
            <p className="example-text">{example.text}</p>
            <p className="example-description">{example.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ExamplesSection