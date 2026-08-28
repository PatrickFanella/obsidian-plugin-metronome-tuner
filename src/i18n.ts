import type { TonePresetId } from "./metronome/types";
import type { TunerErrorCode } from "./tuner/TunerController";

export const SUPPORTED_LOCALES = ["en", "de", "es", "fr", "it", "pt-BR", "nl", "pl", "hr", "zh-CN"] as const;
export type Locale = typeof SUPPORTED_LOCALES[number];
export type LanguagePreference = "auto" | Locale;

export const LANGUAGE_LOCALE_ORDER = ["de", "en", "es", "fr", "hr", "it", "nl", "pl", "pt-BR", "zh-CN"] as const satisfies readonly Locale[];
export const LANGUAGE_NAMES: Record<Locale, string> = {
  de: "Deutsch",
  en: "English",
  es: "Español",
  fr: "Français",
  hr: "Hrvatski",
  it: "Italiano",
  nl: "Nederlands",
  pl: "Polski",
  "pt-BR": "Português (Brasil)",
  "zh-CN": "简体中文",
};

const en = {
  appName: "Tempo & tune",
  toolsAria: "Tempo and tuning tools",
  metronome: "Metronome",
  tuner: "Tuner",
  openView: "Open metronome & tuner",
  commandOpen: "Open",
  commandStart: "Start metronome",
  commandStop: "Stop metronome",
  keepTime: "Keep time",
  bpmAria: "{{bpm}} beats per minute",
  bpmUnit: "BPM",
  beatsInMeasure: "Beats in measure",
  startMetronome: "Start metronome",
  stopMetronome: "Stop metronome",
  tempo: "Tempo",
  decreaseTempo: "Decrease tempo",
  tempoBpm: "Tempo in beats per minute",
  increaseTempo: "Increase tempo",
  tempoSlider: "Tempo slider",
  tapTempo: "Tap tempo",
  meterSound: "Meter & sound",
  timeSignature: "Time signature",
  numerator: "Numerator",
  denominator: "Denominator",
  accentFirstBeat: "Accent first beat",
  clickSound: "Click sound",
  sound: "Sound",
  volume: "Volume",
  previewSound: "Preview sound",
  findPitch: "Find the pitch",
  tunerIntro: "Play one clear note near your microphone.",
  microphone: "Microphone",
  frequency: "Frequency",
  confidence: "Confidence",
  pitchAccuracy: "Pitch accuracy",
  noPitchDetected: "No pitch detected",
  waitingNote: "Waiting for a note",
  a4ReferenceHz: "A4 reference (Hz)",
  beatsMeasure: "{{count}} beats per measure",
  beatsMeasureAccented: "{{count}} beats per measure, first beat accented",
  micOtherView: "Microphone active in another Tempo & Tune view.",
  micRequesting: "Requesting microphone permission…",
  micActive: "Microphone active.",
  micListening: "Listening for a steady note…",
  micOff: "Microphone off. Start listening to tune.",
  micInUse: "Microphone in use",
  micCancel: "Cancel microphone request",
  micStop: "Stop listening",
  micTryAgain: "Try microphone again",
  micUse: "Use microphone",
  noSignal: "No signal",
  tunerInactive: "Tuner inactive",
  noSignalYet: "No signal yet",
  inTune: "In tune",
  centFlatOne: "{{count}} cent flat",
  centFlatFew: "{{count}} cents flat",
  centFlatMany: "{{count}} cents flat",
  centFlatOther: "{{count}} cents flat",
  centSharpOne: "{{count}} cent sharp",
  centSharpFew: "{{count}} cents sharp",
  centSharpMany: "{{count}} cents sharp",
  centSharpOther: "{{count}} cents sharp",
  readingAnnouncement: "{{note}}, {{cents}}",
  frequencyValue: "{{value}} Hz",
  percentValue: "{{value}}%",
  errorMetronome: "Could not start the metronome.",
  errorPreview: "Could not preview the click sound.",
  errorMediaUnavailable: "Microphone access is not available on this device.",
  errorPermission: "Microphone permission was denied. Allow microphone access in your system or Obsidian settings.",
  errorNoDevice: "No microphone was found. Connect an input device and try again.",
  errorBusy: "The microphone is busy or unavailable. Close other audio apps and try again.",
  errorConstraints: "The microphone does not support the requested audio settings.",
  errorAudioContext: "Could not start the audio context.",
  errorAudioStart: "Could not start audio.",
  errorDisconnected: "The microphone disconnected. Reconnect it and try again.",
  errorUnknown: "Could not start the microphone.",
  general: "General",
  language: "Language",
  languageDesc: "Automatic follows Obsidian's language.",
  automaticObsidian: "Automatic (Obsidian)",
  defaults: "Defaults",
  aboutSupport: "About & support",
  defaultTempo: "Default tempo",
  defaultTempoDesc: "Tempo used when Obsidian starts.",
  a4Reference: "A4 reference",
  a4ReferenceDesc: "Concert pitch in hertz.",
  meterNumerator: "Meter numerator",
  meterNumeratorDesc: "Number of beats in each measure.",
  meterDenominator: "Meter denominator",
  meterDenominatorDesc: "Note value represented by each beat.",
  accentFirstBeatDesc: "Emphasize the first beat of each measure.",
  clickVolume: "Click volume",
  clickVolumeDesc: "Set the metronome's startup volume.",
  clickSoundDesc: "Choose the metronome's startup sound.",
  portfolio: "Portfolio",
  portfolioDesc: "Selected work by Patrick Fanella.",
  visitPortfolio: "Visit portfolio",
  subcultDesc: "Music, film, and independent culture projects.",
  visitSubcult: "Visit Subcult",
  githubDesc: "Browse Patrick's open-source work.",
  viewGithub: "View GitHub",
  email: "Email",
  emailDesc: "Questions, feedback, or collaboration.",
  sendEmail: "Send email",
  toneWoodblock: "Woodblock",
  toneMechanical: "Mechanical",
  toneRimshot: "Rimshot",
  toneClaves: "Claves",
  toneCowbell: "Cowbell",
  toneSoftDigital: "Soft digital",
  toneSinePulse: "Sine pulse",
} as const;

export type MessageKey = keyof typeof en;
type Dictionary = { [K in MessageKey]: string };

