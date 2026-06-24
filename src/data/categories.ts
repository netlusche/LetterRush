import { CategoryData, CategoryTier, Language } from '../types';
import stadt from './stadt.json';
import land from './land.json';
import fluss from './fluss.json';
import tier from './tier.json';
import beruf from './beruf.json';
import vorname from './vorname.json';
import filme from './filme.json';
import bands from './bands.json';
import promis from './promis.json';
import marken from './marken.json';
import fussball from './fussball.json';
import weltraum from './weltraum.json';
import mythologie from './mythologie.json';
import dinosaurier from './dinosaurier.json';
import cocktails from './cocktails.json';
import suessigkeiten from './suessigkeiten.json';
import erfindungen from './erfindungen.json';
import elemente from './elemente.json';
import retrogames from './retrogames.json';

export interface CategoryEntry {
  id: string;
  tier: CategoryTier;
  label: Record<Language, string>;
  data: CategoryData;
}

/**
 * Registry of all playable categories.
 *
 * The word data lives in `src/data/*.json`, generated from
 * `scripts/generate-categories.mjs` (the source of truth for the master lists).
 * Bonus categories are filled in Phase 4; `elemente` ships as an early example.
 */
export const CATEGORIES: CategoryEntry[] = [
  { id: 'stadt', tier: 'core', label: { de: 'Stadt', en: 'City' }, data: stadt as CategoryData },
  { id: 'land', tier: 'core', label: { de: 'Land', en: 'Country' }, data: land as CategoryData },
  { id: 'fluss', tier: 'core', label: { de: 'Fluss', en: 'River' }, data: fluss as CategoryData },
  { id: 'tier', tier: 'core', label: { de: 'Tier', en: 'Animal' }, data: tier as CategoryData },
  { id: 'beruf', tier: 'core', label: { de: 'Beruf', en: 'Profession' }, data: beruf as CategoryData },
  { id: 'vorname', tier: 'core', label: { de: 'Vorname', en: 'First name' }, data: vorname as CategoryData },
  { id: 'filme', tier: 'core', label: { de: 'Filme & Serien', en: 'Movies & Series' }, data: filme as CategoryData },
  { id: 'bands', tier: 'core', label: { de: 'Bands & Musiker', en: 'Bands & Artists' }, data: bands as CategoryData },
  { id: 'promis', tier: 'core', label: { de: 'Promis (Nachname)', en: 'Celebrities (surname)' }, data: promis as CategoryData },
  { id: 'marken', tier: 'core', label: { de: 'Marken', en: 'Brands' }, data: marken as CategoryData },
  { id: 'fussball', tier: 'core', label: { de: 'Fußballvereine', en: 'Football clubs' }, data: fussball as CategoryData },

  { id: 'weltraum', tier: 'bonus', label: { de: 'Weltraum & Astronomie', en: 'Space & Astronomy' }, data: weltraum as CategoryData },
  { id: 'mythologie', tier: 'bonus', label: { de: 'Mythologie & Sagen', en: 'Mythology & Legends' }, data: mythologie as CategoryData },
  { id: 'dinosaurier', tier: 'bonus', label: { de: 'Dinosaurier & Urzeit', en: 'Dinosaurs & Prehistory' }, data: dinosaurier as CategoryData },
  { id: 'cocktails', tier: 'bonus', label: { de: 'Cocktails & Getränke', en: 'Cocktails & Drinks' }, data: cocktails as CategoryData },
  { id: 'suessigkeiten', tier: 'bonus', label: { de: 'Süßigkeiten & Snacks', en: 'Sweets & Snacks' }, data: suessigkeiten as CategoryData },
  { id: 'erfindungen', tier: 'bonus', label: { de: 'Erfindungen', en: 'Inventions' }, data: erfindungen as CategoryData },
  { id: 'elemente', tier: 'bonus', label: { de: 'Chemische Elemente', en: 'Chemical Elements' }, data: elemente as CategoryData },
  { id: 'retrogames', tier: 'bonus', label: { de: 'Retro-Games', en: 'Retro Games' }, data: retrogames as CategoryData },
];

const BY_ID: Record<string, CategoryEntry> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
);

export const getCategory = (id: string): CategoryEntry | undefined => BY_ID[id];

export const getCategoryData = (id: string): CategoryData | undefined => BY_ID[id]?.data;

export const getCategoryLabel = (id: string, lang: Language): string =>
  BY_ID[id]?.label[lang] ?? id;

export const coreCategories = (): CategoryEntry[] => CATEGORIES.filter((c) => c.tier === 'core');

export const bonusCategories = (): CategoryEntry[] => CATEGORIES.filter((c) => c.tier === 'bonus');

/** Default selection at game start: all core categories. */
export const defaultSelectedIds = (): string[] => coreCategories().map((c) => c.id);
