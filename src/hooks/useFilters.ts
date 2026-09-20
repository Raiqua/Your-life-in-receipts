import { useState, useCallback, useMemo } from 'react';
import { ReceiptFilter, TransactionType } from '../types/receipt';

const initialFilters: ReceiptFilter = {
  search: '',
  categories: [],
  subcategories: [],
  modes: [],
  types: [],
  startDate: null,
  endDate: null,
  minAmount: null,
  maxAmount: null,
};

export function useFilters() {
  const [filters, setFilters] = useState<ReceiptFilter>(initialFilters);

  const setSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  }, []);

  const toggleCategory = useCallback((category: string) => {
    setFilters((prev) => {
      const exists = prev.categories.includes(category);
      return {
        ...prev,
        categories: exists
          ? prev.categories.filter((c) => c !== category)
          : [...prev.categories, category],
      };
    });
  }, []);

  const toggleSubcategory = useCallback((subcat: string) => {
    setFilters((prev) => {
      const exists = prev.subcategories.includes(subcat);
      return {
        ...prev,
        subcategories: exists
          ? prev.subcategories.filter((s) => s !== subcat)
          : [...prev.subcategories, subcat],
      };
    });
  }, []);

  const toggleMode = useCallback((mode: string) => {
    setFilters((prev) => {
      const exists = prev.modes.includes(mode);
      return {
        ...prev,
        modes: exists ? prev.modes.filter((m) => m !== mode) : [...prev.modes, mode],
      };
    });
  }, []);

  const toggleType = useCallback((type: TransactionType) => {
    setFilters((prev) => {
      const exists = prev.types.includes(type);
      return {
        ...prev,
        types: exists ? prev.types.filter((t) => t !== type) : [...prev.types, type],
      };
    });
  }, []);

  const setDateRange = useCallback((startDate: string | null, endDate: string | null) => {
    setFilters((prev) => ({ ...prev, startDate, endDate }));
  }, []);

  const setAmountRange = useCallback((minAmount: number | null, maxAmount: number | null) => {
    setFilters((prev) => ({ ...prev, minAmount, maxAmount }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search.trim()) count++;
    count += filters.categories.length;
    count += filters.subcategories.length;
    count += filters.modes.length;
    count += filters.types.length;
    if (filters.startDate || filters.endDate) count++;
    if (filters.minAmount !== null || filters.maxAmount !== null) count++;
    return count;
  }, [filters]);

  return {
    filters,
    setSearch,
    toggleCategory,
    toggleSubcategory,
    toggleMode,
    toggleType,
    setDateRange,
    setAmountRange,
    clearAllFilters,
    activeFilterCount,
  };
}
