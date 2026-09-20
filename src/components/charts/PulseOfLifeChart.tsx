import { useState, useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { Activity, Calendar, ShoppingBag, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Receipt } from '../../types/receipt';
import { formatCurrency, formatCompactCurrency } from '../../utils/currencyUtils';

interface PulseOfLifeProps {
  receipts: Receipt[];
  onSelectReceipt: (r: Receipt) => void;
}

interface PeriodBucket {
  periodKey: string;
  label: string;
  receiptCount: number;
  totalSpending: number;
  totalIncome: number;
  receipts: Receipt[];
}

export function PulseOfLifeChart({ receipts, onSelectReceipt }: PulseOfLifeProps) {
  // Aggregate by Month-Year
  const data: PeriodBucket[] = useMemo(() => {
    if (receipts.length === 0) return [];

    const map = new Map<string, PeriodBucket>();

    for (const r of receipts) {
      const year = r.date.getFullYear();
      const month = r.date.getMonth();
      const periodKey = `${year}-${String(month + 1).padStart(2, '0')}`;
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const label = `${monthNames[month]} '${String(year).slice(2)}`;

      const current = map.get(periodKey) || {
        periodKey,
        label,
        receiptCount: 0,
        totalSpending: 0,
        totalIncome: 0,
        receipts: [],
      };

      current.receiptCount++;
      if (r.type === 'Income' || r.type === 'Transfer-In') {
        current.totalIncome += r.amount;
      } else {
        current.totalSpending += r.amount;
      }
      current.receipts.push(r);

      map.set(periodKey, current);
    }

    return Array.from(map.values()).sort((a, b) => a.periodKey.localeCompare(b.periodKey));
  }, [receipts]);

  const [selectedBucket, setSelectedBucket] = useState<PeriodBucket | null>(() => data[0] || null);

  // Dominant categories for the selected period
  const dominantCategories = useMemo(() => {
    if (!selectedBucket) return [];
    const catMap = new Map<string, number>();
    for (const r of selectedBucket.receipts) {
      catMap.set(r.category, (catMap.get(r.category) || 0) + 1);
    }
    return Array.from(catMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([cat, count]) => ({
        category: cat,
        count,
        pct: Math.round((count / selectedBucket.receiptCount) * 100),
      }));
  }, [selectedBucket]);

  return (
    <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h3 className="font-editorial text-lg font-bold text-white tracking-wide">
              THE PULSE OF A LIFE
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Temporal activity density curve. Click any period along the wave to investigate that chapter in time.
          </p>
        </div>

        {selectedBucket && (
          <span className="px-3 py-1 rounded-full text-xs font-mono bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
            Selected: {selectedBucket.label} ({selectedBucket.receiptCount} receipts)
          </span>
        )}
      </div>

      {/* Density Area Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            onClick={(state: any) => {
              if (state && state.activePayload && state.activePayload[0]) {
                const bucket = state.activePayload[0].payload as PeriodBucket;
                setSelectedBucket(bucket);
              }
            }}
          >
            <defs>
              <linearGradient id="pulseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const b = payload[0].payload as PeriodBucket;
                  return (
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono shadow-xl">
                      <div className="font-bold text-white mb-1">{b.label}</div>
                      <div className="text-cyan-300">{b.receiptCount} receipts logged</div>
                      <div className="text-slate-300">Outflow: {formatCurrency(b.totalSpending)}</div>
                      {b.totalIncome > 0 && (
                        <div className="text-emerald-400">Inflow: {formatCurrency(b.totalIncome)}</div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="receiptCount"
              stroke="#22d3ee"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#pulseGradient)"
              activeDot={{ r: 6, fill: '#38bdf8', stroke: '#ffffff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Period Detailed Drilldown */}
      {selectedBucket && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              PERIOD OVERVIEW
            </div>
            <div className="text-lg font-bold text-white mt-0.5">{selectedBucket.label}</div>
            <div className="flex items-center gap-4 mt-2 font-mono text-xs">
              <span className="text-slate-300">{selectedBucket.receiptCount} moments</span>
              <span className="text-rose-400 font-semibold">
                -{formatCompactCurrency(selectedBucket.totalSpending)}
              </span>
              {selectedBucket.totalIncome > 0 && (
                <span className="text-emerald-400 font-semibold">
                  +{formatCompactCurrency(selectedBucket.totalIncome)}
                </span>
              )}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
              DOMINANT CATEGORIES
            </div>
            <div className="space-y-1">
              {dominantCategories.map((c) => (
                <div key={c.category} className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 truncate max-w-[120px]">{c.category}</span>
                  <span className="font-mono text-cyan-400">
                    {c.count} ({c.pct}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
              SAMPLE RECEIPTS IN PERIOD
            </div>
            <div className="space-y-1.5">
              {selectedBucket.receipts.slice(0, 2).map((r) => (
                <div
                  key={r.id}
                  onClick={() => onSelectReceipt(r)}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs text-slate-300 flex items-center justify-between cursor-pointer border border-slate-800"
                >
                  <span className="truncate max-w-[130px]">
                    {r.subcategory || r.category}
                  </span>
                  <span className="font-mono text-cyan-400">
                    {formatCurrency(r.amount, r.currency)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
