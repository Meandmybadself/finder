import type { ScoredWord } from './types';
import { buildScoredDictionary } from './scoring';
import rawText from '../data/words.txt?raw';

let _cache: readonly ScoredWord[] | null = null;

/** Lazily build and cache the scored dictionary. */
export function getDictionary(): readonly ScoredWord[] {
  if (_cache) return _cache;

  const words = rawText
    .split('\n')
    .map((w) => w.trim().toUpperCase())
    .filter((w) => w.length > 0);

  _cache = buildScoredDictionary(words);
  return _cache;
}
