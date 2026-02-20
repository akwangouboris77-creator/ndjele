
import React, { useState, useEffect, useRef } from 'react';
import { QrCode, Wifi, ArrowLeft, MapPin, ShieldCheck, Share2, Search, Navigation, CheckCircle2, MessageSquareQuote, X, Smartphone, Clock, ArrowRight, Star, Loader2, MapPinIcon } from 'lucide-react';
import { ViewState, ActiveRide, TransportType, Driver } from '../types';
import { negotiatePrice, getNeighborhoodFromCoords } from '../services/geminiService';

interface MaraudeViewProps {
  onNavigate: (view: ViewState) => void;
  onStartRide: (ride: ActiveRide) => void;
}

const MOCK_NEARBY_DRIVERS: Driver[] = [
  { id: 'm1', name: 'Ousmane B.', type: TransportType.TAXI, rating: 4.7, distance: 0.2, location: { lat: 0.39, lng: 9.45 }, currentDestination: 'Akanda' },
  { id: 'm2', name: 'Moussa K.', type: TransportType.TAXI, rating: 4.8, distance: 0.4, location: { lat: 0.38, lng: 9.46 }, currentDestination: 'Nzeng-Ayong' },
  { id: 'm3', name: 'Guy R.', type: TransportType.TAXI, rating: 4.6, distance: 0.1, location: { lat: 0.40, lng: 9.44 }, currentDestination: 'Owendo' },
];

const POPULAR_DESTINATIONS = [
  "Aéroport Léon Mba",
  "Marché Mont-Bouët",
  "Nzeng-Ayong",
  "Akanda (Cité Delta)",
  "Owendo (Port)",
  "Louis",
  "Glass",
  "PK12",
  "Charbonnages",
  "Sablière",
  "Camp de Gaulle"
];

