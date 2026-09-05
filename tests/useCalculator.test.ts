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
    expect(result.current.result.tierName).toBe('Premium: 51% (130K - 149.9K Beans)');
    expect(result.current.result.baseBeans).toBe(130000);
    expect(result.current.result.hostBonus).toBe(66300);
    expect(result.current.result.durationBonus).toBe(1000);
    expect(result.current.result.totalBeans).toBe(197300);
    expect(result.current.result.idrValue).toBe(16723524);
  });

  it('TC-UI-04: Mengubah input mereset nilai estimasi kembali ke 0', () => {
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
    expect(result.current.result.totalBeans).toBe(197300);

    // Ubah target beans
    act(() => {
      result.current.setBeans(200000);
    });

    // Otomatis kembali ke 0 (deferred)
    expect(result.current.isCalculated).toBe(false);
    expect(result.current.result.totalBeans).toBe(0);
    expect(result.current.result.idrValue).toBe(0);
    expect(result.current.result.tierName).toBe('Menunggu Kalkulasi');

    // Hitung ulang dengan nilai baru
    act(() => {
      result.current.calculate();
    });
    expect(result.current.isCalculated).toBe(true);
    expect(result.current.result.baseBeans).toBe(200000);
    expect(result.current.result.hostBonus).toBe(102000); // 51% of 200,000
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
});
