import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Pause, ChevronRight, ChevronLeft, Sparkles, Map, Network, Bookmark, ReceiptText, Award } from 'lucide-react';
import { NavPage } from '../navigation/Navbar';

interface DemoStep {
  title: string;
  stepNumber: number;
  badge: string;
  targetPage: NavPage;
  description: string;
  keyHighlight: string;
  icon: typeof Map;
}

const DEMO_STEPS: DemoStep[] = [
  {
    stepNumber: 1,
    title: 'AI Forensic Detective & Dossier',
    badge: 'STATION 1 / 7',
    targetPage: 'Investigate',
    description: 'Ask any investigative question powered by Gemini 2.5 Flash. Cross-examine family commitments, lockdown survival, and export the official Biographical Dossier.',
    keyHighlight: 'Direct LLM-powered forensic anthropology grounded in 2,461 receipts.',
    icon: Sparkles,
  },
  {
    stepNumber: 2,
    title: 'Interactive Life Map',
    badge: 'STATION 2 / 7',
    targetPage: 'LifeMap',
    description: 'Every transaction is rendered as a responsive topological node. Amount controls size; category dictates orbital clustering. Pan, zoom, and filter.',
    keyHighlight: '2,461 nodes connected by temporal proximity and category affinity.',
    icon: Map,
  },
  {
    stepNumber: 3,
    title: 'Pattern Discovery Engine',
    badge: 'STATION 3 / 7',
    targetPage: 'Discover',
    description: 'Clicking "Discover Something" executes client-side statistical clustering, surfacing genuine anomalies, micro-rituals, and peak spending bursts.',
    keyHighlight: 'Heuristic pattern detection without external server dependencies.',
    icon: Sparkles,
  },
  {
    stepNumber: 4,
    title: 'Narrated Memory Threads',
    badge: 'STATION 4 / 7',
    targetPage: 'Discover',
    description: 'Traces recurring sequences (Transit → Food → Entertainment) and domestic rhythms (daily milk, grocery replenishments) with clear explanations of why they connect.',
    keyHighlight: 'Every connection explains its reasoning: temporal window, repeated sequence, or financial rhythm.',
    icon: Network,
  },
  {
    stepNumber: 5,
    title: 'Dynamic Story Chapters & Replay',
    badge: 'STATION 5 / 7',
    targetPage: 'Journey',
    description: 'Instead of arbitrary calendar months, the timeline is partitioned into narrative eras based on true activity velocity with an interactive time-lapse playback scrubber.',
    keyHighlight: 'Interactive Life Time-Lapse playback bar with speed multipliers and audio feedback.',
    icon: Bookmark,
  },
  {
    stepNumber: 6,
    title: 'Cinematic Digital Receipt',
    badge: 'STATION 6 / 7',
    targetPage: 'Receipts',
    description: 'Replaces raw tables with authentic museum-grade digital receipts featuring jagged paper borders, full metadata, and related temporal moments.',
    keyHighlight: 'Complete item notes, payment modes, and temporally connected transactions.',
    icon: ReceiptText,
  },
  {
    stepNumber: 7,
    title: 'The Story So Far',
    badge: 'STATION 7 / 7',
    targetPage: 'Journey',
    description: 'A culminating forensic retrospective highlighting lifetime volume, dominant lifestyle commitments, and discovered personal truths.',
    keyHighlight: 'Answers the central prompt: "What can these receipts tell us about this person\'s life?"',
    icon: Award,
  },
];

interface DemoTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigatePage: (page: NavPage) => void;
}

export function DemoTourModal({
  isOpen,
  onClose,
  onNavigatePage,
}: DemoTourModalProps) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const step = DEMO_STEPS[currentStepIdx];

  // Auto progression timer (each step gets ~12-14 seconds = ~80s total)
  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIdx(0);
      setProgress(0);
      return;
    }

    onNavigatePage(step.targetPage);

    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentStepIdx < DEMO_STEPS.length - 1) {
            setCurrentStepIdx((idx) => idx + 1);
            return 0;
          } else {
            setIsPlaying(false);
            return 100;
          }
        }
        return prev + 1.25; // 100 / 1.25 * 100ms = 8 seconds per step
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isOpen, currentStepIdx, isPlaying, step.targetPage, onNavigatePage]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStepIdx < DEMO_STEPS.length - 1) {
      setCurrentStepIdx((i) => i + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx((i) => i - 1);
      setProgress(0);
    }
  };

  const Icon = step.icon;

  return (
    <AnimatePresence>
      <div className="fixed bottom-6 right-6 z-50 max-w-md w-[calc(100vw-3rem)]">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="rounded-2xl bg-[#0b101c]/95 border border-cyan-500/40 p-5 shadow-2xl backdrop-blur-xl text-slate-200"
        >
          {/* Progress bar across top of banner */}
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                <Icon className="w-4 h-4" />
              </span>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 block font-semibold">
                  {step.badge}
                </span>
                <h4 className="text-sm font-bold text-white font-editorial">
                  {step.title}
                </h4>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-2 py-1 rounded-lg text-xs font-mono text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/60 transition cursor-pointer"
            >
              Exit Demo
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            {step.description}
          </p>

          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-cyan-300 mb-4">
            {step.keyHighlight}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-white"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentStepIdx === 0}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-xs font-mono text-slate-400">
                {currentStepIdx + 1} / {DEMO_STEPS.length}
              </span>

              <button
                onClick={handleNext}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow transition"
              >
                <span>{currentStepIdx === DEMO_STEPS.length - 1 ? 'Finish' : 'Next'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
