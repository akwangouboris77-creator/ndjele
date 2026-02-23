
import React, { useState } from 'react';
import { Wallet, Scale, Star, Clock, ShieldCheck, ChevronRight, History, MessageSquare, Settings, Bell, TrendingUp, UserCheck, ShieldAlert, FileText } from 'lucide-react';
import { ViewState, Lawyer } from '../types';

interface LawyerDashboardProps {
  onNavigate: (view: ViewState) => void;
  lawyer: Lawyer;
}

const LawyerDashboard: React.FC<LawyerDashboardProps> = ({ onNavigate, lawyer }) => {
  const [balance] = useState(125000);
  const [pendingBalance] = useState(45000);

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500 pb-24 h-full overflow-y-auto bg-slate-50/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tighter">Cabinet Pro</h2>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{lawyer.specialty}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
           <UserCheck className="w-3 h-3 fill-current" />
           <span className="text-[10px] font-black uppercase">En ligne</span>
        </div>
      </div>

      <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center text-center">
          <Wallet className="w-10 h-10 text-slate-400 mb-2" />
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Honoraires Disponibles</p>
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
                <p className="text-[8px] font-black text-slate-400 uppercase">Dossiers Actifs</p>
                <p className="text-lg font-black text-emerald-400">4</p>
             </div>
          </div>

          <button onClick={() => onNavigate('wallet')} className="w-full mt-8 py-4 bg-white text-slate-900 rounded-2xl font-black uppercase text-xs tracking-widest active:scale-95 shadow-xl">
            Virer vers mon compte
          </button>
        </div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-slate-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-2">
           <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
           </div>
           <p className="text-[10px] font-black text-slate-400 uppercase">Consultations</p>
           <p className="text-xl font-black text-slate-900">12</p>
        </div>
        <div className="bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-2">
           <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5" />
           </div>
           <p className="text-[10px] font-black text-slate-400 uppercase">Actes rédigés</p>
           <p className="text-xl font-black text-slate-900">8</p>
        </div>
      </div>

      <section className="space-y-4">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2 px-2">
          <History className="w-4 h-4 text-slate-900" />
          Consultations Récentes
        </h3>
        <div className="space-y-3">
          {[
            { id: 1, client: 'Mr. Jean Mba', type: 'Droit Travail', price: 25000, status: 'PENDING', time: 'Il y a 2h' },
            { id: 2, client: 'Mme. Sylvie Ndong', type: 'Divorce', price: 50000, status: 'PAID', time: 'Hier' },
            { id: 3, client: 'Cabinet BGFIBank', type: 'Conseil', price: 150000, status: 'PAID', time: '2 jours' },
          ].map(item => (
            <div key={item.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{item.client}</h4>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">{item.type} • {item.time}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-black text-sm ${item.status === 'PENDING' ? 'text-amber-500' : 'text-slate-900'}`}>
                  {item.price.toLocaleString()} F
                </p>
                {item.status === 'PENDING' && <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse ml-auto mt-1"></div>}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-slate-100 p-6 rounded-[2.5rem] border border-slate-200 flex items-start gap-3">
         <ShieldCheck className="w-5 h-5 text-slate-900 shrink-0" />
         <p className="text-[10px] text-slate-600 font-bold leading-relaxed">
           Votre cabinet est certifié Justice NS. Les honoraires sont versés sur votre portefeuille après validation de la consultation par le client.
         </p>
      </div>
    </div>
  );
};

export default LawyerDashboard;
