# UI Component Architecture & Hierarchy
## ALPHA × BIGO HOST INCOME CALCULATOR

**Target Migration Stack**: **React (v18/v19) + Vite + TypeScript + Tailwind CSS v4**  
**Component Strategy**: **Zero External UI Libraries (Tanpa Shadcn UI / Tanpa Radix UI)**  
**Design Standard**: Black & Gold 3D Luxury (Aligned with Reference Mockup & Owner 9-Point Revisions)  
**Author**: Senior Frontend Architect  
**Status**: 100% Synchronized with Current Codebase Implementation  

---

> [!CAUTION]
> ### ATURAN MIGRASI: JANGAN MENGHAPUS 100% CSS YANG SUDAH ADA!
> Seluruh styling visual (3D Gold Luxury, background banner, pulse glow, custom borders, responsive rules) telah disempurnakan di modul CSS (`variables.css`, `base.css`, `layout.css`, `components.css`, `responsive.css`).
> **DILARANG MENGHAPUS 100% CSS INI**. Pindahkan ke `src/styles/` dan import langsung ke React. **Tailwind CSS hanya dipakai seperlunya saja** sebagai utility helper pelengkap.

---

## 1. Architectural Component Tree

Diagram berikut merepresentasikan dekomposisi komponen React murni dengan *unidirectional data flow* dan custom hook `useCalculator`:

