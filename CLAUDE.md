# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Scrabble Word Finder - a React-based web application that finds the highest-scoring Scrabble words from user-provided letters. Supports wildcard/blank tiles using `?` or `_`.

## Development Commands

- `npm run dev` - Start Vite development server with HMR
- `npm run build` - Type check with TypeScript then build for production
- `npm run lint` - Run ESLint on the codebase
- `npm run preview` - Preview production build locally

## Architecture

### Technology Stack
- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4 (with Vite plugin)
- **Linting**: ESLint 9 with React-specific rules

### Key Architectural Patterns

#### Web Worker for Search Performance
The application uses a Web Worker (`src/search/searchWorker.ts`) to perform dictionary searches off the main thread, preventing UI blocking. The worker:
- Receives search requests with a pattern and searchId
- Filters a 267k+ word dictionary (`src/data/words.txt`)
- Calculates Scrabble scores accounting for wildcard penalties
- Returns top 100 results sorted by score (then length)

The `useSearch` hook (`src/hooks/useSearch.ts`) manages worker lifecycle and implements:
- Debounced search (150ms) to reduce unnecessary worker calls
- Search ID tracking to ignore stale responses from race conditions
- Input validation before triggering searches

#### Scoring System
Located in `src/search/scoring.ts`:
- Standard Scrabble letter values (A=1, Q=10, Z=10, etc.)
- Wildcards score 0 points - penalty calculated by subtracting lowest-value letters used
- Dictionary is pre-scored at load time for performance

#### Letter Matching Algorithm
Located in `src/search/matcher.ts`:
- Counts frequency of each letter in input
- Tracks wildcard count separately
- `canFormWord()` checks if a word can be formed from available letters + wildcards
- Returns number of wildcards used (for score penalty calculation)

#### State Management
- LocalStorage persistence for user input (key: `scrabble-letters`)
- Component state managed with React hooks (no external state library)
- Worker communication uses refs to avoid stale closures

### Directory Structure

```
src/
├── components/        # React UI components
├── hooks/            # Custom React hooks (search logic)
├── search/           # Core search engine
│   ├── searchWorker.ts   # Web Worker for async search
│   ├── dictionary.ts     # Dictionary loading/caching
│   ├── matcher.ts        # Letter matching algorithm
│   ├── scoring.ts        # Scrabble scoring logic
│   └── types.ts          # Shared TypeScript types
└── data/
    └── words.txt     # 267k word dictionary (uppercase, one per line)
```

## Important Implementation Details

### Vite Worker Import
Web Workers are imported using Vite's special syntax:
```typescript
import SearchWorker from '../search/searchWorker.ts?worker';
```

### Raw Text Import
The dictionary is imported as raw text:
```typescript
import rawText from '../data/words.txt?raw';
```

### Input Validation
- Minimum 2 letters required
- Only accepts letters and wildcards (`?` or `_`)
- Validation happens before search is triggered

### Performance Considerations
- Dictionary is lazily loaded and cached on first search
- Results are truncated to 100 words maximum
- Worker prevents blocking main thread during large dictionary searches
- Debouncing reduces unnecessary worker invocations
