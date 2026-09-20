import { describe, it, expect } from 'vitest';
import { computeDatasetSummary, groupReceiptsByMonth } from '../utils/analyticsUtils';
import { Receipt } from '../types/receipt';

describe('analyticsUtils', () => {
  const sampleReceipts: Receipt[] = [
    {
      id: 'r1',
      date: new Date('2017-01-15T10:00:00Z'),
      rawDate: '15/01/2017 10:00:00',
      mode: 'Cash',
      category: 'Food',
      subcategory: 'Groceries',
      note: 'Vegetables and milk',
      amount: 250,
      type: 'Expense',
      currency: 'INR',
      timeOfDay: 'morning',
      hasExactTime: true,
    },
    {
      id: 'r2',
      date: new Date('2017-01-16T14:30:00Z'),
      rawDate: '16/01/2017 14:30:00',
      mode: 'Saving Bank account 1',
      category: 'Transportation',
      subcategory: 'Train',
      note: 'Monthly commute pass',
      amount: 600,
      type: 'Expense',
      currency: 'INR',
      timeOfDay: 'afternoon',
      hasExactTime: true,
    },
    {
      id: 'r3',
      date: new Date('2017-01-31T09:00:00Z'),
      rawDate: '31/01/2017 09:00:00',
      mode: 'Saving Bank account 1',
      category: 'Salary',
      subcategory: '',
      note: 'Monthly remuneration',
      amount: 50000,
      type: 'Income',
      currency: 'INR',
      timeOfDay: 'morning',
      hasExactTime: true,
    },
  ];

  it('computes dataset summary accurately', () => {
    const summary = computeDatasetSummary(sampleReceipts);
    expect(summary.totalReceipts).toBe(3);
    expect(summary.totalSpending).toBe(850);
    expect(summary.totalIncome).toBe(50000);
    expect(summary.categoriesCount).toBe(3);
    expect(summary.highestTransaction?.amount).toBe(50000);
    expect(summary.modesCount).toBe(2);
  });

  it('handles empty receipts gracefully', () => {
    const summary = computeDatasetSummary([]);
    expect(summary.totalReceipts).toBe(0);
    expect(summary.totalSpending).toBe(0);
    expect(summary.totalIncome).toBe(0);
    expect(summary.highestTransaction).toBeNull();
  });

  it('groups receipts by month with correct aggregates', () => {
    const buckets = groupReceiptsByMonth(sampleReceipts);
    expect(buckets.length).toBe(1);
    expect(buckets[0].periodKey).toBe('2017-01');
    expect(buckets[0].receiptCount).toBe(3);
    expect(buckets[0].spending).toBe(850);
    expect(buckets[0].income).toBe(50000);
  });
});
