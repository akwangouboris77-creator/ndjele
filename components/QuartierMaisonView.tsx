
import React, { useState } from 'react';
import { Home, ArrowLeft, Navigation, Search, CheckCircle, MapPin, Clock, Star } from 'lucide-react';
import { ViewState, ActiveRide, TransportType } from '../types';

interface QuartierMaisonViewProps {
  onNavigate: (view: ViewState) => void;
  onStartRide: (ride: ActiveRide) => void;
}

const SECTORS = [
  { id: 's1', name: 'Nzeng-Ayong', icon: '🏘️', price: 500 },
  { id: 's2', name: 'PK5 - PK12', icon: '🚛', price: 300 },
  { id: 's3', name: 'Okala - Avorbam', icon: '🏖️', price: 500 },
  { id: 's4', name: 'Akébé - Kinguélé', icon: '🏠', price: 300 },
];

const LOCAL_DRIVERS = [
  { id: 'ld1', name: 'Tonton Paul', rating: 4.8, vehicle: 'Toyota Tercel Jaune', sector: 's1' },
  { id: 'ld2', name: 'Vieux Marc', rating: 4.6, vehicle: 'Nissan March', sector: 's1' },
  { id: 'ld3', name: 'Dimitri', rating: 4.9, vehicle: 'Toyota Starlet', sector: 's1' },
];

const QuartierMaisonView: React.FC<QuartierMaisonViewProps> = ({ onNavigate, onStartRide }) => {
  const [selectedSector, setSelectedSector] = useState<any>(null);
  const [selectedDriver, setSelectedDriver] = useState<any>(null);

  const handleBook = () => {
    if (!selectedSector || !selectedDriver) return;
    const ride: ActiveRide = {
      id: 'qm-' + Math.random().toString(36).substr(2, 5),
      driverName: selectedDriver.name,
      vehiclePlate: 'GA-QM-' + Math.floor(100 + Math.random() * 899),
      type: TransportType.QUARTIER_MAISON,
      startTime: Date.now(),
      destination: selectedSector.name,
      isLocationShared: false,
      price: selectedSector.price,
      status: 'ACCEPTED'
    };
    onStartRide(ride);
  };

  return (
    <div className="p-6 space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-4">
        <button onClick={() => onNavigate('home')} className="p-2 bg-white rounded-full shadow-sm">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h2 className="text-2xl font-black text-slate-800">Quartier-Maison</h2>
      </div>

      <div className="bg-amber-600 p-6 rounded-[2.5rem] text-white space-y-3 relative overflow-hidden shadow-xl">
        <h3 className="text-xl font-bold">Taxis de Zone</h3>
        <p className="text-xs text-amber-100 leading-relaxed">Les taxis qui vous déposent au plus profond de votre quartier. Prix fixes par zone.</p>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
      </div>

      <section className="space-y-4">
        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Choisissez votre zone</h4>
        <div className="grid grid-cols-2 gap-3">
          {SECTORS.map((s) => (
            <button
              key={s.id}
              onClick={() => { setSelectedSector(s); setSelectedDriver(null); }}
              className={`p-5 rounded-3xl border-2 text-left transition-all ${
                selectedSector?.id === s.id ? 'border-amber-500 bg-amber-50' : 'border-slate-100 bg-white'
              }`}
            >
              <span className="text-2xl mb-2 block">{s.icon}</span>
              <span className="font-bold text-slate-800 text-sm block">{s.name}</span>
              <span className="text-xs font-black text-amber-600 mt-1 block">{s.price} F</span>
            </button>
          ))}
        </div>
      </section>

      {selectedSector && (
        <section className="space-y-4 animate-in slide-in-from-bottom-4">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Chauffeurs disponibles</h4>
          <div className="space-y-3">
            {LOCAL_DRIVERS.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDriver(d)}
                className={`w-full p-4 rounded-3xl border-2 flex items-center gap-4 transition-all ${
                  selectedDriver?.id === d.id ? 'border-amber-500 bg-amber-50' : 'border-slate-100 bg-white shadow-sm'
                }`}
              >
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-xl shrink-0">👨🏾‍✈️</div>
                <div className="flex-1 text-left">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800 text-sm">{d.name}</span>
                    <div className="flex items-center gap-1">
                       <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                       <span className="text-[10px] font-black text-slate-600">{d.rating}</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{d.vehicle}</p>
                </div>
                {selectedDriver?.id === d.id && <CheckCircle className="w-5 h-5 text-amber-500" />}
              </button>
            ))}
          </div>
        </section>
      )}

      {selectedDriver && (
        <div className="bg-slate-900 p-6 rounded-[2.5rem] text-white flex items-center justify-between shadow-xl animate-in zoom-in-95">
           <div>
             <p className="text-[10px] font-black text-slate-400 uppercase">Tarif Zone</p>
             <p className="text-2xl font-black text-amber-500">{selectedSector.price} F</p>
           </div>
           <button 
             onClick={handleBook}
             className="px-8 py-4 bg-amber-500 text-white rounded-2xl font-black text-xs uppercase shadow-lg shadow-amber-500/20 active:scale-95 transition-transform"
           >
             C'est parti
           </button>
        </div>
      )}
    </div>
  );
};

export default QuartierMaisonView;