```text
App (src/App.tsx)
  |
  +-- AppShell (Container pembungkus max-w-7xl mx-auto)
        |
        +-- AppHeader (src/components/layout/AppHeader.tsx)
        |     |-- CoBrandingAlpha (Logo alphalogo.jpg & badge "ENTERTAINMENT")
        |     |-- BrandDivider (Pemisah geometris dot)
        |     |-- CoBrandingBigo (Logo bigo.png & badge "OFFICIAL PARTNER")
        |     +-- StatusCapsule (Live chips: Q2-April 2026, 210B=$1, Rp 17.800/$)
        |
        +-- HeroShowcaseSection (src/components/layout/HeroShowcaseSection.tsx)
        |     |-- Background (Desktop: images/herosection.jpg | Mobile/Tablet: images/herosection_mobile.jpg)
        |     |-- HeroLeftBlock (Teks judul pada area gelap)
        |     |     |-- BrandTag ("ALFA X | BIGO LIVE 2026")
        |     |     |-- ScriptTag ("Calculate Your" - font Dancing Script)
        |     |     |-- MainTitle ("BIGO LIVE" & "INCOME CALCULATOR")
        |     |     +-- Subtitle ("Hitung estimasi penghasilanmu di BIGO Live dengan mudah dan akurat.")
        |     |
        |     +-- HeroRightBlock (Spacer layout; visual 3D Gold Calculator & Dino menyatu di background gambar)
        |
        +-- CockpitGrid (src/components/calculator/CockpitGrid.tsx)
              |
              +-- InputPanel (src/components/calculator/InputPanel.tsx) [Card 1: INPUT DATA]
              |     |-- GoldCubeHeader (Cube "1" + "INPUT DATA")
              |     |
              |     |-- HostCategoryDropdown (src/components/calculator/HostCategoryDropdown.tsx)
              |     |     |-- Label ("KATEGORI HOST" + tooltip "?")
              |     |     |-- TriggerButton (Crown icon, label aktif, chevron)
              |     |     +-- DropdownMenu ("New Host (Bulan 1-3)" vs "Premium Host (Bulan 4 sampai seterusnya)")
              |     |
              |     |-- TargetBeansInput (src/components/calculator/TargetBeansInput.tsx)
              |     |     |-- Label ("TARGET BEANS" + formatted pill)
              |     |     +-- NumericInputBar (3D gold bean icon, strict digit input dengan koma otomatis, tag "Beans")
              |     |
              |     |-- DurationInputsSection (src/components/calculator/DurationInputsSection.tsx) [Hidden jika New Host]
              |     |     |-- ValidDaysInputBar (Calendar icon, manual input, tag "Days", error alert jika > 31)
              |     |     +-- ValidHoursInputBar (Timer icon, manual decimal input, tag "Hours", error alert jika > 155)
              |     |
              |     +-- FormActionsGroup
              |           |-- CalculateNowButton (Pill emas besar: "CALCULATE NOW ❯" - Pemicu Eksekusi Kalkulasi)
              |           +-- ResetButton ("Reset Parameter Standar" - Reset form & nilai estimasi ke 0)
              |
              +-- ResultPanel (src/components/calculator/ResultPanel.tsx) [Card 2: ESTIMASI PENGHASILAN]
                    |-- GoldCubeHeader (Cube "2" + "ESTIMASI PENGHASILAN" + badge "HASIL ESTIMASI ✦")
                    |
                    |-- HeroIncomeBox (src/components/calculator/HeroIncomeBox.tsx)
                    |     |-- HeroLabel ("TOTAL ESTIMASI PENGHASILAN")
                    |     |-- DualValues (Awal: "Rp 0 | $ 0.00" -> Terhitung setelah klik Calculate: "Rp 16,723,524 | $ 939.52")
                    |     +-- BeansCapsule (Awal: "Total 0 Beans" -> Terhitung: "Total 197,300 Beans")
                    |
                    |-- BreakdownLedger (src/components/calculator/BreakdownLedger.tsx)
                    |     |-- LedgerHeader ("Rincian Komponen Penghasilan" + Tier Badge: "Menunggu Kalkulasi" saat awal)
                    |     |-- BreakdownItemCard (Target Beans: Rp 0 / $ 0.00 awal -> nominal terhitung saat kalkulasi)
                    |     |-- BreakdownItemCard (Bonus Beans BIGO: Rp 0 / $ 0.00 awal -> nominal terhitung saat kalkulasi)
                    |     |-- BreakdownItemCard (Bonus Duration: Rp 0 / $ 0.00 awal -> nominal terhitung saat kalkulasi) [Hidden jika New Host]
                    |     +-- TotalSummaryCard (TOTAL BEANS, subtext "Akumulasi Pencapaian + Bonus Host" tanpa '+ Durasi' untuk New Host, Total Estimasi IDR & USD)
                    |
                    +-- AdvisorCard (src/components/calculator/AdvisorCard.tsx)
                          |-- AdvisorBadge ("OPTIMASI PENDAPATAN HOST")
                          +-- AdvisorRecommendationText (Awal: panduan klik calculate -> Terhitung: rekomendasi kenaikan target)
        |
        +-- NotePentingCard (src/components/common/NotePentingCard.tsx) [Card 3: Full-Width di Bawah]
        |     |-- NoteLeftCol (Ikon 3D Notepad Emas + Judul "NOTE PENTING")
        |     |-- NoteCenterCol (3 Bullet Regulasi: 210B=$1, Kurs Rp17.800/USD, Belum termasuk pajak/adm)
        |     +-- NoteRightCol (Maskot Dino Bigo transparan: images/bigo_dino.png)
        |
        +-- AppFooter (src/components/layout/AppFooter.tsx)
              |-- BrandCopyrightLockup ("ALFA X BIGO | Empowering Hosts, Creating Impact. ✨")
              |-- MetaLockup ("Q2-April 2026 • 210 Beans = $1 • Rp 17.800 / $")
              +-- ScrollToTopButton
```

---

## 2. Complete Custom React Component Implementations (No Shadcn)

### 2.1. `HostCategoryDropdown.tsx` (Custom Dropdown Murni)
Komponen dropdown kustom menggantikan tag `<select>` native dengan aksesibilitas keyboard dan animasi visual:

