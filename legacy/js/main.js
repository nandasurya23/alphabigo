/**
 * ALPHA × BIGO HOST INCOME CALCULATOR - APPLICATION ENTRYPOINT
 * Bootstraps all modules on DOMContentLoaded
 */

(function () {
  'use strict';

  function boot() {
    if (!window.AlphaBigo) {
      console.error('[AlphaBigo] Modules failed to load.');
      return;
    }

    const { policies, formatters, calc, advisor, ui } = window.AlphaBigo;

    if (!policies || !formatters || !calc || !advisor || !ui) {
      console.error('[AlphaBigo] Incomplete module dependencies.');
      return;
    }

    ui.initUIController({
      policies,
      formatters,
      calc,
      advisor
    });

    console.log('[AlphaBigo] Cockpit Studio Engine successfully initialized.');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
