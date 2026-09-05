import { describe, it, expect } from 'vitest';
import {
  calculateHostBonus,
  calculateDurationBonus,
  calculateEstimatedIncome,
} from '@/engine/calculation-engine';

describe('BIGO Calculation Engine - Benchmark Utama Owner Brief', () => {
  it('TC-OWNER-01: Benchmark Resmi Owner (Premium 130K, 15d, 40h)', () => {
    const res = calculateEstimatedIncome('premium', 130000, 15, 40);
    expect(res.baseBeans).toBe(130000);
    expect(res.hostBonus).toBe(66300); // 51%
    expect(res.durationBonus).toBe(1000);
    expect(res.totalBeans).toBe(197300);
    expect(Number(res.usdValue.toFixed(2))).toBe(939.52);
    expect(res.idrValue).toBe(16723524);
  });

  it('TC-OWNER-02: New Host 130K (New 130K, 15d, 40h)', () => {
    const res = calculateEstimatedIncome('new', 130000, 15, 40);
    expect(res.baseBeans).toBe(130000);
    expect(res.hostBonus).toBe(117000); // 90%
    expect(res.durationBonus).toBe(0); // Ditiadakan untuk New Host
    expect(res.totalBeans).toBe(247000);
    expect(Number(res.usdValue.toFixed(2))).toBe(1176.19);
    expect(res.idrValue).toBe(20936190);
  });

  it('TC-OWNER-03: Premium Host 500K (Premium 500K, 15d, 40h)', () => {
    const res = calculateEstimatedIncome('premium', 500000, 15, 40);
    expect(res.baseBeans).toBe(500000);
    expect(res.hostBonus).toBe(275000); // 55%
    expect(res.durationBonus).toBe(1000);
    expect(res.totalBeans).toBe(776000);
    expect(Number(res.usdValue.toFixed(2))).toBe(3695.24);
    expect(res.idrValue).toBe(65775238);
  });

  it('TC-OWNER-04: Jam Siaran Desimal (Premium 130K, 15d, 40.5h)', () => {
    const res = calculateEstimatedIncome('premium', 130000, 15, 40.5);
    expect(res.baseBeans).toBe(130000);
    expect(res.hostBonus).toBe(66300);
    expect(res.durationBonus).toBe(1000);
    expect(res.totalBeans).toBe(197300);
    expect(Number(res.usdValue.toFixed(2))).toBe(939.52);
    expect(res.idrValue).toBe(16723524);
  });
});

describe('BIGO Calculation Engine - New Host Tiers', () => {
  it('TC-001: New Host di bawah batas minimum (1,500 Beans)', () => {
    const res = calculateEstimatedIncome('new', 1500, 20, 50);
    expect(res.hostBonus).toBe(0);
    expect(res.durationBonus).toBe(0);
    expect(res.totalBeans).toBe(1500);
    expect(Number(res.usdValue.toFixed(2))).toBe(7.14);
    expect(res.idrValue).toBe(127143);
  });

  it('TC-002: New Host Tier 1 - 50% (3,000 Beans)', () => {
    const res = calculateEstimatedIncome('new', 3000, 15, 40);
    expect(res.hostBonus).toBe(1500);
    expect(res.durationBonus).toBe(0);
    expect(res.totalBeans).toBe(4500);
    expect(Number(res.usdValue.toFixed(2))).toBe(21.43);
    expect(res.idrValue).toBe(381429);
  });

  it('TC-003: New Host Tier 2 - 85% (50,000 Beans)', () => {
    const res = calculateEstimatedIncome('new', 50000, 25, 60);
    expect(res.hostBonus).toBe(42500);
    expect(res.durationBonus).toBe(0);
    expect(res.totalBeans).toBe(92500);
    expect(Number(res.usdValue.toFixed(2))).toBe(440.48);
    expect(res.idrValue).toBe(7840476);
  });

  it('TC-004: New Host Tier 3 - 90% (100,000 Beans)', () => {
    const res = calculateEstimatedIncome('new', 100000, 31, 110);
    expect(res.hostBonus).toBe(90000);
    expect(res.durationBonus).toBe(0);
    expect(res.totalBeans).toBe(190000);
    expect(Number(res.usdValue.toFixed(2))).toBe(904.76);
    expect(res.idrValue).toBe(16104762);
  });

  it('TC-005: New Host Tepat di Titik Cap (400,000 Beans)', () => {
    const res = calculateEstimatedIncome('new', 400000, 31, 120);
    expect(res.hostBonus).toBe(360000);
    expect(res.durationBonus).toBe(0);
    expect(res.totalBeans).toBe(760000);
    expect(Number(res.usdValue.toFixed(2))).toBe(3619.05);
    expect(res.idrValue).toBe(64419048);
  });

  it('TC-006: New Host Melebihi Batas Cap (500,000 Beans -> Capped 360,000)', () => {
    const res = calculateEstimatedIncome('new', 500000, 31, 130);
    expect(res.hostBonus).toBe(360000);
    expect(res.durationBonus).toBe(0);
    expect(res.totalBeans).toBe(860000);
    expect(Number(res.usdValue.toFixed(2))).toBe(4095.24);
    expect(res.idrValue).toBe(72895238);
  });
});

