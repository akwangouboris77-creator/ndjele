
import React from 'react';
import { 
  TrendingUp, TrendingDown, Users, Wallet, CreditCard, 
  ArrowLeft, ArrowUpRight, BarChart3, PieChart, Info,
  ShieldCheck, Smartphone, Target, Zap
} from 'lucide-react';
import { ViewState } from '../types';

interface BusinessDashboardProps {
  onNavigate: (view: ViewState) => void;
}

const BusinessDashboard: React.FC<BusinessDashboardProps> = ({ onNavigate }) => {
  // --- ESTIMATIONS NDJELE SOLUTION (1 AN) ---
  const usersProjection = 3000;
  const subPrice = 5000;
  const commissionRate = 0.09;
  
  // Revenus
  const annualSubRevenue = usersProjection * subPrice * 12;
  const avgMonthlyTransacVol = 75000000; // 75M FCFA de volume mensuel
  const annualCommissionRevenue = (avgMonthlyTransacVol * commissionRate) * 12;
  const totalAnnualGrossRevenue = annualSubRevenue + annualCommissionRevenue;

  // Dépenses
  const cloudAndApiCosts = 18000000; // 1.5M/mois (Gemini Pro, Hosting, Maps)
  const marketingCosts = 24000000; // 2M/mois (Social Media, Street Marketing Libreville)
  const staffCosts = 48000000; // 4M/mois (Support client 24/7, Tech local)
  const mobileMoneyFees = (avgMonthlyTransacVol * 0.015) * 12; // 1.5% frais opé
  const totalAnnualExpenses = cloudAndApiCosts + marketingCosts + staffCosts + mobileMoneyFees;

  const netAnnualProfit = totalAnnualGrossRevenue - totalAnnualExpenses;

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500 pb-32">
      <div className="flex items-center gap-4">
        <button onClick={() => onNavigate('home')} className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 active:scale-95 transition-all">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none">Business Plan</h2>
          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-1">Estimations Annuelles (FCFA)</p>
        </div>
      </div>

      {/* Vue d'ensemble du profit */}
      <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden text-center">
        <div className="relative z-10 flex flex-col items-center">
          <Target className="w-10 h-10 text-emerald-400 mb-2" />
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Bénéfice Net Projeté (An 1)</p>
          <div className="flex items-end gap-2 mt-2">
            <span className="text-4xl font-black text-emerald-400">{netAnnualProfit.toLocaleString()}</span>
            <span className="text-xl font-medium text-slate-500 mb-1.5">F</span>
          </div>
          <div className="mt-4 flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
             <TrendingUp className="w-4 h-4 text-emerald-400" />
             <span className="text-[10px] font-black uppercase">Marge de {( (netAnnualProfit/totalAnnualGrossRevenue) * 100 ).toFixed(1)}%</span>
          </div>
        </div>
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Grid Revenus vs Dépenses */}
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
           <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><TrendingUp className="w-5 h-5" /></div>
                 <h3 className="font-black text-xs uppercase tracking-widest text-slate-800">Gains Estimés</h3>
              </div>
              <span className="text-sm font-black text-emerald-600">{totalAnnualGrossRevenue.toLocaleString()} F</span>
           </div>
           
           <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-xs">
                 <span className="text-slate-500 font-bold">Abonnements (3000 users)</span>
                 <span className="font-black text-slate-800">{annualSubRevenue.toLocaleString()} F</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                 <div className="bg-emerald-500 h-full w-[70%]"></div>
              </div>
              
              <div className="flex justify-between items-center text-xs pt-2">
                 <span className="text-slate-500 font-bold">Commissions (9% transac)</span>
                 <span className="font-black text-slate-800">{annualCommissionRevenue.toLocaleString()} F</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                 <div className="bg-indigo-500 h-full w-[30%]"></div>
              </div>
           </div>
        </div>

        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
           <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-red-50 text-red-600 rounded-xl"><TrendingDown className="w-5 h-5" /></div>
                 <h3 className="font-black text-xs uppercase tracking-widest text-slate-800">Dépenses Estimées</h3>
              </div>
              <span className="text-sm font-black text-red-600">{totalAnnualExpenses.toLocaleString()} F</span>
           </div>
           
           <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-50 p-3 rounded-2xl">
                 <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Infrastructure IA</p>
                 <p className="text-[10px] font-black text-slate-800">18M F</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl">
                 <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Marketing / Pub</p>
                 <p className="text-[10px] font-black text-slate-800">24M F</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl">
                 <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Opérations / Staff</p>
                 <p className="text-[10px] font-black text-slate-800">48M F</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl">
                 <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Frais Opérateurs</p>
                 <p className="text-[10px] font-black text-slate-800">13.5M F</p>
              </div>
           </div>
        </div>
      </div>

      {/* Analyse du Business Model */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
          <Info className="w-3 h-3" /> Analyse Stratégique
        </h3>
        <div className="space-y-3">
           {[
             { title: "Scalabilité IA", desc: "L'utilisation de Gemini réduit les coûts de support client de 60% via l'automatisation des diagnostics.", icon: Zap, color: "text-amber-500 bg-amber-50" },
             { title: "Séquestre Financier", desc: "La commission de 9% inclut l'assurance Ndjele qui sécurise les transactions entre particuliers.", icon: ShieldCheck, color: "text-emerald-500 bg-emerald-50" },
             { title: "Objectif Expansion", desc: "Modèle rentable à partir de 800 utilisateurs PREMIUM actifs par mois.", icon: Target, color: "text-indigo-500 bg-indigo-50" }
           ].map((item, i) => (
             <div key={i} className="flex gap-4 p-5 bg-white rounded-3xl border border-slate-50 shadow-sm">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                   <item.icon className="w-5 h-5" />
                </div>
                <div>
                   <h4 className="text-xs font-black text-slate-800 uppercase mb-1">{item.title}</h4>
                   <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                </div>
             </div>
           ))}
        </div>
      </section>

      <div className="bg-indigo-600 p-8 rounded-[3rem] text-white shadow-xl flex flex-col items-center text-center space-y-4">
        <Smartphone className="w-10 h-10 opacity-40" />
        <p className="text-sm font-bold leading-relaxed px-4">
          "Le succès de Ndjele repose sur la digitalisation de la confiance au Gabon."
        </p>
        <div className="h-px w-12 bg-white/20"></div>
        <p className="text-[8px] font-black uppercase tracking-widest opacity-60">Équipe Stratégie Ndjele Solution</p>
      </div>
    </div>
  );
};

export default BusinessDashboard;
