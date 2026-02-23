
import React, { useState } from 'react';
import { Wallet, Gavel, Star, Clock, ShieldCheck, ChevronRight, History, FileText, Settings, Bell, TrendingUp, UserCheck, ShieldAlert, MapPin } from 'lucide-react';
import { ViewState, Bailiff } from '../types';

interface BailiffDashboardProps {
  onNavigate: (view: ViewState) => void;
  bailiff: Bailiff;
}

const BailiffDashboard: React.FC<BailiffDashboardProps> = ({ onNavigate, bailiff }) => {
  const [balance] = useState(210000);
  const [pendingBalance] = useState(85000);

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500 pb-24 h-full overflow-y-auto bg-slate-50/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-slate-700 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <Gavel className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tighter">Étude Pro</h2>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{bailiff.office}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
           <UserCheck className="w-3 h-3 fill-current" />
           <span className="text-[10px] font-black uppercase">Disponible</span>
        </div>
      </div>

      <div className="bg-slate-700 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center text-center">
          <Wallet className="w-10 h-10 text-slate-300 mb-2" />
          <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest">Fonds de l'Étude</p>
          <div className="flex items-end gap-2 mt-2">
            <span className="text-4xl font-black text-white">{balance.toLocaleString()}</span>
            <span className="text-xl font-medium text-slate-400 mb-1.5">F</span>
          </div>
          
          <div className="mt-6 w-full pt-6 border-t border-white/10 flex justify-around">
             <div className="text-center">
                <p className="text-[8px] font-black text-slate-300 uppercase">En Transit</p>
                <p className="text-lg font-black text-amber-400">{pendingBalance.toLocaleString()} F</p>
             </div>
             <div className="w-px h-8 bg-white/10"></div>
             <div className="text-center">
                <p className="text-[8px] font-black text-slate-300 uppercase">Actes en cours</p>
                <p className="text-lg font-black text-emerald-400">7</p>
             </div>
          </div>

          <button onClick={() => onNavigate('wallet')} className="w-full mt-8 py-4 bg-white text-slate-700 rounded-2xl font-black uppercase text-xs tracking-widest active:scale-95 shadow-xl">
            Gérer la trésorerie
          </button>
        </div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-slate-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
         <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 text-slate-700 rounded-xl"><MapPin className="w-5 h-5" /></div>
            <h3 className="font-black text-xs uppercase tracking-widest text-slate-800">Zone d'intervention</h3>
         </div>
         <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
           Votre étude couvre actuellement la zone de <span className="text-slate-900">{bailiff.neighborhood}</span> et ses environs.
         </p>
      </div>

      <section className="space-y-4">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2 px-2">
          <History className="w-4 h-4 text-slate-700" />
          Dernières Significations
        </h3>
        <div className="space-y-3">
          {[
            { id: 1, client: 'Banque AFG', task: 'Signification Acte', price: 35000, date: 'Aujourd\'hui', status: 'PENDING' },
            { id: 2, client: 'Me. Ndong', task: 'Constat Chantier', price: 75000, date: 'Hier', status: 'PAID' },
            { id: 3, client: 'Mr. Pierre', task: 'Commandement Payer', price: 45000, date: '2 jours', status: 'PAID' },
          ].map(job => (
            <div key={job.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{job.client}</h4>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">{job.task} • {job.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-black text-sm ${job.status === 'PENDING' ? 'text-amber-500' : 'text-slate-700'}`}>
                  {job.price.toLocaleString()} F
                </p>
                {job.status === 'PENDING' && <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse ml-auto mt-1"></div>}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-slate-100 p-6 rounded-[2.5rem] border border-slate-200 flex items-start gap-3">
         <ShieldCheck className="w-5 h-5 text-slate-700 shrink-0" />
         <p className="text-[10px] text-slate-600 font-bold leading-relaxed">
           En tant qu'officier ministériel certifié Ndjele, vos actes ont une valeur probante renforcée par notre système de traçabilité.
         </p>
      </div>
    </div>
  );
};

export default BailiffDashboard;
