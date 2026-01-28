import type { SearchResponse } from '../search/types';
import { WordCard } from './WordCard';

interface Props {
  response: SearchResponse | null;
  isSearching: boolean;
}

export function ResultsList({ response, isSearching }: Props) {
  if (isSearching) {
    return <p className="text-gray-500 py-4">Searching...</p>;
  }

  if (!response) return null;

  if (response.error) {
    return <p className="text-red-600 py-4">Error: {response.error}</p>;
  }

  if (response.results.length === 0) {
    return <p className="text-gray-500 py-4">No matches found.</p>;
  }

  const count = response.results.length;

  return (
    <div>
      <p className="text-sm text-gray-500 mb-2">
        {response.truncated ? '100+' : count} match{count !== 1 || response.truncated ? 'es' : ''} found
        {response.truncated && ' (showing top 100 by score)'}
        <span className="ml-2 text-gray-400">({response.elapsedMs.toFixed(1)}ms)</span>
      </p>
      <div className="border border-gray-200 rounded-lg overflow-hidden max-h-[60vh] overflow-y-auto">
        {response.results.map((entry, i) => (
          <WordCard key={entry.word} entry={entry} rank={i + 1} />
        ))}
      </div>
    </div>
  );
}