const de = {
  ...en,
  general: "Allgemein", language: "Sprache", languageDesc: "Automatisch folgt der Sprache von Obsidian.", automaticObsidian: "Automatisch (Obsidian)",
  appName: "Tempo & Stimmung", toolsAria: "Werkzeuge für Tempo und Stimmung", metronome: "Metronom", tuner: "Stimmgerät",
  openView: "Metronom & Stimmgerät öffnen", commandOpen: "Öffnen", commandStart: "Metronom starten", commandStop: "Metronom stoppen",
  keepTime: "Im Takt bleiben", bpmAria: "{{bpm}} Schläge pro Minute", beatsInMeasure: "Schläge im Takt", startMetronome: "Metronom starten", stopMetronome: "Metronom stoppen",
  tempo: "Tempo", decreaseTempo: "Tempo verringern", tempoBpm: "Tempo in Schlägen pro Minute", increaseTempo: "Tempo erhöhen", tempoSlider: "Tempo-Regler", tapTempo: "Tempo tippen",
  meterSound: "Takt & Klang", timeSignature: "Taktart", numerator: "Zähler", denominator: "Nenner", accentFirstBeat: "Ersten Schlag betonen", clickSound: "Klickklang", sound: "Klang", volume: "Lautstärke", previewSound: "Klang anhören",
  findPitch: "Tonhöhe finden", tunerIntro: "Spiele einen klaren Ton nahe am Mikrofon.", microphone: "Mikrofon", frequency: "Frequenz", confidence: "Sicherheit", pitchAccuracy: "Stimmgenauigkeit", noPitchDetected: "Keine Tonhöhe erkannt", waitingNote: "Warte auf einen Ton", a4ReferenceHz: "Kammerton A4 (Hz)",
  beatsMeasure: "{{count}} Schläge pro Takt", beatsMeasureAccented: "{{count}} Schläge pro Takt, erster Schlag betont",
  micOtherView: "Mikrofon ist in einer anderen Tempo-&-Stimmung-Ansicht aktiv.", micRequesting: "Mikrofonberechtigung wird angefragt…", micActive: "Mikrofon aktiv.", micListening: "Warte auf einen gleichmäßigen Ton…", micOff: "Mikrofon aus. Starte es zum Stimmen.", micInUse: "Mikrofon wird verwendet", micCancel: "Mikrofonanfrage abbrechen", micStop: "Zuhören beenden", micTryAgain: "Mikrofon erneut versuchen", micUse: "Mikrofon verwenden",
  noSignal: "Kein Signal", tunerInactive: "Stimmgerät inaktiv", noSignalYet: "Noch kein Signal", inTune: "Stimmt", centFlatOne: "{{count}} Cent zu tief", centFlatOther: "{{count}} Cent zu tief", centSharpOne: "{{count}} Cent zu hoch", centSharpOther: "{{count}} Cent zu hoch", readingAnnouncement: "{{note}}, {{cents}}", frequencyValue: "{{value}} Hz", percentValue: "{{value}} %",
  errorMetronome: "Metronom konnte nicht gestartet werden.", errorPreview: "Klickklang konnte nicht wiedergegeben werden.", errorMediaUnavailable: "Mikrofonzugriff ist auf diesem Gerät nicht verfügbar.", errorPermission: "Mikrofonzugriff wurde verweigert. Erlaube ihn in den System- oder Obsidian-Einstellungen.", errorNoDevice: "Kein Mikrofon gefunden. Schließe ein Eingabegerät an und versuche es erneut.", errorBusy: "Das Mikrofon ist belegt oder nicht verfügbar. Schließe andere Audio-Apps und versuche es erneut.", errorConstraints: "Das Mikrofon unterstützt die angeforderten Audioeinstellungen nicht.", errorAudioContext: "Audiokontext konnte nicht gestartet werden.", errorAudioStart: "Audio konnte nicht gestartet werden.", errorDisconnected: "Das Mikrofon wurde getrennt. Verbinde es erneut und versuche es noch einmal.", errorUnknown: "Mikrofon konnte nicht gestartet werden.",
  defaults: "Standardwerte", aboutSupport: "Info & Support", defaultTempo: "Standardtempo", defaultTempoDesc: "Tempo beim Start von Obsidian.", a4Reference: "Kammerton A4", a4ReferenceDesc: "Kammerton in Hertz.", meterNumerator: "Taktzähler", meterNumeratorDesc: "Anzahl der Schläge pro Takt.", meterDenominator: "Taktnenner", meterDenominatorDesc: "Notenwert eines Schlags.", accentFirstBeatDesc: "Betont den ersten Schlag jedes Takts.", clickVolume: "Klicklautstärke", clickVolumeDesc: "Startlautstärke des Metronoms.", clickSoundDesc: "Startklang des Metronoms.",
  portfolioDesc: "Ausgewählte Arbeiten von Patrick Fanella.", visitPortfolio: "Portfolio besuchen", subcultDesc: "Projekte zu Musik, Film und unabhängiger Kultur.", visitSubcult: "Subcult besuchen", githubDesc: "Patricks Open-Source-Arbeiten ansehen.", viewGithub: "GitHub öffnen", email: "E-Mail", emailDesc: "Fragen, Feedback oder Zusammenarbeit.", sendEmail: "E-Mail senden",
  toneWoodblock: "Holzblock", toneMechanical: "Mechanisch", toneRimshot: "Rimshot", toneClaves: "Claves", toneCowbell: "Kuhglocke", toneSoftDigital: "Sanft digital", toneSinePulse: "Sinusimpuls",
} satisfies Dictionary;

const es = {
  ...en,
  general: "General", language: "Idioma", languageDesc: "El modo automático sigue el idioma de Obsidian.", automaticObsidian: "Automático (Obsidian)",
  appName: "Tempo y afinación", toolsAria: "Herramientas de tempo y afinación", metronome: "Metrónomo", tuner: "Afinador", openView: "Abrir metrónomo y afinador", commandOpen: "Abrir", commandStart: "Iniciar metrónomo", commandStop: "Detener metrónomo", keepTime: "Mantén el ritmo", bpmAria: "{{bpm}} pulsaciones por minuto", beatsInMeasure: "Pulsos del compás", startMetronome: "Iniciar metrónomo", stopMetronome: "Detener metrónomo", tempo: "Tempo", decreaseTempo: "Reducir tempo", tempoBpm: "Tempo en pulsaciones por minuto", increaseTempo: "Aumentar tempo", tempoSlider: "Control de tempo", tapTempo: "Marcar tempo", meterSound: "Compás y sonido", timeSignature: "Compás", numerator: "Numerador", denominator: "Denominador", accentFirstBeat: "Acentuar primer pulso", clickSound: "Sonido del clic", sound: "Sonido", volume: "Volumen", previewSound: "Probar sonido",
  findPitch: "Encuentra la nota", tunerIntro: "Toca una nota clara cerca del micrófono.", microphone: "Micrófono", frequency: "Frecuencia", confidence: "Confianza", pitchAccuracy: "Precisión de afinación", noPitchDetected: "No se detecta ninguna nota", waitingNote: "Esperando una nota", a4ReferenceHz: "Referencia A4 (Hz)", beatsMeasure: "{{count}} pulsos por compás", beatsMeasureAccented: "{{count}} pulsos por compás, primero acentuado", micOtherView: "El micrófono está activo en otra vista de Tempo y afinación.", micRequesting: "Solicitando permiso para el micrófono…", micActive: "Micrófono activo.", micListening: "Esperando una nota estable…", micOff: "Micrófono apagado. Actívalo para afinar.", micInUse: "Micrófono en uso", micCancel: "Cancelar solicitud", micStop: "Dejar de escuchar", micTryAgain: "Reintentar micrófono", micUse: "Usar micrófono", noSignal: "Sin señal", tunerInactive: "Afinador inactivo", noSignalYet: "Aún no hay señal", inTune: "Afinado", centFlatOne: "{{count}} cent bajo", centFlatOther: "{{count}} cents bajo", centSharpOne: "{{count}} cent alto", centSharpOther: "{{count}} cents alto", readingAnnouncement: "{{note}}, {{cents}}", frequencyValue: "{{value}} Hz", percentValue: "{{value}} %",
  errorMetronome: "No se pudo iniciar el metrónomo.", errorPreview: "No se pudo reproducir el clic.", errorMediaUnavailable: "El acceso al micrófono no está disponible en este dispositivo.", errorPermission: "Se denegó el permiso del micrófono. Permítelo en los ajustes del sistema o de Obsidian.", errorNoDevice: "No se encontró ningún micrófono. Conecta uno e inténtalo de nuevo.", errorBusy: "El micrófono está ocupado o no disponible. Cierra otras aplicaciones de audio e inténtalo de nuevo.", errorConstraints: "El micrófono no admite los ajustes de audio solicitados.", errorAudioContext: "No se pudo iniciar el contexto de audio.", errorAudioStart: "No se pudo iniciar el audio.", errorDisconnected: "El micrófono se desconectó. Vuelve a conectarlo e inténtalo de nuevo.", errorUnknown: "No se pudo iniciar el micrófono.",
  defaults: "Valores predeterminados", aboutSupport: "Acerca de y soporte", defaultTempo: "Tempo predeterminado", defaultTempoDesc: "Tempo usado al iniciar Obsidian.", a4Reference: "Referencia A4", a4ReferenceDesc: "Tono de concierto en hercios.", meterNumerator: "Numerador del compás", meterNumeratorDesc: "Número de pulsos por compás.", meterDenominator: "Denominador del compás", meterDenominatorDesc: "Valor de nota de cada pulso.", accentFirstBeatDesc: "Destaca el primer pulso de cada compás.", clickVolume: "Volumen del clic", clickVolumeDesc: "Volumen inicial del metrónomo.", clickSoundDesc: "Sonido inicial del metrónomo.", portfolioDesc: "Trabajos seleccionados de Patrick Fanella.", visitPortfolio: "Visitar portafolio", subcultDesc: "Proyectos de música, cine y cultura independiente.", visitSubcult: "Visitar Subcult", githubDesc: "Explora el trabajo de código abierto de Patrick.", viewGithub: "Ver GitHub", email: "Correo electrónico", emailDesc: "Preguntas, comentarios o colaboración.", sendEmail: "Enviar correo", toneWoodblock: "Bloque de madera", toneMechanical: "Mecánico", toneRimshot: "Golpe de aro", toneClaves: "Claves", toneCowbell: "Cencerro", toneSoftDigital: "Digital suave", toneSinePulse: "Pulso sinusoidal",
} satisfies Dictionary;

