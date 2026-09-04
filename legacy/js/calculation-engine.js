/**
 * ALPHA × BIGO HOST INCOME CALCULATOR - PURE CALCULATION ENGINE
 * Functional Core: Deterministic mathematical computations matching Official PDF Policy Q2-April 2026
 */

(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    const policies = require('./policy-constants');
    const formatters = require('./formatters');
    module.exports = factory(policies, formatters);
  } else {
    root.AlphaBigo = root.AlphaBigo || {};
    const policies = root.AlphaBigo.policies;
    const formatters = root.AlphaBigo.formatters;
    root.AlphaBigo.calc = factory(policies, formatters);
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function (policies, formatters) {
  'use strict';

  const {
    POLICY_CONSTANTS,
    NEW_HOST_TIERS,
    NEW_HOST_AGENCY_BONUS,
    PREMIUM_FLAT_TIERS,
    PREMIUM_PERCENT_TIERS,
    NEW_HOST_EXTRA_AGENCY_BONUS,
    PREMIUM_EXTRA_AGENCY_BONUS
  } = policies;

  const { formatComma, formatIDR } = formatters;

  /**
   * Menghitung Bonus Host Beans berdasarkan status, pencapaian beans, dan durasi siaran
   * @param {'new' | 'premium'} status 
   * @param {number} beans 
   * @param {number} days 
   * @param {number} hours 
   * @returns {{ bonus: number, ruleText: string, tierName: string, isProrata: boolean, qualified: boolean }}
   */
  function calculateHostBonus(status, beans, days = 15, hours = 40) {
    const safeBeans = Math.max(0, Number(beans) || 0);
    const safeDays = Math.max(0, Math.min(POLICY_CONSTANTS.DAYS_MAX, Number(days) || 0));
    const safeHours = Math.max(0, Math.min(POLICY_CONSTANTS.HOURS_MAX, Number(hours) || 0));

    // A.1 New Host (Bulan 1–3)
    if (status === 'new') {
      const matchedTier = NEW_HOST_TIERS.find(t => safeBeans >= t.minBeans) || NEW_HOST_TIERS[NEW_HOST_TIERS.length - 1];
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
        qualified: true
      };
    }

    // A.2 Premium Host (Bulan ke-4 dst)
    if (safeBeans < 2000) {
      return {
        bonus: 0,
        ruleText: "Belum mencapai syarat minimum 2,000 Beans",
        tierName: "Premium: < 2,000 Beans",
        isProrata: false,
        qualified: false
      };
    }

    // Evaluasi base target bonus jika mencapai 15 hari & 40 jam
    let baseBonus = 0;
    let baseRuleText = "";
    let tierName = "";

    if (safeBeans >= 130000) {
      const matchedTier = PREMIUM_PERCENT_TIERS.find(t => safeBeans >= t.minBeans);
      baseBonus = Math.round(safeBeans * matchedTier.rate);
      baseRuleText = `${matchedTier.label} × ${formatComma(safeBeans)} Beans`;
      tierName = `Premium: ${matchedTier.label}`;
    } else {
      const matchedFlat = PREMIUM_FLAT_TIERS.find(t => safeBeans >= t.minBeans);
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
        qualified: true
      };
    }

    // Cek Evaluasi Prorata (Bagian E, Hal. 5):
    // Syarat: min 10 hari siaran valid, 40 jam durasi siaran valid, dan 2.001 Beans
    if (safeDays >= POLICY_CONSTANTS.PRORATA_MIN_DAYS && safeHours >= POLICY_CONSTANTS.MIN_VALID_HOURS && safeBeans >= POLICY_CONSTANTS.PRORATA_MIN_BEANS) {
      const prorataBonus = Math.round((safeDays / 15) * baseBonus);
      return {
        bonus: prorataBonus,
        ruleText: `Komisi Prorata (${safeDays}/15 Hari) × ${formatComma(baseBonus)} Beans`,
        tierName: `${tierName} (Prorata)`,
        isProrata: true,
        qualified: true
      };
    }

    // Tidak Memenuhi Syarat Kualifikasi (Hari < 10 atau Jam < 40)
    let reason = "Target tidak tercapai";
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
      qualified: false
    };
  }

  /**
   * Menghitung Duration Bonus untuk Premium Host (Tabel C, Hal. 4)
   * @param {'new' | 'premium'} status 
   * @param {number} beans 
   * @param {number} days 
   * @param {number} hours 
   * @returns {{ bonus: number, ruleText: string, qualified: boolean }}
   */
  function calculateDurationBonus(status, beans, days, hours) {
    if (status === 'new') {
      return { bonus: 0, ruleText: "Tidak berlaku untuk New Host", qualified: false };
    }

    const safeBeans = Math.max(0, Number(beans) || 0);
    const safeDays = Math.max(0, Math.min(POLICY_CONSTANTS.DAYS_MAX, Number(days) || 0));
    const safeHours = Math.max(0, Math.min(POLICY_CONSTANTS.HOURS_MAX, Number(hours) || 0));

    if (safeBeans < 5000 || safeDays < 15 || safeHours < 40) {
      let reason = "Belum memenuhi syarat dasar";
      if (safeBeans < 5000) reason += " (Min. 5,000 Beans)";
      else if (safeDays < 15) reason += " (Min. 15 Hari Siaran)";
      else if (safeHours < 40) reason += " (Min. 40 Jam Siaran)";
      return { bonus: 0, ruleText: reason, qualified: false };
    }

    if (safeDays === 31) {
      if (safeHours >= 110) {
        if (safeBeans >= 130000) return { bonus: 30000, ruleText: "31 Hari & ≥110 Jam (Tier ≥130K)", qualified: true };
        if (safeBeans >= 70000)  return { bonus: 20000, ruleText: "31 Hari & ≥110 Jam (Tier 70K–129.9K)", qualified: true };
        if (safeBeans >= 30000)  return { bonus: 15000, ruleText: "31 Hari & ≥110 Jam (Tier 30K–69.9K)", qualified: true };
        if (safeBeans >= 10000)  return { bonus: 7500,  ruleText: "31 Hari & ≥110 Jam (Tier 10K–29.9K)", qualified: true };
        return { bonus: 2100, ruleText: "31 Hari & ≥110 Jam (Tier 5K–9.9K)", qualified: true };
      }

      if (safeHours >= 90) {
        if (safeBeans >= 130000) return { bonus: 25000, ruleText: "31 Hari & ≥90 Jam (Tier ≥130K)", qualified: true };
        if (safeBeans >= 70000)  return { bonus: 15000, ruleText: "31 Hari & ≥90 Jam (Tier 70K–129.9K)", qualified: true };
        if (safeBeans >= 30000)  return { bonus: 10000, ruleText: "31 Hari & ≥90 Jam (Tier 30K–69.9K)", qualified: true };
        if (safeBeans >= 10000)  return { bonus: 7500,  ruleText: "31 Hari & ≥90 Jam (Tier 10K–29.9K)", qualified: true };
        return { bonus: 2100, ruleText: "31 Hari & ≥90 Jam (Tier 5K–9.9K)", qualified: true };
      }

      if (safeHours >= 70) {
        if (safeBeans >= 130000) return { bonus: 20000, ruleText: "31 Hari & ≥70 Jam (Tier ≥130K)", qualified: true };
        if (safeBeans >= 70000)  return { bonus: 10000, ruleText: "31 Hari & ≥70 Jam (Tier 70K–129.9K)", qualified: true };
        if (safeBeans >= 30000)  return { bonus: 10000, ruleText: "31 Hari & ≥70 Jam (Tier 30K–69.9K)", qualified: true };
        if (safeBeans >= 10000)  return { bonus: 7500,  ruleText: "31 Hari & ≥70 Jam (Tier 10K–29.9K)", qualified: true };
        return { bonus: 2100, ruleText: "31 Hari & ≥70 Jam (Tier 5K–9.9K)", qualified: true };
      }

      if (safeHours >= 50) {
        if (safeBeans >= 10000) return { bonus: 5000, ruleText: "31 Hari & ≥50 Jam (Tier ≥10K)", qualified: true };
        return { bonus: 2100, ruleText: "31 Hari & ≥50 Jam (Tier 5K–9.9K)", qualified: true };
      }

      return { bonus: 1000, ruleText: "31 Hari & 40–49.9 Jam (Flat 1,000)", qualified: true };
    }

    return {
      bonus: 1000,
      ruleText: "Syarat Dasar Terpenuhi: ≥15 Hari & ≥40 Jam (Flat 1,000)",
      qualified: true
    };
  }

  /**
   * Menghitung Bonus Agensi Resmi (IDR) - Tabel A.1 & A.2
   * Syarat A.5.a: Wajib memenuhi target hari (min 15 hari) dan jam (min 40 jam).
   * @param {'new' | 'premium'} status 
   * @param {number} beans 
   * @param {number} days 
   * @param {number} hours 
   * @returns {{ bonusIdr: number, ruleText: string, qualified: boolean }}
   */
  function calculateAgencyBonus(status, beans, days = 15, hours = 40) {
    const safeBeans = Math.max(0, Number(beans) || 0);
    const safeDays = Math.max(0, Math.min(POLICY_CONSTANTS.DAYS_MAX, Number(days) || 0));
    const safeHours = Math.max(0, Math.min(POLICY_CONSTANTS.HOURS_MAX, Number(hours) || 0));

    // Syarat kelayakan Bonus Agensi (A.5.a): 15 hari & 40 jam
    if (safeDays < POLICY_CONSTANTS.MIN_VALID_DAYS || safeHours < POLICY_CONSTANTS.MIN_VALID_HOURS) {
      return {
        bonusIdr: 0,
        ruleText: "Syarat siaran belum terpenuhi (Min. 15 Hari & 40 Jam)",
        qualified: false
      };
    }

    if (status === 'new') {
      const matched = NEW_HOST_AGENCY_BONUS.find(t => safeBeans >= t.minBeans) || NEW_HOST_AGENCY_BONUS[NEW_HOST_AGENCY_BONUS.length - 1];
      return {
        bonusIdr: matched.bonusIdr,
        ruleText: matched.bonusIdr > 0 ? matched.label : "Rp 0 (< 10K Beans)",
        qualified: matched.bonusIdr > 0
      };
    }

    // Premium Host
    if (safeBeans >= 130000) {
      const matched = PREMIUM_PERCENT_TIERS.find(t => safeBeans >= t.minBeans);
      if (matched) {
        return {
          bonusIdr: matched.agencyBonus,
          ruleText: `Rp ${formatComma(matched.agencyBonus)} (${formatComma(matched.minBeans)} Beans)`,
          qualified: true
        };
      }
    }

    const matchedFlat = PREMIUM_FLAT_TIERS.find(t => safeBeans >= t.minBeans);
    if (matchedFlat && matchedFlat.agencyBonus > 0) {
      return {
        bonusIdr: matchedFlat.agencyBonus,
        ruleText: `Rp ${formatComma(matchedFlat.agencyBonus)} (${formatComma(matchedFlat.minBeans)} Beans)`,
        qualified: true
      };
    }

    return {
      bonusIdr: 0,
      ruleText: "Rp 0 (< 10K Beans)",
      qualified: false
    };
  }

  /**
   * Menghitung Extra Bonus Agency (IDR) - Bagian B (Hal. 3)
   * Syarat B.b: Mencapai target Beans sesuai nominal tabel (tidak kurang maupun tidak lebih)
   * Syarat B.c: Memenuhi syarat siaran A.5 poin a-j (min 15 hari & 40 jam)
   * @param {'new' | 'premium'} status 
   * @param {number} beans 
   * @param {number} days 
   * @param {number} hours 
   * @returns {{ extraBonusIdr: number, ruleText: string, qualified: boolean }}
   */
  function calculateExtraAgencyBonus(status, beans, days = 15, hours = 40) {
    const safeBeans = Math.max(0, Number(beans) || 0);
    const safeDays = Math.max(0, Math.min(POLICY_CONSTANTS.DAYS_MAX, Number(days) || 0));
    const safeHours = Math.max(0, Math.min(POLICY_CONSTANTS.HOURS_MAX, Number(hours) || 0));

    if (safeDays < POLICY_CONSTANTS.MIN_VALID_DAYS || safeHours < POLICY_CONSTANTS.MIN_VALID_HOURS) {
      return {
        extraBonusIdr: 0,
        ruleText: "Syarat siaran belum terpenuhi (Min. 15 Hari & 40 Jam)",
        qualified: false
      };
    }

    if (status === 'new') {
      const matched = NEW_HOST_EXTRA_AGENCY_BONUS.find(t => safeBeans >= t.minBeans && safeBeans <= t.maxBeans);
      if (matched) {
        return {
          extraBonusIdr: matched.extraBonusIdr,
          ruleText: matched.label,
          qualified: true
        };
      }
      return { extraBonusIdr: 0, ruleText: "Belum masuk rentang target Extra Bonus", qualified: false };
    }

    // Premium Host
    const matched = PREMIUM_EXTRA_AGENCY_BONUS.find(t => safeBeans >= t.minBeans && safeBeans <= t.maxBeans);
    if (matched) {
      return {
        extraBonusIdr: matched.extraBonusIdr,
        ruleText: matched.label,
        qualified: true
      };
    }

    return { extraBonusIdr: 0, ruleText: "Belum masuk rentang target Extra Bonus", qualified: false };
  }

  /**
   * Menghitung Total Akumulasi Pendapatan Host (IDR, USD, Beans)
   * Formula Sesuai Brief Pemilik:
   * Total Beans = Pencapaian Dasar + Bonus Host Beans + Duration Bonus (hanya Premium Host)
   * Estimasi Nilai USD = Total Beans ÷ 210
   * Estimasi Nilai IDR = (Total Beans ÷ 210) × Rp 17.800
   * Ketentuan Khusus Brief: "BONUS AGENCY & EXTRA BONUS AGENCY - TIDAK PERLU DIMASUKKAN."
   */
  function calculateEstimatedIncome(status, beans, days = 15, hours = 40) {
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
      totalIncomeIdr: idrValue // Sesuai Brief Pemilik: Total Beans ÷ 210 × Rp 17.800
    };
  }

  return {
    calculateHostBonus,
    calculateDurationBonus,
    calculateEstimatedIncome
  };
});
