import { Receipt } from '../types/receipt';
import { StoryChapter, ChapterArchetype } from '../types/insight';
import { formatShortDate } from '../utils/dateUtils';
import { formatCurrency, formatCompactCurrency } from '../utils/currencyUtils';

export function generateStoryChapters(receipts: Receipt[]): StoryChapter[] {
  if (receipts.length === 0) return [];

  // Group into chronological quarters / phases
  const total = receipts.length;
  const chunkCount = total > 1500 ? 5 : 4;
  const chunkSize = Math.ceil(total / chunkCount);

  const chapters: StoryChapter[] = [];

  for (let c = 0; c < chunkCount; c++) {
    const chunkReceipts = receipts.slice(c * chunkSize, (c + 1) * chunkSize);
    if (chunkReceipts.length === 0) continue;

    const startDate = chunkReceipts[0].date;
    const endDate = chunkReceipts[chunkReceipts.length - 1].date;
    const daysSpan = Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
    const activityVelocity = (chunkReceipts.length / daysSpan); // receipts per day

    let totalSpending = 0;
    let totalIncome = 0;
    let investmentTotal = 0;
    const catMap = new Map<string, { count: number; amount: number }>();

    for (const r of chunkReceipts) {
      if (r.type === 'Expense' || r.type === 'Transfer-Out') {
        totalSpending += r.amount;
        if (
          r.category.toLowerCase().includes('fund') ||
          r.category.toLowerCase().includes('invest') ||
          r.category.toLowerCase().includes('deposit') ||
          r.category.toLowerCase().includes('share') ||
          r.category.toLowerCase().includes('provident')
        ) {
          investmentTotal += r.amount;
        }
      } else if (r.type === 'Income' || r.type === 'Transfer-In') {
        totalIncome += r.amount;
      }

      const prev = catMap.get(r.category) || { count: 0, amount: 0 };
      catMap.set(r.category, {
        count: prev.count + 1,
        amount: prev.amount + r.amount,
      });
    }

    const dominantCategories = Array.from(catMap.entries())
      .map(([category, stats]) => ({
        category,
        count: stats.count,
        amount: stats.amount,
        percentage: Math.round((stats.count / chunkReceipts.length) * 100),
      }))
      .sort((a, b) => b.count - a.count);

    const topCategory = dominantCategories[0]?.category || 'Daily Needs';

    // Archetype heuristic based on true metrics
    let archetype: ChapterArchetype = 'THE EVERYDAY RHYTHM';
    let title = 'The Everyday Rhythm';
    let summary = '';
    let dataProof = '';

    const investmentRatio = totalSpending > 0 ? investmentTotal / totalSpending : 0;

    if (investmentRatio > 0.28 || investmentTotal > 40000) {
      archetype = 'THE INVESTMENT PHASE';
      title = `Chapter ${c + 1}: The Investment Phase`;
      summary = `A period characterized by substantial asset building and systematic capital allocation alongside normal domestic expenses.`;
      dataProof = `${formatCompactCurrency(investmentTotal)} allocated to investments and funds (${Math.round(investmentRatio * 100)}% of outflow in this window).`;
    } else if (activityVelocity >= 2.2) {
      archetype = 'THE BUSY STRETCH';
      title = `Chapter ${c + 1}: The Busy Stretch`;
      summary = `An era of elevated transaction frequency, marked by recurring mobility, dining, and multi-point errands.`;
      dataProof = `Activity velocity peaked at ${activityVelocity.toFixed(1)} receipts logged per day across ${chunkReceipts.length} transactions.`;
    } else if (activityVelocity < 1.0) {
      archetype = 'THE QUIETER PERIOD';
      title = `Chapter ${c + 1}: The Quieter Period`;
      summary = `A sustained interval with lower transaction frequency, concentrated primarily on essential maintenance.`;
      dataProof = `Average transaction frequency moderated to ${(activityVelocity * 7).toFixed(1)} receipts per week, with ${dominantCategories[0]?.percentage}% concentrated in ${topCategory}.`;
    } else {
      archetype = 'THE EVERYDAY RHYTHM';
      title = `Chapter ${c + 1}: The Everyday Rhythm`;
      summary = `Dominated by recurring staple expenses, local transit, food routines, and regular domestic maintenance.`;
      dataProof = `${topCategory} constituted ${dominantCategories[0]?.percentage}% of transactions, with predictable repeat transactions in ${chunkReceipts[0]?.mode || 'Cash/Card'}.`;
    }

    chapters.push({
      id: `chapter-${c + 1}`,
      title,
      archetype,
      dateRangeFormatted: `${formatShortDate(startDate)} – ${formatShortDate(endDate)}`,
      startDate,
      endDate,
      receiptCount: chunkReceipts.length,
      totalSpending,
      totalIncome,
      summary,
      dataProof,
      dominantCategories: dominantCategories.slice(0, 5),
      keyReceipts: chunkReceipts.slice(0, 6),
    });
  }

  return chapters;
}
