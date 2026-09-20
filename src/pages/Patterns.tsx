import { Network, BarChart3, Moon } from 'lucide-react';
import { Receipt } from '../types/receipt';
import { CategoryConstellation } from '../components/charts/CategoryConstellation';
import { SpendingRhythmChart } from '../components/charts/SpendingRhythmChart';
import { TimeOfDayChart } from '../components/charts/TimeOfDayChart';

interface PatternsPageProps {
  receipts: Receipt[];
  onSelectReceipt: (r: Receipt) => void;
}

export function PatternsPage({ receipts, onSelectReceipt }: PatternsPageProps) {
  return (
    <div className="space-y-12 pb-16">
      <div>
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
            BEHAVIORAL GEOMETRY & ARCHITECTURES
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-editorial text-white mt-1">
          Patterns, Rhythms & Constellations
        </h1>
        <p className="text-sm text-slate-300 font-light mt-2 max-w-2xl leading-relaxed">
          Examining the structure of domestic life across category ecosystems, temporal spending velocity, and day-night rituals.
        </p>
      </div>

      {/* Category Constellation */}
      <section>
        <CategoryConstellation receipts={receipts} onSelectReceipt={onSelectReceipt} />
      </section>

      {/* Spending Rhythm */}
      <section>
        <SpendingRhythmChart receipts={receipts} onSelectReceipt={onSelectReceipt} />
      </section>

      {/* Time-of-day Circadian Breakdown */}
      <section>
        <TimeOfDayChart receipts={receipts} onSelectReceipt={onSelectReceipt} />
      </section>
    </div>
  );
}
