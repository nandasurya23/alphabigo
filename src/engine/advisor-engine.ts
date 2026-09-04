/**
 * ALPHA × BIGO HOST INCOME CALCULATOR - SMART OPPORTUNITY ADVISOR
 * Target Maximization, Beans Tier Upgrades & Duration Bonus Strategy
 * Compliant with Owner Brief: Focuses purely on Host Beans Commissions & Duration Bonuses
 */

import { HostStatus } from '@/types/calculator';

export function generateAdvisorRecommendation(
  status: HostStatus,
  beans: number,
  days: number,
  hours: number
): string {
  const safeBeans = Math.max(0, Number(beans) || 0);
  const safeDays = Math.max(0, Number(days) || 0);
  const safeHours = Math.max(0, Number(hours) || 0);

  // Kualifikasi Jam & Hari untuk Komisi Penuh (A.3.d & A.4.a)
  if (status === 'premium') {
    if (safeHours < 40) {
      const needHours = Math.round((40 - safeHours) * 10) / 10;
      return `⚠️ <strong>Peringatan Durasi Siaran:</strong> Anda baru mencapai ${safeHours} jam. Tambah <strong>+${needHours} jam lagi</strong> untuk mencapai minimal 40 jam siaran valid agar seluruh bonus komisi bulanan tidak hangus!`;
    }
    if (safeDays < 10) {
      const needDays = 10 - safeDays;
      return `⚠️ <strong>Peringatan Hari Siaran:</strong> Anda baru siaran ${safeDays} hari. Tambah minimal <strong>+${needDays} hari lagi</strong> untuk mengamankan Komisi Prorata, atau <strong>+${15 - safeDays} hari</strong> untuk memperoleh komisi penuh 100%!`;
    }
    if (safeDays < 15) {
      return `ℹ️ <strong>Status Komisi Prorata Aktif (${safeDays}/15 Hari):</strong> Anda berhak atas komisi prorata. Siarkan <strong>+${15 - safeDays} hari lagi</strong> untuk mencairkan komisi host 100% penuh!`;
    }
  }

  if (status === 'new') {
    if (safeBeans < 5000) {
      return `Target berikutnya: Capai <strong>5,000 Beans</strong> untuk menaikkan persentase bonus dari 50% menjadi <strong>85%</strong>!`;
    }
    if (safeBeans < 100000) {
      return `Target berikutnya: Capai <strong>100,000 Beans</strong> untuk mengunci persentase bonus tertinggi New Host sebesar <strong>90%</strong>!`;
    }
    if (safeBeans < 400000) {
      return `Tier 90% aktif. Bonus maksimal dibatasi hingga <strong>360,000 Beans</strong> (tercapai pada pencapaian 400,000 Beans).`;
    }
    return `Pencapaian luar biasa! Anda telah menyentuh batas atas bonus New Host sebesar <strong>360,000 Beans</strong>.`;
  }

  // Status: Premium Host (Days >= 15 & Hours >= 40)
  if (safeBeans < 5000) {
    return `Kumpulkan minimal <strong>5,000 Beans</strong> untuk membuka kelayakan Duration Bonus bulanan (+1,000 Beans)!`;
  }

  // Milestone Tiers for Premium Host
  if (safeBeans < 130000) {
    const nextBeans = 130000 - safeBeans;
    return `Peluang Naik Level: Tambah <strong>+${nextBeans.toLocaleString('en-US')} Beans</strong> untuk menembus batas Tier Persentase <strong>51%</strong>!`;
  }

  if (safeBeans >= 130000 && safeBeans < 250000) {
    return `Target berikutnya: Capai <strong>250,000 Beans</strong> untuk menaikkan bonus host dari 51% menjadi <strong>53%</strong>!`;
  }

  if (safeBeans >= 250000 && safeBeans < 500000) {
    return `Target berikutnya: Capai <strong>500,000 Beans</strong> untuk menaikkan bonus host dari 53% menjadi <strong>55%</strong>!`;
  }

  if (safeBeans >= 500000 && safeBeans < 1200000) {
    return `Target berikutnya: Capai <strong>1,200,000 Beans</strong> untuk membuka tier bonus super <strong>62%</strong>!`;
  }

  if (safeDays < 31) {
    return `Syarat dasar terpenuhi (+1,000 Beans). Siaran setiap hari hingga <strong>31 hari penuh</strong> untuk melipatgandakan Duration Bonus hingga <strong>30,000 Beans</strong>!`;
  }

  // Days === 31
  if (safeHours < 50) {
    const needH = Math.round((50 - safeHours) * 10) / 10;
    return `Hanya butuh <strong>+${needH} jam lagi</strong> untuk membuka Duration Bonus tier 50 Jam (+${safeBeans >= 10000 ? '5,000' : '2,100'} Beans)!`;
  }
  if (safeHours < 70) {
    const needH = Math.round((70 - safeHours) * 10) / 10;
    return `Hanya butuh <strong>+${needH} jam lagi</strong> untuk membuka tier Duration Bonus 70 Jam!`;
  }
  if (safeHours < 90) {
    const needH = Math.round((90 - safeHours) * 10) / 10;
    return `Hanya butuh <strong>+${needH} jam lagi</strong> untuk membuka tier Duration Bonus 90 Jam!`;
  }
  if (safeHours < 110) {
    const needH = Math.round((110 - safeHours) * 10) / 10;
    return `Tinggal <strong>+${needH} jam lagi</strong> untuk mengunci DURATION BONUS MAKSIMAL (30,000 Beans)!`;
  }

  return `Pencapaian luar biasa! Anda telah mengunci tier Duration Bonus tertinggi (31 Hari Penuh & ≥110 Jam Siaran)!`;
}
