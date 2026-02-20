
import React, { useEffect, useState } from 'react';
import { Clock, Phone, Navigation, ShieldCheck, X, AlertCircle, Smartphone } from 'lucide-react';
import { ActiveRide } from '../types';

interface WaitingValidationViewProps {
  pendingRide: ActiveRide;
  onCancel: () => void;
  onSimulateAccept: () => void;
  onSimulateReject: () => void;
}

const WaitingValidationView: React.FC<WaitingValidationViewProps> = ({ 
  pendingRide, 
  onCancel, 
  onSimulateAccept, 
  onSimulateReject 
}) => {
  const [dots, setDots] = useState('');
  const [showUssdSimulation, setShowUssdSimulation] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(d => d.length < 3 ? d + '.' : '');
    }, 500);
    
    // Simulate USSD push visualization for the demo
    const ussdTimer = setTimeout(() => setShowUssdSimulation(true), 1500);

    return () => {
      clearInterval(interval);
      clearTimeout(ussdTimer);
    };
  }, []);

  return (
    <div className="flex flex-col h-full bg-slate-50 p-6 animate-in fade-in duration-500 relative">
      <div className="flex-1 flex flex-col items-center justify-center space-y-8 text-center">
        <div className="relative">
          <div className="w-40 h-40 rounded-full border-4 border-amber-100 flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-full border-t-4 border-amber-500 animate-spin"></div>
            <div className="w-32 h-32 bg-amber-50 rounded-full flex items-center justify-center">
               <Navigation className="w-16 h-16 text-amber-500 animate-pulse" />
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-slate-100">
             <Smartphone className="w-6 h-6 text-blue-500" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Attente de validation{dots}</h2>
          <p className="text-slate-500 text-sm font-medium px-4">
            Nous avons envoyé votre proposition de <span className="text-amber-600 font-bold">{pendingRide.price} F</span> à {pendingRide.driverName}.
          </p>
        </div>

        {showUssdSimulation && (
          <div className="w-full bg-blue-600 text-white p-4 rounded-2xl shadow-lg animate-in slide-in-from-bottom-8">
            <div className="flex items-center gap-3 mb-2">
               <AlertCircle className="w-5 h-5" />
               <span className="text-xs font-black uppercase tracking-widest">Flash USSD Notification</span>
            </div>
            <p className="text-[10px] font-medium leading-relaxed opacity-90">
              Notification envoyée au terminal du chauffeur. Priorité maximale Ndjele.
            </p>
          </div>
        )}

        <div className="w-full bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 space-y-4">
           <div className="flex items-center justify-between border-b border-slate-50 pb-3">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-xl">👨🏾‍✈️</div>
               <div className="text-left">
                 <p className="font-bold text-slate-800 text-sm">{pendingRide.driverName}</p>
                 <p className="text-[10px] text-slate-400 font-bold uppercase">Chauffeur Ndjele</p>
               </div>
             </div>
             <ShieldCheck className="w-5 h-5 text-emerald-500" />
           </div>
           
           <div className="grid grid-cols-2 gap-3 text-left">
             <div className="bg-slate-50 p-3 rounded-2xl">
               <span className="text-[8px] font-black text-slate-400 uppercase block mb-1">Destination</span>
               <span className="text-xs font-bold text-slate-700 truncate block">{pendingRide.destination}</span>
             </div>
             <div className="bg-slate-50 p-3 rounded-2xl">
               <span className="text-[8px] font-black text-slate-400 uppercase block mb-1">Offre</span>
               <span className="text-xs font-bold text-amber-600 block">{pendingRide.price} FCFA</span>
             </div>
           </div>
        </div>
      </div>

      <div className="space-y-4 pt-8">
        <div className="flex gap-3">
           <button 
             onClick={onSimulateAccept}
             className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-700 transition-colors"
           >
             Simuler Acceptation
           </button>
           <button 
             onClick={onSimulateReject}
             className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-red-700 transition-colors"
           >
             Simuler Refus
           </button>
        </div>
        
        <button 
          onClick={onCancel}
          className="w-full py-4 text-slate-400 font-bold text-sm flex items-center justify-center gap-2"
        >
          <X className="w-4 h-4" /> Annuler la demande
        </button>
      </div>
    </div>
  );
};

export default WaitingValidationView;
