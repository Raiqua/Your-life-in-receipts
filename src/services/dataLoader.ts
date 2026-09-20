import { Receipt, TransactionType } from '../types/receipt';
import { parseReceiptDate } from '../utils/dateUtils';

// Embedded default fallback in case network fetch fails in preview environment
import rawDefaultCsv from '../data/DailyHouseholdTransactions.csv?raw';

export type DatasetSource = 'primary' | 'augmented' | 'custom';

export interface LoadDatasetResult {
  receipts: Receipt[];
  source: DatasetSource;
  filename: string;
  totalRecords: number;
}

/**
 * Robust CSV Line Parser that handles escaped quotes and internal commas
 */
function parseCsvRows(text: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentField);
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++; // skip \n of \r\n
      }
      currentRow.push(currentField);
      currentField = '';
      if (currentRow.some((f) => f.trim().length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
    } else {
      currentField += char;
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField);
    if (currentRow.some((f) => f.trim().length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

export function parsePrimaryTransactionsCsv(csvText: string): Receipt[] {
  const rows = parseCsvRows(csvText);
  if (rows.length < 2) return [];

  const headers = rows[0].map((h) => h.trim().toLowerCase());
  const dateIdx = headers.findIndex((h) => h === 'date');
  const modeIdx = headers.findIndex((h) => h === 'mode');
  const catIdx = headers.findIndex((h) => h === 'category');
  const subcatIdx = headers.findIndex((h) => h === 'subcategory');
  const noteIdx = headers.findIndex((h) => h === 'note');
  const amountIdx = headers.findIndex((h) => h === 'amount');
  const typeIdx = headers.findIndex((h) => h.includes('income') || h.includes('expense') || h === 'type');
  const currencyIdx = headers.findIndex((h) => h === 'currency');

  const receipts: Receipt[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.length < 5) continue;

    const rawDate = (row[dateIdx >= 0 ? dateIdx : 0] || '').trim();
    if (!rawDate) continue;

    const { date, hasExactTime, timeOfDay } = parseReceiptDate(rawDate);
    const mode = (row[modeIdx >= 0 ? modeIdx : 1] || 'Cash').trim();
    const category = (row[catIdx >= 0 ? catIdx : 2] || 'Uncategorized').trim() || 'General';
    const subcategory = (row[subcatIdx >= 0 ? subcatIdx : 3] || '').trim();
    const note = (row[noteIdx >= 0 ? noteIdx : 4] || '').trim();
    
    const amountStr = (row[amountIdx >= 0 ? amountIdx : 5] || '0').replace(/[^0-9.-]/g, '');
    const amount = parseFloat(amountStr) || 0;

    let rawType = (row[typeIdx >= 0 ? typeIdx : 6] || '').trim();
    let type: TransactionType = 'Expense';
    if (/income/i.test(rawType)) type = 'Income';
    else if (/transfer-out/i.test(rawType)) type = 'Transfer-Out';
    else if (/transfer-in/i.test(rawType)) type = 'Transfer-In';
    else if (/expense/i.test(rawType)) type = 'Expense';

    const currency = (row[currencyIdx >= 0 ? currencyIdx : 7] || 'INR').trim() || 'INR';

    receipts.push({
      id: `rec-${i}`,
      date,
      rawDate,
      hasExactTime,
      timeOfDay,
      mode,
      category,
      subcategory,
      note,
      amount,
      type,
      currency,
    });
  }

  // Sort chronological order
  return receipts.sort((a, b) => a.date.getTime() - b.date.getTime());
}

export function parseAugmentedTransactionsCsv(csvText: string): Receipt[] {
  const rows = parseCsvRows(csvText);
  if (rows.length < 2) return [];

  const headers = rows[0].map((h) => h.trim().toLowerCase());
  const idIdx = headers.findIndex((h) => h === 'trans_id');
  const dateIdx = headers.findIndex((h) => h.includes('date') || h.includes('time'));
  const merchantIdx = headers.findIndex((h) => h === 'merchant');
  const catIdx = headers.findIndex((h) => h === 'category');
  const amtIdx = headers.findIndex((h) => h === 'amt' || h === 'amount');
  const firstIdx = headers.findIndex((h) => h === 'first');
  const lastIdx = headers.findIndex((h) => h === 'last');
  const cityIdx = headers.findIndex((h) => h === 'city');
  const stateIdx = headers.findIndex((h) => h === 'state');
  const jobIdx = headers.findIndex((h) => h === 'job');
  const fraudIdx = headers.findIndex((h) => h.includes('fraud'));
  const latIdx = headers.findIndex((h) => h.includes('lat'));
  const longIdx = headers.findIndex((h) => h.includes('long'));

  const receipts: Receipt[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.length < 5) continue;

    const rawDate = (row[dateIdx >= 0 ? dateIdx : 1] || '').trim();
    const { date, hasExactTime, timeOfDay } = parseReceiptDate(rawDate);

    const merchant = (row[merchantIdx >= 0 ? merchantIdx : 2] || '').trim();
    const category = (row[catIdx >= 0 ? catIdx : 3] || 'General').trim();
    const amountStr = (row[amtIdx >= 0 ? amtIdx : 4] || '0').replace(/[^0-9.-]/g, '');
    const amount = parseFloat(amountStr) || 0;

    const firstName = (row[firstIdx >= 0 ? firstIdx : 5] || '').trim();
    const lastName = (row[lastIdx >= 0 ? lastIdx : 6] || '').trim();
    const city = (row[cityIdx >= 0 ? cityIdx : 8] || '').trim();
    const state = (row[stateIdx >= 0 ? stateIdx : 9] || '').trim();
    const job = (row[jobIdx >= 0 ? jobIdx : 10] || '').trim();
    const isFraud = (row[fraudIdx >= 0 ? fraudIdx : 11] || '').trim() === '1';
    const merchLat = parseFloat(row[latIdx >= 0 ? latIdx : 12]) || undefined;
    const merchLong = parseFloat(row[longIdx >= 0 ? longIdx : 13]) || undefined;

    receipts.push({
      id: row[idIdx >= 0 ? idIdx : 0] || `aug-${i}`,
      date,
      rawDate,
      hasExactTime,
      timeOfDay,
      mode: 'Credit / Digital Card',
      category: category.replace(/_/g, ' '),
      subcategory: merchant,
      note: merchant ? `Transaction at ${merchant} (${city})` : 'Card Transaction',
      amount,
      type: 'Expense',
      currency: 'INR',
      merchant,
      city,
      state,
      job,
      isFraud,
      merchLat,
      merchLong,
      customerName: `${firstName} ${lastName}`.trim(),
    });
  }

  return receipts.sort((a, b) => a.date.getTime() - b.date.getTime());
}

/**
 * Universal loader: Loads requested dataset dynamically or from user upload
 */
export async function loadDataset(source: DatasetSource = 'primary'): Promise<LoadDatasetResult> {
  if (source === 'augmented') {
    try {
      const resp = await fetch('/data/Augmented_IndiaTransactMultiFacet2024.csv');
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const text = await resp.text();
      const receipts = parseAugmentedTransactionsCsv(text);
      return {
        receipts,
        source: 'augmented',
        filename: 'Augmented_IndiaTransactMultiFacet2024.csv',
        totalRecords: receipts.length,
      };
    } catch {
      // Fallback if needed
      return {
        receipts: parsePrimaryTransactionsCsv(rawDefaultCsv),
        source: 'primary',
        filename: 'Daily Household Transactions.csv',
        totalRecords: 2461,
      };
    }
  }

  // Primary dataset: fetch dynamically
  try {
    const resp = await fetch('/data/DailyHouseholdTransactions.csv');
    if (resp.ok) {
      const text = await resp.text();
      const receipts = parsePrimaryTransactionsCsv(text);
      if (receipts.length > 0) {
        return {
          receipts,
          source: 'primary',
          filename: 'Daily Household Transactions.csv',
          totalRecords: receipts.length,
        };
      }
    }
  } catch (err) {
    console.warn('Dynamic fetch fallback to bundled raw CSV:', err);
  }

  // Fallback to bundled raw string
  const receipts = parsePrimaryTransactionsCsv(rawDefaultCsv);
  return {
    receipts,
    source: 'primary',
    filename: 'Daily Household Transactions.csv',
    totalRecords: receipts.length,
  };
}
