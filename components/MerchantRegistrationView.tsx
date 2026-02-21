
import React, { useState } from 'react';
import { ArrowLeft, User, ShoppingBag, Phone, MapPin, ChevronRight, Store, Loader2, CreditCard, Tag, Crown } from 'lucide-react';
import { ViewState, MerchantRegistration, Merchant } from '../types';

interface MerchantRegistrationViewProps {
  onNavigate: (view: ViewState) => void;
  onRegister: (merchant: Merchant) => void;
}

const CATEGORIES = ['Alimentation', 'Mode', 'Électronique', 'Beauté', 'Maison', 'Autres'];

const MerchantRegistrationView: React.FC<MerchantRegistrationViewProps> = ({ onNavigate, onRegister }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<MerchantRegistration>({
    firstName: '',
    lastName: '',
    shopName: '',
    phone: '',
    neighborhood: '',
    category: 'Alimentation'
  });

  // Subscription
  const [subPlan, setSubPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedProvider, setSelectedProvider] = useState<'AIRTEL' | 'MOOV'>('AIRTEL');
  const [payPhone, setPayPhone] = useState('');
  const [showUssd, setShowUssd] = useState(false);

  const handleNext = () => setStep(step + 1);
  const handleBack = () => step > 1 ? setStep(step - 1) : onNavigate('marketplace');

  const handlePayment = () => {
    if (payPhone.length < 8) return;
    setShowUssd(true);
  };

  const finalize = () => {
    setShowUssd(false);
    setIsSubmitting(true);
    setTimeout(() => {
      const newMerchant: Merchant = {
        id: 'mer-' + Math.random().toString(36).substr(2, 5),
        ownerName: `${formData.firstName} ${formData.lastName}`,
        shopName: formData.shopName,
        phone: formData.phone,
        neighborhood: formData.neighborhood,
        category: formData.category,
        rating: 5.0,
        isVerified: true,
        products: []
      };
      setIsSubmitting(false);
      onRegister(newMerchant);
    }, 2500);
  };

  return (
    <div className="p-6 h-full flex flex-col space-y-6 animate-in slide-in-from-right-4 duration-300 bg-slate-50">
      {showUssd && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="w-full max-w-[280px] bg-[#dfdfdf] rounded-xl overflow-hidden shadow-2xl border border-white/20">
            <div className="p-5 text-center space-y-4">
              <p className="text-sm font-mono text-black leading-tight">
                {selectedProvider} MONEY:<br/>
                Payer {subPlan === 'monthly' ? '5 000' : '50 000'} F à NDJELE MARKET ?<br/>
                PIN :
              </p>
              <input type="password" maxLength={4} className="w-full bg-white border border-slate-400 p-2 text-center text-black outline-none" />
            </div>
            <div className="grid grid-cols-2 border-t border-slate-400">
              <button onClick={() => setShowUssd(false)} className="py-3 text-blue-600 border-r border-slate-400 active:bg-slate-300">Annuler</button>
              <button onClick={finalize} className="py-3 text-blue-600 font-bold active:bg-slate-300">Payer</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        <button onClick={handleBack} className="p-3 bg-white rounded-full shadow-sm">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div className="flex-1">
          <h2 className="text-2xl font-black text-slate-800">Ma Boutique NS</h2>
          <div className="flex gap-1 mt-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${step === i ? 'flex-[3] bg-violet-500' : step > i ? 'flex-1 bg-emerald-500' : 'flex-1 bg-slate-200'}`}></div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-8 overflow-y-auto px-1">
        {step === 1 && (
          <div className="space-y-6">
            <div className="bg-violet-50 p-6 rounded-[2.5rem] flex items-center gap-4">
              <User className="w-6 h-6 text-violet-600" />
              <div><h4 className="font-bold">Gérant</h4><p className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">Propriétaire du commerce.</p></div>
            </div>
            <input type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} placeholder="Prénom" className="w-full p-5 bg-white rounded-2xl font-bold border-none shadow-sm text-slate-900" />
            <input type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} placeholder="Nom" className="w-full p-5 bg-white rounded-2xl font-bold border-none shadow-sm text-slate-900" />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
             <div className="bg-amber-50 p-6 rounded-[2.5rem] flex items-center gap-4">
                <Store className="w-6 h-6 text-amber-600" />
                <div><h4 className="font-bold">Enseigne</h4><p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Détails de la boutique.</p></div>
             </div>
             <input type="text" value={formData.shopName} onChange={e => setFormData({...formData, shopName: e.target.value})} placeholder="Nom de la Boutique" className="w-full p-5 bg-white rounded-2xl font-bold border-none shadow-sm text-slate-900" />
             <input type="text" value={formData.neighborhood} onChange={e => setFormData({...formData, neighborhood: e.target.value})} placeholder="Quartier" className="w-full p-5 bg-white rounded-2xl font-bold border-none shadow-sm text-slate-900" />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 text-center">
             <div className="bg-violet-600 p-8 rounded-[3rem] text-white shadow-xl relative overflow-hidden">
                <Tag className="w-12 h-12 mx-auto mb-4" />
                <h4 className="text-xl font-black">Vitrine Marketplace</h4>
                <p className="text-xs text-violet-100 mt-2">Vendez vos produits à des milliers de Gabonais. Activez votre boutique pro pour commencer.</p>
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
             </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-in slide-in-from-bottom-10">
             <div className="bg-emerald-600 p-6 rounded-[2.5rem] text-white flex items-center gap-4 shadow-xl">
                <Crown className="w-10 h-10 fill-white" />
                <h3 className="font-black uppercase tracking-tight">Activation Boutique</h3>
             </div>
             <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setSubPlan('monthly')} className={`p-5 rounded-3xl border-2 flex flex-col items-center ${subPlan === 'monthly' ? 'border-violet-500 bg-white' : 'border-slate-50'}`}>
                   <span className="text-[9px] font-black uppercase text-slate-400">Mensuel</span>
                   <span className="text-lg font-black text-slate-800">5 000 F</span>
                </button>
                <button onClick={() => setSubPlan('yearly')} className={`p-5 rounded-3xl border-2 flex flex-col items-center relative ${subPlan === 'yearly' ? 'border-violet-500 bg-white' : 'border-slate-50'}`}>
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
                <input type="tel" value={payPhone} onChange={e => setPayPhone(e.target.value)} placeholder="074 / 066..." className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-none text-slate-900" />
             </div>
          </div>
        )}
      </div>

      <div className="pt-4 flex gap-3">
        {step < 4 ? (
          <button onClick={handleNext} disabled={ (step === 1 && !formData.firstName) || (step === 2 && !formData.shopName) } className="w-full py-5 bg-violet-600 text-white rounded-3xl font-black uppercase text-xs shadow-xl active:scale-95 disabled:opacity-50">Suivant</button>
        ) : (
          <button onClick={handlePayment} disabled={payPhone.length < 8 || isSubmitting} className="w-full py-5 gradient-primary text-white rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50">
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CreditCard className="w-5 h-5" /> Payer & Ouvrir Boutique</>}
          </button>
        )}
      </div>
    </div>
  );
};

export default MerchantRegistrationView;
