/**
 * ALPHA × BIGO HOST INCOME CALCULATOR - STATE HOOK
 * Initial zero/unselected state for dropdown and inputs
 * Deferred Calculation Pattern (0 until CALCULATE NOW is clicked)
 */

import { useState, useMemo, useCallback, useRef } from 'react';
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
  newHostExtraBonus: 0,
  newHostExtraBonusRule: '(-)',
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
  // Input states (freely editable by user)
  const [status, setStatusState] = useState<HostStatus>('');
  const [beans, setBeansState] = useState<number>(0);
  const [days, setDaysState] = useState<number>(0);
  const [hours, setHoursState] = useState<number>(0);

  // Synchronous state ref to prevent stale closures during batch updates
  const stateRef = useRef({
    status: '' as HostStatus,
    beans: 0,
    days: 0,
    hours: 0,
  });

  const setStatus = useCallback((newStatus: HostStatus) => {
    stateRef.current.status = newStatus;
    setStatusState(newStatus);
  }, []);

  const setBeans = useCallback((newBeans: number) => {
    stateRef.current.beans = newBeans;
    setBeansState(newBeans);
  }, []);

  const setDays = useCallback((newDays: number) => {
    stateRef.current.days = newDays;
    setDaysState(newDays);
  }, []);

  const setHours = useCallback((newHours: number) => {
    stateRef.current.hours = newHours;
    setHoursState(newHours);
  }, []);

  // Snapshot hasil kalkulasi: HANYA diisi saat tombol CALCULATE NOW atau Enter dieksekusi
  const [calculatedSnapshot, setCalculatedSnapshot] = useState<{
    status: HostStatus;
    beans: number;
    days: number;
    hours: number;
  } | null>(null);

  const [calcTrigger, setCalcTrigger] = useState<number>(0);

  // Otomatis mengambil data bulan berjalan (real-time now)
  const currentMonth = useMemo(() => getCurrentMonthInfo(), []);
  const daysInMonth = currentMonth.daysInMonth;
  const monthName = currentMonth.monthName;

  // Eksekusi kalkulasi HANYA saat tombol CALCULATE NOW diklik atau user tekan Enter
  const calculate = useCallback(() => {
    const current = stateRef.current;
    if (current.status) {
      setCalculatedSnapshot({
        status: current.status,
        beans: current.beans,
        days: current.days,
        hours: current.hours,
      });
    }
    setCalcTrigger((prev) => prev + 1);
  }, []);

  // isCalculated bernilai true HANYA jika tombol calculate sudah pernah dieksekusi dengan status valid
  const isCalculated = Boolean(calculatedSnapshot && calculatedSnapshot.status);

  // Evaluasi hasil estimasi: HANYA dieksekusi saat tombol ditekan (bukan real-time saat ngetik)
  const result: CalculationResult = useMemo(() => {
    if (!isCalculated || !calculatedSnapshot || !calculatedSnapshot.status) {
      return ZERO_CALCULATION_RESULT;
    }
    const clampedBeans = safeClampNumber(calculatedSnapshot.beans, 0, MAX_SAFE_BEANS);
    const clampedDays = safeClampNumber(calculatedSnapshot.days, 0, daysInMonth); // Batas maksimal kalender tetap dijaga
    const clampedHours = safeClampNumber(calculatedSnapshot.hours, 0, 155); // Batas maksimal 155 jam tetap dijaga
    return calculateEstimatedIncome(calculatedSnapshot.status, clampedBeans, clampedDays, clampedHours, daysInMonth);
  }, [isCalculated, calculatedSnapshot, daysInMonth]);

  const advisorText = useMemo(() => {
    if (!isCalculated || !calculatedSnapshot || !calculatedSnapshot.status) {
      return WAITING_ADVISOR_TEXT;
    }
    const clampedBeans = safeClampNumber(calculatedSnapshot.beans, 0, MAX_SAFE_BEANS);
    const clampedDays = safeClampNumber(calculatedSnapshot.days, 0, daysInMonth);
    const clampedHours = safeClampNumber(calculatedSnapshot.hours, 0, 155);
    return generateAdvisorRecommendation(calculatedSnapshot.status, clampedBeans, clampedDays, clampedHours, daysInMonth);
  }, [isCalculated, calculatedSnapshot, daysInMonth]);

  const resetToStandard = useCallback(() => {
    stateRef.current = { status: '', beans: 0, days: 0, hours: 0 };
    setStatusState('');
    setBeansState(0);
    setDaysState(0);
    setHoursState(0);
    setCalculatedSnapshot(null);
    setCalcTrigger(0);
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
    calcTrigger,
    calculate,
    result,
    advisorText,
    resetToStandard,
  };
}
