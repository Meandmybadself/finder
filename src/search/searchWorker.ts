import type { SearchRequest, SearchResponse, ScoredWord } from './types';
import { getDictionary } from './dictionary';
import { countLetters, canFormWord } from './matcher';
import { LETTER_VALUES } from './scoring';

const MAX_RESULTS = 100;

/**
 * Calculate the score for a word, treating specific wildcard letters as 0 points.
 * @param word - The word to score
 * @param wildcardLetters - Array of letters that are represented by blanks (score 0)
 */
function scoreWordWithWildcards(word: string, wildcardLetters: string[]): number {
  let total = 0;

  // Count how many of each wildcard letter we need to skip
  const wildcardsToSkip = new Map<string, number>();
  for (const letter of wildcardLetters) {
    wildcardsToSkip.set(letter, (wildcardsToSkip.get(letter) ?? 0) + 1);
  }

  // Calculate score, skipping the letters that are wildcards
  for (const ch of word) {
    const skipCount = wildcardsToSkip.get(ch);
    if (skipCount && skipCount > 0) {
      // This letter is a wildcard, don't add its score
      wildcardsToSkip.set(ch, skipCount - 1);
    } else {
      // This is a real letter, add its score
      total += LETTER_VALUES[ch] ?? 0;
    }
  }

  return total;
}

self.onmessage = (event: MessageEvent<SearchRequest>) => {
  const startMs = performance.now();
  const { pattern, searchId, startsWith, endsWith } = event.data;

  let results: ScoredWord[] = [];
  let truncated = false;
  let error: string | undefined;

  try {
    const dictionary = getDictionary();
    const { counts, wildcards } = countLetters(pattern);

    // Normalize filters to uppercase
    const startsWithUpper = startsWith?.trim().toUpperCase() || '';
    const endsWithUpper = endsWith?.trim().toUpperCase() || '';

    // Add implicit letters from startsWith and endsWith to available counts
    const implicitCounts = new Map(counts);
    for (const ch of startsWithUpper) {
      implicitCounts.set(ch, (implicitCounts.get(ch) ?? 0) + 1);
    }
    for (const ch of endsWithUpper) {
      implicitCounts.set(ch, (implicitCounts.get(ch) ?? 0) + 1);
    }

    // Calculate max length including implicit letters
    const maxLength = pattern.length + startsWithUpper.length + endsWithUpper.length;

    // Collect all matching words
    const matches: ScoredWord[] = [];

    for (const entry of dictionary) {
      // Skip words longer than available letters (including implicit)
      if (entry.word.length > maxLength) continue;

      // Apply starts with filter
      if (startsWithUpper && !entry.word.startsWith(startsWithUpper)) continue;

      // Apply ends with filter
      if (endsWithUpper && !entry.word.endsWith(endsWithUpper)) continue;

      const result = canFormWord(entry.word, implicitCounts, wildcards);
      if (result !== false) {
        // Calculate score with wildcards counting as 0 points
        const score = scoreWordWithWildcards(entry.word, result.wildcardLetters);
        matches.push({
          word: entry.word,
          score
        });
      }
    }

    // Sort by score (descending), then by length (descending) for ties
    matches.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.word.length - a.word.length;
    });

    // Take top results
    if (matches.length > MAX_RESULTS) {
      results = matches.slice(0, MAX_RESULTS);
      truncated = true;
    } else {
      results = matches;
    }
  } catch (err) {
    error = String(err);
  }

  const response: SearchResponse = {
    results,
    truncated,
    elapsedMs: performance.now() - startMs,
    searchId,
    error,
  };

  self.postMessage(response);
};