const fr = {
  ...en,
  general: "Général", language: "Langue", languageDesc: "Le mode automatique suit la langue d’Obsidian.", automaticObsidian: "Automatique (Obsidian)",
  appName: "Tempo et accordage", toolsAria: "Outils de tempo et d’accordage", metronome: "Métronome", tuner: "Accordeur", openView: "Ouvrir le métronome et l’accordeur", commandOpen: "Ouvrir", commandStart: "Démarrer le métronome", commandStop: "Arrêter le métronome", keepTime: "Gardez le rythme", bpmAria: "{{bpm}} battements par minute", beatsInMeasure: "Temps dans la mesure", startMetronome: "Démarrer le métronome", stopMetronome: "Arrêter le métronome", tempo: "Tempo", decreaseTempo: "Réduire le tempo", tempoBpm: "Tempo en battements par minute", increaseTempo: "Augmenter le tempo", tempoSlider: "Curseur de tempo", tapTempo: "Battre le tempo", meterSound: "Mesure et son", timeSignature: "Signature rythmique", numerator: "Numérateur", denominator: "Dénominateur", accentFirstBeat: "Accentuer le premier temps", clickSound: "Son du clic", sound: "Son", volume: "Volume", previewSound: "Écouter le son", findPitch: "Trouvez la hauteur", tunerIntro: "Jouez une note claire près du microphone.", microphone: "Microphone", frequency: "Fréquence", confidence: "Fiabilité", pitchAccuracy: "Précision de l’accordage", noPitchDetected: "Aucune hauteur détectée", waitingNote: "En attente d’une note", a4ReferenceHz: "Référence A4 (Hz)", beatsMeasure: "{{count}} temps par mesure", beatsMeasureAccented: "{{count}} temps par mesure, premier temps accentué", micOtherView: "Le microphone est actif dans une autre vue Tempo et accordage.", micRequesting: "Demande d’accès au microphone…", micActive: "Microphone actif.", micListening: "En attente d’une note stable…", micOff: "Microphone éteint. Activez-le pour accorder.", micInUse: "Microphone utilisé", micCancel: "Annuler la demande", micStop: "Arrêter l’écoute", micTryAgain: "Réessayer le microphone", micUse: "Utiliser le microphone", noSignal: "Aucun signal", tunerInactive: "Accordeur inactif", noSignalYet: "Pas encore de signal", inTune: "Juste", centFlatOne: "{{count}} cent trop bas", centFlatOther: "{{count}} cents trop bas", centSharpOne: "{{count}} cent trop haut", centSharpOther: "{{count}} cents trop haut", readingAnnouncement: "{{note}}, {{cents}}", frequencyValue: "{{value}} Hz", percentValue: "{{value}} %",
  errorMetronome: "Impossible de démarrer le métronome.", errorPreview: "Impossible de lire le son du clic.", errorMediaUnavailable: "L’accès au microphone n’est pas disponible sur cet appareil.", errorPermission: "L’accès au microphone a été refusé. Autorisez-le dans les réglages du système ou d’Obsidian.", errorNoDevice: "Aucun microphone trouvé. Connectez-en un et réessayez.", errorBusy: "Le microphone est occupé ou indisponible. Fermez les autres applications audio et réessayez.", errorConstraints: "Le microphone ne prend pas en charge les réglages audio demandés.", errorAudioContext: "Impossible de démarrer le contexte audio.", errorAudioStart: "Impossible de démarrer l’audio.", errorDisconnected: "Le microphone a été déconnecté. Reconnectez-le et réessayez.", errorUnknown: "Impossible de démarrer le microphone.", defaults: "Valeurs par défaut", aboutSupport: "À propos et assistance", defaultTempo: "Tempo par défaut", defaultTempoDesc: "Tempo utilisé au démarrage d’Obsidian.", a4Reference: "Référence A4", a4ReferenceDesc: "Diapason en hertz.", meterNumerator: "Numérateur de mesure", meterNumeratorDesc: "Nombre de temps par mesure.", meterDenominator: "Dénominateur de mesure", meterDenominatorDesc: "Valeur de note de chaque temps.", accentFirstBeatDesc: "Accentue le premier temps de chaque mesure.", clickVolume: "Volume du clic", clickVolumeDesc: "Volume initial du métronome.", clickSoundDesc: "Son initial du métronome.", portfolioDesc: "Sélection de travaux de Patrick Fanella.", visitPortfolio: "Voir le portfolio", subcultDesc: "Projets de musique, cinéma et culture indépendante.", visitSubcult: "Visiter Subcult", githubDesc: "Parcourir les projets libres de Patrick.", viewGithub: "Voir GitHub", email: "E-mail", emailDesc: "Questions, commentaires ou collaboration.", sendEmail: "Envoyer un e-mail", toneWoodblock: "Bloc de bois", toneMechanical: "Mécanique", toneRimshot: "Rimshot", toneClaves: "Claves", toneCowbell: "Cloche", toneSoftDigital: "Numérique doux", toneSinePulse: "Impulsion sinusoïdale",
} satisfies Dictionary;

