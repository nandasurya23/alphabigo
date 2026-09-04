// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import {
  sanitizeHtml,
  safeClampNumber,
  safeTruncateInput,
  MAX_SAFE_BEANS,
} from '@/utils/security';

describe('Frontend Security - XSS Defense (DOMPurify)', () => {
  it('neutralizes malicious <script> tags', () => {
    const malicious = 'Normal text <script>alert("hacked")</script>';
    const cleaned = sanitizeHtml(malicious);
    expect(cleaned).not.toContain('<script>');
    expect(cleaned).not.toContain('alert("hacked")');
    expect(cleaned).toBe('Normal text ');
  });

  it('neutralizes malicious <img onerror=...>', () => {
    const malicious = '<img src="invalid.jpg" onerror="alert(document.cookie)">';
    const cleaned = sanitizeHtml(malicious);
    expect(cleaned).not.toContain('onerror');
    expect(cleaned).not.toContain('alert');
  });

  it('neutralizes iframe and javascript: pseudo-protocols', () => {
    const malicious = '<iframe src="javascript:alert(1)"></iframe>';
    const cleaned = sanitizeHtml(malicious);
    expect(cleaned).not.toContain('iframe');
    expect(cleaned).not.toContain('javascript:');
  });

  it('preserves safe formatting tags (strong, b, span, em)', () => {
    const safe = 'Target berikutnya: Capai <strong>100,000 Beans</strong> untuk bonus <strong>90%</strong>!';
    const cleaned = sanitizeHtml(safe);
    expect(cleaned).toBe(safe);
  });
});

describe('Frontend Security - Numeric Boundaries & Overflow Protection', () => {
  it('prevents Number.MAX_SAFE_INTEGER overflow and clamps to MAX_SAFE_BEANS', () => {
    const overflow = 999_999_999_999_999_999;
    const clamped = safeClampNumber(overflow, 0, MAX_SAFE_BEANS);
    expect(clamped).toBe(MAX_SAFE_BEANS);
  });

  it('safely neutralizes NaN and Infinity', () => {
    expect(safeClampNumber(NaN, 0, 100)).toBe(0);
    expect(safeClampNumber(Infinity, 0, 100)).toBe(0);
    expect(safeClampNumber(-Infinity, 0, 100)).toBe(0);
    expect(safeClampNumber('not-a-number', 0, 100)).toBe(0);
  });

  it('clamps negative numbers to minimum boundary', () => {
    expect(safeClampNumber(-50, 0, 31)).toBe(0);
  });

  it('clamps numbers exceeding maximum boundary', () => {
    expect(safeClampNumber(50, 0, 31)).toBe(31);
    expect(safeClampNumber(200, 0, 155)).toBe(155);
  });
});

describe('Frontend Security - ReDoS & Payload Flooding Prevention', () => {
  it('truncates excessively long input payloads safely', () => {
    const hugePayload = 'a'.repeat(100_000);
    const truncated = safeTruncateInput(hugePayload, 20);
    expect(truncated.length).toBe(20);
  });

  it('handles null and undefined safely without throwing', () => {
    expect(safeTruncateInput(null)).toBe('');
    expect(safeTruncateInput(undefined)).toBe('');
  });
});
