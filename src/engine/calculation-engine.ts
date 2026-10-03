/**
 * ALPHA × BIGO HOST INCOME CALCULATOR - PURE CALCULATION ENGINE
 * Functional Core: Deterministic mathematical computations matching Official Policy October 2026
 */

import {
  HostStatus,
  HostBonusResult,
  DurationBonusResult,
  CalculationResult,
  NewHostMonth,
} from '@/types/calculator';
import {
  POLICY_CONSTANTS,
  OFFICIAL_HOST_TIERS,
  NEW_HOST_EXTRA_BONUS_TIERS,
  DURATION_BONUS_TIERS,
} from '@/constants/policy-constants';
import { formatComma, formatCurrencyIDR } from '@/engine/formatters';

export interface NewHostExtraBonusResult {
  readonly bonus: number;
  readonly ruleText: string;
  readonly qualified: boolean;
}

/**
 * Menghitung Bonus Host Beans (Tabel A) berdasarkan status, pencapaian beans, dan durasi siaran.
 * - Persentase SAMA untuk New Host dan Old Host (45% s/d 76%).
 * - New Host bebas target hari/jam siaran untuk Tabel A (cair 100%).
 * - Old Host wajib min. 15 hari & 40 jam siaran (dengan skema prorata 10–14 hari).
 */
export function calculateHostBonus(
  status: HostStatus,
  beans: number,
  days: number = 15,
  hours: number = 40,
  newHostMonth: NewHostMonth = 1
): HostBonusResult {
  const safeBeans = Math.max(0, Number(beans) || 0);
  const safeDays = Math.max(0, Math.min(POLICY_CONSTANTS.DAYS_MAX, Number(days) || 0));
  const safeHours = Math.max(0, Math.min(POLICY_CONSTANTS.HOURS_MAX, Number(hours) || 0));

  if (safeBeans < 2000) {
    return {
      bonus: 0,
      ruleText: 'Belum mencapai syarat minimum 2,000 Beans',
      tierName: '< 2,000 Beans',
      isProrata: false,
      qualified: false,
    };
  }

  // Cari persentase tier dari Tabel A (SAMA untuk New Host & Old Host)
  const matchedTier =
    OFFICIAL_HOST_TIERS.find((t) => safeBeans >= t.minBeans) ||
    OFFICIAL_HOST_TIERS[OFFICIAL_HOST_TIERS.length - 1];

  const baseBonus = Math.round(safeBeans * matchedTier.rate);
  const percentage = Math.round(matchedTier.rate * 100);
  const baseRuleText = `${formatCurrencyIDR(safeBeans)} Beans x ${percentage}% = ${formatCurrencyIDR(baseBonus)} Beans`;
  const tierName = matchedTier.label;

  // 1. New Host Bulan 1: Bebas syarat durasi maupun hari siaran di Tabel A (A.1.d & A.2.b)
  if (status === 'new' && newHostMonth === 1) {
    return {
      bonus: baseBonus,
      ruleText: baseRuleText,
      tierName: `New Host (Bulan 1): ${tierName}`,
      isProrata: false,
      qualified: true,
    };
  }

  // 2. New Host Bulan 2-3 ATAU Old Host (Bulan 4+):
  // Wajib memenuhi 15 Hari & 40 Jam untuk komisi penuh 100% (A.1.c, A.1.d, & A.2.a)
  const hostLabel = status === 'new' ? 'New Host (Bulan 2-3)' : 'Old Host';

  if (safeDays >= POLICY_CONSTANTS.MIN_VALID_DAYS && safeHours >= POLICY_CONSTANTS.MIN_VALID_HOURS) {
    return {
      bonus: baseBonus,
      ruleText: baseRuleText,
      tierName: `${hostLabel}: ${tierName}`,
      isProrata: false,
      qualified: true,
    };
  }

  // Komisi Prorata (F.a & F.b) - Syarat: 10–14 Hari, ≥40 Jam, dan ≥2.001 Beans
  if (
    safeDays >= POLICY_CONSTANTS.PRORATA_MIN_DAYS &&
    safeDays <= 14 &&
    safeHours >= POLICY_CONSTANTS.MIN_VALID_HOURS &&
    safeBeans >= POLICY_CONSTANTS.PRORATA_MIN_BEANS
  ) {
    const prorataBonus = Math.round((safeDays / 15) * baseBonus);
    return {
      bonus: prorataBonus,
      ruleText: `Prorata (${safeDays}/15 Hari): ${formatCurrencyIDR(safeBeans)} Beans x ${percentage}% = ${formatCurrencyIDR(prorataBonus)} Beans`,
      tierName: `${hostLabel}: ${tierName} (Prorata)`,
      isProrata: true,
      qualified: true,
    };
  }

  // Belum Memenuhi Syarat Kualifikasi (Hari < 10 atau Jam < 40)
  if (safeHours === 0 && safeDays === 0) {
    return {
      bonus: 0,
      ruleText: 'Menunggu pengisian hari & jam siaran (Syarat: 15 Hari & 40 Jam)',
      tierName: `${hostLabel}: ${tierName} (Menunggu Durasi)`,
      isProrata: false,
      qualified: false,
    };
  }

  let reason = 'Belum memenuhi syarat (Min. 15 hari & 40 jam)';
  if (safeHours < POLICY_CONSTANTS.MIN_VALID_HOURS) {
    reason = `Durasi siaran kurang dari 40 Jam (${safeHours} Jam)`;
  } else if (safeDays < POLICY_CONSTANTS.PRORATA_MIN_DAYS) {
    reason = `Hari siaran kurang dari 10 Hari (${safeDays} Hari)`;
  }

  return {
    bonus: 0,
    ruleText: reason,
    tierName: `${hostLabel}: ${tierName} (Belum Memenuhi Syarat)`,
    isProrata: false,
    qualified: false,
  };
}

