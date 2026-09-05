import React, { useRef, useLayoutEffect } from 'react';
import { formatComma, sanitizeDigitsOnly } from '@/engine/formatters';
import { MAX_SAFE_BEANS, safeClampNumber } from '@/utils/security';

interface TargetBeansInputProps {
  beans: number;
  onBeansChange: (beans: number) => void;
  onCalculate: () => void;
}

export const TargetBeansInput: React.FC<TargetBeansInputProps> = React.memo(({
  beans,
  onBeansChange,
  onCalculate,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingCursorPosRef = useRef<number | null>(null);

  // Synchronously restore caret position after React reconciles DOM, preventing race conditions
  useLayoutEffect(() => {
    if (pendingCursorPosRef.current !== null && inputRef.current) {
      inputRef.current.setSelectionRange(
        pendingCursorPosRef.current,
        pendingCursorPosRef.current
      );
      pendingCursorPosRef.current = null;
    }
  }, [beans]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      inputRef.current?.blur();
      onCalculate();
      return;
    }

    const allowedSpecialKeys = [
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
      'Home',
      'End',
    ];

    if (allowedSpecialKeys.includes(e.key)) return;
    if (e.ctrlKey || e.metaKey) return;

    // Reject non-digits
    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const digitsOnly = sanitizeDigitsOnly(raw);

    if (!digitsOnly) {
      pendingCursorPosRef.current = 0;
      onBeansChange(0);
      return;
    }

    const cursorPosition = e.target.selectionStart || 0;
    const textBeforeCursor = raw.slice(0, cursorPosition);
    const digitsBeforeCursor = sanitizeDigitsOnly(textBeforeCursor).length;

    const numValue = safeClampNumber(parseInt(digitsOnly, 10), 0, MAX_SAFE_BEANS);
    const formatted = formatComma(numValue);

    // Compute expected caret position synchronously
    let newCursorPos = formatted.length;
    let digitCount = 0;
    for (let i = 0; i < formatted.length; i++) {
      if (/\d/.test(formatted[i])) {
        digitCount++;
      }
      if (digitCount === digitsBeforeCursor) {
        newCursorPos = i + 1;
        break;
      }
    }

    pendingCursorPosRef.current = newCursorPos;
    onBeansChange(numValue);
  };

  const handleBlur = () => {
    if (beans === 0 && inputRef.current) {
      inputRef.current.value = '0';
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text');
    const cleanDigits = sanitizeDigitsOnly(pasteData);
    if (cleanDigits) {
      const numValue = safeClampNumber(parseInt(cleanDigits, 10), 0, MAX_SAFE_BEANS);
      pendingCursorPosRef.current = formatComma(numValue).length;
      onBeansChange(numValue);
    }
  };

  return (
    <div className="form-block">
      <div className="block-label-row">
        <label htmlFor="beans-custom-input" className="block-label">
          <span>TARGET BEANS</span>
          <span
            className="info-help-btn"
            title="Masukkan target pencapaian virtual gift Beans"
            tabIndex={0}
          >
            ?
          </span>
        </label>
        <span id="beans-formatted" className="formatted-pill">
          {formatComma(beans)} Beans
        </span>
      </div>

      <div className="custom-numeric-field">
        <div className="numeric-input-wrapper">
          <span className="input-leading-icon" aria-hidden="true">
            {/* 3D Glossy Gold Bean Asset */}
            <picture>
              <source srcSet="/images/gold_bean.webp" type="image/webp" />
              <img
                src="/images/gold_bean.png"
                alt="Target Beans"
                className="input-bean-icon"
                width="22"
                height="22"
                decoding="async"
              />
            </picture>
          </span>
          <input
            ref={inputRef}
            type="text"
            id="beans-custom-input"
            className="custom-beans-input"
            value={beans === 0 ? '' : formatComma(beans)}
            inputMode="numeric"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            maxLength={15}
            data-lpignore="true"
            aria-label="Target perolehan Beans"
            placeholder="Contoh: 130,000"
            onKeyDown={handleKeyDown}
            onChange={handleInputChange}
            onBlur={handleBlur}
            onPaste={handlePaste}
          />
          <span className="currency-tag">Beans</span>
        </div>
        <p className="field-hint">
          Ketik angka target Beans kamu (Contoh: 130,000). Pemisah koma terformat otomatis.
        </p>
      </div>
    </div>
  );
});

TargetBeansInput.displayName = 'TargetBeansInput';
