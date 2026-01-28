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
      <input
        id="search"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. AELRST or QU?ZZ"
        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xl font-mono uppercase"
        autoComplete="off"
        spellCheck={false}
        autoFocus
        aria-invalid={!!validationMessage}
        aria-describedby={validationMessage ? 'search-validation' : undefined}
      />
      {validationMessage && (
        <p id="search-validation" role="alert" className="text-sm text-amber-600">
          {validationMessage}
        </p>
      )}
    </div>
  );
}
