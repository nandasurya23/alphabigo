/**
 * ALPHA × BIGO HOST INCOME CALCULATOR - POLICY CONSTANTS & TIERS
 * Official BIGO LIVE Indonesia Policy (Q2-April 2026)
 * Alpha Entertainment Agency (Single Source of Truth)
 */

(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.AlphaBigo = root.AlphaBigo || {};
    root.AlphaBigo.policies = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const POLICY_CONSTANTS = {
    EXCHANGE_RATE_BEANS_TO_USD: 210, // 210 Beans = 1 USD
    BEANS_PER_USD: 210,              // Direct alias to prevent any undefined lookups
    USD_TO_IDR_RATE: 17800,          // Rp 17.800 / USD
    NEW_HOST_BONUS_CAP: 360000,      // Max bonus for New Host (400K × 90%)
    MIN_VALID_DAYS: 15,              // Minimum valid days for full commission (A.3.d)
    MIN_VALID_HOURS: 40,             // Minimum valid hours for full commission (A.3.d)
    PRORATA_MIN_DAYS: 10,            // Min valid days for prorata (10-14 days, E.b)
    PRORATA_MIN_BEANS: 2001,         // Min beans for prorata (> 2.000 Beans, E.b)
    DAYS_MIN: 0,
    DAYS_MAX: 31,
    HOURS_MIN: 0,
    HOURS_MAX: 155
  };

  /**
   * New Host Percentage Tiers (Bulan 1–3) - Tabel A.1
   */
  const NEW_HOST_TIERS = [
    { minBeans: 100000, rate: 0.90, label: "90% (>= 100K Beans)" },
    { minBeans: 5000,   rate: 0.85, label: "85% (5K - 99.9K Beans)" },
    { minBeans: 2000,   rate: 0.50, label: "50% (2K - 4.9K Beans)" },
    { minBeans: 0,      rate: 0.00, label: "0% (< 2K Beans)" }
  ];

  /**
   * New Host Agency Bonus (IDR) - Tabel A.1
   */
  const NEW_HOST_AGENCY_BONUS = [
    { minBeans: 400000, bonusIdr: 7500000, label: "Rp 7.500.000 (400K Beans)" },
    { minBeans: 350000, bonusIdr: 6500000, label: "Rp 6.500.000 (350K Beans)" },
    { minBeans: 300000, bonusIdr: 5500000, label: "Rp 5.500.000 (300K Beans)" },
    { minBeans: 250000, bonusIdr: 4800000, label: "Rp 4.800.000 (250K Beans)" },
    { minBeans: 200000, bonusIdr: 3600000, label: "Rp 3.600.000 (200K Beans)" },
    { minBeans: 150000, bonusIdr: 2700000, label: "Rp 2.700.000 (150K Beans)" },
    { minBeans: 130000, bonusIdr: 2350000, label: "Rp 2.350.000 (130K Beans)" },
    { minBeans: 100000, bonusIdr: 1800000, label: "Rp 1.800.000 (100K Beans)" },
    { minBeans: 70000,  bonusIdr: 1000000, label: "Rp 1.000.000 (70K Beans)" },
    { minBeans: 50000,  bonusIdr: 750000,  label: "Rp 750.000 (50K Beans)" },
    { minBeans: 30000,  bonusIdr: 450000,  label: "Rp 450.000 (30K Beans)" },
    { minBeans: 20000,  bonusIdr: 300000,  label: "Rp 300.000 (20K Beans)" },
    { minBeans: 10000,  bonusIdr: 120000,  label: "Rp 120.000 (10K Beans)" },
    { minBeans: 0,      bonusIdr: 0,       label: "Rp 0 (< 10K Beans)" }
  ];

  /**
   * Premium Host Flat Tiers (2.000 s/d 100.000 Beans) - Tabel A.2
   */
  const PREMIUM_FLAT_TIERS = [
    { minBeans: 100000, flatBonus: 50000, agencyBonus: 1850000, label: "Flat 50,000 Beans (100K - 129.9K)" },
    { minBeans: 70000,  flatBonus: 35000, agencyBonus: 1300000, label: "Flat 35,000 Beans (70K - 99.9K)" },
    { minBeans: 50000,  flatBonus: 25000, agencyBonus: 930000,  label: "Flat 25,000 Beans (50K - 69.9K)" },
    { minBeans: 30000,  flatBonus: 17000, agencyBonus: 550000,  label: "Flat 17,000 Beans (30K - 49.9K)" },
    { minBeans: 20000,  flatBonus: 12000, agencyBonus: 370000,  label: "Flat 12,000 Beans (20K - 29.9K)" },
    { minBeans: 10000,  flatBonus: 7500,  agencyBonus: 135000,  label: "Flat 7,500 Beans (10K - 19.9K)" },
    { minBeans: 5000,   flatBonus: 3800,  agencyBonus: 0,       label: "Flat 3,800 Beans (5K - 9.9K)" },
    { minBeans: 2000,   flatBonus: 1000,  agencyBonus: 0,       label: "Flat 1,000 Beans (2K - 4.9K)" }
  ];

  /**
   * Premium Host Percentage Tiers (>= 130.000 Beans) - Tabel A.2
   */
  const PREMIUM_PERCENT_TIERS = [
    { minBeans: 5000000, rate: 0.75, agencyBonus: 93230000, label: "75% (>= 5,000,000 Beans)" },
    { minBeans: 4000000, rate: 0.72, agencyBonus: 74550000, label: "72% (4M - 4.99M Beans)" },
    { minBeans: 3500000, rate: 0.72, agencyBonus: 65250000, label: "72% (3.5M - 3.99M Beans)" },
    { minBeans: 2300000, rate: 0.68, agencyBonus: 42900000, label: "68% (2.3M - 3.49M Beans)" },
    { minBeans: 1200000, rate: 0.62, agencyBonus: 22350000, label: "62% (1.2M - 2.29M Beans)" },
    { minBeans: 900000,  rate: 0.59, agencyBonus: 16350000, label: "59% (900K - 1.19M Beans)" },
    { minBeans: 800000,  rate: 0.59, agencyBonus: 14500000, label: "59% (800K - 899.9K Beans)" },
    { minBeans: 700000,  rate: 0.57, agencyBonus: 12700000, label: "57% (700K - 799.9K Beans)" },
    { minBeans: 600000,  rate: 0.57, agencyBonus: 10900000, label: "57% (600K - 699.9K Beans)" },
    { minBeans: 500000,  rate: 0.55, agencyBonus: 8850000,  label: "55% (500K - 599.9K Beans)" },
    { minBeans: 450000,  rate: 0.55, agencyBonus: 7850000,  label: "55% (450K - 499.9K Beans)" },
    { minBeans: 400000,  rate: 0.55, agencyBonus: 7080000,  label: "55% (400K - 449.9K Beans)" },
    { minBeans: 350000,  rate: 0.53, agencyBonus: 6150000,  label: "53% (350K - 399.9K Beans)" },
    { minBeans: 300000,  rate: 0.53, agencyBonus: 5300000,  label: "53% (300K - 349.9K Beans)" },
    { minBeans: 250000,  rate: 0.53, agencyBonus: 4350000,  label: "53% (250K - 299.9K Beans)" },
    { minBeans: 200000,  rate: 0.51, agencyBonus: 3450000,  label: "51% (200K - 249.9K Beans)" },
    { minBeans: 150000,  rate: 0.51, agencyBonus: 2550000,  label: "51% (150K - 199.9K Beans)" },
    { minBeans: 130000,  rate: 0.51, agencyBonus: 2200000,  label: "51% (130K - 149.9K Beans)" }
  ];

  /**
   * Extra Bonus Agency (3 Bulan Pertama - New Host) - Tabel B.1
   */
  const NEW_HOST_EXTRA_AGENCY_BONUS = [
    { minBeans: 350000, maxBeans: 399999, extraBonusIdr: 3700000, label: "Extra Rp 3.700.000 (350K–399.9K Beans)" },
    { minBeans: 300000, maxBeans: 349999, extraBonusIdr: 3300000, label: "Extra Rp 3.300.000 (300K–349.9K Beans)" },
    { minBeans: 250000, maxBeans: 299999, extraBonusIdr: 3000000, label: "Extra Rp 3.000.000 (250K–299.9K Beans)" }
  ];

  /**
   * Extra Bonus Agency (Bulan ke-4 dst - Premium Host) - Tabel B.2
   */
  const PREMIUM_EXTRA_AGENCY_BONUS = [
    { minBeans: 1000000, maxBeans: 1199999, extraBonusIdr: 18000000, level: "S+", label: "Level S+: Extra Rp 18.000.000 (1M–1.19M Beans)" },
    { minBeans: 800000,  maxBeans: 999999,  extraBonusIdr: 16000000, level: "S+", label: "Level S+: Extra Rp 16.000.000 (800K–999.9K Beans)" },
    { minBeans: 350000,  maxBeans: 399999,  extraBonusIdr: 9000000,  level: "S",  label: "Level S: Extra Rp 9.000.000 (350K–399.9K Beans)" },
    { minBeans: 300000,  maxBeans: 349999,  extraBonusIdr: 8000000,  level: "S",  label: "Level S: Extra Rp 8.000.000 (300K–349.9K Beans)" },
    { minBeans: 250000,  maxBeans: 299999,  extraBonusIdr: 7000000,  level: "S",  label: "Level S: Extra Rp 7.000.000 (250K–299.9K Beans)" }
  ];

  return {
    POLICY_CONSTANTS,
    NEW_HOST_TIERS,
    NEW_HOST_AGENCY_BONUS,
    PREMIUM_FLAT_TIERS,
    PREMIUM_PERCENT_TIERS,
    NEW_HOST_EXTRA_AGENCY_BONUS,
    PREMIUM_EXTRA_AGENCY_BONUS
  };
});
