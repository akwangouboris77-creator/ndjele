
import React, { useState, useRef } from 'react';
import { ArrowLeft, User, Hammer, Phone, MapPin, ChevronRight, ShieldCheck, Loader2, Camera, Image as ImageIcon, Upload, Crown, CreditCard } from 'lucide-react';
import { ViewState, ArtisanRegistration, Artisan, ArtisanCategory } from '../types';

interface ArtisanRegistrationViewProps {
  onNavigate: (view: ViewState) => void;
  onRegister: (artisan: Artisan) => void;
}

const CATEGORIES: { id: ArtisanCategory, label: string }[] = [
  { id: 'froid', label: 'Froid & Clim' },
  { id: 'plomberie', label: 'Plomberie' },
  { id: 'electricite', label: 'Électricité' },
  { id: 'maconnerie', label: 'Maçonnerie' },
  { id: 'menuiserie', label: 'Menuiserie' },
  { id: 'carrelage', label: 'Carrelage' },
  { id: 'menage', label: 'Dame de Ménage' },
  { id: 'nettoyage', label: 'Technicien Surface' },
  { id: 'charpenterie', label: 'Charpentier' },
  { id: 'elagage', label: 'Abatteur Arbre' },
  { id: 'mecanique', label: 'Mécanique Auto' },
];

