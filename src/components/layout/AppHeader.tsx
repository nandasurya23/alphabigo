import React from 'react';

export const AppHeader: React.FC = React.memo(() => {
  return (
    <header className="app-header">
      <div className="header-container">
        {/* Unified Co-Branding Lockup */}
        <div className="brand-lockup">
          {/* Alpha Entertainment */}
          <div className="brand-unit alpha-unit">
            <div className="brand-avatar alpha-avatar">
              <img
                src="/alphalogo.jpg"
                alt="Alpha Entertainment"
                className="avatar-img"
                width="36"
                height="36"
                decoding="async"
              />
            </div>
            <div className="brand-meta">
              <span className="brand-primary-name">ALPHA</span>
              <span className="brand-sub-badge">ENTERTAINMENT</span>
            </div>
          </div>

          {/* Subtle Geometric Divider */}
          <div className="brand-separator" aria-hidden="true">
            <span className="sep-dot"></span>
          </div>

          {/* BIGO LIVE */}
          <div className="brand-unit bigo-unit">
            <div className="brand-avatar bigo-avatar">
              <img
                src="/bigo.png"
                alt="BIGO LIVE"
                className="avatar-img bigo-fit"
                width="36"
                height="36"
                decoding="async"
              />
            </div>
            <div className="brand-meta">
              <span className="brand-primary-name">BIGO LIVE</span>
              <span className="brand-sub-badge cyan-badge">OFFICIAL PARTNER</span>
            </div>
          </div>
        </div>

        {/* Sleek Status Capsule */}
        <div className="header-status-capsule">
          <div className="status-chip live-chip">
            <span className="pulse-indicator"></span>
            <span className="chip-text">Q2 - April 2026</span>
          </div>
          <div className="capsule-divider"></div>
          <div className="status-chip rate-chip">
            <span className="rate-metric">210 Beans <span className="rate-eq">=</span> $1</span>
          </div>
          <div className="capsule-divider"></div>
          <div className="status-chip fx-chip">
            <span className="fx-metric">Rp 17.800 <span className="rate-eq">/</span> $</span>
          </div>
        </div>
      </div>
    </header>
  );
});

AppHeader.displayName = 'AppHeader';