describe('BIGO Calculation Engine - Premium Host Flat Tiers', () => {
  it('TC-007: Premium Host di bawah batas minimum (1,500 Beans)', () => {
    const res = calculateEstimatedIncome('premium', 1500, 31, 110);
    expect(res.hostBonus).toBe(0);
    expect(res.durationBonus).toBe(0);
    expect(res.totalBeans).toBe(1500);
    expect(Number(res.usdValue.toFixed(2))).toBe(7.14);
    expect(res.idrValue).toBe(127143);
  });

  it('TC-008: Premium Flat Tier 2K (2,000 Beans, full duration)', () => {
    const res = calculateEstimatedIncome('premium', 2000, 15, 40);
    expect(res.hostBonus).toBe(1000);
    expect(res.durationBonus).toBe(0); // < 5000 beans
    expect(res.totalBeans).toBe(3000);
    expect(Number(res.usdValue.toFixed(2))).toBe(14.29);
    expect(res.idrValue).toBe(254286);
  });

  it('TC-009: Premium Flat Tier 5K (5,000 Beans, full duration)', () => {
    const res = calculateEstimatedIncome('premium', 5000, 15, 40);
    expect(res.hostBonus).toBe(3800);
    expect(res.durationBonus).toBe(1000);
    expect(res.totalBeans).toBe(9800);
    expect(Number(res.usdValue.toFixed(2))).toBe(46.67);
    expect(res.idrValue).toBe(830667);
  });

  it('TC-010: Premium Flat Tier 10K (10,000 Beans, 15d, 40h)', () => {
    const res = calculateEstimatedIncome('premium', 10000, 15, 40);
    expect(res.hostBonus).toBe(7500);
    expect(res.durationBonus).toBe(1000);
    expect(res.totalBeans).toBe(18500);
    expect(Number(res.usdValue.toFixed(2))).toBe(88.10);
    expect(res.idrValue).toBe(1568095);
  });

  it('TC-011: Premium Flat Tier 20K (20,000 Beans, 20d, 45h)', () => {
    const res = calculateEstimatedIncome('premium', 20000, 20, 45);
    expect(res.hostBonus).toBe(12000);
    expect(res.durationBonus).toBe(1000);
    expect(res.totalBeans).toBe(33000);
    expect(Number(res.usdValue.toFixed(2))).toBe(157.14);
    expect(res.idrValue).toBe(2797143);
  });

  it('TC-012: Premium Flat Tier 30K (30,000 Beans, 25d, 60h)', () => {
    const res = calculateEstimatedIncome('premium', 30000, 25, 60);
    expect(res.hostBonus).toBe(17000);
    expect(res.durationBonus).toBe(1000);
    expect(res.totalBeans).toBe(48000);
    expect(Number(res.usdValue.toFixed(2))).toBe(228.57);
    expect(res.idrValue).toBe(4068571);
  });

  it('TC-013: Premium Flat Tier 50K (50,000 Beans, 31d, 45h)', () => {
    const res = calculateEstimatedIncome('premium', 50000, 31, 45);
    expect(res.hostBonus).toBe(25000);
    expect(res.durationBonus).toBe(1000); // 31d but hours < 50
    expect(res.totalBeans).toBe(76000);
    expect(Number(res.usdValue.toFixed(2))).toBe(361.90);
    expect(res.idrValue).toBe(6441905);
  });

  it('TC-014: Premium Flat Tier 70K (70,000 Beans, 31d, 55h)', () => {
    const res = calculateEstimatedIncome('premium', 70000, 31, 55);
    expect(res.hostBonus).toBe(35000);
    expect(res.durationBonus).toBe(5000); // 31d & >=50h
    expect(res.totalBeans).toBe(110000);
    expect(Number(res.usdValue.toFixed(2))).toBe(523.81);
    expect(res.idrValue).toBe(9323810);
  });

  it('TC-015: Premium Flat Tier 100K (100,000 Beans, 31d, 75h)', () => {
    const res = calculateEstimatedIncome('premium', 100000, 31, 75);
    expect(res.hostBonus).toBe(50000);
    expect(res.durationBonus).toBe(10000); // 31d & >=70h
    expect(res.totalBeans).toBe(160000);
    expect(Number(res.usdValue.toFixed(2))).toBe(761.90);
    expect(res.idrValue).toBe(13561905);
  });

  it('TC-016: Premium Interval di antara Flat (15,000 Beans, 31d, 95h)', () => {
    const res = calculateEstimatedIncome('premium', 15000, 31, 95);
    expect(res.hostBonus).toBe(7500); // Tier 10K
    expect(res.durationBonus).toBe(7500); // 31d & >=90h & 10K-29.9K tier
    expect(res.totalBeans).toBe(30000);
    expect(Number(res.usdValue.toFixed(2))).toBe(142.86);
    expect(res.idrValue).toBe(2542857);
  });
});

