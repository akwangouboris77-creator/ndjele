
import React, { useState, useRef } from 'react';
// Added ChevronRight to imports
import { ArrowLeft, Pill, Search, Camera, Upload, CheckCircle2, ShieldCheck, CreditCard, Loader2, X, Plus, AlertCircle, ChevronRight } from 'lucide-react';
import { ViewState, Pharmacy, Medication } from '../types';

interface MedicationOrderViewProps {
  onNavigate: (view: ViewState) => void;
  pharmacy: Pharmacy;
}

const MOCK_MEDS: Medication[] = [
  { id: 'm1', name: 'Paracétamol 500mg', price: 1200, needsPrescription: false, category: 'Douleur' },
  { id: 'm2', name: 'Amoxicilline 1g', price: 3500, needsPrescription: true, category: 'Antibiotique' },
  { id: 'm3', name: 'Doliprane 1000mg', price: 1500, needsPrescription: false, category: 'Douleur' },
  { id: 'm4', name: 'Vogalène', price: 2800, needsPrescription: true, category: 'Nausées' },
];

const MedicationOrderView: React.FC<MedicationOrderViewProps> = ({ onNavigate, pharmacy }) => {
  const [cart, setCart] = useState<Medication[]>([]);
  const [step, setStep] = useState<'browse' | 'prescription' | 'checkout' | 'success'>('browse');
  const [prescriptionImage, setPrescriptionImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addToCart = (med: Medication) => {
    setCart([...cart, med]);
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(m => m.id !== id));
  };

  const needsPrescription = cart.some(m => m.needsPrescription);

  const handleNext = () => {
    if (needsPrescription && !prescriptionImage) {
      setStep('prescription');
    } else {
      setStep('checkout');
    }
  };

  const handleBack = () => {
    if (step === 'browse') {
      onNavigate('pharmacies');
    } else if (step === 'prescription') {
      setStep('browse');
    } else if (step === 'checkout') {
      setStep(needsPrescription ? 'prescription' : 'browse');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPrescriptionImage(reader.result as string);
        setStep('checkout');
      };
      reader.readAsDataURL(file);
    }
  };

  const finalizeOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
    }, 2500);
  };

  const total = cart.reduce((acc, curr) => acc + curr.price, 0);
  const deliveryFee = 2000;

  if (step === 'success') {
    return (
      <div className="p-8 h-full flex flex-col items-center justify-center text-center space-y-8 animate-in zoom-in-95 bg-white">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-inner relative">
           <CheckCircle2 className="w-12 h-12" />
           <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 animate-ping"></div>
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Commande Validée</h2>
          <p className="text-sm text-slate-500 font-medium px-4">
            Le pharmacien de <b>{pharmacy.name}</b> vérifie votre demande. Un livreur sera affecté dès validation.
          </p>
        </div>
        <button 
          onClick={() => onNavigate('home')}
          className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-xs"
        >
          Suivre ma commande
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 h-full flex flex-col space-y-6 animate-in slide-in-from-right-4 bg-slate-50">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

      <div className="flex items-center gap-4">
        <button onClick={handleBack} className="p-3 bg-white rounded-full shadow-sm active:scale-90 transition-transform">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-black text-slate-800 truncate">{pharmacy.name}</h2>
          <p className="text-[10px] font-black text-pink-600 uppercase tracking-widest">{pharmacy.neighborhood}</p>
        </div>
      </div>

      {step === 'browse' && (
        <div className="flex-1 flex flex-col space-y-6 overflow-hidden">
          <div className="space-y-4 overflow-y-auto pr-1 flex-1 hide-scrollbar">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Médicaments Disponibles</h3>
            <div className="grid grid-cols-1 gap-3">
              {MOCK_MEDS.map(med => (
                <div key={med.id} className="bg-white p-4 rounded-3xl border border-slate-100 flex items-center justify-between shadow-sm">
                   <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center">
                        <Pill className="w-6 h-6 text-pink-500" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">{med.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-pink-600 font-black text-sm">{med.price} F</span>
                          {med.needsPrescription && (
                            <span className="text-[8px] font-black bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded-md uppercase border border-amber-100 flex items-center gap-1">
                              <AlertCircle className="w-2 h-2" /> Ordonnance
                            </span>
                          )}
                        </div>
                      </div>
                   </div>
                   <button 
                    onClick={() => addToCart(med)}
                    className="p-3 bg-slate-900 text-white rounded-2xl active:scale-95 transition-transform"
                   >
                     <Plus className="w-5 h-5" />
                   </button>
                </div>
              ))}
            </div>
          </div>

          {cart.length > 0 && (
            <div className="bg-slate-900 p-6 rounded-[2.5rem] text-white space-y-4 shadow-xl animate-in slide-in-from-bottom-6">
               <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-60">
                 <span>{cart.length} Articles sélectionnés</span>
                 <span>Total: {total} F</span>
               </div>
               <button 
                onClick={handleNext}
                className="w-full py-4 bg-pink-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2"
               >
                 Commander <ChevronRight className="w-4 h-4" />
               </button>
            </div>
          )}
        </div>
      )}

      {step === 'prescription' && (
        <div className="flex-1 flex flex-col justify-center space-y-8 animate-in fade-in">
           <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                <Camera className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">ORDONNANCE REQUISE</h3>
              <p className="text-sm text-slate-500 font-medium px-8">
                Certains médicaments de votre panier nécessitent une ordonnance valide pour être délivrés.
              </p>
           </div>

           <div className="space-y-4">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-12 border-4 border-dashed border-slate-200 bg-white rounded-[2.5rem] flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-pink-500 transition-colors"
              >
                <Upload className="w-8 h-8" />
                <span className="font-black text-[10px] uppercase tracking-widest">Scanner ou Joindre Photo</span>
              </button>
              
              <button 
                onClick={handleBack}
                className="w-full py-4 text-slate-400 font-bold text-sm"
              >
                Modifier mon panier
              </button>
           </div>
        </div>
      )}

      {step === 'checkout' && (
        <div className="flex-1 space-y-6 overflow-y-auto animate-in slide-in-from-right-4">
           <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Récapitulatif de santé</h4>
              <div className="space-y-3">
                 {cart.map((m, i) => (
                   <div key={i} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                      <span className="text-sm font-bold text-slate-700">{m.name}</span>
                      <span className="text-sm font-black text-slate-900">{m.price} F</span>
                   </div>
                 ))}
                 {prescriptionImage && (
                   <div className="flex items-center gap-3 p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase">Ordonnance jointe</span>
                   </div>
                 )}
              </div>
           </div>

           <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white space-y-4">
              <div className="flex justify-between items-center text-sm opacity-60">
                <span>Total Médicaments</span>
                <span className="font-bold">{total} F</span>
              </div>
              <div className="flex justify-between items-center text-sm opacity-60">
                <span>Livraison Médicale</span>
                <span className="font-bold">{deliveryFee} F</span>
              </div>
              <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="text-xs font-black uppercase text-pink-400">Total à payer</span>
                <span className="text-3xl font-black">{total + deliveryFee} F</span>
              </div>
           </div>

           <div className="bg-violet-50 p-6 rounded-[2rem] border border-violet-100 flex items-start gap-4">
              <ShieldCheck className="w-6 h-6 text-violet-600 shrink-0" />
              <p className="text-[10px] text-violet-800 font-bold leading-relaxed">
                Le paiement est sécurisé par Ndjele. Le pharmacien doit valider votre commande avant que le montant ne soit débité.
              </p>
           </div>

           <button 
             onClick={finalizeOrder}
             disabled={isProcessing}
             className="w-full py-5 gradient-primary text-white rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl flex items-center justify-center gap-2"
           >
             {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CreditCard className="w-5 h-5" /> Confirmer & Payer</>}
           </button>
        </div>
      )}
    </div>
  );
};

export default MedicationOrderView;
