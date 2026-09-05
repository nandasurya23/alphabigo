import React from 'react';

export const HeroShowcaseSection: React.FC = React.memo(() => {
  return (
    <section className="hero-banner-section" aria-label="Hero Banner">
      <div className="hero-banner-content">
        <div className="hero-brand-tag">
          <span className="hero-brand-pulse"></span>
          <span>ALPHA ENTERTAINMENT x BIGO LIVE</span>
        </div>
        <h1 className="hero-main-title">HOST INCOME CALCULATOR</h1>
        <p className="hero-subtitle">
          CALCULATE YOUR ESTIMATED BIGO EARNINGS
        </p>
      </div>
    </section>
  );
});

HeroShowcaseSection.displayName = 'HeroShowcaseSection';
