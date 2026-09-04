/**
 * ALPHA × BIGO HOST INCOME CALCULATOR - STRING & NUMERIC FORMATTERS
 * Precision Formatters (Intl.NumberFormat) & Sanitization
 */

(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.AlphaBigo = root.AlphaBigo || {};
    root.AlphaBigo.formatters = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function formatComma(val) {
    if (isNaN(val) || val === null || val === undefined) return '0';
    return new Intl.NumberFormat('en-US').format(Math.round(val));
  }

  function sanitizeDigitsOnly(str) {
    if (!str) return '';
    return String(str).replace(/\D/g, '');
  }

  function sanitizeDecimal(str) {
    if (!str) return '';
    // Replace comma with dot for Indonesian numeric inputs
    let cleaned = String(str).replace(',', '.');
    // Allow digits and only one dot
    cleaned = cleaned.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      cleaned = parts[0] + '.' + parts.slice(1).join('');
    }
    return cleaned;
  }

  function formatDecimal(val, maxDecimals = 1) {
    if (isNaN(val) || val === null || val === undefined) return '0';
    const num = Number(val);
    if (Number.isInteger(num)) return num.toString();
    return num.toFixed(maxDecimals).replace(/\.?0+$/, '');
  }

  function formatCurrencyIDR(val) {
    return new Intl.NumberFormat('id-ID').format(Math.round(val));
  }

  function formatCurrencyUSD(val) {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(val);
  }

  return {
    formatComma,
    sanitizeDigitsOnly,
    sanitizeDecimal,
    formatDecimal,
    formatCurrencyIDR,
    formatCurrencyUSD
  };
});
