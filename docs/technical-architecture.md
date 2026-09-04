# Technical Architecture & Engine Data Model
## ALPHA × BIGO HOST INCOME CALCULATOR

**Domain**: Calculation Engine, Data Models & Architecture Specification  
**Platform**: BIGO LIVE Indonesia Policy Q2 (April 2026) & Official Owner Brief  
**Target Runtime**: **React (v18/v19) + Vite + TypeScript + Tailwind CSS v4** (Zero External UI Libraries / Pure Custom Components)  
**Author**: Lead Technical Architect  
**Status**: Specification Standard 100% Synchronized with Codebase  

---

> [!CAUTION]
> ### MANDAT TEKNIS MIGRASI: PRESERVASI 100% CSS EKSISTING
> Seluruh arsitektur visual kalkulator (`css/variables.css`, `css/base.css`, `css/layout.css`, `css/components.css`, `css/responsive.css`) wajib dipertahankan secara utuh pada migrasi ke React (`src/styles/`).
> **DILARANG MENGHAPUS 100% CSS YANG ADA.** Tailwind CSS v4 hanya digunakan seperlunya saja (*supplementary utilities*) agar identitas visual *3D Gold Luxury* dan kurva responsif mobile tidak mengalami deviasi desain.

---

## 1. Architectural Overview

Sistem kalkulator dibangun di atas prinsip arsitektur **Functional Core, Imperative Shell** dengan pola perhitungan tertunda (*Deferred Calculation Pattern*):

- **Functional Core (`src/engine/`)**: Seluruh komputasi matematis diisolasi ke dalam fungsi-fungsi murni (*pure functions*) yang deterministik, bebas dari efek samping (*side effects*), dan sepenuhnya independen dari framework UI maupun DOM browser. Engine ini dapat langsung dieksekusi di Node.js, Vitest, maupun custom React hook (`useCalculator`).
- **Imperative Shell (`src/components/` & `src/hooks/`)**: Mengelola state interaksi pengguna, formatting dinamis, sanitasi input, serta rendering tampilan berbasis **React murni yang mempertahankan 100% CSS eksisting** (Tailwind CSS dipakai seperlunya saja).

### Siklus State Perhitungan (Deferred Calculation Lifecycle):

```text
+-------------------------------------------------------------------------------+
| 1. INITIAL / RESET STATE                                                      |
|    - Inputs: Status 'premium', Beans 130,000, Days 15, Hours 40               |
|    - Card 2 Outputs: Tetap 0 (Rp 0 | $ 0.00, Total 0 Beans, Tier Menunggu)    |
+-------------------------------------------------------------------------------+
                                       |
                                       v
+-------------------------------------------------------------------------------+
| 2. USER INPUT / EDITING STATE                                                 |
|    - User mengetik Beans / Days / Hours atau mengganti Kategori Host          |
|    - Output Card 2: TIDAK LANGSUNG TERHITUNG, tetap di-reset ke 0             |
+-------------------------------------------------------------------------------+
                                       |
                                       v (User klik tombol "CALCULATE NOW" / Enter)
+-------------------------------------------------------------------------------+
| 3. CALCULATION EXECUTED STATE                                                 |
|    - calculateEstimatedIncome(...) dieksekusi oleh Calculation Engine         |
|    - Output Card 2: Menampilkan hasil estimasi penuh, breakdown ledger,       |
|      advisor card recommendation, dan trigger visual pulse-glow animation     |
+-------------------------------------------------------------------------------+
```

---

## 2. TypeScript Interfaces & Data Models

Berikut adalah spesifikasi kontrak data model dan antarmuka TypeScript baku yang **100% sinkron** dengan implementasi di `js/policy-constants.js` dan `js/calculation-engine.js`:

