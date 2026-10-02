export const SUPABASE_SQL_DDL = `-- ====================================================================
-- SISTEM INFORMASI MONOGRAFI DIGITAL KELURAHAN KOLONGAN SATU
-- Kecamatan Tomohon Tengah, Kota Tomohon, Sulawesi Utara
-- PostgreSQL DDL & Row Level Security (RLS) Schema
-- ====================================================================

-- Aktivasi ekstensi UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Master Data Wilayah Lingkungan (Lingkungan I - V)
CREATE TABLE IF NOT EXISTS lingkungan (
    id SERIAL PRIMARY KEY,
    nama_lingkungan VARCHAR(50) NOT NULL,
    kepala_lingkungan VARCHAR(150) NOT NULL,
    wakil_lingkungan VARCHAR(150) NOT NULL,
    kontak_pala VARCHAR(20)
);

INSERT INTO lingkungan (id, nama_lingkungan, kepala_lingkungan, wakil_lingkungan) VALUES
(1, 'Lingkungan I', 'Meky Mario Turangan', 'Athanasius Ricky Trie'),
(2, 'Lingkungan II', 'Devid P.N. Tasie', 'Antonius Kapojos'),
(3, 'Lingkungan III', 'Agustinus Sapanany', 'Paulus Wuntuale'),
(4, 'Lingkungan IV', 'Petronella Pusung', 'Jerry Maweike'),
(5, 'Lingkungan V', 'Vifi Timang', 'Hein Wilson Woh')
ON CONFLICT (id) DO NOTHING;

-- 2. Master Tabel Peran Pengguna (Roles) Sesuai SK Kelurahan Kolongan Satu
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    kode_role VARCHAR(50) UNIQUE NOT NULL,
    nama_peran VARCHAR(100) NOT NULL,
    deskripsi TEXT
);

INSERT INTO roles (kode_role, nama_peran, deskripsi) VALUES
('superadmin', 'Lurah', 'Penanggung jawab utama dan pengesahan akhir seluruh data kelurahan'),
('admin_seklur', 'Sekretaris Kelurahan', 'Verifikator administrasi, manajemen operator dan periode'),
('pelaksana_adm', 'Pelaksana / Pembantu', 'Pengelola berkas persuratan dan administrasi keuangan'),
('kasie_pem', 'Kasie Pemerintahan & Trantib', 'Pengelola data kependudukan, teritorial dan keamanan'),
('kasie_kesra', 'Kasie Kesra', 'Pengelola data pendidikan, disabilitas, sosial, dan keagamaan'),
('kasie_bang', 'Kasie Pembangunan', 'Pengelola data ekonomi, peternakan, air, dan lingkungan hidup'),
('operator_pala', 'Pala / Operator Lingkungan', 'Pelapor mutasi data penduduk dan kendala di lingkungan')
ON CONFLICT (kode_role) DO NOTHING;

-- 3. Tabel Profil Pengguna Terhubung ke Supabase Auth
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id INT NOT NULL REFERENCES roles(id),
    lingkungan_id INT REFERENCES lingkungan(id),
    nama_lengkap VARCHAR(150) NOT NULL,
    nip VARCHAR(35),
    nomor_wa VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabel Periode Tahun Data
CREATE TABLE IF NOT EXISTS periode_tahun (
    tahun INT PRIMARY KEY,
    status_terkunci BOOLEAN DEFAULT FALSE,
    dikunci_pada TIMESTAMP WITH TIME ZONE
);

INSERT INTO periode_tahun (tahun, status_terkunci) VALUES 
(2024, TRUE), 
(2026, FALSE)
ON CONFLICT (tahun) DO NOTHING;

-- 5. Tabel Data Monografi (Penampung Papan Monografi)
CREATE TABLE IF NOT EXISTS monografi_rekap (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tahun INT NOT NULL REFERENCES periode_tahun(tahun),
    kategori VARCHAR(50) NOT NULL, -- 'demografi', 'pendidikan', 'peternakan', 'lingkungan', 'mata_pencaharian'
    rincian_data JSONB NOT NULL,
    status_tahapan VARCHAR(30) DEFAULT 'draft', -- 'draft', 'diverifikasi_seklur', 'disahkan_lurah', 'ditolak'
    catatan_revisi TEXT,
    operator_id UUID REFERENCES user_profiles(id),
    verifikator_seklur_id UUID REFERENCES user_profiles(id),
    approver_lurah_id UUID REFERENCES user_profiles(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tabel Layanan Permohonan Persuratan Warga
CREATE TABLE IF NOT EXISTS layanan_surat (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    no_registrasi VARCHAR(50) UNIQUE NOT NULL,
    nik_pemohon VARCHAR(16) NOT NULL,
    nama_pemohon VARCHAR(150) NOT NULL,
    nomor_wa_pemohon VARCHAR(20) NOT NULL,
    jenis_surat VARCHAR(100) NOT NULL,
    isi_permohonan JSONB NOT NULL,
    berkas_lampiran_url TEXT,
    status_surat VARCHAR(30) DEFAULT 'diajukan', -- 'diajukan', 'diverifikasi_staf', 'diparaf_seklur', 'selesai_disahkan', 'ditolak'
    diparaf_oleh UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Tabel Pelaporan Insiden & Kerusakan Sarana Lingkungan
CREATE TABLE IF NOT EXISTS laporan_warga (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lingkungan_id INT NOT NULL REFERENCES lingkungan(id),
    nama_warga VARCHAR(150) NOT NULL,
    kontak_warga VARCHAR(20) NOT NULL,
    klasifikasi VARCHAR(100) NOT NULL, -- 'Air Bersih', 'Drainase', 'Lampu Jalan', 'Sampah'
    isi_laporan TEXT NOT NULL,
    foto_bukti_url TEXT,
    status VARCHAR(30) DEFAULT 'menunggu_tanggapan', -- 'menunggu_tanggapan', 'dalam_tindakan', 'selesai'
    dilaporkan_pada TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Tabel Audit Trail Sistem
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id),
    aksi VARCHAR(100) NOT NULL,
    skema_tabel VARCHAR(50) NOT NULL,
    rekaman_perubahan JSONB,
    waktu_eksekusi TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================================
-- PENGATURAN ROW LEVEL SECURITY (RLS) POLICIES
-- ===================================================
ALTER TABLE monografi_rekap ENABLE ROW LEVEL SECURITY;
ALTER TABLE layanan_surat ENABLE ROW LEVEL SECURITY;
ALTER TABLE laporan_warga ENABLE ROW LEVEL SECURITY;

-- Hak Akses Monografi: Publik hanya dapat membaca data yang disahkan Lurah
CREATE POLICY "Publik dapat membaca data monografi yang sah"
ON monografi_rekap FOR SELECT
TO anon, authenticated
USING (status_tahapan = 'disahkan_lurah');

-- Hak Akses Monografi: Aparatur kelurahan dapat membaca seluruh status draf
CREATE POLICY "Aparatur berwenang mengelola data monografi"
ON monografi_rekap FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM user_profiles up
        JOIN roles r ON up.role_id = r.id
        WHERE up.id = auth.uid() AND r.kode_role IN ('superadmin', 'admin_seklur', 'kasie_pem', 'kasie_kesra', 'kasie_bang')
    )
);

-- Hak Akses Layanan Surat: Publik dapat memasukkan permohonan surat
CREATE POLICY "Publik dapat memasukkan permohonan surat"
ON layanan_surat FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Hak Akses Layanan Surat: Warga hanya bisa melihat status suratnya sendiri lewat registrasi
CREATE POLICY "Publik dapat memantau status surat mandiri"
ON layanan_surat FOR SELECT
TO anon, authenticated
USING (true);
`;