const it = {
  ...en,
  general: "Generale", language: "Lingua", languageDesc: "La modalità automatica segue la lingua di Obsidian.", automaticObsidian: "Automatico (Obsidian)",
  appName: "Tempo e accordatura", toolsAria: "Strumenti per tempo e accordatura", metronome: "Metronomo", tuner: "Accordatore", openView: "Apri metronomo e accordatore", commandOpen: "Apri", commandStart: "Avvia metronomo", commandStop: "Ferma metronomo", keepTime: "Tieni il tempo", bpmAria: "{{bpm}} battiti al minuto", beatsInMeasure: "Battiti nella misura", startMetronome: "Avvia metronomo", stopMetronome: "Ferma metronomo", tempo: "Tempo", decreaseTempo: "Diminuisci tempo", tempoBpm: "Tempo in battiti al minuto", increaseTempo: "Aumenta tempo", tempoSlider: "Cursore del tempo", tapTempo: "Batti il tempo", meterSound: "Metro e suono", timeSignature: "Indicazione di tempo", numerator: "Numeratore", denominator: "Denominatore", accentFirstBeat: "Accentua il primo battito", clickSound: "Suono del clic", sound: "Suono", volume: "Volume", previewSound: "Ascolta il suono", findPitch: "Trova l’intonazione", tunerIntro: "Suona una nota chiara vicino al microfono.", microphone: "Microfono", frequency: "Frequenza", confidence: "Affidabilità", pitchAccuracy: "Precisione dell’intonazione", noPitchDetected: "Nessuna nota rilevata", waitingNote: "In attesa di una nota", a4ReferenceHz: "Riferimento A4 (Hz)", beatsMeasure: "{{count}} battiti per misura", beatsMeasureAccented: "{{count}} battiti per misura, primo accentato", micOtherView: "Il microfono è attivo in un’altra vista Tempo e accordatura.", micRequesting: "Richiesta di accesso al microfono…", micActive: "Microfono attivo.", micListening: "In ascolto di una nota stabile…", micOff: "Microfono spento. Attivalo per accordare.", micInUse: "Microfono in uso", micCancel: "Annulla richiesta", micStop: "Interrompi ascolto", micTryAgain: "Riprova microfono", micUse: "Usa microfono", noSignal: "Nessun segnale", tunerInactive: "Accordatore inattivo", noSignalYet: "Ancora nessun segnale", inTune: "Accordato", centFlatOne: "{{count}} cent calante", centFlatOther: "{{count}} cent calanti", centSharpOne: "{{count}} cent crescente", centSharpOther: "{{count}} cent crescenti", readingAnnouncement: "{{note}}, {{cents}}", frequencyValue: "{{value}} Hz", percentValue: "{{value}}%",
  errorMetronome: "Impossibile avviare il metronomo.", errorPreview: "Impossibile riprodurre il clic.", errorMediaUnavailable: "L’accesso al microfono non è disponibile su questo dispositivo.", errorPermission: "Accesso al microfono negato. Abilitalo nelle impostazioni di sistema o di Obsidian.", errorNoDevice: "Nessun microfono trovato. Collegane uno e riprova.", errorBusy: "Il microfono è occupato o non disponibile. Chiudi le altre app audio e riprova.", errorConstraints: "Il microfono non supporta le impostazioni audio richieste.", errorAudioContext: "Impossibile avviare il contesto audio.", errorAudioStart: "Impossibile avviare l’audio.", errorDisconnected: "Il microfono è stato scollegato. Ricollegalo e riprova.", errorUnknown: "Impossibile avviare il microfono.", defaults: "Valori predefiniti", aboutSupport: "Informazioni e supporto", defaultTempo: "Tempo predefinito", defaultTempoDesc: "Tempo usato all’avvio di Obsidian.", a4Reference: "Riferimento A4", a4ReferenceDesc: "Diapason in hertz.", meterNumerator: "Numeratore del metro", meterNumeratorDesc: "Numero di battiti per misura.", meterDenominator: "Denominatore del metro", meterDenominatorDesc: "Valore della nota di ogni battito.", accentFirstBeatDesc: "Enfatizza il primo battito di ogni misura.", clickVolume: "Volume del clic", clickVolumeDesc: "Volume iniziale del metronomo.", clickSoundDesc: "Suono iniziale del metronomo.", portfolioDesc: "Lavori selezionati di Patrick Fanella.", visitPortfolio: "Visita il portfolio", subcultDesc: "Progetti di musica, cinema e cultura indipendente.", visitSubcult: "Visita Subcult", githubDesc: "Esplora i progetti open source di Patrick.", viewGithub: "Vedi GitHub", emailDesc: "Domande, commenti o collaborazioni.", sendEmail: "Invia e-mail", toneWoodblock: "Blocco di legno", toneMechanical: "Meccanico", toneRimshot: "Rimshot", toneClaves: "Claves", toneCowbell: "Campanaccio", toneSoftDigital: "Digitale morbido", toneSinePulse: "Impulso sinusoidale",
} satisfies Dictionary;

const ptBR = {
  ...en,
  general: "Geral", language: "Idioma", languageDesc: "O modo automático segue o idioma do Obsidian.", automaticObsidian: "Automático (Obsidian)",
  appName: "Tempo e afinação", toolsAria: "Ferramentas de tempo e afinação", metronome: "Metrônomo", tuner: "Afinador", openView: "Abrir metrônomo e afinador", commandOpen: "Abrir", commandStart: "Iniciar metrônomo", commandStop: "Parar metrônomo", keepTime: "Mantenha o ritmo", bpmAria: "{{bpm}} batidas por minuto", beatsInMeasure: "Batidas no compasso", startMetronome: "Iniciar metrônomo", stopMetronome: "Parar metrônomo", tempo: "Andamento", decreaseTempo: "Diminuir andamento", tempoBpm: "Andamento em batidas por minuto", increaseTempo: "Aumentar andamento", tempoSlider: "Controle de andamento", tapTempo: "Marcar andamento", meterSound: "Compasso e som", timeSignature: "Fórmula de compasso", numerator: "Numerador", denominator: "Denominador", accentFirstBeat: "Acentuar primeira batida", clickSound: "Som do clique", sound: "Som", volume: "Volume", previewSound: "Ouvir som", findPitch: "Encontre a afinação", tunerIntro: "Toque uma nota clara perto do microfone.", microphone: "Microfone", frequency: "Frequência", confidence: "Confiança", pitchAccuracy: "Precisão da afinação", noPitchDetected: "Nenhuma nota detectada", waitingNote: "Aguardando uma nota", a4ReferenceHz: "Referência A4 (Hz)", beatsMeasure: "{{count}} batidas por compasso", beatsMeasureAccented: "{{count}} batidas por compasso, primeira acentuada", micOtherView: "O microfone está ativo em outra visualização de Tempo e afinação.", micRequesting: "Solicitando permissão para o microfone…", micActive: "Microfone ativo.", micListening: "Aguardando uma nota estável…", micOff: "Microfone desligado. Ative para afinar.", micInUse: "Microfone em uso", micCancel: "Cancelar solicitação", micStop: "Parar de ouvir", micTryAgain: "Tentar microfone novamente", micUse: "Usar microfone", noSignal: "Sem sinal", tunerInactive: "Afinador inativo", noSignalYet: "Ainda sem sinal", inTune: "Afinado", centFlatOne: "{{count}} cent abaixo", centFlatOther: "{{count}} cents abaixo", centSharpOne: "{{count}} cent acima", centSharpOther: "{{count}} cents acima", readingAnnouncement: "{{note}}, {{cents}}", frequencyValue: "{{value}} Hz", percentValue: "{{value}}%",
  errorMetronome: "Não foi possível iniciar o metrônomo.", errorPreview: "Não foi possível reproduzir o clique.", errorMediaUnavailable: "O acesso ao microfone não está disponível neste dispositivo.", errorPermission: "A permissão do microfone foi negada. Permita o acesso nas configurações do sistema ou do Obsidian.", errorNoDevice: "Nenhum microfone encontrado. Conecte um dispositivo e tente novamente.", errorBusy: "O microfone está ocupado ou indisponível. Feche outros aplicativos de áudio e tente novamente.", errorConstraints: "O microfone não aceita as configurações de áudio solicitadas.", errorAudioContext: "Não foi possível iniciar o contexto de áudio.", errorAudioStart: "Não foi possível iniciar o áudio.", errorDisconnected: "O microfone foi desconectado. Reconecte-o e tente novamente.", errorUnknown: "Não foi possível iniciar o microfone.", defaults: "Padrões", aboutSupport: "Sobre e suporte", defaultTempo: "Andamento padrão", defaultTempoDesc: "Andamento usado ao iniciar o Obsidian.", a4Reference: "Referência A4", a4ReferenceDesc: "Diapasão em hertz.", meterNumerator: "Numerador do compasso", meterNumeratorDesc: "Número de batidas em cada compasso.", meterDenominator: "Denominador do compasso", meterDenominatorDesc: "Valor da nota de cada batida.", accentFirstBeatDesc: "Destaca a primeira batida de cada compasso.", clickVolume: "Volume do clique", clickVolumeDesc: "Volume inicial do metrônomo.", clickSoundDesc: "Som inicial do metrônomo.", portfolioDesc: "Trabalhos selecionados de Patrick Fanella.", visitPortfolio: "Visitar portfólio", subcultDesc: "Projetos de música, cinema e cultura independente.", visitSubcult: "Visitar Subcult", githubDesc: "Veja os projetos de código aberto de Patrick.", viewGithub: "Ver GitHub", email: "E-mail", emailDesc: "Dúvidas, comentários ou colaboração.", sendEmail: "Enviar e-mail", toneWoodblock: "Bloco de madeira", toneMechanical: "Mecânico", toneRimshot: "Rimshot", toneClaves: "Claves", toneCowbell: "Agogô", toneSoftDigital: "Digital suave", toneSinePulse: "Pulso senoidal",
} satisfies Dictionary;

