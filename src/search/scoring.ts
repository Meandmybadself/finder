import type { ScoredWord } from './types';

/** Standard Scrabble letter point values. */
export const LETTER_VALUES: Record<string, number> = {
  A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1, J: 8,
  K: 5, L: 1, M: 3, N: 1, O: 1, P: 3, Q: 10, R: 1, S: 1, T: 1,
  U: 1, V: 4, W: 4, X: 8, Y: 4, Z: 10,
};

/** Compute the Scrabble score for a word (assumes uppercase). */
export function scoreWord(word: string): number {
  let total = 0;
  for (let i = 0; i < word.length; i++) {
    total += LETTER_VALUES[word[i]] ?? 0;
  }
  return total;
}

/** Build the scored dictionary from a raw word list, pre-sorted by score descending. */
export function buildScoredDictionary(rawWords: string[]): readonly ScoredWord[] {
  return rawWords
    .map((w) => ({ word: w, score: scoreWord(w) }))
    .sort((a, b) => b.score - a.score);
}
