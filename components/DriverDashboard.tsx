import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, Users, Map as MapIcon, Calendar, Zap, AlertCircle, Phone, X, 
  Check, Smartphone, Banknote, ArrowDownCircle, ArrowUpCircle, Wallet, ArrowLeft,
  ChevronRight, CheckCircle2, Calculator, Sparkles, Navigation, Search, 
  User, Cpu, History as HistoryIcon, MapPin, Star, Clock, Bell, Layers, Info, 
  UserCheck, ShieldCheck, RefreshCw, Filter, ArrowRight, Loader2, Compass
} from 'lucide-react';
import { ActiveRide, TransportType, ViewState, DriverRegistration } from '../types';
import { predictNextDirection, getNeighborhoodFromCoords } from '../services/geminiService';

interface DriverDashboardProps {
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
  { id: 'req1', clientName: 'Marie T.', destination: 'Aéroport Léon Mba', price: 3000, distance: '400m' },
  { id: 'req2', clientName: 'Paul O.', destination: 'Akanda (Delta)', price: 4500, distance: '1.2km' },
  { id: 'req3', clientName: 'Lise M.', destination: 'Owendo (Port)', price: 2500, distance: '800m' },
  { id: 'req4', clientName: 'Kevin K.', destination: 'Louis', price: 1500, distance: '200m' },
  { id: 'req5', clientName: 'Sandra B.', destination: 'Nzeng-Ayong', price: 2000, distance: '1.5km' },
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
  { id: 'a3', title: 'Mise à jour Ndjele', content: 'Une nouvelle version de l\'application est disponible. Téléchargez-la pour de meilleures performances.', date: 'Hier', type: 'INFO' },
];

const DriverDashboard: React.FC<DriverDashboardProps> = ({ onNavigate, onAcceptRequest, registeredDriver }) => {
  const [balance, setBalance] = useState(48750);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<MobileProvider | null>(null);
  const [withdrawStep, setWithdrawStep] = useState<WithdrawStep>('amount');
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>('day');
  const [activeTab, setActiveTab] = useState<DashboardTab>('activity');
  
  const [currentDirection, setCurrentDirection] = useState('');
  const [currentLocation, setCurrentLocation] = useState<{ lat: number, lng: number, neighborhood: string } | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [showDirectionSaved, setShowDirectionSaved] = useState(false);

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
    if (!currentDirection || currentDirection.length < 3) return [];
    const dir = currentDirection.toLowerCase();
    return MOCK_AVAILABLE_REQUESTS.filter(req => 
      req.destination.toLowerCase().includes(dir) || dir.includes(req.destination.toLowerCase())
    );
  }, [currentDirection]);

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
        <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
           <Zap className="w-3 h-3 fill-current" />
           <span className="text-[10px] font-black uppercase">En Service</span>
        </div>
      </div>

      {/* Wallet Card */}
      <div className="bg-slate-900 rounded-[2.5rem] p-6 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Solde Actuel</span>
            <Wallet className="w-5 h-5 text-indigo-400" />
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
                <p className="text-[8px] text-slate-400 font-bold">Lat: {currentLocation.lat} • Lng: {currentLocation.lng}</p>
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
              placeholder="Saisissez votre destination..."
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
      </section>

      {/* Notifications IA Match */}
      {matchedRequests.length > 0 && (
        <section className="space-y-3 animate-in slide-in-from-bottom-4">
          <div className="flex items-center gap-2 px-2">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Suggestions sur votre trajet</h3>
          </div>
          {matchedRequests.map(req => (
            <div key={req.id} className="bg-white border-2 border-indigo-100 p-4 rounded-3xl flex items-center justify-between shadow-sm">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black">
                  {req.clientName[0]}
                </div>
                <div>
                  <div className="text-sm font-black text-slate-800">{req.clientName}</div>
                  <div className="text-[10px] text-indigo-500 font-bold flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {req.destination}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black text-emerald-600">{req.price} FCFA</div>
                <button className="text-[10px] font-black bg-indigo-600 text-white px-3 py-1.5 rounded-xl mt-1 active:scale-95">ACCEPTER</button>
              </div>
            </div>
          ))}
        </section>
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