const nl = {
  ...en,
  general: "Algemeen", language: "Taal", languageDesc: "Automatisch volgt de taal van Obsidian.", automaticObsidian: "Automatisch (Obsidian)",
  appName: "Tempo en stemming", toolsAria: "Hulpmiddelen voor tempo en stemming", metronome: "Metronoom", tuner: "Stemapparaat", openView: "Metronoom en stemapparaat openen", commandOpen: "Openen", commandStart: "Metronoom starten", commandStop: "Metronoom stoppen", keepTime: "Houd de maat", bpmAria: "{{bpm}} slagen per minuut", beatsInMeasure: "Slagen in de maat", startMetronome: "Metronoom starten", stopMetronome: "Metronoom stoppen", tempo: "Tempo", decreaseTempo: "Tempo verlagen", tempoBpm: "Tempo in slagen per minuut", increaseTempo: "Tempo verhogen", tempoSlider: "Temposchuif", tapTempo: "Tempo tikken", meterSound: "Maat en geluid", timeSignature: "Maatsoort", numerator: "Teller", denominator: "Noemer", accentFirstBeat: "Eerste tel benadrukken", clickSound: "Klikgeluid", sound: "Geluid", volume: "Volume", previewSound: "Geluid beluisteren", findPitch: "Vind de toonhoogte", tunerIntro: "Speel één heldere noot bij de microfoon.", microphone: "Microfoon", frequency: "Frequentie", confidence: "Zekerheid", pitchAccuracy: "Zuiverheid", noPitchDetected: "Geen toonhoogte gedetecteerd", waitingNote: "Wachten op een noot", a4ReferenceHz: "A4-referentie (Hz)", beatsMeasure: "{{count}} slagen per maat", beatsMeasureAccented: "{{count}} slagen per maat, eerste slag benadrukt", micOtherView: "Microfoon is actief in een andere Tempo en stemming-weergave.", micRequesting: "Microfoontoestemming aanvragen…", micActive: "Microfoon actief.", micListening: "Luisteren naar een stabiele noot…", micOff: "Microfoon uit. Start om te stemmen.", micInUse: "Microfoon in gebruik", micCancel: "Microfoonaanvraag annuleren", micStop: "Stoppen met luisteren", micTryAgain: "Microfoon opnieuw proberen", micUse: "Microfoon gebruiken", noSignal: "Geen signaal", tunerInactive: "Stemapparaat inactief", noSignalYet: "Nog geen signaal", inTune: "Zuiver", centFlatOne: "{{count}} cent te laag", centFlatOther: "{{count}} cent te laag", centSharpOne: "{{count}} cent te hoog", centSharpOther: "{{count}} cent te hoog", readingAnnouncement: "{{note}}, {{cents}}", frequencyValue: "{{value}} Hz", percentValue: "{{value}}%",
  errorMetronome: "De metronoom kon niet worden gestart.", errorPreview: "Het klikgeluid kon niet worden afgespeeld.", errorMediaUnavailable: "Microfoontoegang is niet beschikbaar op dit apparaat.", errorPermission: "Microfoontoegang is geweigerd. Sta deze toe in de systeem- of Obsidian-instellingen.", errorNoDevice: "Geen microfoon gevonden. Sluit er een aan en probeer opnieuw.", errorBusy: "De microfoon is bezet of niet beschikbaar. Sluit andere audio-apps en probeer opnieuw.", errorConstraints: "De microfoon ondersteunt de gevraagde audio-instellingen niet.", errorAudioContext: "De audiocontext kon niet worden gestart.", errorAudioStart: "Audio kon niet worden gestart.", errorDisconnected: "De microfoon is losgekoppeld. Sluit hem opnieuw aan en probeer het nogmaals.", errorUnknown: "De microfoon kon niet worden gestart.", defaults: "Standaardwaarden", aboutSupport: "Over en ondersteuning", defaultTempo: "Standaardtempo", defaultTempoDesc: "Tempo bij het starten van Obsidian.", a4Reference: "A4-referentie", a4ReferenceDesc: "Concerttoonhoogte in hertz.", meterNumerator: "Maatteller", meterNumeratorDesc: "Aantal slagen in elke maat.", meterDenominator: "Maatnoemer", meterDenominatorDesc: "Nootwaarde van elke slag.", accentFirstBeatDesc: "Benadruk de eerste slag van elke maat.", clickVolume: "Klikvolume", clickVolumeDesc: "Startvolume van de metronoom.", clickSoundDesc: "Startgeluid van de metronoom.", portfolioDesc: "Geselecteerd werk van Patrick Fanella.", visitPortfolio: "Portfolio bezoeken", subcultDesc: "Projecten rond muziek, film en onafhankelijke cultuur.", visitSubcult: "Subcult bezoeken", githubDesc: "Bekijk Patricks opensourcewerk.", viewGithub: "GitHub bekijken", email: "E-mail", emailDesc: "Vragen, feedback of samenwerking.", sendEmail: "E-mail sturen", toneWoodblock: "Houtblok", toneMechanical: "Mechanisch", toneRimshot: "Rimshot", toneClaves: "Claves", toneCowbell: "Koebel", toneSoftDigital: "Zacht digitaal", toneSinePulse: "Sinuspuls",
} satisfies Dictionary;

