import type { SearchRequest, SearchResponse, ScoredWord } from './types';
import { getDictionary } from './dictionary';
import { countLetters, canFormWord } from './matcher';

const MAX_RESULTS = 100;

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

      if (canFormWord(entry.word, counts, wildcards)) {
        matches.push(entry);
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
