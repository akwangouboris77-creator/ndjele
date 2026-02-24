
import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, User, Car, Users, CheckCircle, Smartphone, Truck, Bike, 
  ShieldCheck, ChevronRight, Wind, Copy, CheckCircle2, Crown, CreditCard, 
  Loader2, Phone, Camera, FileText, Upload, AlertCircle, MapPin
} from 'lucide-react';
import { ViewState, TransportType, DriverRegistration } from '../types';
import { dbService } from '../src/services/dbService';

interface DriverRegistrationViewProps {
  onNavigate: (view: ViewState) => void;
  onRegister: (data: DriverRegistration) => void;
}

const DriverRegistrationView: React.FC<DriverRegistrationViewProps> = ({ onNavigate, onRegister }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [generatedNS, setGeneratedNS] = useState('');
  
  const profilePhotoRef = useRef<HTMLInputElement>(null);
  const vehiclePhotoRef = useRef<HTMLInputElement>(null);
  const licensePhotoRef = useRef<HTMLInputElement>(null);

  // Subscription States
  const [subPlan, setSubPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedProvider, setSelectedProvider] = useState<'AIRTEL' | 'MOOV'>('AIRTEL');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showUssd, setShowUssd] = useState(false);

  const [formData, setFormData] = useState<DriverRegistration & { profilePhoto?: string, vehiclePhoto?: string, licensePhoto?: string }>({
    firstName: '',
    lastName: '',
    vehicleType: TransportType.TAXI,
    seats: 4,
    hasAC: true,
    plate: '',
    color: 'Jaune',
    profilePhoto: '',
    vehiclePhoto: '',
    licensePhoto: ''
  });

  const handleNext = () => {
    if (step === 4) setStep(5); // Go to Review
    else if (step === 5) setStep(6); // Go to Payment
    else setStep(step + 1);
  };
  
  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else onNavigate('home');
  };

  const handleFileChange = (type: 'profile' | 'vehicle' | 'license') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [`${type}Photo`]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const isValidGabonNumber = (num: string) => {
    const regex = /^0[167][0-9]{7}$/;
    return regex.test(num);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 9);
    setPhoneNumber(val);
  };

  const handlePayment = () => {
    if (!isValidGabonNumber(phoneNumber)) return;
    setShowUssd(true);
  };

  const confirmPayment = () => {
    setShowUssd(false);
    setIsSubmitting(true);
    setTimeout(async () => {
      const ns = 'NS-' + Math.floor(1000 + Math.random() * 9000);
      setGeneratedNS(ns);
      
      const driverData = { ...formData, nsNumber: ns, id: 'dr-' + Math.random().toString(36).substr(2, 5) };
      
      try {
        await dbService.pushData('drivers', driverData);
        await fetch('/api/drivers/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(driverData)
        });
      } catch (e) {
        console.error("Failed to sync driver to DB", e);
      }

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
      <input type="file" ref={profilePhotoRef} onChange={handleFileChange('profile')} accept="image/*" className="hidden" />
      <input type="file" ref={vehiclePhotoRef} onChange={handleFileChange('vehicle')} accept="image/*" className="hidden" />
      <input type="file" ref={licensePhotoRef} onChange={handleFileChange('license')} accept="image/*" className="hidden" />

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
           <h2 className="text-2xl font-black text-slate-800 leading-tight tracking-tighter uppercase">Chauffeur NS</h2>
           <div className="flex gap-1.5 mt-2">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${step === i ? 'flex-[3] bg-amber-500' : step > i ? 'flex-1 bg-emerald-500' : 'flex-1 bg-slate-200'}`}></div>
              ))}
           </div>
        </div>
      </div>

      <div className="flex-1 space-y-8 overflow-y-auto px-1 hide-scrollbar">
        {step === 1 && (
          <div className="space-y-8 animate-in slide-in-from-right-4">
            <div className="flex flex-col items-center gap-4">
              <div 
                onClick={() => profilePhotoRef.current?.click()}
                className="w-28 h-28 bg-white rounded-[2.5rem] shadow-xl border-4 border-white flex items-center justify-center overflow-hidden cursor-pointer group relative"
              >
                {formData.profilePhoto ? (
                  <img src={formData.profilePhoto} className="w-full h-full object-cover" alt="Profile" />
                ) : (
                  <User className="w-12 h-12 text-slate-200" />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Photo de profil</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Identité</label>
                <input type="text" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} placeholder="Prénom" className="w-full p-5 bg-white border border-slate-100 rounded-[1.5rem] font-bold outline-none text-slate-900 shadow-sm focus:border-amber-500" />
                <input type="text" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} placeholder="Nom de famille" className="w-full p-5 bg-white border border-slate-100 rounded-[1.5rem] font-bold outline-none text-slate-900 shadow-sm focus:border-amber-500" />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in slide-in-from-right-4">
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
                <button key={t.id} onClick={() => setFormData({...formData, vehicleType: t.id})} className={`p-4 rounded-3xl border-2 flex flex-col items-center gap-2 transition-all ${formData.vehicleType === t.id ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-lg shadow-blue-100' : 'bg-white border-slate-50 text-slate-400'}`}>
                  <t.icon className="w-6 h-6" />
                  <span className="text-[9px] font-black uppercase">{t.label}</span>
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Détails Véhicule</label>
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})} placeholder="Couleur" className="w-full p-5 bg-white border border-slate-100 rounded-2xl font-bold outline-none text-slate-900" />
                  <input type="number" value={formData.seats} onChange={(e) => setFormData({...formData, seats: parseInt(e.target.value)})} placeholder="Places" className="w-full p-5 bg-white border border-slate-100 rounded-2xl font-bold outline-none text-slate-900" />
                </div>
              </div>
              
              <button 
                onClick={() => setFormData({...formData, hasAC: !formData.hasAC})}
                className={`w-full p-5 rounded-2xl border-2 flex items-center justify-between transition-all ${formData.hasAC ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-100 bg-white text-slate-400'}`}
              >
                <div className="flex items-center gap-3">
                  <Wind className="w-5 h-5" />
                  <span className="font-bold text-sm">Climatisation (AC)</span>
                </div>
                {formData.hasAC && <CheckCircle2 className="w-5 h-5" />}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-in slide-in-from-right-4">
            <div className="bg-slate-900 p-6 rounded-[2.5rem] text-white flex items-start gap-4 shadow-xl">
              <Smartphone className="w-6 h-6 text-amber-500 shrink-0" />
              <div>
                <h4 className="font-bold">Identification Visuelle</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Le matricule pour la maraude digitale.</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Numéro de Matricule</label>
                <input type="text" value={formData.plate} onChange={(e) => setFormData({...formData, plate: e.target.value.toUpperCase()})} placeholder="GA-000-TX" className="w-full p-6 bg-white border border-slate-100 rounded-[2rem] font-black text-3xl tracking-[0.2em] text-center outline-none focus:border-amber-500 shadow-sm" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Photo du Véhicule</label>
                <div 
                  onClick={() => vehiclePhotoRef.current?.click()}
                  className="w-full aspect-video bg-white rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-3 overflow-hidden cursor-pointer group hover:border-amber-500 transition-all"
                >
                  {formData.vehiclePhoto ? (
                    <img src={formData.vehiclePhoto} className="w-full h-full object-cover" alt="Vehicle" />
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6" />
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Prendre une photo du véhicule</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-8 animate-in slide-in-from-right-4">
            <div className="bg-indigo-50 p-6 rounded-[2.5rem] border border-indigo-100 flex items-start gap-4">
              <FileText className="w-6 h-6 text-indigo-600 shrink-0" />
              <div>
                <h4 className="font-bold text-indigo-900">Documents Légaux</h4>
                <p className="text-[10px] text-indigo-700 font-bold uppercase tracking-wider mt-1">Permis de conduire & Assurance.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div 
                onClick={() => licensePhotoRef.current?.click()}
                className="p-6 bg-white rounded-[2rem] border-2 border-dashed border-slate-200 flex items-center gap-4 cursor-pointer hover:border-indigo-500 transition-all"
              >
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                  {formData.licensePhoto ? <CheckCircle2 className="w-6 h-6" /> : <Camera className="w-6 h-6" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-800">Permis de conduire</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{formData.licensePhoto ? 'Document chargé' : 'Cliquer pour scanner'}</p>
                </div>
              </div>

              <div className="p-6 bg-white rounded-[2rem] border-2 border-dashed border-slate-200 flex items-center gap-4 opacity-50">
                <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-800">Assurance & Carte Grise</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Optionnel pour l'instant</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center gap-4 border-b border-slate-50 pb-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-slate-100">
                  <img src={formData.profilePhoto || 'https://images.unsplash.com/photo-1590086782792-42dd2350140d?fit=crop&w=150&h=150'} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900">{formData.firstName} {formData.lastName}</h4>
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Candidat Chauffeur NS</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Véhicule</span>
                  <span className="text-xs font-bold text-slate-800">{formData.vehicleType} - {formData.color}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Matricule</span>
                  <span className="text-xs font-black text-slate-900 tracking-widest">{formData.plate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Capacité</span>
                  <span className="text-xs font-bold text-slate-800">{formData.seats} Places</span>
                </div>
              </div>

              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
                <p className="text-[9px] text-amber-800 font-bold uppercase tracking-tight">Vérification des antécédents en cours...</p>
              </div>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-6 animate-in slide-in-from-bottom-10">
            <div className="bg-amber-500 p-8 rounded-[3rem] text-white shadow-xl relative overflow-hidden">
               <div className="relative z-10 flex items-center gap-6">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-[1.5rem] flex items-center justify-center">
                    <Crown className="w-10 h-10 fill-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter">Activation Pro</h3>
                    <p className="text-xs font-bold opacity-80 uppercase tracking-widest">Badge digital & Visibilité</p>
                  </div>
               </div>
               <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <button onClick={() => setSubPlan('monthly')} className={`p-6 rounded-[2.5rem] border-2 flex flex-col items-center gap-1 transition-all ${subPlan === 'monthly' ? 'border-amber-500 bg-white shadow-xl scale-105' : 'border-slate-100 bg-slate-50'}`}>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mensuel</span>
                  <span className="text-xl font-black text-slate-800">5 000 F</span>
               </button>
               <button onClick={() => setSubPlan('yearly')} className={`p-6 rounded-[2.5rem] border-2 flex flex-col items-center gap-1 transition-all relative ${subPlan === 'yearly' ? 'border-amber-500 bg-white shadow-xl scale-105' : 'border-slate-100 bg-slate-50'}`}>
                  <span className="absolute -top-3 bg-emerald-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase shadow-lg">-2 Mois</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Annuel</span>
                  <span className="text-xl font-black text-slate-800">50 000 F</span>
               </button>
            </div>

            <div className="bg-white border border-slate-100 p-8 rounded-[3rem] space-y-6 shadow-sm">
               <div className="flex gap-3">
                  <button onClick={() => setSelectedProvider('AIRTEL')} className={`flex-1 py-4 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest transition-all ${selectedProvider === 'AIRTEL' ? 'border-red-500 bg-red-50 text-red-600' : 'border-slate-50 text-slate-400'}`}>Airtel</button>
                  <button onClick={() => setSelectedProvider('MOOV')} className={`flex-1 py-4 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest transition-all ${selectedProvider === 'MOOV' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-50 text-slate-400'}`}>Moov</button>
               </div>
               <div className="relative">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                  <input type="tel" value={phoneNumber} onChange={handlePhoneChange} placeholder="074..." className="w-full pl-14 pr-6 py-5 bg-slate-50 rounded-2xl font-black text-lg outline-none focus:bg-white text-slate-900 transition-all" />
               </div>
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 flex gap-3">
         {step < 6 ? (
           <>
             <button onClick={handleBack} className="flex-1 py-5 bg-white border border-slate-100 text-slate-500 rounded-[2rem] font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all">Retour</button>
             <button onClick={handleNext} disabled={ (step === 1 && !formData.firstName) || (step === 3 && !formData.plate) } className="flex-[2] py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-[10px] tracking-widest shadow-xl shadow-slate-200 disabled:opacity-50 active:scale-95 transition-all">Suivant</button>
           </>
         ) : (
           <button onClick={handlePayment} disabled={phoneNumber.length < 8 || isSubmitting} className="w-full py-6 gradient-primary text-white rounded-[2.5rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-emerald-200 flex items-center justify-center gap-3 active:scale-95 transition-all">
             {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <><CreditCard className="w-6 h-6" /> Payer & Activer mon Badge</>}
           </button>
         )}
      </div>
    </div>
  );
};

export default DriverRegistrationView;
