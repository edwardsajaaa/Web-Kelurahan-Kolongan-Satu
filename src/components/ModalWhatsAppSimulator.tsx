'use client';
import React, { useState } from 'react';
import { MonografiItem } from '@/data/monografiData';
import { Official } from '@/data/officialsData';
import {
  Send,
  X,
  Phone,
  Video,
  MoreVertical,
  CheckCheck,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Lock,
  Smartphone
} from 'lucide-react';

interface ModalWhatsAppSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  activeItem: MonografiItem;
  onApproveViaMagicLink: (itemId: string) => void;
  currentOfficial: Official;
}

export default function ModalWhatsAppSimulator({
  isOpen,
  onClose,
  activeItem,
  onApproveViaMagicLink,
  currentOfficial,
}: ModalWhatsAppSimulatorProps) {
  const [hasApproved, setHasApproved] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  if (!isOpen) return null;

  const handleMagicApproval = () => {
    onApproveViaMagicLink(activeItem.id);
    setHasApproved(true);
    setFeedbackMsg('Pengesahan berhasil dieksekusi secara instan! Status monografi kini resmi diterbitkan ke publik.');
  };

  const actionUrl = `https://kolongansatu.tomohon.go.id/approval-kilat?id=${activeItem.id}&token=hmac_sec_99182`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 text-white w-full max-w-md rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border-4 border-slate-700/80 max-h-[92vh]">
        {/* Phone Speaker Notch Header */}
        <div className="h-6 bg-slate-950 flex items-center justify-center relative">
          <div className="w-20 h-3.5 bg-slate-800 rounded-full"></div>
          <button
            onClick={onClose}
            className="absolute right-3 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* WhatsApp Top Bar */}
        <div className="bg-[#075e54] px-4 py-3 flex items-center justify-between text-white shadow-md">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-full bg-emerald-800 flex items-center justify-center font-bold text-sm border-2 border-white/30 text-white">
              K1
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <p className="text-xs font-bold leading-tight">Server Cloud Kelurahan</p>
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-300" />
              </div>
              <p className="text-[10px] text-emerald-100 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                <span>Bot Gateway Aktif (Online)</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-emerald-100">
            <Phone className="w-4 h-4" />
            <Video className="w-4 h-4" />
            <MoreVertical className="w-4 h-4" />
          </div>
        </div>

        {/* WhatsApp Chat Body */}
        <div className="flex-1 bg-[#efeae2] p-4 overflow-y-auto space-y-3 font-sans text-slate-800 relative">
          {/* Subtle WA background pattern simulated */}
          <div className="flex justify-center">
            <span className="bg-white/80 backdrop-blur-xs text-[10px] text-slate-600 px-3 py-1 rounded-lg shadow-2xs font-medium">
              Hari ini, {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}
            </span>
          </div>

          <div className="flex justify-center">
            <div className="bg-[#ffeecd] text-[10px] text-amber-900 p-2 rounded-xl text-center shadow-2xs border border-amber-200/50 flex items-center space-x-1.5 max-w-xs">
              <Lock className="w-3 h-3 text-amber-700 flex-shrink-0" />
              <span>Pesan ini terenkripsi ujung-ke-ujung (End-to-End Encrypted HMAC)</span>
            </div>
          </div>

          {/* Outgoing Bot Message */}
          <div className="bg-white rounded-2xl rounded-tl-xs p-3.5 shadow-sm max-w-sm border border-slate-200/60 space-y-2.5">
            <div className="flex items-center space-x-1.5 text-emerald-800 text-xs font-bold border-b border-slate-100 pb-1.5">
              <span>🔔 SISTEM INFORMASI KELURAHAN KOLONGAN SATU</span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              Yth. Ibu Lurah (<strong>Theresia J. Kaunang, SE</strong>)
            </p>

            <p className="text-xs text-slate-700 leading-relaxed">
              Data monografi baru telah diverifikasi oleh Sekretaris Kelurahan (<strong>Ferromel L. Pua, S.Kom</strong>) dan menunggu pengesahan Anda:
            </p>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs space-y-1 font-mono">
              <p>• <strong>Modul Data:</strong> {activeItem.category.toUpperCase()}</p>
              <p>• <strong>Sub-Entitas:</strong> {activeItem.title}</p>
              <p>• <strong>Tahun Periode:</strong> {activeItem.year}</p>
              <p>• <strong>Status:</strong> Menunggu Pengesahan Pimpinan</p>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              Silakan periksa ringkasan angka dan klik tautan aman berikut langsung dari layar HP untuk mengesahkan:
            </p>

            {/* MAGIC ACTION BUTTON LINK */}
            <div className="pt-1">
              <button
                onClick={handleMagicApproval}
                disabled={hasApproved || activeItem.statusTahapan === 'disahkan_lurah'}
                className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition shadow-md ${
                  hasApproved || activeItem.statusTahapan === 'disahkan_lurah'
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white'
                }`}
              >
                {hasApproved || activeItem.statusTahapan === 'disahkan_lurah' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>✓ SUDAH DISAHKAN DARI HP</span>
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4" />
                    <span>👉 KLIK UNTUK SAHKAN DATA INI</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
              <span className="italic">_Pesan otomatis Server Cloud Edge Kelurahan Kolongan Satu._</span>
              <div className="flex items-center space-x-1">
                <span>09:16</span>
                <CheckCheck className="w-3.5 h-3.5 text-sky-500" />
              </div>
            </div>
          </div>

          {/* Feedback Message */}
          {feedbackMsg && (
            <div className="bg-emerald-100 text-emerald-900 border border-emerald-300 p-3 rounded-2xl text-xs space-y-1 animate-in zoom-in-95">
              <div className="flex items-center space-x-1.5 font-bold">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span>Otomasi Berhasil Dijalankan!</span>
              </div>
              <p className="text-[11px] leading-relaxed">{feedbackMsg}</p>
            </div>
          )}
        </div>

        {/* Mock Phone Bottom Input Bar */}
        <div className="bg-[#f0f2f5] p-2.5 flex items-center space-x-2 border-t border-slate-200">
          <input
            type="text"
            readOnly
            value="Simulasi Webhook Gateway Fonnte / Wablas"
            className="flex-1 bg-white border border-slate-200 rounded-full px-4 py-1.5 text-xs text-slate-500 cursor-not-allowed"
          />
          <div className="w-8 h-8 rounded-full bg-[#00a884] text-white flex items-center justify-center">
            <Send className="w-4 h-4" />
          </div>
        </div>

        {/* Bottom Phone Bar */}
        <div className="h-4 bg-slate-950 flex items-center justify-center">
          <div className="w-28 h-1 bg-slate-600 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
