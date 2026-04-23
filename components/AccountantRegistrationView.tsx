
import React, { useState } from 'react';
import { ArrowLeft, User, ShieldCheck, Phone, MapPin, ChevronRight, Loader2, Award, Calculator } from 'lucide-react';
import { ViewState, Accountant } from '../types';
import { dbService } from '../src/services/dbService';

interface AccountantRegistrationViewProps {
  onNavigate: (view: ViewState) => void;
  onRegister: (accountant: Accountant) => void;
}

const AccountantRegistrationView: React.FC<AccountantRegistrationViewProps> = ({ onNavigate, onRegister }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    firm: '',
    specialty: 'Expertise Comptable',
    phone: '',
    neighborhood: '',
    licenseNumber: '',
    avatar: ''
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const finalizeRegistration = () => {
    setIsSubmitting(true);
    setTimeout(async () => {
      const newAccountant: Accountant = {
        id: 'acc-' + Math.random().toString(36).substr(2, 5),
        name: `Me. ${formData.firstName} ${formData.lastName}`,
        firm: formData.firm,
        specialty: formData.specialty,
        phone: formData.phone,
        rating: 5.0,
        neighborhood: formData.neighborhood,
        experience: 0,
        avatar: formData.avatar || 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?fit=crop&w=150&h=150',
        isVerified: true,
        licenseNumber: formData.licenseNumber
      };

      try {
        await dbService.pushData('accountants', newAccountant);
      } catch (e) {
        console.error("Firebase Accountant Error:", e);
      }

      setIsSubmitting(false);
      onRegister(newAccountant);
    }, 2500);
  };

  return (
    <div className="p-6 space-y-6 animate-in slide-in-from-right-4 duration-300 h-full flex flex-col bg-slate-50/50">
      <div className="flex items-center gap-4">
        <button onClick={() => onNavigate('home')} className="p-3 bg-white rounded-full shadow-sm active:scale-95 transition-all">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div className="flex-1">
          <h2 className="text-2xl font-black text-slate-800 leading-tight">Enrôlement Comptable</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expertise & Conseil Maraude</p>
        </div>
      </div>

      {isSubmitting ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-6">
          <Loader2 className="w-12 h-12 text-slate-900 animate-spin" />
          <p className="text-sm font-black text-slate-800 uppercase tracking-widest">Validation du cabinet...</p>
        </div>
      ) : (
        <div className="flex-1 space-y-8 overflow-y-auto px-1">
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="bg-slate-900 p-6 rounded-[2.5rem] text-white flex items-start gap-4 shadow-xl">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Identité Professionnelle</h4>
                  <p className="text-[10px] text-white/60 font-bold uppercase tracking-wider mt-1">Vos informations d'expert.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col items-center gap-4 mb-6">
                  <div className="w-24 h-24 bg-white rounded-[2rem] border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden relative group">
                    {formData.avatar ? (
                      <img src={formData.avatar} className="w-full h-full object-cover" alt="Avatar" />
                    ) : (
                      <User className="w-8 h-8 text-slate-300" />
                    )}
                    <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">Photo de profil (Recommandé)</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="Prénom"
                    className="w-full p-5 bg-white border border-slate-100 rounded-2xl font-bold outline-none shadow-sm focus:border-slate-900 text-slate-900"
                  />
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Nom"
                    className="w-full p-5 bg-white border border-slate-100 rounded-2xl font-bold outline-none shadow-sm focus:border-slate-900 text-slate-900"
                  />
                </div>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Numéro de téléphone"
                  className="w-full p-5 bg-white border border-slate-100 rounded-2xl font-bold outline-none shadow-sm focus:border-slate-900 text-slate-900"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="bg-slate-800 p-6 rounded-[2.5rem] text-white flex items-start gap-4 shadow-xl">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                  <Calculator className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Cabinet & Spécialité</h4>
                  <p className="text-[10px] text-white/60 font-bold uppercase tracking-wider mt-1">Détails de votre structure.</p>
                </div>
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  value={formData.firm}
                  onChange={(e) => setFormData({ ...formData, firm: e.target.value })}
                  placeholder="Nom du Cabinet Comptable"
                  className="w-full p-5 bg-white border border-slate-100 rounded-2xl font-bold outline-none shadow-sm focus:border-slate-900 text-slate-900"
                />
                <select
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  className="w-full p-5 bg-white border border-slate-100 rounded-2xl font-bold outline-none shadow-sm focus:border-slate-900 text-slate-900"
                >
                  <option value="Expertise Comptable">Expertise Comptable</option>
                  <option value="Audit & Commissariat">Audit & Commissariat</option>
                  <option value="Conseil Fiscal">Conseil Fiscal</option>
                  <option value="Gestion Sociale">Gestion Sociale</option>
                </select>
                <input
                  type="text"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  placeholder="N° d'Inscription à l'Ordre"
                  className="w-full p-5 bg-white border border-slate-100 rounded-2xl font-bold outline-none shadow-sm focus:border-slate-900 text-slate-900"
                />
                <input
                  type="text"
                  value={formData.neighborhood}
                  onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                  placeholder="Quartier du Cabinet"
                  className="w-full p-5 bg-white border border-slate-100 rounded-2xl font-bold outline-none shadow-sm focus:border-slate-900 text-slate-900"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {!isSubmitting && (
        <div className="pt-4 flex gap-3">
          <button onClick={() => step > 1 ? setStep(step - 1) : onNavigate('home')} className="flex-1 py-4 bg-white border border-slate-100 text-slate-500 rounded-2xl font-bold">Retour</button>
          <button
            onClick={() => step < 2 ? setStep(step + 1) : finalizeRegistration()}
            disabled={step === 1 ? (!formData.firstName || !formData.lastName || !formData.phone) : (!formData.firm || !formData.licenseNumber)}
            className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {step < 2 ? 'Suivant' : 'S\'enregistrer'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountantRegistrationView;
