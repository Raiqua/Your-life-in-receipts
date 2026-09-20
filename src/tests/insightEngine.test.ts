import { describe, it, expect } from 'vitest';
import { computeDiscoveryInsights } from '../services/insightEngine';
import { Receipt } from '../types/receipt';

describe('insightEngine', () => {
  const mockReceipts: Receipt[] = [
    {
      id: 'r1',
      date: new Date('2017-03-01T08:00:00Z'),
      rawDate: '01/03/2017 08:00:00',
      mode: 'Cash',
      category: 'Food',
      subcategory: 'Breakfast',
      note: 'Tea and bun',
      amount: 30,
      type: 'Expense',
      currency: 'INR',
      timeOfDay: 'morning',
      hasExactTime: true,
    },
    {
      id: 'r2',
      date: new Date('2017-03-01T13:00:00Z'),
      rawDate: '01/03/2017 13:00:00',
      mode: 'Cash',
      category: 'Food',
      subcategory: 'Lunch',
      note: 'Thali',
      amount: 120,
      type: 'Expense',
      currency: 'INR',
      timeOfDay: 'afternoon',
      hasExactTime: true,
    },
    {
      id: 'r3',
      date: new Date('2017-03-01T18:00:00Z'),
      rawDate: '01/03/2017 18:00:00',
      mode: 'Saving Bank account 1',
      category: 'Investment',
      subcategory: 'Mutual Fund',
      note: 'SIP Investment',
      amount: 15000,
      type: 'Transfer-Out',
      currency: 'INR',
      timeOfDay: 'evening',
      hasExactTime: true,
    },
  ];

  it('computes discovery insights accurately', () => {
    const insights = computeDiscoveryInsights(mockReceipts);
    expect(insights.length).toBeGreaterThan(0);
    const topCatInsight = insights.find((i) => i.id === 'disc-top-category');
    expect(topCatInsight).toBeDefined();
    expect(topCatInsight?.category).toBe('Food');
    expect(topCatInsight?.confidenceScore).toBeGreaterThan(0.9);
  });

  it('returns empty array when no receipts provided', () => {
    expect(computeDiscoveryInsights([])).toEqual([]);
  });
});
