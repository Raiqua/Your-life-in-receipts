import { useState, useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { BarChart3, ArrowUpRight, Zap, TrendingDown, Clock } from 'lucide-react';
import { Receipt } from '../../types/receipt';
import { formatCurrency, formatCompactCurrency } from '../../utils/currencyUtils';

interface SpendingRhythmProps {
  receipts: Receipt[];
  onSelectReceipt: (r: Receipt) => void;
}

type Granularity = 'monthly' | 'weekly' | 'daily';

export function SpendingRhythmChart({ receipts, onSelectReceipt }: SpendingRhythmProps) {
  const [granularity, setGranularity] = useState<Granularity>('monthly');

  // Compute aggregated buckets based on granularity
  const chartData = useMemo(() => {
    if (receipts.length === 0) return [];

    const map = new Map<
      string,
      { label: string; amount: number; count: number; maxReceipt: Receipt }
    >();

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (const r of receipts) {
      if (r.type === 'Income' || r.type === 'Transfer-In') continue;

      let key = '';
      let label = '';

      if (granularity === 'monthly') {
        key = `${r.date.getFullYear()}-${String(r.date.getMonth() + 1).padStart(2, '0')}`;
        label = `${monthNames[r.date.getMonth()]} '${String(r.date.getFullYear()).slice(2)}`;
      } else if (granularity === 'weekly') {
        const weekNum = Math.ceil(r.date.getDate() / 7);
        key = `${r.date.getFullYear()}-${r.date.getMonth()}-W${weekNum}`;
        label = `${monthNames[r.date.getMonth()]} W${weekNum}`;
      } else {
        // Daily: last 30 active days
        key = r.date.toISOString().split('T')[0];
        label = `${r.date.getDate()} ${monthNames[r.date.getMonth()]}`;
      }

      const cur = map.get(key) || {
        label,
        amount: 0,
        count: 0,
        maxReceipt: r,
      };

      cur.amount += r.amount;
      cur.count++;
      if (r.amount > cur.maxReceipt.amount) {
        cur.maxReceipt = r;
      }
      map.set(key, cur);
    }

    let arr = Array.from(map.entries()).map(([k, val]) => ({
      key: k,
      ...val,
    }));

    if (granularity === 'daily') {
      arr = arr.slice(-35); // Most recent 35 days
    }

    return arr;
  }, [receipts, granularity]);

  // Find largest spike
  const largestSpike = useMemo(() => {
    if (receipts.length === 0) return null;
    return [...receipts].sort((a, b) => b.amount - a.amount)[0];
  }, [receipts]);

  return (
    <div className="p-6 md:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <h3 className="font-editorial text-lg font-bold text-white tracking-wide">
              SPENDING RHYTHM & VELOCITY
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Cyclical expenditure cadence across time, highlighting sudden bursts and calm intervals.
          </p>
        </div>

        {/* Granularity switch */}
        <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setGranularity('monthly')}
            className={`px-3 py-1.5 rounded-lg transition ${
              granularity === 'monthly'
                ? 'bg-cyan-500 text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setGranularity('weekly')}
            className={`px-3 py-1.5 rounded-lg transition ${
              granularity === 'weekly'
                ? 'bg-cyan-500 text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setGranularity('daily')}
            className={`px-3 py-1.5 rounded-lg transition ${
              granularity === 'daily'
                ? 'bg-cyan-500 text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Daily
          </button>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="label" stroke="#64748b" fontSize={10} tickLine={false} />
            <YAxis
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              tickFormatter={(v) => formatCompactCurrency(v)}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono shadow-xl">
                      <div className="font-bold text-white mb-1">{d.label}</div>
                      <div className="text-cyan-300 font-semibold">
                        Outflow: {formatCurrency(d.amount)}
                      </div>
                      <div className="text-slate-400">{d.count} transactions</div>
                      <div className="text-[10px] text-slate-400 mt-1 truncate max-w-xs">
                        Peak: {d.maxReceipt.category} ({formatCurrency(d.maxReceipt.amount)})
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="amount"
              fill="#06b6d4"
              radius={[4, 4, 0, 0]}
              onClick={(entry: any) => {
                if (entry && entry.maxReceipt) {
                  onSelectReceipt(entry.maxReceipt);
                }
              }}
              className="cursor-pointer"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Rhythmic Metric Insights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-mono mb-1">
            <Zap className="w-3.5 h-3.5" />
            <span>LARGEST HISTORICAL SPIKE</span>
          </div>
          {largestSpike && (
            <div
              onClick={() => onSelectReceipt(largestSpike)}
              className="cursor-pointer group"
            >
              <div className="text-lg font-bold font-mono text-white group-hover:text-cyan-300 transition">
                {formatCurrency(largestSpike.amount, largestSpike.currency)}
              </div>
              <div className="text-xs text-slate-400 truncate mt-0.5">
                {largestSpike.category}: {largestSpike.note || largestSpike.subcategory || 'Single outflow'}
              </div>
            </div>
          )}
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span>SPENDING BURSTS</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-light">
            Recurring spikes regularly coincide with the 1st–7th of each month, representing rent, investments, and wholesale domestic restocking.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono mb-1">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>QUIET INTERVALS</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-light">
            Mid-month stretches demonstrate disciplined baseline maintenance, composed almost entirely of low-value snacks, transit, and milk.
          </p>
        </div>
      </div>
    </div>
  );
}
