import { TimeOfDay } from '../types/receipt';

export function parseReceiptDate(dateStr: string): {
  date: Date;
  hasExactTime: boolean;
  timeOfDay: TimeOfDay;
} {
  if (!dateStr || typeof dateStr !== 'string') {
    const now = new Date();
    return { date: now, hasExactTime: false, timeOfDay: 'morning' };
  }

  const trimmed = dateStr.trim();
  let hasExactTime = false;
  let hour = 12;

  // Case 1: ISO or standard YYYY-MM-DD (often in augmented dataset: "2024-03-15 14:30:00")
  if (trimmed.includes('-')) {
    const parts = trimmed.split(' ');
    const ymd = parts[0].split('-');
    if (ymd.length === 3) {
      const year = parseInt(ymd[0], 10);
      const month = parseInt(ymd[1], 10) - 1;
      const day = parseInt(ymd[2], 10);
      
      let minutes = 0;
      let seconds = 0;
      if (parts[1]) {
        const hms = parts[1].split(':');
        hour = parseInt(hms[0], 10) || 0;
        minutes = parseInt(hms[1], 10) || 0;
        seconds = parseInt(hms[2], 10) || 0;
        hasExactTime = true;
      }
      const d = new Date(year, month, day, hour, minutes, seconds);
      return {
        date: isNaN(d.getTime()) ? new Date() : d,
        hasExactTime,
        timeOfDay: getTimeOfDayFromHour(hour),
      };
    }
  }

  // Case 2: DD/MM/YYYY or DD/MM/YYYY HH:mm:ss (primary dataset format)
  if (trimmed.includes('/')) {
    const parts = trimmed.split(' ');
    const dmy = parts[0].split('/');
    if (dmy.length === 3) {
      const day = parseInt(dmy[0], 10);
      const month = parseInt(dmy[1], 10) - 1;
      const year = parseInt(dmy[2], 10);

      let minutes = 0;
      let seconds = 0;
      if (parts[1]) {
        const hms = parts[1].split(':');
        hour = parseInt(hms[0], 10) || 0;
        minutes = parseInt(hms[1], 10) || 0;
        seconds = parseInt(hms[2], 10) || 0;
        hasExactTime = true;
      }
      const d = new Date(year, month, day, hour, minutes, seconds);
      return {
        date: isNaN(d.getTime()) ? new Date() : d,
        hasExactTime,
        timeOfDay: getTimeOfDayFromHour(hour),
      };
    }
  }

  const fallback = new Date(trimmed);
  return {
    date: isNaN(fallback.getTime()) ? new Date() : fallback,
    hasExactTime: false,
    timeOfDay: 'morning',
  };
}

export function getTimeOfDayFromHour(hour: number): TimeOfDay {
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 22) return 'evening';
  return 'night';
}

export function formatFriendlyDate(date: Date, includeTime = false): string {
  if (!date || isNaN(date.getTime())) return 'Unknown Date';
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  return new Intl.DateTimeFormat('en-IN', options).format(date);
}

export function formatShortDate(date: Date): string {
  if (!date || isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function formatMonthYear(date: Date): string {
  if (!date || isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('en-IN', {
    month: 'short',
    year: 'numeric',
  }).format(date);
}
