import type { ScoredWord } from '../search/types';
import { LETTER_VALUES } from '../search/scoring';

interface Props {
  entry: ScoredWord;
  rank: number;
}

export function WordCard({ entry, rank }: Props) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 border-b border-gray-100 hover:bg-gray-50">
      <span className="text-gray-400 text-sm w-8 text-right">{rank}</span>
      <span className="font-mono font-bold text-gray-800 text-lg tracking-wide">
        {entry.word}
      </span>
      <span className="ml-auto text-blue-700 font-semibold">{entry.score} pts</span>
      <span className="text-xs text-gray-400 hidden sm:inline">
        ({entry.word.split('').map((ch) => LETTER_VALUES[ch.toUpperCase()] ?? 0).join('+')})
      </span>
    </div>
  );
}
