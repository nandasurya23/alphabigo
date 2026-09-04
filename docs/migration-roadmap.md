# Production Migration & Modernization Roadmap
## ALPHA × BIGO HOST INCOME CALCULATOR

**Current State**: Modular Vanilla Web Application (`index.html`, `css/*.css`, `js/*.js`)  
**Target Migration Stack**: **React (v18/v19) + Vite + TypeScript + Tailwind CSS v4 + Vitest**  
**Design Standard**: Black & Gold 3D Luxury (Owner 9-Point Revisions & Reference Mockup)  
**Author**: Lead Technical Architect  
**Status**: Approved Architecture & Engineering Migration Blueprint  

---

## 1. Migration Vision & Architecture Objectives

Roadmap ini merinci panduan langkah demi langkah untuk memigrasikan codebase kalkulator dari arsitektur modular JavaScript murni ke ekosistem modern berbasis **React, Vite, TypeScript, dan Tailwind CSS v4**.

> [!CAUTION]
> ### ATURAN KRUSIAL MIGRASI: JANGAN MENGHAPUS 100% CSS YANG SUDAH ADA!
> Seluruh sistem styling yang ada saat ini (`css/variables.css`, `css/base.css`, `css/layout.css`, `css/components.css`, `css/responsive.css`) telah disempurnakan dan teruji presisi pixel demi pixel (efek *3D Gold Luxury*, *glassmorphism*, *pulse glow*, *custom borders*, kurva responsif mobile, dan latar belakang hero).
> 
> **DILARANG KERAS me-rewrite ulang atau membuang CSS yang sudah ada.**
> Saat migrasi ke React:
> 1. Pindahkan dan import langsung seluruh berkas CSS modular tersebut ke dalam proyek React (`src/styles/`).
> 2. **Tailwind CSS hanya digunakan seperlunya saja** (sebagai *utility helper* pelengkap), **BUKAN** untuk menggantikan atau merombak 100% CSS yang sudah ada, demi menjamin estetika desain tidak berubah sedikit pun!

### Pilar Utama Modernisasi:
1. **Preservasi Desain Absolut (CSS-First Preservation)**: Mempertahankan 100% modul CSS yang sudah ada (`variables.css`, `base.css`, `layout.css`, `components.css`, `responsive.css`). Desain tidak boleh bergeser atau berubah.
2. **Tailwind CSS Dipakai Seperlunya Saja**: Digunakan hanya untuk utility dinamis tambahan atau state helpers minor, tanpa membuang arsitektur CSS yang ada.
3. **Ultra-Fast Developer Experience (Vite + React)**: Waktu *cold start* instan (< 300ms) dan Hot Module Replacement (HMR) berkecepatan tinggi melalui esbuild dan Rollup.
4. **End-to-End Type Safety (TypeScript Strict Mode)**: Menjamin integritas data kalkulasi dan properti komponen bebas dari bug runtime, *null-pointer exceptions*, atau kesalahan tipe numerik.
5. **Zero External UI Dependency (Tanpa Shadcn UI / Tanpa Radix UI)**: Seluruh komponen interaktif (Dropdown, Input Bar, Card) mempertahankan markup dan class yang sudah ada tanpa dependensi pihak ketiga yang berat.
6. **State Machine & Deferred Calculation (`useCalculator`)**: State kalkulator diisolasi dalam custom hook dengan alur perhitungan tertunda (*deferred calculation*): input menampilkan nilai 0 sampai tombol **CALCULATE NOW** ditekan.
7. **Zero-Regression Automated Testing (Vitest)**: Seluruh skenario verifikasi matematis diuji otomatis.

---

## 2. Directory & Component Architecture

Struktur direktori proyek setelah migrasi ke React + Vite + TS:

