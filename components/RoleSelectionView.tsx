
import React from 'react';
import { User, Car, Hammer, Store, Truck, Stethoscope, ArrowRight, Pill } from 'lucide-react';
import { UserRole, ViewState } from '../types';

interface RoleSelectionViewProps {
  onSelect: (role: UserRole) => void;
}

const ROLE_OPTIONS = [
  { id: 'CLIENT', label: 'Usager / Client', icon: User, color: 'bg-blue-500', desc: 'Commander taxi, livraison, artisans...' },
  { id: 'DRIVER', label: 'Chauffeur', icon: Car, color: 'bg-amber-500', desc: 'Transporter des passagers à Libreville.' },
  { id: 'ARTISAN', label: 'Artisan Pro', icon: Hammer, color: 'bg-indigo-500', desc: 'Proposer vos services de maintenance.' },
  { id: 'MERCHANT', label: 'Commerçant', icon: Store, color: 'bg-violet-500', desc: 'Vendre vos articles sur le Market.' },
  { id: 'PHARMACY', label: 'Pharmacie', icon: Pill, color: 'bg-pink-500', desc: 'Vendre des médicaments et gérer les ordonnances.' },
  { id: 'DELIVERY', label: 'Livreur', icon: Truck, color: 'bg-pink-500', desc: 'Effectuer des livraisons rapides.' },
  { id: 'DOCTOR', label: 'Médecin', icon: Stethoscope, color: 'bg-emerald-500', desc: 'Consultations et avis médicaux.' },
];

const RoleSelectionView: React.FC<RoleSelectionViewProps> = ({ onSelect }) => {
  return (
    <div className="p-8 h-full flex flex-col space-y-8 animate-in fade-in duration-500 bg-slate-50">
      <div className="text-center space-y-2 pt-4">
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Profil Ndjele</h2>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Comment souhaitez-vous utiliser l'app ?</p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-1 hide-scrollbar">
        {ROLE_OPTIONS.map((role) => (
          <button
            key={role.id}
            onClick={() => onSelect(role.id as UserRole)}
            className="w-full flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:border-slate-900/10 transition-all text-left group"
          >
            <div className={`w-12 h-12 ${role.color} rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0 group-hover:scale-105 transition-transform`}>
              <role.icon className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-slate-900 text-[11px] uppercase tracking-widest">{role.label}</p>
              <p className="text-[10px] text-slate-400 font-bold leading-tight mt-1">{role.desc}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-200 group-hover:text-slate-900 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default RoleSelectionView;
