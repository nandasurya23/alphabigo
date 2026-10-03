import React, { useState, useRef, useEffect, useMemo } from 'react';
import { TargetMonthInfo } from '@/types/calculator';
import { getQuickMonthOptions } from '@/constants/policy-constants';

interface TargetMonthSelectorProps {
  targetMonth: TargetMonthInfo;
  onTargetMonthChange: (monthIndex: number, year?: number) => void;
}

export const TargetMonthSelector: React.FC<TargetMonthSelectorProps> = React.memo(({
  targetMonth,
  onTargetMonthChange,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const quickOptions = useMemo(() => getQuickMonthOptions(), []);
  const { previousMonth, currentMonth, allMonths } = quickOptions;

  const isPrevActive = targetMonth.monthIndex === previousMonth.monthIndex && targetMonth.year === previousMonth.year;
  const isCurrActive = targetMonth.monthIndex === currentMonth.monthIndex && targetMonth.year === currentMonth.year;
  const isCustomActive = !isPrevActive && !isCurrActive;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectMonth = (monthIndex: number, year?: number) => {
    onTargetMonthChange(monthIndex, year);
    setIsDropdownOpen(false);
  };

  return (
    <div className="form-block target-month-block">
      <div className="block-label-row">
        <label className="block-label" id="label-target-month">
          <span>BULAN TARGET</span>
          <span
            className="info-help-btn"
            title="Pilih bulan target siaran yang ingin dihitung estimasi gajinya"
            tabIndex={0}
          >
            ?
          </span>
        </label>
        <span className="status-indicator-badge" id="target-month-badge">
          {targetMonth.monthName} {targetMonth.year} ({targetMonth.daysInMonth} Hari)
        </span>
      </div>

      {/* Quick Pills: Bulan Lalu (Masa Gajian) vs Bulan Ini */}
      <div className="target-month-capsule" role="radiogroup" aria-label="Pilih Periode Bulan Target">
        <button
          type="button"
          className={`month-pill ${isPrevActive ? 'active' : ''}`}
          onClick={() => handleSelectMonth(previousMonth.monthIndex, previousMonth.year)}
          role="radio"
          aria-checked={isPrevActive}
          title={`Bulan Lalu: ${previousMonth.monthName} ${previousMonth.year} (${previousMonth.daysInMonth} Hari)`}
        >
          <span className="pill-title">Bulan Lalu</span>
          <span className="pill-badge">{previousMonth.monthName} • {previousMonth.daysInMonth} Hari</span>
        </button>

        <button
          type="button"
          className={`month-pill ${isCurrActive ? 'active' : ''}`}
          onClick={() => handleSelectMonth(currentMonth.monthIndex, currentMonth.year)}
          role="radio"
          aria-checked={isCurrActive}
          title={`Bulan Berjalan: ${currentMonth.monthName} ${currentMonth.year} (${currentMonth.daysInMonth} Hari)`}
        >
          <span className="pill-title">Bulan Ini</span>
          <span className="pill-badge">{currentMonth.monthName} • {currentMonth.daysInMonth} Hari</span>
        </button>
      </div>

      {/* Opsi Pilih Bulan Lainnya */}
      <div className="other-months-wrapper" ref={dropdownRef}>
        <button
          type="button"
          className={`other-months-trigger ${isCustomActive ? 'custom-selected' : ''}`}
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          aria-expanded={isDropdownOpen}
          aria-haspopup="listbox"
        >
          <span className="other-months-text">
            {isCustomActive
              ? `Terpilih: ${targetMonth.monthName} (${targetMonth.daysInMonth} Hari)`
              : '▾ Atau pilih bulan lain (Januari – Desember)'}
          </span>
          <svg
            className={`other-months-chevron ${isDropdownOpen ? 'rotated' : ''}`}
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>

        {isDropdownOpen && (
          <div className="other-months-menu" role="listbox">
            <div className="other-months-grid">
              {allMonths.map((m) => {
                const isSelected = targetMonth.monthIndex === m.monthIndex && targetMonth.year === m.year;
                return (
                  <button
                    key={m.monthIndex}
                    type="button"
                    className={`month-grid-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelectMonth(m.monthIndex, m.year)}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <span className="grid-month-name">{m.monthName}</span>
                    <span className="grid-month-days">{m.daysInMonth} Hari</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

TargetMonthSelector.displayName = 'TargetMonthSelector';
