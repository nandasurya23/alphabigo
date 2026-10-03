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
    newHostMonth,
    setNewHostMonth,
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
  } = calculator;

  return (
    <div className="cockpit-grid">
      <InputPanel
        status={status}
        newHostMonth={newHostMonth}
        monthName={monthName}
        daysInMonth={daysInMonth}
        beans={beans}
        days={days}
        hours={hours}
        onStatusChange={setStatus}
        onNewHostMonthChange={setNewHostMonth}
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
        calcTrigger={calcTrigger}
        advisorText={advisorText}
      />
    </div>
  );
};
