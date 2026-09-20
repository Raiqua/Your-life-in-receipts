import { Receipt } from '../types/receipt';
import { DiscoveryInsight } from '../types/insight';
import { formatCurrency, formatCompactCurrency } from '../utils/currencyUtils';
import { formatShortDate } from '../utils/dateUtils';

export function computeDiscoveryInsights(receipts: Receipt[]): DiscoveryInsight[] {
  if (receipts.length === 0) return [];

  const insights: DiscoveryInsight[] = [];

  // 1. Most Repeated Category
  const catCount = new Map<string, { count: number; totalAmt: number; receipts: Receipt[] }>();
  for (const r of receipts) {
    const list = catCount.get(r.category) || { count: 0, totalAmt: 0, receipts: [] };
    list.count++;
    list.totalAmt += r.amount;
    list.receipts.push(r);
    catCount.set(r.category, list);
  }

  let topCategory = '';
  let topCatData = { count: 0, totalAmt: 0, receipts: [] as Receipt[] };
  catCount.forEach((data, cat) => {
    if (data.count > topCatData.count) {
      topCategory = cat;
      topCatData = data;
    }
  });

  if (topCatData.count > 0) {
    const pct = Math.round((topCatData.count / receipts.length) * 100);
    insights.push({
      id: 'disc-top-category',
      type: 'frequency',
      title: 'The Dominant Cadence',
      didYouNoticeThis: `${topCategory} appears ${topCatData.count} times in the dataset, accounting for ${pct}% of all logged moments.`,
      supportingStatistic: `${topCatData.count} of ${receipts.length} total transactions (${formatCurrency(topCatData.totalAmt)} aggregate volume)`,
      explanation: `Of all facets in this person's financial ledger, ${topCategory} recurs more persistently than any other lifestyle dimension.`,
      category: topCategory,
      relevantReceiptIds: topCatData.receipts.slice(0, 10).map((r) => r.id),
      relevantReceipts: topCatData.receipts.slice(0, 10),
      callToAction: `Explore ${topCategory}`,
      targetView: 'Patterns',
      confidenceScore: 0.98,
    });
  }

  // 2. Highest Spending Single Day
  const daySpend = new Map<string, { date: Date; total: number; receipts: Receipt[] }>();
  for (const r of receipts) {
    if (r.type === 'Expense' || r.type === 'Transfer-Out') {
      const key = `${r.date.getFullYear()}-${r.date.getMonth() + 1}-${r.date.getDate()}`;
      const entry = daySpend.get(key) || { date: r.date, total: 0, receipts: [] };
      entry.total += r.amount;
      entry.receipts.push(r);
      daySpend.set(key, entry);
    }
  }

  let peakDay = { date: new Date(), total: 0, receipts: [] as Receipt[] };
  daySpend.forEach((entry) => {
    if (entry.total > peakDay.total) {
      peakDay = entry;
    }
  });

  if (peakDay.total > 0) {
    insights.push({
      id: 'disc-peak-day',
      type: 'burst',
      title: 'The Single-Day Outlier',
      didYouNoticeThis: `On ${formatShortDate(peakDay.date)}, total recorded transactions surged to ${formatCurrency(peakDay.total)} across ${peakDay.receipts.length} entries.`,
      supportingStatistic: `${formatCurrency(peakDay.total)} spent across ${peakDay.receipts.length} distinct receipts in 24 hours`,
      explanation: `This single day represents the sharpest expenditure spike in the entire recorded history, propelled by ${peakDay.receipts[0]?.category || 'major commitments'}.`,
      relevantReceiptIds: peakDay.receipts.map((r) => r.id),
      relevantReceipts: peakDay.receipts,
      callToAction: 'Inspect Peak Day Receipts',
      targetView: 'Receipts',
      confidenceScore: 0.95,
    });
  }

  // 3. Most Repeated Subcategory / Micro-Habit
  const subcatCount = new Map<string, { category: string; count: number; totalAmt: number; receipts: Receipt[] }>();
  for (const r of receipts) {
    if (r.subcategory && r.subcategory.length > 1) {
      const k = `${r.category}::${r.subcategory}`;
      const prev = subcatCount.get(k) || { category: r.category, count: 0, totalAmt: 0, receipts: [] };
      prev.count++;
      prev.totalAmt += r.amount;
      prev.receipts.push(r);
      subcatCount.set(k, prev);
    }
  }

  let topSubcatKey = '';
  let topSubcatData = { category: '', count: 0, totalAmt: 0, receipts: [] as Receipt[] };
  subcatCount.forEach((data, k) => {
    if (data.count > topSubcatData.count) {
      topSubcatKey = k;
      topSubcatData = data;
    }
  });

  if (topSubcatData.count > 5) {
    const subcatName = topSubcatKey.split('::')[1];
    insights.push({
      id: 'disc-top-subcategory',
      type: 'repeated_habit',
      title: 'The Daily Micro-Ritual',
      didYouNoticeThis: `The specific subcategory "${subcatName}" appears ${topSubcatData.count} individual times under ${topSubcatData.category}.`,
      supportingStatistic: `${topSubcatData.count} recurrences totaling ${formatCurrency(topSubcatData.totalAmt)}`,
      explanation: `Repeated with unwavering rhythm, this micro-habit reveals daily personal routines such as regular commutes, nutritional staples, or essential sustenance.`,
      relevantReceiptIds: topSubcatData.receipts.slice(0, 10).map((r) => r.id),
      relevantReceipts: topSubcatData.receipts.slice(0, 10),
      callToAction: `Filter by "${subcatName}"`,
      targetView: 'Receipts',
      confidenceScore: 0.94,
    });
  }

  // 4. Unusual Transaction / Highest Value Asset Outlier
  const sortedByAmt = [...receipts].sort((a, b) => b.amount - a.amount);
  if (sortedByAmt.length > 0) {
    const highest = sortedByAmt[0];
    const avgAmt = receipts.reduce((sum, r) => sum + r.amount, 0) / receipts.length;
    const ratio = Math.round(highest.amount / (avgAmt || 1));

    insights.push({
      id: 'disc-highest-outlier',
      type: 'anomaly',
      title: 'The Monumental Outlier',
      didYouNoticeThis: `A single transaction of ${formatCurrency(highest.amount)} in ${highest.category} stands at ${ratio}x the typical transaction average.`,
      supportingStatistic: `${formatCurrency(highest.amount)} vs. ₹${Math.round(avgAmt)} dataset median/mean baseline`,
      explanation: `Occurring on ${formatShortDate(highest.date)} via ${highest.mode} (${highest.note || highest.subcategory || 'Asset transaction'}), this moment marks an extraordinary event compared to everyday expenditures.`,
      relevantReceiptIds: [highest.id],
      relevantReceipts: [highest],
      callToAction: 'Inspect Landmark Receipt',
      targetView: 'Receipts',
      confidenceScore: 0.96,
    });
  }

  // 5. Time of Day Pattern (Where exact timestamps are present)
  const timeBuckets = { morning: 0, afternoon: 0, evening: 0, night: 0 };
  const exactTimeReceipts: Receipt[] = [];
  for (const r of receipts) {
    if (r.hasExactTime) {
      timeBuckets[r.timeOfDay]++;
      exactTimeReceipts.push(r);
    }
  }

  if (exactTimeReceipts.length > 50) {
    const dominantTime = (Object.entries(timeBuckets).sort((a, b) => b[1] - a[1])[0]);
    const dominantPct = Math.round((dominantTime[1] / exactTimeReceipts.length) * 100);

    insights.push({
      id: 'disc-time-distribution',
      type: 'time_of_day',
      title: 'The Circadian Spending Rhythm',
      didYouNoticeThis: `${dominantPct}% of timestamped transactions occurred during the ${dominantTime[0]}, marking the person's peak operational window.`,
      supportingStatistic: `${dominantTime[1]} timestamped records during ${dominantTime[0]} hours`,
      explanation: `Transaction timestamps reveal a pronounced daylight curve, aligning with commuting windows, midday lunches, or evening shopping patterns.`,
      relevantReceiptIds: exactTimeReceipts.filter((r) => r.timeOfDay === dominantTime[0]).slice(0, 8).map((r) => r.id),
      relevantReceipts: exactTimeReceipts.filter((r) => r.timeOfDay === dominantTime[0]).slice(0, 8),
      callToAction: 'View Circadian Rhythm',
      targetView: 'Journey',
      confidenceScore: 0.91,
    });
  }

  // 6. Income to Spending Flow
  const incomeItems = receipts.filter((r) => r.type === 'Income' || r.type === 'Transfer-In');
  const totalIncome = incomeItems.reduce((s, r) => s + r.amount, 0);
  const expenseItems = receipts.filter((r) => r.type === 'Expense' || r.type === 'Transfer-Out');
  const totalExpense = expenseItems.reduce((s, r) => s + r.amount, 0);

  if (incomeItems.length > 0) {
    insights.push({
      id: 'disc-financial-flow',
      type: 'income_spending',
      title: 'The Inflow / Outflow Balance',
      didYouNoticeThis: `Across ${incomeItems.length} documented inflow milestones (${formatCompactCurrency(totalIncome)}), total recorded outflow stands at ${formatCompactCurrency(totalExpense)}.`,
      supportingStatistic: `${incomeItems.length} income events vs ${expenseItems.length} expense outflows (${Math.round((totalExpense / (totalIncome || 1)) * 100)}% outflow ratio)`,
      explanation: `Income events punctuate the record at strategic intervals (salary, family transfers, bonuses), frequently followed by clusters of domestic restocking and investments.`,
      relevantReceiptIds: incomeItems.slice(0, 6).map((r) => r.id),
      relevantReceipts: incomeItems.slice(0, 6),
      callToAction: 'Trace Financial Rhythms',
      targetView: 'Patterns',
      confidenceScore: 0.93,
    });
  }

  return insights;
}
