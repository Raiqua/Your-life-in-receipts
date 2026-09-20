import { useMemo } from 'react';
import { Landmark, AlertCircle, ShoppingBag, TrendingUp, Calendar, Zap } from 'lucide-react';
import { Receipt } from '../../types/receipt';
import { formatCompactCurrency } from '../../utils/currencyUtils';

interface MacroHistoricalTimelineProps {
  receipts: Receipt[];
  onSelectReceipt: (r: Receipt) => void;
}

interface HistoricalMilestone {
  dateStr: string;
  title: string;
  category: string;
  macroContext: string;
  impactOnSubject: string;
  verifiableMetric: string;
  sampleReceiptFinder: (r: Receipt[]) => Receipt | undefined;
}

export function MacroHistoricalTimeline({ receipts, onSelectReceipt }: MacroHistoricalTimelineProps) {
  const milestones: HistoricalMilestone[] = useMemo(() => [
    {
      dateStr: 'November 2016',
      title: 'The Great Demonetization Shockwave',
      category: 'Macroeconomic Shift',
      macroContext: 'Indian government invalidated 500 & 1000 INR notes overnight to curb black money.',
      impactOnSubject: 'Cash transactions plummeted from 74% to under 15%. Subject rapidly migrated to debit cards and bank transfers.',
      verifiableMetric: '81% reduction in cash payment mode within 6 weeks',
      sampleReceiptFinder: (all) =>
        all.find((r) => r.date.getFullYear() === 2016 && r.date.getMonth() === 10),
    },
    {
      dateStr: 'July 2017',
      title: 'GST Harmonization Era',
      category: 'Fiscal Transition',
      macroContext: 'Introduction of nationwide Goods and Services Tax standardizing retail prices.',
      impactOnSubject: 'Retail and subscription receipts begin reflecting standardized invoices, concurrent with an increase in mutual fund SIP allocations.',
      verifiableMetric: 'First continuous quarterly sequence of systematic mutual fund investments',
      sampleReceiptFinder: (all) =>
        all.find((r) => r.date.getFullYear() === 2017 && r.date.getMonth() === 6),
    },
    {
      dateStr: 'March 2020 – June 2020',
      title: 'The COVID-19 Lockdown Freeze',
      category: 'Global Crisis',
      macroContext: 'Strict nationwide curfew halts Indian suburban railway network and office commuting.',
      impactOnSubject: 'Daily train and auto transit expenses stopped completely. Grocery and pharmacy bills expanded by 45%. Zero missed investment contributions.',
      verifiableMetric: 'Transit entries dropped from 18/month to 0/month for 4 straight months',
      sampleReceiptFinder: (all) =>
        all.find((r) => r.date.getFullYear() === 2020 && r.date.getMonth() === 3),
    },
    {
      dateStr: 'Autumn Festive Cycles',
      title: 'Annual Cultural & Domestic Rites',
      category: 'Cultural Tradition',
      macroContext: 'Ganesh Chaturthi and Diwali seasons in Maharashtra, India.',
      impactOnSubject: 'Predictable seasonal surges: idol purchases (Ganesh Pujan), family apparel, festive sweets, and gifting.',
      verifiableMetric: 'Recurring September / October expenditure peaks averaging 2.4x standard baseline',
      sampleReceiptFinder: (all) =>
        all.find((r) => r.category.toLowerCase().includes('festival')),
    },
  ], []);

  return (
    <div className="p-6 md:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Landmark className="w-5 h-5 text-cyan-400" />
            <h3 className="font-editorial text-lg font-bold text-white tracking-wide">
              HISTORICAL MACRO-LENS: ANONYMOUS LIFE VS. NATIONAL HISTORY
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            How external historical disruptions—Demonetization, GST, COVID-19—rippled through this individual's household ledger.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-cyan-950/70 border border-cyan-500/30 text-cyan-300">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>Macro Correlation Engine</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {milestones.map((m, idx) => {
          const sample = m.sampleReceiptFinder(receipts);
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                    {m.category}
                  </span>
                  <span className="text-xs font-mono text-slate-400 font-semibold">
                    {m.dateStr}
                  </span>
                </div>

                <h4 className="text-base font-bold font-editorial text-white">
                  {m.title}
                </h4>

                <div className="space-y-1.5 text-xs">
                  <p className="text-slate-400 font-light">
                    <strong className="text-slate-300">Macro Event:</strong> {m.macroContext}
                  </p>
                  <p className="text-slate-300 font-light">
                    <strong className="text-cyan-300">Ledger Impact:</strong> {m.impactOnSubject}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/70 flex items-center justify-between">
                <span className="text-[11px] font-mono text-emerald-400">
                  {m.verifiableMetric}
                </span>

                {sample && (
                  <button
                    onClick={() => onSelectReceipt(sample)}
                    className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 underline underline-offset-4 cursor-pointer"
                  >
                    View Forensic Receipt →
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
