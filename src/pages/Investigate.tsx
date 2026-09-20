import { useState, useEffect } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Award,
  FileText,
  AlertOctagon,
  Clock,
  Compass,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { Receipt, DatasetSummary } from '../types/receipt';
import { ForensicInterrogator } from '../components/investigation/ForensicInterrogator';
import { MacroHistoricalTimeline } from '../components/charts/MacroHistoricalTimeline';
import { fetchAIAnomalies, AnomalyReport } from '../services/aiService';
import { formatShortDate } from '../utils/dateUtils';

interface InvestigatePageProps {
  receipts: Receipt[];
  summary: DatasetSummary;
  onSelectReceipt: (r: Receipt) => void;
  onOpenDossier: () => void;
}

export function InvestigatePage({
  receipts,
  summary,
  onSelectReceipt,
  onOpenDossier,
}: InvestigatePageProps) {
  const [anomalies, setAnomalies] = useState<AnomalyReport[]>([]);
  const [loadingAnomalies, setLoadingAnomalies] = useState(false);

  useEffect(() => {
    setLoadingAnomalies(true);
    fetchAIAnomalies(receipts)
      .then((data) => setAnomalies(data))
      .finally(() => setLoadingAnomalies(false));
  }, [receipts]);

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Header */}
      <div className="relative p-6 sm:p-10 rounded-3xl bg-slate-900/40 border border-slate-800 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI FORENSIC DETECTIVE & ANTHROPOLOGY</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold font-editorial text-white tracking-tight leading-tight">
            Interrogate The Secret Life.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
            Every transaction is an unintentional confession of priority, anxiety, love, and survival. Powered by Gemini 3.8 Flash, cross-examine 2,461 receipts to reconstruct the psychological and biographical reality of the anonymous soul behind the ledger.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenDossier}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white text-xs font-semibold uppercase tracking-wider transition cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              <Award className="w-4 h-4" />
              <span>Open Official Life Dossier</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive AI Interrogator */}
      <section>
        <ForensicInterrogator
          receipts={receipts}
          summary={summary}
          onSelectReceipt={onSelectReceipt}
        />
      </section>

      {/* Macro Historical Timeline */}
      <section>
        <MacroHistoricalTimeline
          receipts={receipts}
          onSelectReceipt={onSelectReceipt}
        />
      </section>

      {/* AI Anomaly Radar */}
      <section className="p-6 md:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-rose-400" />
              <h3 className="font-editorial text-lg font-bold text-white tracking-wide">
                AI ANOMALY RADAR: MYSTERIES & TURNING POINTS
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Identified statistical deviations and extreme moments where life broke from routine.
            </p>
          </div>

          <span className="text-xs font-mono text-cyan-400">
            {anomalies.length} Critical Deviations Detected
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {anomalies.map((a, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                  <span>{a.date}</span>
                  <span className="text-rose-400 font-bold">{a.amount}</span>
                </div>
                <h4 className="text-sm font-bold text-white font-editorial mb-1">
                  {a.headline}
                </h4>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block mb-2">
                  {a.category}
                </span>
                <p className="text-xs text-slate-300 font-light leading-relaxed">
                  {a.forensicHypothesis}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/60 text-[10px] font-mono text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Forensically Verified</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
