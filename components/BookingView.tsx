import React, { useState, useEffect } from 'react';
import { MapPin, ArrowLeft, MessageSquareQuote, Car, Bike, Search, CheckCircle, Loader2, CreditCard, ShieldCheck, Info, Smartphone, Copy, Navigation, Star, Clock, Map as MapIcon, Users, QrCode, Zap, Compass, ChevronRight } from 'lucide-react';
import { negotiatePrice } from '../services/geminiService';
import { TransportType, ViewState, ActiveRide, Driver } from '../types';
import { dbService } from '../src/services/dbService';

interface BookingViewProps {
  onNavigate: (view: ViewState) => void;
  onStartRideRequest: (ride: ActiveRide) => void;
}

const MOCK_DRIVERS: Driver[] = [
  { id: '1', name: 'Jean-Marc N.', type: TransportType.TAXI, rating: 4.8, distance: 0.5, location: { lat: 0.39, lng: 9.45 }, currentDestination: 'Aéroport' },
  { id: '2', name: 'Alain M.', type: TransportType.TAXI, rating: 4.9, distance: 1.2, location: { lat: 0.38, lng: 9.46 }, currentDestination: 'Nzeng-Ayong' },
  { id: '3', name: 'Cédric T.', type: TransportType.TAXI, rating: 4.7, distance: 2.1, location: { lat: 0.40, lng: 9.44 }, currentDestination: 'Owendo' },
];

import GpsMap from './GpsMap';

const POPULAR_DESTINATIONS = [
  { name: 'Aéroport Léon Mba', icon: '✈️', location: { lat: 0.4583, lng: 9.4122 } },
  { name: 'Port d\'Owendo', icon: '🚢', location: { lat: 0.2964, lng: 9.5025 } },
  { name: 'Nzeng-Ayong', icon: '🏠', location: { lat: 0.4125, lng: 9.4833 } },
  { name: 'Centre Ville', icon: '🏢', location: { lat: 0.3911, lng: 9.4528 } },
];

const MARAUDE_NUMBERS = {
  AIRTEL: '077 21 89 76',
  MOOV: '062 70 23 74'
};

const CROSSROADS = [
  { name: 'Échangeur de Nzeng-Ayong', location: { lat: 0.4125, lng: 9.4833 } },
  { name: 'Carrefour Rio', location: { lat: 0.3950, lng: 9.4600 } },
  { name: 'Carrefour Charbonnages', location: { lat: 0.4400, lng: 9.4300 } },
  { name: 'Carrefour Glass', location: { lat: 0.3800, lng: 9.4500 } },
];