```tsx
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Crown } from 'lucide-react';
import { HostStatus } from '@/types/calculator';

interface HostCategoryDropdownProps {
  status: HostStatus;
  onStatusChange: (status: HostStatus) => void;
}

export const HostCategoryDropdown: React.FC<HostCategoryDropdownProps> = ({
  status,
  onStatusChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const options: { value: HostStatus; title: string; tag: string; desc: string; isGold?: boolean }[] = [
    {
      value: 'new',
      title: 'New Host (Bulan 1-3)',
      tag: 'Persentase (Cap 360K)',
      desc: 'Tier 50%, 85%, hingga 90% dikalikan total Beans. Duration Bonus ditiadakan.',
    },
    {
      value: 'premium',
      title: 'Premium Host (Bulan 4 sampai seterusnya)',
      tag: 'Flat & Progresif',
      desc: 'Flat bonus (2K–100K Beans) & persentase (mulai 130K Beans) + Duration Bonus.',
      isGold: true,
    },
  ];

  const currentOption = options.find((opt) => opt.value === status) || options[1];

  return (
    <div className="flex flex-col gap-2 w-full" ref={containerRef}>
      <div className="flex justify-between items-center">
        <label className="text-xs font-extrabold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
          <span>KATEGORI HOST</span>
          <span className="w-4 h-4 rounded-full border border-amber-500/40 text-amber-400 text-[10px] flex items-center justify-center cursor-help">
            ?
          </span>
        </label>
        <span className="text-xs font-bold text-amber-400 bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded">
          {status === 'new' ? 'Bulan 1-3' : 'Bulan 4 sampai seterusnya'}
        </span>
      </div>

      <div className="relative w-full">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          className="w-full flex justify-between items-center bg-neutral-900 border border-neutral-800 rounded-md px-3.5 py-3 text-sm font-bold text-white hover:border-neutral-700 focus:border-amber-400 transition-colors"
        >
          <span className="flex items-center gap-2.5 truncate">
            <Crown className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="truncate">{currentOption.title}</span>
          </span>
          <ChevronDown
            className={`w-4 h-4 text-amber-400 transition-transform duration-200 shrink-0 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-neutral-950 border border-neutral-800 rounded-md z-50 overflow-hidden shadow-2xl">
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => {
                  onStatusChange(option.value);
                  setIsOpen(false);
                }}
                className={`p-3.5 cursor-pointer border-b border-neutral-900 last:border-none transition-colors ${
                  status === option.value
                    ? 'bg-amber-950/40 border-l-2 border-l-amber-400'
                    : 'hover:bg-neutral-900'
                }`}
              >
                <div className="flex justify-between items-center gap-2">
                  <span
                    className={`text-sm font-extrabold ${
                      status === option.value ? 'text-amber-300' : 'text-neutral-100'
                    }`}
                  >
                    {option.title}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
                      option.isGold
                        ? 'bg-amber-950 text-amber-400 border border-amber-700'
                        : 'bg-neutral-900 text-neutral-400'
                    }`}
                  >
                    {option.tag}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-1">{option.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
```

---

### 2.2. `ValidDaysInputBar.tsx` & `ValidHoursInputBar.tsx` (Manual Numeric Inputs Murni)

