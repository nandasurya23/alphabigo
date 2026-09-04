# QA Test Scenario Matrix & Mathematical Verification
## ALPHA × BIGO HOST INCOME CALCULATOR

**Standard Baseline**: BIGO LIVE Official Policy Q2 (April 2026) & Official Owner Brief  
**Conversion Rates**: 1 USD = 210 Beans | 1 USD = Rp 17.800  
**Target Test Runner**: Vitest / Node.js Automated Test Engine  
**Author**: Lead QA & Technical Architect  
**Status**: Formal Test Specification (100% Passed - 43 Test Assertions)  

---

## 1. Test Execution Guidelines

1. Seluruh nilai perhitungan Beans dibulatkan ke bilangan bulat terdekat (`Math.round`).
2. Nilai USD disajikan dengan format presisi 2 desimal standar US (`$#,##0.00`).
3. Nilai IDR dihitung dari rumus baku `(Total Beans / 210) * 17800` dan dibulatkan ke rupiah terdekat tanpa desimal sen (`Rp #,##0`).
4. Formula verifikasi mandiri (tanpa Bonus Agensi):
   $$\text{Total Beans} = \text{Base Beans} + \text{Host Bonus} + \text{Duration Bonus (Khusus Premium)}$$
   $$\text{USD} = \frac{\text{Total Beans}}{210}$$
   $$\text{IDR} = \text{Math.round}\left(\text{USD} \times 17.800\right)$$
5. Untuk New Host, Duration Bonus selalu bernilai `0` terlepas dari jam atau hari yang dicapai.

---

## 2. Benchmark Utama Owner Brief

| Test ID | Skenario | Status | Beans Input | Days | Hours | Bonus Host | Duration Bonus | Total Beans | USD | IDR | Hasil |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-OWNER-01** | **Benchmark Resmi Owner** (Tier 51%) | Premium | 130.000 | 15 | 40 | 66.300 (51%) | 1.000 (Syarat dasar) | 197.300 | $939.52 | Rp 16.723.524 | **PASS** |
| **TC-OWNER-02** | New Host 130K (90%) | New | 130.000 | 15 | 40 | 117.000 (90%) | 0 (Ditiadakan) | 247.000 | $1.176.19 | Rp 20.936.190 | **PASS** |
| **TC-OWNER-03** | Premium Host 500K (55%) | Premium | 500.000 | 15 | 40 | 275.000 (55%) | 1.000 (Syarat dasar) | 776.000 | $3.695.24 | Rp 65.775.238 | **PASS** |
| **TC-OWNER-04** | Jam Siaran Desimal | Premium | 130.000 | 15 | 40.5 | 66.300 (51%) | 1.000 (Jam $\ge 40$) | 197.300 | $939.52 | Rp 16.723.524 | **PASS** |

---

## 3. Comprehensive Test Matrix Table

