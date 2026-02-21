
import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, Users, Wallet, CreditCard, 
  ArrowLeft, ArrowUpRight, BarChart3, PieChart, Info,
  ShieldCheck, Smartphone, Target, Zap, Gavel, FileText,
  Building2, ChevronRight, Download
} from 'lucide-react';
import { ViewState } from '../types';

interface BusinessDashboardProps {
  onNavigate: (view: ViewState) => void;
}

const BusinessDashboard: React.FC<BusinessDashboardProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'plan' | 'treasury'>('plan');

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

  const treasuryData = [
    { month: 'M1', in: 12700000, out: 8500000, balance: 4200000 },
    { month: 'M2', in: 15800000, out: 9000000, balance: 6800000 },
    { month: 'M3', in: 20500000, out: 10500000, balance: 10000000 },
    { month: 'M4', in: 28000000, out: 12000000, balance: 16000000 },
    { month: 'M5', in: 35000000, out: 14000000, balance: 21000000 },
    { month: 'M6', in: 45000000, out: 15000000, balance: 30000000 },
  ];

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500 pb-32 bg-slate-50/50 min-h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('home')} className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 active:scale-95 transition-all">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none">Dossier Bancaire</h2>
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-1">BCEG • AFG • BGFIBank</p>
          </div>
        </div>
        <button className="p-3 bg-slate-900 text-white rounded-2xl shadow-lg active:scale-95 transition-all">
          <Download className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-slate-200/50 rounded-2xl">
        <button 
          onClick={() => setActiveTab('plan')}
          className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase transition-all ${activeTab === 'plan' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
        >
          Business Plan
        </button>
        <button 
          onClick={() => setActiveTab('treasury')}
          className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase transition-all ${activeTab === 'treasury' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}
        >
          Trésorerie
        </button>
      </div>

      {activeTab === 'plan' ? (
        <div className="space-y-6 animate-in slide-in-from-left-4">
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
          </div>

          <section className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
              <Building2 className="w-3 h-3" /> Arguments Bancaires
            </h3>
            <div className="grid grid-cols-1 gap-3">
               {[
                 { bank: "BGFIBank", focus: "Digitalisation & Sécurité", desc: "Sécurisation des flux via Escrow et lutte contre l'informel.", color: "border-blue-100 bg-blue-50/50" },
                 { bank: "AFG", focus: "Inclusion Financière", desc: "Interopérabilité Mobile Money et accès aux services ruraux.", color: "border-emerald-100 bg-emerald-50/50" },
                 { bank: "BCEG", focus: "Soutien aux PME", desc: "Structuration du travail des artisans et chauffeurs gabonais.", color: "border-indigo-100 bg-indigo-50/50" }
               ].map((item, i) => (
                 <div key={i} className={`p-5 rounded-3xl border ${item.color} space-y-2`}>
                    <div className="flex justify-between items-center">
                       <h4 className="font-black text-slate-900 text-xs uppercase">{item.bank}</h4>
                       <span className="text-[8px] font-black bg-white px-2 py-1 rounded-full text-slate-500 border border-slate-100 uppercase">{item.focus}</span>
                    </div>
                    <p className="text-[10px] text-slate-600 font-medium leading-relaxed">{item.desc}</p>
                 </div>
               ))}
            </div>
          </section>
        </div>
      ) : (
        <div className="space-y-6 animate-in slide-in-from-right-4">
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><Wallet className="w-5 h-5" /></div>
                <h3 className="font-black text-xs uppercase tracking-widest text-slate-800">Flux de Trésorerie (6 mois)</h3>
             </div>

             <div className="space-y-4">
                {treasuryData.map((data, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                     <span className="text-[10px] font-black text-slate-400 w-6">{data.month}</span>
                     <div className="flex-1 bg-slate-50 p-4 rounded-2xl flex justify-between items-center border border-transparent group-hover:border-emerald-100 transition-all">
                        <div className="space-y-1">
                           <p className="text-[8px] font-black text-emerald-500 uppercase">Encaissements</p>
                           <p className="text-xs font-black text-slate-800">+{data.in.toLocaleString()} F</p>
                        </div>
                        <div className="h-8 w-px bg-slate-200"></div>
                        <div className="space-y-1 text-right">
                           <p className="text-[8px] font-black text-red-400 uppercase">Décaissements</p>
                           <p className="text-xs font-black text-slate-800">-{data.out.toLocaleString()} F</p>
                        </div>
                        <div className="h-8 w-px bg-slate-200"></div>
                        <div className="space-y-1 text-right">
                           <p className="text-[8px] font-black text-slate-400 uppercase">Solde</p>
                           <p className="text-xs font-black text-indigo-600">{data.balance.toLocaleString()} F</p>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="bg-amber-50 p-6 rounded-[2.5rem] border border-amber-100 flex items-start gap-4">
             <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-600 shrink-0 shadow-sm">
                <Info className="w-5 h-5" />
             </div>
             <div>
                <h4 className="text-xs font-black text-amber-900 uppercase mb-1">Note de Trésorerie</h4>
                <p className="text-[10px] text-amber-800 font-medium leading-relaxed">
                  Le point mort (Break-even) est atteint au 4ème mois avec une base de 800 utilisateurs Premium actifs.
                </p>
             </div>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-xl flex flex-col items-center text-center space-y-4">
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

