<p align="center">
  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmHZWdfGwGmtKd7WQmqYAolpSTVfdzZ9o_PS86bfdJVmhgEbRRth-v4rnoCOXBuQ4rQllgVR5nednaoxhTKE3HaZrfgKH07dp48WXlGpdCkPwVw7t1SLyV-UQxj_n3EiZqaWXZItQiD2p_vqtKi_xSE74TrV0f1V-Azvr4pEqGb2SCR7zqAIzDYHRNzTburxA3gDsFwOEtNColVLoZ5UF1Xy0WSKOkbAkPEIA04HcG2N0n-qDAhHKdo7iOJD-lul2L9S0" width="80" alt="Logo Kelurahan Kolongan Satu" />
</p>

<h1 align="center">Website Kelurahan Kolongan Satu</h1>

<p align="center">
  <strong>Sistem Informasi Monografi Digital & Portal Pelayanan Publik Terpadu</strong><br/>
  Kelurahan Kolongan Satu · Kecamatan Tomohon Tengah · Kota Tomohon · Sulawesi Utara
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.3-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.3-61DAFB?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-7.0-3178C6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss" alt="TailwindCSS" />
</p>

---

## Tentang Proyek

Website ini merupakan portal resmi Kelurahan Kolongan Satu yang dirancang untuk memberikan akses terbuka terhadap data monografi kelurahan serta mempermudah pelayanan administrasi bagi masyarakat. Seluruh informasi kependudukan, kewilayahan, dan layanan persuratan dapat diakses secara digital melalui satu platform terpadu.

Pengembangan dilakukan melalui kerja sama antara mahasiswa **Kuliah Kerja Terpadu (KKT) Ke-149 Universitas Sam Ratulangi** dengan Pemerintah Kelurahan Kolongan Satu di bawah pimpinan Lurah **Theresia J. Kaunang, SE**.

---

## Fitur

### Landing Page (`/`)
- Tampilan utama dengan panorama kawasan dan navigasi ke seluruh bagian situs
- Ringkasan data monografi: total penduduk, jumlah KK, wilayah lingkungan, dan tingkat digitalisasi
- Visi dan misi kelurahan beserta profil Lurah
- Sejarah dan asal-usul Kelurahan Kolongan Satu
- Pusat layanan warga dengan akses langsung ke monografi, peta wilayah, dan persuratan
- Informasi kantor, jam pelayanan, dan lokasi

### Portal Monografi (`/portal`)
- Dashboard tiga kolom: navigasi, daftar data, dan panel detail
- Data kewilayahan 5 Lingkungan (Jaga I-V) lengkap dengan batas administratif dan kontak kepala lingkungan
- Data kependudukan: jumlah jiwa, rasio gender, kelompok umur, dan struktur keluarga
- Data pendidikan, sosial, peternakan, dan lingkungan hidup
- Transparansi anggaran kelurahan (APBDes)

### Pelayanan Persuratan
- Pengajuan surat secara online (Surat Keterangan Domisili, SKU, Pengantar SKCK, dan lainnya)
- Alur verifikasi bertahap: Staf, Sekretaris Kelurahan (paraf), hingga Lurah (pengesahan)
- Pratinjau dan cetak dokumen surat resmi
- Nomor registrasi otomatis untuk pelacakan status

### Pengaduan Warga
- Formulir pelaporan masalah infrastruktur dan lingkungan
- Sistem tiket untuk memantau proses penanganan
- Tanggapan langsung dari petugas kelurahan

### Fitur Internal Aparatur
- Pergantian peran pengguna (Lurah, Seklur, Staf) dengan hak akses masing-masing
- Simulasi notifikasi WhatsApp ke pejabat terkait
- Pengesahan data monografi secara digital
- Dokumentasi skema database PostgreSQL (Supabase)

---

## Struktur Proyek

