import React from 'react';
import { HostStatus, NewHostMonth } from '@/types/calculator';
import { HostCategoryDropdown } from './HostCategoryDropdown';
import { TargetBeansInput } from './TargetBeansInput';
import { DurationInputsSection } from './DurationInputsSection';

interface InputPanelProps {
  status: HostStatus;
  newHostMonth?: NewHostMonth;
  monthName: string;
  daysInMonth: number;
  beans: number;
  days: number;
  hours: number;
  onStatusChange: (status: HostStatus) => void;
  onNewHostMonthChange?: (month: NewHostMonth) => void;
  onBeansChange: (beans: number) => void;
  onDaysChange: (days: number) => void;
  onHoursChange: (hours: number) => void;
  onCalculate: () => void;
  onReset: () => void;
}

export const InputPanel: React.FC<InputPanelProps> = React.memo(({
  status,
  newHostMonth,
  monthName,
  daysInMonth,
  beans,
  days,
  hours,
  onStatusChange,
  onNewHostMonthChange,
  onBeansChange,
  onDaysChange,
  onHoursChange,
  onCalculate,
  onReset,
}) => {
  return (
    <div className="cockpit-column column-inputs">
      <div className="studio-card input-card">
        {/* Card 1 Header: 3D Gold Cube 1 + INPUT DATA */}
        <div className="card-top-bar">
          <div className="card-heading-group">
            <div className="gold-cube-badge" aria-hidden="true">
              1
            </div>
            <h2 className="card-title-gold">INPUT DATA</h2>
          </div>
        </div>

        <div className="form-body">
          {/* 1. Kategori Host */}
          <HostCategoryDropdown
            status={status}
            newHostMonth={newHostMonth}
            onStatusChange={onStatusChange}
            onNewHostMonthChange={onNewHostMonthChange}
          />

          {/* 2. Target Beans */}
          <TargetBeansInput
            beans={beans}
            onBeansChange={onBeansChange}
            onCalculate={onCalculate}
          />

          {/* 3 & 4. Duration Controls (VALID DAYS & VALID HOURS) */}
          <DurationInputsSection
            days={days}
            hours={hours}
            daysInMonth={daysInMonth}
            monthName={monthName}
            onDaysChange={onDaysChange}
            onHoursChange={onHoursChange}
            onCalculate={onCalculate}
          />

          {/* Form Actions: CALCULATE NOW Button & Reset */}
          <div className="form-actions-group">
            <button
              type="button"
              id="calculate-btn"
              className="btn-calculate-now"
              onClick={onCalculate}
            >
              <span className="btn-text">CALCULATE NOW</span>
              <span className="btn-arrow" aria-hidden="true">
                ❯
              </span>
            </button>

            <button
              type="button"
              id="reset-btn"
              className="btn-action-reset"
              onClick={onReset}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="1 4 1 10 7 10"></polyline>
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
              </svg>
              <span>Reset Parameter Standar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

InputPanel.displayName = 'InputPanel';
