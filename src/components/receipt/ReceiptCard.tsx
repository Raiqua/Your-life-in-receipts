import { Receipt } from '../../types/receipt';
import { formatCurrency } from '../../utils/currencyUtils';
import { formatShortDate } from '../../utils/dateUtils';
import { ShoppingBag, ArrowUpRight, ArrowDownLeft, RefreshCw, Sparkles, MapPin, Building } from 'lucide-react';

interface ReceiptCardProps {
  receipt: Receipt;
  onClick?: () => void;
  isCompact?: boolean;
}

export function ReceiptCard({ receipt, onClick, isCompact = false }: ReceiptCardProps) {
  const isIncome = receipt.type === 'Income' || receipt.type === 'Transfer-In';
  const isTransfer = receipt.type === 'Transfer-Out' || receipt.type === 'Transfer-In';

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={`group relative flex flex-col justify-between p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-900 transition-all duration-200 cursor-pointer text-left shadow-sm hover:shadow-cyan-500/10 ${
        isCompact ? 'p-3' : 'p-4'
      }`}
    >
      {/* Top row: Category tag & Date */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300 group-hover:text-cyan-300 group-hover:bg-cyan-950/40 transition-colors border border-slate-700/40">
          <ShoppingBag className="w-3 h-3 text-cyan-400" />
          <span className="truncate max-w-[120px]">{receipt.category}</span>
        </span>
        <span className="text-[11px] font-mono text-slate-400 whitespace-nowrap">
          {formatShortDate(receipt.date)}
        </span>
      </div>

      {/* Subcategory & Note */}
      <div className="my-1.5 flex-1">
        <h4 className="text-sm font-semibold text-white group-hover:text-cyan-200 transition-colors line-clamp-1">
          {receipt.subcategory || receipt.category}
        </h4>
        <p className="text-xs text-slate-400 line-clamp-2 mt-0.5 leading-relaxed font-light">
          {receipt.note || receipt.merchant || 'Recorded household expenditure'}
        </p>
      </div>

      {/* Augmented Location / Merchant pills if available */}
      {(receipt.merchant || receipt.city) && (
        <div className="flex items-center gap-2 my-1 text-[11px] text-slate-400 font-mono">
          {receipt.merchant && (
            <span className="inline-flex items-center gap-1 truncate text-slate-300">
              <Building className="w-3 h-3 text-cyan-400" />
              {receipt.merchant}
            </span>
          )}
          {receipt.city && (
            <span className="inline-flex items-center gap-1 truncate text-slate-400">
              <MapPin className="w-3 h-3 text-slate-400" />
              {receipt.city}
            </span>
          )}
        </div>
      )}

      {/* Bottom row: Mode badge & Amount */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 mt-2">
        <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 truncate max-w-[100px]">
          {receipt.mode}
        </span>

        <div className="flex items-center gap-1">
          {isIncome ? (
            <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-400" />
          ) : isTransfer ? (
            <RefreshCw className="w-3 h-3 text-amber-400" />
          ) : (
            <ArrowUpRight className="w-3.5 h-3.5 text-rose-400" />
          )}
          <span
            className={`font-mono text-sm font-semibold ${
              isIncome
                ? 'text-emerald-400'
                : isTransfer
                ? 'text-amber-300'
                : 'text-slate-100'
            }`}
          >
            {formatCurrency(receipt.amount, receipt.currency)}
          </span>
        </div>
      </div>
    </div>
  );
}
