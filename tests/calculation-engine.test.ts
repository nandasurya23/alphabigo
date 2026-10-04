import { describe, it, expect } from 'vitest';
import {
  calculateHostBonus,
  calculateNewHostExtraBonus,
  calculateDurationBonus,
  calculateEstimatedIncome,
} from '@/engine/calculation-engine';

describe('BIGO Calculation Engine - Skenario Resmi Pemilik (Policy Oktober 2026)', () => {
  it('KASUS 1 (New Host): 3.000 Beans, durasi bebas', () => {
    const res = calculateEstimatedIncome('new', 3000, 10, 20);
    expect(res.baseBeans).toBe(3000);
    expect(res.hostBonus).toBe(1350); // 45%
    expect(res.newHostExtraBonus).toBe(0); // < 5K
    expect(res.durationBonus).toBe(0); // < 20h/70j
    expect(res.totalBeans).toBe(4350);
    expect(res.idrValue).toBe(368714);
  });

  it('KASUS 1b (Old Host): 3.000 Beans, 12 Hari & 35 Jam (Gugur)', () => {
    const res = calculateEstimatedIncome('premium', 3000, 12, 35);
    expect(res.baseBeans).toBe(3000);
    expect(res.hostBonus).toBe(0); // Jam < 40 -> diskualifikasi
    expect(res.newHostExtraBonus).toBe(0);
    expect(res.durationBonus).toBe(0);
    expect(res.totalBeans).toBe(3000);
    expect(res.idrValue).toBe(254286);
  });

  it('KASUS 2 (New Host): 50.000 Beans, 12 Hari & 35 Jam', () => {
    const res = calculateEstimatedIncome('new', 50000, 12, 35);
    expect(res.baseBeans).toBe(50000);
    expect(res.hostBonus).toBe(24000); // 48% (Bebas durasi di Tabel A)
    expect(res.newHostExtraBonus).toBe(15000); // Tier 50K-69.9K
    expect(res.durationBonus).toBe(0); // Syarat 20h/70j belum terpenuhi
    expect(res.totalBeans).toBe(89000);
    expect(res.idrValue).toBe(7543810);
  });

  it('KASUS 2b (Old Host): 50.000 Beans, 12 Hari & 35 Jam (Gugur)', () => {
    const res = calculateEstimatedIncome('premium', 50000, 12, 35);
    expect(res.baseBeans).toBe(50000);
    expect(res.hostBonus).toBe(0); // Jam < 40 -> diskualifikasi
    expect(res.newHostExtraBonus).toBe(0);
    expect(res.durationBonus).toBe(0);
    expect(res.totalBeans).toBe(50000);
    expect(res.idrValue).toBe(4238095);
  });

  it('KASUS 3 (New Host): 50.000 Beans, 15 Hari & 40 Jam', () => {
    const res = calculateEstimatedIncome('new', 50000, 15, 40);
    expect(res.baseBeans).toBe(50000);
    expect(res.hostBonus).toBe(24000);
    expect(res.newHostExtraBonus).toBe(15000);
    expect(res.durationBonus).toBe(0); // Belum 20 Hari & 70 Jam
    expect(res.totalBeans).toBe(89000);
    expect(res.idrValue).toBe(7543810);
  });

  it('KASUS 3b (Old Host): 50.000 Beans, 15 Hari & 40 Jam', () => {
    const res = calculateEstimatedIncome('premium', 50000, 15, 40);
    expect(res.baseBeans).toBe(50000);
    expect(res.hostBonus).toBe(24000); // 48%
    expect(res.newHostExtraBonus).toBe(0);
    expect(res.durationBonus).toBe(0); // Belum 20 Hari & 70 Jam
    expect(res.totalBeans).toBe(74000);
    expect(res.idrValue).toBe(6272381);
  });

  it('KASUS 4 (New Host): 50.000 Beans, 20 Hari & 75 Jam (Mendapatkan Tier 30K-69.9K)', () => {
    const res = calculateEstimatedIncome('new', 50000, 20, 75);
    expect(res.baseBeans).toBe(50000);
    expect(res.hostBonus).toBe(24000);
    expect(res.newHostExtraBonus).toBe(15000);
    expect(res.durationBonus).toBe(2300); // Aturan baru: New Host berhak atas tier Beans yang dicapai (2.300)
    expect(res.totalBeans).toBe(91300);
    expect(res.idrValue).toBe(7738762);
  });

  it('KASUS 4b (Old Host): 50.000 Beans, 20 Hari & 75 Jam', () => {
    const res = calculateEstimatedIncome('premium', 50000, 20, 75);
    expect(res.baseBeans).toBe(50000);
    expect(res.hostBonus).toBe(24000);
    expect(res.newHostExtraBonus).toBe(0);
    expect(res.durationBonus).toBe(2300); // Old Host Tier 30K-69.9K (20h/70j)
    expect(res.totalBeans).toBe(76300);
    expect(res.idrValue).toBe(6467333);
  });

  it('KASUS 5 (New Host): 200.000 Beans, 31 Hari & 115 Jam (Mendapatkan Tier >=200K)', () => {
    const res = calculateEstimatedIncome('new', 200000, 31, 115, 31);
    expect(res.baseBeans).toBe(200000);
    expect(res.hostBonus).toBe(104000); // 52%
    expect(res.newHostExtraBonus).toBe(65000); // Tier 200K-299.9K
    expect(res.durationBonus).toBe(30000); // Aturan baru: New Host berhak hingga 30.000 Beans
    expect(res.totalBeans).toBe(399000);
    expect(res.idrValue).toBe(33820000);
  });

  it('KASUS 5b (Old Host): 200.000 Beans, 31 Hari & 115 Jam', () => {
    const res = calculateEstimatedIncome('premium', 200000, 31, 115, 31);
    expect(res.baseBeans).toBe(200000);
    expect(res.hostBonus).toBe(104000); // 52%
    expect(res.newHostExtraBonus).toBe(0);
    expect(res.durationBonus).toBe(30000); // Old Host Tier >=200K Column 3
    expect(res.totalBeans).toBe(334000);
    expect(res.idrValue).toBe(28310476);
  });
});