```text
alpha-bigo-calculator/
├── index.html                           # Entry point HTML dengan Google Fonts (Dancing Script & Plus Jakarta Sans)
├── vite.config.ts                       # Konfigurasi Vite + @tailwindcss/vite
├── tsconfig.json                        # TypeScript strict compiler options
├── tsconfig.node.json
├── package.json
├── public/
│   ├── alphalogo.jpg                    # Logo Alpha Entertainment
│   ├── bigo.png                         # Logo BIGO LIVE
│   ├── favicon.ico
│   └── images/
│       ├── herosection.jpg              # Full Seamless 3D Hero Banner (Desktop)
│       ├── herosection_mobile.jpg       # Vertical 3D Hero Banner (Mobile & Tablet)
│       ├── gold_bean.png                # 3D Gold Bean Icon (Input Target Beans)
│       └── bigo_dino.png               # Official BIGO Mascot Dino (Note Penting Card)
├── src/
│   ├── main.tsx                         # React root bootstrap
│   ├── App.tsx                          # AppShell & layout master container
│   ├── index.css                        # Entry CSS yang mengimpor modul CSS eksisting & Tailwind
│   │
│   ├── styles/                          # 100% PRESERVED MODULAR CSS (JANGAN DIHAPUS)
│   │   ├── variables.css                # CSS custom properties, tokens, palet gold & dark
│   │   ├── base.css                     # Reset, typography, font faces
│   │   ├── layout.css                   # App header, hero banner background, cockpit grid
│   │   ├── components.css               # Card studio, calculate button, 3D icons, ledger
│   │   └── responsive.css               # Zero-overflow media queries (Desktop, Tablet, Mobile)
│   │
│   ├── types/
│   │   ├── calculator.ts                # HostStatus, CalculationInput, CalculationResult
│   │   └── policy.ts                    # TierPolicy, DurationBonusRule, Constants
│   │
│   ├── constants/
│   │   └── policy-constants.ts          # Nilai tukar 210 Beans, Rp 17.800, daftar tier
│   │
│   ├── engine/
│   │   ├── calculation-engine.ts        # Pure calculation core (calculateEstimatedIncome)
│   │   ├── advisor-engine.ts            # Dynamic recommendations generator
│   │   └── formatters.ts                # formatComma, sanitizeDecimal, formatCurrencyIDR
│   │
│   ├── hooks/
│   │   └── useCalculator.ts             # State management & deferred calculation dispatch
│   │
│   └── components/
│       ├── layout/
│       │   ├── AppHeader.tsx            # Co-branding lockup & live status chips
│       │   ├── HeroShowcaseSection.tsx  # Hero Showcase (herosection.jpg desktop / herosection_mobile.jpg mobile)
│       │   └── AppFooter.tsx            # Executive slim footer & scroll-to-top
│       │
│       ├── calculator/
│       │   ├── InputPanel.tsx           # Container kolom input (Card 1: INPUT DATA)
│       │   ├── HostCategoryDropdown.tsx # Custom dropdown (New Host vs Premium Host)
│       │   ├── TargetBeansInput.tsx     # Strict numeric input & dynamic comma formatter (Beans)
│       │   ├── DurationInputsSection.tsx# Manual input bars: Valid Days (max 31) & Valid Hours (max 155)
│       │   ├── ResultPanel.tsx          # Container kolom output (Card 2: ESTIMASI PENGHASILAN)
│       │   ├── HeroIncomeBox.tsx        # Hero values (Rp 0 | $ 0.00 awal -> terhitung saat klik calculate)
│       │   ├── BreakdownLedger.tsx      # Accounting ledger dengan 3D circular gold icons & nominal IDR/USD
│       │   └── AdvisorCard.tsx          # Smart opportunity recommendations box
│       │
│       └── common/
│           ├── NotePentingCard.tsx      # Card 3 full-width regulasi di bawah (Notepad 3D + 3 Rules + bigo_dino.png)
│           └── InfoTooltip.tsx          # Popover info tanda tanya "?"
│
└── tests/
    ├── calculation-engine.test.ts       # 43+ test cases verifikasi matematis
    └── formatters.test.ts               # Sanitasi desimal & pemformatan angka
```

---

## 3. Step-by-Step Migration Phases

