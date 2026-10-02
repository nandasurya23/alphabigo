/**
 * ALPHA × BIGO HOST INCOME CALCULATOR - POLICY CONSTANTS & TIERS
 * Official BIGO LIVE Indonesia Policy (Q2-April 2026)
 * Alpha Entertainment Agency (Single Source of Truth)
 */
import {
  PolicyConstants,
  OfficialHostTierPolicy,
  NewHostExtraBonusPolicy,
  DurationBonusTierPolicy,
  AgencyBonusPolicy,
  ExtraAgencyBonusPolicy,
} from '@/types/policy';
import { deepFreeze } from '@/utils/security';

export const POLICY_CONSTANTS: PolicyConstants = deepFreeze({
  EXCHANGE_RATE_BEANS_TO_USD: 210, // 210 Beans = 1 USD
  BEANS_PER_USD: 210,              // Direct alias
  USD_TO_IDR_RATE: 17800,          // Rp 17.800 / USD
  MIN_VALID_DAYS: 15,              // Minimum valid days for full commission (A.2.a)
  MIN_VALID_HOURS: 40,             // Minimum valid hours for full commission (A.2.a)
  PRORATA_MIN_DAYS: 10,            // Min valid days for prorata (10-14 days, F.b)
  PRORATA_MIN_BEANS: 2001,         // Min beans for prorata (> 2.000 Beans, F.b)
  DAYS_MIN: 0,
  DAYS_MAX: 31,
  HOURS_MIN: 0,
  HOURS_MAX: 155,
});

/**
 * Mendapatkan informasi bulan berjalan secara otomatis dan akurat
 * termasuk penanganan tahun kabisat via kalender native JS.
 */
export function getCurrentMonthInfo(date: Date = new Date()) {
  const year = date.getFullYear();
  const monthIndex = date.getMonth(); // 0 - 11
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const MONTH_NAMES = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];
  return {
    monthIndex,
    monthName: MONTH_NAMES[monthIndex],
    year,
    daysInMonth,
  };
}

/**
 * Tabel A. OFFICIAL HOST POLICY (Efektif: Oktober 2026)
 * Persentase Bonus Host (%) SAMA untuk New Host dan Old Host (24 Tier)
 */
export const OFFICIAL_HOST_TIERS: readonly OfficialHostTierPolicy[] = deepFreeze([
  { minBeans: 9000000, rate: 0.76,  label: "76% (≥ 9,000,000 Beans)" },
  { minBeans: 7000000, rate: 0.755, label: "75.5% (7M – 8.99M Beans)" },
  { minBeans: 5000000, rate: 0.75,  label: "75% (5M – 6.99M Beans)" },
  { minBeans: 4500000, rate: 0.74,  label: "74% (4.5M – 4.99M Beans)" },
  { minBeans: 4000000, rate: 0.73,  label: "73% (4M – 4.49M Beans)" },
  { minBeans: 3500000, rate: 0.72,  label: "72% (3.5M – 3.99M Beans)" },
  { minBeans: 2900000, rate: 0.69,  label: "69% (2.9M – 3.49M Beans)" },
  { minBeans: 2300000, rate: 0.68,  label: "68% (2.3M – 2.89M Beans)" },
  { minBeans: 1800000, rate: 0.65,  label: "65% (1.8M – 2.29M Beans)" },
  { minBeans: 1200000, rate: 0.62,  label: "62% (1.2M – 1.79M Beans)" },
  { minBeans: 1000000, rate: 0.61,  label: "61% (1M – 1.19M Beans)" },
  { minBeans: 850000,  rate: 0.59,  label: "59% (850K – 999.9K Beans)" },
  { minBeans: 600000,  rate: 0.57,  label: "57% (600K – 849.9K Beans)" },
  { minBeans: 400000,  rate: 0.55,  label: "55% (400K – 599.9K Beans)" },
  { minBeans: 300000,  rate: 0.54,  label: "54% (300K – 399.9K Beans)" },
  { minBeans: 200000,  rate: 0.52,  label: "52% (200K – 299.9K Beans)" },
  { minBeans: 100000,  rate: 0.505, label: "50.5% (100K – 199.9K Beans)" },
  { minBeans: 70000,   rate: 0.50,  label: "50% (70K – 99.9K Beans)" },
  { minBeans: 50000,   rate: 0.48,  label: "48% (50K – 69.9K Beans)" },
  { minBeans: 30000,   rate: 0.475, label: "47.5% (30K – 49.9K Beans)" },
  { minBeans: 20000,   rate: 0.47,  label: "47% (20K – 29.9K Beans)" },
  { minBeans: 10000,   rate: 0.465, label: "46.5% (10K – 19.9K Beans)" },
  { minBeans: 5000,    rate: 0.46,  label: "46% (5K – 9.9K Beans)" },
  { minBeans: 2000,    rate: 0.45,  label: "45% (2K – 4.9K Beans)" },
]);

