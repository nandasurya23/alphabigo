/**
 * ALPHA × BIGO HOST INCOME CALCULATOR - UI CONTROLLER & DOM SYNC
 * Clean, modern DOM controller matching owner specifications and reference mock layout.
 */

(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.AlphaBigo = root.AlphaBigo || {};
    root.AlphaBigo.ui = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function initUIController(dependencies) {
    const { policies, formatters, calc, advisor } = dependencies;
    const { POLICY_CONSTANTS } = policies;
    const { 
      formatComma, 
      sanitizeDigitsOnly, 
      sanitizeDecimal, 
      formatDecimal, 
      formatCurrencyIDR, 
      formatCurrencyUSD 
    } = formatters;
    const { calculateEstimatedIncome } = calc;
    const { generateAdvisorRecommendation } = advisor;

    // Default initial state matching owner brief benchmark (130K / 15d / 40h)
    let currentStatus = 'premium';
    let currentBeans = 130000;
    let currentDays = 15;
    let currentHours = 40;

    // --- DOM Elements: Card 1 Inputs ---
    const statusDropdown = document.getElementById('custom-status-dropdown');
    const dropdownTrigger = document.getElementById('dropdown-trigger');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const dropdownSelectedLabel = document.getElementById('dropdown-selected-label');
    const dropdownOptions = document.querySelectorAll('.custom-dropdown-option');
    const hostStatusValue = document.getElementById('host-status-value');
    const statusIndicatorBadge = document.getElementById('status-indicator-badge');

    const beansCustomInput = document.getElementById('beans-custom-input');
    const beansFormatted = document.getElementById('beans-formatted');

    const durationInputsSection = document.getElementById('duration-inputs-section');
    const validDaysInput = document.getElementById('valid-days-input');
    const daysValDisplay = document.getElementById('days-val-display');
    const daysError = document.getElementById('days-error');

    const validHoursInput = document.getElementById('valid-hours-input');
    const hoursValDisplay = document.getElementById('hours-val-display');
    const hoursError = document.getElementById('hours-error');

    const calculateBtn = document.getElementById('calculate-btn');
    const resetBtn = document.getElementById('reset-btn');

    // --- DOM Elements: Card 2 Results & Ledger ---
    const resultsCard = document.getElementById('results-card');
    const statusTierBadge = document.getElementById('status-tier-badge');
    const totalIdrDisplay = document.getElementById('total-idr-display');
    const totalUsdDisplay = document.getElementById('total-usd-display');
    const totalBeansDisplay = document.getElementById('total-beans-display');

    // Breakdown Row 1: Target Beans
    const breakdownBaseBeans = document.getElementById('breakdown-base-beans');
    const rowTargetIdr = document.getElementById('row-target-idr');
    const rowTargetUsd = document.getElementById('row-target-usd');

    // Breakdown Row 2: Bonus Host Beans
    const breakdownBonusBeans = document.getElementById('breakdown-bonus-beans');
    const breakdownBonusRule = document.getElementById('breakdown-bonus-rule');
    const rowBonusIdr = document.getElementById('row-bonus-idr');
    const rowBonusUsd = document.getElementById('row-bonus-usd');

    // Breakdown Row 3: Bonus Duration (Premium only)
    const durationBonusRow = document.getElementById('duration-bonus-row');
    const breakdownDurationBeans = document.getElementById('breakdown-duration-beans');
    const breakdownDurationRule = document.getElementById('breakdown-duration-rule');
    const rowDurationIdr = document.getElementById('row-duration-idr');
    const rowDurationUsd = document.getElementById('row-duration-usd');

    // Breakdown Row 4: Total Beans Summary
    const breakdownNetBeans = document.getElementById('breakdown-net-beans');
    const ledgerBeansSubtext = document.getElementById('ledger-beans-subtext');
    const breakdownNetIdrSum = document.getElementById('breakdown-net-idr-sum');
    const breakdownNetUsdSum = document.getElementById('breakdown-net-usd-sum');

    // Advisor
    const advisorText = document.getElementById('advisor-text');

    // ========================================================================
    // 1. CUSTOM DROPDOWN CONTROLLER
    // ========================================================================
    function toggleDropdown(show) {
      if (!statusDropdown || !dropdownTrigger || !dropdownMenu) return;
      const isOpen = show !== undefined ? show : !statusDropdown.classList.contains('open');
      if (isOpen) {
        statusDropdown.classList.add('open');
        dropdownTrigger.setAttribute('aria-expanded', 'true');
        dropdownMenu.setAttribute('aria-hidden', 'false');
      } else {
        statusDropdown.classList.remove('open');
        dropdownTrigger.setAttribute('aria-expanded', 'false');
        dropdownMenu.setAttribute('aria-hidden', 'true');
      }
    }

    if (dropdownTrigger) {
      dropdownTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown();
      });

      dropdownTrigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
          e.preventDefault();
          toggleDropdown(true);
        } else if (e.key === 'Escape') {
          toggleDropdown(false);
        }
      });
    }

    dropdownOptions.forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        const val = opt.getAttribute('data-value');
        selectStatus(val);
        toggleDropdown(false);
      });
    });

    document.addEventListener('click', (e) => {
      if (statusDropdown && !statusDropdown.contains(e.target)) {
        toggleDropdown(false);
      }
    });

    function selectStatus(status) {
      currentStatus = status;
      if (hostStatusValue) hostStatusValue.value = status;

      dropdownOptions.forEach(opt => {
        if (opt.getAttribute('data-value') === status) {
          opt.classList.add('selected');
          opt.setAttribute('aria-selected', 'true');
          const title = opt.querySelector('.option-title').textContent;
          if (dropdownSelectedLabel) dropdownSelectedLabel.textContent = title;
        } else {
          opt.classList.remove('selected');
          opt.removeAttribute('aria-selected');
        }
      });

      if (status === 'new') {
        if (statusIndicatorBadge) statusIndicatorBadge.textContent = 'Bulan 1-3';
      } else {
        if (statusIndicatorBadge) statusIndicatorBadge.textContent = 'Bulan 4 sampai seterusnya';
      }

      updateInputUI();
      renderZeroEstimates();
    }

    // ========================================================================
    // 2. STRICT NUMERIC KEYDOWN GUARDS
    // ========================================================================
    function attachStrictNumericKeydown(inputElement) {
      if (!inputElement) return;
      inputElement.addEventListener('keydown', (e) => {
        const allowedSpecialKeys = [
          'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 
          'Tab', 'Home', 'End', 'Enter'
        ];

        if (allowedSpecialKeys.includes(e.key)) return;
        if (e.ctrlKey || e.metaKey) return;

        // Strictly reject '+', '-', 'e', letters, and non-digits
        if (!/^[0-9]$/.test(e.key)) {
          e.preventDefault();
        }
      });
    }

    function attachDecimalNumericKeydown(inputElement) {
      if (!inputElement) return;
      inputElement.addEventListener('keydown', (e) => {
        const allowedSpecialKeys = [
          'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 
          'Tab', 'Home', 'End', 'Enter'
        ];

        if (allowedSpecialKeys.includes(e.key)) return;
        if (e.ctrlKey || e.metaKey) return;

        // Allow digits, '.', and ','
        if (!/^[0-9.,]$/.test(e.key)) {
          e.preventDefault();
          return;
        }

        // Only allow one decimal point or comma
        if (e.key === '.' || e.key === ',') {
          if (inputElement.value.includes('.') || inputElement.value.includes(',')) {
            e.preventDefault();
          }
        }
      });
    }

    attachStrictNumericKeydown(beansCustomInput);
    attachStrictNumericKeydown(validDaysInput);
    attachDecimalNumericKeydown(validHoursInput);

    // ========================================================================
    // 3. TARGET BEANS INPUT SYNC (COMMAS FORMATTER)
    // ========================================================================
    if (beansCustomInput) {
      beansCustomInput.addEventListener('input', (e) => {
        const raw = e.target.value;
        const digitsOnly = sanitizeDigitsOnly(raw);
        
        if (!digitsOnly) {
          currentBeans = 0;
          e.target.value = '';
          if (beansFormatted) beansFormatted.textContent = '0 Beans';
          renderZeroEstimates();
          return;
        }

        const cursorPosition = e.target.selectionStart || 0;
        const textBeforeCursor = raw.slice(0, cursorPosition);
        const digitsBeforeCursor = sanitizeDigitsOnly(textBeforeCursor).length;

        const numValue = parseInt(digitsOnly, 10);
        currentBeans = numValue;
        const formatted = formatComma(numValue);
        e.target.value = formatted;

        let newCursorPos = 0;
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
        e.target.setSelectionRange(newCursorPos, newCursorPos);

        if (beansFormatted) {
          beansFormatted.textContent = `${formatComma(currentBeans)} Beans`;
        }
        renderZeroEstimates();
      });

      beansCustomInput.addEventListener('blur', () => {
        if (!beansCustomInput.value.trim()) {
          currentBeans = 0;
          beansCustomInput.value = '0';
          if (beansFormatted) beansFormatted.textContent = '0 Beans';
          renderZeroEstimates();
        }
      });

      beansCustomInput.addEventListener('paste', (e) => {
        e.preventDefault();
        const pasteData = (e.clipboardData || window.clipboardData).getData('text');
        const cleanDigits = sanitizeDigitsOnly(pasteData);
        if (cleanDigits) {
          currentBeans = parseInt(cleanDigits, 10);
          beansCustomInput.value = formatComma(currentBeans);
          if (beansFormatted) beansFormatted.textContent = `${formatComma(currentBeans)} Beans`;
          renderZeroEstimates();
        }
      });
    }

    // ========================================================================
    // 4. VALID DAYS & VALID HOURS MANUAL INPUTS WITH STRICT WARNINGS
    // ========================================================================
    function validateDays(val) {
      const isInvalid = val < 0 || val > 31;
      if (daysError) {
        if (isInvalid) {
          daysError.classList.add('visible');
        } else {
          daysError.classList.remove('visible');
        }
      }
      if (validDaysInput) {
        if (isInvalid) {
          validDaysInput.closest('.numeric-input-wrapper')?.classList.add('input-error-border');
        } else {
          validDaysInput.closest('.numeric-input-wrapper')?.classList.remove('input-error-border');
        }
      }
      return !isInvalid;
    }

    function validateHours(val) {
      const isInvalid = val < 0 || val > 155;
      if (hoursError) {
        if (isInvalid) {
          hoursError.classList.add('visible');
        } else {
          hoursError.classList.remove('visible');
        }
      }
      if (validHoursInput) {
        if (isInvalid) {
          validHoursInput.closest('.numeric-input-wrapper')?.classList.add('input-error-border');
        } else {
          validHoursInput.closest('.numeric-input-wrapper')?.classList.remove('input-error-border');
        }
      }
      return !isInvalid;
    }

    if (validDaysInput) {
      validDaysInput.addEventListener('input', (e) => {
        const digits = sanitizeDigitsOnly(e.target.value);
        e.target.value = digits;
        
        const rawNum = digits ? parseInt(digits, 10) : 0;
        currentDays = rawNum;

        if (daysValDisplay) {
          daysValDisplay.textContent = `${rawNum} Days`;
        }
        validateDays(rawNum);
        renderZeroEstimates();
      });

      validDaysInput.addEventListener('blur', () => {
        if (!validDaysInput.value.trim()) {
          currentDays = 0;
          validDaysInput.value = '0';
          if (daysValDisplay) daysValDisplay.textContent = '0 Days';
          validateDays(0);
          renderZeroEstimates();
        }
      });
    }

    if (validHoursInput) {
      validHoursInput.addEventListener('input', (e) => {
        const clean = sanitizeDecimal(e.target.value);
        e.target.value = clean;
        
        const rawNum = clean ? parseFloat(clean) : 0;
        currentHours = rawNum;

        if (hoursValDisplay) {
          hoursValDisplay.textContent = `${formatDecimal(rawNum)} Hours`;
        }
        validateHours(rawNum);
        renderZeroEstimates();
      });

      validHoursInput.addEventListener('blur', () => {
        if (!validHoursInput.value.trim()) {
          currentHours = 0;
          validHoursInput.value = '0';
          if (hoursValDisplay) hoursValDisplay.textContent = '0 Hours';
          validateHours(0);
          renderZeroEstimates();
        }
      });
    }

    // Allow Enter key on any input to trigger calculate
    [beansCustomInput, validDaysInput, validHoursInput].forEach(inp => {
      if (!inp) return;
      inp.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          inp.blur();
          calculateAndRender();
        }
      });
    });

    // ========================================================================
    // 5. BUTTON ACTIONS: CALCULATE NOW & RESET
    // ========================================================================
    if (calculateBtn) {
      calculateBtn.addEventListener('click', () => {
        calculateAndRender();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        selectStatus('premium');
        
        currentBeans = 130000;
        if (beansCustomInput) beansCustomInput.value = formatComma(130000);
        if (beansFormatted) beansFormatted.textContent = '130,000 Beans';

        currentDays = 15;
        if (validDaysInput) validDaysInput.value = '15';
        if (daysValDisplay) daysValDisplay.textContent = '15 Days';
        validateDays(15);

        currentHours = 40;
        if (validHoursInput) validHoursInput.value = '40';
        if (hoursValDisplay) hoursValDisplay.textContent = '40 Hours';
        validateHours(40);

        updateInputUI();
        renderZeroEstimates();
      });
    }

    // Scroll to Top Smooth Action
    const scrollToTopBtn = document.getElementById('scroll-to-top-btn');
    if (scrollToTopBtn) {
      scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // ========================================================================
    // 6. UI HELPERS: UPDATE INPUT UI & RENDER ESTIMATES
    // ========================================================================
    function updateInputUI() {
      // Toggle duration bonus controls based on status
      if (durationInputsSection) {
        if (currentStatus === 'new') {
          durationInputsSection.classList.add('hidden');
        } else {
          durationInputsSection.classList.remove('hidden');
        }
      }

      if (durationBonusRow) {
        if (currentStatus === 'new') {
          durationBonusRow.classList.add('hidden');
        } else {
          durationBonusRow.classList.remove('hidden');
        }
      }

      if (beansFormatted) {
        beansFormatted.textContent = `${formatComma(currentBeans)} Beans`;
      }
      if (daysValDisplay) {
        daysValDisplay.textContent = `${currentDays} Days`;
      }
      if (hoursValDisplay) {
        hoursValDisplay.textContent = `${formatDecimal(currentHours)} Hours`;
      }

      if (ledgerBeansSubtext) {
        if (currentStatus === 'new') {
          ledgerBeansSubtext.textContent = 'Akumulasi Pencapaian + Bonus Host';
        } else {
          ledgerBeansSubtext.textContent = 'Akumulasi Pencapaian + Bonus Host + Bonus Duration';
        }
      }
    }

    /**
     * Resets Card 2 (Estimasi Penghasilan) to 0 until CALCULATE NOW is clicked
     */
    function renderZeroEstimates() {
      if (totalIdrDisplay) totalIdrDisplay.textContent = '0';
      if (totalUsdDisplay) totalUsdDisplay.textContent = '0.00';
      if (totalBeansDisplay) totalBeansDisplay.textContent = 'Total 0 Beans';

      if (statusTierBadge) statusTierBadge.textContent = 'Menunggu Kalkulasi';

      if (breakdownBaseBeans) breakdownBaseBeans.textContent = '0 Beans';
      if (rowTargetIdr) rowTargetIdr.textContent = 'Rp 0';
      if (rowTargetUsd) rowTargetUsd.textContent = '$ 0.00';

      if (breakdownBonusBeans) breakdownBonusBeans.textContent = '+0 Beans';
      if (breakdownBonusRule) breakdownBonusRule.textContent = '(-)';
      if (rowBonusIdr) rowBonusIdr.textContent = 'Rp 0';
      if (rowBonusUsd) rowBonusUsd.textContent = '$ 0.00';

      if (breakdownDurationBeans) breakdownDurationBeans.textContent = '+0 Beans';
      if (breakdownDurationRule) breakdownDurationRule.textContent = '(-)';
      if (rowDurationIdr) rowDurationIdr.textContent = 'Rp 0';
      if (rowDurationUsd) rowDurationUsd.textContent = '$ 0.00';

      if (breakdownNetBeans) breakdownNetBeans.textContent = '0 Beans';
      if (breakdownNetIdrSum) breakdownNetIdrSum.textContent = 'Rp 0';
      if (breakdownNetUsdSum) breakdownNetUsdSum.textContent = '$ 0.00';

      if (advisorText) {
        advisorText.innerHTML = 'Silakan masukkan target Beans dan durasi siaran Anda, lalu klik tombol <strong>CALCULATE NOW</strong> untuk melihat estimasi penghasilan.';
      }
    }

    /**
     * Executes the calculation engine and displays the full financial estimate
     */
    function calculateAndRender() {
      // Execute calculation engine (clamp effective calculation inputs to policy maxima)
      const calcDays = Math.min(POLICY_CONSTANTS.DAYS_MAX, Math.max(0, currentDays));
      const calcHours = Math.min(POLICY_CONSTANTS.HOURS_MAX, Math.max(0, currentHours));
      const result = calculateEstimatedIncome(currentStatus, currentBeans, calcDays, calcHours);

      // Top formatted tags
      if (statusTierBadge) statusTierBadge.textContent = result.tierName;

      // 1. HERO RESULTS DISPLAY: IDR & USD
      const safeIdrVal = Number.isFinite(result.idrValue) ? result.idrValue : 0;
      const safeUsdVal = Number.isFinite(result.usdValue) ? result.usdValue : 0;
      const rateBeansToUsd = POLICY_CONSTANTS.EXCHANGE_RATE_BEANS_TO_USD || POLICY_CONSTANTS.BEANS_PER_USD || 210;
      const rateUsdToIdr = POLICY_CONSTANTS.USD_TO_IDR_RATE || 17800;

      if (totalIdrDisplay) totalIdrDisplay.textContent = formatCurrencyIDR(safeIdrVal);
      if (totalUsdDisplay) totalUsdDisplay.textContent = formatCurrencyUSD(safeUsdVal);
      if (totalBeansDisplay) totalBeansDisplay.textContent = `Total ${formatComma(result.totalBeans || 0)} Beans`;

      // 2. ROW 1: TARGET BEANS
      const targetBeans = Number(result.baseBeans) || 0;
      const targetUsd = targetBeans / rateBeansToUsd;
      const targetIdr = Math.round(targetUsd * rateUsdToIdr);

      if (breakdownBaseBeans) breakdownBaseBeans.textContent = `${formatComma(targetBeans)} Beans`;
      if (rowTargetIdr) rowTargetIdr.textContent = `Rp ${formatCurrencyIDR(targetIdr)}`;
      if (rowTargetUsd) rowTargetUsd.textContent = `$ ${formatCurrencyUSD(targetUsd)}`;

      // 3. ROW 2: BONUS BEANS BIGO (GARANSI)
      const hostBonus = Number(result.hostBonus) || 0;
      const bonusUsd = hostBonus / rateBeansToUsd;
      const bonusIdr = Math.round(bonusUsd * rateUsdToIdr);

      if (breakdownBonusBeans) breakdownBonusBeans.textContent = `+${formatComma(hostBonus)} Beans`;
      if (breakdownBonusRule) breakdownBonusRule.textContent = `(${result.hostBonusRule})`;
      if (rowBonusIdr) rowBonusIdr.textContent = `Rp ${formatCurrencyIDR(bonusIdr)}`;
      if (rowBonusUsd) rowBonusUsd.textContent = `$ ${formatCurrencyUSD(bonusUsd)}`;

      // 4. ROW 3: BONUS DURATION (Khusus Premium Host)
      if (currentStatus === 'premium') {
        const durationBonus = Number(result.durationBonus) || 0;
        const durUsd = durationBonus / rateBeansToUsd;
        const durIdr = Math.round(durUsd * rateUsdToIdr);

        if (breakdownDurationBeans) breakdownDurationBeans.textContent = `+${formatComma(durationBonus)} Beans`;
        if (breakdownDurationRule) breakdownDurationRule.textContent = `(${result.durationBonusRule})`;
        if (rowDurationIdr) rowDurationIdr.textContent = `Rp ${formatCurrencyIDR(durIdr)}`;
        if (rowDurationUsd) rowDurationUsd.textContent = `$ ${formatCurrencyUSD(durUsd)}`;
      }

      // 5. ROW 4: TOTAL BEANS SUMMARY & LEDGER SUBTEXT
      if (breakdownNetBeans) {
        breakdownNetBeans.textContent = `${formatComma(result.totalBeans || 0)} Beans`;
      }

      // Grand Total Right Side
      if (breakdownNetIdrSum) {
        breakdownNetIdrSum.textContent = `Rp ${formatCurrencyIDR(result.idrValue)}`;
      }
      if (breakdownNetUsdSum) {
        breakdownNetUsdSum.textContent = `$ ${formatCurrencyUSD(result.usdValue)}`;
      }

      // 6. ADVISOR TEXT
      if (advisorText) {
        advisorText.innerHTML = generateAdvisorRecommendation(currentStatus, currentBeans, calcDays, calcHours);
      }

      // Visual feedback micro-animation
      if (resultsCard) {
        resultsCard.classList.remove('pulse-glow');
        void resultsCard.offsetWidth; // Trigger reflow
        resultsCard.classList.add('pulse-glow');
      }

      // Smooth scroll to results on mobile devices
      if (window.innerWidth <= 992 && resultsCard) {
        resultsCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    // Initial setup: display defaults with 0 estimates until user clicks calculate
    updateInputUI();
    renderZeroEstimates();
  }

  return {
    initUIController
  };
});
