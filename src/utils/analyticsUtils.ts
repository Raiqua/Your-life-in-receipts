import { Receipt, DatasetSummary } from '../types/receipt';
import { formatShortDate, formatMonthYear } from './dateUtils';

export function computeDatasetSummary(receipts: Receipt[]): DatasetSummary {
  if (receipts.length === 0) {
    const now = new Date();
    return {
      totalReceipts: 0,
      totalSpending: 0,
      totalIncome: 0,
      dateRange: { start: now, end: now, spanDays: 0, formatted: 'No data' },
      categoriesCount: 0,
      mostFrequentCategory: { category: 'None', count: 0, totalAmount: 0, percentage: 0 },
      highestTransaction: null,
      modesCount: 0,
    };
  }

  let totalSpending = 0;
  let totalIncome = 0;
  let highestTransaction: Receipt | null = null;
  const categoryMap = new Map<string, { count: number; totalAmount: number }>();
  const modesSet = new Set<string>();

  let minDate = receipts[0].date;
  let maxDate = receipts[0].date;

  for (const r of receipts) {
    if (r.date < minDate) minDate = r.date;
    if (r.date > maxDate) maxDate = r.date;

    if (r.type === 'Expense' || r.type === 'Transfer-Out') {
      totalSpending += r.amount;
    } else if (r.type === 'Income' || r.type === 'Transfer-In') {
      totalIncome += r.amount;
    }

    if (!highestTransaction || r.amount > highestTransaction.amount) {
      highestTransaction = r;
    }

    if (r.category) {
      const prev = categoryMap.get(r.category) || { count: 0, totalAmount: 0 };
      categoryMap.set(r.category, {
        count: prev.count + 1,
        totalAmount: prev.totalAmount + r.amount,
      });
    }

    if (r.mode) {
      modesSet.add(r.mode);
    }
  }

  // Find most frequent category
  let topCategory = { category: 'None', count: 0, totalAmount: 0, percentage: 0 };
  categoryMap.forEach((val, cat) => {
    if (val.count > topCategory.count) {
      topCategory = {
        category: cat,
        count: val.count,
        totalAmount: val.totalAmount,
        percentage: Math.round((val.count / receipts.length) * 100),
      };
    }
  });

  const spanDays = Math.max(
    1,
    Math.round((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24))
  );

  return {
    totalReceipts: receipts.length,
    totalSpending,
    totalIncome,
    dateRange: {
      start: minDate,
      end: maxDate,
      spanDays,
      formatted: `${formatShortDate(minDate)} – ${formatShortDate(maxDate)}`,
    },
    categoriesCount: categoryMap.size,
    mostFrequentCategory: topCategory,
    highestTransaction,
    modesCount: modesSet.size,
  };
}

export interface ActivityBucket {
  periodKey: string;
  label: string;
  startDate: Date;
  endDate: Date;
  receiptCount: number;
  spending: number;
  income: number;
  topCategories: { category: string; count: number; amount: number }[];
  receipts: Receipt[];
}

export function groupReceiptsByMonth(receipts: Receipt[]): ActivityBucket[] {
  const map = new Map<string, Receipt[]>();

  for (const r of receipts) {
    const key = `${r.date.getFullYear()}-${String(r.date.getMonth() + 1).padStart(2, '0')}`;
    const list = map.get(key) || [];
    list.push(r);
    map.set(key, list);
  }

  const sortedKeys = Array.from(map.keys()).sort();
  return sortedKeys.map((key) => {
    const list = map.get(key)!;
    let spending = 0;
    let income = 0;
    const catMap = new Map<string, { count: number; amount: number }>();

    for (const item of list) {
      if (item.type === 'Expense' || item.type === 'Transfer-Out') {
        spending += item.amount;
      } else if (item.type === 'Income' || item.type === 'Transfer-In') {
        income += item.amount;
      }

      if (item.category) {
        const c = catMap.get(item.category) || { count: 0, amount: 0 };
        catMap.set(item.category, {
          count: c.count + 1,
          amount: c.amount + item.amount,
        });
      }
    }

    const topCategories = Array.from(catMap.entries())
      .map(([category, stats]) => ({ category, count: stats.count, amount: stats.amount }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);

    const [yearStr, monthStr] = key.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10) - 1;
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    return {
      periodKey: key,
      label: formatMonthYear(startDate),
      startDate,
      endDate,
      receiptCount: list.length,
      spending,
      income,
      topCategories,
      receipts: list,
    };
  });
}