### Phase 1: Inisialisasi Proyek Vite + React + TypeScript

```bash
# 1. Buat project baru menggunakan Vite template react-ts
npm create vite@latest alpha-bigo-calculator -- --template react-ts

# 2. Masuk ke direktori
cd alpha-bigo-calculator

# 3. Install dependencies esensial (Lucide React untuk ikon, Vitest untuk pengujian)
npm install lucide-react
npm install -D @tailwindcss/vite tailwindcss @types/node vitest
```

### Phase 2: Konfigurasi Vite & Tailwind CSS v4

Konfigurasi `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### Phase 2: Konfigurasi Vite & Preservasi 100% CSS Eksisting

Konfigurasi `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

Konfigurasi `src/index.css` (Preservasi 100% CSS Modular + Tailwind v4 Seperlunya):

```css
/* ==========================================================================
   100% PRESERVED MODULAR CSS SYSTEM - DILARANG DIHAPUS / JANGAN DIREWRITE!
   Menjaga tampilan visual 3D Gold Luxury, background hero banner,
   pulse-glow, custom inputs, dan kurva media queries persis seperti aslinya.
   ========================================================================== */
@import "./styles/variables.css";
@import "./styles/base.css";
@import "./styles/layout.css";
@import "./styles/components.css";
@import "./styles/responsive.css";

/* Tailwind CSS v4 - HANYA DIPAKAI SEPERLUNYA SAJA (Utility Helpers Minor) */
@import "tailwindcss";

@theme {
  --color-gold-primary: #8B6508;
  --color-gold-accent: #DFB15B;
  --color-gold-bright: #FFD700;
  --color-dark-bg: #0A0A0A;
  --color-dark-surface: #141414;
  --color-bigo-cyan: #00D0D4;
  --font-display: 'Plus Jakarta Sans', -apple-system, sans-serif;
  --font-script: 'Dancing Script', cursive;
}
```

> [!IMPORTANT]
> **Panduan Penggunaan Styling:**
> - Tetap gunakan class CSS yang sudah terbukti presisi (seperti `.hero-banner-section`, `.hero-income-box`, `.btn-calculate-now`, `.studio-card`, `.breakdown-item-card`, dll).
> - **Tailwind CSS hanya digunakan seperlunya saja** untuk utility situasional (misalnya penyesuaian gap mikro, helper conditional render, atau flex alignment sederhana). Jangan mencoba mengganti 100% CSS yang sudah ada dengan class Tailwind murni karena akan mengubah detail bayangan 3D dan background hero banner.

---

### Phase 3: Migrasi Engine Kalkulasi & Custom Hook `useCalculator` (Deferred Calculation)

Sesuai spesifikasi resmi:
1. Nilai awal estimasi adalah **0** (menunggu klik tombol).
2. Saat user mengubah input (Beans, Days, Hours, Status), hasil estimasi **tidak langsung terhitung**, melainkan tetap **0**.
3. Hasil estimasi baru muncul setelah user mengklik tombol **CALCULATE NOW** (atau menekan `Enter`).

File `src/hooks/useCalculator.ts`:

