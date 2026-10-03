import React, { useState, useRef, useEffect } from 'react';
import { HostStatus, NewHostMonth } from '@/types/calculator';

interface HostCategoryDropdownProps {
  status: HostStatus;
  newHostMonth?: NewHostMonth;
  onStatusChange: (status: HostStatus) => void;
  onNewHostMonthChange?: (month: NewHostMonth) => void;
}

export const HostCategoryDropdown: React.FC<HostCategoryDropdownProps> = React.memo(({
  status,
  newHostMonth = 1,
  onStatusChange,
  onNewHostMonthChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Use mousedown instead of click to prevent race conditions with unmounting DOM nodes
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOpen(true);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSelect = (newStatus: HostStatus) => {
    onStatusChange(newStatus);
    setIsOpen(false);
  };

  return (
    <div className="form-block">
      <div className="block-label-row">
        <label className="block-label" id="label-host-status">
          <span>KATEGORI HOST</span>
          <span className="info-help-btn" title="Pilih kategori masa kerja host" tabIndex={0}>
            ?
          </span>
        </label>
        <span className="status-indicator-badge" id="status-indicator-badge">
          {status === 'new'
            ? (newHostMonth === 1 ? 'New Host: Bulan 1' : 'New Host: Bulan 2-3')
            : status === 'premium'
            ? 'Bulan 4 sampai seterusnya'
            : 'Belum Dipilih'}
        </span>
      </div>

      <div
        className={`custom-dropdown ${isOpen ? 'open' : ''}`}
        id="custom-status-dropdown"
        aria-labelledby="label-host-status"
        ref={dropdownRef}
      >
        <button
          type="button"
          className="custom-dropdown-trigger"
          id="dropdown-trigger"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
          onKeyDown={handleKeyDown}
        >
          <span className="trigger-icon-title">
            <svg className="crown-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
            </svg>
            <span className="selected-text" id="dropdown-selected-label">
              {status === 'new'
                ? `New Host (${newHostMonth === 1 ? 'Bulan 1' : 'Bulan 2-3'})`
                : status === 'premium'
                ? 'Old Host (Bulan ke-4 sampai seterusnya)'
                : 'Pilih Kategori Host (Contoh: New Host)'}
            </span>
          </span>
          <svg
            className="dropdown-icon"
            width="16"
            height="16"
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

        <div
          className="custom-dropdown-menu"
          id="dropdown-menu"
          role="listbox"
          aria-hidden={!isOpen}
        >
          <div
            className={`custom-dropdown-option ${status === 'new' ? 'selected' : ''}`}
            role="option"
            data-value="new"
            tabIndex={-1}
            aria-selected={status === 'new'}
            onClick={() => handleSelect('new')}
          >
            <div className="option-header-row">
              <span className="option-title">New Host (Bulan 1-3)</span>
              <span className="option-tag">Extra Bonus New Host</span>
            </div>
            <div className="option-desc">
              Bonus Host Bigo (%) + Extra Bonus New Host + Duration Bonus
            </div>

          </div>

          <div
            className={`custom-dropdown-option ${status === 'premium' ? 'selected' : ''}`}
            role="option"
            data-value="premium"
            tabIndex={-1}
            aria-selected={status === 'premium'}
            onClick={() => handleSelect('premium')}
          >
            <div className="option-header-row">
              <span className="option-title">Old Host (Bulan ke-4 sampai seterusnya)</span>
              <span className="option-tag gold">Wajib 15 Hari &amp; 40 Jam</span>
            </div>
            <div className="option-desc">
              Bonus Host Bigo (%) + Duration Bonus
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Pills Pilihan Masa Kerja New Host (Bulan 1 vs Bulan 2 & 3) */}
      {status === 'new' && onNewHostMonthChange && (
        <div className="new-host-month-capsule" role="radiogroup" aria-label="Pilih Masa Kerja New Host">
          <button
            type="button"
            className={`month-pill ${newHostMonth === 1 ? 'active' : ''}`}
            onClick={() => onNewHostMonthChange(1)}
            role="radio"
            aria-checked={newHostMonth === 1}
            title="Khusus bulan pertama: Bebas target durasi & hari, komisi pokok tetap cair 100%"
          >
            <span className="pill-title">Bulan 1</span>
            <span className="pill-badge">Bebas Durasi</span>
          </button>
          <button
            type="button"
            className={`month-pill ${newHostMonth === 2 ? 'active' : ''}`}
            onClick={() => onNewHostMonthChange(2)}
            role="radio"
            aria-checked={newHostMonth === 2}
            title="Bulan ke-2 & 3: Wajib minimal 15 Hari & 40 Jam siaran valid"
          >
            <span className="pill-title">Bulan 2 &amp; 3</span>
            <span className="pill-badge">Wajib 15 Hari</span>
          </button>
        </div>
      )}
    </div>
  );
});

HostCategoryDropdown.displayName = 'HostCategoryDropdown';
