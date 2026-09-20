import { useState } from 'react';
import {
  Sparkles,
  Send,
  Loader2,
  ShieldCheck,
  HelpCircle,
  Clock,
  Compass,
  Heart,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Receipt as ReceiptIcon,
} from 'lucide-react';
import { Receipt, DatasetSummary } from '../../types/receipt';
import { interrogateLifeArchive, InterrogationResult } from '../../services/aiService';
import { formatCurrency } from '../../utils/currencyUtils';
import { playDiscoveryChime } from '../../utils/audioUtils';

interface ForensicInterrogatorProps {
  receipts: Receipt[];
  summary: DatasetSummary;
  onSelectReceipt: (r: Receipt) => void;
}

const PRESET_QUESTIONS = [
  {
    icon: Compass,
    label: 'Who was this person?',
    query: 'Who was this person, what was their profession, and what kind of life did they live?',
  },
  {
    icon: Heart,
    label: 'Family & Dependents',
    query: 'What evidence is there of their family, dependents, spouse, or parents in the ledger?',
  },
  {
    icon: AlertTriangle,
    label: 'The 2020 COVID Shock',
    query: 'How did the 2020 COVID-19 pandemic transform their daily life, transit, and domestic habits?',
  },
  {
    icon: TrendingUp,
    label: '2016 Demonetization',
    query: 'Trace the 2016 Indian Demonetization shockwave through their transition from cash to digital banking.',
  },
  {
    icon: Clock,
    label: 'Commute & Daily Ritual',
    query: 'Where did they commute to and what was their exact morning transit ritual?',
  },
  {
    icon: ShieldCheck,
    label: 'Sacrifices & Security',
    query: 'What was their single greatest financial struggle, discipline, or sacrifice evidenced by the receipts?',
  },
];

export function ForensicInterrogator({
  receipts,
  summary,
  onSelectReceipt,
}: ForensicInterrogatorProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InterrogationResult | null>(null);

  const handleAsk = async (questionText: string) => {
    if (!questionText.trim() || loading) return;
    setLoading(true);
    try {
      const data = await interrogateLifeArchive(questionText, summary, receipts);
      setResult(data);
      playDiscoveryChime();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h3 className="font-editorial text-xl font-bold text-white tracking-wide">
              AI FORENSIC LIFE INTERROGATOR
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Powered by Gemini 2.5 Flash. Ask any investigative question to decode the human story behind these 2,461 receipts.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono bg-cyan-950/70 border border-cyan-500/30 text-cyan-300">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Full Forensic Evidence Grounding</span>
        </div>
      </div>

      {/* Preset Inquiries */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
          CURATED FORENSIC INQUIRIES
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {PRESET_QUESTIONS.map((q) => {
            const Icon = q.icon;
            return (
              <button
                key={q.label}
                onClick={() => {
                  setQuery(q.query);
                  handleAsk(q.query);
                }}
                disabled={loading}
                className="p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 text-left transition group cursor-pointer disabled:opacity-50"
              >
                <Icon className="w-4 h-4 text-cyan-400 mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium text-slate-300 group-hover:text-white block line-clamp-1">
                  {q.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Query Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAsk(query);
        }}
        className="flex gap-2"
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything about their life (e.g., 'Did they ever travel on vacation?', 'What was their diet?')..."
            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-white text-xs font-semibold uppercase tracking-wider transition cursor-pointer shrink-0"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <span>Interrogate</span>
              <Send className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      {/* Result Display */}
      {result && (
        <div className="p-6 rounded-2xl bg-[#0b0f19] border border-cyan-500/30 space-y-6 shadow-xl animate-fade-in">
          {/* Header & Confidence */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                  {result.identityArchetype}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  via {result.source === 'gemini' ? 'Gemini 2.5 Flash' : 'Forensic Heuristic Engine'}
                </span>
              </div>
              <h4 className="text-xl font-bold font-editorial text-white mt-1">
                {result.title}
              </h4>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Confidence: {Math.round(result.confidenceScore * 100)}%</span>
            </div>
          </div>

          {/* Narrative Synthesis */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
              DEDUCTIVE SYNTHESIS
            </span>
            <p className="text-sm text-slate-200 leading-relaxed font-light whitespace-pre-line">
              {result.synthesis}
            </p>
          </div>

          {/* Key Findings */}
          <div className="space-y-2 pt-2 border-t border-slate-800/60">
            <span className="text-[10px] font-mono uppercase text-cyan-400 tracking-wider font-semibold">
              KEY FORENSIC OBSERVATIONS
            </span>
            <ul className="space-y-2 text-xs text-slate-300">
              {result.keyFindings.map((finding, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contextual & Emotional Layers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800/60 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
              <span className="text-[10px] font-mono uppercase text-rose-400 block font-medium">
                EMOTIONAL UNDERCURRENT
              </span>
              <p className="text-slate-300 font-light">
                {result.emotionalUndercurrent}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
              <span className="text-[10px] font-mono uppercase text-amber-400 block font-medium">
                HISTORICAL CONTEXT
              </span>
              <p className="text-slate-300 font-light">
                {result.historicalConnection}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
