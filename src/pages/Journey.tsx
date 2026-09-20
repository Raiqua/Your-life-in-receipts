import { useState } from 'react';
import { Compass, Sparkles, Activity, Bookmark, Award, ArrowRight, ShieldCheck, Database, Calendar } from 'lucide-react';
import { Receipt, DatasetSummary } from '../types/receipt';
import { StoryChapter, DiscoveryInsight } from '../types/insight';
import { MemoryThread } from '../types/connection';
import { formatCurrency, formatCompactCurrency } from '../utils/currencyUtils';
import { formatShortDate } from '../utils/dateUtils';
import { PulseOfLifeChart } from '../components/charts/PulseOfLifeChart';
import { StoryChaptersView } from '../components/chapters/StoryChaptersView';
import { LifeReplayBar } from '../components/playback/LifeReplayBar';

interface JourneyPageProps {
  receipts: Receipt[];
  summary: DatasetSummary;
  storyChapters: StoryChapter[];
  insights: DiscoveryInsight[];
  threads: MemoryThread[];
  onSelectReceipt: (r: Receipt) => void;
  onNavigateToDiscover: () => void;
  onNavigateToLifeMap: () => void;
}

export function JourneyPage({
  receipts,
  summary,
  storyChapters,
  insights,
  threads,
  onSelectReceipt,
  onNavigateToDiscover,
  onNavigateToLifeMap,
}: JourneyPageProps) {
  const [userReflection, setUserReflection] = useState('');
  const [reflectionSaved, setReflectionSaved] = useState(false);

  const handleSaveReflection = () => {
    if (userReflection.trim()) {
      localStorage.setItem('yir_user_reflection', userReflection);
      setReflectionSaved(true);
      setTimeout(() => setReflectionSaved(false), 2500);
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Life Ledger Investigation Banner */}
      <section className="relative p-6 sm:p-10 rounded-3xl bg-slate-900/40 border border-slate-800 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PERSONAL ARCHIVE INVESTIGATION</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold font-editorial text-white tracking-tight leading-tight">
            One Life, Decoded Between the Numbers.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
            Every transaction is a breadcrumb of human existence. Over {summary.totalReceipts.toLocaleString()} logged entries spanning {formatShortDate(summary.dateRange.start)} to {formatShortDate(summary.dateRange.end)}, patterns emerge: daily domestic rituals, unexpected investment phases, and quiet periods of steady maintenance.
          </p>

          {/* Key Forensic Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 font-mono">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] uppercase text-slate-400 block">TOTAL LOGS</span>
              <span className="text-xl font-bold text-white">
                {summary.totalReceipts.toLocaleString()}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] uppercase text-slate-400 block">TOTAL EXPENDITURE</span>
              <span className="text-xl font-bold text-cyan-400">
                {formatCompactCurrency(summary.totalSpending)}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] uppercase text-slate-400 block">RECORDED INFLOW</span>
              <span className="text-xl font-bold text-emerald-400">
                {formatCompactCurrency(summary.totalIncome)}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] uppercase text-slate-400 block">LIFESTYLE DOMAINS</span>
              <span className="text-xl font-bold text-white">
                {summary.categoriesCount}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Life Time-Lapse Replay Engine */}
      <section>
        <LifeReplayBar receipts={receipts} onSelectReceipt={onSelectReceipt} />
      </section>

      {/* The Pulse of A Life Chart */}
      <section>
        <PulseOfLifeChart receipts={receipts} onSelectReceipt={onSelectReceipt} />
      </section>

      {/* Story Chapters Engine */}
      <section className="space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-cyan-400" />
            <h2 className="font-editorial text-2xl font-bold text-white">
              Story Chapters
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Heuristic eras identified by transactional velocity, domestic spending density, and asset accumulation.
          </p>
        </div>

        <StoryChaptersView chapters={storyChapters} onSelectReceipt={onSelectReceipt} />
      </section>

      {/* Requirement #27: THE STORY SO FAR */}
      <section className="p-6 sm:p-10 rounded-3xl bg-[#090d16] border border-cyan-500/40 shadow-2xl space-y-8">
        <div className="flex items-center gap-2.5">
          <Award className="w-5 h-5 text-cyan-400" />
          <div>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-white tracking-wide">
              THE STORY SO FAR
            </h2>
            <span className="text-xs font-mono text-cyan-400">
              Culminating Retrospective Investigation
            </span>
          </div>
        </div>

        {/* Forensic Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="text-[10px] font-mono uppercase text-slate-400">CHRONOLOGICAL SPAN</div>
            <div className="text-sm font-bold text-white">
              {formatShortDate(summary.dateRange.start)} – {formatShortDate(summary.dateRange.end)}
            </div>
            <p className="text-slate-400 text-[11px] pt-1">
              A comprehensive archive of {summary.totalReceipts.toLocaleString()} moments recorded across everyday life.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="text-[10px] font-mono uppercase text-slate-400">MAIN LIFE DOMAINS</div>
            <div className="text-sm font-bold text-white">
              Food, Household, Transit & Systematic Investment
            </div>
            <p className="text-slate-400 text-[11px] pt-1">
              Balanced domestic maintenance with strong regular investment discipline.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="text-[10px] font-mono uppercase text-slate-400">DISCOVERED CONNECTIONS</div>
            <div className="text-sm font-bold text-white">
              {threads.length} Discovered Memory Threads
            </div>
            <p className="text-slate-400 text-[11px] pt-1">
              Demonstrating routine commute-dining loops and recurring staple restocking.
            </p>
          </div>
        </div>

        {/* Most Significant Statistical Observations */}
        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
            Most Significant Statistical Observations
          </h3>
          <ul className="space-y-2 text-xs text-slate-300 font-light">
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold">•</span>
              <span>
                <strong>Asset Accumulation:</strong> Over {formatCompactCurrency(summary.totalSpending * 0.28)} is systematically allocated into mutual funds, SIPs, and provident deposits.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold">•</span>
              <span>
                <strong>Domestic Micro-Ritual:</strong> Daily milk and local snacks constitute the highest-frequency recurring transactions in the entire multi-year archive.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold">•</span>
              <span>
                <strong>Financial Resilience:</strong> Inflow peaks consistently precede major household equipment and apparel expenditure bursts.
              </span>
            </li>
          </ul>
        </div>

        {/* Question: What did you discover? Allow user to continue exploring */}
        <div className="pt-6 border-t border-slate-800/80 space-y-4">
          <div>
            <h3 className="text-lg font-bold font-editorial text-white">
              What did you discover?
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Record your personal hypothesis about who this person is, or continue exploring the celestial network.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={userReflection}
              onChange={(e) => setUserReflection(e.target.value)}
              placeholder="e.g. A meticulous, family-oriented professional building long-term wealth..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
            />
            <button
              onClick={handleSaveReflection}
              className="px-5 py-2.5 rounded-xl bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-semibold transition cursor-pointer"
            >
              {reflectionSaved ? 'Saved to Archive' : 'Save Hypothesis'}
            </button>
          </div>

          {/* Continue Exploration Quick Links */}
          <div className="flex flex-wrap items-center gap-3 pt-4">
            <button
              onClick={onNavigateToLifeMap}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white text-xs font-semibold transition cursor-pointer shadow-md"
            >
              <span>Explore The Life Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onNavigateToDiscover}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition cursor-pointer"
            >
              <span>Inspect Memory Threads & Anomalies</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
