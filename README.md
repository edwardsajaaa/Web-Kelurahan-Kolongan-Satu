<p align="center">
  <img src="/images/logo-tomohon.png" width="90" alt="Logo Kelurahan Kolongan Satu" />
</p>

<h1 align="center">Portal Resmi Kelurahan Kolongan Satu</h1>

<p align="center">
  <strong>Sistem Informasi Monografi Digital, Pelayanan Persuratan & Pengaduan Warga Terpadu</strong><br/>
  Kelurahan Kolongan Satu · Kecamatan Tomohon Tengah · Kota Tomohon · Sulawesi Utara
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.3%20(Turbopack)-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.3-61DAFB?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-7.0-3178C6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ECF8E?logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="MIT License" />
</p>

---

## 📌 Tentang Proyek

Website ini adalah platform pemerintahan digital resmi **Kelurahan Kolongan Satu, Kota Tomohon**. Dibangun untuk menyediakan keterbukaan data monografi kelurahan secara real-time, digitalisasi pelayanan surat menyurat warga, serta sistem tanggap cepat aduan sarana publik terintegrasi WhatsApp.

Platform ini dikembangkan melalui program kolaborasi pengabdian **Kuliah Kerja Terpadu (KKT) Ke-149 Universitas Sam Ratulangi Manado** bersama Pemerintah Kelurahan Kolongan Satu di bawah kepemimpinan Lurah **Theresia J. Kaunang, SE**.

---

## ✨ Fitur Unggulan

### 1. 🏛️ Beranda Publik (`/`)
- **Panorama & Profil Wilayah**: Visualisasi teritorial, visi-misi, sejarah berdirinya Kolongan Satu, dan struktur pemerintahan aparatur.
- **Statistik Monografi Dinamis**: Menampilkan total 1.484 jiwa, 540 KK, perbandingan gender, dan kelompok usia produktif (57,1%).
- **Peta 3D Batas Wilayah**: Peta interaktif 5 Lingkungan (Jaga I–V) dengan panduan navigasi GPS Google Maps menuju Kantor Kelurahan di Jl. Zanosui.
- **Katalog Fasilitas Publik**: Pemetaan fasilitas ibadah, sarana air bersih, sanitasi, dan penerangan jalan umum.
- **Dokumentasi Pengabdian**: Galeri foto kegiatan mahasiswa KKT 149 UNSRAT.

### 2. 📝 Pelayanan Persuratan Online
- **8 Jenis Surat Resmi**:
  1. Surat Keterangan Usaha (SKU)
  2. Surat Keterangan Domisili
  3. Surat Pengantar SKCK
  4. Surat Keterangan Belum Menikah
  5. Surat Keterangan Kematian
  6. Surat Keterangan Tidak Mampu (SKTM)
  7. Surat Keterangan Penghasilan
  8. Surat Keterangan Pindah Domisili
- **Alur Verifikasi Bertingkat**:
  $$\text{Warga Mandiri} \longrightarrow \text{Verifikasi Staf} \longrightarrow \text{Paraf Seklur} \longrightarrow \text{Pengesahan TTD Lurah}$$
- **Nomor Registrasi Unik & Resi**: Pelacakan status berkas real-time.
- **Integrasi Cetak & Ekspor**: Pratinjau draf surat resmi PDF lengkap dengan kop dinas dan QR code verifikasi.

### 3. 📢 Layanan Aspirasi & Pengaduan Warga (`/lapor`)
- **Formulir Interaktif 5 Tahapan**:
  - Identifikasi warga (Nama, NIK, No. HP).
  - Titik lokasi kejadian & patokan khusus per Jaga.
  - Klasifikasi aduan: Lampu PJU, Pipa Air Bocor, Drainase Meluap, Tumpukan Sampah, Ketertiban.
  - Unggah bukti foto lapangan langsung.
- **Direct WhatsApp Routing**: Pesan terformat otomatis dikirimkan ke kontak WhatsApp resmi **Kepala Lingkungan (Pala I–V)** atau **Sekretariat Kelurahan**.
- **Standar Waktu Respons (SLA)**: Transparansi 4 fase penanganan (Pelaporan Instant $\rightarrow$ Verifikasi Lapangan 2–4 Jam $\rightarrow$ Tindakan 1x24 Jam $\rightarrow$ Konfirmasi Tuntas WA).
- **Perlindungan Data**: Kepatuhan kerahasiaan data warga sesuai **UU PDP No. 27/2022**.

