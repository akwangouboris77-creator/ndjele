import React, { useState, useEffect } from 'react';
import { MapPin, ArrowLeft, MessageSquareQuote, Car, Bike, Search, CheckCircle, Loader2, CreditCard, ShieldCheck, Info, Smartphone, Copy } from 'lucide-react';
import { negotiatePrice } from '../services/geminiService';
import { TransportType, ViewState, ActiveRide, Driver } from '../types';

interface BookingViewProps {
  onNavigate: (view: ViewState) => void;
  onStartRideRequest: (ride: ActiveRide) => void;
}

const MOCK_DRIVERS: Driver[] = [
  { id: '1', name: 'Jean-Marc N.', type: TransportType.TAXI, rating: 4.8, distance: 0.5, location: { lat: 0.39, lng: 9.45 }, currentDestination: 'Aéroport' },
  { id: '2', name: 'Alain M.', type: TransportType.TAXI, rating: 4.9, distance: 1.2, location: { lat: 0.38, lng: 9.46 }, currentDestination: 'Nzeng-Ayong' },
  { id: '3', name: 'Cédric T.', type: TransportType.TAXI, rating: 4.7, distance: 2.1, location: { lat: 0.40, lng: 9.44 }, currentDestination: 'Owendo' },
];

const NDJELE_NUMBERS = {
  AIRTEL: '077 21 89 76',
  MOOV: '062 70 23 74'
};

