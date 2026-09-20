import { useState, useMemo } from 'react';
import { Search, Filter, X, ShoppingBag, ArrowUpDown, RefreshCcw, Sparkles } from 'lucide-react';
import { Receipt, TransactionType } from '../types/receipt';
import { useFilters } from '../hooks/useFilters';
import { filterReceipts } from '../utils/searchUtils';
import { ReceiptCard } from '../components/receipt/ReceiptCard';
import { formatCurrency } from '../utils/currencyUtils';

interface ReceiptsPageProps {
  receipts: Receipt[];
  categoryStats: { category: string; count: number }[];
  paymentModes: { mode: string; count: number }[];
  onSelectReceipt: (r: Receipt) => void;
}

type SortOption = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';

export function ReceiptsPage({
  receipts,
  categoryStats,
  paymentModes,
  onSelectReceipt,
}: ReceiptsPageProps) {
  const {
    filters,
    setSearch,
    toggleCategory,
    toggleMode,
    toggleType,
    clearAllFilters,
    activeFilterCount,
  } = useFilters();

  const [sortOption, setSortOption] = useState<SortOption>('date-desc');
  const [page, setPage] = useState(1);
  const itemsPerPage = 24;

  // Filter receipts
  const filtered = useMemo(() => {
    const list = filterReceipts(receipts, filters);

    return list.sort((a, b) => {
      if (sortOption === 'date-desc') return b.date.getTime() - a.date.getTime();
      if (sortOption === 'date-asc') return a.date.getTime() - b.date.getTime();
      if (sortOption === 'amount-desc') return b.amount - a.amount;
      if (sortOption === 'amount-asc') return a.amount - b.amount;
      return 0;
    });
  }, [receipts, filters, sortOption]);

  const paginated = useMemo(() => {
    return filtered.slice(0, page * itemsPerPage);
  }, [filtered, page]);

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
            DIGITAL ARTIFACT ARCHIVE
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-editorial text-white mt-0.5">
          Receipts & Forensic Evidence
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          {filtered.length.toLocaleString()} records matched of {receipts.length.toLocaleString()} total receipts.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search receipts by note, item description, category, merchant..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
            />
            {filters.search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 w-full sm:w-auto"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
            </select>

            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition cursor-pointer shrink-0"
              >
                <RefreshCcw className="w-3 h-3" />
                <span>Clear ({activeFilterCount})</span>
              </button>
            )}
          </div>
        </div>

        {/* Category filter pills */}
        <div className="space-y-2 pt-2 border-t border-slate-800/60">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>FILTER BY DOMAIN</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {categoryStats.slice(0, 10).map((cat) => {
              const isSelected = filters.categories.includes(cat.category);
              return (
                <button
                  key={cat.category}
                  onClick={() => toggleCategory(cat.category)}
                  className={`px-2.5 py-1 rounded-lg text-xs transition cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500 text-white font-semibold'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{cat.category}</span>
                  <span className="ml-1 text-[10px] font-mono opacity-70">
                    ({cat.count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Payment mode filter pills */}
        <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-800/60 text-xs">
          <span className="text-[11px] font-mono text-slate-400 mr-2">PAYMENT MODE:</span>
          {paymentModes.slice(0, 6).map((m) => {
            const isSelected = filters.modes.includes(m.mode);
            return (
              <button
                key={m.mode}
                onClick={() => toggleMode(m.mode)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition cursor-pointer ${
                  isSelected
                    ? 'bg-slate-700 text-cyan-300 border border-cyan-400/50'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {m.mode} ({m.count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Receipts */}
      {paginated.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {paginated.map((r) => (
            <ReceiptCard
              key={r.id}
              receipt={r}
              onClick={() => onSelectReceipt(r)}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 text-sm">
          No receipts found matching the selected filter criteria.
        </div>
      )}

      {/* Pagination / Load more */}
      {paginated.length < filtered.length && (
        <div className="pt-6 text-center">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 transition cursor-pointer"
          >
            Load More Records ({filtered.length - paginated.length} remaining)
          </button>
        </div>
      )}
    </div>
  );
}
