import { Receipt } from '../types/receipt';
import { ConnectionLink, ConnectionType, MemoryThread } from '../types/connection';
import { formatShortDate } from '../utils/dateUtils';

/**
 * Builds pairwise connection links between receipts based on mathematical & temporal heuristics
 */
export function detectConnections(receipts: Receipt[], maxLinks = 400): ConnectionLink[] {
  if (receipts.length < 2) return [];

  const links: ConnectionLink[] = [];
  const linkKeySet = new Set<string>();

  const addLink = (
    source: Receipt,
    target: Receipt,
    type: ConnectionType,
    reason: string,
    evidence: string,
    strength: number
  ) => {
    const key = [source.id, target.id].sort().join('--');
    if (linkKeySet.has(key)) return;
    linkKeySet.add(key);
    links.push({
      id: `link-${links.length + 1}`,
      sourceId: source.id,
      targetId: target.id,
      type,
      reason,
      evidence,
      strength,
    });
  };

  // 1. Temporal Proximity & Sequence Detection (chronological sliding window)
  for (let i = 0; i < receipts.length - 1; i++) {
    const current = receipts[i];

    for (let j = i + 1; j < Math.min(i + 8, receipts.length); j++) {
      const next = receipts[j];
      const timeDiffHours = (next.date.getTime() - current.date.getTime()) / (1000 * 60 * 60);

      // Same Activity Window (within 24 hours)
      if (timeDiffHours <= 24) {
        // Different categories occurring together (e.g. Travel + Food or Food + Entertainment)
        if (current.category !== next.category) {
          // Category Sequence Detection (e.g. Transportation -> Food)
          const isCategorySequence =
            (current.category.toLowerCase().includes('transport') && next.category.toLowerCase().includes('food')) ||
            (current.category.toLowerCase().includes('food') && next.category.toLowerCase().includes('entertainment'));

          if (isCategorySequence) {
            addLink(
              current,
              next,
              'category_sequence',
              'This sequence appears repeatedly in the dataset.',
              `Transition from ${current.category} to ${next.category} in sequential time order within ${timeDiffHours < 1 ? 'an hour' : `${Math.round(timeDiffHours)} hours`}.`,
              0.9
            );
          } else {
            addLink(
              current,
              next,
              'temporal',
              'These receipts occurred within the same activity window.',
              `${current.category} (${current.subcategory || 'General'}) and ${next.category} (${next.subcategory || 'General'}) recorded within ${timeDiffHours < 1 ? 'an hour' : `${Math.round(timeDiffHours)} hours`}.`,
              0.85
            );
          }
        }
      }

      // Financial Relationship: Income -> subsequent spending within 3 days
      if (
        (current.type === 'Income' || current.type === 'Transfer-In') &&
        (next.type === 'Expense' || next.type === 'Transfer-Out') &&
        timeDiffHours <= 72
      ) {
        addLink(
          current,
          next,
          'financial_rhythm',
          'Spending frequently follows income activity in this period.',
          `Income inflow of ₹${current.amount} on ${formatShortDate(current.date)} followed by ₹${next.amount} ${next.category} outflow on ${formatShortDate(next.date)}.`,
          0.75
        );
      }

      if (links.length >= maxLinks) break;
    }
    if (links.length >= maxLinks) break;
  }

  // 2. Repeated Subcategory Rituals (e.g., Train commutes, daily milk, grocery replenishment)
  const subcatGroups = new Map<string, Receipt[]>();
  for (const r of receipts) {
    if (r.subcategory && r.subcategory.length > 2) {
      const k = `${r.category}::${r.subcategory}`.toLowerCase();
      const list = subcatGroups.get(k) || [];
      list.push(r);
      subcatGroups.set(k, list);
    }
  }

  subcatGroups.forEach((group) => {
    if (group.length >= 3) {
      // link consecutive instances
      for (let k = 0; k < Math.min(group.length - 1, 4); k++) {
        if (links.length >= maxLinks) break;
        addLink(
          group[k],
          group[k + 1],
          'repeated_subcategory',
          'Recurring activity ritual detected across time.',
          `Recurring "${group[k].subcategory}" under ${group[k].category} recorded repeatedly in the personal ledger.`,
          0.8
        );
      }
    }
  });

  // 3. Location / Merchant Connections (for augmented dataset or recurring merchants)
  const merchantGroups = new Map<string, Receipt[]>();
  for (const r of receipts) {
    if (r.merchant) {
      const list = merchantGroups.get(r.merchant) || [];
      list.push(r);
      merchantGroups.set(r.merchant, list);
    }
  }

  merchantGroups.forEach((group, merchant) => {
    if (group.length >= 2) {
      for (let k = 0; k < Math.min(group.length - 1, 3); k++) {
        if (links.length >= maxLinks) break;
        addLink(
          group[k],
          group[k + 1],
          'location_merchant',
          'Repeated visits to the same merchant establishment.',
          `Customer transacted at ${merchant} multiple times across different days.`,
          0.85
        );
      }
    }
  });

  return links;
}

