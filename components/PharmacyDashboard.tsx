
import React, { useState } from 'react';
import { Wallet, Pill, Star, Clock, ShieldCheck, ChevronRight, History, Bell, Package, CheckCircle2, TrendingUp } from 'lucide-react';
import { ViewState, Pharmacy } from '../types';

interface PharmacyDashboardProps {
  onNavigate: (view: ViewState) => void;
  pharmacy: Pharmacy;
}

const PharmacyDashboard: React.FC<PharmacyDashboardProps> = ({ onNavigate, pharmacy }) => {
  const [balance] = useState(85000);

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500 pb-24 h-full overflow-y-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-800 tracking-tighter">Espace Officine</h2>
        <div className="flex items-center gap-1.5 text-pink-600 bg-pink-50 px-3 py-1.5 rounded-full border border-pink-100">
           <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
           <span className="text-[10px] font-black uppercase">Ouvert</span>
        </div>
      </div>

      <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden text-center">
        <div className="relative z-10 flex flex-col items-center">
          <Wallet className="w-10 h-10 text-pink-400 mb-2" />
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Chiffre d'Affaires Santé</p>
          <div className="flex items-end gap-2 mt-2">
            <span className="text-4xl font-black text-pink-400">{balance.toLocaleString()}</span>
            <span className="text-xl font-medium text-slate-500 mb-1.5">F</span>
          </div>
          <button onClick={() => onNavigate('wallet')} className="w-full mt-6 py-4 bg-pink-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest active:scale-95 shadow-xl shadow-pink-500/20">
            Gérer mon portefeuille
          </button>
        </div>
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm text-center space-y-1">
          <Package className="w-6 h-6 text-pink-500 mx-auto mb-1" />
          <p className="text-xl font-black text-slate-800">12</p>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Ventes Ordonnances</p>
        </div>
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm text-center space-y-1">
          <Star className="w-6 h-6 text-pink-500 mx-auto mb-1" />
          <p className="text-xl font-black text-slate-800">4.9</p>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Note Clientèle</p>
        </div>
      </div>

      <section className="space-y-4">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2 px-2">
          <Clock className="w-4 h-4 text-pink-600" />
          Commandes en attente
        </h3>
        <div className="space-y-3">
          {[
            { id: 1, client: 'Mr. Bignoumba', items: 'Amoxicilline + Vitamine C', status: 'Vérification Ordonnance', time: 'Il y a 5 min' },
            { id: 2, client: 'Mme Obiang', items: 'Paracétamol 1g', status: 'En attente livreur', time: 'Il y a 15 min' },
          ].map(order => (
            <div key={order.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                 <div>
                    <h4 className="font-bold text-slate-800 text-sm">{order.client}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{order.items}</p>
                 </div>
                 <span className="text-[8px] font-black bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full uppercase border border-amber-100">{order.time}</span>
              </div>
              <button className="w-full py-2.5 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase shadow-lg active:scale-95 transition-all">
                Traiter la commande
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-pink-50 p-6 rounded-[2.5rem] border border-pink-100 flex items-start gap-3">
         <ShieldCheck className="w-5 h-5 text-pink-600 shrink-0" />
         <p className="text-[10px] text-pink-800 font-bold leading-relaxed">
           Votre officine <b>{pharmacy.name}</b> est certifiée Ndjele Care. Toutes les ventes de médicaments sont tracées pour la sécurité des patients.
         </p>
      </div>
    </div>
  );
};

export default PharmacyDashboard;
