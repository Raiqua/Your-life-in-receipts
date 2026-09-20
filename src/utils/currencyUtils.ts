export function formatCurrency(amount: number, currency: string = 'INR'): string {
  const isINR = !currency || currency.toUpperCase() === 'INR';
  const symbol = isINR ? '₹' : currency + ' ';
  
  const abs = Math.abs(amount);
  const formattedNumber = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: abs >= 100 ? 0 : 2,
    minimumFractionDigits: 0,
  }).format(abs);

  const sign = amount < 0 ? '-' : '';
  return `${sign}${symbol}${formattedNumber}`;
}

export function formatCompactCurrency(amount: number, currency: string = 'INR'): string {
  const symbol = (!currency || currency.toUpperCase() === 'INR') ? '₹' : '';
  const abs = Math.abs(amount);

  if (abs >= 10000000) {
    return `${symbol}${(amount / 10000000).toFixed(1)}Cr`;
  }
  if (abs >= 100000) {
    return `${symbol}${(amount / 100000).toFixed(1)}L`;
  }
  if (abs >= 1000) {
    return `${symbol}${(amount / 1000).toFixed(1)}k`;
  }
  return `${symbol}${amount.toFixed(0)}`;
}