const MaraudeView: React.FC<MaraudeViewProps> = ({ onNavigate, onStartRide }) => {
  const [step, setStep] = useState<'destination' | 'radar' | 'negotiate' | 'waiting'>('destination');
  const [destination, setDestination] = useState('');
  const [currentLocationName, setCurrentLocationName] = useState('En bordure de route');
  const [isLocating, setIsLocating] = useState(false);
  const [foundDrivers, setFoundDrivers] = useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [offer, setOffer] = useState(500);
  const [loading, setLoading] = useState(false);
  const [negotiationResult, setNegotiationResult] = useState<{ reply: string, finalPrice: number } | null>(null);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const suggestionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('ndjele_recent_searches');
    if (saved) setRecentSearches(JSON.parse(saved));

    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    handleDetectLocation();
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    
    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const neighborhood = await getNeighborhoodFromCoords(position.coords.latitude, position.coords.longitude);
        setCurrentLocationName(neighborhood || 'Bordure de route');
      } catch (e) {
        setCurrentLocationName('Zone indéterminée');
      } finally {
        setIsLocating(false);
      }
    }, (error) => {
      console.warn(`GEO ERROR(${error.code}): ${error.message}`);
      setCurrentLocationName('Bordure de route (GPS)');
      setIsLocating(false);
    }, geoOptions);
  };

  useEffect(() => {
    if (step === 'radar') {
      const timer = setTimeout(() => {
        const matches = MOCK_NEARBY_DRIVERS.filter(d => 
          destination.length > 0 && (d.currentDestination?.toLowerCase().includes(destination.toLowerCase()) || Math.random() > 0.3)
        );
        setFoundDrivers(matches);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step, destination]);

  const handleSelectSuggestion = (place: string) => {
    setDestination(place);
    setShowSuggestions(false);
    addToHistory(place);
  };

  const addToHistory = (place: string) => {
    const updated = [place, ...recentSearches.filter(s => s !== place)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('ndjele_recent_searches', JSON.stringify(updated));
  };

  const handleStartNegotiation = async () => {
    setLoading(true);
    try {
      const res = await negotiatePrice(1000, offer, 'bord de route', 'ensoleillé');
      setNegotiationResult(res);
      setStep('negotiate');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = () => {
    setStep('waiting');
    setTimeout(() => {
      if (selectedDriver && negotiationResult) {
        onStartRide({
          id: 'maraude-' + Math.random().toString(36).substr(2, 5),
          driverName: selectedDriver.name,
          vehiclePlate: 'GA-MAR-241',
          type: selectedDriver.type,
          startTime: Date.now(),
          destination: destination,
          isLocationShared: false,
          price: negotiationResult.finalPrice,
          status: 'ACCEPTED'
        });
      }
    }, 4000);
  };

  const filteredPopular = POPULAR_DESTINATIONS.filter(p => 
    p.toLowerCase().includes(destination.toLowerCase()) && p !== destination
  );

  return (
    <div className="p-6 space-y-6 animate-in slide-in-from-left-4 duration-300 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('home')} className="p-2 bg-white rounded-full shadow-sm">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h2 className="text-2xl font-black text-slate-800">Bordure Digitale</h2>
        </div>
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">Maraude 2.0</span>
      </div>

      {step === 'destination' && (
        <div className="space-y-6 flex-1">
          <div className="bg-blue-600 p-6 rounded-[2.5rem] text-white space-y-4 shadow-xl relative z-20">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold opacity-80 uppercase tracking-widest">Position de détection</p>
              <button onClick={handleDetectLocation} className={`p-1 rounded-full transition-all ${isLocating ? 'bg-amber-500' : 'hover:bg-white/20'}`}>
                {isLocating ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <MapPinIcon className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className={`w-5 h-5 ${isLocating ? 'text-amber-300 animate-pulse' : 'text-amber-400'}`} />
              <span className="font-bold text-lg truncate pr-4">{isLocating ? 'Géolocalisation...' : currentLocationName}</span>
            </div>
            <div className="pt-4 border-t border-white/10 relative" ref={suggestionRef}>
              <label className="text-[10px] font-black opacity-60 uppercase block mb-2">Où voulez-vous aller ?</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  value={destination}
                  onChange={(e) => {
                    setDestination(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Ex: Charbonnages, PK12..." 
                  className="w-full pl-11 pr-4 py-4 bg-white rounded-2xl text-slate-800 font-bold text-sm outline-none shadow-inner"
                />
              </div>

              {showSuggestions && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-100 rounded-3xl shadow-2xl z-[60] max-h-60 overflow-y-auto animate-in slide-in-from-top-2 duration-200">
                  <div className="p-4">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Star className="w-3 h-3" /> Populaires à Libreville
                    </p>
                    <div className="space-y-1">
                      {filteredPopular.length > 0 ? (
                        filteredPopular.map((p, i) => (
                          <button 
                            key={i} 
                            onClick={() => handleSelectSuggestion(p)}
                            className="w-full text-left py-2 px-3 rounded-xl hover:bg-slate-50 text-slate-600 font-bold text-xs transition-colors"
                          >
                            {p}
                          </button>
                        ))
                      ) : (
                        <p className="text-[8px] text-slate-400 italic px-3">Pas de suggestion trouvée</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <button 
            disabled={destination.length < 3 || isLocating}
            onClick={() => {
              addToHistory(destination);
              setStep('radar');
            }}
            className="w-full py-4 gradient-primary text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-100 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            Lancer le radar <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {step === 'radar' && (
        <div className="space-y-6 flex-1 animate-in fade-in zoom-in-95">
          <div className="relative h-64 bg-slate-900 rounded-[2.5rem] overflow-hidden flex items-center justify-center shadow-2xl">
            <div className="absolute w-48 h-48 border border-blue-500/30 rounded-full animate-ping"></div>
            <div className="absolute w-32 h-32 border border-blue-500/50 rounded-full animate-pulse"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <Wifi className="w-8 h-8 text-blue-400 animate-bounce" />
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mt-2">Recherche de taxis...</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">
              Taxis proches vers {destination}
            </h3>
            <div className="space-y-3">
              {foundDrivers.length > 0 ? (
                foundDrivers.map((d) => (
                  <button 
                    key={d.id}
                    onClick={() => setSelectedDriver(d)}
                    className={`w-full p-4 rounded-3xl border text-left transition-all flex items-center gap-4 ${
                      selectedDriver?.id === d.id 
                      ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-100' 
                      : 'bg-white border-slate-100 shadow-sm'
                    }`}
                  >
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-xl">🚕</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800 text-sm">{d.name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">À {d.distance * 1000}m de vous</p>
                    </div>
                    {selectedDriver?.id === d.id && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                  </button>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400 italic text-xs">
                  Aucun taxi direct trouvé pour l'instant...
                </div>
              )}
            </div>
          </div>

          <button 
            disabled={!selectedDriver || loading}
            onClick={handleStartNegotiation}
            className="w-full py-4 gradient-primary text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-100 disabled:opacity-50"
          >
            {loading ? 'Consultation IA...' : 'Négocier avec ce chauffeur'}
          </button>
        </div>
      )}

      {step === 'negotiate' && negotiationResult && selectedDriver && (
        <div className="space-y-6 flex-1 animate-in slide-in-from-bottom-10">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-6">
            <p className="italic text-slate-600 text-lg leading-relaxed">
              "{negotiationResult.reply}"
            </p>

            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
              <span className="text-[10px] font-black text-slate-400 uppercase">Tarif Bordure</span>
              <span className="text-3xl font-black text-amber-600">{negotiationResult.finalPrice} F</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={handleSendRequest}
              className="flex-1 py-4 gradient-primary text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-100 flex items-center justify-center gap-2"
            >
              C'est bon, j'attends <Navigation className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setStep('radar')}
              className="px-6 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaraudeView;