const pl = {
  ...en,
  general: "Ogólne", language: "Język", languageDesc: "Tryb automatyczny używa języka Obsidian.", automaticObsidian: "Automatycznie (Obsidian)",
  appName: "Tempo i strojenie", toolsAria: "Narzędzia tempa i strojenia", metronome: "Metronom", tuner: "Stroik", openView: "Otwórz metronom i stroik", commandOpen: "Otwórz", commandStart: "Uruchom metronom", commandStop: "Zatrzymaj metronom", keepTime: "Trzymaj rytm", bpmAria: "{{bpm}} uderzeń na minutę", beatsInMeasure: "Uderzenia w takcie", startMetronome: "Uruchom metronom", stopMetronome: "Zatrzymaj metronom", tempo: "Tempo", decreaseTempo: "Zmniejsz tempo", tempoBpm: "Tempo w uderzeniach na minutę", increaseTempo: "Zwiększ tempo", tempoSlider: "Suwak tempa", tapTempo: "Wystukaj tempo", meterSound: "Metrum i dźwięk", timeSignature: "Metrum", numerator: "Licznik", denominator: "Mianownik", accentFirstBeat: "Akcentuj pierwszą miarę", clickSound: "Dźwięk kliknięcia", sound: "Dźwięk", volume: "Głośność", previewSound: "Odsłuchaj dźwięk", findPitch: "Znajdź wysokość", tunerIntro: "Zagraj wyraźny dźwięk blisko mikrofonu.", microphone: "Mikrofon", frequency: "Częstotliwość", confidence: "Pewność", pitchAccuracy: "Dokładność strojenia", noPitchDetected: "Nie wykryto wysokości", waitingNote: "Oczekiwanie na dźwięk", a4ReferenceHz: "Wzorzec A4 (Hz)", beatsMeasure: "{{count}} uderzeń w takcie", beatsMeasureAccented: "{{count}} uderzeń w takcie, pierwsze akcentowane", micOtherView: "Mikrofon jest aktywny w innym widoku Tempo i strojenie.", micRequesting: "Prośba o dostęp do mikrofonu…", micActive: "Mikrofon aktywny.", micListening: "Nasłuchiwanie stałego dźwięku…", micOff: "Mikrofon wyłączony. Włącz go, aby stroić.", micInUse: "Mikrofon w użyciu", micCancel: "Anuluj prośbę", micStop: "Przestań słuchać", micTryAgain: "Spróbuj ponownie", micUse: "Użyj mikrofonu", noSignal: "Brak sygnału", tunerInactive: "Stroik nieaktywny", noSignalYet: "Jeszcze brak sygnału", inTune: "Nastrojone", centFlatOne: "{{count}} cent za nisko", centFlatOther: "{{count}} centów za nisko", centSharpOne: "{{count}} cent za wysoko", centSharpOther: "{{count}} centów za wysoko", readingAnnouncement: "{{note}}, {{cents}}", frequencyValue: "{{value}} Hz", percentValue: "{{value}}%",
  errorMetronome: "Nie udało się uruchomić metronomu.", errorPreview: "Nie udało się odtworzyć kliknięcia.", errorMediaUnavailable: "Dostęp do mikrofonu jest niedostępny na tym urządzeniu.", errorPermission: "Odmówiono dostępu do mikrofonu. Zezwól na niego w ustawieniach systemu lub Obsidian.", errorNoDevice: "Nie znaleziono mikrofonu. Podłącz urządzenie i spróbuj ponownie.", errorBusy: "Mikrofon jest zajęty lub niedostępny. Zamknij inne aplikacje audio i spróbuj ponownie.", errorConstraints: "Mikrofon nie obsługuje żądanych ustawień audio.", errorAudioContext: "Nie udało się uruchomić kontekstu audio.", errorAudioStart: "Nie udało się uruchomić dźwięku.", errorDisconnected: "Mikrofon został odłączony. Podłącz go i spróbuj ponownie.", errorUnknown: "Nie udało się uruchomić mikrofonu.", defaults: "Domyślne", aboutSupport: "Informacje i wsparcie", defaultTempo: "Domyślne tempo", defaultTempoDesc: "Tempo używane przy starcie Obsidian.", a4Reference: "Wzorzec A4", a4ReferenceDesc: "Strój koncertowy w hercach.", meterNumerator: "Licznik metrum", meterNumeratorDesc: "Liczba uderzeń w takcie.", meterDenominator: "Mianownik metrum", meterDenominatorDesc: "Wartość nuty każdego uderzenia.", accentFirstBeatDesc: "Podkreśl pierwsze uderzenie każdego taktu.", clickVolume: "Głośność kliknięcia", clickVolumeDesc: "Początkowa głośność metronomu.", clickSoundDesc: "Początkowy dźwięk metronomu.", portfolioDesc: "Wybrane prace Patricka Fanelli.", visitPortfolio: "Odwiedź portfolio", subcultDesc: "Projekty muzyczne, filmowe i kultury niezależnej.", visitSubcult: "Odwiedź Subcult", githubDesc: "Zobacz projekty open source Patricka.", viewGithub: "Zobacz GitHub", email: "E-mail", emailDesc: "Pytania, opinie lub współpraca.", sendEmail: "Wyślij e-mail", toneWoodblock: "Drewniany klocek", toneMechanical: "Mechaniczny", toneRimshot: "Rimshot", toneClaves: "Klawesy", toneCowbell: "Krowi dzwonek", toneSoftDigital: "Łagodny cyfrowy", toneSinePulse: "Impuls sinusoidalny",
} satisfies Dictionary;

