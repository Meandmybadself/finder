import { useState, useEffect } from 'react';
import { useSearch } from './hooks/useSearch';
import { SearchInput } from './components/SearchInput';
import { FilterInputs } from './components/FilterInputs';
import { ResultsList } from './components/ResultsList';

const STORAGE_KEY = 'scrabble-letters';
const STARTS_WITH_KEY = 'scrabble-starts-with';
const ENDS_WITH_KEY = 'scrabble-ends-with';

export default function App() {
  const [input, setInput] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });
  const [startsWith, setStartsWith] = useState(() => {
    try {
      return localStorage.getItem(STARTS_WITH_KEY) || '';
    } catch {
      return '';
    }
  });
  const [endsWith, setEndsWith] = useState(() => {
    try {
      return localStorage.getItem(ENDS_WITH_KEY) || '';
    } catch {
      return '';
    }
  });
  const { validation, response, isSearching } = useSearch(input, startsWith, endsWith);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, input);
    } catch {
      // Ignore localStorage errors (e.g., if disabled or quota exceeded)
    }
  }, [input]);

  useEffect(() => {
    try {
      localStorage.setItem(STARTS_WITH_KEY, startsWith);
    } catch {
      // Ignore localStorage errors
    }
  }, [startsWith]);

  useEffect(() => {
    try {
      localStorage.setItem(ENDS_WITH_KEY, endsWith);
    } catch {
      // Ignore localStorage errors
    }
  }, [endsWith]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-12 px-4 pb-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Scrabble Word Finder</h1>
      <p className="text-gray-500 mb-6">Find the highest-scoring words from your letters</p>
      <div className="w-full max-w-xl flex flex-col gap-6">
        <SearchInput
          value={input}
          onChange={setInput}
          validationMessage={!validation.valid ? validation.reason : undefined}
        />
        <FilterInputs
          startsWith={startsWith}
          endsWith={endsWith}
          onStartsWithChange={setStartsWith}
          onEndsWithChange={setEndsWith}
        />
        <ResultsList response={response} isSearching={isSearching} />
      </div>
    </div>
  );
}
