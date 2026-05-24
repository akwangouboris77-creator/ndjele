import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  TrendingUp, Users, Map as MapIcon, Calendar, Zap, AlertCircle, Phone, X, 
  Check, Smartphone, Banknote, ArrowDownCircle, ArrowUpCircle, Wallet, ArrowLeft,
  ChevronRight, CheckCircle2, Calculator, Sparkles, Navigation, Search, 
  User, Cpu, History as HistoryIcon, MapPin, Star, Clock, Bell, Layers, Info, 
  UserCheck, ShieldCheck, RefreshCw, Filter, ArrowRight, Loader2, Compass, Send, 
  FileText, QrCode, MessageSquareQuote
} from 'lucide-react';
import { ActiveRide, TransportType, ViewState, DriverRegistration, UserProfile } from '../types';
import { predictNextDirection, getNeighborhoodFromCoords } from '../services/geminiService';
import { io, Socket } from 'socket.io-client';

interface DriverDashboardProps {
  user: UserProfile | null;
  onNavigate: (view: ViewState) => void;
  onAcceptRequest: (ride: ActiveRide) => void;
  registeredDriver: DriverRegistration | null;
}

type FilterPeriod = 'day' | 'week' | 'month';
type WithdrawStep = 'amount' | 'provider' | 'confirmation' | 'processing' | 'success';
type MobileProvider = 'AIRTEL' | 'MOOV' | 'FLOOZ' | 'TMONEY';
type DashboardTab = 'activity' | 'announcements';

interface HistoricRide {
  id: string;
  destination: string;
  price: number;
  date: Date;
  type: TransportType;
}

interface AvailableRequest {
  id: string;
  clientName: string;
  destination: string;
  price: number;
  distance: string;
  rideMode?: 'PRIVATE' | 'COLLECTIVE';
  pickupPointName?: string;
  seats?: number;
}

const MOCK_HISTORY: HistoricRide[] = [
  { id: 'h1', destination: 'Aéroport Léon Mba', price: 5000, date: new Date(), type: TransportType.TAXI },
  { id: 'h2', destination: 'Louis', price: 2000, date: new Date(), type: TransportType.TAXI },
  { id: 'h3', destination: 'Akanda', price: 3500, date: new Date(Date.now() - 86400000), type: TransportType.TAXI },
  { id: 'h4', destination: 'Owendo', price: 4000, date: new Date(Date.now() - 86400000 * 3), type: TransportType.TAXI },
  { id: 'h5', destination: 'Nzeng-Ayong', price: 1500, date: new Date(Date.now() - 86400000 * 8), type: TransportType.TAXI },
  { id: 'h6', destination: 'PK12', price: 6000, date: new Date(Date.now() - 86400000 * 15), type: TransportType.TAXI },
];

const MOCK_AVAILABLE_REQUESTS: AvailableRequest[] = [
  { id: 'req1', clientName: 'Marie T.', destination: 'Aéroport Léon Mba', price: 3000, distance: '400m', rideMode: 'PRIVATE' },
  { id: 'req2', clientName: 'Paul O.', destination: 'Akanda (Delta)', price: 4500, distance: '1.2km', rideMode: 'PRIVATE' },
  { id: 'req3', clientName: 'Lise M.', destination: 'Owendo (Port)', price: 2500, distance: '800m', rideMode: 'PRIVATE' },
  { id: 'req4', clientName: 'Kevin K.', destination: 'Louis', price: 1500, distance: '200m', rideMode: 'PRIVATE' },
  { id: 'req5', clientName: 'Sandra B.', destination: 'Nzeng-Ayong', price: 2000, distance: '1.5km', rideMode: 'PRIVATE' },
  { id: 'shared1', clientName: 'Huguette P.', destination: 'PK8', price: 500, distance: '1.1km', rideMode: 'COLLECTIVE', pickupPointName: 'Échangeur de Nzeng-Ayong', seats: 1 },
  { id: 'shared2', clientName: 'Boris A.', destination: 'Goudron', price: 1000, distance: '2.3km', rideMode: 'COLLECTIVE', pickupPointName: 'Carrefour Rio', seats: 2 },
];