describe('BIGO Calculation Engine - Premium Host Percentage Tiers', () => {
  it('TC-017: Premium 130K Tier 51% (31d, 110h)', () => {
    const res = calculateEstimatedIncome('premium', 130000, 31, 110);
    expect(res.hostBonus).toBe(66300);
    expect(res.durationBonus).toBe(30000);
    expect(res.totalBeans).toBe(226300);
    expect(Number(res.usdValue.toFixed(2))).toBe(1077.62);
    expect(res.idrValue).toBe(19181619);
  });

  it('TC-018: Premium 250K Tier 53% (31d, 110h)', () => {
    const res = calculateEstimatedIncome('premium', 250000, 31, 110);
    expect(res.hostBonus).toBe(132500);
    expect(res.durationBonus).toBe(30000);
    expect(res.totalBeans).toBe(412500);
    expect(Number(res.usdValue.toFixed(2))).toBe(1964.29);
    expect(res.idrValue).toBe(34964286);
  });

  it('TC-019: Premium 400K Tier 55% (31d, 95h)', () => {
    const res = calculateEstimatedIncome('premium', 400000, 31, 95);
    expect(res.hostBonus).toBe(220000);
    expect(res.durationBonus).toBe(25000);
    expect(res.totalBeans).toBe(645000);
    expect(Number(res.usdValue.toFixed(2))).toBe(3071.43);
    expect(res.idrValue).toBe(54671429);
  });

  it('TC-020: Premium 600K Tier 57% (31d, 75h)', () => {
    const res = calculateEstimatedIncome('premium', 600000, 31, 75);
    expect(res.hostBonus).toBe(342000);
    expect(res.durationBonus).toBe(20000);
    expect(res.totalBeans).toBe(962000);
    expect(Number(res.usdValue.toFixed(2))).toBe(4580.95);
    expect(res.idrValue).toBe(81540952);
  });

  it('TC-021: Premium 800K Tier 59% (31d, 115h)', () => {
    const res = calculateEstimatedIncome('premium', 800000, 31, 115);
    expect(res.hostBonus).toBe(472000);
    expect(res.durationBonus).toBe(30000);
    expect(res.totalBeans).toBe(1302000);
    expect(Number(res.usdValue.toFixed(2))).toBe(6200.00);
    expect(res.idrValue).toBe(110360000);
  });

  it('TC-022: Premium 1.2M Tier 62% (31d, 110h)', () => {
    const res = calculateEstimatedIncome('premium', 1200000, 31, 110);
    expect(res.hostBonus).toBe(744000);
    expect(res.durationBonus).toBe(30000);
    expect(res.totalBeans).toBe(1974000);
    expect(Number(res.usdValue.toFixed(2))).toBe(9400.00);
    expect(res.idrValue).toBe(167320000);
  });

  it('TC-023: Premium 2.3M Tier 68% (31d, 120h)', () => {
    const res = calculateEstimatedIncome('premium', 2300000, 31, 120);
    expect(res.hostBonus).toBe(1564000);
    expect(res.durationBonus).toBe(30000);
    expect(res.totalBeans).toBe(3894000);
    expect(Number(res.usdValue.toFixed(2))).toBe(18542.86);
    expect(res.idrValue).toBe(330062857);
  });

  it('TC-024: Premium 3.5M Tier 72% (31d, 125h)', () => {
    const res = calculateEstimatedIncome('premium', 3500000, 31, 125);
    expect(res.hostBonus).toBe(2520000);
    expect(res.durationBonus).toBe(30000);
    expect(res.totalBeans).toBe(6050000);
    expect(Number(res.usdValue.toFixed(2))).toBe(28809.52);
    expect(res.idrValue).toBe(512809524);
  });

  it('TC-025: Premium Top Tier 5M Tier 75% (31d, 130h)', () => {
    const res = calculateEstimatedIncome('premium', 5000000, 31, 130);
    expect(res.hostBonus).toBe(3750000);
    expect(res.durationBonus).toBe(30000);
    expect(res.totalBeans).toBe(8780000);
    expect(Number(res.usdValue.toFixed(2))).toBe(41809.52);
    expect(res.idrValue).toBe(744209524);
  });
});

