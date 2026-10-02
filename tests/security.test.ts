// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import {
  sanitizeHtml,
  safeClampNumber,
  safeTruncateInput,
  MAX_SAFE_BEANS,
  deepFreeze,
  generateIntegrityStamp,
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

describe('Frontend Security - DevTools Runtime Anti-Tamper & Deep Freeze', () => {
  it('deepFreeze prevents modifying nested properties', () => {
    const testConfig = {
      rate: 17800,
      tiers: [{ min: 100, bonus: 50 }],
    };
    const frozen = deepFreeze(testConfig);

    expect(Object.isFrozen(frozen)).toBe(true);
    expect(Object.isFrozen(frozen.tiers)).toBe(true);
    expect(Object.isFrozen(frozen.tiers[0])).toBe(true);

    // Attempting to mutate in strict mode throws TypeError
    expect(() => {
      (frozen as Record<string, unknown>).rate = 99999;
    }).toThrow(TypeError);

    expect(() => {
      (frozen.tiers[0] as Record<string, unknown>).bonus = 99999;
    }).toThrow(TypeError);
  });

  it('POLICY_CONSTANTS and tier tables are deeply frozen and immutable', () => {
    import('@/constants/policy-constants').then(({ POLICY_CONSTANTS, NEW_HOST_TIERS, PREMIUM_PERCENT_TIERS }) => {
      expect(Object.isFrozen(POLICY_CONSTANTS)).toBe(true);
      expect(Object.isFrozen(NEW_HOST_TIERS)).toBe(true);
      expect(Object.isFrozen(PREMIUM_PERCENT_TIERS)).toBe(true);

      expect(() => {
        (POLICY_CONSTANTS as unknown as Record<string, unknown>).USD_TO_IDR_RATE = 99999;
      }).toThrow(TypeError);
    });
  });

  it('generateIntegrityStamp creates deterministic tamper-evident verification codes', () => {
    const stamp1 = generateIntegrityStamp('premium', 1000000, 30, 110, 1620000, 137314286);
    const stamp2 = generateIntegrityStamp('premium', 1000000, 30, 110, 1620000, 137314286);

    // Deterministic: same inputs produce exact same stamp
    expect(stamp1).toBe(stamp2);
    expect(stamp1).toMatch(/^ALPHA-[0-9A-F]{4}-[0-9A-F]{4}$/);

    // Any tampering with numbers creates a completely different stamp
    const tamperedStamp = generateIntegrityStamp('premium', 1000000, 30, 110, 9999999, 500000000);
    expect(tamperedStamp).not.toBe(stamp1);

    // Zero/uncalculated input returns empty string
    expect(generateIntegrityStamp('', 0, 0, 0, 0, 0)).toBe('');
  });
});

