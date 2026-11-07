'use client';

import React from 'react';
import { X, Printer, ShieldCheck, Award, Feather, CheckCircle2 } from 'lucide-react';
import { Rooster } from '@/types/rooster';
import { FARM_INFO } from '@/lib/data';

interface BreedCertificateModalProps {
  rooster: Rooster | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BreedCertificateModal: React.FC<BreedCertificateModalProps> = ({
  rooster,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !rooster) return null;

  const handlePrint = () => {
    window.print();
  };

  const certNumber = `JP-CERT-${rooster.tagId.replace(/[^a-zA-Z0-9]/g, '')}-${new Date().getFullYear()}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      {/* Container */}
      <div className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-amber-300 my-auto">
        
        {/* Top Control Bar (Non-Printable) */}
        <div className="bg-stone-950 text-white px-6 py-3.5 flex items-center justify-between print:hidden border-b border-stone-800">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="text-xs sm:text-sm font-bold tracking-wide">
              Official Breed Purity & Vaccination Certificate
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold px-3.5 py-1.5 rounded-lg transition shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Sheet */}
        <div className="p-6 sm:p-10 bg-[#fffdf9] text-stone-900 border-8 border-double border-amber-600/30 m-3 sm:m-4 rounded-2xl relative overflow-hidden">
          
          {/* Watermark in background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
            <Feather className="w-96 h-96 text-stone-950 transform -rotate-45" />
          </div>

          {/* Certificate Header */}
          <div className="text-center space-y-2 border-b-2 border-amber-600/40 pb-5">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-white font-black text-sm">
                JP
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-widest text-stone-950 uppercase font-serif">
                JP FARMS HERITAGE REGISTRY
              </h1>
            </div>

            <p className="text-[11px] font-bold tracking-widest uppercase text-amber-800">
              Avian Genetics & Indigenous Breed Conservation Council
            </p>

            <div className="inline-block bg-amber-100/80 border border-amber-300 px-4 py-1 rounded-full text-xs font-bold text-amber-900 tracking-wider uppercase mt-1">
              Certificate of Pedigree Purity & Health Clearance
            </div>

            <p className="text-[10px] font-mono text-stone-500 mt-1">
              Certificate No: <strong>{certNumber}</strong> • Issue Date: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

          {/* Bird Identification Grid */}
          <div className="my-6 space-y-4">
            
            <div className="bg-amber-50/50 border border-amber-200/80 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-500">Registered Rooster</span>
                <h3 className="text-xl font-bold text-stone-950">{rooster.name}</h3>
                <p className="text-xs text-amber-800 font-semibold">{rooster.breed}</p>
              </div>

              <div className="text-right sm:border-l sm:border-amber-200 sm:pl-6">
                <span className="text-[10px] uppercase font-bold text-stone-500">Physical Leg Tag ID</span>
                <p className="text-xl font-mono font-black text-amber-700">{rooster.tagId}</p>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                  AUTHENTICATED PUREBLOOD
                </span>
              </div>
            </div>

            {/* Specifications Table */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs text-center">
              <div className="bg-stone-50 border border-stone-200 p-2.5 rounded-lg">
                <p className="text-[10px] uppercase text-stone-400 font-bold">Weight</p>
                <p className="font-extrabold text-stone-900">{rooster.weight}</p>
              </div>
              <div className="bg-stone-50 border border-stone-200 p-2.5 rounded-lg">
                <p className="text-[10px] uppercase text-stone-400 font-bold">Age</p>
                <p className="font-extrabold text-stone-900">{rooster.age}</p>
              </div>
              <div className="bg-stone-50 border border-stone-200 p-2.5 rounded-lg">
                <p className="text-[10px] uppercase text-stone-400 font-bold">Height</p>
                <p className="font-extrabold text-stone-900">{rooster.height}</p>
              </div>
              <div className="bg-stone-50 border border-stone-200 p-2.5 rounded-lg">
                <p className="text-[10px] uppercase text-stone-400 font-bold">Comb Type</p>
                <p className="font-extrabold text-stone-900">{rooster.combType}</p>
              </div>
            </div>

            {/* Lineage declaration */}
            <div className="bg-stone-50 border border-stone-200 p-3.5 rounded-xl text-xs space-y-1">
              <p className="text-[10px] uppercase font-bold text-stone-500">Lineage & Genetic Conformation:</p>
              <p className="text-stone-800 leading-relaxed font-medium">
                {rooster.lineage}
              </p>
            </div>

            {/* Vaccination Log */}
            <div className="bg-emerald-50/60 border border-emerald-200 p-3.5 rounded-xl text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-950 flex items-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 mr-1.5" />
                  Verified Avian Immunization Card
                </span>
                <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-bold">
                  {rooster.vaccinationStatus}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[11px] text-emerald-900">
                {rooster.vaccines.map((v, i) => (
                  <div key={i} className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>{v}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Footer & Signature Blocks */}
          <div className="pt-6 border-t-2 border-amber-600/30 flex items-end justify-between text-xs">
            <div className="space-y-1">
              <div className="w-16 h-16 rounded-full border-2 border-amber-600/40 flex items-center justify-center text-center p-1 text-[8px] font-bold text-amber-900 uppercase tracking-tighter shadow-inner bg-amber-50">
                JP FARMS<br/>OFFICIAL<br/>SEAL
              </div>
              <p className="text-[10px] text-stone-400">Authentic Registered Document</p>
            </div>

            <div className="text-center space-y-1 border-t border-stone-400 pt-2 px-4">
              <p className="font-serif italic font-bold text-stone-900 text-sm">J. Prabhakar Reddy</p>
              <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Chief Avian Breeder, JP Farms</p>
            </div>

            <div className="text-center space-y-1 border-t border-stone-400 pt-2 px-4">
              <p className="font-serif italic font-bold text-stone-900 text-sm">Dr. V. N. Sharma, B.V.Sc</p>
              <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Veterinary Health Officer</p>
            </div>
          </div>

          {/* Footnote */}
          <p className="mt-4 text-center text-[9px] text-stone-400 font-mono">
            {FARM_INFO.name} • {FARM_INFO.address} • Ph: {FARM_INFO.phone}
          </p>

        </div>

      </div>

    </div>
  );
};

