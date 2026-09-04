# Product Requirement Document (PRD)
## ALPHA × BIGO HOST INCOME CALCULATOR

**Headline**: ALPHA × BIGO HOST INCOME CALCULATOR  
**Subheadline**: Calculate Your Estimated BIGO Earnings  
**Target Platform**: BIGO LIVE Indonesia  
**Official Agency Partner**: Alpha Entertainment  
**Policy Baseline**: BIGO LIVE Official Policy Q2 (April 2026)  
**Target Modern Tech Stack**: **React (v18/v19) + Vite + TypeScript + Tailwind CSS v4** (Zero External UI / Tanpa Shadcn UI)  
**Document Version**: 2.1.0  
**Status**: Approved & Aligned with Official Owner 9-Point Revisions  

---

## 1. Executive Summary & Background

Alpha Entertainment merupakan agensi manajemen kreator dan live streamer resmi di platform BIGO LIVE Indonesia. Dalam ekosistem live streaming, transparansi perhitungan pendapatan merupakan instrumen krusial untuk meningkatkan retensi host, motivasi performa siaran harian, dan akuntabilitas kemitraan antara agensi dengan talent.

Platform BIGO LIVE menerapkan skema komisi resmi bertingkat berdasarkan status masa kerja host (**New Host** vs **Premium Host**), akumulasi perolehan Beans (*virtual gifts* dari penonton), serta disiplin siaran bulanan (**Valid Days** dan **Valid Hours**).

Aplikasi **ALPHA × BIGO HOST INCOME CALCULATOR** dirancang sebagai portal kalkulasi resmi berpenampilan *dark luxury* 3D bertaraf eksekutif yang memungkinkan host dan talent manager memproyeksikan estimasi penghasilan bersih secara instan, transparan, dan akurat dalam denominasi Beans, USD, dan IDR.

---

## 2. Problem Statement & Business Objectives

1. **Kompleksitas Formula Perhitungan Kuartal Q2-April 2026**:
   - **New Host (Bulan 1–3)**: Menggunakan persentase murni pada seluruh level dengan batas maksimal bonus 360.000 Beans.
   - **Premium Host (Bulan 4 sampai seterusnya)**: Menggunakan kombinasi dua skema: **Flat Bonus** tetap pada rentang 2.000 s/d 100.000 Beans, dan beralih ke **Percentage Bonus** progresif mulai 130.000 Beans.
2. **Kondisi Bersyarat Duration Bonus**:
   - Duration Bonus hanya berlaku untuk Premium Host. New Host tidak berhak atas Duration Bonus.
   - Mensyaratkan kombinasi: minimal 5.000 Beans, minimal 15 hari siaran, minimal 40 jam siaran, serta skema eskalasi jam (50, 70, 90, 110 jam) jika mencapai 31 hari penuh.
3. **Pemisahan Tegas Bonus Agensi (Owner Mandate)**:
   - Sesuai arahan resmi pemilik (*Owner Brief*), **Bonus Agensi Tunai & Extra Bonus Agensi TIDAK PERLU DIMASUKKAN** ke dalam kalkulator ini, agar aplikasi berfokus murni pada hak konversi komisi Beans platform host.
4. **Efisiensi Operasional Agensi**:
   - Meniadakan proses simulasi manual oleh Talent Manager melalui spreadsheet, memberikan akses mandiri 24/7 bagi seluruh host Alpha Entertainment.

---

## 3. Scope Definition & 9-Point Owner Revisions