describe('BIGO Calculation Engine - Tabel A Persentase Seragam (45% s/d 76%)', () => {
  it('TC-T1: 2.000 Beans (45%)', () => {
    const res = calculateHostBonus('premium', 2000, 15, 40);
    expect(res.bonus).toBe(900);
    expect(res.ruleText).toBe('2.000 Beans x 45% = 900 Beans');
  });

  it('TC-T2: 10.000 Beans (46.5%) - Presisi .5%', () => {
    const res = calculateHostBonus('premium', 10000, 15, 40);
    expect(res.bonus).toBe(4650);
    expect(res.ruleText).toBe('10.000 Beans x 46.5% = 4.650 Beans');
  });

  it('TC-T2b: 30.000 Beans (47.5%) - Presisi .5%', () => {
    const res = calculateHostBonus('premium', 30000, 15, 40);
    expect(res.bonus).toBe(14250);
    expect(res.ruleText).toBe('30.000 Beans x 47.5% = 14.250 Beans');
  });

  it('TC-T3: 70.000 Beans (50%)', () => {
    const res = calculateHostBonus('premium', 70000, 15, 40);
    expect(res.bonus).toBe(35000);
    expect(res.ruleText).toBe('70.000 Beans x 50% = 35.000 Beans');
  });

  it('TC-T4: 100.000 Beans (50.5%) - Kasus Revisi Owner (Bukan 51%)', () => {
    const res = calculateHostBonus('new', 100000, 15, 40, 1);
    expect(res.bonus).toBe(50500);
    expect(res.ruleText).toBe('100.000 Beans x 50.5% = 50.500 Beans');
    expect(res.ruleText).not.toContain('51%');
  });

  it('TC-T4b: 100.000 Beans Prorata (50.5%) - Presisi pada Prorata', () => {
    const res = calculateHostBonus('premium', 100000, 10, 40);
    expect(res.isProrata).toBe(true);
    expect(res.ruleText).toContain('100.000 Beans x 50.5% =');
    expect(res.ruleText).not.toContain('51%');
  });

  it('TC-T4c: 7.000.000 Beans (75.5%) - Presisi .5%', () => {
    const res = calculateHostBonus('premium', 7000000, 15, 40);
    expect(res.bonus).toBe(5285000);
    expect(res.ruleText).toBe('7.000.000 Beans x 75.5% = 5.285.000 Beans');
    expect(res.ruleText).not.toContain('76%');
  });

  it('TC-T5: 300.000 Beans (54%)', () => {
    const res = calculateHostBonus('premium', 300000, 15, 40);
    expect(res.bonus).toBe(162000);
    expect(res.ruleText).toBe('300.000 Beans x 54% = 162.000 Beans');
  });

  it('TC-T6: 400.000 Beans (55%)', () => {
    const res = calculateHostBonus('premium', 400000, 15, 40);
    expect(res.bonus).toBe(220000);
    expect(res.ruleText).toBe('400.000 Beans x 55% = 220.000 Beans');
  });

  it('TC-T7: 600.000 Beans (57%)', () => {
    const res = calculateHostBonus('premium', 600000, 15, 40);
    expect(res.bonus).toBe(342000);
    expect(res.ruleText).toBe('600.000 Beans x 57% = 342.000 Beans');
  });

  it('TC-T8: 850.000 Beans (59%)', () => {
    const res = calculateHostBonus('premium', 850000, 15, 40);
    expect(res.bonus).toBe(501500);
  });

  it('TC-T9: 1.000.000 Beans (61%)', () => {
    const res = calculateHostBonus('premium', 1000000, 15, 40);
    expect(res.bonus).toBe(610000);
  });

  it('TC-T10: 1.200.000 Beans (62%)', () => {
    const res = calculateHostBonus('premium', 1200000, 15, 40);
    expect(res.bonus).toBe(744000);
  });

  it('TC-T11: 2.300.000 Beans (68%)', () => {
    const res = calculateHostBonus('premium', 2300000, 15, 40);
    expect(res.bonus).toBe(1564000);
  });

  it('TC-T12: 3.500.000 Beans (72%)', () => {
    const res = calculateHostBonus('premium', 3500000, 15, 40);
    expect(res.bonus).toBe(2520000);
  });

  it('TC-T13: 5.000.000 Beans (75%)', () => {
    const res = calculateHostBonus('premium', 5000000, 15, 40);
    expect(res.bonus).toBe(3750000);
  });

  it('TC-T14: 9.000.000 Beans (76%)', () => {
    const res = calculateHostBonus('premium', 9000000, 15, 40);
    expect(res.bonus).toBe(6840000);
    expect(res.ruleText).toBe('9.000.000 Beans x 76% = 6.840.000 Beans');
  });
});

