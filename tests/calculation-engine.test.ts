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

  it('KASUS 4 (New Host): 50.000 Beans, 20 Hari & 75 Jam', () => {
    const res = calculateEstimatedIncome('new', 50000, 20, 75);
    expect(res.baseBeans).toBe(50000);
    expect(res.hostBonus).toBe(24000);
    expect(res.newHostExtraBonus).toBe(15000);
    expect(res.durationBonus).toBe(200); // New Host locked at Tier 1 (20h/70j)
    expect(res.totalBeans).toBe(89200);
    expect(res.idrValue).toBe(7560762);
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


  it('KASUS 5 (New Host): 200.000 Beans, 31 Hari & 115 Jam', () => {
    const res = calculateEstimatedIncome('new', 200000, 31, 115, 31);
    expect(res.baseBeans).toBe(200000);
    expect(res.hostBonus).toBe(104000); // 52%
    expect(res.newHostExtraBonus).toBe(65000); // Tier 200K-299.9K
    expect(res.durationBonus).toBe(800); // New Host Tier 1 Column 3
    expect(res.totalBeans).toBe(369800);
    expect(res.idrValue).toBe(31344952);
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
  });

  it('TC-T2: 10.000 Beans (46.5%)', () => {
    const res = calculateHostBonus('premium', 10000, 15, 40);
    expect(res.bonus).toBe(4650);
  });

  it('TC-T3: 70.000 Beans (50%)', () => {
    const res = calculateHostBonus('premium', 70000, 15, 40);
    expect(res.bonus).toBe(35000);
  });

  it('TC-T4: 100.000 Beans (50.5%)', () => {
    const res = calculateHostBonus('premium', 100000, 15, 40);
    expect(res.bonus).toBe(50500);
  });

  it('TC-T5: 300.000 Beans (54%)', () => {
    const res = calculateHostBonus('premium', 300000, 15, 40);
    expect(res.bonus).toBe(162000);
  });

  it('TC-T6: 400.000 Beans (55%)', () => {
    const res = calculateHostBonus('premium', 400000, 15, 40);
    expect(res.bonus).toBe(220000);
  });

  it('TC-T7: 600.000 Beans (57%)', () => {
    const res = calculateHostBonus('premium', 600000, 15, 40);
    expect(res.bonus).toBe(342000);
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

  it('New Host selalu terkunci pada Tier 1 di semua tingkat Beans', () => {
    // 20h & 70j -> 200
    expect(calculateDurationBonus('new', 3000, 20, 70).bonus).toBe(200);
    expect(calculateDurationBonus('new', 500000, 20, 70).bonus).toBe(200);

    // 25h & 90j -> 500
    expect(calculateDurationBonus('new', 3000, 25, 90).bonus).toBe(500);
    expect(calculateDurationBonus('new', 500000, 25, 90).bonus).toBe(500);

    // 31h & 110j -> 800
    expect(calculateDurationBonus('new', 3000, 31, 110, 31).bonus).toBe(800);
    expect(calculateDurationBonus('new', 500000, 31, 110, 31).bonus).toBe(800);
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
