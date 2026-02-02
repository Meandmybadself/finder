import type { SearchRequest, SearchResponse, ScoredWord } from './types';
import { getDictionary } from './dictionary';
import { countLetters, canFormWord } from './matcher';
import { LETTER_VALUES } from './scoring';

const MAX_RESULTS = 100;

/**
 * Calculate the point penalty for using wildcards (blanks).
 * Wildcards can represent any letter but score 0 points.
 * We subtract the lowest-value letters that would have been scored.
 */
function getWildcardPenalty(word: string, wildcardsUsed: number): number {
  if (wildcardsUsed === 0) return 0;

  const letterScores = word.split('').map(ch => LETTER_VALUES[ch] ?? 0).sort((a, b) => a - b);
  let penalty = 0;
  for (let i = 0; i < wildcardsUsed && i < letterScores.length; i++) {
    penalty += letterScores[i];
  }
  return penalty;
}

self.onmessage = (event: MessageEvent<SearchRequest>) => {
  const startMs = performance.now();
  const { pattern, searchId } = event.data;

  let results: ScoredWord[] = [];
  let truncated = false;
  let error: string | undefined;

  try {
    const dictionary = getDictionary();
    const { counts, wildcards } = countLetters(pattern);
    const maxLength = pattern.length; // Can't make words longer than available letters

    // Collect all matching words
    const matches: ScoredWord[] = [];

    for (const entry of dictionary) {
      // Skip words longer than available letters
      if (entry.word.length > maxLength) continue;

      const wildcardsUsed = canFormWord(entry.word, counts, wildcards);
      if (wildcardsUsed !== false) {
        // Recalculate score accounting for wildcards (which score 0)
        matches.push({
          word: entry.word,
          score: entry.score - getWildcardPenalty(entry.word, wildcardsUsed)
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
