import { useState, useEffect, useMemo, useCallback } from 'react';
import { Receipt, DatasetSummary } from '../types/receipt';
import { MemoryThread, ConnectionLink } from '../types/connection';
import { DiscoveryInsight, StoryChapter } from '../types/insight';
import { loadDataset, DatasetSource, parsePrimaryTransactionsCsv, parseAugmentedTransactionsCsv } from '../services/dataLoader';
import { computeDatasetSummary } from '../utils/analyticsUtils';
import { detectConnections, buildMemoryThreads } from '../services/connectionEngine';
import { computeDiscoveryInsights } from '../services/insightEngine';
import { generateStoryChapters } from '../services/storyEngine';

export function useDataset() {
  const [source, setSource] = useState<DatasetSource>('primary');
  const [filename, setFilename] = useState<string>('Daily Household Transactions.csv');
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDataset = useCallback(async (selectedSource: DatasetSource) => {
    setLoading(true);
    setError(null);
    try {
      const res = await loadDataset(selectedSource);
      setReceipts(res.receipts);
      setFilename(res.filename);
      setSource(res.source);
    } catch (err: any) {
      setError(err?.message || 'Failed to load transaction records');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDataset('primary');
  }, [fetchDataset]);

  const switchDataset = useCallback((newSource: DatasetSource) => {
    fetchDataset(newSource);
  }, [fetchDataset]);

  const handleCustomUpload = useCallback((fileText: string, fileName: string) => {
    try {
      setLoading(true);
      let parsed: Receipt[] = [];
      if (fileText.includes('trans_id') || fileText.includes('merchant')) {
        parsed = parseAugmentedTransactionsCsv(fileText);
      } else {
        parsed = parsePrimaryTransactionsCsv(fileText);
      }
      if (parsed.length === 0) {
        throw new Error('No valid transaction records detected in uploaded file.');
      }
      setReceipts(parsed);
      setFilename(fileName);
      setSource('custom');
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'Invalid file format');
    } finally {
      setLoading(false);
    }
  }, []);

  // Compute dataset statistics & intelligence once (memoized)
  const summary: DatasetSummary = useMemo(() => {
    return computeDatasetSummary(receipts);
  }, [receipts]);

  const connections: ConnectionLink[] = useMemo(() => {
    return detectConnections(receipts, 350);
  }, [receipts]);

  const memoryThreads: MemoryThread[] = useMemo(() => {
    return buildMemoryThreads(receipts);
  }, [receipts]);

  const discoveryInsights: DiscoveryInsight[] = useMemo(() => {
    return computeDiscoveryInsights(receipts);
  }, [receipts]);

  const storyChapters: StoryChapter[] = useMemo(() => {
    return generateStoryChapters(receipts);
  }, [receipts]);

  // All distinct categories with count and total spend
  const categoryStats = useMemo(() => {
    const map = new Map<string, { count: number; totalAmount: number; subcategories: Set<string>; receipts: Receipt[] }>();
    for (const r of receipts) {
      const prev = map.get(r.category) || { count: 0, totalAmount: 0, subcategories: new Set(), receipts: [] };
      prev.count++;
      prev.totalAmount += r.amount;
      if (r.subcategory) prev.subcategories.add(r.subcategory);
      prev.receipts.push(r);
      map.set(r.category, prev);
    }

    return Array.from(map.entries()).map(([category, data]) => ({
      category,
      count: data.count,
      totalAmount: data.totalAmount,
      averageAmount: Math.round(data.totalAmount / (data.count || 1)),
      subcategoriesCount: data.subcategories.size,
      subcategories: Array.from(data.subcategories),
      receipts: data.receipts,
    })).sort((a, b) => b.count - a.count);
  }, [receipts]);

  // All distinct payment modes
  const paymentModes = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of receipts) {
      if (r.mode) {
        map.set(r.mode, (map.get(r.mode) || 0) + 1);
      }
    }
    return Array.from(map.entries()).map(([mode, count]) => ({ mode, count })).sort((a, b) => b.count - a.count);
  }, [receipts]);

  return {
    receipts,
    loading,
    error,
    source,
    filename,
    summary,
    connections,
    memoryThreads,
    discoveryInsights,
    storyChapters,
    categoryStats,
    paymentModes,
    switchDataset,
    handleCustomUpload,
  };
}
