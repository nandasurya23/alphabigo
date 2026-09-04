import React from 'react';

export const NotePentingCard: React.FC = React.memo(() => {
  return (
    <section className="studio-card note-penting-card" aria-label="Catatan Penting Regulasi">
      <div className="note-left-col">
        <div className="note-3d-badge-wrap">
          <div className="note-3d-icon-box">
            {/* 3D Gold Notepad SVG */}
            <svg width="42" height="42" viewBox="0 0 48 48" fill="none">
              <rect
                x="8"
                y="6"
                width="32"
                height="36"
                rx="6"
                fill="url(#goldNotepadGrad)"
                stroke="#FFE28A"
                strokeWidth="2"
              />
              <line
                x1="16"
                y1="16"
                x2="32"
                y2="16"
                stroke="#4A3408"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <line
                x1="16"
                y1="23"
                x2="32"
                y2="23"
                stroke="#4A3408"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <line
                x1="16"
                y1="30"
                x2="26"
                y2="30"
                stroke="#4A3408"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="34" cy="34" r="8" fill="#141414" stroke="#DFB15B" strokeWidth="1.5" />
              <path
                d="M34 29l1.5 3.5 3.5.5-2.5 2.5.6 3.5-3.1-1.7-3.1 1.7.6-3.5-2.5-2.5 3.5-.5z"
                fill="#FFE28A"
              />
              <defs>
                <linearGradient
                  id="goldNotepadGrad"
                  x1="8"
                  y1="6"
                  x2="40"
                  y2="42"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#FFE79A" />
                  <stop offset="0.5" stopColor="#DFB15B" />
                  <stop offset="1" stopColor="#9C6F1E" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="note-title-heading">
            <span className="note-title-line1">NOTE</span>
            <span className="note-title-line2">PENTING</span>
          </div>
        </div>
      </div>

      <div className="note-center-col">
        <ul className="note-rules-list">
          <li>
            Konversi BIGO adalah <strong>210 Beans = 1 USD</strong>.
          </li>
          <li>
            Acuan perhitungan pada Calculator menggunakan kurs <strong>Rp17.800/USD</strong>.
          </li>
          <li>
            Hasil perhitungan estimasi diatas belum termasuk pajak penarikan/biaya administrasi BIGO.
          </li>
        </ul>
      </div>

      <div className="note-right-col">
        <div className="note-dino-wrap">
          <picture>
            <source srcSet="/images/bigo_dino.webp" type="image/webp" />
            <img
              src="/images/bigo_dino.png"
              alt="BIGO Dinosaur Mascot"
              className="note-dino-img"
              loading="lazy"
              decoding="async"
              width="102"
              height="102"
            />
          </picture>
        </div>
      </div>
    </section>
  );
});

NotePentingCard.displayName = 'NotePentingCard';