const ArtisanRegistrationView: React.FC<ArtisanRegistrationViewProps> = ({ onNavigate, onRegister }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<ArtisanRegistration>({
    firstName: '',
    lastName: '',
    job: '',
    category: 'froid',
    phone: '',
    neighborhood: '',
    avatar: '' 
  });

  // Payment states
  const [subPlan, setSubPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedProvider, setSelectedProvider] = useState<'AIRTEL' | 'MOOV'>('AIRTEL');
  const [payPhone, setPayPhone] = useState('');
  const [showUssd, setShowUssd] = useState(false);

  const handleNext = () => setStep(step + 1);
  const handleBack = () => step > 1 ? setStep(step - 1) : onNavigate('artisans');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, avatar: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handlePayment = () => {
    if (payPhone.length < 8) return;
    setShowUssd(true);
  };

  const finalizeRegistration = () => {
    setShowUssd(false);
    setIsSubmitting(true);
    setTimeout(() => {
      const newArtisan: Artisan = {
        id: 'art-' + Math.random().toString(36).substr(2, 5),
        name: `${formData.firstName} ${formData.lastName}`,
        job: formData.job,
        category: formData.category,
        rating: 0,
        distance: 0,
        isVerified: true,
        avatar: formData.avatar || 'https://images.unsplash.com/photo-1521119954732-83bcc797bd68?fit=crop&w=150&h=150',
        completedTasks: 0,
        yearsOnPlatform: 0,
        phone: formData.phone,
        neighborhood: formData.neighborhood
      };
      setIsSubmitting(false);
      onRegister(newArtisan);
    }, 2500);
  };

  return (
    <div className="p-6 space-y-6 animate-in slide-in-from-right-4 duration-300 h-full flex flex-col bg-slate-50/50">
      {showUssd && (
        <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="w-full max-w-[280px] bg-[#dfdfdf] rounded-xl overflow-hidden shadow-2xl border border-white/20">
            <div className="p-5 text-center space-y-4">
              <p className="text-sm font-mono text-black leading-tight">
                {selectedProvider} MONEY:<br/>
                Payer {subPlan === 'monthly' ? '5 000' : '50 000'} F à NDJELE ?<br/>
                PIN :
              </p>
              <input type="password" maxLength={4} placeholder="****" className="w-full bg-white border border-slate-400 p-2 text-center font-mono text-xl text-black outline-none" />
            </div>
            <div className="grid grid-cols-2 border-t border-slate-400">
              <button onClick={() => setShowUssd(false)} className="py-3 font-mono text-blue-600 border-r border-slate-400 active:bg-slate-300">Annuler</button>
              <button onClick={finalizeRegistration} className="py-3 font-mono text-blue-600 font-bold active:bg-slate-300">Valider</button>
            </div>
          </div>
        </div>
      )}

      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

      <div className="flex items-center gap-4">
        <button onClick={handleBack} className="p-3 bg-white rounded-full shadow-sm">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div className="flex-1">
          <h2 className="text-2xl font-black text-slate-800 leading-tight">Artisan NS</h2>
          <div className="flex gap-1.5 mt-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${step === i ? 'flex-[3] bg-indigo-500' : step > i ? 'flex-1 bg-emerald-500' : 'flex-1 bg-slate-200'}`}></div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-8 overflow-y-auto px-1 pb-10">
        {step === 1 && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
            <div className="bg-indigo-50 p-6 rounded-[2.5rem] border border-indigo-100 flex items-start gap-4">
              <User className="w-6 h-6 text-indigo-600 shrink-0" />
              <div>
                <h4 className="font-bold text-indigo-900">Profil Pro</h4>
                <p className="text-[10px] text-indigo-700 font-bold uppercase mt-1">Identité et photo professionnelle.</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-[2.5rem] flex flex-col items-center gap-4">
              <div onClick={() => fileInputRef.current?.click()} className="relative w-32 h-32 rounded-[2.5rem] bg-slate-50 border-4 border-white shadow-xl overflow-hidden cursor-pointer">
                {formData.avatar ? <img src={formData.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex flex-col items-center justify-center text-slate-300"><ImageIcon className="w-10 h-10" /></div>}
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"><Camera className="w-8 h-8 text-white" /></div>
              </div>
              <input type="text" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} placeholder="Prénom" className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-none text-slate-900" />
              <input type="text" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} placeholder="Nom" className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-none text-slate-900" />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
             <div className="bg-amber-50 p-6 rounded-[2.5rem] border border-amber-100 flex items-start gap-4">
                <Hammer className="w-6 h-6 text-amber-600 shrink-0" />
                <div><h4 className="font-bold">Métier & Zone</h4><p className="text-[10px] uppercase font-bold text-amber-700">Votre domaine d'expertise.</p></div>
             </div>
             <div className="grid grid-cols-2 gap-3">
               {CATEGORIES.slice(0, 6).map(c => (
                 <button key={c.id} onClick={() => setFormData({ ...formData, category: c.id })} className={`p-4 rounded-3xl border-2 font-black text-xs ${formData.category === c.id ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'bg-white border-slate-100 text-slate-400'}`}>{c.label}</button>
               ))}
             </div>
             <input type="text" value={formData.neighborhood} onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })} placeholder="Quartier principal" className="w-full p-5 bg-white border border-slate-100 rounded-2xl font-bold text-slate-900" />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 text-center animate-in zoom-in-95">
             <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                <ShieldCheck className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                <h4 className="text-xl font-black">Prêt pour Ndjele ?</h4>
                <p className="text-xs text-slate-400 mt-2 px-4 leading-relaxed">Dernière étape : activez votre accès pro pour commencer à recevoir des demandes de dépannage.</p>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
             </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-in slide-in-from-bottom-10">
             <div className="bg-indigo-600 p-6 rounded-[2.5rem] text-white flex items-center gap-4 shadow-xl">
                <Crown className="w-10 h-10 fill-white" />
                <h3 className="font-black uppercase tracking-tight">Activation Artisan Pro</h3>
             </div>
             <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setSubPlan('monthly')} className={`p-5 rounded-3xl border-2 flex flex-col items-center ${subPlan === 'monthly' ? 'border-indigo-500 bg-white' : 'border-slate-50'}`}>
                   <span className="text-[9px] font-black uppercase text-slate-400">Mensuel</span>
                   <span className="text-lg font-black text-slate-800">5 000 F</span>
                </button>
                <button onClick={() => setSubPlan('yearly')} className={`p-5 rounded-3xl border-2 flex flex-col items-center relative ${subPlan === 'yearly' ? 'border-indigo-500 bg-white' : 'border-slate-50'}`}>
                   <span className="absolute -top-2 bg-emerald-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase">-10 000 F</span>
                   <span className="text-[9px] font-black uppercase text-slate-400">Annuel</span>
                   <span className="text-lg font-black text-slate-800">50 000 F</span>
                </button>
             </div>
             <div className="bg-white border border-slate-100 p-6 rounded-[2.5rem] space-y-4">
                <div className="flex gap-2">
                   <button onClick={() => setSelectedProvider('AIRTEL')} className={`flex-1 py-3 rounded-2xl font-black text-[10px] uppercase border-2 ${selectedProvider === 'AIRTEL' ? 'border-red-500 text-red-600' : 'border-slate-50'}`}>Airtel</button>
                   <button onClick={() => setSelectedProvider('MOOV')} className={`flex-1 py-3 rounded-2xl font-black text-[10px] uppercase border-2 ${selectedProvider === 'MOOV' ? 'border-blue-500 text-blue-600' : 'border-slate-50'}`}>Moov</button>
                </div>
                <input type="tel" value={payPhone} onChange={e => setPayPhone(e.target.value)} placeholder="N° Mobile Money" className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-none text-slate-900" />
             </div>
          </div>
        )}
      </div>

      <div className="pt-4 flex gap-3">
        {step < 4 ? (
          <button onClick={handleNext} disabled={(step === 1 && !formData.firstName)} className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl">Continuer</button>
        ) : (
          <button onClick={handlePayment} disabled={payPhone.length < 8 || isSubmitting} className="w-full py-5 gradient-primary text-white rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl flex items-center justify-center gap-2">
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CreditCard className="w-5 h-5" /> Activer mon Profil</>}
          </button>
        )}
      </div>
    </div>
  );
};

export default ArtisanRegistrationView;
