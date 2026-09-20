import { describe, it, expect } from 'vitest';
import { detectConnections, buildMemoryThreads } from '../services/connectionEngine';
import { Receipt } from '../types/receipt';

describe('connectionEngine', () => {
  const receipts: Receipt[] = [
    {
      id: 'r1',
      date: new Date('2017-02-10T08:30:00Z'),
      rawDate: '10/02/2017 08:30:00',
      mode: 'Cash',
      category: 'Transportation',
      subcategory: 'Train',
      note: 'Train ticket to station',
      amount: 30,
      type: 'Expense',
      currency: 'INR',
      timeOfDay: 'morning',
      hasExactTime: true,
    },
    {
      id: 'r2',
      date: new Date('2017-02-10T09:15:00Z'),
      rawDate: '10/02/2017 09:15:00',
      mode: 'Cash',
      category: 'Food',
      subcategory: 'Breakfast',
      note: 'Idli sambar and tea',
      amount: 45,
      type: 'Expense',
      currency: 'INR',
      timeOfDay: 'morning',
      hasExactTime: true,
    },
    {
      id: 'r3',
      date: new Date('2017-02-10T19:00:00Z'),
      rawDate: '10/02/2017 19:00:00',
      mode: 'Cash',
      category: 'Household',
      subcategory: 'Groceries',
      note: 'Amul Milk 1L packet',
      amount: 52,
      type: 'Expense',
      currency: 'INR',
      timeOfDay: 'evening',
      hasExactTime: true,
    },
  ];

  it('detects temporal proximity and category sequence connections', () => {
    const links = detectConnections(receipts);
    expect(links.length).toBeGreaterThan(0);
    const categorySeqLink = links.find((l) => l.type === 'category_sequence');
    expect(categorySeqLink).toBeDefined();
    expect(categorySeqLink?.sourceId).toBe('r1');
    expect(categorySeqLink?.targetId).toBe('r2');
  });

  it('provides explicit reasoning for detected links', () => {
    const links = detectConnections(receipts);
    for (const link of links) {
      expect(link.reason).toBeTruthy();
      expect(link.evidence).toBeTruthy();
      expect(link.strength).toBeGreaterThan(0);
    }
  });

  it('handles empty receipts list safely', () => {
    expect(detectConnections([])).toEqual([]);
    expect(buildMemoryThreads([])).toEqual([]);
  });
});