```typescript
/**
 * Tipe status masa kerja host di agensi Alpha Entertainment
 */
export type HostStatus = 'new' | 'premium';

/**
 * Model tier persentase untuk New Host (Bulan 1–3) - Tabel A.1
 */
export interface NewHostTierPolicy {
  readonly minBeans: number;
  readonly rate: number;
  readonly label: string;
}

/**
 * Model tier bonus flat untuk Premium Host (2K s/d 100K Beans) - Tabel A.2
 */
export interface PremiumFlatTierPolicy {
  readonly minBeans: number;
  readonly flatBonus: number;
  readonly label: string;
}

/**
 * Model tier bonus persentase untuk Premium Host (>= 130K Beans) - Tabel A.2
 */
export interface PremiumPercentTierPolicy {
  readonly minBeans: number;
  readonly rate: number;
  readonly label: string;
}

/**
 * Parameter input komputasi kalkulator
 */
export interface CalculationInput {
  readonly status: HostStatus;
  readonly beans: number;
  readonly days: number;
  readonly hours: number; // Mendukung nilai desimal (contoh: 40.5, maks 155)
}

/**
 * Hasil evaluasi komponen Host Bonus
 */
export interface HostBonusResult {
  readonly bonus: number;
  readonly ruleText: string;
  readonly tierName: string;
  readonly qualified: boolean;
  readonly isProrata: boolean;
}

/**
 * Hasil evaluasi komponen Duration Bonus
 */
export interface DurationBonusResult {
  readonly bonus: number;
  readonly ruleText: string;
  readonly qualified: boolean;
}

/**
 * Hasil agregasi komprehensif estimasi pendapatan host (100% sesuai return calculation-engine.js)
 */
export interface CalculationResult {
  readonly baseBeans: number;
  readonly hostBonus: number;
  readonly hostBonusRule: string;
  readonly hostBonusQualified: boolean;
  readonly isProrata: boolean;
  readonly tierName: string;
  readonly durationBonus: number;
  readonly durationBonusRule: string;
  readonly durationQualified: boolean;
  readonly totalBeans: number;
  readonly usdValue: number;
  readonly idrValue: number;
  readonly totalIncomeIdr: number; // Nilai IDR murni: Total Beans ÷ 210 × Rp 17.800
}

/**
 * Konstanta regulasi resmi platform (sesuai js/policy-constants.js)
 */
export interface PolicyConstants {
  readonly EXCHANGE_RATE_BEANS_TO_USD: 210; // 210 Beans = 1 USD
  readonly USD_TO_IDR_RATE: 17800;          // Rp 17.800 / USD
  readonly NEW_HOST_BONUS_CAP: 360000;      // Maksimal bonus New Host (400K × 90%)
  readonly MIN_VALID_DAYS: 15;              // Syarat hari komisi penuh
  readonly MIN_VALID_HOURS: 40;             // Syarat jam komisi penuh
  readonly PRORATA_MIN_DAYS: 10;            // Syarat hari minimal prorata (10-14 hari)
  readonly PRORATA_MIN_BEANS: 2001;         // Syarat beans minimal prorata (> 2.000 Beans)
  readonly DAYS_MIN: 0;
  readonly DAYS_MAX: 31;
  readonly HOURS_MIN: 0;
  readonly HOURS_MAX: 155;
}
```

---

## 3. Pure Calculation Engine Contracts & Logic

### 3.1. `calculateHostBonus`
- **Signature**:
  ```typescript
  export function calculateHostBonus(
    status: HostStatus, 
    beans: number, 
    days?: number, 
    hours?: number
  ): HostBonusResult;
  ```
- **Logika Eksekusi**:
  1. **Sanitasi Parameter**: `safeBeans = Math.max(0, Number(beans) || 0)`.
  2. **Evaluasi New Host (Bulan 1–3)**:
     - Dihitung menggunakan persentase murni pada seluruh tier:
       - $\ge 100.000$ Beans $\rightarrow 90\%$
       - $5.000 - 99.999$ Beans $\rightarrow 85\%$
       - $2.000 - 4.999$ Beans $\rightarrow 50\%$
       - $< 2.000$ Beans $\rightarrow 0\%$
     - **Batas Cap**: Jika hasil perkalian persentase melebihi 360.000 Beans, nilai bonus dikunci pada batas maksimal **360.000 Beans**.
  3. **Evaluasi Premium Host (Bulan ke-4+)**:
     - **Prorata Check**: Jika $\text{safeDays} \ge 10$ dan $< 15$, $\text{safeBeans} > 2.000$, dan $\text{safeHours} \ge 40$, maka komisi dihitung prorata: $\text{Bonus} = \text{Math.round}\left(\frac{\text{safeDays}}{15} \times \text{fullBonus}\right)$.
     - **Tier Flat (2.000 s/d 100.000 Beans)**: Mengambil nominal flat langsung dari tabel:
       - $100\text{K} - 129.9\text{K} \rightarrow \mathbf{50.000\text{ Beans}}$
       - $70\text{K} - 99.9\text{K} \rightarrow \mathbf{35.000\text{ Beans}}$
       - $50\text{K} - 69.9\text{K} \rightarrow \mathbf{25.000\text{ Beans}}$
       - $30\text{K} - 49.9\text{K} \rightarrow \mathbf{17.000\text{ Beans}}$
       - $20\text{K} - 29.9\text{K} \rightarrow \mathbf{12.000\text{ Beans}}$
       - $10\text{K} - 19.9\text{K} \rightarrow \mathbf{7.500\text{ Beans}}$
       - $5\text{K} - 9.9\text{K} \rightarrow \mathbf{3.800\text{ Beans}}$
       - $2\text{K} - 4.9\text{K} \rightarrow \mathbf{1.000\text{ Beans}}$
     - **Tier Persentase ($\ge 130.000$ Beans)**: Dikalikan persentase pencapaian riil:
       - $130\text{K} - 249.9\text{K} \rightarrow 51\%$
       - $250\text{K} - 399.9\text{K} \rightarrow 53\%$
       - $400\text{K} - 599.9\text{K} \rightarrow 55\%$
       - $600\text{K} - 799.9\text{K} \rightarrow 57\%$
       - $800\text{K} - 1.19\text{M} \rightarrow 59\%$
       - $1.2\text{M} - 2.29\text{M} \rightarrow 62\%$
       - $2.3\text{M} - 3.49\text{M} \rightarrow 68\%$
       - $3.5\text{M} - 4.99\text{M} \rightarrow 72\%$
       - $\ge 5\text{M} \rightarrow 75\%$