const BookingView: React.FC<BookingViewProps> = ({ onNavigate, onStartRideRequest }) => {
  const [step, setStep] = useState(1);
  const [destination, setDestination] = useState('');
  const [selectedDestLoc, setSelectedDestLoc] = useState<{ lat: number, lng: number } | undefined>();
  const [matchingDrivers, setMatchingDrivers] = useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [offer, setOffer] = useState(500);
  const [loading, setLoading] = useState(false);
  const [negotiationResult, setNegotiationResult] = useState<{ reply: string, finalPrice: number } | null>(null);
  const [paymentProvider, setPaymentProvider] = useState<'AIRTEL' | 'MOOV' | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const [rideMode, setRideMode] = useState<'PRIVATE' | 'COLLECTIVE'>('PRIVATE');
  const [isRoadside, setIsRoadside] = useState(false);
  const [seats, setSeats] = useState(1);
  const [pickupPoint, setPickupPoint] = useState('');
  const [showQrScanner, setShowQrScanner] = useState(false);

  const COMMISSION_RATE = 0.09;
  const [clientLoc] = useState({ lat: 0.39, lng: 9.45 });

  useEffect(() => {
    if (destination.length >= 2) {
      const matches = MOCK_DRIVERS.filter(d => d.currentDestination?.toLowerCase().includes(destination.toLowerCase()));
      setMatchingDrivers(matches.length > 0 ? matches : MOCK_DRIVERS);
      
      const pop = POPULAR_DESTINATIONS.find(p => p.name === destination);
      if (pop) setSelectedDestLoc(pop.location);
    } else {
      setMatchingDrivers(MOCK_DRIVERS);
    }
  }, [destination]);

  const handleNegotiate = async () => {
    if (!selectedDriver) return;
    setLoading(true);
    try {
      const res = await negotiatePrice(1000, offer, 'goudron', 'soleil', 1, false);
      setNegotiationResult(res);
      setStep(3);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fees = negotiationResult ? Math.round(negotiationResult.finalPrice * COMMISSION_RATE) : 0;
  const totalWithFees = (negotiationResult?.finalPrice || 0) + fees;

  const handleCompletePayment = () => {
    setIsConfirming(true);
    setTimeout(async () => {
      if (!selectedDriver || !negotiationResult) return;
      const ride: ActiveRide = {
        id: Math.random().toString(36).substr(2, 9),
        driverName: selectedDriver.name,
        vehiclePlate: 'GA-' + Math.floor(1000 + Math.random() * 9000) + '-TX',
        type: selectedDriver.type,
        startTime: Date.now(),
        destination: destination,
        destinationLoc: selectedDestLoc,
        clientLoc: clientLoc,
        driverLoc: selectedDriver.location,
        isLocationShared: false,
        price: negotiationResult.finalPrice,
        status: 'PENDING',
        rideMode: rideMode,
        isRoadside: isRoadside,
        pickupPointName: isRoadside ? pickupPoint : 'Ma Position',
        seatsRequested: seats
      };

      try {
        await dbService.pushData('rides', ride);
      } catch (e) {
        console.error("Firebase Ride Error:", e);
      }

      onStartRideRequest(ride);
      setIsConfirming(false);
    }, 2000);
  };

  return (
    <div className="p-6 space-y-6 animate-in slide-in-from-right-4 duration-300 h-full flex flex-col bg-slate-50/50">
      <div className="flex items-center gap-4">
        <button onClick={() => onNavigate('home')} className="p-3 bg-white rounded-2xl shadow-sm active:scale-95 transition-all">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">Maraude Go</h2>
          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Taxi & Maraude Digitale</p>
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto hide-scrollbar pb-24">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Mode Selection */}
            <div className="flex gap-2 p-1 bg-white rounded-2xl shadow-sm border border-slate-100">
              <button 
                onClick={() => setRideMode('PRIVATE')}
                className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase transition-all flex items-center justify-center gap-2 ${rideMode === 'PRIVATE' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}
              >
                <Car className="w-3 h-3" /> Privé
              </button>
              <button 
                onClick={() => {
                  setRideMode('COLLECTIVE');
                  setOffer(500); // Default shared price
                }}
                className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase transition-all flex items-center justify-center gap-2 ${rideMode === 'COLLECTIVE' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400'}`}
              >
                <Users className="w-3 h-3" /> Collectif
              </button>
            </div>

            {/* Roadside Toggle */}
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isRoadside ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                  <Navigation className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-tight">Déjà au bord de la route</h4>
                  <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Signaler ma présence</p>
                </div>
              </div>
              <button 
                onClick={() => setIsRoadside(!isRoadside)}
                className={`w-12 h-6 rounded-full transition-all relative ${isRoadside ? 'bg-emerald-500' : 'bg-slate-200'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isRoadside ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>

            {/* Map Preview */}
            <GpsMap 
              clientLoc={clientLoc} 
              destinationLoc={selectedDestLoc}
              height="180px"
            />

            {isRoadside && (
              <div className="space-y-3 animate-in slide-in-from-top-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Points de ramassage (Carrefours)</h3>
                  <button onClick={() => setShowQrScanner(true)} className="flex items-center gap-1 text-[9px] font-black text-indigo-600 uppercase tracking-widest">
                    <QrCode className="w-3 h-3" /> Scanner Borne
                  </button>
                </div>
                <div className="flex gap-2 overflow-x-auto hide-scrollbar py-1">
                  {CROSSROADS.map((cr, i) => (
                    <button 
                      key={i}
                      onClick={() => setPickupPoint(cr.name)}
                      className={`px-4 py-2.5 rounded-xl whitespace-nowrap text-[9px] font-black uppercase tracking-tight border-2 transition-all ${pickupPoint === cr.name ? 'border-amber-500 bg-amber-50 text-amber-700' : 'bg-white border-slate-100 text-slate-400'}`}
                    >
                      {cr.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input 
                  type="text" 
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Où allez-vous ?" 
                  className="w-full pl-14 pr-6 py-5 bg-white border border-slate-100 rounded-[2rem] text-slate-800 font-black text-sm focus:border-emerald-500 outline-none shadow-xl shadow-slate-200/50 transition-all"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto hide-scrollbar py-2">
                {POPULAR_DESTINATIONS.map((dest, i) => (
                  <button 
                    key={i}
                    onClick={() => setDestination(dest.name)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-100 rounded-2xl whitespace-nowrap shadow-sm hover:border-emerald-200 transition-all active:scale-95"
                  >
                    <span className="text-sm">{dest.icon}</span>
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight">{dest.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Chauffeurs à proximité</h3>
                <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-widest">Live</span>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {matchingDrivers.map(d => (
                  <button 
                    key={d.id}
                    onClick={() => setSelectedDriver(d)}
                    className={`p-5 rounded-[2.5rem] border-2 text-left transition-all flex items-center gap-5 relative overflow-hidden group ${selectedDriver?.id === d.id ? 'border-emerald-500 bg-white shadow-2xl shadow-emerald-100 scale-[1.02]' : 'bg-white border-slate-50 shadow-sm opacity-80'}`}
                  >
                    <div className="relative">
                      <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
                        {d.type === TransportType.TAXI ? '🚕' : (d.type === TransportType.MOTO ? '🏍️' : '🚐')}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center">
                        <Star className="w-3 h-3 text-white fill-white" />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-slate-900 text-sm">{d.name}</h4>
                        <div className="flex items-center gap-0.5 text-amber-500">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="text-[10px] font-black">{d.rating}</span>
                        </div>
                      </div>
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">Direction: {d.currentDestination}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1 text-emerald-600">
                          <Clock className="w-3 h-3" />
                          <span className="text-[9px] font-black uppercase">{Math.round(d.distance * 5)} min</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-400">
                          <MapPin className="w-3 h-3" />
                          <span className="text-[9px] font-black uppercase">{d.distance} km</span>
                        </div>
                      </div>
                    </div>

                    {selectedDriver?.id === d.id && (
                      <div className="absolute top-4 right-4 animate-in zoom-in duration-300">
                        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
            {rideMode === 'COLLECTIVE' && (
              <div className="bg-emerald-50 p-6 rounded-[2.5rem] border border-emerald-100 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-xs font-black text-emerald-900 uppercase tracking-widest">Nombre de Sièges</h3>
                  </div>
                  <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-2xl shadow-sm">
                    <button onClick={() => setSeats(Math.max(1, seats - 1))} className="text-emerald-600 font-black text-xl">-</button>
                    <span className="font-black text-slate-800">{seats}</span>
                    <button onClick={() => setSeats(Math.min(4, seats + 1))} className="text-emerald-600 font-black text-xl">+</button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                   <button onClick={() => setOffer(500 * seats)} className={`py-4 rounded-xl font-black text-xs transition-all ${offer === 500 * seats ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-600'}`}>Zone A: {500 * seats} F</button>
                   <button onClick={() => setOffer(1000 * seats)} className={`py-4 rounded-xl font-black text-xs transition-all ${offer === 1000 * seats ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-600'}`}>Zone B: {1000 * seats} F</button>
                </div>
              </div>
            )}

            <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white space-y-8 shadow-2xl text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Votre proposition au chauffeur</p>
                <div className="text-7xl font-black mt-6 text-emerald-400 tracking-tighter flex items-baseline justify-center gap-2">
                  {offer.toLocaleString()} <span className="text-2xl font-medium text-slate-500">F</span>
                </div>
                <div className="mt-10 px-4">
                  <input 
                    type="range" min="500" max="5000" step="100" value={offer}
                    onChange={(e) => setOffer(parseInt(e.target.value))}
                    className="w-full h-3 bg-slate-800 rounded-full appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="flex justify-between mt-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <span>Min 500 F</span>
                    <span>Max 5000 F</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                <Info className="w-6 h-6" />
              </div>
              <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
                Le chauffeur peut accepter, refuser ou faire une contre-proposition via l'IA Maraude.
              </p>
            </div>

            <button 
              disabled={loading}
              onClick={handleNegotiate}
              className="w-full py-6 gradient-primary text-white rounded-[2.5rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-emerald-200 flex items-center justify-center gap-3 active:scale-95 transition-all"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><MessageSquareQuote className="w-6 h-6" /> Négocier avec l'IA</>}
            </button>
          </div>
        )}

        {step === 3 && negotiationResult && (
          <div className="space-y-6 animate-in slide-in-from-bottom-10 duration-500">
            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-2xl space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-emerald-500 text-white px-6 py-2 rounded-bl-3xl font-black text-[10px] uppercase tracking-widest">Accord Trouvé</div>
              
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tarif Final Course</p>
                <div className="text-5xl font-black text-slate-900 tracking-tighter">
                  {totalWithFees.toLocaleString()} <span className="text-xl font-medium text-slate-400">F</span>
                </div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">Incluant {fees} F de frais de service Maraude</p>
              </div>

              <div className="h-px bg-slate-100"></div>
              
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Choisir le mode de paiement</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setPaymentProvider('AIRTEL')}
                    className={`p-6 rounded-[2.5rem] border-2 flex flex-col items-center gap-3 transition-all ${paymentProvider === 'AIRTEL' ? 'border-red-500 bg-white shadow-xl scale-105' : 'border-slate-50 bg-slate-50 opacity-60'}`}
                  >
                    <div className="w-14 h-14 bg-red-600 rounded-[1.5rem] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-red-200">A</div>
                    <span className="text-[10px] font-black uppercase text-slate-800 tracking-widest">Airtel Money</span>
                  </button>
                  <button 
                    onClick={() => setPaymentProvider('MOOV')}
                    className={`p-6 rounded-[2.5rem] border-2 flex flex-col items-center gap-3 transition-all ${paymentProvider === 'MOOV' ? 'border-blue-500 bg-white shadow-xl scale-105' : 'border-slate-50 bg-slate-50 opacity-60'}`}
                  >
                    <div className="w-14 h-14 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-200">M</div>
                    <span className="text-[10px] font-black uppercase text-slate-800 tracking-widest">Moov Money</span>
                  </button>
                </div>
              </div>

              {paymentProvider && (
                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-center space-y-4 animate-in zoom-in-95 duration-300 shadow-xl">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Numéro Officiel Maraude</p>
                  <div className="flex items-center justify-center gap-4">
                    <h4 className="text-3xl font-black text-white tracking-widest">
                      {paymentProvider === 'AIRTEL' ? MARAUDE_NUMBERS.AIRTEL : MARAUDE_NUMBERS.MOOV}
                    </h4>
                    <button className="p-3 bg-white/10 rounded-xl text-emerald-400 active:bg-white/20 transition-all"><Copy className="w-5 h-5" /></button>
                  </div>
                  <div className="bg-amber-500/20 py-3 rounded-2xl border border-amber-500/30">
                    <p className="text-[9px] font-black text-amber-200 uppercase tracking-widest">Transaction Sécurisée par Maraude</p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-emerald-50 p-6 rounded-[2.5rem] border border-emerald-100 flex items-start gap-4 shadow-sm">
               <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
               <div>
                 <h4 className="text-xs font-black text-emerald-900 uppercase mb-1">Garantie Maraude</h4>
                 <p className="text-[10px] text-emerald-800 font-bold leading-relaxed">
                   L'argent est bloqué sur un compte tiers. Le chauffeur n'est payé qu'à la fin de la course.
                 </p>
               </div>
            </div>

            <button 
              onClick={handleCompletePayment}
              disabled={!paymentProvider || isConfirming}
              className="w-full py-7 gradient-primary text-white rounded-[2.5rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-emerald-200 flex items-center justify-center gap-4 active:scale-95 transition-all"
            >
              {isConfirming ? <Loader2 className="w-7 h-7 animate-spin" /> : <><CheckCircle className="w-7 h-7" /> J'ai envoyé les {totalWithFees} F</>}
            </button>
          </div>
        )}
      </div>

      {showQrScanner && (
        <div className="fixed inset-0 z-[200] bg-slate-900/95 backdrop-blur-sm flex flex-col items-center justify-center p-8 animate-in fade-in">
          <div className="w-full max-w-xs aspect-square border-4 border-emerald-50 rounded-[3rem] relative overflow-hidden flex items-center justify-center group">
            <div className="absolute inset-0 bg-emerald-500/10 animate-pulse"></div>
            <div className="w-3/4 h-3/4 border-2 border-emerald-400/50 border-dashed rounded-2xl"></div>
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-scan"></div>
            <QrCode className="w-32 h-32 text-emerald-500/20" />
          </div>
          <div className="mt-12 text-center space-y-4">
            <h3 className="text-xl font-black text-white uppercase tracking-tighter">Scanner Borne Maraude</h3>
            <p className="text-xs text-slate-400 font-medium">Scannez le QR Code au carrefour pour être localisé instantanément.</p>
            <button 
              onClick={() => {
                setPickupPoint('Échangeur de Nzeng-Ayong');
                setIsRoadside(true);
                setShowQrScanner(false);
              }}
              className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-emerald-900/40"
            >
              Simuler Scan
            </button>
            <button onClick={() => setShowQrScanner(false)} className="block w-full text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] pt-4">Annuler</button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="fixed bottom-24 left-6 right-6 z-20">
          <button 
            disabled={!selectedDriver || (!destination && !isRoadside)}
            onClick={() => setStep(2)}
            className="w-full py-4 gradient-primary text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-emerald-200 disabled:opacity-50 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            {(rideMode as string) === 'PRIVATE' ? 'Négocier & Payer' : 'Choisir Sièges'} <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingView;
