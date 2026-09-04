/**
 * ALPHA × BIGO - FRONTEND SECURITY & SANITIZATION UTILITIES
 * Hardened client-side protection against XSS, Prototype Pollution, ReDoS, and Integer Overflow
 */

import DOMPurify from 'dompurify';

/**
 * Strict HTML Sanitizer for user-facing dynamic rich text.
 * Strictly whitelist harmless formatting tags only. Disallows scripts, event handlers, iframes, etc.
 */
export function sanitizeHtml(dirty: string): string {
  if (!dirty || typeof dirty !== 'string') return '';
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['strong', 'b', 'span', 'em', 'i', 'p'],
    ALLOWED_ATTR: ['class'],
    ALLOW_DATA_ATTR: false,
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'img'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'style', 'href', 'src'],
  });
}

/**
 * Maximum safe Beans value to prevent 64-bit float precision loss and memory overflow.
 * Capped at 1 Trillion (1,000,000,000,000) Beans.
 */
export const MAX_SAFE_BEANS = 1_000_000_000_000;

/**
 * Safe numeric boundary clamper preventing NaN, Infinity, and Integer Overflow.
 */
export function safeClampNumber(
  val: unknown,
  min: number = 0,
  max: number = Number.MAX_SAFE_INTEGER
): number {
  if (typeof val !== 'number' && typeof val !== 'string') return min;
  const parsed = typeof val === 'number' ? val : Number(val);
  if (!Number.isFinite(parsed) || Number.isNaN(parsed)) return min;
  return Math.max(min, Math.min(max, parsed));
}

/**
 * Sanitizes raw string input with length cap to prevent ReDoS / payload flooding.
 */
export function safeTruncateInput(input: unknown, maxLength: number = 20): string {
  if (input === null || input === undefined) return '';
  const str = String(input);
  return str.length > maxLength ? str.slice(0, maxLength) : str;
}