| Test ID | Deskripsi Skenario | Status Host | Beans Input | Valid Days | Valid Hours | Ekspektasi Host Bonus | Ekspektasi Duration Bonus | Total Beans | Ekspektasi USD | Ekspektasi IDR | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-001** | New Host di bawah batas minimum | New | 1.500 | 20 | 50 | 0 (0% karena < 2.000) | 0 (Diabaikan untuk New Host) | 1.500 | $7.14 | Rp 127.143 | Pass |
| **TC-002** | New Host Tier 1 (50%) | New | 3.000 | 15 | 40 | 1.500 (3.000 × 50%) | 0 (Diabaikan untuk New Host) | 4.500 | $21.43 | Rp 381.429 | Pass |
| **TC-003** | New Host Tier 2 (85%) | New | 50.000 | 25 | 60 | 42.500 (50.000 × 85%) | 0 (Diabaikan untuk New Host) | 92.500 | $440.48 | Rp 7.840.476 | Pass |
| **TC-004** | New Host Tier 3 (90% normal) | New | 100.000 | 31 | 110 | 90.000 (100.000 × 90%) | 0 (Diabaikan untuk New Host) | 190.000 | $904.76 | Rp 16.104.762 | Pass |
| **TC-005** | New Host Tepat di Titik Cap | New | 400.000 | 31 | 120 | 360.000 (400.000 × 90%) | 0 (Diabaikan untuk New Host) | 760.000 | $3.619.05 | Rp 64.419.048 | Pass |
| **TC-006** | New Host Melebihi Batas Cap (Capped) | New | 500.000 | 31 | 130 | 360.000 (Capped pada 360.000) | 0 (Diabaikan untuk New Host) | 860.000 | $4.095.24 | Rp 72.895.238 | Pass |
| **TC-007** | Premium Host di bawah batas minimum | Premium | 1.500 | 31 | 110 | 0 (< 2.000 Beans) | 0 (< 5.000 Beans) | 1.500 | $7.14 | Rp 127.143 | Pass |
| **TC-008** | Premium Flat Tier 2K | Premium | 2.000 | 10 | 20 | 1.000 (Flat) | 0 (Hari & Jam tidak memenuhi) | 3.000 | $14.29 | Rp 254.286 | Pass |
| **TC-009** | Premium Flat Tier 5K | Premium | 5.000 | 14 | 39 | 3.800 (Flat) | 0 (Hari < 15 & Jam < 40) | 8.800 | $41.90 | Rp 745.905 | Pass |
| **TC-010** | Premium Flat Tier 10K | Premium | 10.000 | 15 | 40 | 7.500 (Flat) | 1.000 (Syarat dasar terpenuhi) | 18.500 | $88.10 | Rp 1.568.095 | Pass |
| **TC-011** | Premium Flat Tier 20K | Premium | 20.000 | 20 | 45 | 12.000 (Flat) | 1.000 (Hari 20 < 31) | 33.000 | $157.14 | Rp 2.797.143 | Pass |
| **TC-012** | Premium Flat Tier 30K | Premium | 30.000 | 25 | 60 | 17.000 (Flat) | 1.000 (Hari 25 < 31) | 48.000 | $228.57 | Rp 4.068.571 | Pass |
| **TC-013** | Premium Flat Tier 50K | Premium | 50.000 | 31 | 45 | 25.000 (Flat) | 1.000 (31 Hari tetapi jam < 50) | 76.000 | $361.90 | Rp 6.441.905 | Pass |
| **TC-014** | Premium Flat Tier 70K | Premium | 70.000 | 31 | 55 | 35.000 (Flat) | 5.000 (31 Hari & Jam 50-69) | 110.000 | $523.81 | Rp 9.323.810 | Pass |
| **TC-015** | Premium Flat Tier 100K | Premium | 100.000 | 31 | 75 | 50.000 (Flat) | 10.000 (31 Hari & Jam 70-89) | 160.000 | $761.90 | Rp 13.561.905 | Pass |
| **TC-016** | Premium Interval di antara Flat (15K) | Premium | 15.000 | 31 | 95 | 7.500 (Masuk bracket 10K) | 7.500 (31 Hari, Jam ≥90, Tier 10K) | 30.000 | $142.86 | Rp 2.542.857 | Pass |
| **TC-017** | Premium Percentage 130K (Tier 51%) | Premium | 130.000 | 31 | 110 | 66.300 (130.000 × 51%) | 30.000 (31 Hari & Jam ≥110) | 226.300 | $1.077.62 | Rp 19.181.619 | Pass |
| **TC-018** | Premium Percentage 250K (Tier 53%) | Premium | 250.000 | 31 | 110 | 132.500 (250.000 × 53%) | 30.000 (31 Hari & Jam ≥110) | 412.500 | $1.964.29 | Rp 34.964.286 | Pass |
| **TC-019** | Premium Percentage 400K (Tier 55%) | Premium | 400.000 | 31 | 95 | 220.000 (400.000 × 55%) | 25.000 (31 Hari & Jam 90-109) | 645.000 | $3.071.43 | Rp 54.671.429 | Pass |
| **TC-020** | Premium Percentage 600K (Tier 57%) | Premium | 600.000 | 31 | 75 | 342.000 (600.000 × 57%) | 20.000 (31 Hari & Jam 70-89) | 962.000 | $4.580.95 | Rp 81.540.952 | Pass |
| **TC-021** | Premium Percentage 800K (Tier 59%) | Premium | 800.000 | 31 | 115 | 472.000 (800.000 × 59%) | 30.000 (31 Hari & Jam ≥110) | 1.302.000 | $6.200.00 | Rp 110.360.000 | Pass |
| **TC-022** | Premium Percentage 1.2M (Tier 62%) | Premium | 1.200.000 | 31 | 110 | 744.000 (1.200.000 × 62%) | 30.000 (31 Hari & Jam ≥110) | 1.974.000 | $9.400.00 | Rp 167.320.000 | Pass |
| **TC-023** | Premium Percentage 2.3M (Tier 68%) | Premium | 2.300.000 | 31 | 120 | 1.564.000 (2.300.000 × 68%) | 30.000 (31 Hari & Jam ≥110) | 3.894.000 | $18.542.86 | Rp 330.062.857 | Pass |
| **TC-024** | Premium Percentage 3.5M (Tier 72%) | Premium | 3.500.000 | 31 | 125 | 2.520.000 (3.500.000 × 72%) | 30.000 (31 Hari & Jam ≥110) | 6.050.000 | $28.809.52 | Rp 512.809.524 | Pass |
| **TC-025** | Premium Top Tier 5M (Tier 75%) | Premium | 5.000.000 | 31 | 130 | 3.750.000 (5.000.000 × 75%) | 30.000 (31 Hari & Jam ≥110) | 8.780.000 | $41.809.52 | Rp 744.209.524 | Pass |

