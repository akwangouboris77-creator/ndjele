
import React, { useState } from 'react';
import { Wallet, Hammer, Star, Clock, ShieldCheck, ChevronRight, History, Zap, Settings, Bell, TrendingUp, UserCheck, ShieldAlert } from 'lucide-react';
import { ViewState, Artisan } from '../types';

interface ArtisanDashboardProps {
  onNavigate: (view: ViewState) => void;
  artisan: Artisan;
}

const ArtisanDashboard: React.FC<ArtisanDashboardProps> = ({ onNavigate, artisan }) => {
  const [balance] = useState(65200);
  const [pendingBalance] = useState(25000); // Simulation de fonds en observation

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500 pb-24 h-full overflow-y-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-800 tracking-tighter">Artisan Pro</h2>
        <div className="flex items-center gap-1.5 text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
           <UserCheck className="w-3 h-3 fill-current" />
           <span className="text-[10px] font-black uppercase">Disponible</span>
        </div>
      </div>

      <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center text-center">
          <Wallet className="w-10 h-10 text-indigo-400 mb-2" />
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Solde Disponible</p>
          <div className="flex items-end gap-2 mt-2">
            <span className="text-4xl font-black text-white">{balance.toLocaleString()}</span>
            <span className="text-xl font-medium text-slate-500 mb-1.5">F</span>
          </div>
          
          <div className="mt-6 w-full pt-6 border-t border-white/10 flex justify-around">
             <div className="text-center">
                <p className="text-[8px] font-black text-slate-400 uppercase">En Séquestre</p>
                <p className="text-lg font-black text-amber-400">{pendingBalance.toLocaleString()} F</p>
             </div>
             <div className="w-px h-8 bg-white/10"></div>
             <div className="text-center">
                <p className="text-[8px] font-black text-slate-400 uppercase">Projets en cours</p>
                <p className="text-lg font-black text-emerald-400">2</p>
             </div>
          </div>

          <button onClick={() => onNavigate('wallet')} className="w-full mt-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest active:scale-95 shadow-xl shadow-indigo-500/20">
            Retirer mes gains
          </button>
        </div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-start gap-3">
         <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
         <div>
            <p className="text-[11px] text-amber-900 font-bold leading-tight">Sécurité Ndjele</p>
            <p className="text-[10px] text-amber-700 font-medium mt-1 leading-relaxed">
              L'argent des prestations techniques reste en observation pendant 24h pour garantir l'efficacité de votre travail au client.
            </p>
         </div>
      </div>

      <section className="space-y-4">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2 px-2">
          <History className="w-4 h-4 text-indigo-600" />
          Dernières Interventions
        </h3>
        <div className="space-y-3">
          {[
            { id: 1, client: 'Mme Ntoutoume', task: 'Réparation Clim', price: 15000, date: 'En observation (18h restantes)', status: 'PENDING' },
            { id: 2, client: 'Mr. Obiang', task: 'Entretien Annuel', price: 10000, date: 'En observation (4h restantes)', status: 'PENDING' },
            { id: 3, client: 'Tonton Paul', task: 'Plomberie WC', price: 8000, date: 'Hier', status: 'PAID' },
          ].map(job => (
            <div key={job.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group">
              <div>
                <h4 className="font-bold text-slate-800 text-sm">{job.client}</h4>
                <p className={`text-[9px] font-bold uppercase ${job.status === 'PENDING' ? 'text-amber-500' : 'text-slate-400'}`}>
                  {job.task} • {job.date}
                </p>
              </div>
              <div className="text-right">
                <p className={`font-black text-sm ${job.status === 'PENDING' ? 'text-slate-400' : 'text-indigo-600'}`}>
                  {job.price.toLocaleString()} F
                </p>
                {job.status === 'PENDING' && <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse ml-auto mt-1"></div>}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-indigo-50 p-6 rounded-[2.5rem] border border-indigo-100 flex items-start gap-3">
         <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
         <p className="text-[10px] text-indigo-800 font-bold leading-relaxed">
           Votre profil est visible par tous les clients Ndjele. Gardez une bonne note pour réduire votre temps d'observation à 12h.
         </p>
      </div>
    </div>
  );
};

export default ArtisanDashboard;
