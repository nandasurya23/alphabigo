import React, { useRef, useEffect } from 'react';
import { HostStatus, CalculationResult } from '@/types/calculator';
import { HeroIncomeBox } from './HeroIncomeBox';
import { BreakdownLedger } from './BreakdownLedger';
import { AdvisorCard } from './AdvisorCard';

interface ResultPanelProps {
  status: HostStatus;
  result: CalculationResult;
  isCalculated: boolean;
  advisorText: string;
}

export const ResultPanel: React.FC<ResultPanelProps> = React.memo(({
  status,
  result,
  isCalculated,
  advisorText,
}) => {
  const resultsCardRef = useRef<HTMLDivElement>(null);

  // Directly trigger pulse-glow micro-animation without extra React state renders or timer race conditions
  useEffect(() => {
    if (isCalculated && resultsCardRef.current) {
      resultsCardRef.current.classList.remove('pulse-glow');
      void resultsCardRef.current.offsetWidth; // Trigger reflow
      resultsCardRef.current.classList.add('pulse-glow');

      // Smooth scroll on mobile/tablet viewports
      if (window.innerWidth <= 992) {
        resultsCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else if (!isCalculated && resultsCardRef.current) {
      resultsCardRef.current.classList.remove('pulse-glow');
    }
  }, [isCalculated, result]);

  return (
    <div className="cockpit-column column-results">
      <div
        ref={resultsCardRef}
        className="studio-card results-card"
        id="results-card"
      >
        {/* Card 2 Header: 3D Gold Cube 2 + ESTIMASI PENGHASILAN + HASIL ESTIMASI Badge */}
        <div className="card-top-bar">
          <div className="card-heading-group">
            <div className="gold-cube-badge" aria-hidden="true">
              2
            </div>
            <h2 className="card-title-gold">ESTIMASI PENGHASILAN</h2>
          </div>
          <div className="result-badge-glow">HASIL ESTIMASI</div>
        </div>

        {/* Hero Payout Display: TOTAL ESTIMASI PENGHASILAN */}
        <HeroIncomeBox result={result} isCalculated={isCalculated} />

        {/* Financial Ledger Breakdown with 3D Circular Icons */}
        <BreakdownLedger
          status={status}
          result={result}
          isCalculated={isCalculated}
        />

        {/* Smart Opportunity Advisor */}
        <AdvisorCard advisorText={advisorText} />
      </div>
    </div>
  );
});

ResultPanel.displayName = 'ResultPanel';
