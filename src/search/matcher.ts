import type { InputValidation } from './types';

/**
 * Validate raw user input before attempting a search.
 */
export function validatePattern(input: string): InputValidation {
  const trimmed = input.trim();
  if (trimmed.length < 2) {
    return { valid: false, reason: 'Enter at least 2 letters to search.' };
  }
  if (!/^[a-zA-Z_?]+$/.test(trimmed)) {
    return { valid: false, reason: 'Only letters and wildcards (? or _) are allowed.' };
  }
  return { valid: true };
}

/**
 * Count the frequency of each letter in a string.
 * Returns a map of letter -> count, plus a count of wildcards.
 */
export function countLetters(input: string): { counts: Map<string, number>; wildcards: number } {
  const counts = new Map<string, number>();
  let wildcards = 0;

  for (const ch of input.toUpperCase()) {
    if (ch === '?' || ch === '_') {
      wildcards++;
    } else {
      counts.set(ch, (counts.get(ch) ?? 0) + 1);
    }
  }

  return { counts, wildcards };
}

/**
 * Check if a word can be formed from the available letters.
 * Wildcards can substitute for any letter.
 */
export function canFormWord(
  word: string,
  availableCounts: Map<string, number>,
  wildcards: number
): boolean {
  // Count letters needed for the word
  const needed = new Map<string, number>();
  for (const ch of word) {
    needed.set(ch, (needed.get(ch) ?? 0) + 1);
  }

  let wildcardsUsed = 0;

  for (const [letter, count] of needed) {
    const available = availableCounts.get(letter) ?? 0;
    if (available < count) {
      // Need to use wildcards for the shortfall
      wildcardsUsed += count - available;
      if (wildcardsUsed > wildcards) {
        return false;
      }
    }
  }

  return true;
}
