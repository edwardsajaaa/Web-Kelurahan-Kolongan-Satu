-- ====================================================================
-- SISTEM INFORMASI MONOGRAFI DIGITAL KELURAHAN KOLONGAN SATU
-- SEED & SCHEMA DATABASE SUPABASE LENGKAP & TERVERIFIKASI
-- ====================================================================

-- 0. Ekstensi UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Master Periode Tahun
CREATE TABLE IF NOT EXISTS public.periode_tahun (
    tahun INT PRIMARY KEY,
    status_terkunci BOOLEAN DEFAULT FALSE,
    dikunci_pada TIMESTAMP WITH TIME ZONE
);

INSERT INTO public.periode_tahun (tahun, status_terkunci, dikunci_pada) VALUES 
(2024, TRUE, '2024-03-15 10:00:00+08'), 
(2025, FALSE, NULL),
(2026, FALSE, NULL)
ON CONFLICT (tahun) DO NOTHING;

-- 2. Master Lingkungan Jaga I - V
CREATE TABLE IF NOT EXISTS public.lingkungan (
    id SERIAL PRIMARY KEY,
    nama_lingkungan VARCHAR(50) NOT NULL,
    kepala_lingkungan VARCHAR(150) NOT NULL,
    wakil_lingkungan VARCHAR(150) NOT NULL,
    kontak_pala VARCHAR(20)
);

INSERT INTO public.lingkungan (id, nama_lingkungan, kepala_lingkungan, wakil_lingkungan, kontak_pala) VALUES
(1, 'Lingkungan I (Jaga 1)', 'Meky Mario Turangan', 'Athanasius Ricky Trie', '089529175850'),
(2, 'Lingkungan II (Jaga 2)', 'Devid P.N. Tasie', 'Antonius Kapojos', '089529175850'),
(3, 'Lingkungan III (Jaga 3)', 'Agustinus Sapanany', 'Paulus Wuntuale', '089529175850'),
(4, 'Lingkungan IV (Jaga 4)', 'Petronella Pusung', 'Jerry Maweike', '089529175850'),
(5, 'Lingkungan V (Jaga 5)', 'Vifi Timang', 'Hein Wilson Woh', '089529175850')
ON CONFLICT (id) DO UPDATE SET kontak_pala = EXCLUDED.kontak_pala;

-- 3. Master Roles
CREATE TABLE IF NOT EXISTS public.roles (
    id SERIAL PRIMARY KEY,
    kode_role VARCHAR(50) UNIQUE NOT NULL,
    nama_peran VARCHAR(100) NOT NULL,
    deskripsi TEXT
);

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