const hr = {
  ...en,
  general: "Općenito", language: "Jezik", languageDesc: "Automatski način prati jezik Obsidiana.", automaticObsidian: "Automatski (Obsidian)",
  appName: "Tempo i ugađanje", toolsAria: "Alati za tempo i ugađanje", metronome: "Metronom", tuner: "Ugađalo", openView: "Otvori metronom i ugađalo", commandOpen: "Otvori", commandStart: "Pokreni metronom", commandStop: "Zaustavi metronom", keepTime: "Držite ritam", bpmAria: "{{bpm}} otkucaja u minuti", beatsInMeasure: "Otkucaji u taktu", startMetronome: "Pokreni metronom", stopMetronome: "Zaustavi metronom", tempo: "Tempo", decreaseTempo: "Smanji tempo", tempoBpm: "Tempo u otkucajima u minuti", increaseTempo: "Povećaj tempo", tempoSlider: "Klizač tempa", tapTempo: "Istapkaj tempo", meterSound: "Mjera i zvuk", timeSignature: "Mjera", numerator: "Brojnik", denominator: "Nazivnik", accentFirstBeat: "Naglasite prvi otkucaj", clickSound: "Zvuk klika", sound: "Zvuk", volume: "Glasnoća", previewSound: "Poslušaj zvuk", findPitch: "Pronađite visinu tona", tunerIntro: "Odsvirajte jasan ton blizu mikrofona.", microphone: "Mikrofon", frequency: "Frekvencija", confidence: "Pouzdanost", pitchAccuracy: "Točnost ugađanja", noPitchDetected: "Visina tona nije prepoznata", waitingNote: "Čekanje tona", a4ReferenceHz: "Referenca A4 (Hz)", beatsMeasure: "{{count}} otkucaja po taktu", beatsMeasureAccented: "{{count}} otkucaja po taktu, prvi naglašen", micOtherView: "Mikrofon je aktivan u drugom prikazu Tempo i ugađanje.", micRequesting: "Traženje dopuštenja za mikrofon…", micActive: "Mikrofon je aktivan.", micListening: "Slušanje stabilnog tona…", micOff: "Mikrofon je isključen. Uključite ga za ugađanje.", micInUse: "Mikrofon se koristi", micCancel: "Otkaži zahtjev", micStop: "Prestani slušati", micTryAgain: "Pokušaj ponovno", micUse: "Koristi mikrofon", noSignal: "Nema signala", tunerInactive: "Ugađalo nije aktivno", noSignalYet: "Još nema signala", inTune: "Ugođeno", centFlatOne: "{{count}} cent prenisko", centFlatOther: "{{count}} centi prenisko", centSharpOne: "{{count}} cent previsoko", centSharpOther: "{{count}} centi previsoko", readingAnnouncement: "{{note}}, {{cents}}", frequencyValue: "{{value}} Hz", percentValue: "{{value}} %",
  errorMetronome: "Metronom se nije mogao pokrenuti.", errorPreview: "Zvuk klika nije se mogao reproducirati.", errorMediaUnavailable: "Pristup mikrofonu nije dostupan na ovom uređaju.", errorPermission: "Dopuštenje za mikrofon je odbijeno. Omogućite ga u postavkama sustava ili Obsidiana.", errorNoDevice: "Mikrofon nije pronađen. Spojite ga i pokušajte ponovno.", errorBusy: "Mikrofon je zauzet ili nedostupan. Zatvorite druge audio aplikacije i pokušajte ponovno.", errorConstraints: "Mikrofon ne podržava tražene postavke zvuka.", errorAudioContext: "Audio kontekst nije se mogao pokrenuti.", errorAudioStart: "Zvuk se nije mogao pokrenuti.", errorDisconnected: "Mikrofon je odspojen. Ponovno ga spojite i pokušajte.", errorUnknown: "Mikrofon se nije mogao pokrenuti.", defaults: "Zadane vrijednosti", aboutSupport: "O dodatku i podrška", defaultTempo: "Zadani tempo", defaultTempoDesc: "Tempo pri pokretanju Obsidiana.", a4Reference: "Referenca A4", a4ReferenceDesc: "Koncertna visina u hercima.", meterNumerator: "Brojnik mjere", meterNumeratorDesc: "Broj otkucaja u svakom taktu.", meterDenominator: "Nazivnik mjere", meterDenominatorDesc: "Notna vrijednost svakog otkucaja.", accentFirstBeatDesc: "Naglasite prvi otkucaj svakog takta.", clickVolume: "Glasnoća klika", clickVolumeDesc: "Početna glasnoća metronoma.", clickSoundDesc: "Početni zvuk metronoma.", portfolioDesc: "Odabrani radovi Patricka Fanelle.", visitPortfolio: "Posjeti portfolio", subcultDesc: "Projekti glazbe, filma i nezavisne kulture.", visitSubcult: "Posjeti Subcult", githubDesc: "Pregledajte Patrickove projekte otvorenog koda.", viewGithub: "Otvori GitHub", email: "E-pošta", emailDesc: "Pitanja, povratne informacije ili suradnja.", sendEmail: "Pošalji e-poštu", toneWoodblock: "Drveni blok", toneMechanical: "Mehanički", toneRimshot: "Rimshot", toneClaves: "Klave", toneCowbell: "Kravlje zvono", toneSoftDigital: "Blagi digitalni", toneSinePulse: "Sinusni impuls",
} satisfies Dictionary;

const zhCN = {
  ...en,
  general: "常规", language: "语言", languageDesc: "自动模式跟随 Obsidian 的语言。", automaticObsidian: "自动（Obsidian）",
  appName: "节拍与调音", toolsAria: "节拍器和调音工具", metronome: "节拍器", tuner: "调音器", openView: "打开节拍器和调音器", commandOpen: "打开", commandStart: "启动节拍器", commandStop: "停止节拍器", keepTime: "保持节拍", bpmAria: "每分钟 {{bpm}} 拍", bpmUnit: "BPM", beatsInMeasure: "小节拍数", startMetronome: "启动节拍器", stopMetronome: "停止节拍器", tempo: "速度", decreaseTempo: "降低速度", tempoBpm: "每分钟拍数", increaseTempo: "提高速度", tempoSlider: "速度滑块", tapTempo: "点击测速", meterSound: "拍号与音色", timeSignature: "拍号", numerator: "分子", denominator: "分母", accentFirstBeat: "重音第一拍", clickSound: "节拍音色", sound: "音色", volume: "音量", previewSound: "试听音色", findPitch: "检测音高", tunerIntro: "请在麦克风附近清晰地演奏一个音。", microphone: "麦克风", frequency: "频率", confidence: "置信度", pitchAccuracy: "音准", noPitchDetected: "未检测到音高", waitingNote: "等待音符", a4ReferenceHz: "A4 基准（Hz）", beatsMeasure: "每小节 {{count}} 拍", beatsMeasureAccented: "每小节 {{count}} 拍，第一拍重音", micOtherView: "麦克风已在另一个“节拍与调音”视图中启用。", micRequesting: "正在请求麦克风权限…", micActive: "麦克风已启用。", micListening: "正在等待稳定的音符…", micOff: "麦克风已关闭。请启动以进行调音。", micInUse: "麦克风正在使用", micCancel: "取消麦克风请求", micStop: "停止监听", micTryAgain: "重试麦克风", micUse: "使用麦克风", noSignal: "无信号", tunerInactive: "调音器未启用", noSignalYet: "尚无信号", inTune: "音准正确", centFlatOne: "低 {{count}} 音分", centFlatOther: "低 {{count}} 音分", centSharpOne: "高 {{count}} 音分", centSharpOther: "高 {{count}} 音分", readingAnnouncement: "{{note}}，{{cents}}", frequencyValue: "{{value}} Hz", percentValue: "{{value}}%",
  errorMetronome: "无法启动节拍器。", errorPreview: "无法试听节拍音色。", errorMediaUnavailable: "此设备不支持麦克风访问。", errorPermission: "麦克风权限被拒绝。请在系统或 Obsidian 设置中允许访问。", errorNoDevice: "未找到麦克风。请连接输入设备后重试。", errorBusy: "麦克风正忙或不可用。请关闭其他音频应用后重试。", errorConstraints: "麦克风不支持请求的音频设置。", errorAudioContext: "无法启动音频上下文。", errorAudioStart: "无法启动音频。", errorDisconnected: "麦克风已断开。请重新连接后重试。", errorUnknown: "无法启动麦克风。", defaults: "默认设置", aboutSupport: "关于与支持", defaultTempo: "默认速度", defaultTempoDesc: "Obsidian 启动时使用的速度。", a4Reference: "A4 基准", a4ReferenceDesc: "以赫兹表示的标准音高。", meterNumerator: "拍号分子", meterNumeratorDesc: "每小节的拍数。", meterDenominator: "拍号分母", meterDenominatorDesc: "每拍对应的音符时值。", accentFirstBeatDesc: "强调每小节的第一拍。", clickVolume: "节拍音量", clickVolumeDesc: "设置节拍器的初始音量。", clickSoundDesc: "选择节拍器的初始音色。", portfolio: "作品集", portfolioDesc: "Patrick Fanella 的精选作品。", visitPortfolio: "访问作品集", subcultDesc: "音乐、电影和独立文化项目。", visitSubcult: "访问 Subcult", githubDesc: "浏览 Patrick 的开源作品。", viewGithub: "查看 GitHub", email: "电子邮件", emailDesc: "问题、反馈或合作。", sendEmail: "发送邮件", toneWoodblock: "木鱼", toneMechanical: "机械", toneRimshot: "鼓边", toneClaves: "响棒", toneCowbell: "牛铃", toneSoftDigital: "柔和数码", toneSinePulse: "正弦脉冲",
} satisfies Dictionary;

