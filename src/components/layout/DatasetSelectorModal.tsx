import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Database, Upload, CheckCircle2, FileSpreadsheet, Sparkles, AlertCircle } from 'lucide-react';
import { DatasetSource } from '../../services/dataLoader';

interface DatasetSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSource: DatasetSource;
  activeFilename: string;
  onSelectSource: (source: DatasetSource) => void;
  onCustomUpload: (text: string, name: string) => void;
  totalRecords: number;
}

export function DatasetSelectorModal({
  isOpen,
  onClose,
  activeSource,
  activeFilename,
  onSelectSource,
  onCustomUpload,
  totalRecords,
}: DatasetSelectorModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileProcess = (file: File) => {
    setUploadError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content && content.length > 20) {
        onCustomUpload(content, file.name);
        onClose();
      } else {
        setUploadError('File appears empty or unreadable.');
      }
    };
    reader.onerror = () => {
      setUploadError('Failed to read file.');
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
        <div className="fixed inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative z-10 w-full max-w-lg p-6 rounded-2xl bg-[#0e1320] border border-slate-700/60 shadow-2xl text-slate-200"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="font-editorial text-base font-bold text-white tracking-wide">
                  DATASET ARCHIVE
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  Currently loaded: {totalRecords.toLocaleString()} transactions
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-5 space-y-4">
            {/* Primary Dataset Card */}
            <div
              onClick={() => {
                onSelectSource('primary');
                onClose();
              }}
              className={`p-4 rounded-xl border transition cursor-pointer flex items-start gap-3.5 ${
                activeSource === 'primary'
                  ? 'bg-cyan-950/30 border-cyan-500/50 ring-1 ring-cyan-500/30'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <FileSpreadsheet className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-white truncate">
                    Daily Household Transactions.csv
                  </h4>
                  {activeSource === 'primary' && (
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Primary authentic diary archive containing approximately 2,461 real personal moments spanning 2015–2018 (Mode, Category, Subcategory, Note, Amount, Currency).
                </p>
                <div className="mt-2 text-[11px] font-mono text-cyan-400">
                  2,461 verified historical records
                </div>
              </div>
            </div>

            {/* Augmented Dataset Card */}
            <div
              onClick={() => {
                onSelectSource('augmented');
                onClose();
              }}
              className={`p-4 rounded-xl border transition cursor-pointer flex items-start gap-3.5 ${
                activeSource === 'augmented'
                  ? 'bg-cyan-950/30 border-cyan-500/50 ring-1 ring-cyan-500/30'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <Sparkles className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-white truncate">
                    Augmented_IndiaTransactMultiFacet2024.csv
                  </h4>
                  {activeSource === 'augmented' && (
                    <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Multi-faceted pan-Indian transaction dataset containing merchant identities, occupations, cities, states, fraud flags, and geographical coordinates.
                </p>
                <div className="mt-2 text-[11px] font-mono text-violet-400">
                  Geo-tagged multi-facet consumer telemetry
                </div>
              </div>
            </div>

            {/* Custom Upload Section with Drag & Drop */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-5 rounded-xl border-2 border-dashed text-center transition cursor-pointer ${
                dragOver
                  ? 'border-cyan-400 bg-cyan-950/20'
                  : 'border-slate-700/80 bg-slate-900/40 hover:border-slate-600 hover:bg-slate-900/60'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.tsv,.json,.txt"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileProcess(e.target.files[0]);
                  }
                }}
              />
              <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-medium text-slate-200">
                Drop your own CSV, TSV, or JSON file here, or <span className="text-cyan-400 underline">browse</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Zero backend ingestion. 100% processed client-side in browser memory.
              </p>
            </div>

            {uploadError && (
              <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
