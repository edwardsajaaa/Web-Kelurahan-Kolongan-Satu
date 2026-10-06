-- ====================================================================
-- SISTEM INFORMASI MONOGRAFI DIGITAL KELURAHAN KOLONGAN SATU
-- Kecamatan Tomohon Tengah, Kota Tomohon, Sulawesi Utara
-- PostgreSQL DDL, Row Level Security (RLS) & Initial Seed Data
-- ====================================================================

-- 0. Ekstensi UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Master Data Wilayah Lingkungan (Lingkungan I - V)
CREATE TABLE IF NOT EXISTS public.lingkungan (
    id SERIAL PRIMARY KEY,
    nama_lingkungan VARCHAR(50) NOT NULL,
    kepala_lingkungan VARCHAR(150) NOT NULL,
    wakil_lingkungan VARCHAR(150) NOT NULL,
    kontak_pala VARCHAR(20)
);

-- 2. Master Tabel Peran Pengguna (Roles) Sesuai SK Kelurahan Kolongan Satu
CREATE TABLE IF NOT EXISTS public.roles (
    id SERIAL PRIMARY KEY,
    kode_role VARCHAR(50) UNIQUE NOT NULL,
    nama_peran VARCHAR(100) NOT NULL,
    deskripsi TEXT
);

-- 3. Tabel Profil Pengguna (Terkoneksi ke Auth / Mock Pejabat)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id INT NOT NULL REFERENCES public.roles(id),
    lingkungan_id INT REFERENCES public.lingkungan(id),
    nama_lengkap VARCHAR(150) NOT NULL,
    nip VARCHAR(35),
    nomor_wa VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabel Periode Tahun Data
CREATE TABLE IF NOT EXISTS public.periode_tahun (
    tahun INT PRIMARY KEY,
    status_terkunci BOOLEAN DEFAULT FALSE,
    dikunci_pada TIMESTAMP WITH TIME ZONE
);

