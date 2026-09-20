import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Clock, CreditCard, Tag, FileText, ArrowRight, Share2, Check } from 'lucide-react';
import { useState } from 'react';
import { Receipt } from '../../types/receipt';
import { formatCurrency } from '../../utils/currencyUtils';
import { formatFriendlyDate } from '../../utils/dateUtils';
import { ReceiptCard } from './ReceiptCard';

interface ReceiptModalProps {
  receipt: Receipt | null;
  onClose: () => void;
  allReceipts: Receipt[];
  onSelectReceipt: (r: Receipt) => void;
}

export function ReceiptModal({
  receipt,
  onClose,
  allReceipts,
  onSelectReceipt,
}: ReceiptModalProps) {
  const [copied, setCopied] = useState(false);

  if (!receipt) return null;

  // Find related moments:
  // 1. Occurring within 24h of this receipt
  // 2. Same subcategory or same category
  const relatedMoments = allReceipts
    .filter((r) => r.id !== receipt.id)
    .map((r) => {
      const timeDiffHours = Math.abs(r.date.getTime() - receipt.date.getTime()) / (1000 * 60 * 60);
      let score = 0;
      let reason = 'Same period';

      if (timeDiffHours <= 18) {
        score += 50;
        reason = 'Occurred within the same activity window';
      }
      if (receipt.subcategory && r.subcategory === receipt.subcategory) {
        score += 30;
        reason = `Recurring subcategory ritual: ${receipt.subcategory}`;
      }
      if (receipt.category === r.category) {
        score += 15;
      }
      if (receipt.merchant && r.merchant === receipt.merchant) {
        score += 40;
        reason = `Same merchant visit: ${receipt.merchant}`;
      }

      return { receipt: r, score, reason, timeDiffHours };
    })
    .filter((item) => item.score > 20)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const handleShare = () => {
    const text = `Receipt: ${receipt.category} (${receipt.subcategory || 'General'}) - ${formatCurrency(receipt.amount, receipt.currency)} on ${formatFriendlyDate(receipt.date)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
        {/* Backdrop click to close */}
        <div className="fixed inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-xl my-8 overflow-hidden rounded-2xl bg-[#0e1320] border border-slate-700/60 shadow-2xl"
        >
          {/* Top header bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-widest text-slate-300">
                Digital Receipt #{receipt.id}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                title="Copy receipt details"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>
              <button
                id="btn-close-receipt-modal"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Receipt Body styled like a cinematic luxury paper receipt */}
          <div className="p-6 md:p-8 space-y-6">
            {/* Upper paper jagged top border illusion */}
            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 font-mono-receipt text-slate-300">
              <div className="text-center border-b border-dashed border-slate-700/80 pb-4 mb-4">
                <div className="text-xs uppercase tracking-widest text-slate-400 mb-1">PERSONAL LEDGER ARCHIVE</div>
                <div className="text-xl font-bold font-editorial text-white tracking-wide">
                  {receipt.subcategory || receipt.category}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {formatFriendlyDate(receipt.date, receipt.hasExactTime)}
                </div>
              </div>

              {/* Exact structured fields as specified in prompt */}
              <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-sans font-semibold">CATEGORY</div>
                  <div className="text-sm font-semibold text-cyan-300 mt-0.5">{receipt.category}</div>
                </div>

                <div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-sans font-semibold">SUBCATEGORY</div>
                  <div className="text-sm font-medium text-slate-200 mt-0.5">{receipt.subcategory || '—'}</div>
                </div>

                <div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-sans font-semibold">DATE</div>
                  <div className="text-sm text-slate-300 mt-0.5">{formatFriendlyDate(receipt.date)}</div>
                </div>

                <div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-sans font-semibold">MODE</div>
                  <div className="text-sm text-slate-300 mt-0.5">{receipt.mode}</div>
                </div>

                <div className="col-span-2">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-sans font-semibold">NOTE / ITEM DESCRIPTION</div>
                  <div className="text-sm text-slate-200 mt-0.5 italic bg-slate-950/40 p-2.5 rounded border border-slate-800/80">
                    {receipt.note || receipt.merchant || 'Household ledger transaction'}
                  </div>
                </div>

                {receipt.merchant && (
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 font-sans font-semibold">MERCHANT</div>
                    <div className="text-sm text-slate-200 mt-0.5">{receipt.merchant}</div>
                  </div>
                )}

                {receipt.city && (
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 font-sans font-semibold">LOCATION</div>
                    <div className="text-sm text-slate-200 mt-0.5">{receipt.city}, {receipt.state || ''}</div>
                  </div>
                )}

                <div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-sans font-semibold">TYPE</div>
                  <div className="text-sm font-semibold text-slate-300 mt-0.5">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs ${
                      receipt.type === 'Income' ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {receipt.type}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-sans font-semibold">AMOUNT</div>
                  <div className="text-xl font-bold text-white mt-0.5">
                    {formatCurrency(receipt.amount, receipt.currency)}
                  </div>
                </div>
              </div>

              {/* Barcode representation */}
              <div className="mt-6 pt-4 border-t border-dashed border-slate-700/80 flex flex-col items-center justify-center opacity-60">
                <div className="h-8 w-48 flex items-stretch gap-1">
                  {[4,2,6,1,3,5,2,4,1,3,6,2,4,1,5,3,2,6,1,4].map((w, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-400"
                      style={{ width: `${w * 2}px` }}
                    />
                  ))}
                </div>
                <div className="text-[9px] tracking-widest text-slate-400 mt-1 font-mono">
                  REC-{receipt.id.toUpperCase()}-VERIFIED
                </div>
              </div>
            </div>

            {/* Related Moments Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs uppercase tracking-widest font-semibold text-slate-300 font-sans">
                  RELATED MOMENTS
                </h3>
              </div>

              {relatedMoments.length > 0 ? (
                <div className="space-y-2.5">
                  {relatedMoments.map((item) => (
                    <div
                      key={item.receipt.id}
                      onClick={() => onSelectReceipt(item.receipt)}
                      className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/60 transition cursor-pointer flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-slate-200 truncate">
                          {item.receipt.category}: {item.receipt.subcategory || item.receipt.note || 'Transaction'}
                        </div>
                        <div className="text-[11px] text-cyan-400/90 font-mono mt-0.5">
                          {item.reason}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {formatFriendlyDate(item.receipt.date)} · {item.receipt.mode}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-white">
                          {formatCurrency(item.receipt.amount, item.receipt.currency)}
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  No immediate temporally adjacent records detected for this specific entry.
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