// Backward compatibility aliases
export const NEW_HOST_TIERS = OFFICIAL_HOST_TIERS;
export const PREMIUM_PERCENT_TIERS = OFFICIAL_HOST_TIERS;
export const PREMIUM_FLAT_TIERS = deepFreeze([]);

/**
 * Tabel A. EXTRA BONUS NEW HOST BIGO (BEANS)
 * Khusus New Host (Bulan 1–3)
 */

export const NEW_HOST_EXTRA_BONUS_TIERS: readonly NewHostExtraBonusPolicy[] = deepFreeze([
  { minBeans: 400000, maxBeans: 599999, bonusBeans: 120000, bonusIdrEstimate: 10171429, label: "Extra +120,000 Beans (400K–599.9K)" },
  { minBeans: 300000, maxBeans: 399999, bonusBeans: 95000,  bonusIdrEstimate: 8052381,  label: "Extra +95,000 Beans (300K–399.9K)" },
  { minBeans: 200000, maxBeans: 299999, bonusBeans: 65000,  bonusIdrEstimate: 5509524,  label: "Extra +65,000 Beans (200K–299.9K)" },
  { minBeans: 100000, maxBeans: 199999, bonusBeans: 32000,  bonusIdrEstimate: 2711429,  label: "Extra +32,000 Beans (100K–199.9K)" },
  { minBeans: 70000,  maxBeans: 99999,  bonusBeans: 20000,  bonusIdrEstimate: 1695238,  label: "Extra +20,000 Beans (70K–99.9K)" },
  { minBeans: 50000,  maxBeans: 69999,  bonusBeans: 15000,  bonusIdrEstimate: 1271429,  label: "Extra +15,000 Beans (50K–69.9K)" },
  { minBeans: 30000,  maxBeans: 49999,  bonusBeans: 8500,   bonusIdrEstimate: 720952,   label: "Extra +8,500 Beans (30K–49.9K)" },
  { minBeans: 20000,  maxBeans: 29999,  bonusBeans: 5200,   bonusIdrEstimate: 440762,   label: "Extra +5,200 Beans (20K–29.9K)" },
  { minBeans: 10000,  maxBeans: 19999,  bonusBeans: 2500,   bonusIdrEstimate: 211905,   label: "Extra +2,500 Beans (10K–19.9K)" },
  { minBeans: 5000,   maxBeans: 9999,   bonusBeans: 1000,   bonusIdrEstimate: 84762,    label: "Extra +1,000 Beans (5K–9.9K)" },
]);

/**
 * Tabel C. DURATION BONUS (Efektif: Oktober 2026)
 * Syarat Durasi:
 * - Kolom 1: 20 Hari & 70 Jam
 * - Kolom 2: 25 Hari & 90 Jam
 * - Kolom 3: Full Month (30/31 Hari) & 110 Jam
 */