/**
 * Menghitung Extra Bonus New Host BIGO (Beans)
 * Khusus New Host (Bulan 1–3)
 */

export function calculateNewHostExtraBonus(
  status: HostStatus,
  beans: number
): NewHostExtraBonusResult {
  if (status !== 'new') {
    return { bonus: 0, ruleText: 'Khusus New Host', qualified: false };
  }

  const safeBeans = Math.max(0, Number(beans) || 0);

  if (safeBeans < 5000) {
    return { bonus: 0, ruleText: 'Belum mencapai syarat minimum 5,000 Beans', qualified: false };
  }

  if (safeBeans >= 600000) {
    return { bonus: 0, ruleText: 'Target ≥ 600,000 Beans (Tanpa Extra Bonus)', qualified: false };
  }

  const matched = NEW_HOST_EXTRA_BONUS_TIERS.find(
    (t) => safeBeans >= t.minBeans && safeBeans <= t.maxBeans
  );

  if (matched) {
    return {
      bonus: matched.bonusBeans,
      ruleText: `Estimasi ±Rp${formatCurrencyIDR(matched.bonusIdrEstimate)}`,
      qualified: true,
    };
  }

  return { bonus: 0, ruleText: '(-)', qualified: false };
}

/**
 * Menghitung Duration Bonus (Tabel C, Hal. 4)
 * Syarat Durasi (Wajib Terpenuhi):
 * - Target 3: Full Month (30/31 Hari) & ≥110 Jam
 * - Target 2: ≥25 Hari & ≥90 Jam
 * - Target 1: ≥20 Hari & ≥70 Jam
 *
 * Ketentuan Kategori:
 * - New Host: Berlaku Tier 1 (2.000–4.999 Beans) fixed (200 / 500 / 800 Beans).
 * - Old Host: Dimulai dari Tier 2 (≥5.000 Beans), mengikuti matriks Beans.
 */