### 3.1. In-Scope (Updated Spec)
1. **Hero Showcase Section**:
   - Background Desktop: [`images/herosection.jpg`](file:///Users/nandasurya/Desktop/alphabigo/images/herosection.jpg) (Full seamless 3D Gold Calculator & Dino Mascot scene).
   - Background Mobile & Tablet ($\le 992\text{px}$ & $\le 480\text{px}$): [`images/herosection_mobile.jpg`](file:///Users/nandasurya/Desktop/alphabigo/images/herosection_mobile.jpg) (Layout vertikal proporsional, teks di bagian atas gelap, visual kalkulator 3D & dino di bawah).
   - Script tag cursive: `Calculate Your` (Dancing Script).
   - Bold 3D Golden text: `BIGO LIVE` & `INCOME CALCULATOR`.
   - Subtitle: `Hitung estimasi penghasilanmu di BIGO Live dengan mudah dan akurat.`
2. **Card 1: INPUT DATA (Badge Cube `1`)**:
   - **Kategori Host**: Dropdown kustom dengan opsi:
     - `New Host (Bulan 1-3)`
     - `Premium Host (Bulan 4 sampai seterusnya)`
   - **Target Beans**: Input bar numerik dengan format pemisah koma otomatis (contoh: `130,000 Beans`) dan ikon `images/gold_bean.png`.
   - **Valid Days**: Input bar manual (tanpa slider / tanpa tarik garis). Menampilkan error/peringatan jika angka > 31.
   - **Valid Hours**: Input bar manual (tanpa slider / tanpa tarik garis). Menampilkan error/peringatan jika angka > 155. Mendukung input angka desimal (contoh: `40.5`).
   - **Tombol Aksi**:
     - Tombol emas pill `CALCULATE NOW ❯` (Pemicu kalkulasi estimasi penghasilan).
     - Tombol `Reset Parameter Standar` (Mereset input ke nilai standar dan mereset estimasi ke 0).
3. **Card 2: ESTIMASI PENGHASILAN (Badge Cube `2` & Pill `HASIL ESTIMASI ✦`)**:
   - **Alur Perhitungan Tertunda (Deferred Calculation)**:
     - Saat awal load atau saat user mengubah input apa pun, hasil estimasi bernilai **0** (`Rp 0 | $ 0.00`, `Total 0 Beans`, badge tier: `Menunggu Kalkulasi`).
     - Hasil komputasi penuh hanya muncul setelah user mengklik tombol **`CALCULATE NOW`** (atau menekan tombol `Enter`).
   - Judul Display: `TOTAL ESTIMASI PENGHASILAN`.
   - Nilai Hero: Tampilan kombinasi nominal IDR dan USD (`Rp 16,723,524 | $ 939.52` setelah kalkulasi) serta kapsul `Total 197,300 Beans`.
   - Rincian Komponen Penghasilan:
     - **Target Beans**: Target Beans count, estimasi IDR, dan estimasi USD.
     - **Bonus Beans BIGO (Garansi)**: Bonus Beans count, tier, estimasi IDR, dan estimasi USD.
     - **Bonus Duration**: Duration bonus count, rule, estimasi IDR, dan estimasi USD. *(Otomatis disembunyikan total jika New Host dipilih)*.
     - **Total Beans & Total Estimasi**: Akumulasi total beans dan grand total IDR/USD.
     - **Subtext Total Beans**: Khusus New Host, berbunyi `Akumulasi Pencapaian + Bonus Host` *(tanpa kata "+ Durasi")*. Untuk Premium Host berbunyi `Akumulasi Pencapaian + Bonus Host + Bonus Duration`.
4. **Card 3: NOTE PENTING (Full-width card di bagian bawah)**:
   - Ikon 3D Notepad emas + teks judul `NOTE PENTING`.
   - Isian resmi:
     - Konversi BIGO adalah **210 Beans = 1 USD**.
     - Acuan perhitungan pada Calculator menggunakan kurs **Rp17.800/USD**.
     - Hasil perhitungan estimasi diatas belum termasuk pajak penarikan/biaya administrasi BIGO.
   - Maskot Dino Bigo resmi menggunakan `images/bigo_dino.png`.

### 3.2. Explicit Out-of-Scope
1. **Slider ("Tarik Garis")**: Dihapus secara total dari Valid Days dan Valid Hours.
2. **Target Milestone Chips**: Dihapus total.
3. **Bonus Agensi & Extra Bonus Agensi Tunai**: Dikecualikan ketat sesuai arahan owner.
4. **Shadcn UI / Radix UI**: Dilarang keras dalam rencana migrasi React mendatang.
5. **Menghapus 100% CSS Eksisting**: DILARANG KERAS membuang atau me-rewrite CSS yang ada. Seluruh file modul CSS (`variables.css`, `base.css`, `layout.css`, `components.css`, `responsive.css`) wajib dipertahankan. Tailwind CSS v4 hanya dipakai seperlunya saja.

---

## 4. Functional Requirements (FR)

| ID | Kategori | Deskripsi Persyaratan Fungsional |
| :--- | :--- | :--- |
| **FR-01** | Kategori Host | Dropdown kustom memilih `New Host (Bulan 1-3)` dan `Premium Host (Bulan 4 sampai seterusnya)`. |
| **FR-02** | Conditional Duration | Menyembunyikan input Valid Days & Valid Hours serta baris Bonus Duration jika New Host dipilih. |
| **FR-03** | Target Beans Input | Input angka dengan format koma dinamis dan validasi pengetikan ketat (hanya digit). Perubahan input mereset estimasi ke 0. |
| **FR-04** | Valid Days Input | Input angka manual dengan validasi rentang 0–31 hari. Menampilkan peringatan error jika > 31. Perubahan input mereset estimasi ke 0. |
| **FR-05** | Valid Hours Input | Input angka manual dengan validasi rentang 0–155 jam dan dukungan desimal. Peringatan error jika > 155. Perubahan input mereset estimasi ke 0. |
| **FR-06** | Engine Calculation | Perhitungan tertunda (*deferred calculation*): kalkulasi bonus host, duration bonus, total beans, USD, dan IDR hanya dipicu via tombol **CALCULATE NOW** atau `Enter`. |
| **FR-07** | Hero Display | Menampilkan hero card dengan `TOTAL ESTIMASI PENGHASILAN` (awal 0, terisi setelah kalkulasi), nilai IDR dan USD, serta kapsul total beans. |
| **FR-08** | Breakdown Ledger | Menampilkan rincian komponen pendapatan dengan 3D circular gold icon, subtext bersih tanpa '+ Durasi' untuk New Host. |
| **FR-09** | Note Penting Card | Menampilkan kartu regulasi resmi di bagian bawah dengan 3 poin ketentuan dan maskot dino `images/bigo_dino.png`. |
| **FR-10** | Reset Action | Tombol reset mengembalikan seluruh input ke benchmark standar owner (Premium, 130K Beans, 15 Days, 40 Hours) dan mereset estimasi ke 0. |

---

## 5. Non-Functional Requirements (NFR)

1. **Performance**: Komputasi instan di bawah 5 milidetik (*pure in-memory functional calculation*).
2. **Visual Design**: Mengusung estetika *Black & Gold 3D Luxury* sesuai referensi mock, bersih, elegan, dan imersif.
3. **Responsivitas**: Tampilan adaptif tanpa overflow dari viewport 320px (ponsel kecil) hingga 1440px (desktop).
4. **Migration Ready**: Siap dimigrasikan ke **React + Vite + TypeScript + Tailwind CSS v4** dengan pendekatan komponen kustom mandiri (*Zero External UI Libraries / Tanpa Shadcn UI*).
