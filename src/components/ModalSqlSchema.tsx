'use client';
import React, { useState } from 'react';
import { SUPABASE_SQL_DDL } from '@/data/sqlSchemaData';
import { Database, Copy, Check, X, ShieldAlert, Code2, Server } from 'lucide-react';

interface ModalSqlSchemaProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalSqlSchema({ isOpen, onClose }: ModalSqlSchemaProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_DDL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 text-slate-100 w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-700">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Skema Database PostgreSQL & RLS (Supabase)</h2>
              <p className="text-xs text-slate-400">
                Sesuai Bagian 6 & 8 Dokumen Arsitektur Kelurahan Kolongan Satu
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl transition flex items-center space-x-1.5 shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin ke Clipboard' : 'Salin SQL Lengkap'}</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Feature summary */}
        <div className="bg-slate-800/60 px-5 py-3 border-b border-slate-800 flex flex-wrap items-center gap-4 text-xs text-slate-300">
          <div className="flex items-center space-x-1.5">
            <Server className="w-3.5 h-3.5 text-emerald-400" />
            <span>PostgreSQL 15+ Serverless</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Row Level Security (RLS) Active</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Code2 className="w-3.5 h-3.5 text-sky-400" />
            <span>RBAC Sesuai SK Pejabat Resmi</span>
          </div>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-y-auto p-4 font-mono text-xs text-emerald-400 bg-slate-950 leading-relaxed selection:bg-sky-500 selection:text-white">
          <pre>{SUPABASE_SQL_DDL}</pre>
        </div>
      </div>
    </div>
  );
}
