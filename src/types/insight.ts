import { Receipt } from './receipt';

export type InsightType = 
  | 'frequency'
  | 'burst'
  | 'sequence'
  | 'anomaly'
  | 'income_spending'
  | 'time_of_day'
  | 'repeated_habit'
  | 'financial_flow';

export interface DiscoveryInsight {
  id: string;
  type: InsightType;
  title: string;
  didYouNoticeThis: string;
  supportingStatistic: string;
  explanation: string;
  category?: string;
  relevantReceiptIds: string[];
  relevantReceipts: Receipt[];
  callToAction: string;
  targetView: 'Journey' | 'LifeMap' | 'Patterns' | 'Receipts' | 'Discover';
  confidenceScore: number;
}

export type ChapterArchetype = 
  | 'THE EVERYDAY RHYTHM'
  | 'THE BUSY STRETCH'
  | 'THE INVESTMENT PHASE'
  | 'THE QUIETER PERIOD'
  | 'THE TRANSITION PERIOD';

export interface StoryChapter {
  id: string;
  title: string;
  archetype: ChapterArchetype;
  dateRangeFormatted: string;
  startDate: Date;
  endDate: Date;
  receiptCount: number;
  totalSpending: number;
  totalIncome: number;
  summary: string;
  dataProof: string;
  dominantCategories: {
    category: string;
    count: number;
    amount: number;
    percentage: number;
  }[];
  keyReceipts: Receipt[];
}
