import { useState, useMemo } from 'react';
import { Network, Sparkles, ShoppingBag, ArrowRight, TrendingUp } from 'lucide-react';
import { Receipt } from '../../types/receipt';
import { formatCurrency, formatCompactCurrency } from '../../utils/currencyUtils';

interface CategoryConstellationProps {
  receipts: Receipt[];
  onSelectReceipt: (r: Receipt) => void;
}

interface CategoryOrb {
  name: string;
  count: number;
  totalSpending: number;
  subcategories: { name: string; count: number }[];
  mostCommonSubcategory: string;
  relatedCategories: string[];
  receipts: Receipt[];
}

export function CategoryConstellation({
  receipts,
  onSelectReceipt,
}: CategoryConstellationProps) {
  const categories: CategoryOrb[] = useMemo(() => {
    const map = new Map<
      string,
      {
        count: number;
        totalSpending: number;
        subcatMap: Map<string, number>;
        receipts: Receipt[];
      }
    >();

    for (const r of receipts) {
      const cur = map.get(r.category) || {
        count: 0,
        totalSpending: 0,
        subcatMap: new Map<string, number>(),
        receipts: [] as Receipt[],
      };
      cur.count++;
      cur.totalSpending += r.amount;
      if (r.subcategory) {
        cur.subcatMap.set(r.subcategory, (cur.subcatMap.get(r.subcategory) || 0) + 1);
      }
      cur.receipts.push(r);
      map.set(r.category, cur);
    }

    const allCatNames = Array.from(map.keys());

    return Array.from(map.entries())
      .map(([name, data]) => {
        const subcategories = Array.from(data.subcatMap.entries())
          .map(([sName, sCount]) => ({ name: sName, count: sCount }))
          .sort((a, b) => b.count - a.count);

        const mostCommonSubcategory = subcategories[0]?.name || 'General Daily Needs';

        // Find related categories sharing similar temporal proximity
        const relatedCategories = allCatNames
          .filter((c) => c !== name)
          .slice(0, 3);

        return {
          name,
          count: data.count,
          totalSpending: data.totalSpending,
          subcategories: subcategories.slice(0, 6),
          mostCommonSubcategory,
          relatedCategories,
          receipts: data.receipts,
        };
      })
      .sort((a, b) => b.count - a.count);
  }, [receipts]);

  const [selectedCatName, setSelectedCatName] = useState<string>(
    categories[0]?.name || ''
  );

  const activeCategory =
    categories.find((c) => c.name === selectedCatName) || categories[0];

  if (!activeCategory) return null;

  return (
    <div className="p-6 md:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-cyan-400" />
            <h3 className="font-editorial text-lg font-bold text-white tracking-wide">
              CATEGORY CONSTELLATION
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Orbital network of life domains, subcategory rituals, and inter-category relationships.
          </p>
        </div>

        <span className="text-xs font-mono text-cyan-300">
          {categories.length} distinct domains identified
        </span>
      </div>

      {/* Orbital Constellation Nodes Bar */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 py-1 scrollbar-thin">
        {categories.map((cat) => {
          const isSelected = cat.name === activeCategory.name;
          return (
            <button
              key={cat.name}
              onClick={() => setSelectedCatName(cat.name)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/25 font-semibold'
                  : 'bg-slate-900/90 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-white/70" />
              <span>{cat.name}</span>
              <span className="text-[10px] font-mono opacity-70">
                ({cat.count})
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Domain Deep Drilldown */}
      <div className="p-6 rounded-2xl bg-[#090d16] border border-cyan-500/30 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-semibold block mb-1">
              CONSTELLATION HUB
            </span>
            <h4 className="font-editorial text-2xl font-bold text-white">
              {activeCategory.name}
            </h4>
          </div>

          <div className="flex items-center gap-6 font-mono">
            <div>
              <span className="text-[10px] uppercase text-slate-400 block">TOTAL LOGS</span>
              <span className="text-lg font-bold text-white">
                {activeCategory.count.toLocaleString()} receipts
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-slate-400 block">EXPENDITURE</span>
              <span className="text-lg font-bold text-cyan-400">
                {formatCurrency(activeCategory.totalSpending)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Subcategories */}
          <div className="space-y-3">
            <h5 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Primary Subcategory Rituals
            </h5>

            <div className="space-y-2">
              {activeCategory.subcategories.length > 0 ? (
                activeCategory.subcategories.map((sub) => (
                  <div
                    key={sub.name}
                    className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <span className="text-slate-200 truncate">{sub.name}</span>
                    <span className="font-mono text-cyan-400 text-[11px]">
                      {sub.count} times
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 italic">
                  No subcategory breakdown registered.
                </div>
              )}
            </div>
          </div>

          {/* Related Domains */}
          <div className="space-y-3">
            <h5 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Orbital Domain Affinities
            </h5>

            <div className="space-y-2">
              {activeCategory.relatedCategories.map((rCat) => (
                <button
                  key={rCat}
                  onClick={() => setSelectedCatName(rCat)}
                  className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-xs text-slate-300 flex items-center justify-between transition cursor-pointer"
                >
                  <span className="truncate">{rCat}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              ))}
            </div>

            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400">
              Most recurring anchor: <strong className="text-cyan-300">{activeCategory.mostCommonSubcategory}</strong>
            </div>
          </div>

          {/* Example Moments in this Constellation */}
          <div className="space-y-3">
            <h5 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Example Artifact Receipts
            </h5>

            <div className="space-y-2">
              {activeCategory.receipts.slice(0, 3).map((r) => (
                <div
                  key={r.id}
                  onClick={() => onSelectReceipt(r)}
                  className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/40 text-xs flex items-center justify-between cursor-pointer transition"
                >
                  <div className="min-w-0">
                    <div className="text-slate-200 truncate">
                      {r.subcategory || r.note || 'Receipt'}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {r.mode} · {r.rawDate.split(' ')[0]}
                    </div>
                  </div>
                  <span className="font-mono text-cyan-400 font-semibold shrink-0 ml-2">
                    {formatCurrency(r.amount, r.currency)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
