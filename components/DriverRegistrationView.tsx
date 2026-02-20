
import React, { useState } from 'react';
import { ArrowLeft, User, Car, Users, CheckCircle, Smartphone, Truck, Bike, ShieldCheck, ChevronRight, Wind, Copy, CheckCircle2, Crown, CreditCard, Loader2, Phone } from 'lucide-react';
import { ViewState, TransportType, DriverRegistration } from '../types';

interface DriverRegistrationViewProps {
  onNavigate: (view: ViewState) => void;
  onRegister: (data: DriverRegistration) => void;
}

const DriverRegistrationView: React.FC<DriverRegistrationViewProps> = ({ onNavigate, onRegister }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [generatedNS, setGeneratedNS] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Subscription States
  const [subPlan, setSubPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedProvider, setSelectedProvider] = useState<'AIRTEL' | 'MOOV'>('AIRTEL');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showUssd, setShowUssd] = useState(false);

  const [formData, setFormData] = useState<DriverRegistration>({
    firstName: '',
    lastName: '',
    vehicleType: TransportType.TAXI,
    seats: 4,
    hasAC: true,
    plate: '',
    color: 'Jaune'
  });

  const handleNext = () => setStep(step + 1);
  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else onNavigate('home');
  };

  const handlePayment = () => {
    if (phoneNumber.length < 8) return;
    setShowUssd(true);
  };

  const confirmPayment = () => {
    setShowUssd(false);
    setIsSubmitting(true);
    setTimeout(() => {
      const ns = 'NS-' + Math.floor(1000 + Math.random() * 9000);
      setGeneratedNS(ns);
      setIsSubmitting(false);
      setShowSuccess(true);
    }, 2500);
  };

  if (showSuccess) {
    return (
      <div className="p-8 h-full flex flex-col items-center justify-center text-center space-y-8 animate-in zoom-in-95 duration-500 bg-slate-50">
        <div className="space-y-2">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner mb-4">
             <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-none uppercase">Badge Activé !</h2>
          <p className="text-sm text-slate-500 font-medium px-4">
            Abonnement {subPlan === 'monthly' ? 'Mensuel' : 'Annuel'} confirmé. Bienvenue, <span className="text-emerald-600 font-bold">{formData.firstName}</span>.
          </p>
        </div>

        <div className="w-full space-y-4 animate-in slide-in-from-bottom-6 duration-700 delay-200">
           <div className="bg-amber-400 p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(251,191,36,0.3)] border-[6px] border-slate-900 relative overflow-hidden group">
              <div className="absolute top-0 right-0 bg-slate-900 text-white px-4 py-1.5 rounded-bl-2xl font-black text-[9px] uppercase tracking-widest">OFFICIEL NDJELE</div>
              <p className="text-slate-900 font-black text-[10px] uppercase tracking-[0.3em] mb-4 opacity-80 text-center">VOTRE NUMÉRO DE PORTIÈRE</p>
              <h1 className="text-8xl font-black text-slate-900 tracking-tighter mb-2 drop-shadow-lg">{generatedNS}</h1>
           </div>
        </div>

        <button 
          onClick={() => onRegister({ ...formData, nsNumber: generatedNS })}
          className="w-full py-5 bg-slate-900 text-white rounded-[2.2rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          Ouvrir mon tableau de bord <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-in slide-in-from-right-4 duration-300 h-full flex flex-col bg-slate-50/50 relative">
      {showUssd && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="w-full max-w-[280px] bg-[#dfdfdf] rounded-xl overflow-hidden shadow-2xl border border-white/20">
            <div className="p-5 text-center space-y-4">
              <p className="text-sm font-mono text-black leading-tight">
                {selectedProvider} MONEY:<br/>
                Payer {subPlan === 'monthly' ? '5 000' : '50 000'} F à NDJELE ?<br/>
                Entrez votre code secret :
              </p>
              <input type="password" maxLength={4} placeholder="****" className="w-full bg-white border border-slate-400 p-2 text-center font-mono text-xl tracking-widest text-black outline-none" />
            </div>
            <div className="grid grid-cols-2 border-t border-slate-400">
              <button onClick={() => setShowUssd(false)} className="py-3 font-mono text-blue-600 border-r border-slate-400 active:bg-slate-300">Annuler</button>
              <button onClick={confirmPayment} className="py-3 font-mono text-blue-600 font-bold active:bg-slate-300">Confirmer</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        <button onClick={handleBack} className="p-3 bg-white rounded-full shadow-sm">
          <ArrowLeft className="w-6 h-6 text-slate-700" />
        </button>
        <div className="flex-1">
           <h2 className="text-2xl font-black text-slate-800 leading-tight">Chauffeur NS</h2>
           <div className="flex gap-1.5 mt-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${step === i ? 'flex-[3] bg-amber-500' : step > i ? 'flex-1 bg-emerald-500' : 'flex-1 bg-slate-200'}`}></div>
              ))}
           </div>
        </div>
      </div>

      <div className="flex-1 space-y-8 overflow-y-auto px-1">
        {step === 1 && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
            <div className="bg-amber-50 p-6 rounded-[2.5rem] border border-amber-100 flex items-start gap-4">
              <User className="w-6 h-6 text-amber-600 shrink-0" />
              <div>
                <h4 className="font-bold text-amber-900">Identité</h4>
                <p className="text-[10px] text-amber-700 font-bold uppercase tracking-wider mt-1">Informations civiles obligatoires.</p>
              </div>
            </div>
            <div className="space-y-4">
              <input type="text" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} placeholder="Prénom" className="w-full p-5 bg-white border border-slate-100 rounded-[1.5rem] font-bold outline-none" />
              <input type="text" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} placeholder="Nom de famille" className="w-full p-5 bg-white border border-slate-100 rounded-[1.5rem] font-bold outline-none" />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
            <div className="bg-blue-50 p-6 rounded-[2.5rem] border border-blue-100 flex items-start gap-4">
              <Car className="w-6 h-6 text-blue-600 shrink-0" />
              <div>
                <h4 className="font-bold text-blue-900">Spécifications</h4>
                <p className="text-[10px] text-blue-700 font-bold uppercase tracking-wider mt-1">Votre véhicule de transport.</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: TransportType.TAXI, label: 'Taxi', icon: Car },
                { id: TransportType.MOTO, label: 'Moto', icon: Bike },
                { id: TransportType.CLANDO, label: 'Clando', icon: Truck },
              ].map(t => (
                <button key={t.id} onClick={() => setFormData({...formData, vehicleType: t.id})} className={`p-4 rounded-3xl border-2 flex flex-col items-center gap-2 transition-all ${formData.vehicleType === t.id ? 'border-blue-500 bg-blue-50 text-blue-600' : 'bg-white border-slate-50 text-slate-400'}`}>
                  <t.icon className="w-6 h-6" />
                  <span className="text-[9px] font-black uppercase">{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
            <div className="bg-slate-900 p-6 rounded-[2.5rem] text-white flex items-start gap-4 shadow-xl">
              <Smartphone className="w-6 h-6 text-amber-500 shrink-0" />
              <div>
                <h4 className="font-bold">Identification Visuelle</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Le matricule pour la maraude digitale.</p>
              </div>
            </div>
            <div className="space-y-4">
               <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Numéro de Matricule</label>
               <input type="text" value={formData.plate} onChange={(e) => setFormData({...formData, plate: e.target.value.toUpperCase()})} placeholder="GA-000-TX" className="w-full p-6 bg-white border border-slate-100 rounded-[2rem] font-black text-3xl tracking-[0.2em] text-center outline-none focus:border-amber-500" />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-in slide-in-from-bottom-10">
            <div className="bg-amber-500 p-6 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
               <div className="relative z-10 flex items-center gap-4">
                  <Crown className="w-12 h-12 fill-white" />
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tighter">Activation Pro</h3>
                    <p className="text-xs font-bold opacity-80 uppercase tracking-widest">Abonnement Obligatoire</p>
                  </div>
               </div>
               <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
               <button onClick={() => setSubPlan('monthly')} className={`p-5 rounded-3xl border-2 flex flex-col items-center gap-1 transition-all ${subPlan === 'monthly' ? 'border-amber-500 bg-white shadow-md scale-105' : 'border-slate-100 bg-slate-50'}`}>
                  <span className="text-[9px] font-black text-slate-400 uppercase">Mensuel</span>
                  <span className="text-lg font-black text-slate-800">5 000 F</span>
               </button>
               <button onClick={() => setSubPlan('yearly')} className={`p-5 rounded-3xl border-2 flex flex-col items-center gap-1 transition-all relative ${subPlan === 'yearly' ? 'border-amber-500 bg-white shadow-md scale-105' : 'border-slate-100 bg-slate-50'}`}>
                  <span className="absolute -top-2 bg-emerald-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase">-2 Mois</span>
                  <span className="text-[9px] font-black text-slate-400 uppercase">Annuel</span>
                  <span className="text-lg font-black text-slate-800">50 000 F</span>
               </button>
            </div>

            <div className="bg-white border border-slate-100 p-6 rounded-[2.5rem] space-y-6">
               <div className="flex gap-3">
                  <button onClick={() => setSelectedProvider('AIRTEL')} className={`flex-1 py-3 rounded-2xl border-2 font-black text-[10px] uppercase ${selectedProvider === 'AIRTEL' ? 'border-red-500 bg-red-50 text-red-600' : 'border-slate-50'}`}>Airtel</button>
                  <button onClick={() => setSelectedProvider('MOOV')} className={`flex-1 py-3 rounded-2xl border-2 font-black text-[10px] uppercase ${selectedProvider === 'MOOV' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-50'}`}>Moov</button>
               </div>
               <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="074..." className="w-full pl-11 pr-4 py-4 bg-slate-50 rounded-2xl font-bold outline-none focus:bg-white" />
               </div>
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 flex gap-3">
         {step < 4 ? (
           <>
             <button onClick={handleBack} className="flex-1 py-5 bg-white border border-slate-100 text-slate-500 rounded-3xl font-bold">Retour</button>
             <button onClick={handleNext} disabled={ (step === 1 && !formData.firstName) || (step === 3 && !formData.plate) } className="flex-[2] py-5 bg-slate-900 text-white rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl disabled:opacity-50">Suivant</button>
           </>
         ) : (
           <button onClick={handlePayment} disabled={phoneNumber.length < 8 || isSubmitting} className="w-full py-6 gradient-primary text-white rounded-[2.5rem] font-black uppercase text-xs tracking-widest shadow-xl flex items-center justify-center gap-3">
             {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <><CreditCard className="w-6 h-6" /> Payer & Activer mon Badge</>}
           </button>
         )}
      </div>
    </div>
  );
};

export default DriverRegistrationView;
