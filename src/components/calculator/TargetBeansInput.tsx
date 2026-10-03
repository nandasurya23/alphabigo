import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
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
  const [inputValue, setInputValue] = useState<string>(beans === 0 ? '' : formatComma(beans));

  useEffect(() => {
    if (beans === 0) {
      if (inputValue !== '0') {
        setInputValue('');
      }
    } else {
      const formatted = formatComma(beans);
      if (inputValue !== formatted) {
        setInputValue(formatted);
      }
    }
  }, [beans]);

  // Synchronously restore caret position after React reconciles DOM, preventing race conditions
  useLayoutEffect(() => {
    if (pendingCursorPosRef.current !== null && inputRef.current) {
      inputRef.current.setSelectionRange(
        pendingCursorPosRef.current,
        pendingCursorPosRef.current
      );
      pendingCursorPosRef.current = null;
    }
  }, [inputValue]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      inputRef.current?.blur();
      onCalculate();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const digitsOnly = sanitizeDigitsOnly(raw);

    if (!digitsOnly) {
      setInputValue('');
      pendingCursorPosRef.current = 0;
      onBeansChange(0);
      return;
    }

    if (digitsOnly === '0') {
      setInputValue('0');
      pendingCursorPosRef.current = 1;
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
    setInputValue(formatted);
    onBeansChange(numValue);
  };

  const handleBlur = () => {
    if (beans === 0) {
      setInputValue('');
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
            value={inputValue}
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
          />

          <span className="currency-tag">Beans</span>
        </div>
      </div>
    </div>
  );
});

TargetBeansInput.displayName = 'TargetBeansInput';
