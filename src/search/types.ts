/** A word with its pre-computed Scrabble score. */
export interface ScoredWord {
  word: string;
  score: number;
}

/** The payload sent TO the search worker. */
export interface SearchRequest {
  pattern: string;
  searchId: number;
}

/** The payload received FROM the search worker. */
export interface SearchResponse {
  results: ScoredWord[];
  truncated: boolean;
  elapsedMs: number;
  searchId: number;
  error?: string;
}

/** Validation states for the input field. */
export type InputValidation =
  | { valid: true }
  | { valid: false; reason: string };
