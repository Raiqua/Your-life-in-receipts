import { Receipt } from './receipt';

export type ConnectionType = 
  | 'temporal'
  | 'category_sequence'
  | 'repeated_subcategory'
  | 'spending_cluster'
  | 'financial_rhythm'
  | 'location_merchant';

export interface ConnectionLink {
  id: string;
  sourceId: string;
  targetId: string;
  type: ConnectionType;
  reason: string;
  evidence: string;
  strength: number; // 0 to 1
}

export interface MemoryThread {
  id: string;
  title: string;
  tagline: string;
  type: ConnectionType;
  receiptIds: string[];
  receipts: Receipt[];
  explanation: string;
  detectedPattern: string;
  stats: {
    totalAmount: number;
    receiptCount: number;
    timeSpan: string;
    dominantCategory: string;
  };
}
