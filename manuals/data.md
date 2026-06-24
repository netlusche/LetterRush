# LetterRush — Category Data & Generator

LetterRush ships **all** its words as bundled static JSON — there is no API. This document explains how that data is structured and how to change it.

## Source of truth

> ⚠️ **Do not edit `src/data/*.json` by hand.** They are generated output and will be overwritten.

The single source of truth is:

```
scripts/generate-categories.mjs
```

It holds plain word arrays per category and writes the spec-format JSON files. Regenerate after any change:

```bash
node scripts/generate-categories.mjs
```

The script prints a per-category coverage report and a total count, e.g.:

```
stadt       291 entries | >=5: ABCDEFGHIJKLMNOPRSTUVWZ
...
Total: 2851 entries across 19 categories.
```

`>=5` lists the letters that have at least 5 words in that category (the threshold a phase target needs).

## JSON format

Each generated file looks like:

```json
{
  "kategorie": "Stadt",
  "eintraege": [
    { "wort": "Berlin", "anfangsbuchstabe": "B" },
    { "wort": "Köln",   "anfangsbuchstabe": "K" }
  ]
}
```

- `anfangsbuchstabe` is **derived** by the script — the first character, uppercased, with **Ä/Ö/Ü folded to A/O/U** (so "Ägypten" counts as `A`).
- Duplicate words within a category are removed (case-insensitive).

## How the generator works

```js
const CATEGORIES = {
  stadt: { kategorie: 'Stadt', words: ['Berlin', 'Köln', ...] },
  ...
};
```

For each category it: trims + de-duplicates the `words`, derives `anfangsbuchstabe`, writes `src/data/<id>.json`, and logs coverage. The `<id>` key is also the category id used in `categories.ts`.

## Adding or growing a category

### Grow an existing category
1. Add words to that category's array in `scripts/generate-categories.mjs`.
2. Run `node scripts/generate-categories.mjs`.
3. Check the coverage line — aim for ≥5 on every common letter you care about.

### Add a new category
1. Add a new key to `CATEGORIES` in the generator with `{ kategorie, words: [...] }`.
2. Run the generator → it creates `src/data/<id>.json`.
3. Register it in `src/data/categories.ts`:
   ```ts
   import neu from './neu.json';
   // ...
   { id: 'neu', tier: 'core' /* or 'bonus' */, label: { de: '…', en: '…' }, data: neu as CategoryData },
   ```
4. Core categories are selected by default; bonus categories appear behind the "Mehr Kategorien" toggle.

## Categories shipped today

**Core (11):** Stadt, Land, Fluss, Tier, Beruf, Vorname, Filme & Serien, Bands & Musiker, Promis (Nachname), Marken, Fußballvereine.

**Bonus (8):** Weltraum & Astronomie, Mythologie & Sagen, Dinosaurier & Urzeit, Cocktails & Getränke, Süßigkeiten & Snacks, Erfindungen, Chemische Elemente, Retro-Games.

Approximate sizes (regenerate for exact numbers):

| Core | ~ | Core | ~ |
|---|---|---|---|
| Stadt | 290 | Promis | 220 |
| Vorname | 290 | Bands | 200 |
| Marken | 225 | Beruf | 200 |
| Tier | 220 | Filme | 190 |
| Fußball | 165 | Land | 165 |
| Fluss | 115 | | |

| Bonus | ~ | Bonus | ~ |
|---|---|---|---|
| Elemente | 102 | Mythologie | 82 |
| Weltraum | 81 | Erfindungen | 69 |
| Cocktails | 65 | Süßigkeiten | 61 |
| Retro-Games | 59 | Dinosaurier | 51 |

## How the data is consumed

- `categories.ts` exposes helpers: `getCategoryData`, `getCategoryLabel`, `coreCategories`, `bonusCategories`, `defaultSelectedIds`.
- `poolGenerator.ts` reads the data to validate letters and build per-phase decks (hits from the target category/letter, traps from other letters and other categories). See `manuals/documentation.md` §5–6.

## Quality guidelines

- Prefer correct, well-known entries with broad alphabet coverage over hitting a raw count.
- For multi-word titles/names (films, clubs, bands) the first letter as written is used — curate so letters spread out rather than clustering under articles ("The …", "Die …").
- Bonus categories may stay smaller and uneven; the letter-validation logic skips letters that are too sparse.
