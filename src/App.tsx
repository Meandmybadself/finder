import { useState } from 'react';
import { useSearch } from './hooks/useSearch';
import { SearchInput } from './components/SearchInput';
import { ResultsList } from './components/ResultsList';

export default function App() {
  const [input, setInput] = useState('');
  const { validation, response, isSearching } = useSearch(input);

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
        <ResultsList response={response} isSearching={isSearching} />
      </div>
    </div>
  );
}
