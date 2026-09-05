import { describe, it, expect } from 'vitest';
import {
  formatComma,
  sanitizeDigitsOnly,
  sanitizeDecimal,
  formatDecimal,
  formatCurrencyIDR,
  formatCurrencyUSD,
} from '@/engine/formatters';

describe('Formatters & Sanitizers', () => {
  it('formatComma adds comma separators correctly', () => {
    expect(formatComma(130000)).toBe('130,000');
    expect(formatComma(0)).toBe('0');
    expect(formatComma(1500)).toBe('1,500');
    expect(formatComma(5000000)).toBe('5,000,000');
  });

  it('sanitizeDigitsOnly removes non-numeric characters', () => {
    expect(sanitizeDigitsOnly('130,000')).toBe('130000');
    expect(sanitizeDigitsOnly('abc123def456')).toBe('123456');
    expect(sanitizeDigitsOnly('-50')).toBe('50');
  });

  it('sanitizeDecimal handles Indonesian commas and dots', () => {
    expect(sanitizeDecimal('40,5')).toBe('40.5');
    expect(sanitizeDecimal('40.5.2')).toBe('40.52');
    expect(sanitizeDecimal('abc40.5')).toBe('40.5');
  });

  it('formatDecimal formats numbers with maximum decimals', () => {
    expect(formatDecimal(40)).toBe('40');
    expect(formatDecimal(40.5)).toBe('40.5');
    expect(formatDecimal(40.0)).toBe('40');
  });

  it('formatCurrencyIDR formats IDR currency correctly', () => {
    expect(formatCurrencyIDR(16723524)).toBe('16.723.524');
    expect(formatCurrencyIDR(0)).toBe('0');
  });

  it('formatCurrencyUSD formats USD without decimals', () => {
    expect(formatCurrencyUSD(939.5238)).toBe('939');
    expect(formatCurrencyUSD(380.95)).toBe('380');
    expect(formatCurrencyUSD(0)).toBe('0');
  });
});