const HOTSPOTS = [
  { name: 'Échangeur de Nzeng-Ayong', clients: 8, location: { lat: 0.4125, lng: 9.4833 } },
  { name: 'Carrefour Rio', clients: 15, location: { lat: 0.3950, lng: 9.4600 } },
  { name: 'Carrefour Charbonnages', clients: 5, location: { lat: 0.4400, lng: 9.4300 } },
  { name: 'Carrefour Glass', clients: 12, location: { lat: 0.3800, lng: 9.4500 } },
];

const PROVIDERS: { id: MobileProvider, name: string, color: string, textColor: string }[] = [
  { id: 'AIRTEL', name: 'Airtel Money', color: 'bg-red-600', textColor: 'text-white' },
  { id: 'MOOV', name: 'Moov Money', color: 'bg-blue-600', textColor: 'text-white' },
  { id: 'FLOOZ', name: 'Flooz', color: 'bg-orange-500', textColor: 'text-white' },
  { id: 'TMONEY', name: 'TMoney', color: 'bg-yellow-400', textColor: 'text-slate-900' },
];

const MOCK_ANNOUNCEMENTS = [
  { id: 'a1', title: 'Bonus de Nuit', content: 'Gagnez 20% de plus sur toutes les courses entre 22h et 5h du matin.', date: 'Actif', type: 'PROMO' },
  { id: 'a2', title: 'Zone de Forte Demande', content: 'Forte demande détectée à Akanda. Les tarifs sont majorés de x1.5.', date: 'Maintenant', type: 'ALERT' },
  { id: 'a3', title: 'Mise à jour Maraude', content: 'Une nouvelle version de l\'application est disponible. Téléchargez-la pour de meilleures performances.', date: 'Hier', type: 'INFO' },
];

import GpsMap from './GpsMap';

