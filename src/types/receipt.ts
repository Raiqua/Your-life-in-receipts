export type TransactionType = 'Expense' | 'Income' | 'Transfer-Out' | 'Transfer-In' | 'Unknown';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export interface Receipt {
  id: string;
  date: Date;
  rawDate: string;
  hasExactTime: boolean;
  timeOfDay: TimeOfDay;
  mode: string;
  category: string;
  subcategory: string;
  note: string;
  amount: number;
  type: TransactionType;
  currency: string;
  
  // Optional multi-facet fields from augmented dataset
  merchant?: string;
  city?: string;
  state?: string;
  job?: string;
  isFraud?: boolean;
  merchLat?: number;
  merchLong?: number;
  customerName?: string;
}

export interface ReceiptFilter {
  search: string;
  categories: string[];
  subcategories: string[];
  modes: string[];
  types: TransactionType[];
  startDate: string | null;
  endDate: string | null;
  minAmount: number | null;
  maxAmount: number | null;
}

export interface DatasetSummary {
  totalReceipts: number;
  totalSpending: number;
  totalIncome: number;
  dateRange: {
    start: Date;
    end: Date;
    spanDays: number;
    formatted: string;
  };
  categoriesCount: number;
  mostFrequentCategory: {
    category: string;
    count: number;
    totalAmount: number;
    percentage: number;
  };
  highestTransaction: Receipt | null;
  modesCount: number;
}
