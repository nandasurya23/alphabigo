/**
 * ALPHA × BIGO HOST INCOME CALCULATOR - SMART OPPORTUNITY ADVISOR
 * Target Maximization, Beans Tier Upgrades & Duration Bonus Strategy
 * Compliant with October 2026 Official Policy
 */

import { HostStatus } from '@/types/calculator';

export function generateAdvisorRecommendation(
  status: HostStatus,
  beans: number,
  days: number,
  hours: number,
  daysInMonth: number = 30
): string {
  const fullMonthDays = daysInMonth || 30;
  const safeBeans = Math.max(0, Number(beans) || 0);
  const safeDays = Math.max(0, Number(days) || 0);
  const safeHours = Math.max(0, Number(hours) || 0);

  // 1. Kualifikasi Durasi untuk Old Host di Tabel A
  if (status === 'premium') {
    if (safeHours < 40) {
      const needHours = Math.round((40 - safeHours) * 10) / 10;
      return `⚠️ <strong>Peringatan Durasi Siaran:</strong> Anda baru mencapai ${safeHours} jam. Tambah <strong>+${needHours} jam lagi</strong> untuk mencapai minimal 40 jam siaran valid agar komisi pokok bulanan dapat dicairkan!`;
    }
    if (safeDays < 10) {
      const needDays = 10 - safeDays;
      return `⚠️ <strong>Peringatan Hari Siaran:</strong> Anda baru siaran ${safeDays} hari. Tambah minimal <strong>+${needDays} hari lagi</strong> untuk mengamankan Komisi Prorata, atau <strong>+${15 - safeDays} hari</strong> untuk memperoleh komisi penuh 100%!`;
    }
    if (safeDays < 15) {
      return `ℹ️ <strong>Status Komisi Prorata Aktif (${safeDays}/15 Hari):</strong> Anda berhak atas komisi prorata. Siarkan <strong>+${15 - safeDays} hari lagi</strong> untuk mencairkan komisi host 100% penuh!`;
    }
  }

  // 2. Rekomendasi Khusus New Host (Extra Bonus New Host)
  if (status === 'new') {
    if (safeBeans < 2000) {
      return `Kumpulkan minimal <strong>2,000 Beans</strong> untuk membuka komisi dasar 45% (Bebas jam & hari siaran di bulan pertama)!`;
    }
    if (safeBeans < 5000) {
      return `Peluang Extra Bonus: Capai <strong>5,000 Beans</strong> untuk membuka Extra Bonus New Host (+1,000 Beans) dan naik ke tier <strong>46%</strong>!`;
    }
    if (safeBeans < 10000) {
      return `Target berikutnya: Capai <strong>10,000 Beans</strong> untuk menaikkan Extra Bonus New Host menjadi <strong>+2,500 Beans</strong> (Tier 46.5%)!`;
    }
    if (safeBeans < 50000) {
      return `Target berikutnya: Capai <strong>50,000 Beans</strong> untuk klaim Extra Bonus New Host <strong>+15,000 Beans</strong> (Tier 48%)!`;
    }
    if (safeBeans < 100000) {
      return `Target berikutnya: Capai <strong>100,000 Beans</strong> untuk klaim Extra Bonus New Host <strong>+32,000 Beans</strong> (Tier 50.5%)!`;
    }
    if (safeBeans < 400000) {
      return `Peluang Emas: Capai <strong>400,000 Beans</strong> untuk mengunci Extra Bonus New Host maksimal sebesar <strong>+120,000 Beans</strong> (Tier 55%)!`;
    }
  }


  // 3. Strategi Duration Bonus (Tabel C: 20h/70j, 25h/90j, 31h/110j)
  if (safeDays < 20 || safeHours < 70) {
    const needDays = Math.max(0, 20 - safeDays);
    const needHours = Math.max(0, Math.round((70 - safeHours) * 10) / 10);
    return `Tingkatkan durasi siaran: Capai minimal <strong>20 Hari & 70 Jam</strong> (${needDays > 0 ? `+${needDays} hari, ` : ''}+${needHours} jam lagi) untuk membuka Duration Bonus bulanan!`;
  }

  if (safeDays < 25 || safeHours < 90) {
    const needDays = Math.max(0, 25 - safeDays);
    const needHours = Math.max(0, Math.round((90 - safeHours) * 10) / 10);
    return `Peluang Upgrade Duration Bonus: Capai <strong>25 Hari & 90 Jam</strong> (${needDays > 0 ? `+${needDays} hari, ` : ''}+${needHours} jam lagi) untuk menaikkan bonus durasi!`;
  }

  if (safeDays < fullMonthDays || safeHours < 110) {
    const needDays = Math.max(0, fullMonthDays - safeDays);
    const needHours = Math.max(0, Math.round((110 - safeHours) * 10) / 10);
    return `Tinggal sedikit lagi: Siaran hingga <strong>${fullMonthDays} Hari Penuh & 110 Jam</strong> (${needDays > 0 ? `+${needDays} hari, ` : ''}+${needHours} jam lagi) untuk mengunci DURATION BONUS MAKSIMAL!`;
  }

  return `Pencapaian luar biasa! Anda telah mengunci tier Duration Bonus tertinggi (${fullMonthDays} Hari Penuh & ≥110 Jam Siaran)!`;
}