### 4. 📊 Dashboard Monografi Terpadu (`/portal` & `/monografi`)
- Multi-tahun analitik (Tahun 2024, 2025, 2026).
- Panel data: Kependudukan, Pendidikan, Sosial Ekonomi, Peternakan, Pertanian, Sanitasi & Kesehatan.
- Ekspor & Cetak Lembar Monografi Resmi format A4/Folio siap arsip.
- Fitur pembukaan buku data tahun baru.

### 5. 🔐 Portal Khusus Aparatur (`/portal/login`)
- Autentikasi berbasis Supabase Auth dengan sesi terenkripsi cookie HTTP-only.
- Pembagian peran (*Role-Based Access Control*):
  - **Lurah**: Superadmin, pengesahan akhir, persetujuan TTD surat.
  - **Sekretaris Kelurahan (Seklur)**: Verifikasi data monografi, koreksi berkas, dan pembubuhan paraf dinas.
  - **Staf Administrasi**: Verifikasi awal kelengkapan berkas fisik & digital.

---

## 🛠️ Arsitektur Teknologi

| Komponen | Spesifikasi / Library |
|---|---|
| **Framework** | Next.js 16.3 (Turbopack Engine & App Router) |
| **Frontend Library** | React 19.3 & TypeScript 7.0 |
| **Styling** | Tailwind CSS 3.4 & Vanilla CSS Tokens |
| **Database & Auth** | Supabase PostgreSQL + Supabase SSR Auth Client |
| **Icons** | Lucide React & Google Material Symbols |
| **Tipografi** | Plus Jakarta Sans & Inter |
| **Integrasi Eksternal** | WhatsApp Cloud Click-to-Chat API & Google Maps Platform |

---

## 📁 Struktur Direktori

```text
Web-Kelurahan-Kolongan-Satu/
├── src/
│   ├── app/
│   │   ├── page.tsx                     # Landing Page Beranda Publik
│   │   ├── lapor/page.tsx               # Halaman Penuh Pengaduan Warga (Stitch Design)
│   │   ├── portal/page.tsx              # Dashboard Monografi & Administrasi Aparatur
│   │   ├── portal/login/page.tsx        # Halaman Login Resmi Aparatur
│   │   ├── monografi/page.tsx           # Akses Cepat Monografi Publik
│   │   ├── kebijakan-privasi/page.tsx   # Dokumen Hukum UU PDP No. 27/2022
│   │   ├── ketentuan-layanan/page.tsx   # Ketentuan & Regulasi Layanan
│   │   ├── api/                         # Backend REST API Routes
│   │   │   ├── auth/                    # Login, Logout, Session, Reset Password
│   │   │   ├── lapor/                   # CRUD Laporan & Pengaduan Warga
│   │   │   ├── surat/                   # Pengajuan & Mutasi Status Persuratan
│   │   │   ├── monografi/               # Pengambilan & Update Data Monografi
│   │   │   └── landing-content/         # Pengelolaan Konten CMS Landing Page
│   │   └── layout.tsx                   # Root Layout & Metadata SEO
│   ├── components/
│   │   ├── ModalCitizenReport.tsx       # Modal Dialog Lapor Warga Terpadu
│   │   ├── ModalLetterRequest.tsx       # Modal Pelayanan Surat & Rekapitulasi
│   │   ├── ModalOfficialLetterPreview.tsx # Pratinjau & Cetak PDF Surat Ber-QR
│   │   ├── ModalMonografiPrint.tsx      # Lembar Cetak Monografi Fisik
│   │   ├── Interactive3DMap.tsx         # Peta Wilayah 3D Interaktif
│   │   └── portal/                      # Panel Manajemen (Aparatur, Fasilitas, Kontak)
│   ├── data/                            # Master Dataset & Type Definitions
│   │   ├── monografiData.ts             # Data Kependudukan & Wilayah (2024-2026)
│   │   ├── officialsData.ts             # Data Profil Pejabat & Kontak Pala
│   │   ├── lettersData.ts               # Template & Syarat Berkas Persuratan
│   │   └── reportsData.ts               # Data Awal Pengaduan Wilayah
│   └── lib/
│       └── supabase/                    # Client, Server & Admin Supabase SDK
├── supabase/
│   ├── schema.sql                       # Skema Database PostgreSQL, Index & RLS
│   ├── seed_complete.sql                # Seed Data Monografi & Fasilitas Awal
│   └── seed_aparatur_auth.sql           # Akun Login Pejabat & Hash Sandi Kedinasan
├── public/                              # Aset Gambar, Logo Kota Tomohon & Foto
├── next.config.mjs
├── tailwind.config.js
└── package.json
```

