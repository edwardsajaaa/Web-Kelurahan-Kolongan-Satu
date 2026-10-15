'use client';

import React, { useState } from 'react';
import {
  PhoneCall,
  Save,
  MapPin,
  Clock,
  Mail,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { KontakInfo } from '@/data/landingContentData';

interface ManageKontakViewProps {
  kontak: KontakInfo;
  onSaveKontak: (updated: KontakInfo) => Promise<void>;
  showToast: (msg: string) => void;
}

export default function ManageKontakView({
  kontak,
  onSaveKontak,
  showToast,
}: ManageKontakViewProps) {
  const [form, setForm] = useState<KontakInfo>({ ...kontak });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSaveKontak(form);
      showToast('Informasi Kontak & Jam Pelayanan berhasil diperbarui ke landing page!');
    } catch (err: any) {
      showToast(`Gagal menyimpan: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <PhoneCall className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Form Kontak Resmi &amp; Jam Pelayanan Kantor
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Data nomor WhatsApp, alamat dinas, dan jam operasional pelayanan publik di halaman utama.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white transition shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Menyimpan...' : 'Simpan Kontak & Jam Pelayanan'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Box 1: Kontak Pelayanan */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Hotline Pelayanan &amp; Lokasi Dinas
            </h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                <span>Nomor Hotline WhatsApp Resmi</span>
              </label>
              <input
                type="text"
                value={form.hotlineWa}
                onChange={(e) => setForm({ ...form, hotlineWa: e.target.value })}
                placeholder="Contoh: 0812-9537-0427"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 font-mono font-bold text-slate-900"
                required
              />
              <p className="text-[11px] text-slate-500">
                Nomor ini digunakan untuk penerusan aduan warga via WhatsApp dan tombol chat bantuan.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-brand-600" />
                <span>Surel (Email) Resmi Kelurahan</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Contoh: kel.kolongansatu@tomohon.go.id"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 font-mono"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-600" />
                <span>Alamat Lengkap Kantor Kelurahan</span>
              </label>
              <textarea
                rows={3}
                value={form.alamatKantor}
                onChange={(e) => setForm({ ...form, alamatKantor: e.target.value })}
                placeholder="Jl. Zanosui, Lingkungan II, Kolongan Satu..."
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 leading-relaxed"
                required
              />
            </div>
          </div>
        </div>

        {/* Box 2: Jam Pelayanan Kantor */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-500"></span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Jam Operasional Pelayanan Warga
            </h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Hari Senin s/d Kamis</span>
              </label>
              <input
                type="text"
                value={form.jamSeninKamis}
                onChange={(e) => setForm({ ...form, jamSeninKamis: e.target.value })}
                placeholder="Senin - Kamis: 08.00 - 16.00 WITA"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 font-semibold"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Hari Jumat</span>
              </label>
              <input
                type="text"
                value={form.jamJumat}
                onChange={(e) => setForm({ ...form, jamJumat: e.target.value })}
                placeholder="Jumat: 08.00 - 15.30 WITA"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 font-semibold"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Sabtu, Minggu &amp; Hari Libur</span>
              </label>
              <input
                type="text"
                value={form.jamWeekend}
                onChange={(e) => setForm({ ...form, jamWeekend: e.target.value })}
                placeholder="Sabtu & Minggu: Tutup (Layanan Daring Aktif 24 Jam)"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 font-semibold"
                required
              />
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Pembaruan jam operasional langsung tersinkron pada bagian footer dan modul layanan landing page.
              </span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