const DriverDashboard: React.FC<DriverDashboardProps> = ({ user, onNavigate, onAcceptRequest, registeredDriver }) => {
  const [balance, setBalance] = useState(48750);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const [isCollectiveMode, setIsCollectiveMode] = useState(true);
  const [availableSeats, setAvailableSeats] = useState(4);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<MobileProvider | null>(null);
  const [withdrawStep, setWithdrawStep] = useState<WithdrawStep>('amount');
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>('day');
  const [activeTab, setActiveTab] = useState<DashboardTab>('activity');
  
  const [currentDirection, setCurrentDirection] = useState('');
  const [currentLocation, setCurrentLocation] = useState<{ lat: number, lng: number, neighborhood: string } | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [showDirectionSaved, setShowDirectionSaved] = useState(false);

  const [realtimeRequests, setRealtimeRequests] = useState<AvailableRequest[]>([]);
  const [negotiatingWith, setNegotiatingWith] = useState<AvailableRequest | null>(null);
  const [negotiationText, setNegotiationText] = useState('');
  
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io();
    
    socketRef.current.on('new-maraude-request', (request) => {
      setRealtimeRequests(prev => {
        if (prev.find(r => r.id === request.id)) return prev;
        return [request, ...prev];
      });
    });

    handleDetectLocation();
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (currentLocation && user) {
      socketRef.current?.emit('update-driver-location', {
        driverId: user.id,
        name: user.name,
        type: registeredDriver?.vehicleType || 'TAXI',
        lat: currentLocation.lat,
        lng: currentLocation.lng
      });
    }
  }, [currentLocation, user, registeredDriver]);

  const handleStartNegotiation = (req: AvailableRequest) => {
    setNegotiatingWith(req);
    setNegotiationText(`Bonjour ${req.clientName}, je vais dans cette direction. 800 F ça vous va ?`);
    socketRef.current?.on(`negotiation-${req.id}`, (data) => {
       // Ideally show a chat UI here, but for simplicity we'll just handle price
    });
  };

  const handleSendResponse = () => {
    if (!socketRef.current || !negotiatingWith) return;
    const price = parseInt(negotiationText.match(/\d+/)?.[0] || '800');
    socketRef.current.emit('negotiate-price', {
      requestId: negotiatingWith.id,
      sender: 'DRIVER',
      text: negotiationText,
      price: price
    });
    setNegotiationText('');
  };

  const COMMISSION_RATE = 0.09;

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("La géolocalisation n'est pas supportée par votre navigateur.");
      return;
    }
    
    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const neighborhood = await getNeighborhoodFromCoords(position.coords.latitude, position.coords.longitude);
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            neighborhood: neighborhood || 'Position détectée'
          });
        } catch (e) {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            neighborhood: 'Position GPS'
          });
        } finally {
          setIsDetecting(false);
        }
      },
      (error) => {
        console.error("Geo Error:", error);
        setIsDetecting(false);
        alert("Impossible de détecter votre position. Veuillez vérifier vos permissions GPS.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Filtrage intelligent des notifications selon la direction (Optimisé)
  const matchedRequests = useMemo(() => {
    const all = [...realtimeRequests, ...MOCK_AVAILABLE_REQUESTS];
    if (!currentDirection || currentDirection.length < 3) return all;
    const dir = currentDirection.toLowerCase();
    return all.filter(req => 
      req.destination.toLowerCase().includes(dir) || dir.includes(req.destination.toLowerCase())
    );
  }, [currentDirection, realtimeRequests]);

  // Calcul du montant net sécurisé contre le NaN
  const netAmount = useMemo(() => {
    const amount = parseFloat(withdrawAmount) || 0;
    return amount * (1 - COMMISSION_RATE);
  }, [withdrawAmount]);

  const handleWithdrawAction = () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) return;
    
    setWithdrawStep('processing');
    setTimeout(() => {
      setBalance(prev => prev - amount);
      setWithdrawStep('success');
    }, 2500);
  };

  const handleAutoDetectDirection = async () => {
    setIsDetecting(true);
    try {
      const historyStrings = MOCK_HISTORY.map(h => h.destination);
      const prediction = await predictNextDirection(historyStrings);
      setCurrentDirection(prediction);
      setShowDirectionSaved(true);
      setTimeout(() => setShowDirectionSaved(false), 3000);
    } catch (e) {
      console.error(e);
      setCurrentDirection('Aéroport Léon Mba'); // Fallback
    } finally {
      setIsDetecting(false);
    }
  };

  const filteredHistory = useMemo(() => {
    const now = new Date();
    return MOCK_HISTORY.filter(ride => {
      const diffTime = Math.abs(now.getTime() - ride.date.getTime());
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      if (filterPeriod === 'day') return diffDays <= 1;
      if (filterPeriod === 'week') return diffDays <= 7;
      return diffDays <= 30;
    });
  }, [filterPeriod]);

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500 pb-24 h-full overflow-y-auto bg-slate-50/50">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tighter">Espace Chauffeur</h2>
          <p className="text-xs text-slate-500 font-medium">Content de vous revoir, {registeredDriver?.fullName.split(' ')[0] || 'Chef'}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
             <Zap className="w-3 h-3 fill-current" />
             <span className="text-[10px] font-black uppercase tracking-widest">En Service</span>
          </div>
          <button 
            onClick={() => setIsCollectiveMode(!isCollectiveMode)}
            className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${isCollectiveMode ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-200 text-slate-500'}`}
          >
            {isCollectiveMode ? 'Mode Collectif Actif' : 'Passer en Collectif'}
          </button>
        </div>
      </div>

      {/* Wallet Card */}
      <div className="bg-slate-900 rounded-[2.5rem] p-6 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-500 overflow-hidden">
                  <img src={user?.photo} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{registeredDriver?.nsNumber || 'NS-MARAUDE'}</p>
                   <p className="text-xs font-black text-indigo-400 tracking-widest uppercase">{registeredDriver?.licensePlate || 'PAS DE PLAQUE'}</p>
                </div>
             </div>
             <button onClick={() => setShowBadge(true)} className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-all">
                <QrCode className="w-5 h-5 text-indigo-300" />
             </button>
          </div>
          <div className="text-3xl font-black mb-6">{balance.toLocaleString()} FCFA</div>
          <button 
            onClick={() => setIsWithdrawOpen(true)}
            className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-indigo-50 transition-colors active:scale-95"
          >
            <Banknote className="w-4 h-4" />
            RETIRER MES GAINS
          </button>
        </div>
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Ma Position & Direction IA */}
      <section className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
              <MapPin className="w-4 h-4 text-emerald-500" />
            </div>
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Ma Position Actuelle</h3>
          </div>
          {currentLocation && (
            <span className="text-[9px] font-black text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">GPS ACTIF</span>
          )}
        </div>

        <div className="flex gap-3 items-center">
          <div className="flex-1 p-4 bg-slate-50 rounded-2xl border border-transparent flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${currentLocation ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase">Quartier détecté</p>
              <p className="text-sm font-black text-slate-800">
                {currentLocation ? currentLocation.neighborhood : 'Position non détectée'}
              </p>
              {currentLocation && (
                <p className="text-[8px] text-slate-400 font-bold">Lat: {currentLocation.lat.toFixed(4)} • Lng: {currentLocation.lng.toFixed(4)}</p>
              )}
            </div>
          </div>
          <button 
            onClick={handleDetectLocation}
            disabled={isDetecting}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all active:scale-95 shadow-lg ${isDetecting ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-900 text-emerald-400'}`}
          >
            {isDetecting ? <Loader2 className="w-6 h-6 animate-spin" /> : <RefreshCw className="w-6 h-6" />}
          </button>
        </div>

        {currentLocation && (
          <div className="mt-4">
            <GpsMap 
              driverLoc={{ lat: currentLocation.lat, lng: currentLocation.lng }} 
              height="180px"
            />
          </div>
        )}

        <div className="h-px bg-slate-100 mx-2"></div>

        <div className="flex items-center justify-between px-2 pt-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
              <Compass className="w-4 h-4 text-indigo-500" />
            </div>
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Direction Inteligente</h3>
          </div>
          {showDirectionSaved && (
            <span className="text-[9px] font-black text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full animate-bounce">IA ACTIVE</span>
          )}
        </div>
        
        <div className="flex gap-3">
          <div className="flex-1 relative group">
            <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
            <input 
              type="text" 
              value={currentDirection}
              onChange={(e) => setCurrentDirection(e.target.value)}
              className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold text-slate-800 outline-none focus:bg-white focus:border-indigo-500 transition-all"
              placeholder="Direction (ex: Owendo)..."
            />
          </div>
          <button 
            onClick={handleAutoDetectDirection}
            disabled={isDetecting}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all active:scale-95 shadow-lg ${isDetecting ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-900 text-indigo-400'}`}
          >
            {isDetecting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
          </button>
        </div>

        {/* Radar Client / Points Chauds */}
        <div className="pt-4 space-y-3">
           <div className="flex items-center justify-between px-2">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Compass className="w-3 h-3 text-emerald-500" /> Radar de ramassage
              </h3>
              <span className="text-[9px] font-black text-amber-600 bg-amber-50 px-2 py-1 rounded-full">{HOTSPOTS.reduce((acc, h) => acc + h.clients, 0)} clients en attente</span>
           </div>
           <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
              {HOTSPOTS.map((h, i) => (
                <div key={i} className="min-w-[140px] bg-white border border-slate-100 p-4 rounded-3xl shadow-sm text-center">
                  <p className="text-[9px] font-black text-slate-400 uppercase truncate mb-1">{h.name}</p>
                  <p className="text-xl font-black text-slate-800">{h.clients}</p>
                  <p className="text-[8px] font-black text-emerald-600 uppercase mt-1">Passagers</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Notifications IA Match */}
      {matchedRequests.length > 0 && (
        <section className="space-y-3 animate-in slide-in-from-bottom-4">
          <div className="flex items-center gap-2 px-2">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Suggestions sur votre trajet</h3>
          </div>
          {matchedRequests.map(req => (
            <div key={req.id} className={`bg-white border-2 p-4 rounded-3xl flex items-center justify-between shadow-sm ${req.rideMode === 'COLLECTIVE' ? 'border-emerald-100' : 'border-indigo-100'}`}>
              <div className="flex gap-4 items-center">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${req.rideMode === 'COLLECTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>
                  {req.rideMode === 'COLLECTIVE' ? <Users className="w-6 h-6" /> : req.clientName[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-black text-slate-800">{req.clientName}</div>
                    {req.rideMode === 'COLLECTIVE' && (
                      <span className="text-[8px] font-black bg-emerald-500 text-white px-1.5 py-0.5 rounded uppercase tracking-tighter">Collectif</span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-indigo-500" /> {req.destination}
                  </div>
                  {req.pickupPointName && (
                    <div className="text-[9px] text-amber-600 font-black flex items-center gap-1 uppercase tracking-tight">
                      <Clock className="w-3 h-3" /> Pickup: {req.pickupPointName}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black text-emerald-600">{req.price} FCFA</div>
                {req.seats && <div className="text-[9px] font-black text-slate-400 uppercase">{req.seats} Siège(s)</div>}
                <button 
                  onClick={() => handleStartNegotiation(req)}
                  className="text-[10px] font-black bg-indigo-600 text-white px-3 py-1.5 rounded-xl mt-1 active:scale-95 flex items-center gap-1"
                >
                  <MessageSquareQuote className="w-3 h-3" /> NÉGOCIER
                </button>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Negotiation Modal */}
      {negotiatingWith && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-slate-900 p-6 text-white relative">
               <button onClick={() => setNegotiatingWith(null)} className="absolute right-4 top-4 text-slate-400"><X className="w-5 h-5"/></button>
               <h3 className="font-black text-lg">Négocier avec {negotiatingWith.clientName}</h3>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Vers {negotiatingWith.destination}</p>
            </div>
            <div className="p-6 space-y-4">
               <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Offre Client</span>
                  <span className="text-xl font-black text-slate-800">{negotiatingWith.price} F</span>
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase px-2">Ma réponse / Contre-offre</label>
                 <textarea 
                  value={negotiationText}
                  onChange={(e) => setNegotiationText(e.target.value)}
                  className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-sm outline-none border focus:border-indigo-500 h-24"
                  placeholder="Écrivez votre prix ou un message..."
                 />
               </div>
               <button 
                onClick={handleSendResponse}
                className="w-full py-4 gradient-primary text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl flex items-center justify-center gap-2 active:scale-95"
               >
                 <Send className="w-4 h-4" /> Envoyer au client
               </button>
               <button 
                onClick={() => onAcceptRequest({
                  id: negotiatingWith.id,
                  driverName: registeredDriver?.firstName || 'Moi',
                  vehiclePlate: registeredDriver?.licensePlate || 'GA-MAR-241',
                  type: registeredDriver?.vehicleType || TransportType.TAXI,
                  startTime: Date.now(),
                  destination: negotiatingWith.destination,
                  isLocationShared: true,
                  price: negotiatingWith.price,
                  status: 'ACCEPTED',
                  rideMode: negotiatingWith.rideMode || 'PRIVATE',
                  isRoadside: true,
                  seatsRequested: negotiatingWith.seats || 1
                })}
                className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl flex items-center justify-center gap-2 active:scale-95"
               >
                 <CheckCircle2 className="w-4 h-4" /> Accepter tel quel
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Badge Modal */}
      {showBadge && (
        <div className="fixed inset-0 z-[210] bg-slate-900 flex flex-col items-center justify-center p-8 text-center space-y-8 animate-in zoom-in-110 duration-500">
           <button onClick={() => setShowBadge(false)} className="absolute top-8 right-8 text-white/40"><X className="w-8 h-8"/></button>
           
           <div className="space-y-2">
             <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-inner mb-4">
                <ShieldCheck className="w-10 h-10" />
             </div>
             <h2 className="text-3xl font-black text-white tracking-tight leading-none uppercase">Badge Certifié</h2>
             <p className="text-sm text-slate-400 font-medium px-4">
               {registeredDriver?.firstName} {registeredDriver?.lastName}
             </p>
           </div>

           <div className="w-full space-y-4">
              <div id="print-badge" className="bg-amber-400 p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(251,191,36,0.3)] border-[6px] border-white relative overflow-hidden group">
                 <div className="absolute top-0 right-0 bg-slate-900 text-white px-4 py-1.5 rounded-bl-2xl font-black text-[9px] uppercase tracking-widest">OFFICIEL MARAUDE</div>
                 <div className="flex flex-col items-center">
                   <p className="text-slate-900 font-black text-[10px] uppercase tracking-[0.3em] mb-2 opacity-80 text-center">NUMÉRO DE PORTIÈRE</p>
                   <h1 className="text-8xl font-black text-slate-900 tracking-tighter mb-4 drop-shadow-lg">{registeredDriver?.nsNumber || 'NS-XXXX'}</h1>
                   <div className="h-px w-full bg-slate-900/10 mb-4"></div>
                   <div className="flex flex-col gap-1 items-center">
                    <p className="text-slate-900 font-black text-[10px] uppercase tracking-[0.2em] opacity-60">PLAQUE : {registeredDriver?.licensePlate}</p>
                    <p className="text-slate-900 font-black text-[8px] uppercase tracking-[0.2em] opacity-40">{registeredDriver?.vehicleType} • {registeredDriver?.color}</p>
                   </div>
                 </div>
              </div>
           </div>

           <div className="flex flex-col w-full gap-3">
            <button 
              onClick={() => window.print()}
              className="w-full py-5 bg-white text-slate-900 rounded-[2.2rem] font-black uppercase text-xs tracking-widest shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <FileText className="w-5 h-5" /> Imprimer le Badge
            </button>
            <button 
              onClick={() => setShowBadge(false)}
              className="w-full py-4 text-white/60 font-black uppercase text-[10px] tracking-widest"
            >
              Fermer
            </button>
           </div>
        </div>
      )}

      {/* Historique avec filtre ou Annonces */}
      <section className="space-y-4">
        <div className="flex gap-2 p-1 bg-slate-200/50 rounded-2xl">
          <button 
            onClick={() => setActiveTab('activity')}
            className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase transition-all flex items-center justify-center gap-2 ${activeTab === 'activity' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
          >
            <HistoryIcon className="w-3 h-3" />
            Activité Récente
          </button>
          <button 
            onClick={() => setActiveTab('announcements')}
            className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase transition-all flex items-center justify-center gap-2 ${activeTab === 'announcements' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
          >
            <Bell className="w-3 h-3" />
            Annonces
          </button>
        </div>

        {activeTab === 'activity' ? (
          <div className="space-y-4 animate-in slide-in-from-left-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Courses Récentes</h3>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                {(['day', 'week', 'month'] as FilterPeriod[]).map(p => (
                  <button 
                    key={p}
                    onClick={() => setFilterPeriod(p)}
                    className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all ${filterPeriod === p ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                  >
                    {p === 'day' ? 'Jour' : p === 'week' ? 'Semaine' : 'Mois'}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {filteredHistory.map(ride => (
                <div key={ride.id} className="bg-white p-4 rounded-[2rem] border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                      <HistoryIcon className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">{ride.destination}</div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        {ride.date.toLocaleDateString('fr-FR')} • {ride.type}
                      </div>
                    </div>
                  </div>
                  <div className="font-black text-slate-800 text-sm">+{ride.price}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-in slide-in-from-right-4">
            <div className="px-2">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Annonces à venir</h3>
            </div>
            <div className="space-y-3">
              {MOCK_ANNOUNCEMENTS.map(announcement => (
                <div key={announcement.id} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        announcement.type === 'PROMO' ? 'bg-emerald-50 text-emerald-600' : 
                        announcement.type === 'ALERT' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {announcement.type === 'PROMO' ? <Zap className="w-4 h-4" /> : 
                         announcement.type === 'ALERT' ? <AlertCircle className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                      </div>
                      <h4 className="font-black text-slate-800 text-sm">{announcement.title}</h4>
                    </div>
                    <span className="text-[9px] font-black text-slate-400 uppercase">{announcement.date}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    {announcement.content}
                  </p>
                  <button className="w-full py-3 bg-slate-50 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-widest hover:bg-slate-100 transition-colors">
                    En savoir plus
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default DriverDashboard;
