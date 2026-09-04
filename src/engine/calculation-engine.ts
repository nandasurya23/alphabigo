/**
 * ALPHA × BIGO HOST INCOME CALCULATOR - PURE CALCULATION ENGINE
 * Functional Core: Deterministic mathematical computations matching Official Policy Q2-April 2026
 */

import {
  HostStatus,
  HostBonusResult,
  DurationBonusResult,
  CalculationResult,
} from '@/types/calculator';
import {
  POLICY_CONSTANTS,
  NEW_HOST_TIERS,
  PREMIUM_FLAT_TIERS,
  PREMIUM_PERCENT_TIERS,
} from '@/constants/policy-constants';
import { formatComma } from '@/engine/formatters';

/**
 * Menghitung Bonus Host Beans berdasarkan status, pencapaian beans, dan durasi siaran
 */
export function calculateHostBonus(
  status: HostStatus,
  beans: number,
  days: number = 15,
  hours: number = 40
): HostBonusResult {
  const safeBeans = Math.max(0, Number(beans) || 0);
  const safeDays = Math.max(0, Math.min(POLICY_CONSTANTS.DAYS_MAX, Number(days) || 0));
  const safeHours = Math.max(0, Math.min(POLICY_CONSTANTS.HOURS_MAX, Number(hours) || 0));

  // A.1 New Host (Bulan 1–3)
  if (status === 'new') {
    const matchedTier =
      NEW_HOST_TIERS.find((t) => safeBeans >= t.minBeans) ||
      NEW_HOST_TIERS[NEW_HOST_TIERS.length - 1];
    const rawBonus = Math.round(safeBeans * matchedTier.rate);
    const isCapped = rawBonus > POLICY_CONSTANTS.NEW_HOST_BONUS_CAP;
    const finalBonus = isCapped ? POLICY_CONSTANTS.NEW_HOST_BONUS_CAP : rawBonus;

    const ruleText = isCapped
      ? `${matchedTier.label} (Capped maks 360,000)`
      : `${matchedTier.label} × ${formatComma(safeBeans)} Beans`;

    return {
      bonus: finalBonus,
      ruleText: ruleText,
      tierName: `New Host: ${matchedTier.label}`,
      isProrata: false,
      qualified: true,
    };
  }

  // A.2 Premium Host (Bulan ke-4 dst)
  if (safeBeans < 2000) {
    return {
      bonus: 0,
      ruleText: 'Belum mencapai syarat minimum 2,000 Beans',
      tierName: 'Premium: < 2,000 Beans',
      isProrata: false,
      qualified: false,
    };
  }

  // Evaluasi base target bonus jika mencapai 15 hari & 40 jam
  let baseBonus = 0;
  let baseRuleText = '';
  let tierName = '';

  if (safeBeans >= 130000) {
    const matchedTier = PREMIUM_PERCENT_TIERS.find((t) => safeBeans >= t.minBeans);
    if (matchedTier) {
      baseBonus = Math.round(safeBeans * matchedTier.rate);
      baseRuleText = `${matchedTier.label} × ${formatComma(safeBeans)} Beans`;
      tierName = `Premium: ${matchedTier.label}`;
    }
  } else {
    const matchedFlat = PREMIUM_FLAT_TIERS.find((t) => safeBeans >= t.minBeans);
    if (matchedFlat) {
      baseBonus = matchedFlat.flatBonus;
      baseRuleText = matchedFlat.label;
      tierName = `Premium: ${matchedFlat.label}`;
    }
  }

  // Cek Kualifikasi Penuh: Min 15 Hari & Min 40 Jam (A.3.d & A.4.a)
  if (safeDays >= POLICY_CONSTANTS.MIN_VALID_DAYS && safeHours >= POLICY_CONSTANTS.MIN_VALID_HOURS) {
    return {
      bonus: baseBonus,
      ruleText: baseRuleText,
      tierName: tierName,
      isProrata: false,
      qualified: true,
    };
  }

  // Cek Evaluasi Prorata (Bagian E, Hal. 5):
  // Syarat: min 10 hari siaran valid, 40 jam durasi siaran valid, dan 2.001 Beans
  if (
    safeDays >= POLICY_CONSTANTS.PRORATA_MIN_DAYS &&
    safeHours >= POLICY_CONSTANTS.MIN_VALID_HOURS &&
    safeBeans >= POLICY_CONSTANTS.PRORATA_MIN_BEANS
  ) {
    const prorataBonus = Math.round((safeDays / 15) * baseBonus);
    return {
      bonus: prorataBonus,
      ruleText: `Komisi Prorata (${safeDays}/15 Hari) × ${formatComma(baseBonus)} Beans`,
      tierName: `${tierName} (Prorata)`,
      isProrata: true,
      qualified: true,
    };
  }

  // Tidak Memenuhi Syarat Kualifikasi (Hari < 10 atau Jam < 40)
  let reason = 'Target tidak tercapai';
  if (safeHours < POLICY_CONSTANTS.MIN_VALID_HOURS) {
    reason = `Durasi siaran kurang dari 40 Jam (${safeHours} Jam)`;
  } else if (safeDays < POLICY_CONSTANTS.PRORATA_MIN_DAYS) {
    reason = `Hari siaran valid kurang dari 10 Hari (${safeDays} Hari)`;
  }

  return {
    bonus: 0,
    ruleText: `${reason} (Komisi Hangus)`,
    tierName: `${tierName} (Diskualifikasi)`,
    isProrata: false,
    qualified: false,
  };
}

