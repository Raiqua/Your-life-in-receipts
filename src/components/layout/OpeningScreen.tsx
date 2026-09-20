import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, FastForward, Sparkles, Compass, ShieldCheck } from 'lucide-react';
import { formatCompactCurrency } from '../../utils/currencyUtils';

interface OpeningScreenProps {
  onEnter: () => void;
  recordCount: number;
  totalVolume: number;
}

export function OpeningScreen({ onEnter, recordCount, totalVolume }: OpeningScreenProps) {
  const [isExiting, setIsExiting] = useState(false);

  const handleStart = () => {
    setIsExiting(true);
    setTimeout(onEnter, 700);
  };

  const handleSkip = () => {
    onEnter();
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: 'blur(12px)' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#07090e] px-4 overflow-hidden"
        >
          {/* Subtle animated background grid & radial glow */}
          <div className="absolute inset-0 bg-cinematic-grid opacity-30 pointer-events-none" />
          <div className="absolute w-[800px] h-[800px] rounded-full bg-radial-glow opacity-40 blur-3xl pointer-events-none -top-48" />

          {/* Floating animated receipt fragments */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              animate={{ y: [-10, 15, -10], rotate: [-4, -1, -4] }}
              transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
              className="absolute top-16 left-8 md:left-24 p-3 bg-slate-900/60 border border-slate-700/30 rounded-lg text-xs font-mono text-slate-400 backdrop-blur-md shadow-2xl opacity-40 max-w-[200px]"
            >
              <div className="text-[10px] uppercase text-cyan-400 font-semibold mb-1">FOOD · SNACKS</div>
              <div className="text-slate-300 truncate">Idli medu Vada mix</div>
              <div className="flex justify-between mt-1 text-[11px] text-slate-400">
                <span>₹60</span>
                <span>20 Sep 2018</span>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [12, -15, 12], rotate: [5, 2, 5] }}
              transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
              className="absolute top-28 right-8 md:right-32 p-3 bg-slate-900/60 border border-slate-700/30 rounded-lg text-xs font-mono text-slate-400 backdrop-blur-md shadow-2xl opacity-40 max-w-[220px]"
            >
              <div className="text-[10px] uppercase text-emerald-400 font-semibold mb-1">INVESTMENT</div>
              <div className="text-slate-300 truncate">Small Cap Fund SIP</div>
              <div className="flex justify-between mt-1 text-[11px] text-slate-400">
                <span>₹5,000</span>
                <span>Auto-Debit</span>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [-15, 10, -15], rotate: [-6, -2, -6] }}
              transition={{ repeat: Infinity, duration: 9, ease: 'easeInOut' }}
              className="absolute bottom-20 left-12 md:left-40 p-3 bg-slate-900/60 border border-slate-700/30 rounded-lg text-xs font-mono text-slate-400 backdrop-blur-md shadow-2xl opacity-35 max-w-[220px]"
            >
              <div className="text-[10px] uppercase text-amber-400 font-semibold mb-1">FESTIVALS</div>
              <div className="text-slate-300 truncate">Ganesh Idol Pujan</div>
              <div className="flex justify-between mt-1 text-[11px] text-slate-400">
                <span>₹251</span>
                <span>Cash</span>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [8, -12, 8], rotate: [4, 7, 4] }}
              transition={{ repeat: Infinity, duration: 11, ease: 'easeInOut' }}
              className="absolute bottom-24 right-12 md:right-44 p-3 bg-slate-900/60 border border-slate-700/30 rounded-lg text-xs font-mono text-slate-400 backdrop-blur-md shadow-2xl opacity-35 max-w-[210px]"
            >
              <div className="text-[10px] uppercase text-violet-400 font-semibold mb-1">TRANSIT</div>
              <div className="text-slate-300 truncate">Station Suburban Train</div>
              <div className="flex justify-between mt-1 text-[11px] text-slate-400">
                <span>₹30</span>
                <span>Commute</span>
              </div>
            </motion.div>
          </div>

          {/* Central Cinematic Content */}
          <div className="relative z-10 max-w-3xl text-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.8 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono tracking-widest uppercase mb-6"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Life Ledger Investigation</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6 font-editorial drop-shadow-lg"
            >
              YOUR LIFE, IN RECEIPTS
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.8 }}
              className="text-lg sm:text-2xl text-slate-300 font-light leading-relaxed mb-4 max-w-xl mx-auto"
            >
              <span className="text-white font-medium">{recordCount > 0 ? recordCount.toLocaleString() : '2,461'} moments.</span>
              <br />
              One life hiding between the numbers.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-sm text-slate-400 max-w-md mx-auto mb-10"
            >
              Not a financial dashboard. An interactive personal archive transforming raw purchases into patterns, memory threads, and human narrative.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.75, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button
                id="btn-begin-journey"
                onClick={handleStart}
                className="group flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-base shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <Compass className="w-5 h-5 transition-transform group-hover:rotate-45" />
                <span>BEGIN THE JOURNEY →</span>
              </button>

              <button
                id="btn-skip-intro"
                onClick={handleSkip}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/50 text-sm font-medium transition cursor-pointer"
                title="Skip opening animation"
              >
                <FastForward className="w-4 h-4" />
                <span>Skip intro</span>
              </button>
            </motion.div>

            {/* Micro proof badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="flex items-center justify-center gap-6 mt-12 text-xs text-slate-400 font-mono"
            >
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Client-side Engine</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-slate-700" />
              <div>
                <span>Volume: </span>
                <span className="text-slate-300 font-semibold">{formatCompactCurrency(totalVolume)}</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-slate-700" />
              <div>
                <span>Records: </span>
                <span className="text-slate-300 font-semibold">{recordCount.toLocaleString()}</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
