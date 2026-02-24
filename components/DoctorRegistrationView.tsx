
import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, User, Stethoscope, Phone, MapPin, ChevronRight, 
  ShieldCheck, Loader2, Award, Camera, CreditCard, CheckCircle2,
  AlertCircle, Info, Brain
} from 'lucide-react';
import { ViewState, Doctor } from '../types';
import { dbService } from '../src/services/dbService';

// Internal utility components
const Crown = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/>
  </svg>
);

const Smartphone = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>
  </svg>
);

const Heart = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
  </svg>
);

interface DoctorRegistrationViewProps {
  onNavigate: (view: ViewState) => void;
  onRegister: (doctor: Doctor) => void;
}

const SPECIALTIES = [
  { id: 'generaliste', label: 'Médecin Généraliste', icon: Stethoscope },
  { id: 'pediatre', label: 'Pédiatre', icon: User },
  { id: 'gynecologue', label: 'Gynécologue', icon: Heart },
  { id: 'dentiste', label: 'Dentiste', icon: Award },
  { id: 'ophtalmo', label: 'Ophtalmologue', icon: Info },
  { id: 'urologue', label: 'Urologue', icon: ShieldCheck },
  { id: 'cardiologue', label: 'Cardiologue', icon: Heart },
  { id: 'dermatologue', label: 'Dermatologue', icon: User },
  { id: 'kine', label: 'Kinésithérapeute', icon: Award },
  { id: 'sage-femme', label: 'Sage-femme', icon: User },
  { id: 'neurologue', label: 'Neurologue', icon: Brain },
  { id: 'psychiatre', label: 'Psychiatre', icon: Brain },
  { id: 'orl', label: 'ORL', icon: Info },
  { id: 'gastro', label: 'Gastro-entérologue', icon: Info },
  { id: 'rhumato', label: 'Rhumatologue', icon: Award },
  { id: 'endocrino', label: 'Endocrinologue', icon: Info },
  { id: 'onco', label: 'Oncologue', icon: ShieldCheck },
  { id: 'radio', label: 'Radiologue', icon: Smartphone },
  { id: 'diabetologue', label: 'Diabétologue', icon: Info },
  { id: 'urgence', label: 'Urgentiste', icon: AlertCircle },
];

