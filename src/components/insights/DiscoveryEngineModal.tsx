import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Eye, RefreshCw, AlertCircle, TrendingUp, Calendar, Zap } from 'lucide-react';
import { DiscoveryInsight } from '../../types/insight';
import { Receipt } from '../../types/receipt';
import { formatCurrency } from '../../utils/currencyUtils';

interface DiscoveryEngineProps {
  insights: DiscoveryInsight[];
  onSelectReceipt: (r: Receipt) => void;
}

export function DiscoveryEngine({
  insights,
  onSelectReceipt,
}: DiscoveryEngineProps) {
  const [activeInsightIndex, setActiveInsightIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);

  const currentInsight = insights[activeInsightIndex] || insights[0];

  const handleNextInsight = () => {
    setIsRotating(true);
    setTimeout(() => {
      setActiveInsightIndex((prev) => (prev + 1) % insights.length);
      setIsRotating(false);
    }, 200);
  };

  if (!currentInsight) return null;

  return (
    <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-6 md:p-8 space-y-6">
      {/* Top Banner with "DISCOVER SOMETHING" trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
              AUTONOMOUS DISCOVERY ENGINE
            </span>
          </div>
          <h2 className="font-editorial text-xl sm:text-2xl font-bold text-white mt-1">
            Uncovering Hidden Behavioral Signals
          </h2>
        </div>

        <button
          id="btn-discover-something"
          onClick={handleNextInsight}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 transition cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>DISCOVER SOMETHING</span>
          <RefreshCw className={`w-3.5 h-3.5 ml-1 ${isRotating ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* "DID YOU NOTICE THIS?" Spotlight Box */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentInsight.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="p-6 rounded-2xl bg-[#090d16] border border-cyan-500/30 space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-cyan-950 text-cyan-300 border border-cyan-800/50">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              {currentInsight.type.replace('_', ' ')}
            </span>

            <span className="text-xs font-mono text-slate-400">
              Signal {activeInsightIndex + 1} of {insights.length}
            </span>
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest text-cyan-400 font-mono font-semibold mb-1">
              DID YOU NOTICE THIS?
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-editorial text-white">
              {currentInsight.didYouNoticeThis}
            </h3>
            <p className="text-sm text-slate-300 font-light mt-2 leading-relaxed">
              {currentInsight.explanation}
            </p>
          </div>

          {/* Metric proof pill */}
          <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs font-mono text-slate-300">
            <span className="text-slate-400">Supporting Statistic:</span>
            <span className="text-cyan-300 font-semibold">{currentInsight.supportingStatistic}</span>
          </div>

          {/* Supporting Receipts */}
          {currentInsight.relevantReceipts.length > 0 && (
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2">
                Supporting Forensic Receipts ({currentInsight.relevantReceipts.length})
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {currentInsight.relevantReceipts.map((r: Receipt) => (
                  <div
                    key={r.id}
                    onClick={() => onSelectReceipt(r)}
                    className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition cursor-pointer flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-slate-200 truncate">
                        {r.category}: {r.subcategory || r.note || 'Entry'}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {r.rawDate.split(' ')[0]} · {r.mode}
                      </div>
                    </div>
                    <span className="font-mono text-xs font-semibold text-white shrink-0">
                      {formatCurrency(r.amount, r.currency)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Grid of All Discovered Insights */}
      <div>
        <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 font-semibold">
          All System Discoveries ({insights.length})
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {insights.map((ins, i) => (
            <div
              key={ins.id}
              onClick={() => setActiveInsightIndex(i)}
              className={`p-4 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                activeInsightIndex === i
                  ? 'bg-cyan-950/20 border-cyan-500/50'
                  : 'bg-slate-900/50 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
              }`}
            >
              <div>
                <span className="text-[10px] font-mono uppercase text-cyan-400">
                  {ins.type.replace('_', ' ')}
                </span>
                <h5 className="text-xs font-bold text-white mt-1 line-clamp-1">
                  {ins.title}
                </h5>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {ins.didYouNoticeThis}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400 truncate max-w-[160px]">{ins.supportingStatistic}</span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