### 3.2. `calculateDurationBonus`
- **Signature**:
  ```typescript
  export function calculateDurationBonus(
    status: HostStatus, 
    beans: number, 
    days: number, 
    hours: number
  ): DurationBonusResult;
  ```
- **Logika Eksekusi**:
  1. Jika `status === 'new'`: Selalu mengembalikan `{ bonus: 0, ruleText: "Tidak berlaku untuk New Host", qualified: false }`.
  2. Jika `status === 'premium'`:
     - **Pengecekan Syarat Dasar**: Jika $\text{safeBeans} < 5.000$, $\text{safeDays} < 15$, atau $\text{safeHours} < 40 \rightarrow$ Bonus **0 Beans** (`qualified: false`).
     - **Kondisi 31 Hari Penuh ($\text{safeDays} = 31$)**:
       - $\text{Hours} \ge 110$: $\ge 130\text{K} \rightarrow \mathbf{30.000}$; $70\text{K} - 129.9\text{K} \rightarrow \mathbf{20.000}$; $30\text{K} - 69.9\text{K} \rightarrow \mathbf{15.000}$; $10\text{K} - 29.9\text{K} \rightarrow \mathbf{7.500}$; $< 10\text{K} \rightarrow \mathbf{2.100}$.
       - $\text{Hours} \ge 90$: $\ge 130\text{K} \rightarrow \mathbf{25.000}$; $70\text{K} - 129.9\text{K} \rightarrow \mathbf{15.000}$; $30\text{K} - 69.9\text{K} \rightarrow \mathbf{10.000}$; $10\text{K} - 29.9\text{K} \rightarrow \mathbf{7.500}$; $< 10\text{K} \rightarrow \mathbf{2.100}$.
       - $\text{Hours} \ge 70$: $\ge 130\text{K} \rightarrow \mathbf{20.000}$; $70\text{K} - 129.9\text{K} \rightarrow \mathbf{10.000}$; $30\text{K} - 69.9\text{K} \rightarrow \mathbf{10.000}$; $10\text{K} - 29.9\text{K} \rightarrow \mathbf{7.500}$; $< 10\text{K} \rightarrow \mathbf{2.100}$.
       - $\text{Hours} \ge 50$: $\ge 10\text{K} \rightarrow \mathbf{5.000}$; $< 10\text{K} \rightarrow \mathbf{2.100}$.
       - $\text{Hours } 40 - 49.9$: Flat **1.000 Beans**.
     - **Kondisi Standar ($15 \le \text{safeDays} < 31$)**: Flat **1.000 Beans**.

### 3.3. `calculateEstimatedIncome`
- **Signature**:
  ```typescript
  export function calculateEstimatedIncome(
    status: HostStatus, 
    beans: number, 
    days?: number, 
    hours?: number
  ): CalculationResult;
  ```
- **Formula Resmi Owner**:
  $$\text{effectiveDurationBonus} = \text{status} === \text{'premium'} \ ? \ \text{durationBonusResult.bonus} : 0$$
  $$\text{totalBeans} = \text{safeBeans} + \text{hostBonusResult.bonus} + \text{effectiveDurationBonus}$$
  $$\text{usdValue} = \frac{\text{totalBeans}}{210}$$
  $$\text{idrValue} = \text{Math.round}\left(\text{usdValue} \times 17.800\right)$$