const BookingView: React.FC<BookingViewProps> = ({ onNavigate, onStartRideRequest }) => {
  const [step, setStep] = useState(1);
  const [destination, setDestination] = useState('');
  const [matchingDrivers, setMatchingDrivers] = useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [offer, setOffer] = useState(500);
  const [loading, setLoading] = useState(false);
  const [negotiationResult, setNegotiationResult] = useState<{ reply: string, finalPrice: number } | null>(null);
  const [paymentProvider, setPaymentProvider] = useState<'AIRTEL' | 'MOOV' | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const COMMISSION_RATE = 0.09;

  useEffect(() => {
    if (destination.length >= 2) {
      const matches = MOCK_DRIVERS.filter(d => d.currentDestination?.toLowerCase().includes(destination.toLowerCase()));
      setMatchingDrivers(matches);
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
    setTimeout(() => {
      if (!selectedDriver || !negotiationResult) return;
      onStartRideRequest({
        id: Math.random().toString(36).substr(2, 9),
        driverName: selectedDriver.name,
        vehiclePlate: 'GA-' + Math.floor(1000 + Math.random() * 9000) + '-TX',
        type: selectedDriver.type,
        startTime: 0,
        destination: destination,
        isLocationShared: false,
        price: negotiationResult.finalPrice,
        status: 'PENDING'
      });
      setIsConfirming(false);
    }, 2000);
  };

  return (
    <div className="p-6 space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-4">
        <button onClick={() => onNavigate('home')} className="p-2 bg-white rounded-full shadow-sm">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Ndjele Go</h2>
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <div className="space-y-3">
            <input 
              type="text" 
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Où allez-vous ?" 
              className="w-full px-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-800 font-bold text-sm focus:border-emerald-500 outline-none shadow-sm"
            />
          </div>

          <div className="space-y-3">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Chauffeurs sur votre route</h3>
            {matchingDrivers.map(d => (
              <button 
                key={d.id}
                onClick={() => setSelectedDriver(d)}
                className={`w-full p-4 rounded-3xl border text-left transition-all flex items-center gap-4 ${selectedDriver?.id === d.id ? 'bg-emerald-50 border-emerald-400' : 'bg-white border-slate-100 shadow-sm'}`}
              >
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-2xl">🚕</div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800 text-sm">{d.name}</h4>
                  <p className="text-[9px] text-slate-400 font-black uppercase">Direction: {d.currentDestination}</p>
                </div>
                {selectedDriver?.id === d.id && <CheckCircle className="w-6 h-6 text-emerald-600" />}
              </button>
            ))}
          </div>

          <button 
            disabled={!selectedDriver}
            onClick={() => setStep(2)}
            className="w-full py-5 gradient-primary text-white rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl disabled:opacity-50"
          >
            Négocier & Payer
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div className="bg-slate-900 p-8 rounded-[3rem] text-white space-y-6 shadow-2xl text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Votre proposition</p>
            <div className="text-5xl font-black mt-3 text-emerald-400 tracking-tighter">
              {offer.toLocaleString()} <span className="text-xl font-normal text-slate-500">F</span>
            </div>
            <input 
              type="range" min="500" max="5000" step="100" value={offer}
              onChange={(e) => setOffer(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>
          <button 
            disabled={loading}
            onClick={handleNegotiate}
            className="w-full py-5 gradient-primary text-white rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Négocier avec l\'IA'}
            <MessageSquareQuote className="w-5 h-5" />
          </button>
        </div>
      )}

      {step === 3 && negotiationResult && (
        <div className="space-y-6 animate-in slide-in-from-bottom-6">
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-4">
            <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase">
              <span>Tarif Course</span>
              <span className="text-slate-800">{totalWithFees} F</span>
            </div>
            
            <p className="text-xs font-bold text-slate-500 text-center px-4 italic">"Faites le transfert vers l'un des comptes Ndjele pour bloquer le chauffeur."</p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button 
                onClick={() => setPaymentProvider('AIRTEL')}
                className={`p-4 rounded-3xl border-2 flex flex-col items-center gap-2 transition-all ${paymentProvider === 'AIRTEL' ? 'border-red-500 bg-red-50 shadow-md scale-105' : 'border-slate-100 bg-slate-50 opacity-60'}`}
              >
                <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white font-black">A</div>
                <span className="text-[10px] font-black uppercase text-slate-800 tracking-tighter">Airtel Money</span>
              </button>
              <button 
                onClick={() => setPaymentProvider('MOOV')}
                className={`p-4 rounded-3xl border-2 flex flex-col items-center gap-2 transition-all ${paymentProvider === 'MOOV' ? 'border-blue-500 bg-blue-50 shadow-md scale-105' : 'border-slate-100 bg-slate-50 opacity-60'}`}
              >
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black">M</div>
                <span className="text-[10px] font-black uppercase text-slate-800 tracking-tighter">Moov Money</span>
              </button>
            </div>

            {paymentProvider && (
              <div className="bg-slate-900 rounded-3xl p-5 text-center space-y-3 animate-in zoom-in-95">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Numéro Officiel Ndjele</p>
                <div className="flex items-center justify-center gap-3">
                  <h4 className="text-2xl font-black text-white tracking-widest">
                    {paymentProvider === 'AIRTEL' ? NDJELE_NUMBERS.AIRTEL : NDJELE_NUMBERS.MOOV}
                  </h4>
                  <button className="p-2 bg-white/10 rounded-lg text-emerald-400 active:bg-white/20"><Copy className="w-4 h-4" /></button>
                </div>
                <div className="bg-amber-500/20 py-2 rounded-xl border border-amber-500/30">
                  <p className="text-[9px] font-black text-amber-200 uppercase">Transaction Définitive & Non-annulable</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex items-start gap-4">
             <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
             <p className="text-[10px] text-emerald-800 font-bold leading-relaxed">
               L'argent est sécurisé par Ndjele. Vous recevez un reçu dès que le transfert est détecté.
             </p>
          </div>

          <button 
            onClick={handleCompletePayment}
            disabled={!paymentProvider || isConfirming}
            className="w-full py-6 gradient-primary text-white rounded-[2.5rem] font-black uppercase text-xs tracking-widest shadow-2xl flex items-center justify-center gap-3 active:scale-95"
          >
            {isConfirming ? <Loader2 className="w-6 h-6 animate-spin" /> : <><CheckCircle className="w-6 h-6" /> J'ai envoyé les {totalWithFees} F</>}
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingView;