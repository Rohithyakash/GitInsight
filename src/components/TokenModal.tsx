import React, { useState, useEffect } from 'react';
import { Key, ShieldCheck, ExternalLink, X, AlertCircle, Check } from 'lucide-react';
import { getSavedToken, saveToken, removeToken } from '../services/github';

interface TokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTokenChange: () => void;
}

export const TokenModal: React.FC<TokenModalProps> = ({ isOpen, onClose, onTokenChange }) => {
  const [tokenInput, setTokenInput] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ text: string; isError: boolean } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTokenInput(getSavedToken());
      setStatusMsg(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!tokenInput.trim()) {
      removeToken();
      setStatusMsg({ text: 'Token cleared. Using standard public rate limits.', isError: false });
    } else {
      saveToken(tokenInput);
      setStatusMsg({ text: 'Personal Access Token saved successfully!', isError: false });
    }
    onTokenChange();
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const handleClear = () => {
    removeToken();
    setTokenInput('');
    setStatusMsg({ text: 'Token cleared.', isError: false });
    onTokenChange();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl shadow-indigo-950/50">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">GitHub API Access Token</h3>
            <p className="text-xs text-slate-400">Increase rate limits from 60 to 5,000 requests/hour</p>
          </div>
        </div>

        {/* Info Box */}
        <div className="p-3.5 mb-5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-xs text-slate-300 space-y-2">
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              Your token is stored locally in your browser local storage and sent directly to GitHub&apos;s REST API. No scopes required for public repos.
            </span>
          </div>
          <a
            href="https://github.com/settings/tokens/new?description=GitHubAnalyzer&scopes=public_repo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium hover:underline"
          >
            <span>Generate Personal Access Token on GitHub</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Input */}
        <div className="space-y-2 mb-4">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Personal Access Token (classic or fine-grained)
          </label>
          <input
            type="password"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="ghp_xxxxxxxxxxxxxxxxxxxx or github_pat_..."
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm font-mono"
          />
        </div>

        {/* Status Msg */}
        {statusMsg && (
          <div
            className={`p-3 rounded-xl mb-4 text-xs flex items-center gap-2 ${
              statusMsg.isError ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            }`}
          >
            {statusMsg.isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <Check className="w-4 h-4 shrink-0" />}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {tokenInput && (
            <button
              onClick={handleClear}
              className="px-4 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors"
            >
              Clear Token
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
          >
            Save Token
          </button>
        </div>

      </div>
    </div>
  );
};
