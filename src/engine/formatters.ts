/**
 * ALPHA × BIGO HOST INCOME CALCULATOR - STRING & NUMERIC FORMATTERS
 * High-performance formatters with cached Intl instances & strict sanitization
 */

import { safeTruncateInput } from '@/utils/security';

// Module-level cached formatters to eliminate repeated initialization allocations
const COMMA_FORMATTER = new Intl.NumberFormat('en-US');
const IDR_FORMATTER = new Intl.NumberFormat('id-ID');

export function formatComma(val: number): string {
  if (typeof val !== 'number' || !Number.isFinite(val)) return '0';
  return COMMA_FORMATTER.format(Math.round(val));
}

export function sanitizeDigitsOnly(str: unknown, maxLen: number = 15): string {
  if (str === null || str === undefined) return '';
  const truncated = safeTruncateInput(str, maxLen);
  return truncated.replace(/\D/g, '');
}

export function sanitizeDecimal(str: unknown, maxLen: number = 8): string {
  if (str === null || str === undefined) return '';
  const truncated = safeTruncateInput(str, maxLen);
  // Replace comma with dot for Indonesian numeric inputs
  let cleaned = truncated.replace(',', '.');
  // Allow digits and only one dot
  cleaned = cleaned.replace(/[^0-9.]/g, '');
  const parts = cleaned.split('.');
  if (parts.length > 2) {
    cleaned = parts[0] + '.' + parts.slice(1).join('');
  }
  return cleaned;
}

export function formatDecimal(val: number, maxDecimals: number = 1): string {
  if (typeof val !== 'number' || !Number.isFinite(val)) return '0';
  if (Number.isInteger(val)) return val.toString();
  return val.toFixed(maxDecimals).replace(/\.?0+$/, '');
}

export function formatCurrencyIDR(val: number): string {
  if (typeof val !== 'number' || !Number.isFinite(val)) return '0';
  return IDR_FORMATTER.format(Math.round(val));
}

export function formatCurrencyUSD(val: number): string {
  if (typeof val !== 'number' || !Number.isFinite(val) || val <= 0) return '0';
  return COMMA_FORMATTER.format(Math.floor(val));
}