export const DICTIONARIES: Record<Locale, Dictionary> = {
  en,
  de,
  es: { ...es, portfolio: "Portafolio" },
  fr,
  it: { ...it, email: "E-mail" },
  "pt-BR": { ...ptBR, portfolio: "Portfólio" },
  nl,
  pl: {
    ...pl,
    centFlatFew: "{{count}} centy za nisko",
    centFlatMany: "{{count}} centów za nisko",
    centSharpFew: "{{count}} centy za wysoko",
    centSharpMany: "{{count}} centów za wysoko",
  },
  hr,
  "zh-CN": zhCN,
};

export interface Translator {
  readonly locale: Locale;
  t(key: MessageKey, values?: Readonly<Record<string, string | number>>): string;
  number(value: number, options?: Intl.NumberFormatOptions): string;
}

export function resolveLocale(language: string | null | undefined): Locale {
  if (!language) return "en";
  const normalized = language.replaceAll("_", "-");
  const exact = SUPPORTED_LOCALES.find((locale) => locale.toLowerCase() === normalized.toLowerCase());
  if (exact) return exact;
  const lower = normalized.toLowerCase();
  if (lower === "zh-tw" || lower.startsWith("zh-tw-") || lower === "zh-hk" || lower.startsWith("zh-hk-") || lower === "zh-hant" || lower.startsWith("zh-hant-")) return "en";
  if (lower === "zh" || lower.startsWith("zh-")) return "zh-CN";
  if (lower === "pt" || lower === "pt-br" || lower.startsWith("pt-br-")) return "pt-BR";
  if (lower.startsWith("pt-")) return "en";
  const base = lower.split("-")[0];
  return SUPPORTED_LOCALES.find((locale) => locale.toLowerCase() === base) ?? "en";
}

export function createTranslator(locale: Locale = "en"): Translator {
  const dictionary = DICTIONARIES[locale];
  const numberFormatters = new Map<string, Intl.NumberFormat>();
  return {
    locale,
    t(key, values = {}) {
      return dictionary[key].replace(/\{\{(\w+)\}\}/g, (placeholder, name: string) => {
        const value = values[name];
        return value === undefined ? placeholder : String(value);
      });
    },
    number(value, options = {}) {
      const cacheKey = JSON.stringify(options);
      let formatter = numberFormatters.get(cacheKey);
      if (!formatter) {
        formatter = new Intl.NumberFormat(locale, options);
        numberFormatters.set(cacheKey, formatter);
      }
      return formatter.format(value);
    },
  };
}

interface BeatMessages {
  one: string;
  oneAccented: string;
  few?: string;
  fewAccented?: string;
}

const BEAT_MESSAGES: Record<Locale, BeatMessages> = {
  en: { one: "{{count}} beat per measure", oneAccented: "{{count}} beat per measure, first beat accented" },
  de: { one: "{{count}} Schlag pro Takt", oneAccented: "{{count}} Schlag pro Takt, erster Schlag betont" },
  es: { one: "{{count}} pulso por compás", oneAccented: "{{count}} pulso por compás, primero acentuado" },
  fr: { one: "{{count}} temps par mesure", oneAccented: "{{count}} temps par mesure, premier temps accentué" },
  it: { one: "{{count}} battito per misura", oneAccented: "{{count}} battito per misura, primo accentato" },
  "pt-BR": { one: "{{count}} batida por compasso", oneAccented: "{{count}} batida por compasso, primeira acentuada" },
  nl: { one: "{{count}} slag per maat", oneAccented: "{{count}} slag per maat, eerste slag benadrukt" },
  pl: {
    one: "{{count}} uderzenie w takcie",
    oneAccented: "{{count}} uderzenie w takcie, pierwsze akcentowane",
    few: "{{count}} uderzenia w takcie",
    fewAccented: "{{count}} uderzenia w takcie, pierwsze akcentowane",
  },
  hr: { one: "{{count}} otkucaj po taktu", oneAccented: "{{count}} otkucaj po taktu, prvi naglašen" },
  "zh-CN": { one: "每小节 {{count}} 拍", oneAccented: "每小节 {{count}} 拍，第一拍重音" },
};

export function beatMeasureMessage(i18n: Translator, count: number, accented: boolean): string {
  const pluralCategory = new Intl.PluralRules(i18n.locale).select(count);
  const messages = BEAT_MESSAGES[i18n.locale];
  const fewMessage = messages[accented ? "fewAccented" : "few"];
  if (pluralCategory === "few" && fewMessage) {
    return fewMessage.replace("{{count}}", i18n.number(count));
  }
  if (pluralCategory !== "one") {
    return i18n.t(accented ? "beatsMeasureAccented" : "beatsMeasure", { count: i18n.number(count) });
  }
  const message = messages[accented ? "oneAccented" : "one"];
  return message.replace("{{count}}", i18n.number(count));
}

export function centsDescription(i18n: Translator, cents: number): string {
  if (Math.abs(cents) <= 2) return i18n.t("inTune");
  const amount = Math.abs(Math.round(cents));
  const pluralCategory = new Intl.PluralRules(i18n.locale).select(amount);
  const category: CentCategory = pluralCategory === "one"
    ? "one"
    : i18n.locale === "pl" && (pluralCategory === "few" || pluralCategory === "many")
      ? pluralCategory
      : "other";
  const direction = cents < 0 ? "flat" : "sharp";
  return i18n.t(CENT_KEYS[direction][category], { count: i18n.number(amount) });
}

type CentCategory = "one" | "few" | "many" | "other";

const CENT_KEYS: Record<"flat" | "sharp", Record<CentCategory, MessageKey>> = {
  flat: { one: "centFlatOne", few: "centFlatFew", many: "centFlatMany", other: "centFlatOther" },
  sharp: { one: "centSharpOne", few: "centSharpFew", many: "centSharpMany", other: "centSharpOther" },
};

const TONE_KEYS: Record<TonePresetId, MessageKey> = {
  woodblock: "toneWoodblock", mechanical: "toneMechanical", rimshot: "toneRimshot", claves: "toneClaves",
  cowbell: "toneCowbell", "soft-digital": "toneSoftDigital", "sine-pulse": "toneSinePulse",
};

const TUNER_ERROR_KEYS: Record<TunerErrorCode, MessageKey> = {
  mediaUnavailable: "errorMediaUnavailable", permission: "errorPermission", noDevice: "errorNoDevice",
  busy: "errorBusy", unsupportedConstraints: "errorConstraints", audioContext: "errorAudioContext",
  audioStart: "errorAudioStart", disconnected: "errorDisconnected", unknown: "errorUnknown",
};

export function toneName(i18n: Translator, id: TonePresetId): string { return i18n.t(TONE_KEYS[id]); }
export function tunerErrorMessage(i18n: Translator, code: TunerErrorCode): string { return i18n.t(TUNER_ERROR_KEYS[code]); }
