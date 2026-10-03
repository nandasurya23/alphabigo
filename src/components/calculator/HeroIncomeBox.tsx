import React from 'react';
import { CalculationResult } from '@/types/calculator';
import { formatCurrencyIDR, formatCurrencyUSD, formatComma } from '@/engine/formatters';

interface HeroIncomeBoxProps {
  result: CalculationResult;
  isCalculated: boolean;
}

export const HeroIncomeBox: React.FC<HeroIncomeBoxProps> = React.memo(({
  result,
  isCalculated,
}) => {
  const displayIdr = isCalculated ? formatCurrencyIDR(result.idrValue) : '0';
  const displayUsd = isCalculated ? formatCurrencyUSD(result.usdValue) : '0';
  const displayBeans = isCalculated ? formatComma(result.totalBeans) : '0';

  return (
    <div
      className="hero-income-box"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="hero-label-top">Total Estimasi Income</div>
      <div className="hero-values-combined">
        <span className="hero-idr-wrap">
          <span className="hero-currency-tag">Rp</span>
          <span id="total-idr-display" className="hero-main-number">
            {displayIdr}
          </span>
        </span>
        <span className="hero-val-divider">|</span>
        <span className="hero-usd-wrap">
          <span className="hero-usd-symbol">$</span>
          <span id="total-usd-display" className="hero-usd-number">
            {displayUsd}
          </span>
        </span>
      </div>
      <div className="hero-beans-capsule">
        <span id="total-beans-display">Total {displayBeans} Beans</span>
      </div>
    </div>
  );
});

HeroIncomeBox.displayName = 'HeroIncomeBox';
