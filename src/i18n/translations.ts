export const translations = {
  en: {
    title: 'LetterRush',
    tagline: 'Swipe the words that fit the letter.',

    setupPlayers: 'Players',
    player: 'Player',
    addPlayer: 'Add player',

    setupRounds: 'Rounds',

    setupLanguage: 'Language',

    setupCategories: 'Categories',
    coreCategories: 'Core categories',
    moreCategories: 'More categories',
    bonusCategories: 'Bonus categories',
    bonusHint: 'Bonus categories have sparser letter coverage.',

    setupTimer: 'Round timer',
    seconds: 's',
    timePenalty: 'Time penalty on mistakes (−2s)',

    coverageOk: 'valid letters with this selection',
    coverageWarnTitle: 'Few valid letters',
    coverageWarnNone: 'No letter clears the threshold in all selected categories — the game will auto-reduce categories per round.',

    next: 'Start game',
    continueBtn: 'Next',
    startGame: 'Start game',
    back: 'Back',
    categoryStepTitle: 'Genres & Categories',
    categoryStepSubtitle: 'Choose one or more categories to build your word pool.',
    categoriesReady: 'usable categories selected',
    categoriesWarn: 'Pick at least one category with enough words.',

    round: 'Round',
    passTo: 'Pass the device to',
    beginTurn: 'Start',
    tapToStart: 'Tap start when you have the device.',

    newTarget: 'New target!',
    letterLabel: 'Letter',
    swipeYes: 'Fits',
    swipeNo: "Doesn't fit",
    pointsShort: 'pts',
    cardsLeft: 'cards left',
    combo: 'Combo',

    scoreLockTitle: 'Score saved',
    scoreLockPass: 'Pass the device to the next player — your score stays hidden.',
    scoreLockLast: 'All players are done. Reveal the scores!',
    continue: 'Continue',
    revealScores: 'Reveal scores',

    roundResults: 'Results — Round',
    correctShort: 'right',
    wrongShort: 'wrong',
    nextRound: 'Next round',
    showWinner: 'Show winner',

    winner: 'Winner',
    playAgain: 'Play again',
    roundHistory: 'Round history',

    highscores: 'High scores',
    newRecord: 'New record!',
    noHighscores: 'No entries yet — play a game!',
    newTag: 'NEW',
    clearHighscores: 'Clear high scores',

    startOver: 'Start over',
    cancel: 'Cancel',
    yesStartOver: 'Yes, start over',
    confirmRestart: 'Do you really want to restart?',
    restartLost: 'Your current progress will be lost.',

    selectAtLeastOne: 'Select at least one category.',
    nonCommercial: 'Non-commercial hobby project',

    letsPlay: "Let's play!",
    shareGame: 'Share with friends',
    copyLink: 'Copy link',
    copied: 'Copied!',
    shareText: 'LetterRush – the word swiping game!',
  },
  de: {
    title: 'LetterRush',
    tagline: 'Wische die Wörter, die zum Buchstaben passen.',

    setupPlayers: 'Spieler',
    player: 'Spieler',
    addPlayer: 'Spieler hinzufügen',

    setupRounds: 'Runden',

    setupLanguage: 'Sprache',

    setupCategories: 'Kategorien',
    coreCategories: 'Kern-Kategorien',
    moreCategories: 'Mehr Kategorien',
    bonusCategories: 'Bonus-Kategorien',
    bonusHint: 'Bonus-Kategorien haben eine geringere Buchstaben-Abdeckung.',

    setupTimer: 'Rundentimer',
    seconds: 's',
    timePenalty: 'Zeitstrafe bei Fehler (−2s)',

    coverageOk: 'gültige Buchstaben mit dieser Auswahl',
    coverageWarnTitle: 'Wenige gültige Buchstaben',
    coverageWarnNone: 'Kein Buchstabe erfüllt die Schwelle in allen gewählten Kategorien — das Spiel reduziert die Kategorien pro Runde automatisch.',

    next: 'Spiel starten',
    continueBtn: 'Weiter',
    startGame: 'Spiel starten',
    back: 'Zurück',
    categoryStepTitle: 'Genres & Kategorien',
    categoryStepSubtitle: 'Wähle eine oder mehrere Kategorien für deinen Wortpool.',
    categoriesReady: 'nutzbare Kategorien gewählt',
    categoriesWarn: 'Wähle mindestens eine Kategorie mit genug Wörtern.',

    round: 'Runde',
    passTo: 'Gerät weitergeben an',
    beginTurn: 'Start',
    tapToStart: 'Tippe auf Start, sobald du das Gerät hast.',

    newTarget: 'Neue Vorgabe!',
    letterLabel: 'Buchstabe',
    swipeYes: 'Passt',
    swipeNo: 'Passt nicht',
    pointsShort: 'Pkt',
    cardsLeft: 'Karten übrig',
    combo: 'Combo',

    scoreLockTitle: 'Punkte gespeichert',
    scoreLockPass: 'Gib das Gerät an den nächsten Spieler weiter — dein Score bleibt verdeckt.',
    scoreLockLast: 'Alle Spieler sind fertig. Ergebnisse aufdecken!',
    continue: 'Weiter',
    revealScores: 'Ergebnisse aufdecken',

    roundResults: 'Ergebnisse — Runde',
    correctShort: 'richtig',
    wrongShort: 'falsch',
    nextRound: 'Nächste Runde',
    showWinner: 'Gewinner zeigen',

    winner: 'Gewinner',
    playAgain: 'Nochmal spielen',
    roundHistory: 'Runden-Verlauf',

    highscores: 'Bestenliste',
    newRecord: 'Neuer Rekord!',
    noHighscores: 'Noch keine Einträge — spiel eine Runde!',
    newTag: 'NEU',
    clearHighscores: 'Bestenliste löschen',

    startOver: 'Neu starten',
    cancel: 'Abbrechen',
    yesStartOver: 'Ja, neu starten',
    confirmRestart: 'Willst du wirklich neu starten?',
    restartLost: 'Dein aktueller Spielstand geht dabei verloren.',

    selectAtLeastOne: 'Wähle mindestens eine Kategorie.',
    nonCommercial: 'Nicht-kommerzielles Hobbyprojekt',

    letsPlay: 'Los geht\'s!',
    shareGame: 'Mit Freunden teilen',
    copyLink: 'Link kopieren',
    copied: 'Kopiert!',
    shareText: 'LetterRush – das Stadt-Land-Fluss-Wischspiel!',
  },
} as const;

export type TranslationKey = keyof typeof translations.en;