```
Web-Kelurahan-Kolongan-Satu/
├── src/
│   ├── app/
│   │   ├── page.tsx                       # Landing page
│   │   ├── portal/page.tsx                # Portal monografi & administrasi
│   │   ├── monografi/page.tsx             # Alias portal
│   │   ├── layout.tsx                     # Root layout
│   │   └── globals.css                    # Stylesheet global
│   ├── components/
│   │   ├── Sidebar.tsx                    # Navigasi sidebar
│   │   ├── CardFeed.tsx                   # Daftar kartu data
│   │   ├── DetailView.tsx                 # Panel detail & grafik
│   │   ├── RoleSwitcherDropdown.tsx        # Pergantian peran aparatur
│   │   ├── ModalLetterRequest.tsx          # Permohonan surat
│   │   ├── ModalCitizenReport.tsx          # Pengaduan warga
│   │   ├── ModalWhatsAppSimulator.tsx      # Simulasi notifikasi WA
│   │   ├── ModalOfficialLetterPreview.tsx  # Pratinjau surat resmi
│   │   ├── ModalMonografiPrint.tsx         # Cetak lembar monografi
│   │   └── ModalSqlSchema.tsx             # Viewer skema database
│   └── data/
│       ├── monografiData.ts               # Data monografi kelurahan
│       ├── officialsData.ts               # Data pejabat kelurahan
│       ├── lettersData.ts                 # Data permohonan surat
│       ├── reportsData.ts                 # Data pengaduan
│       └── sqlSchemaData.ts               # Skema SQL
├── tailwind.config.js
├── next.config.mjs
├── tsconfig.json
└── package.json
```

---

## Cara Menjalankan

### Prasyarat
- Node.js versi 18 atau lebih baru
- npm (sudah termasuk dalam instalasi Node.js)

### Instalasi

```bash
# Clone repository
git clone https://github.com/edwardsajaaa/Web-Kelurahan-Kolongan-Satu.git
cd Web-Kelurahan-Kolongan-Satu

# Install dependencies
npm install

# Jalankan server pengembangan
npm run dev
```

Akses aplikasi di [http://localhost:3000](http://localhost:3000).

### Build Produksi

```bash
npm run build
npm start
```

---

## Teknologi

| Teknologi | Versi | Keterangan |
|-----------|-------|------------|
| Next.js | 16.3 (Turbopack) | Framework React full-stack |
| React | 19.3 | Library antarmuka pengguna |
| TypeScript | 7.0 | Pengetikan statis |
| Tailwind CSS | 3.4 | Utility-first CSS |
| Lucide React | 1.48 | Ikon SVG |
| Material Symbols | — | Ikon Material Design |
| Plus Jakarta Sans | — | Tipografi utama |

---

## Data Monografi

| Kategori | Keterangan |
|----------|------------|
| Total Penduduk | 1.484 Jiwa |
| Kepala Keluarga | 540 KK |
| Laki-laki | 748 Jiwa |
| Perempuan | 736 Jiwa |
| Wilayah Lingkungan | 5 Lingkungan (Jaga I – V) |
| Kepala Lingkungan | 5 Orang |
| Ketinggian | 750 mdpl |
| Kecamatan | Tomohon Tengah |
| Kota | Tomohon, Sulawesi Utara |

---

## Aparatur Kelurahan

| Nama | Jabatan |
|------|---------|
| Theresia J. Kaunang, SE | Lurah |
| Ferromel L. Pua, S.Kom | Sekretaris Kelurahan |
| Karlin R. Wowor | Staf Administrasi |
| Meisy T. Rompas | Kepala Seksi Pemberdayaan |
| Jefri M. Tamboto | Kepala Seksi Pemerintahan |

---

## Kolaborasi

Proyek ini merupakan hasil kerja sama antara Program **Kuliah Kerja Terpadu (KKT) Ke-149 Universitas Sam Ratulangi** Manado dengan Pemerintah Kelurahan Kolongan Satu, Kecamatan Tomohon Tengah, Kota Tomohon.

---

## Lisensi

Proyek ini menggunakan [MIT License](LICENSE).

---

<p align="center">
  <sub>Pemerintah Kelurahan Kolongan Satu · Kota Tomohon · Sulawesi Utara</sub><br/>
  <sub>Dikembangkan oleh Mahasiswa KKT 149 UNSRAT</sub>
</p>