describe('BIGO Calculation Engine - Extra Bonus New Host', () => {
  it('Target < 5K tidak mendapatkan Extra Bonus New Host', () => {
    const res = calculateNewHostExtraBonus('new', 4500);
    expect(res.bonus).toBe(0);
    expect(res.qualified).toBe(false);
  });

  it('Tier 5K-9.9K: +1.000 Beans', () => {
    const res = calculateNewHostExtraBonus('new', 5000);
    expect(res.bonus).toBe(1000);
    expect(res.qualified).toBe(true);
  });

  it('Tier 10K-19.9K: +2.500 Beans', () => {
    const res = calculateNewHostExtraBonus('new', 15000);
    expect(res.bonus).toBe(2500);
  });

  it('Tier 20K-29.9K: +5.200 Beans', () => {
    const res = calculateNewHostExtraBonus('new', 25000);
    expect(res.bonus).toBe(5200);
  });

  it('Tier 30K-49.9K: +8.500 Beans', () => {
    const res = calculateNewHostExtraBonus('new', 35000);
    expect(res.bonus).toBe(8500);
  });

  it('Tier 50K-69.9K: +15.000 Beans', () => {
    const res = calculateNewHostExtraBonus('new', 60000);
    expect(res.bonus).toBe(15000);
  });

  it('Tier 70K-99.9K: +20.000 Beans', () => {
    const res = calculateNewHostExtraBonus('new', 80000);
    expect(res.bonus).toBe(20000);
  });

  it('Tier 100K-199.9K: +32.000 Beans', () => {
    const res = calculateNewHostExtraBonus('new', 150000);
    expect(res.bonus).toBe(32000);
  });

  it('Tier 200K-299.9K: +65.000 Beans', () => {
    const res = calculateNewHostExtraBonus('new', 250000);
    expect(res.bonus).toBe(65000);
  });

  it('Tier 300K-399.9K: +95.000 Beans', () => {
    const res = calculateNewHostExtraBonus('new', 350000);
    expect(res.bonus).toBe(95000);
  });

  it('Tier 400K-599.9K: +120.000 Beans', () => {
    const res = calculateNewHostExtraBonus('new', 500000);
    expect(res.bonus).toBe(120000);
  });

  it('Target >= 600K tidak ada Extra Bonus New Host', () => {
    const res = calculateNewHostExtraBonus('new', 600000);
    expect(res.bonus).toBe(0);
    expect(res.qualified).toBe(false);
  });

  it('Old Host selalu 0 Extra Bonus New Host', () => {
    const res = calculateNewHostExtraBonus('premium', 50000);
    expect(res.bonus).toBe(0);
    expect(res.qualified).toBe(false);
  });
});