/**
 * Menghitung Duration Bonus untuk Premium Host (Tabel C, Hal. 4)
 */
export function calculateDurationBonus(
  status: HostStatus,
  beans: number,
  days: number,
  hours: number
): DurationBonusResult {
  if (status === 'new') {
    return { bonus: 0, ruleText: 'Tidak berlaku untuk New Host', qualified: false };
  }

  const safeBeans = Math.max(0, Number(beans) || 0);
  const safeDays = Math.max(0, Math.min(POLICY_CONSTANTS.DAYS_MAX, Number(days) || 0));
  const safeHours = Math.max(0, Math.min(POLICY_CONSTANTS.HOURS_MAX, Number(hours) || 0));

  if (safeBeans < 5000 || safeDays < 15 || safeHours < 40) {
    let reason = 'Belum memenuhi syarat dasar';
    if (safeBeans < 5000) reason += ' (Min. 5,000 Beans)';
    else if (safeDays < 15) reason += ' (Min. 15 Hari Siaran)';
    else if (safeHours < 40) reason += ' (Min. 40 Jam Siaran)';
    return { bonus: 0, ruleText: reason, qualified: false };
  }

  if (safeDays === 31) {
    if (safeHours >= 110) {
      if (safeBeans >= 130000) return { bonus: 30000, ruleText: '31 Hari & ≥110 Jam (Tier ≥130K)', qualified: true };
      if (safeBeans >= 70000)  return { bonus: 20000, ruleText: '31 Hari & ≥110 Jam (Tier 70K–129.9K)', qualified: true };
      if (safeBeans >= 30000)  return { bonus: 15000, ruleText: '31 Hari & ≥110 Jam (Tier 30K–69.9K)', qualified: true };
      if (safeBeans >= 10000)  return { bonus: 7500,  ruleText: '31 Hari & ≥110 Jam (Tier 10K–29.9K)', qualified: true };
      return { bonus: 2100, ruleText: '31 Hari & ≥110 Jam (Tier 5K–9.9K)', qualified: true };
    }

    if (safeHours >= 90) {
      if (safeBeans >= 130000) return { bonus: 25000, ruleText: '31 Hari & ≥90 Jam (Tier ≥130K)', qualified: true };
      if (safeBeans >= 70000)  return { bonus: 15000, ruleText: '31 Hari & ≥90 Jam (Tier 70K–129.9K)', qualified: true };
      if (safeBeans >= 30000)  return { bonus: 10000, ruleText: '31 Hari & ≥90 Jam (Tier 30K–69.9K)', qualified: true };
      if (safeBeans >= 10000)  return { bonus: 7500,  ruleText: '31 Hari & ≥90 Jam (Tier 10K–29.9K)', qualified: true };
      return { bonus: 2100, ruleText: '31 Hari & ≥90 Jam (Tier 5K–9.9K)', qualified: true };
    }

    if (safeHours >= 70) {
      if (safeBeans >= 130000) return { bonus: 20000, ruleText: '31 Hari & ≥70 Jam (Tier ≥130K)', qualified: true };
      if (safeBeans >= 70000)  return { bonus: 10000, ruleText: '31 Hari & ≥70 Jam (Tier 70K–129.9K)', qualified: true };
      if (safeBeans >= 30000)  return { bonus: 10000, ruleText: '31 Hari & ≥70 Jam (Tier 30K–69.9K)', qualified: true };
      if (safeBeans >= 10000)  return { bonus: 7500,  ruleText: '31 Hari & ≥70 Jam (Tier 10K–29.9K)', qualified: true };
      return { bonus: 2100, ruleText: '31 Hari & ≥70 Jam (Tier 5K–9.9K)', qualified: true };
    }

    if (safeHours >= 50) {
      if (safeBeans >= 10000) return { bonus: 5000, ruleText: '31 Hari & ≥50 Jam (Tier ≥10K)', qualified: true };
      return { bonus: 2100, ruleText: '31 Hari & ≥50 Jam (Tier 5K–9.9K)', qualified: true };
    }

    return { bonus: 1000, ruleText: '31 Hari & 40–49.9 Jam (Flat 1,000)', qualified: true };
  }

  return {
    bonus: 1000,
    ruleText: 'Syarat Dasar Terpenuhi: ≥15 Hari & ≥40 Jam (Flat 1,000)',
    qualified: true,
  };
}

