// Utility functions for formatting data

export function formatCurrency(amount: number, currency: string = 'Rp'): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace('IDR', currency);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('id-ID').format(value);
}

export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatDate(date: string | Date, format: 'short' | 'long' | 'medium' = 'medium'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  switch (format) {
    case 'short':
      return dateObj.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    case 'long':
      return dateObj.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    case 'medium':
    default:
      return dateObj.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
  }
}

export function getMonthName(month: number): string {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  return months[month - 1] || 'Unknown';
}

export function getMonthNames(): string[] {
  return [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
}

export function parseCurrency(value: string): number {
  // Remove currency symbols and convert to number
  return parseFloat(value.replace(/[^0-9.-]+/g, '')) || 0;
}

export function calculateBudgetUsage(allocated: number, spent: number): number {
  if (allocated === 0) return 0;
  return (spent / allocated) * 100;
}

export function getBudgetStatusColor(usage: number): string {
  if (usage <= 50) return 'text-green-600';
  if (usage <= 80) return 'text-yellow-600';
  if (usage <= 100) return 'text-orange-600';
  return 'text-red-600';
}

export function getBudgetStatusText(usage: number): string {
  if (usage <= 50) return 'Aman';
  if (usage <= 80) return 'Hati-hati';
  if (usage <= 100) return 'Hampir Habis';
  return 'Melebihi Budget';
}

export function getProgressBarColor(usage: number): string {
  if (usage <= 50) return 'bg-green-500';
  if (usage <= 80) return 'bg-yellow-500';
  if (usage <= 100) return 'bg-orange-500';
  return 'bg-red-500';
}

export function shortenText(text: string, maxLength: number = 20): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function getAssetTypeColor(type: 'liquid' | 'non-liquid'): string {
  return type === 'liquid' ? 'text-blue-600' : 'text-purple-600';
}

export function getAssetTypeIcon(category: string): string {
  const icons: Record<string, string> = {
    cash: '💰',
    stocks: '📈',
    crypto: '₿',
    gold: '🥇',
    property: '🏠',
    deposit: '🏦'
  };
  return icons[category] || '💼';
}

export function getCategoryTypeColor(type: 'needs' | 'wants' | 'savings'): string {
  const colors = {
    needs: 'text-blue-600',
    wants: 'text-pink-600',
    savings: 'text-green-600'
  };
  return colors[type];
}

export function getCategoryTypeLabel(type: 'needs' | 'wants' | 'savings'): string {
  const labels = {
    needs: 'Kebutuhan',
    wants: 'Keinginan',
    savings: 'Tabungan'
  };
  return labels[type];
}

export function calculateMonthsDifference(startDate: Date, endDate: Date): number {
  const yearDiff = endDate.getFullYear() - startDate.getFullYear();
  const monthDiff = endDate.getMonth() - startDate.getMonth();
  return yearDiff * 12 + monthDiff;
}

export function isCurrentMonth(month: number, year: number): boolean {
  const now = new Date();
  return month === now.getMonth() + 1 && year === now.getFullYear();
}

export function getFinancialYearProgress(): number {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const endOfYear = new Date(now.getFullYear(), 11, 31);

  const totalDays = (endOfYear.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24);
  const passedDays = (now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24);

  return (passedDays / totalDays) * 100;
}