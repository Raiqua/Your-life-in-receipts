import { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Calendar,
  Sparkles,
  ShoppingBag,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Receipt } from '../../types/receipt';
import { formatCurrency } from '../../utils/currencyUtils';
import { formatShortDate } from '../../utils/dateUtils';
import { playReceiptChirp, toggleMuteAudio, getIsAudioMuted } from '../../utils/audioUtils';

interface LifeReplayBarProps {
  receipts: Receipt[];
  onSelectReceipt: (r: Receipt) => void;
}

export function LifeReplayBar({ receipts, onSelectReceipt }: LifeReplayBarProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2 | 5 | 10>(2);
  const [isMuted, setIsMuted] = useState(getIsAudioMuted());
  const timerRef = useRef<any>(null);

  // Chronologically sorted receipts
  const sortedReceipts = useRef<Receipt[]>([]);
  useEffect(() => {
    sortedReceipts.current = [...receipts].sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [receipts]);

  const currentReceipt = sortedReceipts.current[currentIndex] || sortedReceipts.current[0];

  // Derive historical era
  const getEraBadge = (d: Date) => {
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    if (y < 2016 || (y === 2016 && m < 11)) return 'Pre-Demonetization (Cash Dominance)';
    if (y === 2016 && m >= 11) return 'The Demonetization Disruption (Nov 2016)';
    if (y >= 2017 && y <= 2019) return 'The Digital Awakening & Asset Building';
    if (y === 2020) return 'The Pandemic Confinement Shockwave';
    return 'Post-Pandemic Consolidation & Wealth';
  };

  // Playback timer loop
  useEffect(() => {
    if (isPlaying) {
      const interval = Math.max(50, 400 / playbackSpeed);
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= sortedReceipts.current.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          if (prev % 3 === 0) {
            playReceiptChirp();
          }
          return prev + 1;
        });
      }, interval);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed]);

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setCurrentIndex(val);
  };

  const handleToggleMute = () => {
    const muted = toggleMuteAudio();
    setIsMuted(muted);
  };

  if (sortedReceipts.current.length === 0) return null;

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#090d16]/95 border border-cyan-500/40 shadow-xl space-y-3">
      {/* Header info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-500/30">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase text-cyan-400 font-semibold block">
              LIFE TIME-LAPSE REPLAY ENGINE
            </span>
            <span className="text-white font-bold text-sm font-editorial">
              {currentReceipt ? formatShortDate(currentReceipt.date) : ''}
            </span>
          </div>
          <span className="ml-2 px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300">
            {currentReceipt ? getEraBadge(currentReceipt.date) : ''}
          </span>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleTogglePlay}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-semibold transition cursor-pointer shadow-md"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Replay Life</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            title="Reset Timeline"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Speed options */}
          <div className="flex items-center bg-slate-950 rounded-xl border border-slate-800 p-0.5">
            {([1, 2, 5, 10] as const).map((s) => (
              <button
                key={s}
                onClick={() => setPlaybackSpeed(s)}
                className={`px-2 py-1 text-[10px] font-mono rounded-lg transition cursor-pointer ${
                  playbackSpeed === s
                    ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Audio toggle */}
          <button
            onClick={handleToggleMute}
            title={isMuted ? 'Unmute Sound FX' : 'Mute Sound FX'}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
          </button>
        </div>
      </div>

      {/* Scrubber slider */}
      <div className="space-y-1">
        <input
          type="range"
          min={0}
          max={sortedReceipts.current.length - 1}
          value={currentIndex}
          onChange={handleScrub}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
        />
        <div className="flex justify-between text-[10px] font-mono text-slate-400">
          <span>{sortedReceipts.current[0] ? formatShortDate(sortedReceipts.current[0].date) : ''}</span>
          <span>
            {currentIndex + 1} / {sortedReceipts.current.length} receipts
          </span>
          <span>
            {sortedReceipts.current[sortedReceipts.current.length - 1]
              ? formatShortDate(sortedReceipts.current[sortedReceipts.current.length - 1].date)
              : ''}
          </span>
        </div>
      </div>

      {/* Live active transaction ticker */}
      {currentReceipt && (
        <div
          onClick={() => onSelectReceipt(currentReceipt)}
          className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between gap-3 text-xs cursor-pointer hover:border-cyan-500/40 transition group"
        >
          <div className="flex items-center gap-2 truncate">
            <ShoppingBag className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="font-mono text-slate-400 text-[11px]">
              {currentReceipt.category}:
            </span>
            <span className="text-white group-hover:text-cyan-300 font-medium truncate">
              {currentReceipt.subcategory || currentReceipt.note || 'General Transaction'}
            </span>
            {currentReceipt.note && currentReceipt.subcategory && (
              <span className="text-slate-400 text-[11px] truncate hidden md:inline">
                ({currentReceipt.note})
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0 font-mono">
            <span className="text-slate-400 text-[11px]">
              {currentReceipt.mode}
            </span>
            <span className="font-bold text-cyan-300">
              {formatCurrency(currentReceipt.amount, currentReceipt.currency)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
