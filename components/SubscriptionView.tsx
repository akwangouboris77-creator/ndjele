import React, { useState } from 'react';
import { ShieldCheck, Crown, Zap, Package, Hammer, CreditCard, Loader2, Info, Phone, Smartphone, CheckCircle2, ShoppingBag, AlertTriangle, Stethoscope, Pill, Copy, CheckCircle } from 'lucide-react';
import { ViewState, SubscriptionTier } from '../types';

interface SubscriptionViewProps {
  onNavigate: (view: ViewState) => void;
  currentTier: SubscriptionTier;
  onUpgrade: () => void;
}

const NDJELE_NUMBERS = {
  AIRTEL: '077 21 89 76',
  MOOV: '062 70 23 74'
};

const SubscriptionView: React.FC<SubscriptionViewProps> = ({ currentTier, onUpgrade }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<'AIRTEL' | 'MOOV' | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleStartPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 3000);
  };

  if (isSuccess) {
    return (
      <div className="p-8 h-full flex flex-col items-center justify-center text-center space-y-8 animate-in zoom-in-95 duration-500 bg-white">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-inner relative">
           <CheckCircle2 className="w-12 h-12" />
           <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 animate-ping"></div>
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Accès Pro Activé !</h2>
          <p className="text-sm text-slate-500 font-medium px-4">
            Votre abonnement de 5 000 F a été validé. Bienvenue chez les Membres Ndjele Premium.
          </p>
        </div>
        <button 
          onClick={onUpgrade}
          className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-xs shadow-xl active:scale-95 transition-all"
        >
          Accéder à l'expérience Pro
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 h-full flex flex-col space-y-8 animate-in fade-in duration-500 bg-slate-50 relative">
      <div className="text-center space-y-2 pt-4">
        <div className="w-16 h-16 bg-amber-500 rounded-[1.5rem] flex items-center justify-center text-white mx-auto shadow-xl shadow-amber-500/20 mb-2">
          <Crown className="w-8 h-8 fill-white" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 leading-tight">Devenez Membre Pro</h2>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Ndjele Premium • 5.000 F / mois</p>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-1 hide-scrollbar">
        <div className="bg-white border border-slate-200 p-6 rounded-[2.5rem] shadow-sm space-y-4">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Inclus :</h4>
          <div className="space-y-3">
             {[
               { icon: Pill, label: 'Pharmacie à domicile', color: 'bg-pink-50 text-pink-600' },
               { icon: Stethoscope, label: 'Médecins de proximité', color: 'bg-emerald-50 text-emerald-600' },
               { icon: Hammer, label: 'Diagnostic technique IA', color: 'bg-indigo-50 text-indigo-600' },
             ].map((item, i) => (
               <div key={i} className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50/50">
                  <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">{item.label}</span>
               </div>
             ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Moyen de Transfert</label>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setSelectedProvider('AIRTEL')}
              className={`p-4 rounded-3xl border-2 flex flex-col items-center gap-2 transition-all ${selectedProvider === 'AIRTEL' ? 'border-red-500 bg-red-50' : 'bg-white border-slate-100 opacity-60'}`}
            >
              <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white font-black">A</div>
              <span className="text-[10px] font-black uppercase text-slate-800">Airtel</span>
            </button>
            <button 
              onClick={() => setSelectedProvider('MOOV')}
              className={`p-4 rounded-3xl border-2 flex flex-col items-center gap-2 transition-all ${selectedProvider === 'MOOV' ? 'border-blue-500 bg-blue-50' : 'bg-white border-slate-100 opacity-60'}`}
            >
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black">M</div>
              <span className="text-[10px] font-black uppercase text-slate-800">Moov</span>
            </button>
          </div>

          {selectedProvider && (
            <div className="bg-slate-900 border-2 border-indigo-500/30 p-6 rounded-[2.5rem] shadow-xl space-y-4 animate-in zoom-in-95">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Transférez les 5 000 F vers :</p>
               <div className="flex items-center justify-center gap-3">
                  <h3 className="text-2xl font-black text-white tracking-widest">
                    {selectedProvider === 'AIRTEL' ? NDJELE_NUMBERS.AIRTEL : NDJELE_NUMBERS.MOOV}
                  </h3>
                  <button className="p-2 bg-white/10 rounded-lg text-emerald-400"><Copy className="w-4 h-4" /></button>
               </div>
               <div className="bg-red-500/10 p-3 rounded-xl border border-red-500/20 text-center">
                  <p className="text-[8px] font-black text-red-400 uppercase tracking-widest">⚠️ Transaction définitive - Non annulable</p>
               </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3 pb-4">
        <button 
          onClick={handleStartPayment}
          disabled={isProcessing || !selectedProvider}
          className="w-full py-5 gradient-primary text-white rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl disabled:opacity-50 flex items-center justify-center gap-3 active:scale-95 transition-all"
        >
          {isProcessing ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Vérification...</>
          ) : (
            <><CheckCircle className="w-5 h-5" /> J'ai effectué le transfert</>
          )}
        </button>
      </div>
    </div>
  );
};

export default SubscriptionView;