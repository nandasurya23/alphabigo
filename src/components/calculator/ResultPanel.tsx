import React, { useRef, useEffect } from 'react';
import { HostStatus, CalculationResult } from '@/types/calculator';
import { HeroIncomeBox } from './HeroIncomeBox';
import { BreakdownLedger } from './BreakdownLedger';
import { AdvisorCard } from './AdvisorCard';

interface ResultPanelProps {
  status: HostStatus;
  result: CalculationResult;
  isCalculated: boolean;
  calcTrigger?: number;
  advisorText: string;
}

export const ResultPanel: React.FC<ResultPanelProps> = React.memo(({
  status,
  result,
  isCalculated,
  calcTrigger,
  advisorText,
}) => {
  const resultsCardRef = useRef<HTMLDivElement>(null);

  // Directly trigger pulse-glow micro-animation whenever calculated or when CALCULATE NOW is clicked
  useEffect(() => {
    if (resultsCardRef.current) {
      if (isCalculated) {
        resultsCardRef.current.classList.remove('pulse-glow');
        void resultsCardRef.current.offsetWidth; // Trigger reflow to restart CSS animation
        resultsCardRef.current.classList.add('pulse-glow');

        // Smooth scroll on mobile/tablet viewports
        if (window.innerWidth <= 992) {
          resultsCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        resultsCardRef.current.classList.remove('pulse-glow');
      }
    }
  }, [isCalculated, result, calcTrigger]);

  // Jika tombol CALCULATE NOW ditekan tapi input belum lengkap, pandu fokus pengguna secara bertahap (Guided Stepper)
  useEffect(() => {
    if (calcTrigger && calcTrigger > 0) {
      if (!status) {
        // Langkah 1: Kategori Host belum dipilih
        const dropdown = document.getElementById('custom-status-dropdown');
        if (dropdown) {
          dropdown.classList.remove('input-shake');
          void dropdown.offsetWidth;
          dropdown.classList.add('input-shake');
          dropdown.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else if (result.baseBeans <= 0) {
        // Langkah 2: Target Beans belum diisi
        const beansInput = document.getElementById('beans-custom-input');
        if (beansInput) {
          beansInput.classList.remove('input-shake');
          void beansInput.offsetWidth;
          beansInput.classList.add('input-shake');
          beansInput.focus();
          beansInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  }, [calcTrigger, status, result.baseBeans]);

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
            <h2 className="card-title-gold">Estimasi Income</h2>
          </div>
          <div className="result-badge-glow">HASIL ESTIMASI</div>
        </div>

        {/* Hero Payout Display: TOTAL ESTIMASI PENGHASILAN */}
        <HeroIncomeBox
          result={result}
          isCalculated={isCalculated}
        />

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
