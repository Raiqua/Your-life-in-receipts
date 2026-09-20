import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Network, Play, ChevronRight, ChevronLeft, Sparkles, ArrowRight, CheckCircle2, Clock, Info } from 'lucide-react';
import { MemoryThread } from '../../types/connection';
import { Receipt } from '../../types/receipt';
import { formatCurrency } from '../../utils/currencyUtils';
import { formatFriendlyDate } from '../../utils/dateUtils';

interface MemoryThreadViewerProps {
  threads: MemoryThread[];
  onSelectReceipt: (r: Receipt) => void;
}

export function MemoryThreadViewer({
  threads,
  onSelectReceipt,
}: MemoryThreadViewerProps) {
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);

  const activeThread = threads.find((t) => t.id === activeThreadId) || null;

  const handleOpenThread = (threadId: string) => {
    setActiveThreadId(threadId);
    setActiveStepIdx(0);
  };

  const handleCloseThread = () => {
    setActiveThreadId(null);
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {threads.map((thread) => {
          return (
            <div
              key={thread.id}
              className="flex flex-col justify-between p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all duration-200 shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono uppercase tracking-wider bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    {thread.detectedPattern}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {thread.stats.receiptCount} receipts
                  </span>
                </div>

                <h3 className="font-editorial text-lg font-bold text-white mb-1.5">
                  {thread.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-light mb-4">
                  {thread.tagline}
                </p>

                {/* Flow preview pills */}
                <div className="flex flex-wrap items-center gap-1.5 mb-4 py-2 px-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  {thread.receipts.slice(0, 4).map((r, i) => (
                    <div key={r.id} className="flex items-center gap-1 text-xs">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-medium truncate max-w-[90px]">
                        {r.category}
                      </span>
                      {i < Math.min(thread.receipts.length - 1, 3) && (
                        <ArrowRight className="w-3 h-3 text-cyan-400/70 shrink-0" />
                      )}
                    </div>
                  ))}
                  {thread.receipts.length > 4 && (
                    <span className="text-[10px] text-slate-400 font-mono">
                      +{thread.receipts.length - 4} more
                    </span>
                  )}
                </div>

                {/* Explicit Reason Box */}
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400 leading-relaxed flex items-start gap-2">
                  <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{thread.explanation}</span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">
                  Vol: {formatCurrency(thread.stats.totalAmount)}
                </span>

                <button
                  onClick={() => handleOpenThread(thread.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 text-xs font-semibold transition cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-cyan-400" />
                  <span>EXPLORE THREAD</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Thread Walkthrough Modal / Step Viewer */}
      {activeThread && (
        <AnimatePresence>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-2xl p-6 md:p-8 rounded-2xl bg-[#0b101c] border border-cyan-500/40 shadow-2xl text-slate-200"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-cyan-950 border border-cyan-800 text-cyan-400">
                      MEMORY THREAD INVESTIGATION
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      Receipt {activeStepIdx + 1} of {activeThread.receipts.length}
                    </span>
                  </div>
                  <h3 className="font-editorial text-xl font-bold text-white mt-1">
                    {activeThread.title}
                  </h3>
                </div>

                <button
                  onClick={handleCloseThread}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 transition"
                >
                  Close Thread
                </button>
              </div>

              {/* Step indicator sequence dots */}
              <div className="flex items-center gap-2 my-5 overflow-x-auto py-1">
                {activeThread.receipts.map((r, idx) => (
                  <button
                    key={r.id}
                    onClick={() => setActiveStepIdx(idx)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono transition whitespace-nowrap cursor-pointer ${
                      activeStepIdx === idx
                        ? 'bg-cyan-500 text-white font-semibold shadow-md shadow-cyan-500/20'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{idx + 1}.</span>
                    <span>{r.category}</span>
                  </button>
                ))}
              </div>

              {/* Current Receipt Spotlight Card */}
              {(() => {
                const currentReceipt = activeThread.receipts[activeStepIdx];
                return (
                  <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-300 font-medium text-xs border border-cyan-800/50">
                        {currentReceipt.category} · {currentReceipt.subcategory || 'General'}
                      </span>
                      <span className="font-mono text-xs text-slate-400">
                        {formatFriendlyDate(currentReceipt.date)}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-white">
                        {currentReceipt.note || currentReceipt.merchant || currentReceipt.subcategory || 'Transaction'}
                      </h4>
                      <div className="flex items-center gap-4 mt-2 font-mono text-sm">
                        <span className="text-xl font-bold text-cyan-400">
                          {formatCurrency(currentReceipt.amount, currentReceipt.currency)}
                        </span>
                        <span className="text-xs text-slate-400 uppercase">
                          Via {currentReceipt.mode}
                        </span>
                      </div>
                    </div>

                    {/* WHY THIS STEP CONNECTS (MANDATORY REQUIREMENT) */}
                    <div className="p-3.5 rounded-lg bg-[#07090e] border border-cyan-500/30 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 text-cyan-400 font-mono font-semibold uppercase text-[10px]">
                        <Info className="w-3.5 h-3.5" />
                        <span>WHY THIS CONNECTION WAS FORMED</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed font-light">
                        {activeThread.explanation}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-end">
                      <button
                        onClick={() => {
                          onSelectReceipt(currentReceipt);
                          handleCloseThread();
                        }}
                        className="text-xs text-cyan-400 hover:text-cyan-300 underline font-mono flex items-center gap-1"
                      >
                        Open Full Digital Receipt →
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* Prev / Next controls */}
              <div className="flex items-center justify-between pt-5 border-t border-slate-800 mt-5">
                <button
                  disabled={activeStepIdx === 0}
                  onClick={() => setActiveStepIdx((i) => Math.max(0, i - 1))}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-xs font-medium text-slate-300 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous Receipt</span>
                </button>

                <button
                  disabled={activeStepIdx === activeThread.receipts.length - 1}
                  onClick={() =>
                    setActiveStepIdx((i) =>
                      Math.min(activeThread.receipts.length - 1, i + 1)
                    )
                  }
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-30 text-xs font-semibold text-white transition shadow"
                >
                  <span>Next Moment</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}
