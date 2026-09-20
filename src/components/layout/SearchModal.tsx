import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, ShoppingBag, ArrowRight } from 'lucide-react';
import { Receipt } from '../../types/receipt';
import { formatCurrency } from '../../utils/currencyUtils';
import { formatShortDate } from '../../utils/dateUtils';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipts: Receipt[];
  onSelectReceipt: (r: Receipt) => void;
}

export function SearchModal({
  isOpen,
  onClose,
  receipts,
  onSelectReceipt,
}: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const results = q
    ? receipts
        .filter((r) => {
          return (
            r.category.toLowerCase().includes(q) ||
            r.subcategory.toLowerCase().includes(q) ||
            r.note.toLowerCase().includes(q) ||
            r.mode.toLowerCase().includes(q) ||
            r.rawDate.toLowerCase().includes(q) ||
            (r.merchant && r.merchant.toLowerCase().includes(q)) ||
            (r.city && r.city.toLowerCase().includes(q))
          );
        })
        .slice(0, 15)
    : receipts.slice(0, 8);

  const highlightMatch = (text: string) => {
    if (!q || !text) return text;
    const parts = text.split(new RegExp(`(${q})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === q.toLowerCase() ? (
        <span key={i} className="bg-cyan-500/30 text-cyan-200 px-0.5 rounded font-semibold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/75 backdrop-blur-sm">
        <div className="fixed inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="relative z-10 w-full max-w-2xl rounded-2xl bg-[#0e1320] border border-slate-700/70 shadow-2xl overflow-hidden"
        >
          {/* Search Input Bar */}
          <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-900/90 gap-3">
            <Search className="w-5 h-5 text-cyan-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by category, note, milk, train, netflix, cash, date..."
              className="w-full bg-transparent border-none text-white placeholder-slate-400 text-sm focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:block px-2 py-0.5 text-[10px] font-mono bg-slate-800 rounded border border-slate-700 text-slate-400">
              ESC
            </kbd>
          </div>

          {/* Results Container */}
          <div className="max-h-[60vh] overflow-y-auto p-3 divide-y divide-slate-800/60">
            <div className="px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>{q ? `Found matching receipts` : 'Recent receipts'}</span>
              <span>{results.length} shown</span>
            </div>

            {results.length > 0 ? (
              results.map((r) => (
                <div
                  key={r.id}
                  onClick={() => {
                    onSelectReceipt(r);
                    onClose();
                  }}
                  className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/60 transition cursor-pointer gap-3"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-cyan-950 transition">
                      <ShoppingBag className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white group-hover:text-cyan-200">
                          {highlightMatch(r.category)}
                        </span>
                        {r.subcategory && (
                          <span className="text-[11px] text-slate-400 truncate">
                            · {highlightMatch(r.subcategory)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {highlightMatch(r.note || r.merchant || 'Household ledger transaction')}
                      </p>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                        {formatShortDate(r.date)} · {highlightMatch(r.mode)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono text-xs font-semibold text-white">
                      {formatCurrency(r.amount, r.currency)}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition" />
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs">
                No receipts found matching "{query}".
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
