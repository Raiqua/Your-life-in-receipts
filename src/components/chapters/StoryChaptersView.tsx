import { useState } from 'react';
import { Bookmark, Sparkles, TrendingUp, Calendar, ChevronRight, CheckCircle2, ShoppingBag } from 'lucide-react';
import { StoryChapter } from '../../types/insight';
import { Receipt } from '../../types/receipt';
import { formatCurrency, formatCompactCurrency } from '../../utils/currencyUtils';

interface StoryChaptersViewProps {
  chapters: StoryChapter[];
  onSelectReceipt: (r: Receipt) => void;
}

export function StoryChaptersView({
  chapters,
  onSelectReceipt,
}: StoryChaptersViewProps) {
  const [selectedChapterId, setSelectedChapterId] = useState<string>(
    chapters[0]?.id || ''
  );

  const activeChapter = chapters.find((c) => c.id === selectedChapterId) || chapters[0];

  if (!activeChapter) return null;

  return (
    <div className="space-y-6">
      {/* Chapter timeline selector tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {chapters.map((chap, idx) => {
          const isSelected = chap.id === activeChapter.id;
          return (
            <button
              key={chap.id}
              onClick={() => setSelectedChapterId(chap.id)}
              className={`p-4 rounded-xl text-left border transition cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 border-cyan-500/60 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-900/40 border-slate-800 hover:bg-slate-900/70 hover:border-slate-700'
              }`}
            >
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-semibold block mb-1">
                  ACT {idx + 1}
                </span>
                <h4 className="text-xs font-bold text-white font-editorial truncate">
                  {chap.title.replace(/^Chapter \d+: /, '')}
                </h4>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>{chap.receiptCount} receipts</span>
                <span className="text-slate-300 font-medium">
                  {formatCompactCurrency(chap.totalSpending)}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Chapter Expanded Story Card */}
      <div className="p-6 md:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-wider mb-2">
              <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
              <span>{activeChapter.archetype}</span>
            </div>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-white">
              {activeChapter.title}
            </h2>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mt-1">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>{activeChapter.dateRangeFormatted}</span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-right">
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-400">TOTAL OUTFLOW</div>
              <div className="text-xl font-bold font-mono text-white mt-0.5">
                {formatCurrency(activeChapter.totalSpending)}
              </div>
            </div>
            {activeChapter.totalIncome > 0 && (
              <div>
                <div className="text-[10px] uppercase font-mono text-slate-400">RECORDED INFLOW</div>
                <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">
                  {formatCurrency(activeChapter.totalIncome)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Narrative Synthesis & Strict Empirical Proof */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-1">
                Forensic Chapter Summary
              </h4>
              <p className="text-sm text-slate-200 leading-relaxed font-light">
                {activeChapter.summary}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#090d16] border border-cyan-500/30 text-xs">
              <div className="text-cyan-400 font-mono font-semibold uppercase text-[10px] tracking-widest mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>DATA PROOF & VERIFIED METRICS</span>
              </div>
              <p className="text-slate-300 leading-relaxed font-light">
                {activeChapter.dataProof}
              </p>
            </div>
          </div>

          {/* Dominant Category Mix */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-3">
              Dominant Category Mix
            </h4>
            <div className="space-y-2.5">
              {activeChapter.dominantCategories.map((cat) => (
                <div key={cat.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-200 font-medium truncate max-w-[140px]">
                      {cat.category}
                    </span>
                    <span className="font-mono text-slate-400">
                      {cat.count} ({cat.percentage}%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-500"
                      style={{ width: `${Math.min(100, cat.percentage * 2)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Key Milestone Receipts in Chapter */}
        <div className="pt-4 border-t border-slate-800">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-3">
            Key Milestone Moments in this Era
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {activeChapter.keyReceipts.map((r) => (
              <div
                key={r.id}
                onClick={() => onSelectReceipt(r)}
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-cyan-500/40 transition cursor-pointer flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-white truncate">
                    {r.category}: {r.subcategory || r.note || 'Entry'}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {r.mode} · {r.rawDate.split(' ')[0]}
                  </div>
                </div>
                <span className="font-mono text-xs font-semibold text-cyan-400 shrink-0">
                  {formatCurrency(r.amount, r.currency)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
