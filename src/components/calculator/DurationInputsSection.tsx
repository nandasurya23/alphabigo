import React from 'react';
import { formatDecimal, sanitizeDigitsOnly, sanitizeDecimal } from '@/engine/formatters';

interface DurationInputsSectionProps {
  days: number;
  hours: number;
  onDaysChange: (days: number) => void;
  onHoursChange: (hours: number) => void;
  onCalculate: () => void;
}

export const DurationInputsSection: React.FC<DurationInputsSectionProps> = React.memo(({
  days,
  hours,
  onDaysChange,
  onHoursChange,
  onCalculate,
}) => {
  const isDaysInvalid = days < 0 || days > 31;
  const isHoursInvalid = hours < 0 || hours > 155;

  const handleDaysKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      (e.target as HTMLInputElement).blur();
      onCalculate();
      return;
    }

    const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'];
    if (allowed.includes(e.key) || e.ctrlKey || e.metaKey) return;

    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleHoursKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      (e.target as HTMLInputElement).blur();
      onCalculate();
      return;
    }

    const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'];
    if (allowed.includes(e.key) || e.ctrlKey || e.metaKey) return;

    if (!/^[0-9.,]$/.test(e.key)) {
      e.preventDefault();
      return;
    }

    const val = (e.target as HTMLInputElement).value;
    if ((e.key === '.' || e.key === ',') && (val.includes('.') || val.includes(','))) {
      e.preventDefault();
    }
  };

  return (
    <div id="duration-inputs-section" className="duration-inputs-section">
      {/* Valid Days Input Bar */}
      <div className="form-block">
        <div className="block-label-row">
          <label htmlFor="valid-days-input" className="block-label" id="label-valid-days">
            <span>VALID DAYS</span>
            <span
              className="info-help-btn"
              title="Hari siaran aktif per bulan (Maksimal 31 hari)"
              tabIndex={0}
            >
              ?
            </span>
          </label>
          <span id="days-val-display" className="formatted-pill">
            {days} Days
          </span>
        </div>

        <div className="custom-numeric-field">
          <div
            className={`numeric-input-wrapper ${isDaysInvalid ? 'input-error-border' : ''}`}
          >
            <span className="input-leading-icon" aria-hidden="true">
              {/* Calendar Icon */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="gold-stroke"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </span>
            <input
              type="text"
              id="valid-days-input"
              className="custom-beans-input"
              value={days === 0 ? '' : days}
              inputMode="numeric"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              data-lpignore="true"
              maxLength={2}
              placeholder="Contoh: 15"
              aria-invalid={isDaysInvalid}
              aria-describedby={isDaysInvalid ? 'days-error' : undefined}
              onKeyDown={handleDaysKeyDown}
              onChange={(e) => {
                const digits = sanitizeDigitsOnly(e.target.value);
                onDaysChange(digits ? parseInt(digits, 10) : 0);
              }}
            />
            <span className="currency-tag">Days</span>
          </div>
          <p className="field-hint">
            Jumlah hari siaran aktif per bulan (Contoh: 15 hari, maks 31).
          </p>
          <span
            id="days-error"
            className={`input-error-msg ${isDaysInvalid ? 'visible' : ''}`}
          >
            Rentang hari siaran harus antara 0 hingga 31 hari.
          </span>
        </div>
      </div>

      {/* Valid Hours Input Bar */}
      <div className="form-block">
        <div className="block-label-row">
          <label htmlFor="valid-hours-input" className="block-label" id="label-valid-hours">
            <span>VALID HOURS</span>
            <span
              className="info-help-btn"
              title="Total durasi jam siaran (Maksimal 155 jam)"
              tabIndex={0}
            >
              ?
            </span>
          </label>
          <span id="hours-val-display" className="formatted-pill">
            {formatDecimal(hours)} Hours
          </span>
        </div>

        <div className="custom-numeric-field">
          <div
            className={`numeric-input-wrapper ${isHoursInvalid ? 'input-error-border' : ''}`}
          >
            <span className="input-leading-icon" aria-hidden="true">
              {/* Timer/Stopwatch Icon */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="gold-stroke"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </span>
            <input
              type="text"
              id="valid-hours-input"
              className="custom-beans-input"
              value={hours === 0 ? '' : hours}
              inputMode="decimal"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              data-lpignore="true"
              maxLength={5}
              placeholder="Contoh: 40"
              aria-invalid={isHoursInvalid}
              aria-describedby={isHoursInvalid ? 'hours-error' : undefined}
              onKeyDown={handleHoursKeyDown}
              onChange={(e) => {
                const clean = sanitizeDecimal(e.target.value);
                onHoursChange(clean ? parseFloat(clean) : 0);
              }}
            />
            <span className="currency-tag">Hours</span>
          </div>
          <p className="field-hint">
            Total durasi jam siaran per bulan (Contoh: 40 atau 40.5 jam, maks 155).
          </p>
          <span
            id="hours-error"
            className={`input-error-msg ${isHoursInvalid ? 'visible' : ''}`}
          >
            Rentang jam siaran harus antara 0 hingga 155 jam.
          </span>
        </div>
      </div>
    </div>
  );
});

DurationInputsSection.displayName = 'DurationInputsSection';
