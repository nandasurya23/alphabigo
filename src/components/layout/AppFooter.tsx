import React from 'react';

export const AppFooter: React.FC = React.memo(() => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-single-bar">
          <div className="footer-brand-lockup">
            <span className="footer-brand-title">ALPHA X BIGO</span>
            <span className="footer-dot-sep">|</span>
            <span className="footer-copy-text">© Created by Alpha Entertainment</span>
          </div>

          <div className="footer-meta-lockup">
            <span className="footer-tag">Q2-April 2026</span>
            <span className="footer-dot-sep">•</span>
            <span className="footer-tag">210 Beans = $1</span>
            <span className="footer-dot-sep">•</span>
            <span className="footer-tag">Rp 17.800 / $</span>
            <button
              type="button"
              id="scroll-to-top-btn"
              className="footer-top-link"
              aria-label="Kembali ke atas"
              onClick={scrollToTop}
            >
              <span>Ke Atas</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
});

AppFooter.displayName = 'AppFooter';