/**
 * Builds thematic "Memory Threads" - recognizable, narrated threads of receipts
 */
export function buildMemoryThreads(receipts: Receipt[]): MemoryThread[] {
  if (receipts.length === 0) return [];

  const threads: MemoryThread[] = [];

  // Thread 1: The Daily Commute & Food Sequence (Transportation -> Food)
  const transitFoodSeq: Receipt[] = [];
  for (let i = 0; i < receipts.length - 1; i++) {
    const a = receipts[i];
    const b = receipts[i + 1];
    const diffHours = (b.date.getTime() - a.date.getTime()) / (1000 * 60 * 60);

    if (
      diffHours <= 12 &&
      (a.category.toLowerCase().includes('transport') || a.category.toLowerCase().includes('travel')) &&
      a.category.toLowerCase() !== b.category.toLowerCase()
    ) {
      if (!transitFoodSeq.some((r) => r.id === a.id)) transitFoodSeq.push(a);
      if (!transitFoodSeq.some((r) => r.id === b.id)) transitFoodSeq.push(b);
      if (transitFoodSeq.length >= 7) break;
    }
  }

  if (transitFoodSeq.length >= 3) {
    const total = transitFoodSeq.reduce((sum, r) => sum + r.amount, 0);
    threads.push({
      id: 'thread-commute-rhythm',
      title: 'The Commuter’s Arc',
      tagline: 'Transportation paired with sustenance along familiar transit corridors',
      type: 'category_sequence',
      receiptIds: transitFoodSeq.map((r) => r.id),
      receipts: transitFoodSeq,
      explanation:
        'This sequence appears repeatedly in the dataset: transit journeys (train, auto, cab) are closely followed by food and beverage receipts within the same half-day window.',
      detectedPattern: 'Transit → Refreshment Sequence',
      stats: {
        totalAmount: total,
        receiptCount: transitFoodSeq.length,
        timeSpan: `${formatShortDate(transitFoodSeq[0].date)} – ${formatShortDate(transitFoodSeq[transitFoodSeq.length - 1].date)}`,
        dominantCategory: 'Transportation & Food',
      },
    });
  }

  // Thread 2: Household Essentials & Recurring Rituals (Milk, Groceries, Supplies)
  const recurringRituals = receipts.filter(
    (r) =>
      r.subcategory.toLowerCase().includes('milk') ||
      r.subcategory.toLowerCase().includes('grocery') ||
      r.note.toLowerCase().includes('milk') ||
      r.note.toLowerCase().includes('atta')
  ).slice(0, 8);

  if (recurringRituals.length >= 3) {
    const total = recurringRituals.reduce((sum, r) => sum + r.amount, 0);
    threads.push({
      id: 'thread-domestic-ritual',
      title: 'The Domestic Anchor',
      tagline: 'A rhythmic cadence of household staples and daily nutrition',
      type: 'repeated_subcategory',
      receiptIds: recurringRituals.map((r) => r.id),
      receipts: recurringRituals,
      explanation:
        'Recurring subcategory ritual detected: daily milk deliveries, fresh flour, and grocery staples punctuate the timeline with steady frequency.',
      detectedPattern: 'Household Staple Cadence',
      stats: {
        totalAmount: total,
        receiptCount: recurringRituals.length,
        timeSpan: `${formatShortDate(recurringRituals[0].date)} – ${formatShortDate(recurringRituals[recurringRituals.length - 1].date)}`,
        dominantCategory: 'Household / Food',
      },
    });
  }

  // Thread 3: The Investment Milestone Sequence (Mutual Funds, PPF, Deposits)
  const investmentReceipts = receipts.filter(
    (r) =>
      r.category.toLowerCase().includes('fund') ||
      r.category.toLowerCase().includes('invest') ||
      r.category.toLowerCase().includes('provident') ||
      r.category.toLowerCase().includes('deposit') ||
      r.category.toLowerCase().includes('share')
  ).slice(0, 8);

  if (investmentReceipts.length >= 3) {
    const total = investmentReceipts.reduce((sum, r) => sum + r.amount, 0);
    threads.push({
      id: 'thread-wealth-building',
      title: 'The Capital Horizon',
      tagline: 'Deliberate allocations toward mutual funds, equities, and security funds',
      type: 'financial_rhythm',
      receiptIds: investmentReceipts.map((r) => r.id),
      receipts: investmentReceipts,
      explanation:
        'Strategic transfers and investments: systematic equity funds, small cap SIPs, and provident deposits reflecting conscious financial planning.',
      detectedPattern: 'Systematic Capital Allocation',
      stats: {
        totalAmount: total,
        receiptCount: investmentReceipts.length,
        timeSpan: `${formatShortDate(investmentReceipts[0].date)} – ${formatShortDate(investmentReceipts[investmentReceipts.length - 1].date)}`,
        dominantCategory: 'Investment / Funds',
      },
    });
  }

  // Thread 4: Cultural Celebrations & Festive Moments
  const festivalReceipts = receipts.filter(
    (r) =>
      r.category.toLowerCase().includes('festival') ||
      r.category.toLowerCase().includes('gift') ||
      r.note.toLowerCase().includes('ganesh') ||
      r.note.toLowerCase().includes('diwali') ||
      r.note.toLowerCase().includes('pujan') ||
      r.note.toLowerCase().includes('celebrat')
  ).slice(0, 8);

  if (festivalReceipts.length >= 2) {
    const total = festivalReceipts.reduce((sum, r) => sum + r.amount, 0);
    threads.push({
      id: 'thread-festive-moments',
      title: 'The Cultural Tapestry',
      tagline: 'Moments of celebration, tradition, and community offerings',
      type: 'spending_cluster',
      receiptIds: festivalReceipts.map((r) => r.id),
      receipts: festivalReceipts,
      explanation:
        'These receipts occurred in distinct cultural windows marked by festive preparation, idols, offerings, and shared family gifts.',
      detectedPattern: 'Cultural Observance Clusters',
      stats: {
        totalAmount: total,
        receiptCount: festivalReceipts.length,
        timeSpan: `${formatShortDate(festivalReceipts[0].date)} – ${formatShortDate(festivalReceipts[festivalReceipts.length - 1].date)}`,
        dominantCategory: 'Festivals & Gifts',
      },
    });
  }

  // Thread 5: Digital Subscriptions & Connectivity Thread
  const digitalReceipts = receipts.filter(
    (r) =>
      r.category.toLowerCase().includes('subscription') ||
      r.note.toLowerCase().includes('netflix') ||
      r.note.toLowerCase().includes('data booster') ||
      r.note.toLowerCase().includes('tata play') ||
      r.note.toLowerCase().includes('recharge')
  ).slice(0, 8);

  if (digitalReceipts.length >= 3) {
    const total = digitalReceipts.reduce((sum, r) => sum + r.amount, 0);
    threads.push({
      id: 'thread-digital-ecosystem',
      title: 'The Modern Tether',
      tagline: 'Continuous digital subscriptions, streaming platforms, and telecom boosters',
      type: 'repeated_subcategory',
      receiptIds: digitalReceipts.map((r) => r.id),
      receipts: digitalReceipts,
      explanation:
        'These receipts occurred within regular billing cycles: automated streaming subscriptions, mobile data renewals, and digital lifestyle connectivity.',
      detectedPattern: 'Recurring Subscription Rhythm',
      stats: {
        totalAmount: total,
        receiptCount: digitalReceipts.length,
        timeSpan: `${formatShortDate(digitalReceipts[0].date)} – ${formatShortDate(digitalReceipts[digitalReceipts.length - 1].date)}`,
        dominantCategory: 'Subscriptions / Telecom',
      },
    });
  }

  return threads;
}
