interface Props {
  value: string;
  onChange: (value: string) => void;
  validationMessage?: string;
}

export function SearchInput({ value, onChange, validationMessage }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="search" className="text-sm font-medium text-gray-600">
        Enter your letters (use <code className="bg-gray-100 px-1 rounded">?</code> for blank tiles)
      </label>
      <div className="relative">
        <input
          id="search"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. AELRST or QU?ZZ"
          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xl font-mono uppercase"
          autoComplete="off"
          spellCheck={false}
          autoFocus
          aria-invalid={!!validationMessage}
          aria-describedby={validationMessage ? 'search-validation' : undefined}
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            aria-label="Clear input"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
      {validationMessage && (
        <p id="search-validation" role="alert" className="text-sm text-amber-600">
          {validationMessage}
        </p>
      )}
    </div>
  );
}
