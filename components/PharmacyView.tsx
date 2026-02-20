
import React, { useState } from 'react';
import { Pill, Search, MapPin, Clock, ArrowLeft, ShieldCheck, ChevronRight, Phone, Store } from 'lucide-react';
import { ViewState, Pharmacy } from '../types';

interface PharmacyViewProps {
  onNavigate: (view: ViewState) => void;
  onSelectPharmacy: (pharmacy: Pharmacy) => void;
  registeredPharmacy: Pharmacy | null;
}

const MOCK_PHARMACIES: Pharmacy[] = [
  { id: 'ph1', name: 'Pharmacie de l\'Aéroport', neighborhood: 'Aéroport', phone: '074 12 34 56', isOpen24h: true, isVerified: true, rating: 4.9 },
  { id: 'ph2', name: 'Pharmacie Okala', neighborhood: 'Okala', phone: '066 98 76 54', isOpen24h: false, isVerified: true, rating: 4.7 },
  { id: 'ph3', name: 'Pharmacie de Louis', neighborhood: 'Louis', phone: '077 11 22 33', isOpen24h: true, isVerified: true, rating: 4.8 },
];

const PharmacyView: React.FC<PharmacyViewProps> = ({ onNavigate, onSelectPharmacy, registeredPharmacy }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = MOCK_PHARMACIES.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.neighborhood.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-8 animate-in slide-in-from-right-4 duration-500 pb-32">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('home')} className="p-2 bg-white rounded-full shadow-sm border border-slate-100 active:scale-95 transition-all">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Pharmacies</h2>
        </div>
        {!registeredPharmacy && (
          <button 
            onClick={() => onNavigate('pharmacy-registration')}
            className="p-3 bg-pink-50 text-pink-600 rounded-2xl flex items-center gap-2 font-black text-[9px] uppercase border border-pink-100"
          >
            <Store className="w-4 h-4" /> Enrôler une Pharmacie
          </button>
        )}
      </div>

      <div className="bg-pink-600 p-6 rounded-[2.5rem] text-white shadow-xl space-y-3 relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-xl font-bold">Pharmacies de garde</h3>
          <p className="text-xs opacity-90 leading-relaxed mt-1">Trouvez vos médicaments et faites-vous livrer en 20 minutes.</p>
        </div>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-500" />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Chercher une pharmacie ou un quartier..."
          className="w-full pl-11 pr-4 py-4 bg-white border border-slate-100 rounded-2xl font-bold text-sm outline-none shadow-sm focus:border-pink-500"
        />
      </div>

      <div className="space-y-4">
        {filtered.map(pharmacy => (
          <button 
            key={pharmacy.id}
            onClick={() => onSelectPharmacy(pharmacy)}
            className="w-full bg-white border border-slate-100 p-5 rounded-[2.5rem] shadow-sm flex flex-col gap-4 text-left group hover:border-pink-500/20 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center text-3xl shadow-inner group-hover:scale-105 transition-transform">
                <Pill className="w-7 h-7 text-pink-500" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                   <h4 className="font-black text-slate-800 text-sm leading-tight">{pharmacy.name}</h4>
                   {pharmacy.isOpen24h && (
                     <span className="text-[8px] font-black bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded-md uppercase border border-emerald-100">De Garde</span>
                   )}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 mt-1">
                   <MapPin className="w-3 h-3 text-pink-400" /> {pharmacy.neighborhood}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
               <div className="flex items-center gap-2">
                 <ShieldCheck className="w-4 h-4 text-emerald-500" />
                 <span className="text-[9px] font-black text-slate-400 uppercase">Partenaire Certifié</span>
               </div>
               <ChevronRight className="w-5 h-5 text-pink-500" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PharmacyView;
