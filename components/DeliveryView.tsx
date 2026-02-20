
import React, { useState } from 'react';
import { Package, MapPin, Search, ArrowLeft, ArrowRight, Truck, Bike, Info, CheckCircle, Calculator, UserPlus, LayoutDashboard } from 'lucide-react';
import { ViewState, ActiveRide, TransportType, Livreur } from '../types';

interface DeliveryViewProps {
  onNavigate: (view: ViewState) => void;
  onStartRideRequest: (ride: ActiveRide) => void;
  registeredLivreur: Livreur | null;
}

const VEHICLE_PRICES = {
  [TransportType.DELIVERY_MOTO]: 1500,
  [TransportType.DELIVERY_CAR]: 3500
};

const DeliveryView: React.FC<DeliveryViewProps> = ({ onNavigate, onStartRideRequest, registeredLivreur }) => {
  const [step, setStep] = useState(1);
  const [packageType, setPackageType] = useState('Pli / Document');
  const [weight, setWeight] = useState('Light');
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<TransportType | null>(null);

  const calculateEstimate = () => {
    if (selectedVehicle && VEHICLE_PRICES[selectedVehicle as keyof typeof VEHICLE_PRICES]) {
      return VEHICLE_PRICES[selectedVehicle as keyof typeof VEHICLE_PRICES];
    }
    return weight === 'Light' ? 1500 : 3500;
  };

  const handleFinish = () => {
    const finalPrice = calculateEstimate();
    const ride: ActiveRide = {
      id: Math.random().toString(36).substr(2, 9),
      driverName: 'Livreur Ndjele',
      vehiclePlate: 'GA-DEL-99',
      type: selectedVehicle || TransportType.DELIVERY_MOTO,
      startTime: 0,
      destination: destination,
      isLocationShared: false,
      price: finalPrice,
      status: 'PENDING'
    };
    onStartRideRequest(ride);
  };

  return (
    <div className="p-6 space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('home')} className="p-2 bg-white rounded-full shadow-sm">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h2 className="text-2xl font-black text-slate-800">Ndjele Express</h2>
        </div>
        {!registeredLivreur ? (
          <button 
            onClick={() => onNavigate('delivery-registration')}
            className="p-3 bg-pink-50 text-pink-600 rounded-2xl flex items-center gap-2 font-bold text-[10px] uppercase"
          >
            <UserPlus className="w-4 h-4" /> Devenir Livreur
          </button>
        ) : (
          <button 
            onClick={() => onNavigate('delivery-dashboard')}
            className="p-3 bg-pink-600 text-white rounded-2xl flex items-center gap-2 font-bold text-[10px] uppercase shadow-lg shadow-pink-500/20"
          >
            <LayoutDashboard className="w-4 h-4" /> Espace Livreur
          </button>
        )}
      </div>

      {step === 1 && (
        <div className="space-y-6 animate-in fade-in">
          <div className="space-y-4">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Type de Colis</label>
            <div className="grid grid-cols-2 gap-3">
              {['Pli / Document', 'Repas / Courses', 'Électronique', 'Autres'].map((t) => (
                <button
                  key={t}
                  onClick={() => setPackageType(t)}
                  className={`p-4 rounded-2xl border-2 font-bold text-xs text-center transition-all ${
                    packageType === t ? 'border-pink-500 bg-pink-50 text-pink-600' : 'border-slate-100 text-slate-500'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Poids Estimé</label>
            <div className="flex gap-3">
              {[
                { id: 'Light', label: '< 5kg' },
                { id: 'Medium', label: '5-20kg' },
                { id: 'Heavy', label: '> 20kg' }
              ].map((w) => (
                <button
                  key={w.id}
                  onClick={() => setWeight(w.id)}
                  className={`flex-1 p-4 rounded-2xl border-2 font-black text-xs transition-all ${
                    weight === w.id ? 'border-pink-500 bg-pink-50 text-pink-600' : 'border-slate-100 text-slate-500'
                  }`}
                >
                  {w.label}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={() => setStep(2)}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            Suivant <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 animate-in fade-in">
          <div className="space-y-3">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500"></div>
              <input 
                type="text" 
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                placeholder="Lieu de ramassage" 
                className="w-full pl-10 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-800 font-bold text-sm"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-500" />
              <input 
                type="text" 
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Lieu de livraison" 
                className="w-full pl-10 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-800 font-bold text-sm"
              />
            </div>
          </div>

          <div className="bg-pink-50 p-4 rounded-2xl flex items-start gap-3 border border-pink-100">
            <Info className="w-5 h-5 text-pink-600 shrink-0" />
            <p className="text-[10px] text-pink-800 font-medium leading-relaxed">
              Assurez-vous que le destinataire est présent lors de la livraison. Vous pourrez suivre le livreur en temps réel.
            </p>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 py-4 bg-slate-100 text-slate-400 rounded-2xl font-bold">Retour</button>
            <button 
              disabled={!pickup || !destination}
              onClick={() => setStep(3)}
              className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-50"
            >
              Voir les tarifs <Calculator className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6 animate-in zoom-in-95">
          <div className="space-y-4">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Choisissez le véhicule</label>
            <div className="space-y-3">
              {[
                { id: TransportType.DELIVERY_MOTO, label: 'Moto Rapide', time: '12 min', price: 1500, icon: Bike, desc: 'Idéal pour les plis et repas' },
                { id: TransportType.DELIVERY_CAR, label: 'Véhicule Berline', time: '25 min', price: 3500, icon: Truck, desc: 'Pour les colis volumineux' }
              ].map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVehicle(v.id)}
                  className={`w-full p-4 rounded-3xl border-2 flex items-center gap-4 transition-all ${
                    selectedVehicle === v.id ? 'border-pink-500 bg-pink-50 shadow-md' : 'border-slate-100 bg-white'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${selectedVehicle === v.id ? 'bg-pink-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    <v.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800">{v.label}</span>
                      <span className="text-sm font-black text-pink-600">{v.price} F</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium">{v.desc}</p>
                  </div>
                  {selectedVehicle === v.id && <CheckCircle className="w-5 h-5 text-pink-500" />}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-3xl text-white space-y-4 shadow-xl">
             <div className="flex justify-between items-center text-xs opacity-60 font-bold uppercase tracking-widest">
               <span>Récapitulatif</span>
               <span>{packageType}</span>
             </div>
             <div className="flex justify-between items-end">
               <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Total Estimé</p>
                  <p className="text-3xl font-black text-pink-500">{calculateEstimate()} <span className="text-sm font-normal text-slate-500">F</span></p>
               </div>
               <button onClick={handleFinish} disabled={!selectedVehicle} className="px-8 py-3 bg-pink-500 text-white rounded-2xl font-black text-xs uppercase shadow-lg shadow-pink-500/20 active:scale-95 disabled:opacity-50">
                 Confirmer
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryView;
