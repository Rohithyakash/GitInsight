import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { TokenModal } from './components/TokenModal';
import { SearchSection } from './components/SearchSection';
import { RepoOverview } from './components/RepoOverview';
import { StatsGrid } from './components/StatsGrid';
import { AdditionalInfo } from './components/AdditionalInfo';
import { AiReviewSection } from './components/AiReviewSection';
import { TabsSection } from './components/TabsSection';
import { CompareView } from './components/CompareView';
import { DeveloperView } from './components/DeveloperView';
import { ExportModal } from './components/ExportModal';
import { fetchRepoAnalysis, getSavedToken } from './services/github';
import { FullRepoData } from './types';
import { AlertCircle, RefreshCw, Github, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'repo' | 'compare' | 'developer'>('repo');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  const [repoQuery, setRepoQuery] = useState('facebook/react');
  const [repoData, setRepoData] = useState<FullRepoData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync token status on start
  useEffect(() => {
    setHasToken(!!getSavedToken());
  }, []);

  // Initial load default repo
  useEffect(() => {
    handleSearchRepo('facebook/react');
  }, []);

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K, Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K -> Focus search bar
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (activeTab !== 'repo') {
          setActiveTab('repo');
        }
        setTimeout(() => {
          const searchInput = document.getElementById('repo-search-input');
          if (searchInput) {
            searchInput.focus();
            (searchInput as HTMLInputElement).select();
          }
        }, 50);
      }

      // Esc -> Close modals and clear active errors
      if (e.key === 'Escape') {
        if (isTokenModalOpen) setIsTokenModalOpen(false);
        if (isExportModalOpen) setIsExportModalOpen(false);
        if (errorMsg) setErrorMsg(null);

        const activeElem = document.activeElement as HTMLElement;
        if (activeElem && activeElem.tagName === 'INPUT') {
          activeElem.blur();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, isTokenModalOpen, isExportModalOpen, errorMsg]);

  const handleSearchRepo = async (targetRepo: string) => {
    if (!targetRepo.trim()) return;
    setIsLoading(true);
    setErrorMsg(null);
    setRepoQuery(targetRepo);
    try {
      const data = await fetchRepoAnalysis(targetRepo);
      setRepoData(data);
      setActiveTab('repo');
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while fetching repository analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTokenChange = () => {
    setHasToken(!!getSavedToken());
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans relative overflow-x-hidden ${
      theme === 'dark'
        ? 'bg-[#05060f] text-slate-100'
        : 'bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-50 text-slate-900'
    }`}>
      
      {/* Ambient Background Glows */}
      {theme === 'dark' && (
        <>
          <div className="fixed top-[-10%] left-[-10%] w-[45%] h-[45%] bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none z-0" />
          <div className="fixed bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-purple-600/10 blur-[130px] rounded-full pointer-events-none z-0" />
        </>
      )}

      {/* Top Navigation Bar */}
      <div className="relative z-10">
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenTokenModal={() => setIsTokenModalOpen(true)}
          hasToken={hasToken}
          theme={theme}
          setTheme={setTheme}
        />
      </div>

      {/* Main View Router */}
      <main className="pb-16 relative z-10">
        
        {activeTab === 'repo' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Search Input Bar */}
            <SearchSection
              onSearch={handleSearchRepo}
              isLoading={isLoading}
            />

            {/* Error Banner */}
            {errorMsg && (
              <div className="max-w-4xl mx-auto mb-8 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-center justify-between gap-3 shadow-xl backdrop-blur-xl animate-fadeIn">
                <div className="flex items-center gap-2 min-w-0">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  <span className="truncate">{errorMsg}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleSearchRepo(repoQuery)}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-semibold flex items-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Retry</span>
                  </button>
                  <button
                    onClick={() => setErrorMsg(null)}
                    title="Dismiss (Esc)"
                    className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Loading Skeleton */}
            {isLoading && !repoData && (
              <div className="space-y-6 animate-pulse max-w-7xl mx-auto my-8">
                <div className="h-44 rounded-3xl bg-white/[0.03] border border-white/10" />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-28 rounded-2xl bg-white/[0.03] border border-white/10" />
                  ))}
                </div>
                <div className="h-64 rounded-3xl bg-white/[0.03] border border-white/10" />
              </div>
            )}

            {/* Repository Analysis Output */}
            {repoData && !isLoading && (
              <div className="animate-fadeIn">
                
                {/* 1. Repo Overview Card */}
                <RepoOverview
                  info={repoData.info}
                  onOpenExport={() => setIsExportModalOpen(true)}
                />

                {/* 2. Stats Grid Cards */}
                <StatsGrid stats={repoData.info.stats} />

                {/* 3. Additional Metadata Info */}
                <AdditionalInfo
                  info={repoData.info}
                  issueSummary={repoData.issueSummary}
                />

                {/* 4. AI Architectural Review Section */}
                <AiReviewSection review={repoData.aiReview} />

                {/* 5. Sub-tabs (Charts, Contributors, README) */}
                <TabsSection
                  languages={repoData.languages}
                  issueSummary={repoData.issueSummary}
                  commits={repoData.recentCommits}
                  stats={repoData.info.stats}
                  contributors={repoData.contributors}
                  readmeContent={repoData.readmeContent}
                />

              </div>
            )}

          </div>
        )}

        {/* Compare Tab */}
        {activeTab === 'compare' && (
          <CompareView />
        )}

        {/* Developer Tab */}
        {activeTab === 'developer' && (
          <DeveloperView
            onAnalyzeRepo={(repoFullName) => handleSearchRepo(repoFullName)}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 py-6 text-center text-xs text-slate-500 relative z-10 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Github className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-400">GitHub Analyzer</span>
            <span>— SaaS Developer Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-slate-500">Shortcuts: <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px]">⌘K</kbd> Search • <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px]">Esc</kbd> Close/Dismiss</span>
            <span>Powered by Gemini API & GitHub REST API</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <TokenModal
        isOpen={isTokenModalOpen}
        onClose={() => setIsTokenModalOpen(false)}
        onTokenChange={handleTokenChange}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        repoData={repoData}
      />

    </div>
  );
}
