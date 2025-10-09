export const translations = {
  es: {
    // Header
    title: "continuous_tense_detector.exe",
    subtitle: "Detecta frases con 'while' y 'when' en presente y pasado continuo",
    
    // Input Section
    inputLabel: "input_sentence",
    inputPlaceholder: "I was reading while she was cooking dinner",
    analyzeButton: "run_analysis()",
    analyzing: "processing...",
    
    // Results
    analysisTitle: "analysis_result",
    presentContinuous: "present_continuous",
    pastContinuous: "past_continuous",
    pastContinuousNegative: "past_continuous_negative",
    pastContinuousInterrogative: "past_continuous_interrogative",
    futureContinuous: "future_continuous",
    presentPerfectContinuous: "present_perfect_continuous",
    pastPerfectContinuous: "past_perfect_continuous",
    simplePastPositive: "simple_past_positive",
    simplePastNegative: "simple_past_negative",
    simplePastInterrogative: "simple_past_interrogative",
    modals: "modal_verbs",
    negatives: "negative_forms",
    connectors: "connectors",
    sentenceType: "sentence_type",
    complexity: "complexity",
    analysisDetails: "analysis_details:",
    copyResults: "Copiar resultados",
    copied: "¡Copiado!",
    
    // Toast messages
    analysisComplete: "✓ Análisis completado",
    errorAnalyzing: "✗ Error al analizar el texto",
    exampleLoaded: "➜ Ejemplo cargado",
    
    // No detection
    noPatterns: "ERROR: No patterns detected",
    noPatternsDesc: "No sentences with 'while' or 'when' in continuous tenses found.",
    suggestions: "Try sentences containing:",
    suggestionsList: [
      "am/is/are + verbo+ing (presente continuo)",
      "was/were + verbo+ing (pasado continuo)",
      "wasn't/weren't + verbo+ing (pasado continuo negativo)",
      "Was/Were + sujeto + verbo+ing? (pasado continuo interrogativo)",
      "will be + verbo+ing (futuro continuo)",
      "have/has been + verbo+ing (presente perfecto continuo)",
      "had been + verbo+ing (pasado perfecto continuo)",
      "verbo + ed/irregulares (pasado simple positivo)",
      "didn't + verbo (pasado simple negativo)",
      "Did + sujeto + verbo? (pasado simple interrogativo)",
      "Conectores: while, when, as soon as, until, before, after, since",
      "Formas negativas: not + verbo+ing",
      "Verbos modales: can/may/will + be + verbo+ing"
    ],
    
    // No input
    writePhrase: "INPUT REQUIRED",
    writePhraseDesc: "Please enter an English sentence to analyze.",
    
    // Examples
    examplesTitle: "test_examples[]",
    exampleTypes: {
      pastContinuous: "Pasado continuo",
      presentContinuous: "Presente continuo",
      futureContinuous: "Futuro continuo",
      presentPerfectContinuous: "Presente perfecto continuo",
      pastPerfectContinuous: "Pasado perfecto continuo",
      pastContinuousNegative: "Pasado continuo negativo",
      pastContinuousInterrogative: "Pasado continuo interrogativo",
      simplePastPositive: "Pasado simple positivo",
      simplePastNegative: "Pasado simple negativo",
      simplePastInterrogative: "Pasado simple interrogativo"
    },
    exampleDescriptions: {
      simultaneous: "Acciones simultáneas en el pasado",
      habitual: "Acción habitual en presente",
      interrupted: "Acción interrumpida en el pasado",
      parallel: "Acciones paralelas en presente"
    },
    
    // Grammar details
    grammarDetails: {
      presentRule: "Presente Continuo: Se forma con am/is/are + verbo+ing",
      pastRule: "Pasado Continuo: Se forma con was/were + verbo+ing",
      pastContinuousNegativeRule: "Pasado Continuo Negativo: Se forma con wasn't/weren't + verbo+ing",
      pastContinuousInterrogativeRule: "Pasado Continuo Interrogativo: Se forma con Was/Were + sujeto + verbo+ing?",
      futureRule: "Futuro Continuo: Se forma con will be + verbo+ing",
      presentPerfectRule: "Presente Perfecto Continuo: Se forma con have/has been + verbo+ing",
      pastPerfectRule: "Pasado Perfecto Continuo: Se forma con had been + verbo+ing",
      simplePastPositiveRule: "Pasado Simple Positivo: Se forma con verbo + ed (regulares) o formas irregulares",
      simplePastNegativeRule: "Pasado Simple Negativo: Se forma con didn't + verbo (forma base)",
      simplePastInterrogativeRule: "Pasado Simple Interrogativo: Se forma con Did + sujeto + verbo (forma base)?",
      whileRule: "\"While\": Se usa para acciones simultáneas o paralelas",
      whenRule: "\"When\": Se usa para indicar el momento en que ocurre una acción",
      asSoonAsRule: "\"As soon as\": Se usa para acciones que ocurren inmediatamente después",
      untilRule: "\"Until\": Se usa para acciones que continúan hasta un punto",
      beforeRule: "\"Before\": Se usa para acciones que ocurren antes de otra",
      afterRule: "\"After\": Se usa para acciones que ocurren después de otra",
      sinceRule: "\"Since\": Se usa para acciones que continúan desde un punto en el pasado",
      modalRule: "Verbos modales continuos: can/may/will + be + verbo+ing",
      negativeRule: "Formas negativas: auxiliar + not + verbo+ing",
      mixWarning: "⚠️ Nota: Mezclar presente y pasado continuo en una frase puede ser incorrecto",
      complexityNote: "Complejidad detectada: Esta oración tiene elementos avanzados de gramática"
    }
  },
  
  en: {
    // Header
    title: "continuous_tense_detector.exe",
    subtitle: "Detect sentences with 'while' and 'when' in present and past continuous",
    
    // Input Section
    inputLabel: "input_sentence",
    inputPlaceholder: "I was reading while she was cooking dinner",
    analyzeButton: "run_analysis()",
    analyzing: "processing...",
    
    // Results
    analysisTitle: "analysis_result",
    presentContinuous: "present_continuous",
    pastContinuous: "past_continuous",
    pastContinuousNegative: "past_continuous_negative",
    pastContinuousInterrogative: "past_continuous_interrogative",
    futureContinuous: "future_continuous",
    presentPerfectContinuous: "present_perfect_continuous",
    pastPerfectContinuous: "past_perfect_continuous",
    simplePastPositive: "simple_past_positive",
    simplePastNegative: "simple_past_negative",
    simplePastInterrogative: "simple_past_interrogative",
    modals: "modal_verbs",
    negatives: "negative_forms",
    connectors: "connectors",
    sentenceType: "sentence_type",
    complexity: "complexity",
    analysisDetails: "analysis_details:",
    copyResults: "Copy results",
    copied: "Copied!",
    
    // Toast messages
    analysisComplete: "✓ Analysis complete",
    errorAnalyzing: "✗ Error analyzing text",
    exampleLoaded: "➜ Example loaded",
    
    // No detection
    noPatterns: "ERROR: No patterns detected",
    noPatternsDesc: "No sentences with 'while' or 'when' in continuous tenses found.",
    suggestions: "Try sentences containing:",
    suggestionsList: [
      "am/is/are + verb+ing (present continuous)",
      "was/were + verb+ing (past continuous)",
      "wasn't/weren't + verb+ing (past continuous negative)",
      "Was/Were + subject + verb+ing? (past continuous interrogative)",
      "will be + verb+ing (future continuous)",
      "have/has been + verb+ing (present perfect continuous)",
      "had been + verb+ing (past perfect continuous)",
      "verb + ed/irregular (simple past positive)",
      "didn't + verb (simple past negative)",
      "Did + subject + verb? (simple past interrogative)",
      "Connectors: while, when, as soon as, until, before, after, since",
      "Negative forms: not + verb+ing",
      "Modal verbs: can/may/will + be + verb+ing"
    ],
    
    // No input
    writePhrase: "INPUT REQUIRED",
    writePhraseDesc: "Please enter an English sentence to analyze.",
    
    // Examples
    examplesTitle: "test_examples[]",
    exampleTypes: {
      pastContinuous: "Past continuous",
      presentContinuous: "Present continuous",
      futureContinuous: "Future continuous",
      presentPerfectContinuous: "Present perfect continuous",
      pastPerfectContinuous: "Past perfect continuous",
      pastContinuousNegative: "Past continuous negative",
      pastContinuousInterrogative: "Past continuous interrogative",
      simplePastPositive: "Simple past positive",
      simplePastNegative: "Simple past negative",
      simplePastInterrogative: "Simple past interrogative"
    },
    exampleDescriptions: {
      simultaneous: "Simultaneous actions in the past",
      habitual: "Habitual action in present",
      interrupted: "Interrupted action in the past",
      parallel: "Parallel actions in present"
    },
    
    // Grammar details
    grammarDetails: {
      presentRule: "Present Continuous: Formed with am/is/are + verb+ing",
      pastRule: "Past Continuous: Formed with was/were + verb+ing",
      pastContinuousNegativeRule: "Past Continuous Negative: Formed with wasn't/weren't + verb+ing",
      pastContinuousInterrogativeRule: "Past Continuous Interrogative: Formed with Was/Were + subject + verb+ing?",
      futureRule: "Future Continuous: Formed with will be + verb+ing",
      presentPerfectRule: "Present Perfect Continuous: Formed with have/has been + verb+ing",
      pastPerfectRule: "Past Perfect Continuous: Formed with had been + verb+ing",
      simplePastPositiveRule: "Simple Past Positive: Formed with verb + ed (regular) or irregular forms",
      simplePastNegativeRule: "Simple Past Negative: Formed with didn't + verb (base form)",
      simplePastInterrogativeRule: "Simple Past Interrogative: Formed with Did + subject + verb (base form)?",
      whileRule: "\"While\": Used for simultaneous or parallel actions",
      whenRule: "\"When\": Used to indicate the moment an action occurs",
      asSoonAsRule: "\"As soon as\": Used for actions that occur immediately after",
      untilRule: "\"Until\": Used for actions that continue until a point",
      beforeRule: "\"Before\": Used for actions that occur before another",
      afterRule: "\"After\": Used for actions that occur after another",
      sinceRule: "\"Since\": Used for actions that continue from a past point",
      modalRule: "Modal continuous verbs: can/may/will + be + verb+ing",
      negativeRule: "Negative forms: auxiliary + not + verb+ing",
      mixWarning: "⚠️ Note: Mixing present and past continuous in one sentence may be incorrect",
      complexityNote: "Complexity detected: This sentence has advanced grammar elements"
    }
  }
}

export const useTranslation = (language) => {
  return translations[language] || translations.es
}