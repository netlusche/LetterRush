# 🔠 LetterRush

A fast-paced, modern **local multiplayer word-sorting game** — *Stadt-Land-Fluss* reimagined as a Tinder-style swipe race. Built with React, Vite & TypeScript. Pass the device, swipe the words that fit — no account, no backend, fully offline.

---

## ✨ Features

### 🎮 Gameplay
- **Local Multiplayer (1–6 players)**: Pass one device between players — each player gets their own timed turn on the same round.
- **Swipe to sort**: Each card shows a single word. Swipe **right = fits**, **left = doesn't fit** (or tap the ✓ / ✗ buttons). Native Pointer-Event gestures, no extra dependency.
- **Rotating target (letter + category)**: A turn is split into phases. Each phase shows a target like **"Tier · M"** in a banner that changes every few cards (with a "New target!" flash). A card only counts as *fits* when the word matches **both** the current letter **and** the current category — so it rewards knowledge, not just reading speed.
- **Tricky traps**: Each phase mixes in *right-letter / wrong-category* words (e.g. "Madrid" under *Tier · M*) and *right-category / wrong-letter* words, so the category dimension actually matters.

### 🏆 Scoring
- **+10** base per correct swipe, **+5** speed bonus (decided within 2 s).
- **Combo multiplier** for consecutive correct swipes: ×1.2 (3+) → ×1.5 (5+) → ×2 (7+).
- **−5** and combo reset on a wrong swipe; optional **−2 s** time penalty per mistake.
- **Score-Lock**: a player's score is hidden after their turn and revealed for everyone together in the round reveal — no peeking.

### 🗂️ Categories & Word Pool
- **11 core categories**: Stadt, Land, Fluss, Tier, Beruf, Vorname, Filme & Serien, Bands & Musiker, Promis (Nachname), Marken, Fußballvereine.
- **8 bonus categories** (opt-in, sparser coverage): Weltraum & Astronomie, Mythologie & Sagen, Dinosaurier & Urzeit, Cocktails & Getränke, Süßigkeiten & Snacks, Erfindungen, Chemische Elemente, Retro-Games.
- **~2,850 curated words** across all categories, all bundled — the game works **100 % offline**.
- **Letter validation**: a (category, letter) target is only used when the category has at least 5 matching words for that letter.

### 🎲 Anti-Memorization
- Master word lists are much larger than a single round needs. Each round draws only a **random subset** of hits and traps per phase, and each player's deck is **reshuffled** — the same category+letter looks different next time.

### 🥇 High Scores
- Top-10 scores persist across sessions in `localStorage`. A new entry is highlighted, a **"New record!"** badge appears on the winner screen, and the list is also viewable (and clearable) from the setup screen.

### 📣 Splash Screen & Social Sharing
- **Splash screen** on first launch: logo (with pulse animation), "Let's play!" button, and a share footer.
- **Share buttons**: WhatsApp, Facebook, Telegram, Reddit, and a copy-link button — opens the correct platform share URL directly.
- **Native share** (`navigator.share`) shown additionally on mobile browsers that support it.
- **Social previews** (WhatsApp, iMessage, Telegram, …) use `og:image`, `og:title`, and `og:description` from `index.html`.

### 🎨 Themes & Visuals
- **15 visual themes** — Default (the LetterRush petrol/orange palette), Plain White, Plain Dark, Matrix, Vaporwave, Westeros, Sakura, LCARS, Frutiger Aero, Synthwave, Heavy Metal, Post Punk, Rock Legends, Kraftwerk, and **Neon Party** — each with its own color palette and canvas background animation.
- **Canvas background animations**: high-performance `<canvas>` loop with theme-specific effects (drifting orbs, Matrix rain, fire embers, cherry blossoms, bubbles, …). Respects `prefers-reduced-motion`.

### 🌐 Localization
- Full **German** and **English** UI; category labels are localized.

### 📱 PWA & Installation
- **Screen stays on** during gameplay via the **Wake Lock API**.
- **Installable** on iOS and Android — no App Store required.
- **Fully offline**: app shell *and* all word data are precached; no network needed to play.
- **Install on iOS**: Safari → Share → "Add to Home Screen".
- **Install on Android/Desktop**: Chrome address-bar install button, or menu → "Install app".

---

## 🚀 Usage

### Local Development
```bash
npm install
npm run dev
```
Runs the Vite dev server at `http://localhost:5173`. Note: the Service Worker is **not active** in dev mode — use `vite preview` to test PWA behavior.

### Test PWA locally
```bash
npm run build
npx vite preview
```
Serves the production build with Service Worker and manifest active.

### Production Build
```bash
npm run build
```
Outputs a static bundle to `dist/`. Because everything is client-side and the word data is bundled, **the app can be hosted on any static web server** — GitHub Pages, Netlify, Vercel, Strato, IONOS — with **zero backend**. Thanks to `base: './'` it also works when served from a **subdirectory** (e.g. `example.com/letterrush/`). The app version shown in the start-screen footer is taken from `package.json` and inlined at build time.

### Regenerating Category Data
The word lists in `src/data/*.json` are **generated** — do not edit them by hand:
```bash
node scripts/generate-categories.mjs
```
See [`manuals/data.md`](manuals/data.md) for the word-list format and how to add or grow categories.

---

## ⚖️ Disclaimer

This application is a **non-commercial hobby project** for entertainment purposes only. All proper nouns used as game words (cities, brands, films, clubs, people, …) are the property of their respective owners; their use here is purely as trivia answers and implies no affiliation or endorsement.

---

## 📚 Documentation

- [`manuals/documentation.md`](manuals/documentation.md) — full system documentation.
- [`manuals/data.md`](manuals/data.md) — category data & generator.
- [`manuals/new_feature_ideas.md`](manuals/new_feature_ideas.md) — backlog of ideas.
