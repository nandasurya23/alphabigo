import React from 'react';
import { HostStatus, CalculationResult } from '@/types/calculator';
import { POLICY_CONSTANTS } from '@/constants/policy-constants';
import { formatComma, formatCurrencyIDR, formatCurrencyUSD } from '@/engine/formatters';

interface BreakdownLedgerProps {
  status: HostStatus;
  result: CalculationResult;
  isCalculated: boolean;
}

export const BreakdownLedger: React.FC<BreakdownLedgerProps> = React.memo(({
  status,
  result,
  isCalculated,
}) => {
  const rateBeansToUsd = POLICY_CONSTANTS.EXCHANGE_RATE_BEANS_TO_USD;
  const rateUsdToIdr = POLICY_CONSTANTS.USD_TO_IDR_RATE;

  // Row 1: Target Beans
  const targetBeans = isCalculated ? result.baseBeans : 0;
  const targetUsd = isCalculated ? targetBeans / rateBeansToUsd : 0;
  const targetIdr = isCalculated ? Math.round(targetUsd * rateUsdToIdr) : 0;

  // Row 2: Bonus Host Beans
  const hostBonus = isCalculated ? result.hostBonus : 0;
  const bonusUsd = isCalculated ? hostBonus / rateBeansToUsd : 0;
  const bonusIdr = isCalculated ? Math.round(bonusUsd * rateUsdToIdr) : 0;

  // Row 3: Duration Bonus (Premium only)
  const durationBonus = isCalculated && status === 'premium' ? result.durationBonus : 0;
  const durUsd = isCalculated ? durationBonus / rateBeansToUsd : 0;
  const durIdr = isCalculated ? Math.round(durUsd * rateUsdToIdr) : 0;

  return (
    <div className="breakdown-ledger-container">
      <div className="ledger-header-row">
        <h3 className="ledger-title-text">Rincian Komponen Penghasilan</h3>
        <div id="status-tier-badge" className="tier-pill">
          {isCalculated ? result.tierName : 'Menunggu Kalkulasi'}
        </div>
      </div>

      <div className="breakdown-rows-list">
        {/* Row 1: Target Beans */}
        <div className="breakdown-item-card">
          <div className="item-left-group">
            <div className="item-circle-icon target-icon" aria-hidden="true">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="6"></circle>
                <circle cx="12" cy="12" r="2"></circle>
              </svg>
            </div>
            <div className="item-text-group">
              <div className="item-title">TARGET BEANS</div>
              <div className="item-beans-sub" id="breakdown-base-beans">
                {isCalculated ? `${formatComma(targetBeans)} Beans` : '0 Beans'}
              </div>
            </div>
          </div>
          <div className="item-right-group">
            <div className="item-idr-val" id="row-target-idr">
              Rp {formatCurrencyIDR(targetIdr)}
            </div>
            <div className="item-usd-val" id="row-target-usd">
              $ {formatCurrencyUSD(targetUsd)}
            </div>
          </div>
        </div>

        {/* Row 2: Bonus Beans BIGO */}
        <div className="breakdown-item-card">
          <div className="item-left-group">
            <div className="item-circle-icon bonus-icon" aria-hidden="true">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 12 20 22 4 22 4 12"></polyline>
                <rect x="2" y="7" width="20" height="5"></rect>
                <line x1="12" y1="22" x2="12" y2="7"></line>
                <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
                <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
              </svg>
            </div>
            <div className="item-text-group">
              <div className="item-title">BONUS BEANS BIGO</div>
              <div className="item-beans-sub">
                <span id="breakdown-bonus-beans">
                  {isCalculated ? `+${formatComma(hostBonus)} Beans` : '+0 Beans'}
                </span>
                <span className="tier-inline-tag" id="breakdown-bonus-rule">
                  {isCalculated ? `(${result.hostBonusRule})` : '(-)'}
                </span>
              </div>
            </div>
          </div>
          <div className="item-right-group">
            <div className="item-idr-val" id="row-bonus-idr">
              Rp {formatCurrencyIDR(bonusIdr)}
            </div>
            <div className="item-usd-val" id="row-bonus-usd">
              $ {formatCurrencyUSD(bonusUsd)}
            </div>
          </div>
        </div>

        {/* Row 3: Bonus Duration (Only for Premium Host) */}
        {status === 'premium' && (
          <div className="breakdown-item-card" id="duration-bonus-row">
            <div className="item-left-group">
              <div className="item-circle-icon duration-icon" aria-hidden="true">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <div className="item-text-group">
                <div className="item-title">BONUS DURATION</div>
                <div className="item-beans-sub">
                  <span id="breakdown-duration-beans">
                    {isCalculated ? `+${formatComma(durationBonus)} Beans` : '+0 Beans'}
                  </span>
                  <span className="tier-inline-tag" id="breakdown-duration-rule">
                    {isCalculated ? `(${result.durationBonusRule})` : '(-)'}
                  </span>
                </div>
              </div>
            </div>
            <div className="item-right-group">
              <div className="item-idr-val" id="row-duration-idr">
                Rp {formatCurrencyIDR(durIdr)}
              </div>
              <div className="item-usd-val" id="row-duration-usd">
                $ {formatCurrencyUSD(durUsd)}
              </div>
            </div>
          </div>
        )}

        {/* Row 4: Total Summary Bottom Line */}
        <div className="breakdown-item-card total-summary-card">
          <div className="item-left-group">
            <div className="item-circle-icon total-icon" aria-hidden="true">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
              </svg>
            </div>
            <div className="item-text-group">
              <div className="total-label-lead">TOTAL BEANS</div>
              <div className="total-beans-bold" id="breakdown-net-beans">
                {isCalculated ? `${formatComma(result.totalBeans)} Beans` : '0 Beans'}
              </div>
              <div className="total-subtext-note" id="ledger-beans-subtext">
                {status === 'new'
                  ? 'Akumulasi Pencapaian + Bonus Host'
                  : 'Akumulasi Pencapaian + Bonus Host + Bonus Duration'}
              </div>
            </div>
          </div>
          <div className="item-right-group total-side-summary">
            <div className="total-summary-label">TOTAL ESTIMASI</div>
            <div className="item-idr-total" id="breakdown-net-idr-sum">
              Rp {formatCurrencyIDR(isCalculated ? result.idrValue : 0)}
            </div>
            <div className="item-usd-total" id="breakdown-net-usd-sum">
              $ {formatCurrencyUSD(isCalculated ? result.usdValue : 0)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

BreakdownLedger.displayName = 'BreakdownLedger';