- **Kepatuhan Terhadap Brief**: **Bonus Agensi Tunai & Extra Bonus Agensi tidak dimasukkan** dalam kalkulasi ini.

---

## 4. String & Numeric Formatters Specification (`src/engine/formatters.ts`)

Seluruh utilitas formatting diisolasi ke dalam modul tersendiri:

```typescript
export function formatComma(val: number): string {
  if (isNaN(val) || val === null || val === undefined) return '0';
  return new Intl.NumberFormat('en-US').format(Math.round(val));
}

export function sanitizeDigitsOnly(str: string): string {
  if (!str) return '';
  return String(str).replace(/\D/g, '');
}

export function sanitizeDecimal(str: string): string {
  if (!str) return '';
  let cleaned = String(str).replace(',', '.');
  cleaned = cleaned.replace(/[^0-9.]/g, '');
  const parts = cleaned.split('.');
  if (parts.length > 2) {
    cleaned = parts[0] + '.' + parts.slice(1).join('');
  }
  return cleaned;
}

export function formatDecimal(val: number, maxDecimals: number = 1): string {
  if (isNaN(val) || val === null || val === undefined) return '0';
  const num = Number(val);
  if (Number.isInteger(num)) return num.toString();
  return num.toFixed(maxDecimals).replace(/\.?0+$/, '');
}

export function formatCurrencyIDR(val: number): string {
  return new Intl.NumberFormat('id-ID').format(Math.round(val));
}

export function formatCurrencyUSD(val: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(val);
}
```

---

## 5. UI Layout & Component Strategy (Tanpa Shadcn UI)

Seluruh komponen UI pada arsitektur React Vite mempertahankan **100% sistem CSS modular yang ada** (`src/styles/*.css`). Tailwind CSS v4 hanya digunakan seperlunya saja sebagai utility helper tambahan:

1. **Top Hero Banner Section (`HeroShowcaseSection`)**:
   - Desktop: Menggunakan background gambar [`images/herosection.jpg`](file:///Users/nandasurya/Desktop/alphabigo/images/herosection.jpg) dengan teks judul di sisi kiri area gelap, dan 3D Gold Calculator + maskot Dino terintegrasi mulus di sisi kanan.
   - Mobile / Tablet ($\le 992\text{px}$ & $\le 480\text{px}$): Menggunakan background vertikal [`images/herosection_mobile.jpg`](file:///Users/nandasurya/Desktop/alphabigo/images/herosection_mobile.jpg) dengan teks di atas dan visual kalkulator di bawah.
2. **Custom Dropdown (`HostCategoryDropdown`)**:
   - Dibuat menggunakan `<button>` trigger semantik dan floating listbox `<div>`.
   - Menggunakan state `isOpen` lokal dengan event listener `click-outside` dan tombol keyboard (`Enter`, `Space`, `Escape`).
3. **Strict Numeric Inputs (`BeansCustomInput`, `ValidDaysInput`, `ValidHoursInput`)**:
   - Menerapkan event `onKeyDown` untuk memblokir karakter `-`, `+`, `e`, huruf, dan simbol yang tidak valid.
   - Format pemisah koma dinamis secara real-time via `formatComma` pada input Beans dengan preservasi posisi kursor pengetikan (*caret position preservation*).
   - Validasi ketat manual bar (Valid Days: 0–31, Valid Hours: 0–155 dengan desimal). Peringatan error otomatis muncul jika melebihi batas.
4. **Calculated Trigger & Action Buttons**:
   - Tombol **`CALCULATE NOW`** (`btn-calculate-now`) menjadi pemicu tunggal kalkulasi. Setiap perubahan input akan mereset tampilan estimasi ke 0.
   - Tombol **`Reset Parameter Standar`** (`btn-action-reset`) mengembalikan form ke konfigurasi standar dan mereset estimasi ke 0.
5. **Statement Breakdown Ledger (`BreakdownLedger`)**:
   - Mempertahankan kartu item baris akuntansi dengan 3D circular icons, perolehan Beans, ekuivalen IDR dan USD, serta grand total akumulasi.
   - Subtext New Host bersih tanpa kalimat `+ Durasi`.
6. **Preservasi CSS vs Tailwind**:
   - Dilarang membuang class CSS asli seperti `.hero-banner-section`, `.hero-income-box`, `.btn-calculate-now`, `.studio-card`, `.breakdown-item-card`.
   - Tailwind dipakai seperlunya saja (seperti helper flexbox atau conditional display class).
