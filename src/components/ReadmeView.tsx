import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { FileText, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

interface ReadmeViewProps {
  readmeContent: string | null;
}

export const ReadmeView: React.FC<ReadmeViewProps> = ({ readmeContent }) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!readmeContent) {
    return (
      <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-400">
        <FileText className="w-8 h-8 mx-auto mb-2 text-slate-500" />
        <p className="text-sm">No README file found for this repository.</p>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(readmeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 p-6 shadow-xl relative">
      
      {/* Header bar */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">README.md</h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Raw</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg transition-colors border border-indigo-500/20"
          >
            <span>{isExpanded ? 'Collapse' : 'Expand All'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Markdown Content Wrapper */}
      <div className={`relative ${!isExpanded ? 'max-h-[600px] overflow-hidden' : ''}`}>
        <div className="prose prose-invert max-w-none prose-headings:text-white prose-a:text-indigo-400 prose-code:text-indigo-300 prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-800 text-slate-300 text-sm leading-relaxed">
          <Markdown>{readmeContent}</Markdown>
        </div>

        {!isExpanded && (
          <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent flex items-end justify-center pb-4">
            <button
              onClick={() => setIsExpanded(true)}
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5"
            >
              <span>Read Full README</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