describe('BIGO Calculation Engine - Boundaries & Prorata', () => {
  it('TC-BND-01: Input Hari Negatif clamped ke 0', () => {
    const res = calculateEstimatedIncome('premium', 130000, -5, 40);
    expect(res.hostBonus).toBe(0); // Disqualified karena hari < 10
  });

  it('TC-BND-02: Input Hari Melebihi 31 di-clamp ke 31', () => {
    const res = calculateEstimatedIncome('premium', 130000, 35, 110);
    expect(res.durationBonus).toBe(30000); // Clamped ke 31 hari & 110 jam
  });

  it('TC-BND-03: Input Jam Melebihi 155 di-clamp ke 155', () => {
    const res = calculateEstimatedIncome('premium', 130000, 31, 180);
    expect(res.durationBonus).toBe(30000);
  });

  it('TC-BND-04: Input Beans 0', () => {
    const res = calculateEstimatedIncome('premium', 0, 15, 40);
    expect(res.totalBeans).toBe(0);
    expect(res.idrValue).toBe(0);
    expect(res.usdValue).toBe(0);
  });

  it('Evaluasi Prorata (12 Hari, 40 Jam, 130K Beans)', () => {
    // 12/15 * 66300 = 53040
    const res = calculateHostBonus('premium', 130000, 12, 40);
    expect(res.isProrata).toBe(true);
    expect(res.bonus).toBe(53040);
  });

  it('calculateDurationBonus returns 0 for New Host', () => {
    const res = calculateDurationBonus('new', 130000, 31, 110);
    expect(res.bonus).toBe(0);
    expect(res.qualified).toBe(false);
  });

  it('calculateDurationBonus checks minimum requirements for Premium', () => {
    const res = calculateDurationBonus('premium', 4000, 15, 40);
    expect(res.bonus).toBe(0); // < 5000 beans
    expect(res.qualified).toBe(false);
  });

  describe('Dynamic Month Days Duration Bonus (Full Day Live Tanpa Libur)', () => {
    it('Bulan 30 Hari (Contoh: April): 30 hari & 110 jam berhak bonus 30,000 Beans', () => {
      const res = calculateDurationBonus('premium', 130000, 30, 110, 30);
      expect(res.bonus).toBe(30000);
      expect(res.ruleText).toBe('30 Hari & ≥110 Jam (Tier ≥130K)');
      expect(res.qualified).toBe(true);
    });

    it('Bulan 29 Hari (Contoh: Februari Kabisat): 29 hari & 110 jam berhak bonus 30,000 Beans', () => {
      const res = calculateDurationBonus('premium', 130000, 29, 110, 29);
      expect(res.bonus).toBe(30000);
      expect(res.ruleText).toBe('29 Hari & ≥110 Jam (Tier ≥130K)');
      expect(res.qualified).toBe(true);
    });

    it('Bulan 28 Hari (Contoh: Februari Standard): 28 hari & 90 jam berhak bonus 25,000 Beans', () => {
      const res = calculateDurationBonus('premium', 130000, 28, 90, 28);
      expect(res.bonus).toBe(25000);
      expect(res.ruleText).toBe('28 Hari & ≥90 Jam (Tier ≥130K)');
      expect(res.qualified).toBe(true);
    });

    it('Bulan 31 Hari: 30 hari siaran belum mencapai Full Day Live 31 hari', () => {
      const res = calculateDurationBonus('premium', 130000, 30, 110, 31);
      expect(res.bonus).toBe(1000); // Hanya memenuhi syarat dasar >=15d & >=40h
      expect(res.ruleText).toContain('Syarat Dasar Terpenuhi');
    });
  });
});
