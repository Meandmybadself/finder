interface Props {
  startsWith: string;
  endsWith: string;
  onStartsWithChange: (value: string) => void;
  onEndsWithChange: (value: string) => void;
}

export function FilterInputs({ startsWith, endsWith, onStartsWithChange, onEndsWithChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="starts-with" className="text-sm font-medium text-gray-600">
          Starts with (optional)
        </label>
        <input
          id="starts-with"
          type="text"
          value={startsWith}
          onChange={(e) => onStartsWithChange(e.target.value)}
          placeholder="e.g. QU"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono uppercase"
          autoComplete="off"
          spellCheck={false}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="ends-with" className="text-sm font-medium text-gray-600">
          Ends with (optional)
        </label>
        <input
          id="ends-with"
          type="text"
          value={endsWith}
          onChange={(e) => onEndsWithChange(e.target.value)}
          placeholder="e.g. ED"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono uppercase"
          autoComplete="off"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