/**
 * Menghitung Total Akumulasi Pendapatan Host (IDR, USD, Beans)
 * Formula Sesuai Brief Pemilik:
 * Total Beans = Pencapaian Dasar + Bonus Host Beans + Duration Bonus (hanya Premium Host)
 * Estimasi Nilai USD = Total Beans ÷ 210
 * Estimasi Nilai IDR = (Total Beans ÷ 210) × Rp 17.800
 * Ketentuan Khusus Brief: "BONUS AGENCY & EXTRA BONUS AGENCY - TIDAK PERLU DIMASUKKAN."
 */
export function calculateEstimatedIncome(
  status: HostStatus,
  beans: number,
  days: number = 15,
  hours: number = 40
): CalculationResult {
  const safeBeans = Math.max(0, Number(beans) || 0);
  const safeDays = Math.max(0, Math.min(POLICY_CONSTANTS.DAYS_MAX, Number(days) || 0));
  const safeHours = Math.max(0, Math.min(POLICY_CONSTANTS.HOURS_MAX, Number(hours) || 0));

  const hostBonusResult = calculateHostBonus(status, safeBeans, safeDays, safeHours);
  const durationBonusResult = calculateDurationBonus(status, safeBeans, safeDays, safeHours);

  // Duration bonus hanya berlaku untuk status Premium Host (Sesuai Brief Poin D)
  const effectiveDurationBonus = status === 'premium' ? durationBonusResult.bonus : 0;

  const totalBeans = safeBeans + hostBonusResult.bonus + effectiveDurationBonus;
  const usdValue = totalBeans / POLICY_CONSTANTS.EXCHANGE_RATE_BEANS_TO_USD;
  const idrValue = Math.round(usdValue * POLICY_CONSTANTS.USD_TO_IDR_RATE);

  return {
    baseBeans: safeBeans,
    hostBonus: hostBonusResult.bonus,
    hostBonusRule: hostBonusResult.ruleText,
    hostBonusQualified: hostBonusResult.qualified,
    isProrata: hostBonusResult.isProrata,
    tierName: hostBonusResult.tierName,
    durationBonus: effectiveDurationBonus,
    durationBonusRule: durationBonusResult.ruleText,
    durationQualified: durationBonusResult.qualified,
    totalBeans: totalBeans,
    usdValue: usdValue,
    idrValue: idrValue,
    totalIncomeIdr: idrValue,
  };
}
