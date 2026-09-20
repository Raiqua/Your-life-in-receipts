import { Receipt, ReceiptFilter } from '../types/receipt';

export function filterReceipts(receipts: Receipt[], filters: ReceiptFilter): Receipt[] {
  const searchLower = filters.search.trim().toLowerCase();

  return receipts.filter((r) => {
    // 1. Global Search
    if (searchLower) {
      const matchSearch =
        r.category.toLowerCase().includes(searchLower) ||
        r.subcategory.toLowerCase().includes(searchLower) ||
        r.note.toLowerCase().includes(searchLower) ||
        r.mode.toLowerCase().includes(searchLower) ||
        r.currency.toLowerCase().includes(searchLower) ||
        (r.merchant && r.merchant.toLowerCase().includes(searchLower)) ||
        (r.city && r.city.toLowerCase().includes(searchLower)) ||
        r.rawDate.toLowerCase().includes(searchLower);

      if (!matchSearch) return false;
    }

    // 2. Categories
    if (filters.categories.length > 0) {
      if (!filters.categories.includes(r.category)) return false;
    }

    // 3. Subcategories
    if (filters.subcategories.length > 0) {
      if (!filters.subcategories.includes(r.subcategory)) return false;
    }

    // 4. Payment Modes
    if (filters.modes.length > 0) {
      if (!filters.modes.includes(r.mode)) return false;
    }

    // 5. Types (Expense / Income / etc)
    if (filters.types.length > 0) {
      if (!filters.types.includes(r.type)) return false;
    }

    // 6. Amount Range
    if (filters.minAmount !== null && r.amount < filters.minAmount) return false;
    if (filters.maxAmount !== null && r.amount > filters.maxAmount) return false;

    // 7. Date Range
    if (filters.startDate) {
      const start = new Date(filters.startDate);
      if (r.date < start) return false;
    }
    if (filters.endDate) {
      const end = new Date(filters.endDate);
      // include the entire end day
      end.setHours(23, 59, 59, 999);
      if (r.date > end) return false;
    }

    return true;
  });
}
