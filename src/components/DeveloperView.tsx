import React, { useState } from 'react';
import { DeveloperProfile } from '../types';
import { fetchDeveloperProfile } from '../services/github';
import { User, Search, Sparkles, MapPin, Building, Link as LinkIcon, Users, Star, GitFork, ArrowUpRight, Code2, AlertCircle } from 'lucide-react';

interface DeveloperViewProps {
  onAnalyzeRepo?: (repoFullName: string) => void;
}

export const DeveloperView: React.FC<DeveloperViewProps> = ({ onAnalyzeRepo }) => {
  const [usernameInput, setUsernameInput] = useState('gaearon');
  const [profile, setProfile] = useState<DeveloperProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSearch = async (uname: string) => {
    if (!uname.trim()) return;
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const data = await fetchDeveloperProfile(uname.trim());
      setProfile(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to fetch developer profile.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <User className="w-3.5 h-3.5" />
          <span>Developer Persona Intelligence</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
          Developer <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Insights</span>
        </h2>
        <p className="text-sm text-slate-400">
          Explore developer profiles, public repository impact, primary languages, and AI-generated skills evaluation.
        </p>
      </div>

      {/* Search Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch(usernameInput);
        }}
        className="max-w-xl mx-auto mb-8"
      >
        <div className="relative flex items-center rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-xl focus-within:border-indigo-500 transition-all">
          <Search className="w-5 h-5 text-slate-500 ml-4 shrink-0" />
          <input
            type="text"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            placeholder="Enter GitHub username (e.g. gaearon, torvalds)..."
            className="w-full py-3.5 pl-3 pr-28 text-sm text-white placeholder-slate-500 bg-transparent focus:outline-none font-medium"
          />
          <button
            type="submit"
            disabled={isLoading || !usernameInput.trim()}
            className="absolute right-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 disabled:opacity-50 flex items-center gap-1.5"
          >
            {isLoading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <span>Inspect Profile</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error Banner */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-center justify-between gap-3 max-w-xl mx-auto mb-8 backdrop-blur-xl animate-fadeIn">
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

      {/* Developer Profile View */}
      {profile && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Header Card */}
          <div className="rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 p-6 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              <div className="flex items-start gap-4">
                <img
                  src={profile.avatarUrl}
                  alt={profile.login}
                  className="w-20 h-20 rounded-2xl border-2 border-indigo-500/30 bg-slate-950 object-cover shadow-xl"
                />
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-2xl font-bold text-white">{profile.name || profile.login}</h3>
                    <span className="text-sm font-medium text-indigo-400">@{profile.login}</span>
                  </div>

                  {profile.bio && (
                    <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">{profile.bio}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-400">
                    {profile.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span>{profile.location}</span>
                      </span>
                    )}
                    {profile.company && (
                      <span className="flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-slate-500" />
                        <span>{profile.company}</span>
                      </span>
                    )}
                    {profile.blog && (
                      <a
                        href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-indigo-400 hover:underline"
                      >
                        <LinkIcon className="w-3.5 h-3.5" />
                        <span>Website</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats pill group */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/60 p-3 rounded-2xl border border-slate-800 shrink-0">
                <div className="p-2 text-center">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase block">Public Repos</span>
                  <span className="text-base font-extrabold text-white">{profile.publicRepos}</span>
                </div>
                <div className="p-2 text-center">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase block">Total Stars</span>
                  <span className="text-base font-extrabold text-amber-400">{profile.totalStarsEarned.toLocaleString()}</span>
                </div>
                <div className="p-2 text-center">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase block">Followers</span>
                  <span className="text-base font-extrabold text-indigo-400">{profile.followers.toLocaleString()}</span>
                </div>
                <div className="p-2 text-center">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase block">Following</span>
                  <span className="text-base font-extrabold text-slate-300">{profile.following.toLocaleString()}</span>
                </div>
              </div>

            </div>
          </div>

          {/* AI Persona & Skills Assessment */}
          {profile.aiPersona && (
            <div className="rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-500/30 p-6 shadow-2xl relative">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">AI Developer Persona Assessment</h4>
                </div>
                <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
                  {profile.aiPersona.developerArchetype}
                </span>
              </div>

              <p className="text-sm text-slate-200 leading-relaxed mb-4">
                {profile.aiPersona.summary}
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-400 mr-2">Key Competencies:</span>
                {profile.aiPersona.keySkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages & Public Repos Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Top Languages Column */}
            <div className="rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-5 shadow-xl">
              <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-blue-400" />
                <span>Primary Ecosystem Languages</span>
              </h4>
              <div className="space-y-3">
                {profile.topLanguages.map((lang) => (
                  <div key={lang.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">{lang.name}</span>
                      <span className="text-slate-400">{lang.percentage}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Public Repositories List */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center justify-between">
                <span>Popular Repositories ({profile.recentRepos.length})</span>
                <span className="text-xs font-normal text-slate-400">Click to analyze repo architecture</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
                {profile.recentRepos.map((r) => (
                  <div
                    key={r.name}
                    className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h5 className="text-sm font-bold text-white group-hover:text-indigo-400 truncate">
                          {r.name}
                        </h5>
                        {onAnalyzeRepo && (
                          <button
                            onClick={() => onAnalyzeRepo(r.fullName)}
                            className="px-2 py-0.5 rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-[10px] font-bold flex items-center gap-1 shrink-0"
                          >
                            <span>Analyze</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                        {r.description || 'No description provided.'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
                      {r.language && (
                        <span className="font-semibold text-indigo-300">{r.language}</span>
                      )}
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-amber-400 font-semibold">
                          <Star className="w-3 h-3" />
                          <span>{r.stars}</span>
                        </span>
                        <span className="flex items-center gap-1 text-purple-400 font-semibold">
                          <GitFork className="w-3 h-3" />
                          <span>{r.forks}</span>
                        </span>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
