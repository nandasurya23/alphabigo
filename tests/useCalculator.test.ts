// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCalculator } from '@/hooks/useCalculator';

describe('useCalculator Hook - Initial Zero/Unselected & Deferred Calculation', () => {
  it('TC-UI-01: Inisialisasi awal input dan dropdown bernilai 0 / belum dipilih', () => {
    const { result } = renderHook(() => useCalculator());

    expect(result.current.status).toBe('');
    expect(result.current.beans).toBe(0);
    expect(result.current.days).toBe(0);
    expect(result.current.hours).toBe(0);
    expect(result.current.isCalculated).toBe(false);

    // Hasil perhitungan awal wajib 0
    expect(result.current.result.tierName).toBe('Menunggu Kalkulasi');
    expect(result.current.result.totalBeans).toBe(0);
    expect(result.current.result.idrValue).toBe(0);
    expect(result.current.result.usdValue).toBe(0);
  });

  it('TC-UI-02 & TC-UI-03: Kalkulasi aktif setelah status dipilih dan calculate() dipanggil', () => {
    const { result } = renderHook(() => useCalculator());

    // Pilih status dan masukkan parameter
    act(() => {
      result.current.setStatus('premium');
      result.current.setBeans(130000);
      result.current.setDays(15);
      result.current.setHours(40);
    });

    // Panggil aksi calculate (simulasi klik tombol CALCULATE NOW)
    act(() => {
      result.current.calculate();
    });

    expect(result.current.isCalculated).toBe(true);
    expect(result.current.result.tierName).toBe('Old Host: 50.5% (100K – 199.9K Beans)');
    expect(result.current.result.baseBeans).toBe(130000);
    expect(result.current.result.hostBonus).toBe(65650);
    expect(result.current.result.durationBonus).toBe(0);
    expect(result.current.result.totalBeans).toBe(195650);
    expect(result.current.result.idrValue).toBe(16583667);
  });

  it('TC-UI-04: Mengubah input membutuhkan eksekusi calculate() untuk memperbarui hasil estimasi', () => {
    const { result } = renderHook(() => useCalculator());

    // Setup dan hitung
    act(() => {
      result.current.setStatus('premium');
      result.current.setBeans(130000);
      result.current.setDays(15);
      result.current.setHours(40);
      result.current.calculate();
    });
    expect(result.current.isCalculated).toBe(true);
    expect(result.current.result.totalBeans).toBe(195650);

    // Ubah target beans (tidak otomatis real-time sebelum calculate ditekan)
    act(() => {
      result.current.setBeans(200000);
    });

    // Hasil perhitungan lama tetap stabil sebelum tombol calculate ditekan
    expect(result.current.result.baseBeans).toBe(130000);

    // Eksekusi calculate dengan nilai baru
    act(() => {
      result.current.calculate();
    });
    expect(result.current.isCalculated).toBe(true);
    expect(result.current.result.baseBeans).toBe(200000);
    expect(result.current.result.hostBonus).toBe(104000); // 52% of 200,000
    expect(result.current.result.totalBeans).toBe(304000);
  });

  it('TC-UI-05: Reset Parameter Standar mengembalikan form ke 0 dan mereset estimasi ke 0', () => {
    const { result } = renderHook(() => useCalculator());

    // Ubah ke New Host dan ubah angka
    act(() => {
      result.current.setStatus('new');
      result.current.setBeans(50000);
      result.current.calculate();
    });

    expect(result.current.status).toBe('new');
    expect(result.current.isCalculated).toBe(true);

    // Panggil resetToStandard
    act(() => {
      result.current.resetToStandard();
    });

    expect(result.current.status).toBe('');
    expect(result.current.beans).toBe(0);
    expect(result.current.days).toBe(0);
    expect(result.current.hours).toBe(0);
    expect(result.current.isCalculated).toBe(false);
    expect(result.current.result.totalBeans).toBe(0);
    expect(result.current.result.idrValue).toBe(0);
  });

  it('TC-UI-06: useCalculator otomatis menyediakan daysInMonth dan monthName realtime', () => {
    const { result } = renderHook(() => useCalculator());

    expect(typeof result.current.daysInMonth).toBe('number');
    expect(result.current.daysInMonth).toBeGreaterThanOrEqual(28);
    expect(result.current.daysInMonth).toBeLessThanOrEqual(31);
    expect(typeof result.current.monthName).toBe('string');
    expect(result.current.monthName.length).toBeGreaterThan(0);
  });

  it('TC-UI-07: newHostMonth default adalah 1 dan dapat diubah ke 2 (Bulan 2-3)', () => {
    const { result } = renderHook(() => useCalculator());

    expect(result.current.newHostMonth).toBe(1);

    act(() => {
      result.current.setStatus('new');
      result.current.setBeans(50000);
      result.current.setNewHostMonth(2);
    });

    expect(result.current.newHostMonth).toBe(2);

    // Hitung kalkulasi dengan Bulan 2 & 0 hari/jam -> bonus host gugur
    act(() => {
      result.current.calculate();
    });

    expect(result.current.isCalculated).toBe(true);
    expect(result.current.result.hostBonusQualified).toBe(false);
    expect(result.current.result.hostBonus).toBe(0);
    expect(result.current.result.newHostExtraBonus).toBe(15000);

    // Ganti kembali ke Bulan 1 dan calculate -> bonus host cair penuh
    act(() => {
      result.current.setNewHostMonth(1);
      result.current.calculate();
    });

    expect(result.current.newHostMonth).toBe(1);
    expect(result.current.result.hostBonusQualified).toBe(true);
    expect(result.current.result.hostBonus).toBe(24000);

    // Reset mengembalikan newHostMonth ke 1
    act(() => {
      result.current.resetToStandard();
    });

    expect(result.current.newHostMonth).toBe(1);
  });

  it('TC-UI-08: Target Month default terdefinisi dan dapat diubah secara dinamis', () => {
    const { result } = renderHook(() => useCalculator());

    expect(result.current.targetMonth).toBeDefined();
    expect(result.current.targetMonth.monthName).toBe(result.current.monthName);
    expect(result.current.targetMonth.daysInMonth).toBe(result.current.daysInMonth);

    // Ganti ke September (Index 8, 30 Hari)
    act(() => {
      result.current.setTargetMonthIndex(8, 2026);
    });

    expect(result.current.targetMonth.monthIndex).toBe(8);
    expect(result.current.targetMonth.monthName).toBe('September');
    expect(result.current.targetMonth.daysInMonth).toBe(30);
    expect(result.current.daysInMonth).toBe(30);

    // Ganti ke Februari (Index 1, 28 Hari pada tahun 2026)
    act(() => {
      result.current.setTargetMonthIndex(1, 2026);
    });

    expect(result.current.targetMonth.monthName).toBe('Februari');
    expect(result.current.targetMonth.daysInMonth).toBe(28);
    expect(result.current.daysInMonth).toBe(28);
  });

  it('TC-UI-09: Mengubah bulan target menyesuaikan clamping hari dan kalkulasi duration bonus', () => {
    const { result } = renderHook(() => useCalculator());

    // Set ke Oktober (Index 9, 31 Hari), 31 Hari siaran, 110 Jam
    act(() => {
      result.current.setTargetMonthIndex(9, 2026);
      result.current.setStatus('premium');
      result.current.setBeans(200000);
      result.current.setDays(31);
      result.current.setHours(110);
      result.current.calculate();
    });

    expect(result.current.result.durationBonus).toBe(30000); // 31 Hari di Oktober = Full Live

    // Ganti ke September (Index 8, 30 Hari). Hari otomatis ter-clamp dari 31 ke 30.
    act(() => {
      result.current.setTargetMonthIndex(8, 2026);
    });

    expect(result.current.days).toBe(30);

    // Kalkulasi ulang untuk September: 30 Hari di September = Full Live (30.000 Beans)
    act(() => {
      result.current.calculate();
    });

    expect(result.current.result.durationBonus).toBe(30000);
  });
});