const DoctorRegistrationView: React.FC<DoctorRegistrationViewProps> = ({ onNavigate, onRegister }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    specialty: 'Médecin Généraliste',
    category: 'generaliste' as Doctor['category'],
    phone: '',
    neighborhood: '',
    experience: '5',
    licenseNumber: '',
    avatar: ''
  });

  // Payment states
  const [subPlan, setSubPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedProvider, setSelectedProvider] = useState<'AIRTEL' | 'MOOV'>('AIRTEL');
  const [payPhone, setPayPhone] = useState('');
  const [showUssd, setShowUssd] = useState(false);

  const handleNext = () => setStep(step + 1);
  const handleBack = () => step > 1 ? setStep(step - 1) : onNavigate('doctors');

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
    
    setTimeout(async () => {
      const newDoctor: Doctor = {
        id: 'doc-' + Math.random().toString(36).substr(2, 5),
        name: formData.name,
        specialty: formData.specialty,
        category: formData.category,
        rating: 5.0,
        distance: 0,
        isVerified: true,
        avatar: formData.avatar || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?fit=crop&w=150&h=150',
        neighborhood: formData.neighborhood,
        experience: parseInt(formData.experience),
        availability: 'disponible',
        licenseNumber: formData.licenseNumber
      };

      try {
        await dbService.pushData('doctors', newDoctor);
        // Also keep the legacy API call for now if needed, but Firebase is primary
        await fetch('/api/doctors/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newDoctor)
        });
      } catch (e) {
        console.error("Failed to sync doctor to DB", e);
      }

      setIsSubmitting(false);
      onRegister(newDoctor);
    }, 2500);
  };

  return (
    <div className="p-6 space-y-6 animate-in slide-in-from-right-4 duration-300 h-full flex flex-col bg-slate-50/50">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
      
      <div className="flex items-center gap-4">
        <button onClick={handleBack} className="p-3 bg-white rounded-full shadow-sm">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div className="flex-1">
          <h2 className="text-2xl font-black text-slate-800 leading-tight tracking-tighter uppercase">Expert Médical</h2>
          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Enrôlement Professionnel</p>
        </div>
        <div className="flex items-center gap-1">
          {[1, 2, 3].map(i => (
            <div key={i} className={`w-2 h-2 rounded-full ${step >= i ? 'bg-emerald-600' : 'bg-slate-200'}`} />
          ))}
        </div>
      </div>

      {isSubmitting ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-6">
          <div className="relative">
            <Loader2 className="w-16 h-16 text-emerald-500 animate-spin" />
            <ShieldCheck className="w-6 h-6 text-emerald-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="text-center space-y-2">
            <p className="text-sm font-black text-slate-800 uppercase tracking-widest">Vérification de l'ordre...</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Validation de votre licence en cours</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 space-y-8 overflow-y-auto px-1 hide-scrollbar">
          {step === 1 && (
            <div className="space-y-8 animate-in slide-in-from-right-4">
              <div className="flex flex-col items-center gap-4">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 bg-white rounded-[2rem] shadow-xl border-4 border-white flex items-center justify-center overflow-hidden cursor-pointer group relative"
                >
                  {formData.avatar ? (
                    <img src={formData.avatar} className="w-full h-full object-cover" alt="Avatar" />
                  ) : (
                    <User className="w-10 h-10 text-slate-200" />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Photo de profil</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Identité</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nom complet (ex: Dr. Marc Obiang)"
                    className="w-full p-5 bg-white border border-slate-100 rounded-2xl font-bold outline-none shadow-sm focus:border-emerald-500 text-slate-900"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Spécialité</label>
                  <div className="grid grid-cols-2 gap-2">
                    {SPECIALTIES.map((spec) => (
                      <button
                        key={spec.id}
                        onClick={() => setFormData({ ...formData, category: spec.id as any, specialty: spec.label })}
                        className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                          formData.category === spec.id 
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-200' 
                            : 'bg-white border-slate-100 text-slate-600 hover:border-emerald-200'
                        }`}
                      >
                        <spec.icon className="w-5 h-5" />
                        <span className="text-[9px] font-black uppercase tracking-tighter text-center leading-tight">{spec.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in slide-in-from-right-4">
              <div className="bg-emerald-50 p-6 rounded-[2.5rem] border border-emerald-100 flex items-start gap-4 shadow-sm">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                  <Award className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-900 text-sm">Qualifications</h4>
                  <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider mt-1">Identité professionnelle et numéro d'exercice.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">N° d'Ordre</label>
                  <input
                    type="text"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    placeholder="N° d'Ordre des Médecins"
                    className="w-full p-5 bg-white border border-slate-100 rounded-2xl font-bold outline-none shadow-sm focus:border-emerald-500 text-slate-900"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Années d'expérience</label>
                  <input
                    type="number"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    placeholder="Années d'expérience"
                    className="w-full p-5 bg-white border border-slate-100 rounded-2xl font-bold outline-none shadow-sm focus:border-emerald-500 text-slate-900"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Localisation</label>
                  <input
                    type="text"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    placeholder="Quartier du Cabinet"
                    className="w-full p-5 bg-white border border-slate-100 rounded-2xl font-bold outline-none shadow-sm focus:border-emerald-500 text-slate-900"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Contact</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Téléphone Professionnel"
                    className="w-full p-5 bg-white border border-slate-100 rounded-2xl font-bold outline-none shadow-sm focus:border-emerald-500 text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in slide-in-from-right-4">
              <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white space-y-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <h4 className="text-2xl font-black tracking-tight">Abonnement Pro</h4>
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mt-1">Visibilité prioritaire & Téléconsultation</p>
                  </div>
                  <Crown className="w-8 h-8 text-amber-400" />
                </div>

                <div className="flex gap-2 p-1 bg-white/5 rounded-2xl relative z-10">
                  <button 
                    onClick={() => setSubPlan('monthly')}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${subPlan === 'monthly' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400'}`}
                  >
                    Mensuel
                  </button>
                  <button 
                    onClick={() => setSubPlan('yearly')}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${subPlan === 'yearly' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400'}`}
                  >
                    Annuel (-20%)
                  </button>
                </div>

                <div className="space-y-2 relative z-10">
                  <div className="flex justify-between items-end">
                    <p className="text-4xl font-black">{subPlan === 'monthly' ? '15.000' : '144.000'} F</p>
                    <p className="text-xs font-bold text-slate-400 mb-1">/ {subPlan === 'monthly' ? 'mois' : 'an'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Mode de paiement</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setSelectedProvider('AIRTEL')}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${selectedProvider === 'AIRTEL' ? 'border-red-500 bg-red-50' : 'border-slate-100 bg-white opacity-60'}`}
                  >
                    <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white font-black text-xs">A</div>
                    <span className="text-[10px] font-black uppercase">Airtel Money</span>
                  </button>
                  <button 
                    onClick={() => setSelectedProvider('MOOV')}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${selectedProvider === 'MOOV' ? 'border-blue-500 bg-blue-50' : 'border-slate-100 bg-white opacity-60'}`}
                  >
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xs">M</div>
                    <span className="text-[10px] font-black uppercase">Moov Money</span>
                  </button>
                </div>

                <input
                  type="tel"
                  value={payPhone}
                  onChange={(e) => setPayPhone(e.target.value)}
                  placeholder="Numéro de paiement"
                  className="w-full p-5 bg-white border border-slate-100 rounded-2xl font-bold outline-none shadow-sm focus:border-emerald-500 text-slate-900"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {!isSubmitting && (
        <div className="pt-4 flex gap-3">
          <button onClick={handleBack} className="flex-1 py-5 bg-white border border-slate-100 text-slate-500 rounded-2xl font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all">Retour</button>
          <button
            onClick={step === 3 ? handlePayment : handleNext}
            disabled={step === 1 ? !formData.name : step === 2 ? (!formData.licenseNumber || !formData.phone) : !payPhone}
            className="flex-[2] py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-emerald-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 transition-all"
          >
            {step < 3 ? 'Suivant' : 'Payer & S\'enregistrer'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* USSD Simulation Overlay */}
      {showUssd && (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-6">
          <div className="w-full max-w-sm bg-white rounded-[3rem] p-8 space-y-8 animate-in zoom-in-95 duration-300 shadow-2xl">
            <div className="w-20 h-20 bg-emerald-100 rounded-[2rem] flex items-center justify-center mx-auto">
              <Smartphone className="w-10 h-10 text-emerald-600 animate-bounce" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Validation USSD</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Composez le <span className="font-black text-slate-900">*150#</span> ou validez la notification sur votre téléphone pour confirmer le paiement de <span className="font-black text-emerald-600">{subPlan === 'monthly' ? '15.000' : '144.000'} F</span>.
              </p>
            </div>
            <button 
              onClick={finalizeRegistration}
              className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-emerald-200 active:scale-95 transition-all"
            >
              J'ai validé le paiement
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorRegistrationView;


