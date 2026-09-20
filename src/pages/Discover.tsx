import { Sparkles, Network, Zap } from 'lucide-react';
import { Receipt } from '../types/receipt';
import { DiscoveryInsight } from '../types/insight';
import { MemoryThread } from '../types/connection';
import { DiscoveryEngine } from '../components/insights/DiscoveryEngineModal';
import { MemoryThreadViewer } from '../components/memory-thread/MemoryThreadViewer';

interface DiscoverPageProps {
  receipts: Receipt[];
  insights: DiscoveryInsight[];
  threads: MemoryThread[];
  onSelectReceipt: (r: Receipt) => void;
}

export function DiscoverPage({
  insights,
  threads,
  onSelectReceipt,
}: DiscoverPageProps) {
  return (
    <div className="space-y-12 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
            PATTERN INTELLIGENCE & RECURRING RHYTHMS
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-editorial text-white mt-1">
          The Forensic Discovery Engine
        </h1>
        <p className="text-sm text-slate-300 font-light mt-2 max-w-2xl leading-relaxed">
          Uncovering implicit habits, repetitive sequences, and statistical anomalies hiding within the transaction record.
        </p>
      </div>

      {/* Discovery Engine Spotlight */}
      <section>
        <DiscoveryEngine insights={insights} onSelectReceipt={onSelectReceipt} />
      </section>

      {/* Memory Threads Viewer */}
      <section className="space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-cyan-400" />
            <h2 className="font-editorial text-2xl font-bold text-white">
              Memory Threads
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Chains of adjacent transactions forming recognizable life sequences. Every link specifies why the connection exists.
          </p>
        </div>

        <MemoryThreadViewer threads={threads} onSelectReceipt={onSelectReceipt} />
      </section>
    </div>
  );
}
