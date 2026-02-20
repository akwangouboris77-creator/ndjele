
import React, { useState } from 'react';
import { ShieldAlert, ArrowLeft, Phone, Users, MapPin, Share2, CheckCircle2, UserPlus, ShieldCheck } from 'lucide-react';
import { Contact, ActiveRide, ViewState } from '../types';

interface SOSViewProps {
  onNavigate: (view: ViewState) => void;
  contacts: Contact[];
  activeRide: ActiveRide | null;
  onUpdateRide: (ride: ActiveRide) => void;
}

const SOSView: React.FC<SOSViewProps> = ({ onNavigate, contacts, activeRide, onUpdateRide }) => {
  const [isActivated, setIsActivated] = useState(false);
  const [showContactPicker, setShowContactPicker] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [isSharingLive, setIsSharingLive] = useState(activeRide?.isLocationShared || false);

  const toggleContact = (id: string) => {
    setSelectedContacts(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleShareLocation = () => {
    if (selectedContacts.length === 0) return;
    setIsSharingLive(true);
    setShowContactPicker(false);
    
    // Si une course est active, on met à jour son état global
    if (activeRide) {
      onUpdateRide({ ...activeRide, isLocationShared: true });
    }
    // Simulation : Les contacts reçoivent un lien de suivi GPS
    console.log("Suivi GPS activé pour les contacts :", selectedContacts);
  };

  return (
    <div className="p-6 h-full flex flex-col items-center justify-start text-center space-y-8 animate-in zoom-in-95 duration-300">
      <div className="w-full flex items-center">
        <button onClick={() => onNavigate('home')} className="p-2 bg-white rounded-full shadow-sm">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 ${isActivated ? 'bg-red-600 animate-ping' : 'bg-red-100'}`}>
        <ShieldAlert className={`w-12 h-12 ${isActivated ? 'text-white' : 'text-red-600'}`} />
      </div>

      {!showContactPicker ? (
        <>
          <div>
            <h2 className="text-3xl font-black text-slate-800">Sécurité SOS</h2>
            <p className="text-slate-500 mt-2 px-8">En cas d'urgence, maintenez le bouton ci-dessous ou partagez votre position.</p>
          </div>

          <button 
            onClick={() => setIsActivated(!isActivated)}
            className={`w-48 h-48 rounded-full border-[12px] flex flex-col items-center justify-center transition-all duration-500 shadow-2xl active:scale-95 ${
              isActivated 
              ? 'bg-red-600 border-red-200 text-white scale-110 shadow-red-200' 
              : 'bg-white border-red-50 text-red-600 hover:border-red-100'
            }`}
          >
            <span className="text-4xl mb-2">🆘</span>
            <span className="font-black text-xl">{isActivated ? 'ALERTE ENVOYÉE' : 'SOS'}</span>
          </button>

          {isActivated ? (
            <div className="w-full bg-red-50 p-6 rounded-[2rem] border border-red-100 space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <p className="font-bold text-red-800 flex items-center justify-center gap-2">
                <MapPin className="w-4 h-4" /> Position partagée avec la Police
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button className="bg-red-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2">
                  <Phone className="w-5 h-5" /> Appeler 117
                </button>
                <button className="bg-white text-red-600 border border-red-200 py-4 rounded-2xl font-bold flex items-center justify-center gap-2">
                  <Users className="w-5 h-5" /> Contacts
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full space-y-4">
              {isSharingLive ? (
                <div className="w-full py-4 bg-emerald-50 text-emerald-700 rounded-2xl font-bold flex items-center justify-center gap-3 border border-emerald-100">
                  <ShieldCheck className="w-5 h-5" /> GPS Live Actif ({selectedContacts.length || 2} contacts)
                </div>
              ) : (
                <button 
                  onClick={() => setShowContactPicker(true)}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-colors"
                >
                  <Share2 className="w-5 h-5" /> Partager Trajet en Direct
                </button>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="w-full h-full flex flex-col space-y-6 animate-in slide-in-from-right-4">
          <div className="text-left space-y-1">
            <h3 className="text-2xl font-black text-slate-800">Partager GPS Live</h3>
            <p className="text-sm text-slate-500">Sélectionnez les contacts de confiance.</p>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto max-h-64 pr-2 text-left">
            {contacts.map(c => (
              <button 
                key={c.id}
                onClick={() => toggleContact(c.id)}
                className={`w-full flex items-center justify-between p-4 rounded-3xl border transition-all ${
                  selectedContacts.includes(c.id) 
                  ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-500/20' 
                  : 'bg-white border-slate-100 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${c.isTrusted ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                    {c.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{c.name}</p>
                    <p className="text-xs text-slate-400">{c.phone}</p>
                  </div>
                </div>
                {selectedContacts.includes(c.id) && <CheckCircle2 className="w-6 h-6 text-blue-500" />}
              </button>
            ))}
          </div>

          <button 
            onClick={handleShareLocation}
            disabled={selectedContacts.length === 0}
            className="w-full py-4 gradient-primary text-white rounded-2xl font-bold"
          >
            Démarrer le Partage Live
          </button>
        </div>
      )}
    </div>
  );
};

export default SOSView;