describe('BIGO Calculation Engine - Duration Bonus Matriks', () => {
  it('Durasi kurang dari 20 hari atau 70 jam -> 0 Beans', () => {
    const res1 = calculateDurationBonus('premium', 100000, 19, 110);
    expect(res1.bonus).toBe(0);
    expect(res1.qualified).toBe(false);

    const res2 = calculateDurationBonus('premium', 100000, 25, 69.5);
    expect(res2.bonus).toBe(0);
    expect(res2.qualified).toBe(false);
  });

  it('Matriks 25 Hari & 90 Jam (Old Host berbagai tier Beans)', () => {
    // 5K-9.9K -> 1.700
    expect(calculateDurationBonus('premium', 8000, 25, 90).bonus).toBe(1700);
    // 10K-29.9K -> 3.100
    expect(calculateDurationBonus('premium', 20000, 25, 90).bonus).toBe(3100);
    // 30K-69.9K -> 3.400
    expect(calculateDurationBonus('premium', 50000, 25, 90).bonus).toBe(3400);
    // 70K-199.9K -> 3.800
    expect(calculateDurationBonus('premium', 100000, 25, 90).bonus).toBe(3800);
    // >=200K -> 4.500
    expect(calculateDurationBonus('premium', 300000, 25, 90).bonus).toBe(4500);
  });

  it('Matriks Full Live & 110 Jam (Old Host berbagai tier Beans)', () => {
    expect(calculateDurationBonus('premium', 8000, 31, 110, 31).bonus).toBe(2100);
    expect(calculateDurationBonus('premium', 20000, 31, 110, 31).bonus).toBe(7500);
    expect(calculateDurationBonus('premium', 50000, 31, 110, 31).bonus).toBe(15000);
    expect(calculateDurationBonus('premium', 100000, 31, 110, 31).bonus).toBe(20000);
    expect(calculateDurationBonus('premium', 300000, 31, 110, 31).bonus).toBe(30000);
  });

  it('New Host mendapatkan Duration Bonus sesuai tingkat Beans (hingga 30.000 Beans)', () => {
    // 3.000 Beans (Tier 1: 2,000 - 4,999 Beans)
    expect(calculateDurationBonus('new', 3000, 20, 70).bonus).toBe(200);
    expect(calculateDurationBonus('new', 3000, 25, 90).bonus).toBe(500);
    expect(calculateDurationBonus('new', 3000, 31, 110, 31).bonus).toBe(800);

    // 50.000 Beans (Tier 30K - 69.9K Beans) -> Mendapatkan 2.300 / 3.400 / 15.000
    expect(calculateDurationBonus('new', 50000, 20, 70).bonus).toBe(2300);
    expect(calculateDurationBonus('new', 50000, 25, 90).bonus).toBe(3400);
    expect(calculateDurationBonus('new', 50000, 31, 110, 31).bonus).toBe(15000);

    // 200.000 Beans / 500.000 Beans (Tier >= 200K Beans) -> Mendapatkan hingga 30.000 Beans
    expect(calculateDurationBonus('new', 200000, 20, 70).bonus).toBe(2700);
    expect(calculateDurationBonus('new', 200000, 25, 90).bonus).toBe(4500);
    expect(calculateDurationBonus('new', 200000, 31, 110, 31).bonus).toBe(30000);
    expect(calculateDurationBonus('new', 500000, 31, 110, 31).bonus).toBe(30000);
  });

  it('Bulan 30 Hari (Contoh: April): 30 hari & 110 jam memenuhi kolom Full Live', () => {
    const res = calculateDurationBonus('premium', 200000, 30, 110, 30);
    expect(res.bonus).toBe(30000);
    expect(res.qualified).toBe(true);
  });

  it('Bulan 29 Hari (Contoh: Februari Kabisat): 29 hari & 110 jam memenuhi kolom Full Live', () => {
    const res = calculateDurationBonus('premium', 200000, 29, 110, 29);
    expect(res.bonus).toBe(30000);
    expect(res.qualified).toBe(true);
  });

  it('Bulan 28 Hari (Februari Biasa): 28 hari & 110 jam memenuhi kolom Full Live', () => {
    const res = calculateDurationBonus('premium', 200000, 28, 110, 28);
    expect(res.bonus).toBe(30000);
    expect(res.qualified).toBe(true);
  });

  it('Kasus Nyata Host: 30 Hari & 110 Jam di September (30 Hari) vs Oktober (31 Hari)', () => {
    // Di September (30 Hari): 30 hari adalah Full Live -> dapat Tier 3 (30.000 Beans)
    const septRes = calculateDurationBonus('premium', 200000, 30, 110, 30);
    expect(septRes.bonus).toBe(30000);
    expect(septRes.ruleText).toContain('30 Hari & ≥110 Jam');

    // Di Oktober (31 Hari): 30 hari BUKAN Full Live -> masuk Kolom 2 (25 Hari & ≥90 Jam -> 4.500 Beans)
    const octRes = calculateDurationBonus('premium', 200000, 30, 110, 31);
    expect(octRes.bonus).toBe(4500);
    expect(octRes.ruleText).toContain('25 Hari & ≥90 Jam');
  });
});

