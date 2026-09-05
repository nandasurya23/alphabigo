/**
 * ALPHA × BIGO HOST INCOME CALCULATOR - STATE HOOK
 * Initial zero/unselected state for dropdown and inputs
 * Deferred Calculation Pattern (0 until CALCULATE NOW is clicked)
 */

import { useState, useMemo, useCallback } from 'react';
import { HostStatus, CalculationResult } from '@/types/calculator';
import { calculateEstimatedIncome } from '@/engine/calculation-engine';
import { generateAdvisorRecommendation } from '@/engine/advisor-engine';
import { safeClampNumber, MAX_SAFE_BEANS } from '@/utils/security';
import { getCurrentMonthInfo } from '@/constants/policy-constants';

const ZERO_CALCULATION_RESULT: CalculationResult = {
  tierName: 'Menunggu Kalkulasi',
  baseBeans: 0,
  hostBonus: 0,
  hostBonusRule: '(-)',
  hostBonusQualified: false,
  isProrata: false,
  durationBonus: 0,
  durationBonusRule: '(-)',
  durationQualified: false,
  totalBeans: 0,
  usdValue: 0,
  idrValue: 0,
  totalIncomeIdr: 0,
};

const WAITING_ADVISOR_TEXT =
  'Silakan pilih kategori host dan masukkan target Beans Anda, lalu klik tombol <strong>CALCULATE NOW</strong> untuk melihat estimasi penghasilan.';

export function useCalculator() {
  // Initial state: Dropdown and numeric inputs start at 0 / unselected
  const [status, setStatusState] = useState<HostStatus>('');
  const [beans, setBeansState] = useState<number>(0);
  const [days, setDaysState] = useState<number>(0);
  const [hours, setHoursState] = useState<number>(0);

  // Status apakah perhitungan sudah dieksekusi via tombol CALCULATE NOW atau Enter
  const [isCalculated, setIsCalculated] = useState<boolean>(false);

  // Otomatis mengambil data bulan berjalan (real-time now)
  const currentMonth = useMemo(() => getCurrentMonthInfo(), []);
  const daysInMonth = currentMonth.daysInMonth;
  const monthName = currentMonth.monthName;

  // Reset estimasi ke 0 setiap kali input diubah oleh user
  const setStatus = useCallback((newStatus: HostStatus) => {
    setStatusState(newStatus);
    setIsCalculated(false);
  }, []);

  const setBeans = useCallback((newBeans: number) => {
    setBeansState(newBeans);
    setIsCalculated(false);
  }, []);

  const setDays = useCallback((newDays: number) => {
    setDaysState(newDays);
    setIsCalculated(false);
  }, []);

  const setHours = useCallback((newHours: number) => {
    setHoursState(newHours);
    setIsCalculated(false);
  }, []);

  // Eksekusi kalkulasi HANYA saat tombol CALCULATE NOW diklik atau user tekan Enter
  const calculate = useCallback(() => {
    setIsCalculated(true);
  }, []);

  // Evaluasi hasil estimasi: kembalikan 0 jika belum diklik calculate atau kategori belum dipilih
  const result: CalculationResult = useMemo(() => {
    if (!isCalculated || !status) {
      return ZERO_CALCULATION_RESULT;
    }
    const clampedBeans = safeClampNumber(beans, 0, MAX_SAFE_BEANS);
    const clampedDays = safeClampNumber(days, 0, daysInMonth);
    const clampedHours = safeClampNumber(hours, 0, 155);
    return calculateEstimatedIncome(status, clampedBeans, clampedDays, clampedHours, daysInMonth);
  }, [isCalculated, status, beans, days, hours, daysInMonth]);

  const advisorText = useMemo(() => {
    if (!isCalculated || !status) {
      return WAITING_ADVISOR_TEXT;
    }
    const clampedBeans = safeClampNumber(beans, 0, MAX_SAFE_BEANS);
    const clampedDays = safeClampNumber(days, 0, daysInMonth);
    const clampedHours = safeClampNumber(hours, 0, 155);
    return generateAdvisorRecommendation(status, clampedBeans, clampedDays, clampedHours, daysInMonth);
  }, [isCalculated, status, beans, days, hours, daysInMonth]);

  const resetToStandard = useCallback(() => {
    setStatusState('');
    setBeansState(0);
    setDaysState(0);
    setHoursState(0);
    setIsCalculated(false); // Reset estimasi ke 0
  }, []);

  return {
    status,
    setStatus,
    monthName,
    daysInMonth,
    beans,
    setBeans,
    days,
    setDays,
    hours,
    setHours,
    isCalculated,
    calculate,
    result,
    advisorText,
    resetToStandard,
  };
}