-- 4. Tabel Layanan Surat Warga
CREATE TABLE IF NOT EXISTS public.layanan_surat (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    no_registrasi VARCHAR(50) UNIQUE NOT NULL,
    nik_pemohon VARCHAR(16) NOT NULL,
    nama_pemohon VARCHAR(150) NOT NULL,
    nomor_wa_pemohon VARCHAR(20) NOT NULL,
    jenis_surat VARCHAR(100) NOT NULL,
    isi_permohonan JSONB NOT NULL,
    berkas_lampiran_url TEXT,
    status_surat VARCHAR(30) DEFAULT 'diajukan',
    catatan_petugas TEXT,
    diparaf_oleh VARCHAR(150),
    disahkan_oleh VARCHAR(150),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabel Laporan Warga
CREATE TABLE IF NOT EXISTS public.laporan_warga (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_no VARCHAR(50) UNIQUE,
    lingkungan_id INT REFERENCES public.lingkungan(id),
    nama_warga VARCHAR(150) NOT NULL,
    kontak_warga VARCHAR(20) NOT NULL,
    klasifikasi VARCHAR(100) NOT NULL,
    isi_laporan TEXT NOT NULL,
    foto_bukti_url TEXT,
    status VARCHAR(30) DEFAULT 'menunggu_tanggapan',
    tanggapan_petugas TEXT,
    dilaporkan_pada TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    diselesaikan_pada TIMESTAMP WITH TIME ZONE
);

-- 6. Tabel Data Monografi
CREATE TABLE IF NOT EXISTS public.monografi_rekap (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tahun INT NOT NULL REFERENCES public.periode_tahun(tahun),
    kategori VARCHAR(50) NOT NULL,
    rincian_data JSONB NOT NULL,
    status_tahapan VARCHAR(30) DEFAULT 'draft',
    catatan_revisi TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. AKTIVASI ROW LEVEL SECURITY & POLICY
ALTER TABLE public.periode_tahun ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lingkungan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.layanan_surat ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.laporan_warga ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monografi_rekap ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable all for periode_tahun" ON public.periode_tahun;
CREATE POLICY "Enable all for periode_tahun" ON public.periode_tahun FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all for lingkungan" ON public.lingkungan;
CREATE POLICY "Enable all for lingkungan" ON public.lingkungan FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all for roles" ON public.roles;
CREATE POLICY "Enable all for roles" ON public.roles FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all for layanan_surat" ON public.layanan_surat;
CREATE POLICY "Enable all for layanan_surat" ON public.layanan_surat FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all for laporan_warga" ON public.laporan_warga;
CREATE POLICY "Enable all for laporan_warga" ON public.laporan_warga FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all for monografi_rekap" ON public.monografi_rekap;
CREATE POLICY "Enable all for monografi_rekap" ON public.monografi_rekap FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 8. SEED DATA MONOGRAFI RESMI (REKAPITULASI KEPENDUDUKAN & TERITORIAL 2025)
INSERT INTO public.monografi_rekap (tahun, kategori, rincian_data, status_tahapan, updated_at) VALUES (2025, 'kependudukan', '{"id":"kependudukan-2025","year":2025,"title":"Rekapitulasi Kependudukan & Teritorial (2025)","category":"Kependudukan","categoryKey":"kependudukan","statsLabel":"Agregat Penduduk 2025","statsValue":"1.512 Jiwa • 550 KK","badgeLabel":"Data Mutakhir 2025","image":"https://images.unsplash.com/photo-1577495508048-b635879837f1?w=900&auto=format&fit=crop&q=80","kasieName":"Djonny Maweikere, S.IP (Kasie Pem & Trantib)","description":"Data resmi Monografi Kelurahan Kolongan Satu Tahun 2025. Total penduduk mencapai 1.512 jiwa dengan hak pilih 1.245 jiwa dan luas wilayah administratif mencapai 208,25 Hektar.","detailedNotes":["Batas Wilayah 2025: Utara (Kelurahan Kolongan), Timur (Kelurahan Walian, Matani Tiga), Selatan (Kelurahan Lansot), Barat (Kelurahan Lansot).","Luas Wilayah Total: 208,25 Ha (Tanah Kering 185,75 Ha, Pemukiman 34,50 Ha, Pertanian/Perkebunan 9,50 Ha, Fasilitas Umum 7,50 Ha, Sawah 5,00 Ha, Pekarangan 4,00 Ha, Rawa 0,50 Ha, Lahan Tidur 0,05 Ha).","Kelompok Usia: Balita (0-6 thn) 121 jiwa, Usia Sekolah (7-18 thn) 247 jiwa, Produktif (18-56 thn) 864 jiwa, Lansia (>56 thn) 280 jiwa production.","Karakteristik Geografis: Ketinggian 700 - 900 mdpl, suhu rata-rata 23°C, curah hujan 600 - 800 mm, dataran tinggi bergelombang subur."],"statusTahapan":"disahkan_lurah","lastUpdated":"10 Januari 2025 - 08:30 WITA","metrics":{"totalWarga":1512,"kepalaKeluarga":550,"pria":730,"wanita":782,"customMetrics":[{"label":"Hak Pilih Pemilu","value":"1.245 Jiwa","color":"indigo"},{"label":"Luas Total Wilayah","value":"208,25 Ha","color":"emerald"},{"label":"Suhu Rata-rata","value":"23°C","color":"sky"},{"label":"Topografi Wilayah","value":"700-900 mdpl","color":"purple"}]},"chartData":{"type":"bar","title":"Distribusi Kelompok Usia Penduduk 2025","items":[{"label":"Balita (0-6 thn)","value":121,"color":"#38bdf8"},{"label":"Sekolah (7-18 thn)","value":247,"color":"#0284c7"},{"label":"Produktif (18-56 thn)","value":864,"color":"#0369a1"},{"label":"Lansia (>56 thn)","value":280,"color":"#0c4a6e"}]},"tableData":{"headers":["Parameter Wilayah & Demografi","Nilai / Kuantitas","Satuan","Keterangan"],"rows":[["Total Penduduk 2025","1.512","Jiwa","730 Laki-laki, 782 Perempuan"],["Kepala Keluarga (KK)","550","KK","Tercatat register dukcapil"],["Hak Pilih Pemilu","1.245","Jiwa","Warga usia 17 tahun ke atas / menikah"],["Luas Wilayah Total","208,25","Hektar","Kecamatan Tomohon Tengah"],["Tanah Kering","185,75","Hektar","Potensi pengembangan dan kebun"],["Pemukiman Warga","34,50","Hektar","Kawasan hunian 5 Jaga"]]}}'::jsonb, 'disahkan_lurah', NOW());

