'use client';

import React, { useState } from 'react';
import {
  Users,
  Save,
  Shield,
  HeartHandshake,
  Hammer,
  UserCheck,
  Briefcase,
  MapPin,
  Phone,
  Sparkles,
} from 'lucide-react';
import { AparaturData } from '@/data/landingContentData';

interface ManageAparaturViewProps {
  aparatur: AparaturData;
  onSaveAparatur: (updated: AparaturData) => Promise<void>;
  showToast: (msg: string) => void;
}

export default function ManageAparaturView({
  aparatur,
  onSaveAparatur,
  showToast,
}: ManageAparaturViewProps) {
  const [form, setForm] = useState<AparaturData>(JSON.parse(JSON.stringify(aparatur)));
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSaveAparatur(form);
      showToast('Struktur Organisasi & Aparatur Kelurahan berhasil diperbarui ke landing page!');
    } catch (err: any) {
      showToast(`Gagal menyimpan: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKasieChange = (index: number, field: string, value: string) => {
    setForm((prev) => {
      const updatedKasie = [...prev.kasie];
      updatedKasie[index] = { ...updatedKasie[index], [field]: value };
      return { ...prev, kasie: updatedKasie };
    });
  };

  const handleLingkunganChange = (index: number, field: string, value: string) => {
    setForm((prev) => {
      const updatedLingk = [...prev.lingkungan];
      updatedLingk[index] = { ...updatedLingk[index], [field]: value };
      return { ...prev, lingkungan: updatedLingk };
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Header Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Form Struktur Aparatur Kelurahan Kolongan Satu
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Data ini langsung ditampilkan pada bagian Struktur Organisasi &amp; Tata Kelola di landing page.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white transition shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Menyimpan...' : 'Simpan Seluruh Aparatur'}</span>
        </button>
      </div>

      {/* 1. LEVEL 1: LURAH */}
      <div className="bg-white rounded-2xl p-6 border-2 border-brand-500/30 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-600 text-white uppercase tracking-wider">
            Pimpinan Utama (Lurah)
          </span>
          <span className="text-xs text-slate-500">Tingkat Penanggung Jawab Wilayah</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Nama Lengkap Lurah</label>
            <input
              type="text"
              value={form.lurah.nama}
              onChange={(e) =>
                setForm({ ...form, lurah: { ...form.lurah, nama: e.target.value } })
              }
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 font-bold text-slate-900"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">NIP Lurah</label>
            <input
              type="text"
              value={form.lurah.nip}
              onChange={(e) =>
                setForm({ ...form, lurah: { ...form.lurah, nip: e.target.value } })
              }
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 font-mono font-semibold"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Nomor WhatsApp / HP</label>
            <input
              type="text"
              value={form.lurah.phone}
              onChange={(e) =>
                setForm({ ...form, lurah: { ...form.lurah, phone: e.target.value } })
              }
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
              required
            />
          </div>
        </div>
      </div>

      {/* 2. LEVEL 2: SEKRETARIAT KELURAHAN (SEKLUR & PELAKSANA) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Seklur */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200 uppercase tracking-wider">
              Sekretaris Kelurahan
            </span>
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Nama Lengkap Seklur</label>
              <input
                type="text"
                value={form.seklur.nama}
                onChange={(e) =>
                  setForm({ ...form, seklur: { ...form.seklur, nama: e.target.value } })
                }
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 font-bold"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">NIP Seklur</label>
              <input
                type="text"
                value={form.seklur.nip}
                onChange={(e) =>
                  setForm({ ...form, seklur: { ...form.seklur, nip: e.target.value } })
                }
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 font-mono font-semibold"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Nomor WhatsApp / HP</label>
              <input
                type="text"
                value={form.seklur.phone}
                onChange={(e) =>
                  setForm({ ...form, seklur: { ...form.seklur, phone: e.target.value } })
                }
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Pelaksana Adm */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 uppercase tracking-wider">
              Pelaksana Administrasi
            </span>
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Nama Pelaksana</label>
              <input
                type="text"
                value={form.pelaksana.nama}
                onChange={(e) =>
                  setForm({ ...form, pelaksana: { ...form.pelaksana, nama: e.target.value } })
                }
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 font-bold"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">NIP Pelaksana</label>
              <input
                type="text"
                value={form.pelaksana.nip}
                onChange={(e) =>
                  setForm({ ...form, pelaksana: { ...form.pelaksana, nip: e.target.value } })
                }
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 font-mono font-semibold"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Nomor WhatsApp / HP</label>
              <input
                type="text"
                value={form.pelaksana.phone}
                onChange={(e) =>
                  setForm({ ...form, pelaksana: { ...form.pelaksana, phone: e.target.value } })
                }
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. LEVEL 3: SEKSI TEKNIS PELAYANAN (3 KASIE) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-600"></span>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Seksi Teknis Pelayanan (3 Kepala Seksi)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {form.kasie.map((item, idx) => (
            <div key={item.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800 block text-center">
                {item.badge}
              </span>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Nama Pejabat</label>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => handleKasieChange(idx, 'name', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500 font-bold"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">NIP</label>
                <input
                  type="text"
                  value={item.nip}
                  onChange={(e) => handleKasieChange(idx, 'nip', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500 font-mono font-semibold"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Staf Pembantu</label>
                <input
                  type="text"
                  value={item.pembantu}
                  onChange={(e) => handleKasieChange(idx, 'pembantu', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Nomor WhatsApp</label>
                <input
                  type="text"
                  value={item.phone}
                  onChange={(e) => handleKasieChange(idx, 'phone', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. LEVEL 4: UNSUR KEWILAYAHAN (KEPALA LINGKUNGAN / PALA I - V) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Unsur Kewilayahan (Kepala Lingkungan I s/d V &amp; Wakil)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {form.lingkungan.map((lingk, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="py-1 px-2 rounded-lg text-center text-xs font-bold bg-brand-600 text-white shadow-2xs">
                {lingk.lingkungan}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-700 uppercase">Kepala Lingkungan (Pala)</label>
                <input
                  type="text"
                  value={lingk.pala}
                  onChange={(e) => handleLingkunganChange(idx, 'pala', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500 font-bold"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-700 uppercase">Wakil (Mevrouw)</label>
                <input
                  type="text"
                  value={lingk.mevrouw}
                  onChange={(e) => handleLingkunganChange(idx, 'mevrouw', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500 font-semibold text-brand-700"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-700 uppercase">Nomor Kontak / WA</label>
                <input
                  type="text"
                  value={lingk.phone || ''}
                  onChange={(e) => handleLingkunganChange(idx, 'phone', e.target.value)}
                  placeholder="0813-..."
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}
