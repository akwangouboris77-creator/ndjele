
import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, Users, Map as MapIcon, Calendar, Zap, AlertCircle, Phone, X, 
  Check, Smartphone, Banknote, ArrowDownCircle, ArrowUpCircle, Wallet, ArrowLeft,
  ChevronRight, CheckCircle2, Calculator, Sparkles, Navigation, Search, 
  User, Cpu, History as HistoryIcon, MapPin, Star, Clock, Bell, Layers, Info, UserCheck, ShieldCheck, RefreshCw, Filter, ArrowRight, Loader2, Compass
} from 'lucide-react';
import { ActiveRide, TransportType, ViewState, DriverRegistration } from '../types';
import { predictNextDirection } from '../services/geminiService';

interface DriverDashboardProps {
  onNavigate: (view: ViewState) => void;
  onAcceptRequest: (ride: ActiveRide) => void;
  registeredDriver: DriverRegistration | null;
}

type FilterPeriod = 'day' | 'week' | 'month';
type WithdrawStep = 'amount' | 'provider' | 'confirmation' | 'processing' | 'success';
type MobileProvider = 'AIRTEL' | 'MOOV' | 'FLOOZ' | 'TMONEY';

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

const DriverDashboard: React.FC<DriverDashboardProps> = ({ onNavigate, onAcceptRequest, registeredDriver }) => {
  const [balance, setBalance] = useState(48750);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<MobileProvider | null>(null);
  const [withdrawStep, setWithdrawStep] = useState<WithdrawStep>('amount');
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>('day');
  
  const [currentDirection, setCurrentDirection] = useState('En attente...');
  const [isDetecting, setIsDetecting] = useState(false);
  const [showDirectionSaved, setShowDirectionSaved] = useState(false);

  const COMMISSION_RATE = 0.09;

  // Filtrage intelligent des notifications selon la direction
  const matchedRequests = useMemo(() => {
    if (!currentDirection || currentDirection === 'En attente...') return [];
    const dir = currentDirection.toLowerCase();
    return MOCK_AVAILABLE_REQUESTS.filter(req => 
      req.destination.toLowerCase().includes(dir) || dir.includes(req.destination.toLowerCase())
    );
  }, [currentDirection]);

  const handleWithdrawAction = () => {
    setWithdrawStep('processing');
    setTimeout(() => {
      setBalance(prev => prev - parseInt(withdrawAmount));
      setWithdrawStep('success');
    }, 2500);
  };

  const calculateNet = () => {
    const amount = parseInt(withdrawAmount) || 0;
    return amount - (amount * COMMISSION_RATE);
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
      setCurrentDirection('Aéroport Léon Mba');
    } finally {
      setIsDetecting(false);
    }
  };

  const filteredHistory = MOCK_HISTORY.filter(ride => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - ride.date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (filterPeriod === 'day') return diffDays <= 1;
    if (filterPeriod === 'week') return diffDays <= 7;
    if (filterPeriod === 'month') return diffDays <= 30;
    return true;
  });

  const resetWithdraw = () => {
    setIsWithdrawOpen(false);
    setWithdrawAmount('');
    setSelectedProvider(null);
    setWithdrawStep('amount');
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500 pb-24 h-full overflow-y-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-800 tracking-tighter">Espace Chauffeur</h2>
        <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
           <Zap className="w-3 h-3 fill-current" />
           <span className="text-[10px] font-black uppercase">En Service</span>
        </div>
      </div>

      {/* Ma Direction - Nouvelles fonctionnalité IA */}
      <section className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-500" />
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Ma Direction IA</h3>
          </div>
          {showDirectionSaved && (
            <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full animate-in fade-in slide-in-from-right-1">MIS À JOUR</span>
          )}
        </div>
        
        <div className="flex gap-3">
          <div className="flex-1 relative group">
            <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
            <input 
              type="text" 
              value={currentDirection}
              onChange={(e) => setCurrentDirection(e.target.value)}
              className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold text-slate-800 outline-none focus:bg-white focus:border-indigo-500 transition-all shadow-inner"
              placeholder="Où allez-vous ?"
            />
          </div>
          <button 
            onClick={handleAutoDetectDirection}
            disabled={isDetecting}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all active:scale-95 shadow-lg ${isDetecting ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-900 text-indigo-400 hover:bg-slate-800'}`}
            title="Détecter automatiquement via IA"
          >
            {isDetecting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
          </button>
        </div>
      </section>

      {/* NOUVELLE SECTION : Notifications de courses correspondantes */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-500" />
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Courses sur votre route</h3>
          </div>
          {matchedRequests.length > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white animate-bounce">
              {matchedRequests.length}
            </span>
          )}
        </div>

        <div className="space-y-3">
          {matchedRequests.length > 0 ? (
            matchedRequests.map(req => (
              <div key={req.id} className="bg-emerald-50 border-2 border-emerald-100 p-5 rounded-[2.5rem] shadow-sm animate-in slide-in-from-right-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{req.clientName}</h4>
                      <p className="text-[9px] font-black text-emerald-600 uppercase tracking-tighter">À {req.distance} de vous</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-slate-900 leading-none">{req.price} F</p>
                    <p className="text-[8px] font-black text-emerald-500 uppercase mt-1">Suggéré</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-slate-600 bg-white/50 p-3 rounded-2xl mb-4">
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                  <p className="text-xs font-bold truncate">Vers {req.destination}</p>
                </div>

                <button 
                  onClick={() => onAcceptRequest({
                    id: req.id,
                    driverName: registeredDriver?.firstName || 'Moi',
                    vehiclePlate: registeredDriver?.plate || 'GA-000-TX',
                    type: TransportType.TAXI,
                    startTime: Date.now(),
                    destination: req.destination,
                    isLocationShared: false,
                    price: req.price,
                    status: 'ACCEPTED'
                  })}
                  className="w-full py-3 bg-slate-900 text-emerald-400 rounded-2xl font-black text-[10px] uppercase shadow-lg active:scale-95 transition-transform"
                >
                  Accepter la course
                </button>
              </div>
            ))
          ) : (
            <div className="py-8 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] space-y-3">
              <Zap className="w-8 h-8 text-slate-200 mx-auto" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-8">
                {currentDirection === 'En attente...' 
                  ? 'Activez "Ma Direction" pour voir les courses correspondantes' 
                  : `Aucune course vers "${currentDirection}" pour le moment`}
              </p>
            </div>
          )}
        </div>
      </section>

      <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden text-center">
        <div className="relative z-10 flex flex-col items-center">
          <Wallet className="w-10 h-10 text-emerald-500 mb-2" />
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Solde Sécurisé Ndjele</p>
          <div className="flex items-end gap-2 mt-2">
            <span className="text-4xl font-black text-emerald-500">{balance.toLocaleString()}</span>
            <span className="text-xl font-medium text-slate-500 mb-1.5">F</span>
          </div>
          <button onClick={() => { setIsWithdrawOpen(true); setWithdrawStep('amount'); }} className="w-full mt-6 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest active:scale-95 shadow-xl shadow-emerald-500/20">
            Retirer mes gains
          </button>
        </div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
      </section>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
          <TrendingUp className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
          <p className="text-xl font-black text-slate-800">{filteredHistory.length} Courses</p>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Période sélectionnée</p>
        </div>
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
          <Star className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
          <p className="text-xl font-black text-slate-800">4.9</p>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Ma Note</p>
        </div>
      </div>

      {/* Section Historique des Courses */}
      <section className="space-y-4 pb-12">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
            <HistoryIcon className="w-4 h-4 text-emerald-600" />
            Historique des Courses
          </h3>
        </div>

        {/* Filtres de Période */}
        <div className="flex p-1 bg-slate-100 rounded-2xl gap-1">
          {(['day', 'week', 'month'] as FilterPeriod[]).map((period) => (
            <button
              key={period}
              onClick={() => setFilterPeriod(period)}
              className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${
                filterPeriod === period 
                ? 'bg-white text-emerald-600 shadow-sm' 
                : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {period === 'day' ? 'Jour' : period === 'week' ? 'Semaine' : 'Mois'}
            </button>
          ))}
        </div>

        {/* Liste des courses filtrées */}
        <div className="space-y-3">
          {filteredHistory.length > 0 ? (
            filteredHistory.map((ride) => (
              <div key={ride.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 group">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner group-hover:scale-105 transition-transform">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-800 text-sm truncate">{ride.destination}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Clock className="w-3 h-3 text-slate-300" />
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                      {ride.date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} • {ride.date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-emerald-600 text-sm">{ride.price.toLocaleString()} F</p>
                  <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Terminé</p>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
               <Filter className="w-10 h-10 text-slate-200 mx-auto mb-3" />
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Aucune course trouvée</p>
               <p className="text-[10px] text-slate-300 mt-1 px-8">Essayez de changer la période de filtrage.</p>
            </div>
          )}
        </div>
      </section>

      {isWithdrawOpen && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-end">
          <div className="w-full bg-white rounded-t-[3rem] p-8 space-y-6 animate-in slide-in-from-bottom-10 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-800">Retrait de Gains</h3>
              <button onClick={resetWithdraw} className="p-2 bg-slate-100 rounded-full"><X className="w-5 h-5" /></button>
            </div>

            {/* Barre de progression des étapes */}
            <div className="flex gap-2 mb-2">
              {(['amount', 'provider', 'confirmation'] as WithdrawStep[]).map((s, i) => (
                <div key={s} className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${
                  (withdrawStep === 'success' || withdrawStep === 'processing') ? 'bg-emerald-500' :
                  (withdrawStep === s) ? 'bg-emerald-500' : 
                  (i < ['amount', 'provider', 'confirmation'].indexOf(withdrawStep)) ? 'bg-emerald-200' : 'bg-slate-100'
                }`}></div>
              ))}
            </div>

            {withdrawStep === 'amount' && (
              <div className="space-y-6 animate-in slide-in-from-right-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Étape 1 : Montant à retirer (F)</label>
                  <div className="relative">
                    <Banknote className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-emerald-500" />
                    <input 
                      type="number" 
                      value={withdrawAmount} 
                      onChange={(e) => setWithdrawAmount(e.target.value)} 
                      placeholder="Min. 1000" 
                      className="w-full p-6 pl-16 bg-slate-50 rounded-3xl font-black text-3xl outline-none focus:border-emerald-500 border-2 border-transparent focus:bg-white transition-all shadow-inner" 
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold ml-2">Votre solde disponible : {balance.toLocaleString()} F</p>
                </div>

                <button 
                  disabled={!withdrawAmount || parseInt(withdrawAmount) < 1000 || parseInt(withdrawAmount) > balance}
                  onClick={() => setWithdrawStep('provider')} 
                  className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  Continuer <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {withdrawStep === 'provider' && (
              <div className="space-y-6 animate-in slide-in-from-right-4">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Étape 2 : Choisir le fournisseur</label>
                  <div className="grid grid-cols-2 gap-4">
                    {PROVIDERS.map(p => (
                      <button 
                        key={p.id}
                        onClick={() => { setSelectedProvider(p.id); setWithdrawStep('confirmation'); }}
                        className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-3 active:scale-95 ${
                          selectedProvider === p.id ? 'border-emerald-500 bg-emerald-50 shadow-md scale-105' : 'border-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <div className={`w-14 h-14 ${p.color} ${p.textColor} rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg`}>
                          {p.id[0]}
                        </div>
                        <span className="font-black text-[10px] uppercase tracking-tighter text-slate-800">{p.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => setWithdrawStep('amount')} 
                  className="w-full py-4 text-slate-400 font-black uppercase text-[10px] flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Modifier le montant
                </button>
              </div>
            )}

            {withdrawStep === 'confirmation' && selectedProvider && (
              <div className="space-y-6 animate-in slide-in-from-right-4">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Étape 3 : Confirmation finale</label>
                  
                  <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white space-y-4 shadow-xl">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                       <span>Transfert vers</span>
                       <span className="text-emerald-400">{PROVIDERS.find(p => p.id === selectedProvider)?.name}</span>
                    </div>
                    
                    <div className="pt-4 border-t border-white/10 space-y-3">
                       <div className="flex justify-between text-sm">
                         <span className="text-slate-400">Montant demandé</span>
                         <span className="font-bold">{parseInt(withdrawAmount).toLocaleString()} F</span>
                       </div>
                       <div className="flex justify-between text-sm">
                         <span className="text-slate-400">Frais de plateforme (9%)</span>
                         <span className="text-red-400 font-bold">-{(parseInt(withdrawAmount) * COMMISSION_RATE).toFixed(0)} F</span>
                       </div>
                    </div>

                    <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                       <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Net à recevoir</span>
                       <span className="text-3xl font-black">{calculateNet().toLocaleString()} F</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => setWithdrawStep('provider')} 
                    className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-[2rem] font-black uppercase text-[10px] active:scale-95"
                  >
                    Retour
                  </button>
                  <button 
                    onClick={handleWithdrawAction} 
                    className="flex-[2] py-5 bg-emerald-600 text-white rounded-[2rem] font-black uppercase text-[10px] tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95"
                  >
                    Confirmer le retrait
                  </button>
                </div>
              </div>
            )}

            {withdrawStep === 'processing' && (
              <div className="py-12 text-center space-y-4 animate-in fade-in">
                <div className="relative inline-block">
                  <RefreshCw className="w-16 h-16 text-emerald-500 animate-spin mx-auto" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-emerald-500/50" />
                  </div>
                </div>
                <p className="font-black text-slate-800 uppercase text-xs tracking-widest">Envoi en cours vers votre mobile...</p>
                <p className="text-[10px] text-slate-400">Veuillez patienter quelques secondes.</p>
              </div>
            )}

            {withdrawStep === 'success' && (
              <div className="py-8 text-center space-y-6 animate-in zoom-in-95">
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner relative">
                    <CheckCircle2 className="w-12 h-12" />
                    <div className="absolute inset-0 rounded-[2rem] border-4 border-emerald-500/20 animate-ping"></div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Transfert Réussi !</h4>
                  <p className="text-sm text-slate-500 px-4">Votre argent de <span className="font-bold text-slate-900">{calculateNet().toLocaleString()} F</span> a été envoyé sur votre compte mobile money.</p>
                </div>
                <button onClick={resetWithdraw} className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest">Retour au tableau de bord</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverDashboard;
