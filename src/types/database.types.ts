/**
 * TypeScript Interfaces untuk Supabase Database Kelurahan Kolongan Satu
 * Sesuai skema PostgreSQL DDL & RLS di ModalSqlSchema.tsx
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      lingkungan: {
        Row: {
          id: number;
          nama_lingkungan: string;
          kepala_lingkungan: string;
          wakil_lingkungan: string;
          kontak_pala: string | null;
        };
        Insert: {
          id?: number;
          nama_lingkungan: string;
          kepala_lingkungan: string;
          wakil_lingkungan: string;
          kontak_pala?: string | null;
        };
        Update: {
          id?: number;
          nama_lingkungan?: string;
          kepala_lingkungan?: string;
          wakil_lingkungan?: string;
          kontak_pala?: string | null;
        };
        Relationships: [];
      };
      roles: {
        Row: {
          id: number;
          kode_role: string;
          nama_peran: string;
          deskripsi: string | null;
        };
        Insert: {
          id?: number;
          kode_role: string;
          nama_peran: string;
          deskripsi?: string | null;
        };
        Update: {
          id?: number;
          kode_role?: string;
          nama_peran?: string;
          deskripsi?: string | null;
        };
        Relationships: [];
      };
      user_profiles: {
        Row: {
          id: string;
          role_id: number;
          lingkungan_id: number | null;
          nama_lengkap: string;
          nip: string | null;
          nomor_wa: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          role_id: number;
          lingkungan_id?: number | null;
          nama_lengkap: string;
          nip?: string | null;
          nomor_wa: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          role_id?: number;
          lingkungan_id?: number | null;
          nama_lengkap?: string;
          nip?: string | null;
          nomor_wa?: string;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      periode_tahun: {
        Row: {
          tahun: number;
          status_terkunci: boolean;
          dikunci_pada: string | null;
        };
        Insert: {
          tahun: number;
          status_terkunci?: boolean;
          dikunci_pada?: string | null;
        };
        Update: {
          tahun?: number;
          status_terkunci?: boolean;
          dikunci_pada?: string | null;
        };
        Relationships: [];
      };
      monografi_rekap: {
        Row: {
          id: string;
          tahun: number;
          kategori: string;
          rincian_data: Json;
          status_tahapan: 'draft' | 'diverifikasi_seklur' | 'disahkan_lurah' | 'ditolak';
          catatan_revisi: string | null;
          operator_id: string | null;
          verifikator_seklur_id: string | null;
          approver_lurah_id: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tahun: number;
          kategori: string;
          rincian_data: Json;
          status_tahapan?: 'draft' | 'diverifikasi_seklur' | 'disahkan_lurah' | 'ditolak';
          catatan_revisi?: string | null;
          operator_id?: string | null;
          verifikator_seklur_id?: string | null;
          approver_lurah_id?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tahun?: number;
          kategori?: string;
          rincian_data?: Json;
          status_tahapan?: 'draft' | 'diverifikasi_seklur' | 'disahkan_lurah' | 'ditolak';
          catatan_revisi?: string | null;
          operator_id?: string | null;
          verifikator_seklur_id?: string | null;
          approver_lurah_id?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      layanan_surat: {
        Row: {
          id: string;
          no_registrasi: string;
          nik_pemohon: string;
          nama_pemohon: string;
          nomor_wa_pemohon: string;
          jenis_surat: string;
          isi_permohonan: Json;
          berkas_lampiran_url: string | null;
          status_surat: 'diajukan' | 'diverifikasi_staf' | 'diparaf_seklur' | 'selesai_disahkan' | 'ditolak';
          catatan_petugas?: string | null;
          diparaf_oleh?: string | null;
          disahkan_oleh?: string | null;
          created_at: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          no_registrasi: string;
          nik_pemohon: string;
          nama_pemohon: string;
          nomor_wa_pemohon: string;
          jenis_surat: string;
          isi_permohonan: Json;
          berkas_lampiran_url?: string | null;
          status_surat?: 'diajukan' | 'diverifikasi_staf' | 'diparaf_seklur' | 'selesai_disahkan' | 'ditolak';
          catatan_petugas?: string | null;
          diparaf_oleh?: string | null;
          disahkan_oleh?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          no_registrasi?: string;
          nik_pemohon?: string;
          nama_pemohon?: string;
          nomor_wa_pemohon?: string;
          jenis_surat?: string;
          isi_permohonan?: Json;
          berkas_lampiran_url?: string | null;
          status_surat?: 'diajukan' | 'diverifikasi_staf' | 'diparaf_seklur' | 'selesai_disahkan' | 'ditolak';
          catatan_petugas?: string | null;
          diparaf_oleh?: string | null;
          disahkan_oleh?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      laporan_warga: {
        Row: {
          id: string;
          ticket_no?: string | null;
          lingkungan_id: number;
          nama_warga: string;
          kontak_warga: string;
          klasifikasi: string;
          isi_laporan: string;
          foto_bukti_url: string | null;
          status: 'menunggu_tanggapan' | 'dalam_tindakan' | 'selesai';
          tanggapan_petugas?: string | null;
          dilaporkan_pada: string;
          diselesaikan_pada?: string | null;
        };
        Insert: {
          id?: string;
          ticket_no?: string | null;
          lingkungan_id: number;
          nama_warga: string;
          kontak_warga: string;
          klasifikasi: string;
          isi_laporan: string;
          foto_bukti_url?: string | null;
          status?: 'menunggu_tanggapan' | 'dalam_tindakan' | 'selesai';
          tanggapan_petugas?: string | null;
          dilaporkan_pada?: string;
          diselesaikan_pada?: string | null;
        };
        Update: {
          id?: string;
          ticket_no?: string | null;
          lingkungan_id?: number;
          nama_warga?: string;
          kontak_warga?: string;
          klasifikasi?: string;
          isi_laporan?: string;
          foto_bukti_url?: string | null;
          status?: 'menunggu_tanggapan' | 'dalam_tindakan' | 'selesai';
          tanggapan_petugas?: string | null;
          dilaporkan_pada?: string;
          diselesaikan_pada?: string | null;
        };
        Relationships: [];
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string | null;
          aksi: string;
          skema_tabel: string;
          rekaman_perubahan: Json | null;
          waktu_eksekusi: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          aksi: string;
          skema_tabel: string;
          rekaman_perubahan?: Json | null;
          waktu_eksekusi?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          aksi?: string;
          skema_tabel?: string;
          rekaman_perubahan?: Json | null;
          waktu_eksekusi?: string;
        };
        Relationships: [];
      };
    };
  };
}
