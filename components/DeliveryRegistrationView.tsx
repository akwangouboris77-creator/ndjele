
import React, { useState } from 'react';
import { ArrowLeft, User, Package, Phone, MapPin, ChevronRight, Truck, Bike, Calendar, CheckCircle2, Loader2, CreditCard, Crown } from 'lucide-react';
import { ViewState, TransportType, DeliveryRegistration, Livreur } from '../types';

interface DeliveryRegistrationViewProps {
  onNavigate: (view: ViewState) => void;
  onRegister: (livreur: Livreur) => void;
}

const DeliveryRegistrationView: React.FC<DeliveryRegistrationViewProps> = ({ onNavigate, onRegister }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<DeliveryRegistration>({
    firstName: '',
    lastName: '',
    phone: '',
    vehicleType: TransportType.DELIVERY_MOTO,
    basePrice: 1500,
    neighborhood: '',
    availability: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi']
  });

  // Payment states
  const [subPlan, setSubPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedProvider, setSelectedProvider] = useState<'AIRTEL' | 'MOOV'>('AIRTEL');
  const [payPhone, setPayPhone] = useState('');
  const [showUssd, setShowUssd] = useState(false);

  const handleNext = () => setStep(step + 1);
  const handleBack = () => step > 1 ? setStep(step - 1) : onNavigate('delivery');

  const handlePayment = () => {
    if (payPhone.length < 8) return;
    setShowUssd(true);
  };

  const handleSubmit = () => {
    setShowUssd(false);
    setIsSubmitting(true);
    setTimeout(() => {
      const newLivreur: Livreur = {
        id: 'liv-' + Math.random().toString(36).substr(2, 5),
        name: `${formData.firstName} ${formData.lastName}`,
        vehicleType: formData.vehicleType,
        basePrice: formData.basePrice,
        phone: formData.phone,
        neighborhood: formData.neighborhood,
        availability: formData.availability,
        rating: 5.0,
        isVerified: true
      };
      setIsSubmitting(false);
      onRegister(newLivreur);
    }, 2500);
  };

  return (
    <div className="p-6 h-full flex flex-col space-y-6 animate-in slide-in-from-right-4 duration-300 bg-slate-50 relative">
      {showUssd && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="w-full max-w-[280px] bg-[#dfdfdf] rounded-xl overflow-hidden shadow-2xl border border-white/20">
            <div className="p-5 text-center space-y-4">
              <p className="text-sm font-mono text-black leading-tight">
                {selectedProvider} MONEY:<br/>
                Payer {subPlan === 'monthly' ? '5 000' : '50 000'} F à NDJELE ?<br/>
                PIN :
              </p>
              <input type="password" maxLength={4} className="w-full bg-white border border-slate-400 p-2 text-center text-black outline-none" />
            </div>
            <div className="grid grid-cols-2 border-t border-slate-400">
              <button onClick={() => setShowUssd(false)} className="py-3 text-blue-600 border-r border-slate-400 active:bg-slate-300">Annuler</button>
              <button onClick={handleSubmit} className="py-3 text-blue-600 font-bold active:bg-slate-300">Confirmer</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        <button onClick={handleBack} className="p-3 bg-white rounded-full shadow-sm">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div className="flex-1">
          <h2 className="text-2xl font-black text-slate-800">Livreur NS</h2>
          <div className="flex gap-1 mt-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${step === i ? 'flex-[3] bg-pink-500' : step > i ? 'flex-1 bg-emerald-500' : 'flex-1 bg-slate-200'}`}></div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-8 overflow-y-auto px-1">
        {step === 1 && (
          <div className="space-y-6">
            <div className="bg-pink-50 p-6 rounded-[2.5rem] flex items-center gap-4">
              <User className="w-6 h-6 text-pink-600" />
              <div><h4 className="font-bold">Identité</h4><p className="text-[10px] text-pink-700 font-bold uppercase tracking-wider mt-1">Vos informations pour Ndjele Express.</p></div>
            </div>
            <input type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} placeholder="Prénom" className="w-full p-5 bg-white rounded-[1.5rem] font-bold border-none shadow-sm" />
            <input type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} placeholder="Nom" className="w-full p-5 bg-white rounded-[1.5rem] font-bold border-none shadow-sm" />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
             <div className="bg-indigo-50 p-6 rounded-[2.5rem] flex items-center gap-4 text-indigo-600">
                <Truck className="w-6 h-6" />
                <div><h4 className="font-bold text-indigo-900">Véhicule</h4><p className="text-[10px] text-indigo-700 font-bold uppercase mt-1 tracking-widest">Type d'engin de livraison.</p></div>
             </div>
             <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setFormData({...formData, vehicleType: TransportType.DELIVERY_MOTO})} className={`p-6 rounded-3xl border-2 flex flex-col items-center gap-2 ${formData.vehicleType === TransportType.DELIVERY_MOTO ? 'border-pink-500 bg-pink-50 text-pink-600' : 'bg-white border-slate-50 text-slate-400'}`}><Bike className="w-8 h-8" /><span className="text-[10px] font-black uppercase">Moto</span></button>
                <button onClick={() => setFormData({...formData, vehicleType: TransportType.DELIVERY_CAR})} className={`p-6 rounded-3xl border-2 flex flex-col items-center gap-2 ${formData.vehicleType === TransportType.DELIVERY_CAR ? 'border-pink-500 bg-pink-50 text-pink-600' : 'bg-white border-slate-50 text-slate-400'}`}><Truck className="w-8 h-8" /><span className="text-[10px] font-black uppercase">Voiture</span></button>
             </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 text-center animate-in zoom-in-95">
             <div className="bg-pink-600 p-8 rounded-[3rem] text-white shadow-xl relative overflow-hidden">
                <Package className="w-12 h-12 mx-auto mb-4" />
                <h4 className="text-xl font-black uppercase">Service Express</h4>
                <p className="text-xs opacity-90 mt-2 px-4 leading-relaxed">Dernière étape : activez votre compte pour commencer à recevoir des livraisons à domicile.</p>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
             </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-in slide-in-from-bottom-10">
             <div className="bg-slate-900 p-6 rounded-[2.5rem] text-white flex items-center gap-4 shadow-xl">
                <Crown className="w-10 h-10 fill-pink-500 text-pink-500" />
                <h3 className="font-black uppercase tracking-tight">Activation Livreur Pro</h3>
             </div>
             <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setSubPlan('monthly')} className={`p-5 rounded-3xl border-2 flex flex-col items-center ${subPlan === 'monthly' ? 'border-pink-500 bg-white' : 'border-slate-50'}`}>
                   <span className="text-[9px] font-black uppercase text-slate-400">Mensuel</span>
                   <span className="text-lg font-black text-slate-800">5 000 F</span>
                </button>
                <button onClick={() => setSubPlan('yearly')} className={`p-5 rounded-3xl border-2 flex flex-col items-center relative ${subPlan === 'yearly' ? 'border-pink-500 bg-white' : 'border-slate-50'}`}>
                   <span className="absolute -top-2 bg-emerald-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase">-2 Mois</span>
                   <span className="text-[9px] font-black uppercase text-slate-400">Annuel</span>
                   <span className="text-lg font-black text-slate-800">50 000 F</span>
                </button>
             </div>
             <div className="bg-white border border-slate-100 p-6 rounded-[2.5rem] space-y-4 shadow-sm">
                <div className="flex gap-2">
                   <button onClick={() => setSelectedProvider('AIRTEL')} className={`flex-1 py-3 rounded-2xl border-2 font-black text-[10px] uppercase ${selectedProvider === 'AIRTEL' ? 'border-red-500 text-red-600' : 'border-slate-50'}`}>Airtel</button>
                   <button onClick={() => setSelectedProvider('MOOV')} className={`flex-1 py-3 rounded-2xl border-2 font-black text-[10px] uppercase ${selectedProvider === 'MOOV' ? 'border-blue-500 text-blue-600' : 'border-slate-50'}`}>Moov</button>
                </div>
                <input type="tel" value={payPhone} onChange={e => setPayPhone(e.target.value)} placeholder="074..." className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-none outline-none" />
             </div>
          </div>
        )}
      </div>

      <div className="pt-4 flex gap-3">
        {step < 4 ? (
          <button onClick={handleNext} disabled={ (step === 1 && !formData.firstName) } className="w-full py-5 bg-pink-600 text-white rounded-3xl font-black uppercase text-xs shadow-xl active:scale-95 disabled:opacity-50">Suivant</button>
        ) : (
          <button onClick={handlePayment} disabled={payPhone.length < 8 || isSubmitting} className="w-full py-5 gradient-primary text-white rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50">
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CreditCard className="w-5 h-5" /> Payer & Activer mon Profil</>}
          </button>
        )}
      </div>
    </div>
  );
};

export default DeliveryRegistrationView;
