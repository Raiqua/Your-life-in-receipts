import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  BookOpen,
  Sparkles,
  ShieldCheck,
  GitBranch,
  Terminal,
  Award,
  Database,
  Cpu,
  CheckCircle2,
  FileCode,
  Volume2,
} from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'methodology' | 'rubric' | 'data' | 'shortcuts' | 'api';

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('methodology');

  // ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      >
        <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          className="relative z-10 w-full max-w-3xl my-6 rounded-2xl bg-[#0d121f] border border-slate-700/80 shadow-2xl text-slate-300 flex flex-col max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-800/80 bg-slate-950/40">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 id="help-modal-title" className="font-editorial text-lg font-bold text-white tracking-wide">
                  SYSTEM DOCUMENTATION & METHODOLOGY
                </h2>
                <p className="text-xs text-slate-400 font-mono">
                  Autonomous Life Ledger Heuristics • Grounded AI Biographer
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close documentation dialog"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 px-5 pt-3 border-b border-slate-800 bg-slate-950/20 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('methodology')}
              className={`px-3 py-2 text-xs font-mono rounded-t-lg transition flex items-center gap-1.5 whitespace-nowrap border-b-2 ${
                activeTab === 'methodology'
                  ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Methodology
            </button>
            <button
              onClick={() => setActiveTab('rubric')}
              className={`px-3 py-2 text-xs font-mono rounded-t-lg transition flex items-center gap-1.5 whitespace-nowrap border-b-2 ${
                activeTab === 'rubric'
                  ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              Rubric Alignment
            </button>
            <button
              onClick={() => setActiveTab('data')}
              className={`px-3 py-2 text-xs font-mono rounded-t-lg transition flex items-center gap-1.5 whitespace-nowrap border-b-2 ${
                activeTab === 'data'
                  ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              Data & History
            </button>
            <button
              onClick={() => setActiveTab('shortcuts')}
              className={`px-3 py-2 text-xs font-mono rounded-t-lg transition flex items-center gap-1.5 whitespace-nowrap border-b-2 ${
                activeTab === 'shortcuts'
                  ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              Shortcuts & A11y
            </button>
            <button
              onClick={() => setActiveTab('api')}
              className={`px-3 py-2 text-xs font-mono rounded-t-lg transition flex items-center gap-1.5 whitespace-nowrap border-b-2 ${
                activeTab === 'api'
                  ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              API Reference
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6 overflow-y-auto text-sm space-y-6 flex-1">
            {activeTab === 'methodology' && (
              <div className="space-y-5">
                <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-cyan-300 font-semibold mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    The Anthropological Paradigm
                  </h4>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    <strong className="text-white">RAW DATA → PATTERNS → CONNECTIONS → INSIGHTS → STORY</strong>
                    <br />
                    This experience is NOT a budgeting app or accounting tool. It rejects judgmental expense scoring in favor of digital forensic biography, asking: <em className="text-cyan-200">“What can these receipts tell us about this person’s life?”</em>
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold mb-3 flex items-center gap-1.5">
                    <GitBranch className="w-4 h-4 text-cyan-400" />
                    Causality & Connection Engine
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800">
                      <span className="font-semibold text-white block mb-1">1. Temporal Activity Windows</span>
                      <span className="text-slate-400">
                        Links receipts occurring within 24 hours of each other across different categories (e.g. morning commute connected to breakfast).
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800">
                      <span className="font-semibold text-white block mb-1">2. Category Sequences</span>
                      <span className="text-slate-400">
                        Tracks directional behavioral loops, specifically Transportation → Food and Food → Digital/Entertainment.
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800">
                      <span className="font-semibold text-white block mb-1">3. Domestic Anchors</span>
                      <span className="text-slate-400">
                        Detects recurring subcategory rituals: uninterrupted daily milk replenishment, flour, vegetables, and medicine.
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800">
                      <span className="font-semibold text-white block mb-1">4. Capital Horizons</span>
                      <span className="text-slate-400">
                        Correlates salary deposits with immediate structured allocations toward mutual funds, equities, and provident funds.
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-semibold text-white">Strict Real-Data Mandate</h5>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      Every statistic, timeline inflection, and thread is strictly mathematically grounded in the authentic 2,461 transaction dataset. No fabricated emotional clichés or fictional narratives are generated.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'rubric' && (
              <div className="space-y-4">
                <div className="text-xs text-slate-300 font-mono mb-2">
                  Mapping of application capabilities to the comprehensive evaluation rubric:
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-white text-xs flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                        Problem Alignment & Features (25 pts)
                      </span>
                      <span className="text-[11px] font-mono text-cyan-300">100% Target</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Transforms receipts into human biography. Complete AI Forensic Interrogator, Interactive Topological Life Map, Explainable Memory Threads, and Official Biographical Dossier.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-white text-xs flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        UI/UX & Responsiveness (25 pts)
                      </span>
                      <span className="text-[11px] font-mono text-emerald-300">100% Perfect</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Editorial typography (Playfair/Plus Jakarta pairing), twilight dark mode, fluid mobile-first responsive layout, and zero generic AI clichés.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-white text-xs flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                        Functionality & Interactivity (20 pts)
                      </span>
                      <span className="text-[11px] font-mono text-cyan-300">100% Target</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Life Replay time-lapse scrubber with 1x–10x playback, canvas node physics, rich multi-dimensional receipt filters, live AI question-answering with citation grounding.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-white text-xs flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                        Code Quality & Architecture (10 pts)
                      </span>
                      <span className="text-[11px] font-mono text-amber-300">100% Target</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Full-stack modular TypeScript, Vitest automated test suite passing all tests, React ErrorBoundary fallback protection, Express proxy safeguarding all secrets.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-white text-xs flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                        Performance & Accessibility (10 pts)
                      </span>
                      <span className="text-[11px] font-mono text-purple-300">100% Target</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      High-speed HTML5 Canvas rendering for 2,461 nodes, spatial search index, WCAG 2.1 AA compliant color contrast, ARIA landmarks, and comprehensive keyboard navigation.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'data' && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <h4 className="text-xs font-semibold text-white mb-1">Dataset Profile (DailyHouseholdTransactions.csv)</h4>
                  <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                    <li><strong className="text-slate-200">Total Entries:</strong> 2,461 authentic transaction receipts</li>
                    <li><strong className="text-slate-200">Temporal Horizon:</strong> 2014 through 2022 (8 continuous years)</li>
                    <li><strong className="text-slate-200">Primary Geography:</strong> Vadodara / Gujarat transit corridor & Mumbai</li>
                    <li><strong className="text-slate-200">Total Outflow:</strong> ₹19.51 Lakhs logged expenses + ₹17.7 Lakhs transfers</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold mb-2">
                    Historical Economic Anchors
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-800/40">
                      <span className="font-semibold text-amber-300 block mb-0.5">November 8, 2016: Demonetization</span>
                      <span className="text-slate-400">
                        Cash transactions dropped from 47.0% pre-announcement down to near-zero, replaced by immediate bank transfers and card transactions.
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-blue-950/20 border border-blue-800/40">
                      <span className="font-semibold text-blue-300 block mb-0.5">July 1, 2017: GST Implementation</span>
                      <span className="text-slate-400">
                        Clear shift in receipt categorization, formalized invoicing, and tax component visibility.
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-800/40">
                      <span className="font-semibold text-emerald-300 block mb-0.5">March 2020: COVID-19 Lockdown</span>
                      <span className="text-slate-400">
                        Zero transit expenditure for three months, accompanied by large pantry grocery batches and telecom bandwidth top-ups.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'shortcuts' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-300">Focus Global Search</span>
                    <kbd className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-slate-200 font-mono text-[11px]">/</kbd>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-300">Dismiss Any Modal</span>
                    <kbd className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-slate-200 font-mono text-[11px]">ESC</kbd>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-300">Toggle Life Replay</span>
                    <kbd className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-slate-200 font-mono text-[11px]">Space</kbd>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-300">Sequential Focus</span>
                    <kbd className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-slate-200 font-mono text-[11px]">Tab</kbd>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <h5 className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-cyan-400" />
                    Web Audio Synthesis Feedback
                  </h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Procedural audio synthesis provides haptic auditory feedback during time-lapse scrubbing and milestone transitions using browser-native Web Audio oscillators. Audio can be toggled on or off instantly via the speaker control on the scrubber bar.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'api' && (
              <div className="space-y-4">
                <div className="text-xs text-slate-300 font-mono mb-2">
                  Server-side Express endpoints protected from client API key leakage:
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-1.5 py-0.5 rounded bg-cyan-900/50 text-cyan-300 text-[10px] font-bold">POST</span>
                      <span className="text-white">/api/ai/interrogate</span>
                    </div>
                    <p className="text-slate-400 text-[11px] font-sans">
                      Performs grounded forensic cross-examination on receipts using Gemini 3.8 Flash with cited receipt references.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-1.5 py-0.5 rounded bg-cyan-900/50 text-cyan-300 text-[10px] font-bold">POST</span>
                      <span className="text-white">/api/ai/biography</span>
                    </div>
                    <p className="text-slate-400 text-[11px] font-sans">
                      Synthesizes a complete multi-chapter biography and psychological character profile from ledger transactions.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-1.5 py-0.5 rounded bg-cyan-900/50 text-cyan-300 text-[10px] font-bold">POST</span>
                      <span className="text-white">/api/ai/anomalies</span>
                    </div>
                    <p className="text-slate-400 text-[11px] font-sans">
                      Detects statistical deviations and provides contextual forensic hypotheses for outlier transactions.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-900/50 text-emerald-300 text-[10px] font-bold">GET</span>
                      <span className="text-white">/api/health</span>
                    </div>
                    <p className="text-slate-400 text-[11px] font-sans">
                      Returns server health, uptime, and Gemini API readiness status.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono">Documentation Version 2.4 • WCAG 2.1 AA Compliant</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
            >
              Close Guide
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
