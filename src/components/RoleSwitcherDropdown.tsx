'use client';
import React, { useState } from 'react';
import { Official, OFFICIALS } from '@/data/officialsData';
import { ShieldCheck, ChevronDown, UserCheck, Sparkles, Building, Lock } from 'lucide-react';

interface RoleSwitcherProps {
  currentOfficial: Official;
  onSelectOfficial: (official: Official) => void;
}

export default function RoleSwitcherDropdown({ currentOfficial, onSelectOfficial }: RoleSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition text-left group"
        title="Klik untuk beralih peran aparatur / warga"
      >
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shadow-sm ${
            currentOfficial.roleCode === 'superadmin' ? 'bg-amber-600 text-white' :
            currentOfficial.roleCode === 'admin_seklur' ? 'bg-indigo-600 text-white' :
            currentOfficial.roleCode === 'publik' ? 'bg-emerald-600 text-white' :
            'bg-sky-700 text-white'
          }`}>
            {currentOfficial.avatarText}
          </div>
          <div className="truncate">
            <p className="text-xs font-bold text-slate-800 truncate group-hover:text-sky-700 transition">
              {currentOfficial.name}
            </p>
            <p className="text-[10px] text-slate-500 font-medium truncate">
              {currentOfficial.roleTitle}
            </p>
          </div>
        </div>
        <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition flex-shrink-0 ml-1" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute bottom-full left-0 mb-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 max-h-96 overflow-y-auto">
            <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Pilih Profil Akses (RBAC)
              </span>
              <span className="text-[10px] bg-sky-100 text-sky-800 font-semibold px-2 py-0.5 rounded-full">
                Multi-Role
              </span>
            </div>

            <div className="py-1 space-y-1">
              {OFFICIALS.map((official) => {
                const isSelected = official.id === currentOfficial.id;
                return (
                  <button
                    key={official.id}
                    onClick={() => {
                      onSelectOfficial(official);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-start space-x-2.5 p-2 rounded-xl text-left transition ${
                      isSelected
                        ? 'bg-sky-50 border border-sky-200'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[11px] mt-0.5 flex-shrink-0 ${
                      official.roleCode === 'superadmin' ? 'bg-amber-600 text-white' :
                      official.roleCode === 'admin_seklur' ? 'bg-indigo-600 text-white' :
                      official.roleCode === 'publik' ? 'bg-emerald-600 text-white' :
                      'bg-slate-700 text-white'
                    }`}>
                      {official.avatarText}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-xs font-bold truncate ${isSelected ? 'text-sky-900' : 'text-slate-800'}`}>
                          {official.name}
                        </p>
                        {isSelected && (
                          <UserCheck className="w-3.5 h-3.5 text-sky-600 flex-shrink-0 ml-1" />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 font-semibold">{official.roleTitle}</p>
                      {official.nip && (
                        <p className="text-[9px] text-slate-400 font-mono">NIP: {official.nip}</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-2 border-t border-slate-100 bg-slate-50/70 rounded-xl mt-1 text-[11px] text-slate-500 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Sesuai Struktur Organisasi SK Kelurahan Kolongan Satu</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