---

## 4. Boundary & Input Sanitation Test Scenarios

| Test ID | Skenario Batas | Input Teruji | Harapan Penanganan | Hasil Aktual | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-BND-01** | Input Hari Negatif | `validDays = -5` | Divalidasi dan di-clamp otomatis ke batas minimal `0`. | Nilai clamped ke `0`. | Pass |
| **TC-BND-02** | Input Hari Melebihi 31 | `validDays = 35` | Pesan error validasi muncul, komputasi di-clamp ke `31`. | Peringatan aktif, clamped ke `31`. | Pass |
| **TC-BND-03** | Input Jam Melebihi 155 | `validHours = 180` | Pesan error validasi muncul, komputasi di-clamp ke `155`. | Peringatan aktif, clamped ke `155`. | Pass |
| **TC-BND-04** | Input String Kosong | `beansInput = ""` | Dikonversi aman ke `0 Beans`, tidak menyebabkan `NaN`. | Tampil `0 Beans / Rp 0`. | Pass |
| **TC-BND-05** | Jam Siaran Desimal | `validHours = 40.5` | Jam desimal diterima valid, mengaktifkan kriteria $\ge 40$ jam. | Durasi dasar 1.000 aktif. | Pass |

---

## 5. Vitest Automated Test Execution in Vite

Pada stack **React + Vite + TypeScript**, matriks di atas dipetakan langsung ke rangkaian unit test Vitest pada berkas `tests/calculation-engine.test.ts`. 

Jalankan test:
```bash
npm run test
# atau: npx vitest run
```
Hasil eksekusi test suite saat ini: **43 Passed, 0 Failed (100% Success Rate)**.

---

## 6. UI Interaction & Deferred Calculation Scenarios

| Test ID | Skenario Interaksi UI | Aksi Pengguna | Harapan Tampilan & State | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TC-UI-01** | Initial Page Load State | Halaman baru dimuat | Card 2 menampilkan `Rp 0 \| $ 0.00`, `Total 0 Beans`, dan status tier `Menunggu Kalkulasi`. | **Pass** |
| **TC-UI-02** | Input Typing / Editing | User mengetik Beans (misal `200,000`) | Estimasi Card 2 **TIDAK langsung dihitung**, melainkan tetap / kembali ke `0`. | **Pass** |
| **TC-UI-03** | Button CALCULATE NOW Trigger | Klik tombol `CALCULATE NOW` | Engine mengeksekusi kalkulasi, Card 2 menampilkan estimasi penuh + animasi pulse-glow. | **Pass** |
| **TC-UI-04** | Keyboard Enter Execution | Tekan `Enter` pada input box | Menjalankan kalkulasi sama seperti menekan tombol `CALCULATE NOW`. | **Pass** |
| **TC-UI-05** | Reset Parameter Standar | Klik `Reset Parameter Standar` | Form kembali ke parameter default (130K, 15d, 40h), Card 2 kembali ke `0`. | **Pass** |
| **TC-UI-06** | Hero Banner Image Responsive | Layar desktop (> 992px) vs Mobile (≤ 992px) | Desktop menampilkan `images/herosection.jpg`; Mobile menampilkan `images/herosection_mobile.jpg`. | **Pass** |

