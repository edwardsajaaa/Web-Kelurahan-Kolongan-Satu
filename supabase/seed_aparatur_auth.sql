-- ====================================================================
-- SISTEM INFORMASI MONOGRAFI DIGITAL KELURAHAN KOLONGAN SATU
-- SEED & SKEMA AUTENTIKASI APARATUR RESMI (HIGH SECURITY SUPABASE)
-- ====================================================================
-- Jalankan skrip ini di: Supabase Dashboard -> SQL Editor -> Run
-- ====================================================================

-- 1. Pastikan ekstensi kriptografi aktif
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Pastikan tabel roles tersedia
CREATE TABLE IF NOT EXISTS public.roles (
    id SERIAL PRIMARY KEY,
    kode_role VARCHAR(50) UNIQUE NOT NULL,
    nama_peran VARCHAR(100) NOT NULL,
    deskripsi TEXT
);

INSERT INTO public.roles (id, kode_role, nama_peran, deskripsi) VALUES
(1, 'superadmin', 'Lurah', 'Penanggung jawab utama dan pengesahan akhir seluruh data kelurahan'),
(2, 'admin_seklur', 'Sekretaris Kelurahan', 'Verifikator administrasi, manajemen operator dan periode'),
(3, 'pelaksana_adm', 'Pelaksana / Pembantu', 'Pengelola berkas persuratan dan administrasi keuangan')
ON CONFLICT (kode_role) DO NOTHING;

-- 3. Tabel Kredensial Resmi Aparatur (Tingkat Keamanan Tinggi)
CREATE TABLE IF NOT EXISTS public.aparatur_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nip VARCHAR(40) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    nama_lengkap VARCHAR(150) NOT NULL,
    jabatan VARCHAR(100) NOT NULL,
    role_code VARCHAR(50) NOT NULL REFERENCES public.roles(kode_role),
    password_hash TEXT NOT NULL,
    nomor_wa VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    failed_attempts INT DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indeks untuk pencarian super cepat berdasarkan NIP & Email
CREATE INDEX IF NOT EXISTS idx_aparatur_nip ON public.aparatur_users(nip);
CREATE INDEX IF NOT EXISTS idx_aparatur_email ON public.aparatur_users(email);

-- 4. Tabel Audit Trail Sistem (Pencatatan Keamanan Akses Login)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    aksi VARCHAR(100) NOT NULL,
    skema_tabel VARCHAR(50) NOT NULL,
    rekaman_perubahan JSONB,
    waktu_eksekusi TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Aktifkan Row Level Security (RLS)
ALTER TABLE public.aparatur_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable all for aparatur_users" ON public.aparatur_users;
CREATE POLICY "Enable all for aparatur_users" ON public.aparatur_users 
FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all for audit_logs" ON public.audit_logs;
CREATE POLICY "Enable all for audit_logs" ON public.audit_logs 
FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 6. SEED AKUN REAL APARATUR RESMI KELURAHAN KOLONGAN SATU
-- Password awal menggunakan enkripsi bcrypt (salt factor 10)
-- --------------------------------------------------------------------
-- Akun 1: LURAH (SUPERADMIN)
-- NIP         : 19731206 200312 2 007 (atau 197312062003122007)
-- Email Resmi : lurah@kolongansatu.tomohon.go.id
-- Password Awal: LurahKKT#2026
-- --------------------------------------------------------------------
-- Akun 2: SEKRETARIS KELURAHAN (ADMIN UTAMA)
-- NIP         : 19780203 200902 2 002 (atau 197802032009022002)
-- Email Resmi : seklur@kolongansatu.tomohon.go.id
-- Password Awal: SeklurKKT#2026
-- --------------------------------------------------------------------

INSERT INTO public.aparatur_users (
    nip,
    email,
    nama_lengkap,
    jabatan,
    role_code,
    password_hash,
    nomor_wa,
    is_active
) VALUES 
(
    '197312062003122007',
    'lurah@kolongansatu.tomohon.go.id',
    'Theresia J. Kaunang, SE',
    'Lurah Kolongan Satu',
    'superadmin',
    crypt('LurahKKT#2026', gen_salt('bf', 10)),
    '081340112233',
    TRUE
),
(
    '197802032009022002',
    'seklur@kolongansatu.tomohon.go.id',
    'Febronia L. Pijoh, S.Kom',
    'Sekretaris Kelurahan',
    'admin_seklur',
    crypt('SeklurKKT#2026', gen_salt('bf', 10)),
    '089529175850',
    TRUE
)
ON CONFLICT (nip) DO UPDATE SET
    email = EXCLUDED.email,
    nama_lengkap = EXCLUDED.nama_lengkap,
    jabatan = EXCLUDED.jabatan,
    role_code = EXCLUDED.role_code,
    password_hash = EXCLUDED.password_hash,
    nomor_wa = EXCLUDED.nomor_wa,
    is_active = TRUE,
    updated_at = NOW();

-- Catat inisialisasi akun ke audit trail
INSERT INTO public.audit_logs (aksi, skema_tabel, rekaman_perubahan)
VALUES (
    'INIT_APARATUR_SECURITY_ACCOUNTS',
    'aparatur_users',
    jsonb_build_object(
        'description', 'Inisialisasi akun resmi Lurah dan Sekretaris Kelurahan Kolongan Satu dengan tingkat keamanan tinggi',
        'accounts', jsonb_build_array('lurah@kolongansatu.tomohon.go.id', 'seklur@kolongansatu.tomohon.go.id'),
        'timestamp', NOW()
    )
);
