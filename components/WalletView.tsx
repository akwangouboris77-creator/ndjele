import React, { useState } from 'react';
import { Plus, ArrowLeft, ArrowUpRight, ArrowDownLeft, RefreshCcw, Smartphone, CreditCard, X, Loader2, Info, CheckCircle2, ShieldAlert, ShieldCheck, Copy, CheckCircle } from 'lucide-react';
import { ViewState } from '../types';

interface WalletViewProps {
  onNavigate: (view: ViewState) => void;
  balance: number;
  onUpdateBalance: (newBalance: number) => void;
}

const NDJELE_NUMBERS = {
  AIRTEL: '077 21 89 76',
  MOOV: '062 70 23 74'
};

const WalletView: React.FC<WalletViewProps> = ({ onNavigate, balance, onUpdateBalance }) => {
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [rechargeStep, setRechargeStep] = useState<'provider' | 'amount' | 'instruction' | 'success'>('provider');
  const [selectedProvider, setSelectedProvider] = useState<'AIRTEL' | 'MOOV' | null>(null);
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const transactions = [
    { id: '1', title: 'Reliquat Digital Taxi', amount: 150, type: 'credit', date: 'Aujourd\'hui' },
    { id: '2', title: 'Paiement Séquestre Artisan', amount: -15000, type: 'debit', date: 'Hier' },
    { id: '3', title: 'Recharge Airtel Money', amount: 5000, type: 'credit', date: 'Hier' },
  ];

  const handleStartRecharge = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setRechargeStep('instruction');
    }, 1000);
  };

  const handleConfirmSent = () => {
    setIsProcessing(true);
    const amountToAdd = parseInt(rechargeAmount);
    setTimeout(() => {
      onUpdateBalance(balance + amountToAdd);
      setIsProcessing(false);
      setRechargeStep('success');
    }, 2500);
  };

  const resetModal = () => {
    setShowRechargeModal(false);
    setRechargeStep('provider');
    setSelectedProvider(null);
    setRechargeAmount('');
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500 pb-32">
      <div className="flex items-center gap-4">
        <button onClick={() => onNavigate('home')} className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-600 active:scale-90 transition-all">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none">Mon Wallet</h2>
          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">Gérer mon argent</p>
        </div>
      </div>

      <div className="gradient-primary p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 text-center">
          <span className="text-emerald-100 text-sm font-black uppercase tracking-widest opacity-80">Solde Disponible</span>
          <h3 className="text-6xl font-black mt-2 tracking-tighter">{balance.toLocaleString()} <span className="text-xl font-normal opacity-60">F</span></h3>
          
          <div className="mt-8 flex gap-3">
            <button 
              onClick={() => setShowRechargeModal(true)}
              className="flex-1 bg-white text-emerald-600 py-4 rounded-xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95"
            >
              <Plus className="w-4 h-4" /> Recharger
            </button>
            <button className="flex-1 bg-white/20 backdrop-blur-md text-white py-4 rounded-xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest">
              <RefreshCcw className="w-4 h-4" /> Transfert
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 blur-3xl"></div>
      </div>

      <section className="space-y-4">
        <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs px-2">Activités Récentes</h3>
        <div className="space-y-3">
          {transactions.map((t) => (
            <div key={t.id} className="flex items-center gap-4 bg-white p-4 rounded-[1.5rem] border border-slate-100 shadow-sm">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.type === 'credit' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                {t.type === 'credit' ? <Plus className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-800 text-sm leading-none mb-1">{t.title}</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t.date}</p>
              </div>
              <div className={`font-black text-sm ${t.type === 'credit' ? 'text-emerald-600' : 'text-slate-800'}`}>
                {t.amount > 0 ? '+' : ''}{t.amount.toLocaleString()} F
              </div>
            </div>
          ))}
        </div>
      </section>

      {showRechargeModal && (
        <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-end animate-in fade-in">
           <div className="w-full bg-white rounded-t-[3rem] p-8 space-y-6 animate-in slide-in-from-bottom-10 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center">
                 <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Recharger Wallet</h3>
                 <button onClick={resetModal} className="p-2 bg-slate-100 rounded-full"><X className="w-5 h-5 text-slate-400" /></button>
              </div>

              {rechargeStep === 'provider' && (
                <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-right-4">
                   <button onClick={() => { setSelectedProvider('AIRTEL'); setRechargeStep('amount'); }} className="p-6 border-4 border-slate-50 rounded-[2rem] flex flex-col items-center gap-3 transition-all active:scale-95"><div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg">A</div><span className="font-black text-[10px] uppercase tracking-widest text-slate-600">Airtel Money</span></button>
                   <button onClick={() => { setSelectedProvider('MOOV'); setRechargeStep('amount'); }} className="p-6 border-4 border-slate-50 rounded-[2rem] flex flex-col items-center gap-3 transition-all active:scale-95"><div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg">M</div><span className="font-black text-[10px] uppercase tracking-widest text-slate-600">Moov Money</span></button>
                </div>
              )}

              {rechargeStep === 'amount' && (
                <div className="space-y-4 animate-in slide-in-from-right-4">
                   <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Montant à ajouter au compte</p>
                   <input type="number" value={rechargeAmount} onChange={e => setRechargeAmount(e.target.value)} placeholder="0 FCFA" className="w-full p-6 bg-slate-50 rounded-2xl font-black text-4xl text-center outline-none text-emerald-600 border border-slate-100 shadow-inner" />
                   <button onClick={handleStartRecharge} disabled={!rechargeAmount || parseInt(rechargeAmount) < 500} className="w-full py-5 gradient-primary text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl disabled:opacity-50">Confirmer le montant</button>
                </div>
              )}

              {rechargeStep === 'instruction' && (
                <div className="space-y-6 animate-in zoom-in-95">
                   <div className="bg-slate-900 p-6 rounded-[2.5rem] text-white text-center space-y-4 border-2 border-indigo-500/20 shadow-2xl">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Envoyez {parseInt(rechargeAmount).toLocaleString()} F vers :</p>
                      <div className="flex items-center justify-center gap-4">
                        <h4 className="text-3xl font-black text-white tracking-widest">
                          {selectedProvider === 'AIRTEL' ? NDJELE_NUMBERS.AIRTEL : NDJELE_NUMBERS.MOOV}
                        </h4>
                        <button className="p-2 bg-white/10 rounded-xl text-emerald-400"><Copy className="w-4 h-4" /></button>
                      </div>
                      <div className="bg-red-500/20 py-2 rounded-xl border border-red-500/30">
                        <p className="text-[8px] font-black text-red-300 uppercase tracking-widest">⚠️ Transaction définitive - Non annulable</p>
                      </div>
                   </div>
                   
                   <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex items-start gap-4">
                      <Info className="w-5 h-5 text-amber-600 shrink-0" />
                      <p className="text-[10px] text-amber-800 font-bold leading-relaxed">Le crédit apparaîtra sur votre wallet dès validation de la transaction par notre équipe de sécurité.</p>
                   </div>

                   <button onClick={handleConfirmSent} className="w-full py-5 gradient-primary text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl flex items-center justify-center gap-2 active:scale-95">
                      <CheckCircle className="w-5 h-5" /> J'ai effectué le transfert
                   </button>
                </div>
              )}

              {rechargeStep === 'success' && (
                <div className="py-8 text-center space-y-6 animate-in zoom-in-95">
                   <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner"><CheckCircle2 className="w-10 h-10" /></div>
                   <div className="space-y-1">
                      <h4 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Recharge Validée !</h4>
                      <p className="text-xs text-slate-400 font-medium">Votre portefeuille Ndjele a été crédité.</p>
                   </div>
                   <button onClick={resetModal} className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-xs">Terminer</button>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

export default WalletView;