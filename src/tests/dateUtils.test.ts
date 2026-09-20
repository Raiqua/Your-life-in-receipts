import { describe, it, expect } from 'vitest';
import { parseReceiptDate, getTimeOfDayFromHour, formatFriendlyDate, formatShortDate } from '../utils/dateUtils';

describe('dateUtils', () => {
  it('parses DD/MM/YYYY HH:mm:ss format accurately with exact time', () => {
    const result = parseReceiptDate('20/09/2018 12:04:08');
    expect(result.hasExactTime).toBe(true);
    expect(result.timeOfDay).toBe('afternoon');
    expect(result.date.getFullYear()).toBe(2018);
    expect(result.date.getMonth()).toBe(8); // September is 8 (0-indexed)
    expect(result.date.getDate()).toBe(20);
  });

  it('parses DD/MM/YYYY without time accurately', () => {
    const result = parseReceiptDate('1/8/2018');
    expect(result.hasExactTime).toBe(false);
    expect(result.date.getFullYear()).toBe(2018);
    expect(result.date.getMonth()).toBe(7); // August is 7
    expect(result.date.getDate()).toBe(1);
  });

  it('classifies time of day correctly', () => {
    expect(getTimeOfDayFromHour(7)).toBe('morning');
    expect(getTimeOfDayFromHour(13)).toBe('afternoon');
    expect(getTimeOfDayFromHour(19)).toBe('evening');
    expect(getTimeOfDayFromHour(23)).toBe('night');
    expect(getTimeOfDayFromHour(2)).toBe('night');
  });

  it('formats dates consistently', () => {
    const date = new Date(2017, 4, 15, 14, 30);
    expect(formatShortDate(date)).toContain('2017');
    expect(formatFriendlyDate(date)).toContain('May');
  });
});
