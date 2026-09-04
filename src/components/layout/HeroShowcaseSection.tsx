import React from 'react';

export const HeroShowcaseSection: React.FC = React.memo(() => {
  return (
    <section className="hero-banner-section" aria-label="Hero Banner">
      <div className="hero-banner-left">
        <div className="hero-brand-tag">
          <span className="hero-brand-pulse"></span>
          <span>ALFA X | BIGO LIVE</span>
          <span className="hero-year-badge">2026</span>
        </div>
        <div className="hero-script-tag">Calculate Your</div>
        <h1 className="hero-main-title">
          <span className="hero-title-bigo">BIGO LIVE</span>
          <span className="hero-title-calc">INCOME CALCULATOR</span>
        </h1>
        <p className="hero-subtitle">
          Hitung estimasi penghasilanmu di BIGO Live dengan mudah dan akurat.
        </p>
      </div>

      {/* 3D Rendered Golden Calculator & Dino Mascot Scene (Seamless herosection.jpg via CSS) */}
      <div className="hero-banner-right" aria-hidden="true"></div>
    </section>
  );
});

HeroShowcaseSection.displayName = 'HeroShowcaseSection';