export function calculateDurationBonus(
  status: HostStatus,
  beans: number,
  days: number,
  hours: number,
  daysInMonth: number = 31
): DurationBonusResult {
  const fullMonthDays = daysInMonth || 31;
  const safeBeans = Math.max(0, Number(beans) || 0);
  const safeDays = Math.max(0, Math.min(fullMonthDays, Number(days) || 0));
  const safeHours = Math.max(0, Math.min(POLICY_CONSTANTS.HOURS_MAX, Number(hours) || 0));

  // Evaluasi 3 Kolom Target Durasi (dari yang tertinggi)
  let targetColumn: 'col3' | 'col2' | 'col1' | null = null;
  let durText = '';

  if (safeDays >= fullMonthDays && safeHours >= 110) {
    targetColumn = 'col3';
    durText = `${fullMonthDays} Hari & ≥110 Jam`;
  } else if (safeDays >= 25 && safeHours >= 90) {
    targetColumn = 'col2';
    durText = '25 Hari & ≥90 Jam';
  } else if (safeDays >= 20 && safeHours >= 70) {
    targetColumn = 'col1';
    durText = '20 Hari & ≥70 Jam';
  }

  // Jika tidak memenuhi satupun dari 3 target durasi -> Bonus = 0
  if (!targetColumn) {
    return {
      bonus: 0,
      ruleText: 'Belum memenuhi syarat (Min. 20 hari & 70 jam)',
      qualified: false,
    };
  }

  // Evaluasi Kualifikasi Duration Bonus:
  // - New Host: Minimal 2.000 Beans (berhak klaim dari Tier 1 hingga Tier ≥200K hingga 30.000 Beans)
  // - Old Host: Minimal 5.000 Beans (Tier 1 level 2.000 Beans eksklusif untuk New Host)
  if (status === 'new' && safeBeans < 2000) {
    return {
      bonus: 0,
      ruleText: 'New Host minimal 2,000 Beans untuk Duration Bonus',
      qualified: false,
    };
  }

  if (status === 'premium' && safeBeans < 5000) {
    return {
      bonus: 0,
      ruleText: 'Old Host minimal 5,000 Beans untuk Duration Bonus (Tier 1 tidak berlaku)',
      qualified: false,
    };
  }

  const matchedTier = DURATION_BONUS_TIERS.find((t) => {
    if (status === 'premium') {
      return t.minBeans >= 5000 && safeBeans >= t.minBeans;
    }
    return safeBeans >= t.minBeans;
  });

  if (!matchedTier) {
    return { bonus: 0, ruleText: 'Tier Duration Bonus tidak ditemukan', qualified: false };
  }

  let bonus = 0;
  if (targetColumn === 'col3') bonus = matchedTier.bonusFullMonth110h;
  else if (targetColumn === 'col2') bonus = matchedTier.bonus25d90h;
  else bonus = matchedTier.bonus20d70h;

  return {
    bonus,
    ruleText: `${matchedTier.tierName}: ${durText} (+${formatComma(bonus)} Beans)`,
    qualified: true,
  };
}

/**
 * Menghitung Total Akumulasi Pendapatan Host (IDR, USD, Beans)
 * Formula Policy Oktober 2026:
 * Total Beans = Pencapaian Dasar + Bonus Host Beans + Extra Bonus New Host + Duration Bonus

 * Estimasi Nilai USD = Total Beans ÷ 210
 * Estimasi Nilai IDR = (Total Beans ÷ 210) × Rp 17.800
 */
export function calculateEstimatedIncome(
  status: HostStatus,
  beans: number,
  days: number = 15,
  hours: number = 40,
  daysInMonth: number = 31,
  newHostMonth: NewHostMonth = 1
): CalculationResult {
  const fullMonthDays = daysInMonth || 31;
  const safeBeans = Math.max(0, Number(beans) || 0);
  const safeDays = Math.max(0, Math.min(fullMonthDays, Number(days) || 0));
  const safeHours = Math.max(0, Math.min(POLICY_CONSTANTS.HOURS_MAX, Number(hours) || 0));

  const hostBonusResult = calculateHostBonus(status, safeBeans, safeDays, safeHours, newHostMonth);
  const extraBonusResult = calculateNewHostExtraBonus(status, safeBeans);
  const durationBonusResult = calculateDurationBonus(
    status,
    safeBeans,
    safeDays,
    safeHours,
    fullMonthDays
  );

  const effectiveDurationBonus = durationBonusResult.bonus;
  const effectiveExtraBonus = extraBonusResult.bonus;

  const totalBeans = safeBeans + hostBonusResult.bonus + effectiveExtraBonus + effectiveDurationBonus;
  const usdValue = totalBeans / POLICY_CONSTANTS.EXCHANGE_RATE_BEANS_TO_USD;
  const idrValue = Math.round(usdValue * POLICY_CONSTANTS.USD_TO_IDR_RATE);

  return Object.freeze({
    baseBeans: safeBeans,
    hostBonus: hostBonusResult.bonus,
    hostBonusRule: hostBonusResult.ruleText,
    hostBonusQualified: hostBonusResult.qualified,
    isProrata: hostBonusResult.isProrata,
    tierName: hostBonusResult.tierName,
    newHostExtraBonus: effectiveExtraBonus,
    newHostExtraBonusRule: extraBonusResult.ruleText,
    durationBonus: effectiveDurationBonus,
    durationBonusRule: durationBonusResult.ruleText,
    durationQualified: durationBonusResult.qualified,
    totalBeans: totalBeans,
    usdValue: usdValue,
    idrValue: idrValue,
    totalIncomeIdr: idrValue,
  });
}

