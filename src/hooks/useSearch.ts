import { useState, useEffect, useRef } from 'react';
import type { SearchResponse, InputValidation } from '../search/types';
import { validatePattern } from '../search/matcher';
import SearchWorker from '../search/searchWorker.ts?worker';

export function useSearch(rawInput: string) {
  const [validation, setValidation] = useState<InputValidation>({ valid: false, reason: '' });
  const [response, setResponse] = useState<SearchResponse | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const workerRef = useRef<Worker | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchIdRef = useRef(0);

  // Initialize worker once (StrictMode safe)
  useEffect(() => {
    const worker = new SearchWorker();
    const currentSearchId = searchIdRef.current;

    worker.onmessage = (e: MessageEvent<SearchResponse>) => {
      // Ignore stale responses from outdated searches
      if (e.data.searchId >= currentSearchId) {
        setResponse(e.data);
        setIsSearching(false);
      }
    };

    workerRef.current = worker;

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  // Debounced search trigger
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    const result = validatePattern(rawInput);
    setValidation(result);

    if (!result.valid) {
      setResponse(null);
      setIsSearching(false);
      return;
    }

    // Don't show "Searching..." until the debounce actually fires
    timerRef.current = setTimeout(() => {
      searchIdRef.current++;
      setIsSearching(true);
      workerRef.current?.postMessage({
        pattern: rawInput.trim(),
        searchId: searchIdRef.current,
      });
    }, 150);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [rawInput]);

  return { validation, response, isSearching };
}
