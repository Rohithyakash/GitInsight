import React, { useState } from 'react';
import { Search, Sparkles, X, ArrowRight, TrendingUp, Command } from 'lucide-react';

interface SearchSectionProps {
  onSearch: (repoQuery: string) => void;
  isLoading: boolean;
}

const SAMPLE_REPOS = [
  { name: 'facebook/react', tag: '#react' },
  { name: 'vercel/next.js', tag: '#nextjs' },
  { name: 'tailwindlabs/tailwindcss', tag: '#tailwind' },
  { name: 'shadcn-ui/ui', tag: '#ui' },
  { name: 'golang/go', tag: '#golang' },
  { name: 'torvalds/linux', tag: '#c' },
];

export const SearchSection: React.FC<SearchSectionProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  const handleSelectSample = (sampleName: string) => {
    setQuery(sampleName);
    onSearch(sampleName);
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-8 px-4 text-center">
      
      {/* Title Header */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4 animate-fadeIn">
        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
        <span>AI-Powered GitHub Repository Intelligence</span>
      </div>

      <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
        Analyze Any GitHub <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">Repository</span>
      </h1>

      <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto mb-8">
        Get real-time statistics, dependency health, contributor metrics, and an instant AI architectural code review.
      </p>

      {/* Large Search Input */}
      <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto mb-6 group">
        <div className="relative flex items-center rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-2xl shadow-indigo-950/40 group-hover:border-indigo-500/50 group-focus-within:border-indigo-500 group-focus-within:ring-2 group-focus-within:ring-indigo-500/20 transition-all duration-300">
          
          <Search className="w-5 h-5 text-slate-500 ml-4 shrink-0" />

          <input
            id="repo-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter repository (e.g., facebook/react, vercel/next.js)..."
            disabled={isLoading}
            className="w-full py-4 pl-3 pr-36 text-sm sm:text-base text-white placeholder-slate-500 bg-transparent focus:outline-none"
          />

          {/* Keyboard Shortcut Hint Badge */}
          <div className="hidden sm:flex items-center gap-1 mr-3 px-2 py-1 rounded-md bg-white/5 border border-white/10 text-slate-400 text-[11px] font-medium pointer-events-none">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>

          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1.5 rounded-lg text-slate-500 hover:text-white mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all duration-200"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <span>Analyze</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </div>
      </form>

      {/* Quick Sample Tags */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1">
          <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
          <span>Quick Try:</span>
        </div>
        {SAMPLE_REPOS.map((sample) => (
          <button
            key={sample.name}
            onClick={() => handleSelectSample(sample.name)}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 hover:border-indigo-500/40 transition-all duration-200"
          >
            <span className="text-indigo-400 font-semibold">{sample.tag}</span> {sample.name.split('/')[1]}
          </button>
        ))}
      </div>

    </div>
  );
};