-- 5. Tabel Data Monografi (Penampung Papan Monografi)
CREATE TABLE IF NOT EXISTS public.monografi_rekap (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tahun INT NOT NULL REFERENCES public.periode_tahun(tahun),
    kategori VARCHAR(50) NOT NULL, -- 'wilayah', 'kependudukan', 'pendidikan', 'peternakan', 'lingkungan', 'transparansi'
    rincian_data JSONB NOT NULL,
    status_tahapan VARCHAR(30) DEFAULT 'draft', -- 'draft', 'diverifikasi_seklur', 'disahkan_lurah', 'ditolak'
    catatan_revisi TEXT,
    operator_id UUID REFERENCES public.user_profiles(id),
    verifikator_seklur_id UUID REFERENCES public.user_profiles(id),
    approver_lurah_id UUID REFERENCES public.user_profiles(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tabel Layanan Permohonan Persuratan Warga
CREATE TABLE IF NOT EXISTS public.layanan_surat (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    no_registrasi VARCHAR(50) UNIQUE NOT NULL,
    nik_pemohon VARCHAR(16) NOT NULL,
    nama_pemohon VARCHAR(150) NOT NULL,
    nomor_wa_pemohon VARCHAR(20) NOT NULL,
    jenis_surat VARCHAR(100) NOT NULL,
    isi_permohonan JSONB NOT NULL,
    berkas_lampiran_url TEXT,
    status_surat VARCHAR(30) DEFAULT 'diajukan', -- 'diajukan', 'diverifikasi_staf', 'diparaf_seklur', 'selesai_disahkan', 'ditolak'
    catatan_petugas TEXT,
    diparaf_oleh VARCHAR(150),
    disahkan_oleh VARCHAR(150),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Tabel Pelaporan Insiden & Kerusakan Sarana Lingkungan
CREATE TABLE IF NOT EXISTS public.laporan_warga (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_no VARCHAR(50) UNIQUE,
    lingkungan_id INT REFERENCES public.lingkungan(id),
    nama_warga VARCHAR(150) NOT NULL,
    kontak_warga VARCHAR(20) NOT NULL,
    klasifikasi VARCHAR(100) NOT NULL, -- 'Air Bersih', 'Drainase', 'Lampu Jalan', 'Sampah', 'Keamanan'
    isi_laporan TEXT NOT NULL,
    foto_bukti_url TEXT,
    status VARCHAR(30) DEFAULT 'menunggu_tanggapan', -- 'menunggu_tanggapan', 'dalam_tindakan', 'selesai'
    tanggapan_petugas TEXT,
    dilaporkan_pada TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    diselesaikan_pada TIMESTAMP WITH TIME ZONE
);

-- 8. Tabel Audit Trail Sistem
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.user_profiles(id),
    aksi VARCHAR(100) NOT NULL,
    skema_tabel VARCHAR(50) NOT NULL,
    rekaman_perubahan JSONB,
    waktu_eksekusi TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================================
-- SEED DATA AWAL (MASTER & DEMO KELURAHAN)
-- ===================================================

-- Lingkungan
INSERT INTO public.lingkungan (id, nama_lingkungan, kepala_lingkungan, wakil_lingkungan, kontak_pala) VALUES
(1, 'Lingkungan I (Jaga 1)', 'Meky Mario Turangan', 'Athanasius Ricky Trie', '081234567801'),
(2, 'Lingkungan II (Jaga 2)', 'Devid P.N. Tasie', 'Antonius Kapojos', '081234567802'),
(3, 'Lingkungan III (Jaga 3)', 'Agustinus Sapanany', 'Paulus Wuntuale', '081234567803'),
(4, 'Lingkungan IV (Jaga 4)', 'Petronella Pusung', 'Jerry Maweike', '081234567804'),
(5, 'Lingkungan V (Jaga 5)', 'Vifi Timang', 'Hein Wilson Woh', '081234567805')
ON CONFLICT (id) DO NOTHING;

-- Roles
INSERT INTO public.roles (id, kode_role, nama_peran, deskripsi) VALUES
(1, 'superadmin', 'Lurah', 'Penanggung jawab utama dan pengesahan akhir seluruh data kelurahan'),
(2, 'admin_seklur', 'Sekretaris Kelurahan', 'Verifikator administrasi, manajemen operator dan periode'),
(3, 'pelaksana_adm', 'Pelaksana / Pembantu', 'Pengelola berkas persuratan dan administrasi keuangan'),
(4, 'kasie_pem', 'Kasie Pemerintahan & Trantib', 'Pengelola data kependudukan, teritorial dan keamanan'),
(5, 'kasie_kesra', 'Kasie Kesra', 'Pengelola data pendidikan, disabilitas, sosial, dan keagamaan'),
(6, 'kasie_bang', 'Kasie Pembangunan', 'Pengelola data ekonomi, peternakan, air, dan lingkungan hidup'),
(7, 'operator_pala', 'Pala / Operator Lingkungan', 'Pelapor mutasi data penduduk dan kendala di lingkungan'),
(8, 'publik', 'Warga Publik', 'Pengakses informasi terbuka dan pemohon surat mandiri')
ON CONFLICT (id) DO NOTHING;

-- Periode Tahun
INSERT INTO public.periode_tahun (tahun, status_terkunci, dikunci_pada) VALUES 
(2024, TRUE, '2024-03-15 10:00:00+08'), 
(2026, FALSE, NULL)
ON CONFLICT (tahun) DO NOTHING;

-- Seed Layanan Surat Awal
INSERT INTO public.layanan_surat (no_registrasi, nik_pemohon, nama_pemohon, nomor_wa_pemohon, jenis_surat, isi_permohonan, status_surat, diparaf_oleh, disahkan_oleh) VALUES
('REG-2026-001', '7173012304910001', 'Maikel Wenas', '085298123456', 'Surat Keterangan Usaha (SKU)', '{"namaUsaha": "Kios Sayur Berkat", "alamatUsaha": "Jaga II", "keperluan": "Pengajuan Kredit Usaha Rakyat Bank SulutGo"}', 'selesai_disahkan', 'Ferromel L. Pua, S.Kom (Seklur)', 'Theresia J. Kaunang, SE (Lurah)'),
('REG-2026-002', '7173015509880002', 'Vivi Sumanti', '082190876543', 'Surat Keterangan Berkelakuan Baik', '{"keperluan": "Pemberkasan Seleksi Administrasi PPPK Kota Tomohon", "jaga": "Jaga IV"}', 'diparaf_seklur', 'Ferromel L. Pua, S.Kom (Seklur)', NULL),
('REG-2026-003', '7173011211950003', 'Christian Polii', '081340112233', 'Surat Keterangan Tidak Mampu (SKTM)', '{"keperluan": "Beasiswa Kuliah Mahasiswa Berprestasi Universitas Sam Ratulangi", "jaga": "Jaga I"}', 'diverifikasi_staf', NULL, NULL)
ON CONFLICT (no_registrasi) DO NOTHING;

-- Seed Laporan Warga Awal
INSERT INTO public.laporan_warga (ticket_no, lingkungan_id, nama_warga, kontak_warga, klasifikasi, isi_laporan, status, tanggapan_petugas) VALUES
('LAP-2026-081', 4, 'Bram Moningka', '081356789012', 'Drainase Tersumbat', 'Gorong-gorong tersumbat endapan lumpur pasir di turunan lorong gereja Jaga 4 saat hujan lebat kemarin sore.', 'dalam_tindakan', 'Tim Linmas dan Kasie Pembangunan telah menjadwalkan kerja bakti pembersihan Jumat pagi.'),
('LAP-2026-082', 1, 'Novita Goni', '082187654321', 'Lampu Jalan Padam', 'Dua unit bohlam PJU di tiang batas masuk Jaga 1 padam sejak 3 hari lalu, memicu kerawanan lintasan malam.', 'selesai', 'Petugas telah berkoordinasi dengan PLN Tomohon Tengah dan lampu telah diganti menyala normal.')
ON CONFLICT (ticket_no) DO NOTHING;

-- ===================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ===================================================
ALTER TABLE public.lingkungan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.periode_tahun ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monografi_rekap ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.layanan_surat ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.laporan_warga ENABLE ROW LEVEL SECURITY;

-- 1. Master Data Publik (Lingkungan, Peran, Periode)
CREATE POLICY "Public Read Lingkungan" ON public.lingkungan FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public Read Roles" ON public.roles FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public Read Periode" ON public.periode_tahun FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public Read User Profiles" ON public.user_profiles FOR SELECT TO anon, authenticated USING (true);

-- 2. Publik dapat membaca seluruh data surat (untuk cek resi permohonan mandiri)
CREATE POLICY "Public Read Surat" ON public.layanan_surat FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public Insert Surat" ON public.layanan_surat FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Staff Update Surat" ON public.layanan_surat FOR UPDATE TO anon, authenticated USING (true);

-- 3. Publik dapat membaca dan membuat laporan
CREATE POLICY "Public Read Laporan" ON public.laporan_warga FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public Insert Laporan" ON public.laporan_warga FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Staff Update Laporan" ON public.laporan_warga FOR UPDATE TO anon, authenticated USING (true);

-- 4. Publik dapat membaca data monografi & audit logs
CREATE POLICY "Public Read Monografi" ON public.monografi_rekap FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Staff Update Monografi" ON public.monografi_rekap FOR ALL TO anon, authenticated USING (true);
CREATE POLICY "Public Read Audit Logs" ON public.audit_logs FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public Insert Audit Logs" ON public.audit_logs FOR INSERT TO anon, authenticated WITH CHECK (true);

