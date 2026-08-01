import React from 'react';
import { AiReview } from '../types';
import { Sparkles, CheckCircle2, AlertTriangle, Lightbulb, Activity, FileText, ShieldAlert, Users } from 'lucide-react';

interface AiReviewSectionProps {
  review: AiReview;
}

export const AiReviewSection: React.FC<AiReviewSectionProps> = ({ review }) => {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (score >= 70) return 'text-indigo-400 border-indigo-500/40 bg-indigo-500/10';
    if (score >= 50) return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
  };

  const getStrokeColor = (score: number) => {
    if (score >= 85) return '#10B981';
    if (score >= 70) return '#6366F1';
    if (score >= 50) return '#F59E0B';
    return '#F43F5E';
  };

  return (
    <div className="w-full rounded-2xl bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-950/90 backdrop-blur-xl border border-indigo-500/30 p-6 shadow-2xl shadow-indigo-950/40 mb-8 relative overflow-hidden">
      
      {/* Background Accent Mesh */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-600/10 via-purple-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10 pb-6 border-b border-slate-800/80">
        
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white tracking-tight">AI Architectural Review</h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider border border-indigo-500/30">
                <Sparkles className="w-3 h-3 text-amber-300 animate-spin" />
                <span>AI Powered</span>
              </span>
            </div>
            <p className="text-xs text-slate-400">Gemini-powered structural health & maintenance diagnostics</p>
          </div>
        </div>

        {/* Health Score Wheel & Badge */}
        <div className="flex items-center gap-4 bg-slate-950/60 p-3 rounded-xl border border-slate-800 self-start sm:self-auto">
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="28"
                cy="28"
                r="22"
                className="text-slate-800 stroke-current"
                strokeWidth="4"
                fill="transparent"
              />
              <circle
                cx="28"
                cy="28"
                r="22"
                stroke={getStrokeColor(review.healthScore)}
                strokeWidth="4"
                strokeDasharray={138}
                strokeDashoffset={138 - (138 * review.healthScore) / 100}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <span className="absolute text-sm font-extrabold text-white">{review.healthScore}</span>
          </div>

          <div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Health Score</div>
            <div className={`inline-block px-2.5 py-0.5 text-xs font-bold rounded-lg border mt-0.5 ${getScoreColor(review.healthScore)}`}>
              {review.statusLabel} ({review.healthScore}/100)
            </div>
          </div>
        </div>

      </div>

      {/* Executive Summary */}
      <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-6 relative z-10">
        <h4 className="text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-indigo-400" />
          <span>Executive Summary</span>
        </h4>
        <p className="text-sm text-slate-200 leading-relaxed">
          {review.executiveSummary}
        </p>
      </div>

      {/* Three Cards Grid (Strengths, Risks, Recommendations) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6 relative z-10">
        
        {/* Key Strengths (Green) */}
        <div className="rounded-2xl bg-slate-950/60 border border-emerald-500/30 p-5 relative overflow-hidden shadow-lg group hover:border-emerald-500/50 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center gap-2.5 mb-4">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white">Key Strengths</h4>
          </div>
          <div className="space-y-3.5">
            {review.strengths.map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span>{item.title}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pl-3">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance Risks (Red) */}
        <div className="rounded-2xl bg-slate-950/60 border border-rose-500/30 p-5 relative overflow-hidden shadow-lg group hover:border-rose-500/50 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center gap-2.5 mb-4">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white">Maintenance Risks</h4>
          </div>
          <div className="space-y-3.5">
            {review.risks.map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                  <span>{item.title}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pl-3">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations (Blue) */}
        <div className="rounded-2xl bg-slate-950/60 border border-blue-500/30 p-5 relative overflow-hidden shadow-lg group hover:border-blue-500/50 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center gap-2.5 mb-4">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Lightbulb className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white">Recommendations</h4>
          </div>
          <div className="space-y-3.5">
            {review.recommendations.map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                  <span>{item.title}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pl-3">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Signal Gauges Footer */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10 pt-4 border-t border-slate-800/80">
        
        <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
          <div className="flex items-center justify-between mb-1 text-xs">
            <span className="text-slate-400 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span>Documentation</span>
            </span>
            <span className="font-bold text-white">{review.metrics.documentationQuality}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
              style={{ width: `${review.metrics.documentationQuality}%` }}
            />
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
          <div className="flex items-center justify-between mb-1 text-xs">
            <span className="text-slate-400 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
              <span>Test Signals</span>
            </span>
            <span className="font-bold text-white">{review.metrics.testCoverageSignal}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
              style={{ width: `${review.metrics.testCoverageSignal}%` }}
            />
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
          <div className="flex items-center justify-between mb-1 text-xs">
            <span className="text-slate-400 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Liveliness</span>
            </span>
            <span className="font-bold text-white">{review.metrics.maintenanceLiveliness}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
              style={{ width: `${review.metrics.maintenanceLiveliness}%` }}
            />
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
          <div className="flex items-center justify-between mb-1 text-xs">
            <span className="text-slate-400 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>Community</span>
            </span>
            <span className="font-bold text-white">{review.metrics.communityEngagement}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
              style={{ width: `${review.metrics.communityEngagement}%` }}
            />
          </div>
        </div>

      </div>

    </div>
  );
};
