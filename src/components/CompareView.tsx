import React, { useState } from 'react';
import { CompareData } from '../types';
import { fetchCompareAnalysis } from '../services/github';
import { GitCompare, Sparkles, Trophy, CheckCircle, XCircle, ArrowRight, ShieldCheck, Scale, AlertCircle } from 'lucide-react';

const PRESET_COMPARISONS = [
  { r1: 'facebook/react', r2: 'vuejs/vue', label: 'React vs Vue' },
  { r1: 'expressjs/express', r2: 'fastify/fastify', label: 'Express vs Fastify' },
  { r1: 'denoland/deno', r2: 'nodejs/node', label: 'Deno vs Node.js' },
];

export const CompareView: React.FC = () => {
  const [repo1Input, setRepo1Input] = useState('facebook/react');
  const [repo2Input, setRepo2Input] = useState('vuejs/vue');
  const [compareData, setCompareData] = useState<CompareData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCompare = async (r1: string, r2: string) => {
    if (!r1.trim() || !r2.trim()) return;
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const data = await fetchCompareAnalysis(r1.trim(), r2.trim());
      setCompareData(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to compare repositories.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      
      {/* Compare Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <GitCompare className="w-3.5 h-3.5" />
          <span>Head-to-Head Benchmarking</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
          Repository <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Comparison</span>
        </h2>
        <p className="text-sm text-slate-400">
          Compare stars, maintainer activity, open issue ratios, and AI architectural pros and cons side-by-side.
        </p>
      </div>

      {/* Inputs Form */}
      <div className="p-6 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-2xl max-w-4xl mx-auto mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Primary Repository (Repo 1)
            </label>
            <input
              type="text"
              value={repo1Input}
              onChange={(e) => setRepo1Input(e.target.value)}
              placeholder="e.g. facebook/react"
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Challenger Repository (Repo 2)
            </label>
            <input
              type="text"
              value={repo2Input}
              onChange={(e) => setRepo2Input(e.target.value)}
              placeholder="e.g. vuejs/vue"
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm font-medium"
            />
          </div>

        </div>

        {/* Action & Presets */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-white/10">
          
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-500">Presets:</span>
            {PRESET_COMPARISONS.map((p) => (
              <button
                key={p.label}
                onClick={() => {
                  setRepo1Input(p.r1);
                  setRepo2Input(p.r2);
                  handleCompare(p.r1, p.r2);
                }}
                className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 hover:text-white transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleCompare(repo1Input, repo2Input)}
            disabled={isLoading || !repo1Input.trim() || !repo2Input.trim()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Comparing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Compare Side-by-Side</span>
              </>
            )}
          </button>

        </div>
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-center justify-between gap-3 max-w-4xl mx-auto mb-8 backdrop-blur-xl animate-fadeIn">
          <div className="flex items-center gap-2 min-w-0">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span className="truncate">{errorMsg}</span>
          </div>
          <button
            onClick={() => setErrorMsg(null)}
            title="Dismiss error"
            className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-semibold shrink-0 transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Comparison Results */}
      {compareData && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* AI Winner & Head-to-Head Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-950 border border-indigo-500/30 p-6 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>AI Architectural Verdict</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  {compareData.aiComparison.verdict}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                  {compareData.aiComparison.summary}
                </p>
              </div>

              {/* Winner Badge */}
              <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 text-center shrink-0">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Recommended Choice</div>
                <div className="text-lg font-extrabold text-amber-300 flex items-center justify-center gap-1.5">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  <span>
                    {compareData.aiComparison.winner === 'repo1'
                      ? compareData.repo1.info.name
                      : compareData.aiComparison.winner === 'repo2'
                      ? compareData.repo2.info.name
                      : 'Tie / Equals'}
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Metric Comparison Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Repo 1 Card */}
            <div className={`rounded-2xl bg-slate-900/80 backdrop-blur-xl border p-6 shadow-xl relative ${
              compareData.aiComparison.winner === 'repo1' ? 'border-amber-500/50 ring-1 ring-amber-500/20' : 'border-slate-800'
            }`}>
              {compareData.aiComparison.winner === 'repo1' && (
                <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider">
                  Winner
                </div>
              )}
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={`https://github.com/${compareData.repo1.info.owner}.png`}
                  alt={compareData.repo1.info.owner}
                  className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-700"
                />
                <div>
                  <h4 className="text-lg font-bold text-white">{compareData.repo1.info.fullName}</h4>
                  <span className="text-xs text-indigo-400 font-semibold">{compareData.repo1.info.language || 'Multi-language'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Stars</span>
                  <span className="text-base font-bold text-white">{compareData.repo1.info.stats.stars.toLocaleString()}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Forks</span>
                  <span className="text-base font-bold text-white">{compareData.repo1.info.stats.forks.toLocaleString()}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Health Score</span>
                  <span className="text-base font-bold text-emerald-400">{compareData.repo1.aiReview.healthScore}/100</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Open Issues</span>
                  <span className="text-base font-bold text-rose-400">{compareData.repo1.info.stats.openIssues.toLocaleString()}</span>
                </div>
              </div>

              {/* Pros & Cons */}
              <div className="space-y-3">
                <div>
                  <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Pros</span>
                  </h5>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {compareData.aiComparison.repo1ProsCons.pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Cons</span>
                  </h5>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {compareData.aiComparison.repo1ProsCons.cons.map((con, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-rose-400 font-bold">•</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Repo 2 Card */}
            <div className={`rounded-2xl bg-slate-900/80 backdrop-blur-xl border p-6 shadow-xl relative ${
              compareData.aiComparison.winner === 'repo2' ? 'border-amber-500/50 ring-1 ring-amber-500/20' : 'border-slate-800'
            }`}>
              {compareData.aiComparison.winner === 'repo2' && (
                <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider">
                  Winner
                </div>
              )}
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={`https://github.com/${compareData.repo2.info.owner}.png`}
                  alt={compareData.repo2.info.owner}
                  className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-700"
                />
                <div>
                  <h4 className="text-lg font-bold text-white">{compareData.repo2.info.fullName}</h4>
                  <span className="text-xs text-indigo-400 font-semibold">{compareData.repo2.info.language || 'Multi-language'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Stars</span>
                  <span className="text-base font-bold text-white">{compareData.repo2.info.stats.stars.toLocaleString()}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Forks</span>
                  <span className="text-base font-bold text-white">{compareData.repo2.info.stats.forks.toLocaleString()}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Health Score</span>
                  <span className="text-base font-bold text-emerald-400">{compareData.repo2.aiReview.healthScore}/100</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Open Issues</span>
                  <span className="text-base font-bold text-rose-400">{compareData.repo2.info.stats.openIssues.toLocaleString()}</span>
                </div>
              </div>

              {/* Pros & Cons */}
              <div className="space-y-3">
                <div>
                  <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Pros</span>
                  </h5>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {compareData.aiComparison.repo2ProsCons.pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Cons</span>
                  </h5>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {compareData.aiComparison.repo2ProsCons.cons.map((con, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-rose-400 font-bold">•</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

          </div>

          {/* Use Case Guidance Box */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-indigo-500/20 text-xs sm:text-sm text-slate-200 leading-relaxed">
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Scale className="w-4 h-4" />
              <span>When to choose which?</span>
            </h4>
            <p>{compareData.aiComparison.useCaseRecommendations}</p>
          </div>

        </div>
      )}

    </div>
  );
};
