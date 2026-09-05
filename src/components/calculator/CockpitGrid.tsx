import React from 'react';
import { useCalculator } from '@/hooks/useCalculator';
import { InputPanel } from './InputPanel';
import { ResultPanel } from './ResultPanel';

interface CockpitGridProps {
  calculator: ReturnType<typeof useCalculator>;
}

export const CockpitGrid: React.FC<CockpitGridProps> = ({ calculator }) => {
  const {
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
  } = calculator;

  return (
    <div className="cockpit-grid">
      <InputPanel
        status={status}
        monthName={monthName}
        daysInMonth={daysInMonth}
        beans={beans}
        days={days}
        hours={hours}
        onStatusChange={setStatus}
        onBeansChange={setBeans}
        onDaysChange={setDays}
        onHoursChange={setHours}
        onCalculate={calculate}
        onReset={resetToStandard}
      />
      <ResultPanel
        status={status}
        result={result}
        isCalculated={isCalculated}
        advisorText={advisorText}
      />
    </div>
  );
};
