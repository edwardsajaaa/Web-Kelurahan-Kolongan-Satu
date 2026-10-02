<p align="center">
  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmHZWdfGwGmtKd7WQmqYAolpSTVfdzZ9o_PS86bfdJVmhgEbRRth-v4rnoCOXBuQ4rQllgVR5nednaoxhTKE3HaZrfgKH07dp48WXlGpdCkPwVw7t1SLyV-UQxj_n3EiZqaWXZItQiD2p_vqtKi_xSE74TrV0f1V-Azvr4pEqGb2SCR7zqAIzDYHRNzTburxA3gDsFwOEtNColVLoZ5UF1Xy0WSKOkbAkPEIA04HcG2N0n-qDAhHKdo7iOJD-lul2L9S0" width="80" alt="Logo Kelurahan Kolongan Satu" />
</p>

<h1 align="center">🏛️ Website Kelurahan Kolongan Satu</h1>

<p align="center">
  <strong>Sistem Informasi Monografi Digital & Portal Pelayanan Publik Terpadu</strong><br/>
  Kelurahan Kolongan Satu · Kecamatan Tomohon Tengah · Kota Tomohon · Sulawesi Utara
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.3-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.3-61DAFB?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-7.0-3178C6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License" />
</p>

---

## 📋 Deskripsi Proyek

**Website Kelurahan Kolongan Satu** adalah portal resmi digital yang dibangun untuk mewujudkan **transparansi data monografi** dan **kemudahan akses pelayanan administrasi** bagi seluruh masyarakat Kelurahan Kolongan Satu, Kecamatan Tomohon Tengah, Kota Tomohon, Sulawesi Utara.

Portal ini dikembangkan melalui kolaborasi akademis antara mahasiswa **Kuliah Kerja Terpadu (KKT) Ke-149 Universitas Sam Ratulangi** dengan aparat Kelurahan Kolongan Satu di bawah pimpinan **Lurah Theresia J. Kaunang, SE**.

---

## ✨ Fitur Utama

### 🌐 Landing Page Publik (`/`)
- **Hero Showcase** — Panorama lanskap Gunung Lokon (750 mdpl) dengan navigasi cepat
- **Statistik Monografi Ringkas** — Data kependudukan (1.484 jiwa), 540 KK, 5 Wilayah Lingkungan, dan 100% digitalisasi
- **Visi & Misi Kelurahan** — Profil Lurah beserta arah kebijakan dan 3 misi strategis
- **Sejarah & Asal-Usul** — Riwayat Wanua Kolongan, pemekaran, dan falsafah *Si Tou Timou Tumou Tou*
- **Pusat Layanan Warga** — Akses langsung ke monografi, peta wilayah, dan persuratan online
- **Informasi Kantor & Kontak** — Alamat, jam pelayanan, dan peta lokasi
- **Footer Responsif** — Tautan cepat, kontak, dan jam operasional

### 📊 Portal Monografi Digital (`/portal`)
- **Dashboard Monografi 3 Kolom** — Sidebar navigasi, daftar kartu data, dan detail grafik
- **Data Kewilayahan** — 5 Lingkungan (Jaga I–V), batas administratif, Kepala Lingkungan
- **Data Kependudukan** — Jumlah penduduk, rasio gender, kelompok umur, dan struktur keluarga
- **Data Pendidikan & Sosial** — Statistik tingkat pendidikan dan fasilitas sosial
- **Data Peternakan & Lingkungan** — Populasi ternak, air bersih, dan sanitasi
- **Transparansi APBDes** — Anggaran pendapatan dan belanja kelurahan

### 📝 Layanan Persuratan Mandiri
- **Permohonan Surat Online** — Surat Keterangan Domisili, SKU, Pengantar SKCK, dll.
- **Alur Verifikasi Bertahap** — Staf → Seklur (Paraf) → Lurah (Pengesahan)
- **Cetak Surat Resmi** — Preview dan cetak dokumen surat resmi kelurahan
- **Nomor Registrasi Otomatis** — Pelacakan status permohonan surat

### 📢 Layanan Pengaduan Warga
- **Laporan Insiden Lingkungan** — Form pelaporan masalah infrastruktur & lingkungan
- **Tiket Pengaduan** — Tracking status penanganan dari awal hingga selesai
- **Tanggapan Petugas** — Respon dan tindak lanjut oleh aparatur kelurahan

### 🔐 Fitur Aparatur Internal
- **Role Switcher** — Simulasi peran Lurah, Seklur, dan Staf dengan hak akses berbeda
- **WhatsApp Gateway Simulator** — Notifikasi otomatis ke pejabat kelurahan
- **Pengesahan Digital** — Verifikasi dan pengesahan data monografi secara digital
- **Skema Database SQL** — Dokumentasi DDL PostgreSQL & Row Level Security (Supabase)

