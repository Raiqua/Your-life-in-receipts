import { useState } from 'react';
import { Map, Sparkles, Filter, Info } from 'lucide-react';
import { Receipt } from '../types/receipt';
import { LifeMapCanvas } from '../components/life-map/LifeMapCanvas';

interface LifeMapPageProps {
  receipts: Receipt[];
  onSelectReceipt: (r: Receipt) => void;
}

export function LifeMapPage({ receipts, onSelectReceipt }: LifeMapPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Map className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
              TOPOLOGICAL ARCHIVE MAP
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-editorial text-white mt-0.5">
            The Interactive Life Map
          </h1>
        </div>

        <div className="text-xs font-mono text-slate-400">
          Mapping <strong className="text-cyan-300">{receipts.length.toLocaleString()}</strong> topological moments
        </div>
      </div>

      {/* The Central Canvas Network */}
      <LifeMapCanvas
        receipts={receipts}
        onSelectReceipt={onSelectReceipt}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
    </div>
  );
}