```typescript
import { useState, useMemo, useCallback } from 'react';
import { HostStatus, CalculationResult } from '@/types/calculator';
import { calculateEstimatedIncome } from '@/engine/calculation-engine';
import { generateAdvisorRecommendation } from '@/engine/advisor-engine';

// Nilai nol standar sebelum user mengklik tombol calculate
const ZERO_CALCULATION_RESULT: CalculationResult = {
  tierName: 'Menunggu Kalkulasi',
  baseBeans: 0,
  hostBonus: 0,
  hostBonusRule: '(-)',
  durationBonus: 0,
  durationBonusRule: '(-)',
  totalBeans: 0,
  usdValue: 0,
  idrValue: 0,
};

const WAITING_ADVISOR_TEXT = 
  'Silakan masukkan target Beans dan durasi siaran Anda, lalu klik tombol <strong>CALCULATE NOW</strong> untuk melihat estimasi penghasilan.';

export function useCalculator() {
  const [status, setStatusState] = useState<HostStatus>('premium');
  const [beans, setBeansState] = useState<number>(130000);
  const [days, setDaysState] = useState<number>(15);
  const [hours, setHoursState] = useState<number>(40);

  // Status apakah perhitungan sudah dieksekusi via tombol CALCULATE NOW
  const [isCalculated, setIsCalculated] = useState<boolean>(false);

  // Reset estimasi ke 0 setiap kali input diubah oleh user
  const setStatus = useCallback((newStatus: HostStatus) => {
    setStatusState(newStatus);
    setIsCalculated(false);
  }, []);

  const setBeans = useCallback((newBeans: number) => {
    setBeansState(newBeans);
    setIsCalculated(false);
  }, []);

  const setDays = useCallback((newDays: number) => {
    setDaysState(newDays);
    setIsCalculated(false);
  }, []);

  const setHours = useCallback((newHours: number) => {
    setHoursState(newHours);
    setIsCalculated(false);
  }, []);

  // Eksekusi kalkulasi HANYA saat tombol CALCULATE NOW diklik atau user tekan Enter
  const calculate = useCallback(() => {
    setIsCalculated(true);
  }, []);

  // Evaluasi hasil estimasi: kembalikan 0 jika belum diklik calculate
  const result: CalculationResult = useMemo(() => {
    if (!isCalculated) {
      return ZERO_CALCULATION_RESULT;
    }
    const clampedDays = Math.min(31, Math.max(0, days));
    const clampedHours = Math.min(155, Math.max(0, hours));
    return calculateEstimatedIncome(status, beans, clampedDays, clampedHours);
  }, [isCalculated, status, beans, days, hours]);

  const advisorText = useMemo(() => {
    if (!isCalculated) {
      return WAITING_ADVISOR_TEXT;
    }
    const clampedDays = Math.min(31, Math.max(0, days));
    const clampedHours = Math.min(155, Math.max(0, hours));
    return generateAdvisorRecommendation(status, beans, clampedDays, clampedHours);
  }, [isCalculated, status, beans, days, hours]);

  const resetToStandard = useCallback(() => {
    setStatusState('premium');
    setBeansState(130000);
    setDaysState(15);
    setHoursState(40);
    setIsCalculated(false); // Reset estimasi ke 0
  }, []);

  return {
    status,
    setStatus,
    beans,
    setBeans,
    days,
    setDays,
    hours,
    setHours,
    isCalculated,
    calculate,
    result,
    advisorText,
    resetToStandard,
  };
}
```

---

### Phase 4: Pengujian Otomatis Zero-Regression (Vitest)

Menjalankan test suite Vitest untuk menjamin akurasi 100% dari 43+ skenario matematis serta alur deferred calculation:

```bash
npm run test
```

---

## 4. Key Differences Summary (Before vs After Migration)

| Area | Vanilla Implementation (Saat Ini) | React + Vite + TS (Target Migrasi) |
| :--- | :--- | :--- |
| **Arsitektur** | DOM manipulation manual di `ui-controller.js` | Komponen deklaratif murni berbasis state hook |
| **UI Controls** | Manual event listener (`input`, `blur`, `paste`) | Controlled React inputs dengan synthetic events |
| **Styling** | Modular vanilla CSS (`css/*.css`) | **100% Preserved Modular CSS** (`src/styles/*.css`) + Tailwind CSS v4 seperlunya saja |
| **UI Library** | Zero external library | Zero external library (Tanpa Shadcn UI) |
| **Alur Perhitungan** | Input mereset estimasi ke 0, kalkulasi via **CALCULATE NOW** | Deferred calculation via `calculate()` hook action |
| **Asset Banner** | `herosection.jpg` (desktop) & `herosection_mobile.jpg` (mobile) | Sama persis (`public/images/herosection*.jpg`) |
| **Type Safety** | Runtime JS (JSDoc annotations) | Strict TypeScript interfaces & compile-time validation |
| **Testing** | Node.js script runner | Vitest automated suite |
