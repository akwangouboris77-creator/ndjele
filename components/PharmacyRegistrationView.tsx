
import React, { useState } from 'react';
import { ArrowLeft, User, Pill, Phone, MapPin, ChevronRight, ShieldCheck, Loader2, Award, Clock } from 'lucide-react';
import { ViewState, Pharmacy } from '../types';

interface PharmacyRegistrationViewProps {
  onNavigate: (view: ViewState) => void;
  onRegister: (pharmacy: Pharmacy) => void;
}

const PharmacyRegistrationView: React.FC<PharmacyRegistrationViewProps> = ({ onNavigate, onRegister }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    pharmacistName: '',
    pharmacyName: '',
    phone: '',
    neighborhood: '',
    licenseNumber: '',
    isOpen24h: false
  });

  const handleNext = () => setStep(step + 1);
  const handleBack = () => step > 1 ? setStep(step - 1) : onNavigate('pharmacies');

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const newPharmacy: Pharmacy = {
        id: 'ph-' + Math.random().toString(36).substr(2, 5),
        name: formData.pharmacyName,
        neighborhood: formData.neighborhood,
        phone: formData.phone,
        isOpen24h: formData.isOpen24h,
        isVerified: true,
        rating: 5.0
      };
      setIsSubmitting(false);
      onRegister(newPharmacy);
    }, 2000);
  };

  return (
    <div className="p-6 space-y-6 animate-in slide-in-from-right-4 duration-300 h-full flex flex-col bg-slate-50/50">
      <div className="flex items-center gap-4">
        <button onClick={handleBack} className="p-3 bg-white rounded-full shadow-sm active:scale-95 transition-all">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div className="flex-1">
          <h2 className="text-2xl font-black text-slate-800 leading-tight">Officine NS</h2>
          <p className="text-[10px] font-black text-pink-600 uppercase tracking-widest">Enrôlement Santé</p>
        </div>
      </div>

      {isSubmitting ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-6">
          <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
          <p className="text-sm font-black text-slate-800 uppercase tracking-widest">Validation de l'officine...</p>
        </div>
      ) : (
        <div className="flex-1 space-y-8 overflow-y-auto px-1">
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="bg-pink-50 p-6 rounded-[2.5rem] border border-pink-100 flex items-start gap-4 shadow-sm">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                  <User className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <h4 className="font-bold text-pink-900 text-sm">Titulaire</h4>
                  <p className="text-[10px] text-pink-700 font-bold uppercase tracking-wider mt-1">Identité du pharmacien responsable.</p>
                </div>
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  value={formData.pharmacistName}
                  onChange={(e) => setFormData({ ...formData, pharmacistName: e.target.value })}
                  placeholder="Nom du Pharmacien Titulaire"
                  className="w-full p-5 bg-white border border-slate-100 rounded-2xl font-bold outline-none shadow-sm focus:border-pink-500"
                />
                <input
                  type="text"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  placeholder="N° de Licence d'Exploitation"
                  className="w-full p-5 bg-white border border-slate-100 rounded-2xl font-bold outline-none shadow-sm focus:border-pink-500"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="bg-blue-50 p-6 rounded-[2.5rem] border border-blue-100 flex items-start gap-4 shadow-sm">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                  <Pill className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-blue-900 text-sm">Détails de l'Officine</h4>
                  <p className="text-[10px] text-blue-700 font-bold uppercase tracking-wider mt-1">Nom commercial et localisation.</p>
                </div>
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  value={formData.pharmacyName}
                  onChange={(e) => setFormData({ ...formData, pharmacyName: e.target.value })}
                  placeholder="Nom de la Pharmacie"
                  className="w-full p-5 bg-white border border-slate-100 rounded-2xl font-bold outline-none shadow-sm focus:border-pink-500"
                />
                <input
                  type="text"
                  value={formData.neighborhood}
                  onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                  placeholder="Quartier de l'officine"
                  className="w-full p-5 bg-white border border-slate-100 rounded-2xl font-bold outline-none shadow-sm focus:border-pink-500"
                />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Téléphone Urgence"
                  className="w-full p-5 bg-white border border-slate-100 rounded-2xl font-bold outline-none shadow-sm focus:border-pink-500"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="bg-emerald-50 p-6 rounded-[2.5rem] border border-emerald-100 flex items-start gap-4 shadow-sm">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                  <Clock className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-900 text-sm">Services & Horaires</h4>
                  <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider mt-1">Disponibilité pour les urgences nocturnes.</p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
                 <div className="flex items-center justify-between">
                    <div className="space-y-1">
                       <p className="text-sm font-bold text-slate-800">Pharmacie de Garde</p>
                       <p className="text-[10px] text-slate-400 font-bold">Disponible 24h/24 et 7j/7</p>
                    </div>
                    <button 
                      onClick={() => setFormData({...formData, isOpen24h: !formData.isOpen24h})}
                      className={`w-14 h-8 rounded-full transition-all relative ${formData.isOpen24h ? 'bg-pink-500' : 'bg-slate-200'}`}
                    >
                      <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm ${formData.isOpen24h ? 'left-7' : 'left-1'}`}></div>
                    </button>
                 </div>
              </div>

              <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100 flex items-start gap-3">
                 <Award className="w-5 h-5 text-amber-600 shrink-0" />
                 <p className="text-[10px] text-amber-800 font-bold leading-relaxed">
                   En vous enregistrant, vous acceptez de traiter les commandes de médicaments avec ordonnance via Ndjele Care.
                 </p>
              </div>
            </div>
          )}
        </div>
      )}

      {!isSubmitting && (
        <div className="pt-4 flex gap-3">
          <button onClick={handleBack} className="flex-1 py-4 bg-white border border-slate-100 text-slate-500 rounded-2xl font-bold">Retour</button>
          <button
            onClick={step < 3 ? handleNext : handleSubmit}
            disabled={step === 1 ? !formData.pharmacistName : step === 2 ? (!formData.pharmacyName || !formData.phone) : false}
            className="flex-[2] py-4 bg-pink-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {step < 3 ? 'Suivant' : 'S\'enregistrer'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default PharmacyRegistrationView;
