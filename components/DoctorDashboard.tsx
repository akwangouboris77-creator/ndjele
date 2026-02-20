
import React, { useState } from 'react';
import { Wallet, Stethoscope, Star, Clock, ShieldCheck, ChevronRight, History, Zap, Settings, Bell, Activity, UserCheck, Calendar } from 'lucide-react';
import { ViewState } from '../types';

interface DoctorDashboardProps {
  onNavigate: (view: ViewState) => void;
  doctorName: string;
}

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ onNavigate, doctorName }) => {
  const [balance] = useState(124000);

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500 pb-24 h-full overflow-y-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-800 tracking-tighter">Espace Médical</h2>
        <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
           <Activity className="w-3 h-3 fill-current" />
           <span className="text-[10px] font-black uppercase">En Cabinet</span>
        </div>
      </div>

      <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden text-center">
        <div className="relative z-10 flex flex-col items-center">
          <Wallet className="w-10 h-10 text-emerald-500 mb-2" />
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Honoraires Ndjele Santé</p>
          <div className="flex items-end gap-2 mt-2">
            <span className="text-4xl font-black text-emerald-500">{balance.toLocaleString()}</span>
            <span className="text-xl font-medium text-slate-500 mb-1.5">F</span>
          </div>
          <button onClick={() => onNavigate('wallet')} className="w-full mt-6 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest active:scale-95 shadow-xl shadow-emerald-500/20">
            Gérer mes honoraires
          </button>
        </div>
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm text-center space-y-1">
          <Calendar className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
          <p className="text-xl font-black text-slate-800">8</p>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">RDV Aujourd'hui</p>
        </div>
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm text-center space-y-1">
          <Star className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
          <p className="text-xl font-black text-slate-800">5.0</p>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Avis Patients</p>
        </div>
      </div>

      <section className="space-y-4">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2 px-2">
          <Clock className="w-4 h-4 text-emerald-600" />
          Prochains Rendez-vous
        </h3>
        <div className="space-y-3">
          {[
            { id: 1, patient: 'Marc Mba', time: '14:30', type: 'Consultation' },
            { id: 2, patient: 'Sarah B.', time: '15:15', type: 'Suivi' },
          ].map(rdv => (
            <div key={rdv.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-800 text-sm">{rdv.patient}</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase">{rdv.type} • {rdv.time}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300" />
            </div>
          ))}
        </div>
      </section>

      <div className="bg-blue-50 p-6 rounded-[2.5rem] border border-blue-100 flex items-start gap-3">
         <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
         <p className="text-[10px] text-blue-800 font-bold leading-relaxed">
           L'orientation par IA Ndjele vous envoie des patients ciblés selon votre spécialité. Assurez-vous de mettre à jour vos disponibilités.
         </p>
      </div>
    </div>
  );
};

export default DoctorDashboard;
