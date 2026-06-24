# LetterRush — New Feature Ideas

A backlog of ideas, not commitments. Pick and choose per release.

## 1. Grow word lists toward 300–500 per core category
Core categories sit around 115–290 entries. Growing them (via `scripts/generate-categories.mjs`) improves variety and trap quality. Data-only change; no code.

## 2. Difficulty / tuning options in setup
Expose the phase tuning currently hard-coded in `poolGenerator.ts` (`PHASES_PER_ROUND`, `CARDS_PER_PHASE`, hit/trap ratio) as an "easy / normal / hard" selector — e.g. faster target rotation or more wrong-category traps for harder play.

## 3. Per-category accuracy in the round reveal
Track which targets a player got right/wrong and show a small per-category/letter breakdown in `RoundReveal` — e.g. "Tier ✓✓✗, Stadt ✓✓✓".

## 4. Sudden-death / endless mode
A single-player practice mode with one long deck and no per-turn timer — endless cards until X mistakes, score = streak. Reuses `SortingScreen` with a different finish condition.

## 5. Shareable result card
Generate a small image/summary of the final leaderboard for sharing (Web Share API where available). Stays offline-friendly.

## 6. Custom categories
Let players add their own word list (paste words, category name) stored in `localStorage` and merged into the registry at runtime. Anfangsbuchstabe derived the same way as the generator.

## 7. Sound & haptics
Optional swipe/confirm sound effects and vibration (`navigator.vibrate`) on correct/wrong, with a mute toggle. Keep off by default.

## 8. Dedicated app icon set
Current PWA icons are generated from `branding/logo-source.png`; consider purpose-built maskable icons and an animated splash.