---

## 🏗️ Struktur Proyek

```
Web-Kelurahan-Kolongan-Satu/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Landing Page publik
│   │   ├── portal/
│   │   │   └── page.tsx                # Portal Monografi & Administrasi
│   │   ├── monografi/
│   │   │   └── page.tsx                # Alias ke Portal
│   │   ├── layout.tsx                  # Root layout (fonts, metadata)
│   │   └── globals.css                 # Global styles & utilities
│   ├── components/
│   │   ├── Sidebar.tsx                 # Navigasi sidebar portal
│   │   ├── CardFeed.tsx                # Daftar kartu monografi
│   │   ├── DetailView.tsx              # Panel detail & grafik data
│   │   ├── RoleSwitcherDropdown.tsx     # Switcher peran aparatur
│   │   ├── ModalLetterRequest.tsx       # Modal permohonan surat
│   │   ├── ModalCitizenReport.tsx       # Modal pengaduan warga
│   │   ├── ModalWhatsAppSimulator.tsx   # Simulator notifikasi WA
│   │   ├── ModalOfficialLetterPreview.tsx # Preview cetak surat resmi
│   │   ├── ModalMonografiPrint.tsx      # Cetak lembar monografi
│   │   └── ModalSqlSchema.tsx          # Viewer skema database
│   └── data/
│       ├── monografiData.ts            # Data monografi kelurahan
│       ├── officialsData.ts            # Data pejabat & aparatur
│       ├── lettersData.ts              # Data permohonan surat
│       ├── reportsData.ts              # Data pengaduan warga
│       └── sqlSchemaData.ts            # Skema SQL Supabase
├── tailwind.config.js                  # Konfigurasi Tailwind CSS
├── next.config.mjs                     # Konfigurasi Next.js
├── tsconfig.json                       # Konfigurasi TypeScript
├── postcss.config.js                   # PostCSS config
└── package.json                        # Dependencies & scripts
```

---

## 🚀 Cara Menjalankan

### Prasyarat
- **Node.js** versi 18 atau lebih baru
- **npm** (termasuk dalam instalasi Node.js)

### Instalasi & Pengembangan

```bash
# 1. Clone repository
git clone https://github.com/edwardsajaaa/Web-Kelurahan-Kolongan-Satu.git
cd Web-Kelurahan-Kolongan-Satu

# 2. Install dependencies
npm install

# 3. Jalankan server pengembangan
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

### Build Produksi

```bash
# Build optimized production bundle
npm run build

# Jalankan server produksi
npm start
```

---

## 🛠️ Tech Stack

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| **Next.js** | 16.3 (Turbopack) | Framework React full-stack |
| **React** | 19.3 | Library UI komponen |
| **TypeScript** | 7.0 | Type safety & developer experience |
| **Tailwind CSS** | 3.4 | Utility-first CSS framework |
| **Lucide React** | 1.48 | Ikon SVG modern |
| **Material Symbols** | — | Ikon Google Material Design |
| **Plus Jakarta Sans** | — | Tipografi utama |

---

## 📊 Data Monografi Kelurahan

| Kategori | Detail |
|----------|--------|
| **Total Penduduk** | 1.484 Jiwa |
| **Kepala Keluarga** | 540 KK |
| **Laki-laki** | 748 Jiwa |
| **Perempuan** | 736 Jiwa |
| **Wilayah Lingkungan** | 5 Lingkungan (Jaga I – V) |
| **Kepala Lingkungan** | 5 Orang (Pala) |
| **Ketinggian** | 750 mdpl (Kaki Gunung Lokon) |
| **Kecamatan** | Tomohon Tengah |
| **Kota** | Kota Tomohon, Sulawesi Utara |

---

## 👥 Pejabat Kelurahan

| Nama | Jabatan |
|------|---------|
| **Theresia J. Kaunang, SE** | Lurah |
| **Ferromel L. Pua, S.Kom** | Sekretaris Kelurahan |
| **Karlin R. Wowor** | Staf Administrasi |
| **Meisy T. Rompas** | Kepala Seksi Pemberdayaan |
| **Jefri M. Tamboto** | Kepala Seksi Pemerintahan |

---

## 🤝 Kolaborasi

Proyek ini dikembangkan melalui program **Kuliah Kerja Terpadu (KKT) Ke-149** Universitas Sam Ratulangi Manado bekerja sama dengan Pemerintah Kelurahan Kolongan Satu, Kecamatan Tomohon Tengah, Kota Tomohon.

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).

---

<p align="center">
  <sub>© 2024 Pemerintah Kelurahan Kolongan Satu · Kota Tomohon · Sulawesi Utara</sub><br/>
  <sub>Dibangun dengan ❤️ oleh Mahasiswa KKT 149 UNSRAT</sub>
</p>