'use client';
import React, { useState } from 'react';
import { Official, OFFICIALS } from '@/data/officialsData';
import { ShieldCheck, ChevronDown, UserCheck } from 'lucide-react';

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
        className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white hover:bg-[#f2f3ff] border border-[#dae2fd] transition text-left group shadow-xs"
        title="Beralih peran aparatur / warga"
      >
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shadow-xs text-white ${
            currentOfficial.roleCode === 'superadmin' ? 'bg-[#006194]' :
            currentOfficial.roleCode === 'admin_seklur' ? 'bg-[#007bb9]' :
            currentOfficial.roleCode === 'publik' ? 'bg-[#006c49]' :
            'bg-[#4d5d73]'
          }`}>
            {currentOfficial.avatarText}
          </div>
          <div className="truncate">
            <p className="text-xs font-bold text-[#131b2e] truncate group-hover:text-primary transition">
              {currentOfficial.name}
            </p>
            <p className="text-[10px] text-[#535f70] font-medium truncate">
              {currentOfficial.roleTitle}
            </p>
          </div>
        </div>
        <ChevronDown className="w-4 h-4 text-[#707881] group-hover:text-primary transition flex-shrink-0 ml-1" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute bottom-full left-0 mb-2 w-80 bg-white rounded-2xl shadow-xl border border-[#dae2fd] p-2 z-50 max-h-96 overflow-y-auto">
            <div className="px-3 py-2 border-b border-[#e2e7ff] flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#535f70] uppercase tracking-wider">
                Pilih Profil Akses
              </span>
              <span className="text-[10px] bg-[#e2e7ff] text-primary font-bold px-2 py-0.5 rounded-full">
                Multi-Peran
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
                        ? 'bg-[#f2f3ff] border border-[#dae2fd]'
                        : 'hover:bg-[#faf8ff]'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[11px] mt-0.5 flex-shrink-0 text-white ${
                      official.roleCode === 'superadmin' ? 'bg-[#006194]' :
                      official.roleCode === 'admin_seklur' ? 'bg-[#007bb9]' :
                      official.roleCode === 'publik' ? 'bg-[#006c49]' :
                      'bg-[#4d5d73]'
                    }`}>
                      {official.avatarText}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-xs font-bold truncate ${isSelected ? 'text-primary' : 'text-[#131b2e]'}`}>
                          {official.name}
                        </p>
                        {isSelected && (
                          <UserCheck className="w-3.5 h-3.5 text-primary flex-shrink-0 ml-1" />
                        )}
                      </div>
                      <p className="text-[10px] text-[#535f70] font-semibold">{official.roleTitle}</p>
                      {official.nip && (
                        <p className="text-[9px] text-[#707881] font-mono">NIP: {official.nip}</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