describe('BIGO Calculation Engine - Boundaries & Prorata', () => {
  it('Evaluasi Prorata Old Host: 130.000 Beans, 12 Hari, 40 Jam', () => {
    // 130.000 * 50.5% = 65.650 -> (12 / 15) * 65.650 = 52.520 Beans
    const res = calculateHostBonus('premium', 130000, 12, 40);
    expect(res.isProrata).toBe(true);
    expect(res.bonus).toBe(52520);
  });

  it('Input Hari Negatif di-clamp ke 0 (Disqualified)', () => {
    const res = calculateEstimatedIncome('premium', 130000, -5, 40);
    expect(res.hostBonus).toBe(0);
  });

  it('Input Jam Melebihi 155 di-clamp ke 155', () => {
    const res = calculateEstimatedIncome('premium', 200000, 31, 180, 31);
    expect(res.durationBonus).toBe(30000);
  });

  it('Input Beans 0', () => {
    const res = calculateEstimatedIncome('premium', 0, 15, 40);
    expect(res.totalBeans).toBe(0);
    expect(res.idrValue).toBe(0);
    expect(res.usdValue).toBe(0);
  });
});

describe('BIGO Calculation Engine - New Host Bulan 1 vs Bulan 2-3 Tenure & Prorata', () => {
  it('New Host Bulan 1: Bebas durasi & hari, Host Bonus & Extra Bonus cair penuh', () => {
    // 50K Beans, 0 Hari & 0 Jam (Bulan 1)
    const res = calculateEstimatedIncome('new', 50000, 0, 0, 31, 1);
    expect(res.baseBeans).toBe(50000);
    expect(res.hostBonus).toBe(24000); // 48% (bebas durasi di Bulan 1)
    expect(res.hostBonusQualified).toBe(true);
    expect(res.isProrata).toBe(false);
    expect(res.newHostExtraBonus).toBe(15000); // Tier 50K-69.9K
    expect(res.durationBonus).toBe(0); // 0 jam < 70 jam
    expect(res.totalBeans).toBe(89000);
  });

  it('New Host Bulan 1: Tetap dapat Duration Bonus jika input memenuhi 20 Hari & 70 Jam', () => {
    // 3.000 Beans -> Tier 1 (200 Beans)
    const resLow = calculateEstimatedIncome('new', 3000, 20, 70, 31, 1);
    expect(resLow.durationBonus).toBe(200);
    expect(resLow.durationQualified).toBe(true);

    // 50.000 Beans -> Tier 30K-69.9K (2.300 Beans)
    const resHigh = calculateEstimatedIncome('new', 50000, 20, 70, 31, 1);
    expect(resHigh.hostBonus).toBe(24000);
    expect(resHigh.newHostExtraBonus).toBe(15000);
    expect(resHigh.durationBonus).toBe(2300); // Aturan baru: Tier 30K-69.9K
    expect(resHigh.durationQualified).toBe(true);
    expect(resHigh.totalBeans).toBe(91300);
  });

  it('New Host Bulan 2-3: Belum memenuhi syarat jika 0 Hari & 0 Jam (Host Bonus 0, Extra Bonus tetap cair)', () => {
    const res = calculateEstimatedIncome('new', 50000, 0, 0, 31, 2);
    expect(res.baseBeans).toBe(50000);
    expect(res.hostBonus).toBe(0); // Wajib min 10 hari & 40 jam
    expect(res.hostBonusQualified).toBe(false);
    expect(res.newHostExtraBonus).toBe(15000); // Extra bonus berlaku selama 90 hari pertama
    expect(res.durationBonus).toBe(0);
    expect(res.totalBeans).toBe(65000); // 50K + 0 + 15K + 0
  });

  it('New Host Bulan 2-3: Gugur jika hari < 10 meskipun jam >= 40', () => {
    const res = calculateEstimatedIncome('new', 50000, 9, 45, 31, 2);
    expect(res.hostBonus).toBe(0);
    expect(res.hostBonusQualified).toBe(false);
    expect(res.newHostExtraBonus).toBe(15000);
  });

  it('New Host Bulan 2-3: Gugur jika jam < 40 meskipun hari >= 15', () => {
    const res = calculateEstimatedIncome('new', 50000, 15, 38, 31, 2);
    expect(res.hostBonus).toBe(0);
    expect(res.hostBonusQualified).toBe(false);
    expect(res.newHostExtraBonus).toBe(15000);
  });

  it('New Host Bulan 2-3: Berhak komisi prorata jika 10-14 Hari & >= 40 Jam (10 Hari)', () => {
    // 50K Beans @ 48% = 24.000 -> (10 / 15) * 24.000 = 16.000 Beans
    const res = calculateEstimatedIncome('new', 50000, 10, 40, 31, 2);
    expect(res.hostBonus).toBe(16000);
    expect(res.hostBonusQualified).toBe(true);
    expect(res.isProrata).toBe(true);
    expect(res.newHostExtraBonus).toBe(15000);
    expect(res.totalBeans).toBe(81000); // 50K + 16K + 15K
  });

  it('New Host Bulan 2-3: Berhak komisi prorata jika 12 Hari & >= 40 Jam (12 Hari)', () => {
    // 50K Beans @ 48% = 24.000 -> (12 / 15) * 24.000 = 19.200 Beans
    const res = calculateEstimatedIncome('new', 50000, 12, 40, 31, 2);
    expect(res.hostBonus).toBe(19200);
    expect(res.hostBonusQualified).toBe(true);
    expect(res.isProrata).toBe(true);
    expect(res.newHostExtraBonus).toBe(15000);
    expect(res.totalBeans).toBe(84200); // 50K + 19.2K + 15K
  });

  it('New Host Bulan 2-3: Memenuhi 15 Hari & 40 Jam berhak 100% Host Bonus', () => {
    const res = calculateEstimatedIncome('new', 50000, 15, 40, 31, 2);
    expect(res.hostBonus).toBe(24000);
    expect(res.hostBonusQualified).toBe(true);
    expect(res.isProrata).toBe(false);
    expect(res.newHostExtraBonus).toBe(15000);
    expect(res.totalBeans).toBe(89000);
  });
});

