import { useMemo } from 'react';
import { Sunrise, Sun, Sunset, Moon, Sparkles, Info, ShoppingBag } from 'lucide-react';
import { Receipt, TimeOfDay } from '../../types/receipt';
import { formatCurrency } from '../../utils/currencyUtils';

interface TimeOfDayChartProps {
  receipts: Receipt[];
  onSelectReceipt: (r: Receipt) => void;
}

export function TimeOfDayChart({ receipts, onSelectReceipt }: TimeOfDayChartProps) {
  const hasExactTimestamps = useMemo(() => {
    return receipts.some((r) => r.hasExactTime);
  }, [receipts]);

  const timeBuckets = useMemo(() => {
    const buckets: Record<
      TimeOfDay,
      { label: string; count: number; totalSpending: number; receipts: Receipt[]; catMap: Map<string, number> }
    > = {
      morning: { label: 'Morning (06:00 – 12:00)', count: 0, totalSpending: 0, receipts: [], catMap: new Map() },
      afternoon: { label: 'Afternoon (12:00 – 17:00)', count: 0, totalSpending: 0, receipts: [], catMap: new Map() },
      evening: { label: 'Evening (17:00 – 21:00)', count: 0, totalSpending: 0, receipts: [], catMap: new Map() },
      night: { label: 'Late Night (21:00 – 06:00)', count: 0, totalSpending: 0, receipts: [], catMap: new Map() },
    };

    for (const r of receipts) {
      const b = buckets[r.timeOfDay];
      b.count++;
      b.totalSpending += r.amount;
      b.receipts.push(r);
      b.catMap.set(r.category, (b.catMap.get(r.category) || 0) + 1);
    }

    return Object.entries(buckets).map(([key, data]) => {
      const dominantCats = Array.from(data.catMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([cat, cnt]) => ({
          category: cat,
          count: cnt,
          pct: Math.round((cnt / (data.count || 1)) * 100),
        }));

      return {
        key: key as TimeOfDay,
        ...data,
        dominantCats,
      };
    });
  }, [receipts]);

  const icons: Record<TimeOfDay, typeof Sunrise> = {
    morning: Sunrise,
    afternoon: Sun,
    evening: Sunset,
    night: Moon,
  };

  return (
    <div className="p-6 md:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4 text-cyan-400" />
            <h3 className="font-editorial text-lg font-bold text-white tracking-wide">
              CIRCADIAN TIME-OF-DAY ANALYSIS
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Behavioral distribution across morning routines, afternoon errands, evening unwinding, and late-night anomalies.
          </p>
        </div>

        {/* Mandatory Requirement badge when timestamp inferred */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-cyan-950/70 border border-cyan-500/30 text-cyan-300">
          <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>
            {hasExactTimestamps
              ? 'Exact sensor timestamps'
              : 'Inferred from sequence and transaction context'}
          </span>
        </div>
      </div>

      {/* 4 Quadrants: Morning, Afternoon, Evening, Night */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {timeBuckets.map((bucket) => {
          const Icon = icons[bucket.key];
          return (
            <div
              key={bucket.key}
              className="p-5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-slate-900 text-cyan-400 border border-slate-800">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    {bucket.count} receipts
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white font-editorial">
                  {bucket.label.split(' ')[0]}
                </h4>
                <div className="text-[11px] font-mono text-slate-400 mb-4">
                  {bucket.label.slice(bucket.label.indexOf('('))}
                </div>

                {/* Dominant Categories in this bucket */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
                  <div className="text-[10px] font-mono uppercase text-slate-400">
                    DOMINANT MOTIFS
                  </div>
                  {bucket.dominantCats.map((c) => (
                    <div key={c.category} className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 truncate max-w-[110px]">{c.category}</span>
                      <span className="text-cyan-400 font-mono text-[11px]">
                        {c.pct}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample receipt in this time window */}
              {bucket.receipts[0] && (
                <div
                  onClick={() => onSelectReceipt(bucket.receipts[0])}
                  className="mt-4 pt-3 border-t border-slate-800/60 cursor-pointer group"
                >
                  <div className="text-[10px] font-mono uppercase text-slate-400 mb-0.5">
                    REPRESENTATIVE MOMENT
                  </div>
                  <div className="text-xs text-white group-hover:text-cyan-300 truncate transition">
                    {bucket.receipts[0].subcategory || bucket.receipts[0].category}
                  </div>
                  <div className="text-[10px] font-mono text-cyan-400">
                    {formatCurrency(bucket.receipts[0].amount, bucket.receipts[0].currency)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