---

## 🚀 Panduan Instalasi & Menjalankan Lokal

### 1. Prasyarat Sistem
- **Node.js** v18.17+ atau v20+
- **npm** atau **pnpm**
- Akun proyek **Supabase** (Opsional untuk mode database aktif, atau aplikasi dapat berjalan dengan memori cadangan lokal).

### 2. Kloning Repositori & Instalasi Dependensi
```bash
git clone https://github.com/edwardsajaaa/Web-Kelurahan-Kolongan-Satu.git
cd Web-Kelurahan-Kolongan-Satu

npm install
```

### 3. Konfigurasi Environment Variable (`.env.local`)
Buat file `.env.local` di root direktori proyek:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Setup Database Supabase (Opsional)
Jalankan file SQL berikut secara berurutan di menu **SQL Editor** dashboard Supabase:
1. `supabase/schema.sql` (Membuat tabel `aparatur_users`, `surat_permohonan`, `laporan_warga`, `monografi_records`, dll).
2. `supabase/seed_complete.sql` (Mengisi data master monografi).
3. `supabase/seed_aparatur_auth.sql` (Mendaftarkan akun aparatur kelurahan).

### 5. Jalankan Server Development
```bash
npm run dev
```
Buka browser dan akses: [http://localhost:3000](http://localhost:3000).

### 6. Build untuk Produksi
```bash
npm run build
npm run start
```

---

## 🌐 Panduan Deployment ke Vercel

Proyek ini telah dikonfigurasi secara optimal untuk dideploy langsung ke **Vercel**:

1. Lakukan *Push* commit terbaru ke repositori GitHub:
   ```bash
   git add .
   git commit -m "feat: pembaruan sistem dan antarmuka pelayanan"
   git push origin main
   ```
2. Buka dashboard [Vercel](https://vercel.com/) $\rightarrow$ **Add New Project** $\rightarrow$ Pilih repositori `Web-Kelurahan-Kolongan-Satu`.
3. Masukkan Environment Variables pada bagian **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Klik **Deploy**. Setiap pembaruan yang di-push ke GitHub selanjutnya akan di-deploy secara otomatis (*CI/CD Continuous Deployment*).

---

## 👥 Data Pemerintahan Kelurahan Kolongan Satu

| Nama Pejabat | Jabatan Kedinasan | Wilayah / Tanggung Jawab |
|---|---|---|
| **Theresia J. Kaunang, SE** | Lurah Kolongan Satu | Penanggung Jawab Wilayah & Pengesahan Surat |
| **Febronia L. Pijoh, S.Kom** | Sekretaris Kelurahan | Administrasi Umum, Paraf Dokumen & Rekapitulasi |
| **Karlin R. Wowor** | Staf Administrasi | Pelayanan Loket & Verifikasi Berkas |
| **Meky Mario Turangan** | Kepala Lingkungan I (Pala) | Wilayah Jaga 1 |
| **Devid P.N. Tasie** | Kepala Lingkungan II (Pala) | Wilayah Jaga 2 |
| **Agustinus Sapanany** | Kepala Lingkungan III (Pala) | Wilayah Jaga 3 |
| **Petronella Pusung** | Kepala Lingkungan IV (Pala) | Wilayah Jaga 4 |
| **Vifi Timang** | Kepala Lingkungan V (Pala) | Wilayah Jaga 5 |

---

## 🎓 Tim Pengembang

Platform ini dirancang dan dikembangkan oleh **Mahasiswa Kuliah Kerja Terpadu (KKT) Ke-149 Universitas Sam Ratulangi (UNSRAT) Manado** di Kelurahan Kolongan Satu, Kecamatan Tomohon Tengah, Kota Tomohon, Sulawesi Utara.

---

## 📄 Lisensi

Didistribusikan di bawah lisensi resmi **MIT License**. Hak cipta dilindungi undang-undang © 2024–2026 **Pemerintah Kelurahan Kolongan Satu**.