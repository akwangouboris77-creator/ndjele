
import React, { useState } from 'react';
import { ArrowLeft, User, Stethoscope, Phone, MapPin, ChevronRight, ShieldCheck, Loader2, Award } from 'lucide-react';
import { ViewState, Doctor } from '../types';

interface DoctorRegistrationViewProps {
  onNavigate: (view: ViewState) => void;
  onRegister: (doctor: Doctor) => void;
}

const DoctorRegistrationView: React.FC<DoctorRegistrationViewProps> = ({ onNavigate, onRegister }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    specialty: 'Médecin Généraliste',
    category: 'generaliste' as any,
    phone: '',
    neighborhood: '',
    experience: '5',
    licenseNumber: ''
  });

  const handleNext = () => setStep(step + 1);
  const handleBack = () => step > 1 ? setStep(step - 1) : onNavigate('doctors');

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const newDoctor: Doctor = {
        id: 'doc-' + Math.random().toString(36).substr(2, 5),
        name: formData.name,
        specialty: formData.specialty,
        category: formData.category,
        rating: 5.0,
        distance: 0,
        isVerified: true,
        avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?fit=crop&w=150&h=150',
        neighborhood: formData.neighborhood,
        experience: parseInt(formData.experience),
        availability: 'disponible',
        licenseNumber: formData.licenseNumber
      };
      setIsSubmitting(false);
      onRegister(newDoctor);
    }, 2000);
  };

  return (
    <div className="p-6 space-y-6 animate-in slide-in-from-right-4 duration-300 h-full flex flex-col bg-slate-50/50">
      <div className="flex items-center gap-4">
        <button onClick={handleBack} className="p-3 bg-white rounded-full shadow-sm">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div className="flex-1">
          <h2 className="text-2xl font-black text-slate-800 leading-tight">Expert Médical</h2>
          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Enrôlement Professionnel</p>
        </div>
      </div>

      {isSubmitting ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-6">
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
          <p className="text-sm font-black text-slate-800 uppercase tracking-widest">Vérification de l'ordre...</p>
        </div>
      ) : (
        <div className="flex-1 space-y-8 overflow-y-auto px-1">
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
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
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nom complet (ex: Dr. Marc Obiang)"
                  className="w-full p-5 bg-white border border-slate-100 rounded-2xl font-bold outline-none shadow-sm focus:border-emerald-500"
                />
                <input
                  type="text"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  placeholder="N° d'Ordre des Médecins"
                  className="w-full p-5 bg-white border border-slate-100 rounded-2xl font-bold outline-none shadow-sm focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="bg-blue-50 p-6 rounded-[2.5rem] border border-blue-100 flex items-start gap-4 shadow-sm">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-blue-900 text-sm">Cabinet & Contact</h4>
                  <p className="text-[10px] text-blue-700 font-bold uppercase tracking-wider mt-1">Localisation précise pour le service de proximité.</p>
                </div>
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  value={formData.neighborhood}
                  onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                  placeholder="Quartier du Cabinet"
                  className="w-full p-5 bg-white border border-slate-100 rounded-2xl font-bold outline-none shadow-sm focus:border-emerald-500"
                />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Téléphone Professionnel"
                  className="w-full p-5 bg-white border border-slate-100 rounded-2xl font-bold outline-none shadow-sm focus:border-emerald-500"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {!isSubmitting && (
        <div className="pt-4 flex gap-3">
          <button onClick={handleBack} className="flex-1 py-4 bg-white border border-slate-100 text-slate-500 rounded-2xl font-bold">Retour</button>
          <button
            onClick={step < 2 ? handleNext : handleSubmit}
            disabled={!formData.name || !formData.phone}
            className="flex-[2] py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {step < 2 ? 'Suivant' : 'S\'enregistrer'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default DoctorRegistrationView;