```tsx
import React from 'react';
import { Calendar, Timer } from 'lucide-react';

interface ManualDurationInputProps {
  label: string;
  value: number;
  max: number;
  unit: string;
  icon: 'calendar' | 'timer';
  errorMsg: string;
  onChange: (val: number) => void;
}

export const ManualDurationInputBar: React.FC<ManualDurationInputProps> = ({
  label,
  value,
  max,
  unit,
  icon,
  errorMsg,
  onChange,
}) => {
  const isInvalid = value < 0 || value > max;

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex justify-between items-center">
        <label className="text-xs font-extrabold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
          <span>{label}</span>
          <span className="w-4 h-4 rounded-full border border-amber-500/40 text-amber-400 text-[10px] flex items-center justify-center cursor-help">
            ?
          </span>
        </label>
        <span className="text-xs font-extrabold text-amber-300 bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded tabular-nums">
          {value} {unit}
        </span>
      </div>

      <div
        className={`flex items-center bg-neutral-900 border rounded-md px-3.5 transition-all ${
          isInvalid
            ? 'border-red-500 ring-1 ring-red-500/30'
            : 'border-neutral-800 focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400/20'
        }`}
      >
        <div className="text-amber-400 shrink-0 mr-3">
          {icon === 'calendar' ? <Calendar className="w-5 h-5" /> : <Timer className="w-5 h-5" />}
        </div>
        <input
          type="text"
          value={value === 0 ? '' : value}
          onChange={(e) => {
            const raw = e.target.value.replace(/[^0-9.]/g, '');
            onChange(raw === '' ? 0 : parseFloat(raw) || 0);
          }}
          placeholder="0"
          className="flex-1 bg-transparent border-none py-3 text-lg font-extrabold text-white outline-none tabular-nums"
        />
        <span className="text-xs font-extrabold text-amber-400 tracking-wider capitalize shrink-0 ml-2">
          {unit}
        </span>
      </div>

      {isInvalid && (
        <span className="text-xs font-bold text-red-400 mt-0.5">{errorMsg}</span>
      )}
    </div>
  );
};
```

---

### 2.3. `NotePentingCard.tsx` (Card 3 di Bagian Bawah)

```tsx
import React from 'react';

export const NotePentingCard: React.FC = () => {
  return (
    <section className="w-full bg-gradient-to-b from-[#16130C] to-[#110E07] border border-amber-500/30 rounded-xl p-5 md:p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
      {/* Left Column: 3D Gold Badge & Heading */}
      <div className="flex items-center gap-3.5 shrink-0">
        <div className="w-12 h-12 flex items-center justify-center shrink-0 drop-shadow-[0_4px_10px_rgba(223,177,91,0.3)]">
          <svg width="42" height="42" viewBox="0 0 48 48" fill="none">
            <rect x="8" y="6" width="32" height="36" rx="6" fill="#DFB15B" stroke="#FFE28A" strokeWidth="2"/>
            <line x1="16" y1="16" x2="32" y2="16" stroke="#4A3408" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="16" y1="23" x2="32" y2="23" stroke="#4A3408" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="16" y1="30" x2="26" y2="30" stroke="#4A3408" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="34" cy="34" r="8" fill="#141414" stroke="#DFB15B" strokeWidth="1.5"/>
            <path d="M34 29l1.5 3.5 3.5.5-2.5 2.5.6 3.5-3.1-1.7-3.1 1.7.6-3.5-2.5-2.5 3.5-.5z" fill="#FFE28A"/>
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-black tracking-wider text-[#FFE58F] leading-none">NOTE</span>
          <span className="text-lg font-black tracking-wider text-amber-400 leading-none">PENTING</span>
        </div>
      </div>

      {/* Center Column: Bullet Rules */}
      <div className="flex-1 md:border-l border-amber-500/20 md:pl-6 w-full">
        <ul className="space-y-2 text-xs md:text-sm text-neutral-300">
          <li className="flex items-start gap-2">
            <span className="text-amber-400 font-bold text-base leading-none">•</span>
            <span>Konversi BIGO adalah <strong className="text-white">210 Beans = 1 USD</strong>.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 font-bold text-base leading-none">•</span>
            <span>Acuan perhitungan pada Calculator menggunakan kurs <strong className="text-white">Rp17.800/USD</strong>.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 font-bold text-base leading-none">•</span>
            <span>Hasil perhitungan estimasi diatas belum termasuk pajak penarikan/biaya administrasi BIGO.</span>
          </li>
        </ul>
      </div>

      {/* Right Column: Bigo Dino Mascot */}
      <div className="w-20 h-20 shrink-0 flex items-center justify-center">
        <img
          src="/images/bigo_dino.png"
          alt="Bigo Dinosaur Mascot"
          className="w-full h-full object-contain"
        />
      </div>
    </section>
  );
};
```