export const DURATION_BONUS_TIERS: readonly DurationBonusTierPolicy[] = deepFreeze([
  {
    minBeans: 200000,
    tierName: "Tier ≥200K",
    label: "≥ 200,000 Beans",
    bonus20d70h: 2700,
    bonus25d90h: 4500,
    bonusFullMonth110h: 30000,
  },
  {
    minBeans: 70000,
    maxBeans: 199999,
    tierName: "Tier 70K–199.9K",
    label: "70,000 – 199,999 Beans",
    bonus20d70h: 2500,
    bonus25d90h: 3800,
    bonusFullMonth110h: 20000,
  },
  {
    minBeans: 30000,
    maxBeans: 69999,
    tierName: "Tier 30K–69.9K",
    label: "30,000 – 69,999 Beans",
    bonus20d70h: 2300,
    bonus25d90h: 3400,
    bonusFullMonth110h: 15000,
  },
  {
    minBeans: 10000,
    maxBeans: 29999,
    tierName: "Tier 10K–29.9K",
    label: "10,000 – 29,999 Beans",
    bonus20d70h: 2100,
    bonus25d90h: 3100,
    bonusFullMonth110h: 7500,
  },
  {
    minBeans: 5000,
    maxBeans: 9999,
    tierName: "Tier 5K–9.9K",
    label: "5,000 – 9,999 Beans",
    bonus20d70h: 1300,
    bonus25d90h: 1700,
    bonusFullMonth110h: 2100,
  },
  {
    minBeans: 2000,
    maxBeans: 4999,
    tierName: "Tier 1 (New Host)",
    label: "2,000 – 4,999 Beans (Khusus New Host)",
    bonus20d70h: 200,
    bonus25d90h: 500,
    bonusFullMonth110h: 800,
  },
]);

export const NEW_HOST_DURATION_TIER: DurationBonusTierPolicy = deepFreeze({
  minBeans: 2000,
  maxBeans: 4999,
  tierName: "Tier 1 (Khusus New Host)",
  label: "Duration Bonus New Host",
  bonus20d70h: 200,
  bonus25d90h: 500,
  bonusFullMonth110h: 800,
});

/**
 * Agency Bonuses (Tetap dipertahankan untuk referensi agency jika dibutuhkan)
 */
export const NEW_HOST_AGENCY_BONUS: readonly AgencyBonusPolicy[] = deepFreeze([
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
  { minBeans: 0,      bonusIdr: 0,       label: "Rp 0 (< 10K Beans)" },
]);

export const NEW_HOST_EXTRA_AGENCY_BONUS: readonly ExtraAgencyBonusPolicy[] = deepFreeze([
  { minBeans: 350000, maxBeans: 399999, extraBonusIdr: 3700000, label: "Extra Rp 3.700.000 (350K–399.9K Beans)" },
  { minBeans: 300000, maxBeans: 349999, extraBonusIdr: 3300000, label: "Extra Rp 3.300.000 (300K–349.9K Beans)" },
  { minBeans: 250000, maxBeans: 299999, extraBonusIdr: 3000000, label: "Extra Rp 3.000.000 (250K–299.9K Beans)" },
]);

export const PREMIUM_EXTRA_AGENCY_BONUS: readonly ExtraAgencyBonusPolicy[] = deepFreeze([
  { minBeans: 1000000, maxBeans: 1199999, extraBonusIdr: 18000000, level: "S+", label: "Level S+: Extra Rp 18.000.000 (1M–1.19M Beans)" },
  { minBeans: 800000,  maxBeans: 999999,  extraBonusIdr: 16000000, level: "S+", label: "Level S+: Extra Rp 16.000.000 (800K–999.9K Beans)" },
  { minBeans: 350000,  maxBeans: 399999,  extraBonusIdr: 9000000,  level: "S",  label: "Level S: Extra Rp 9.000.000 (350K–399.9K Beans)" },
  { minBeans: 300000,  maxBeans: 349999,  extraBonusIdr: 8000000,  level: "S",  label: "Level S: Extra Rp 8.000.000 (300K–349.9K Beans)" },
  { minBeans: 250000,  maxBeans: 299999,  extraBonusIdr: 7000000,  level: "S",  label: "Level S: Extra Rp 7.000.000 (250K–299.9K Beans)" },
]);

