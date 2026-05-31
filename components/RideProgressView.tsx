
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Navigation2, MessageSquare, AlertTriangle, X, CheckCircle2, ShieldAlert, HeartCrack, Loader2 } from 'lucide-react';
import { ActiveRide, ChatMessage, Contact } from '../types';
import { io, Socket } from 'socket.io-client';
import GpsMap from './GpsMap';

interface RideProgressViewProps {
  ride: ActiveRide;
  onEndRide: () => void;
  onOpenSOS: () => void;
  contacts: Contact[];
  user: any;
}

const RideProgressView: React.FC<RideProgressViewProps> = ({ ride, onEndRide, onOpenSOS, user }) => {
  const [viewState, setViewState] = useState<'tracking' | 'dispute_pending' | 'refunded' | 'success'>('tracking');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [driverLoc, setDriverLoc] = useState(ride.driverLoc || { lat: 0.39, lng: 9.45 });
  const [clientLoc, setClientLoc] = useState(ride.clientLoc || { lat: 0.39, lng: 9.45 });
  const [socket, setSocket] = useState<Socket | null>(null);

  const [rideStage, setRideStage] = useState<'approaching' | 'waiting' | 'transit' | 'finished'>('approaching');

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    newSocket.emit('join-trip', ride.id);

    newSocket.on('trip-update', (data) => {
      if (data.driverLoc) setDriverLoc(data.driverLoc);
      if (data.clientLoc) setClientLoc(data.clientLoc);
    });

    // Simulate movement for demo purposes if no real updates
    const interval = setInterval(() => {
      const dest = ride.destinationLoc || { lat: 0.4583, lng: 9.4122 };
      
      if (user.role === 'DRIVER') {
        const dLat = (dest.lat - driverLoc.lat) * 0.05;
        const dLng = (dest.lng - driverLoc.lng) * 0.05;
        
        const newLoc = { 
          lat: driverLoc.lat + dLat + (Math.random() - 0.5) * 0.0001, 
          lng: driverLoc.lng + dLng + (Math.random() - 0.5) * 0.0001 
        };
        setDriverLoc(newLoc);
        newSocket.emit('update-trip-location', { 
          tripId: ride.id, 
          role: 'driver', 
          lat: newLoc.lat,
          lng: newLoc.lng
        });
      } else if (user.role === 'CLIENT') {
        // Client moves slightly towards destination (following the taxi)
        const dLat = (dest.lat - clientLoc.lat) * 0.03;
        const dLng = (dest.lng - clientLoc.lng) * 0.03;
        
        const newLoc = { 
          lat: clientLoc.lat + dLat + (Math.random() - 0.5) * 0.0001, 
          lng: clientLoc.lng + dLng + (Math.random() - 0.5) * 0.0001 
        };
        setClientLoc(newLoc);
        newSocket.emit('update-trip-location', { 
          tripId: ride.id, 
          role: 'client', 
          lat: newLoc.lat,
          lng: newLoc.lng
        });
      }
    }, 4000);

    return () => {
      newSocket.disconnect();
      clearInterval(interval);
    };
  }, [ride.id, user.role]);
  
  const COMMISSION_RATE = 0.09;
  const platformFees = Math.round(ride.price * COMMISSION_RATE);

  const handleDispute = () => {
    setViewState('dispute_pending');
    // Simulation arbitrage service client
    setTimeout(() => {
      setViewState('refunded');
    }, 3000);
  };

  const handleConfirmFinish = () => {
    setViewState('success');
  };

  const advanceStage = () => {
    if (rideStage === 'approaching') {
      setRideStage('waiting');
    } else if (rideStage === 'waiting') {
      setRideStage('transit');
    } else if (rideStage === 'transit') {
      setRideStage('finished');
      handleConfirmFinish();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 animate-in fade-in duration-500 relative overflow-hidden">
      <div className="relative flex-1 bg-slate-200">
        <GpsMap 
          clientLoc={clientLoc} 
          driverLoc={driverLoc} 
          destinationLoc={ride.destinationLoc}
          height="100%" 
        />
        
        {/* Hidden simulation button for driver arrival */}
        <div 
          onClick={handleConfirmFinish}
          className="absolute top-0 right-0 w-12 h-12 opacity-0 cursor-pointer z-[100]"
          title="Simuler Arrivée"
        />
        
        <div className="absolute top-4 left-4 right-4 flex flex-col gap-2 z-10">
          <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-emerald-500/20 flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
                   <ShieldCheck className="w-5 h-5" />
                </div>
                <p className="text-[10px] font-black uppercase text-emerald-700 tracking-widest">Pré-paiement Sécurisé</p>
             </div>
             <span className="text-xs font-black text-slate-800">{ride.price + platformFees} F</span>
          </div>
          
          <div className="bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-white/10 flex items-center gap-3">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-emerald-400">
              <Navigation2 className="w-4 h-4 animate-pulse" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Destination</p>
                {ride.rideMode === 'COLLECTIVE' && (
                  <span className="text-[7px] font-black bg-emerald-500 text-white px-1.5 py-0.5 rounded uppercase tracking-tighter">Collectif ({ride.seatsRequested} sièges)</span>
                )}
              </div>
              <p className="text-[10px] font-bold text-white truncate">{ride.destination}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-t-[3rem] p-8 shadow-2xl z-20 -mt-10 space-y-6">
        {/* Course Stepper Progress */}
        <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100/80 flex justify-between items-center text-center">
          {[
            { id: 'approaching', label: 'Approche', icon: '🚙' },
            { id: 'waiting', label: 'Arrivé', icon: '📍' },
            { id: 'transit', label: 'En Course', icon: '🛣️' },
            { id: 'finished', label: 'Terminé', icon: '🏁' }
          ].map((st) => {
            const isCurrent = rideStage === st.id;
            const completed = 
              (st.id === 'approaching') ||
              (st.id === 'waiting' && rideStage !== 'approaching') ||
              (st.id === 'transit' && (rideStage === 'transit' || rideStage === 'finished')) ||
              (st.id === 'finished' && rideStage === 'finished');

            return (
              <div key={st.id} className="flex-1 flex flex-col items-center relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all ${completed ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-200 text-slate-400'}`}>
                  {completed ? '✓' : st.icon}
                </div>
                <span className={`text-[8px] font-black uppercase mt-1 ${isCurrent ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {st.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between items-center">
           <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-2xl">👨🏾‍✈️</div>
              <div>
                <h3 className="text-lg font-black text-slate-800">{ride.driverName}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase">{ride.vehiclePlate}</p>
              </div>
           </div>
           <div className="flex gap-2">
             <button onClick={() => setIsChatOpen(true)} className="w-11 h-11 bg-slate-900 text-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
               <MessageSquare className="w-5.5 h-5.5" />
             </button>
             <div className="flex flex-col items-center gap-1">
               <button onClick={onOpenSOS} className="w-11 h-11 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center">
                 <AlertTriangle className="w-5.5 h-5.5" />
               </button>
               {user?.role?.toUpperCase() === 'CLIENT' && (
                 <button 
                   onClick={() => {
                     // Simple discreet cancellation
                     onEndRide();
                   }} 
                   className="text-[8px] font-black text-slate-400 uppercase tracking-tighter hover:text-red-500 transition-colors"
                 >
                   Annuler
                 </button>
               )}
             </div>
           </div>
        </div>

        {viewState === 'tracking' && (
          <div className="space-y-4">
             <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-bold text-slate-600">Course en cours...</span>
                   </div>
                   <span className="text-[10px] font-black text-slate-400 uppercase">Fonds en séquestre</span>
                </div>
                
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/60">
                   <div className="text-center">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Chauffeur</p>
                      <p className="text-[10px] font-bold text-slate-800 truncate">{ride.driverName}</p>
                   </div>
                   <div className="text-center border-x border-slate-200/60">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Prix Est.</p>
                      <p className="text-[10px] font-bold text-emerald-600">{ride.price + platformFees} F</p>
                   </div>
                   <div className="text-center">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Arrivée</p>
                      <p className="text-[10px] font-bold text-slate-800">~5 min</p>
                   </div>
                </div>
             </div>
             
             <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={handleDispute}
                  className="py-4 bg-red-50 text-red-600 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-red-100 flex items-center justify-center gap-2"
                >
                  <HeartCrack className="w-4 h-4" /> Signaler Litige
                </button>
                <button 
                  onClick={advanceStage}
                  className="py-4 gradient-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-2"
                >
                  {rideStage === 'approaching' && 'Chauffeur Arrivé'}
                  {rideStage === 'waiting' && 'Démarrer Course'}
                  {rideStage === 'transit' && 'Valider Arrivée'}
                  {rideStage === 'finished' && 'Terminé'}
                </button>
             </div>
          </div>
        )}

        {viewState === 'dispute_pending' && (
          <div className="py-8 text-center space-y-4 animate-in fade-in">
             <Loader2 className="w-12 h-12 text-red-500 animate-spin mx-auto" />
             <h4 className="text-xl font-black text-slate-800 uppercase">Arbitrage Maraude</h4>
             <p className="text-xs text-slate-500 px-8">Le service client vérifie la position GPS et la prestation. Veuillez patienter...</p>
          </div>
        )}

        {viewState === 'refunded' && (
          <div className="py-8 text-center space-y-6 animate-in zoom-in-95">
             <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
                <ShieldAlert className="w-10 h-10" />
             </div>
             <div className="space-y-2 px-4">
                <h4 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Remboursement Validé</h4>
                <p className="text-sm text-slate-500">
                  La prestation ({ride.price} F) a été créditée sur votre Wallet.
                </p>
                <p className="text-[10px] font-black text-red-600 bg-red-50 py-2 rounded-xl mt-2">
                  MARAUDE NOTE : Les frais de plateforme ({platformFees} F) sont conservés.
                </p>
             </div>
             <button onClick={onEndRide} className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-xs">Fermer</button>
          </div>
        )}

        {viewState === 'success' && (
          <div className="py-8 text-center space-y-6 animate-in zoom-in-95">
             <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
             </div>
             <div className="space-y-2">
                <h4 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Course Terminée</h4>
                <p className="text-xs text-slate-500 px-4">L'argent ({ride.price} F) a été libéré pour le chauffeur. Merci !</p>
             </div>
             <button onClick={onEndRide} className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-xs">Retour à l'accueil</button>
          </div>
        )}
      </div>

      {isChatOpen && (
        <div className="fixed inset-0 z-[500] bg-black/80 backdrop-blur-md flex items-end animate-in fade-in">
           <div className="w-full bg-white rounded-t-[3.5rem] h-[60vh] flex flex-col p-8 space-y-6 shadow-2xl">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <h4 className="font-black text-slate-800">Support / Chauffeur</h4>
                <button onClick={() => setIsChatOpen(false)} className="p-2 bg-slate-100 rounded-full"><X className="w-5 h-5" /></button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-4">
                <div className="p-4 bg-emerald-50 rounded-2xl text-xs font-bold text-emerald-800">
                  🛡️ Chat sécurisé Maraude. En cas de problème, utilisez le bouton "Signaler Litige" pour être remboursé.
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default RideProgressView;