
import React, { useState } from 'react';
import { Truck, MapPin, Users, ArrowLeft, Search, ArrowRight, Clock, Info, CheckCircle, Navigation } from 'lucide-react';
import { ViewState, ActiveRide, TransportType } from '../types';

interface ClandoViewProps {
  onNavigate: (view: ViewState) => void;
  onStartRide: (ride: ActiveRide) => void;
}

const CLANDO_LINES = [
  { id: 'l1', name: 'Ligne Charbonnages', route: 'Rond-point → Alibandeng', price: 100, wait: '2 min' },
  { id: 'l2', name: 'Ligne PK5-PK12', route: 'Marché Banane → Gare Routière', price: 200, wait: '5 min' },
  { id: 'l3', name: 'Ligne Akanda', route: 'Sheraton → Avorbam', price: 100, wait: '3 min' },
  { id: 'l4', name: 'Ligne Owendo', route: 'SNI → Port à bois', price: 200, wait: '7 min' },
];

const ClandoView: React.FC<ClandoViewProps> = ({ onNavigate, onStartRide }) => {
  const [selectedLine, setSelectedLine] = useState<any>(null);
  const [seats, setSeats] = useState(1);

  const handleBook = () => {
    if (!selectedLine) return;
    const ride: ActiveRide = {
      id: 'clando-' + Math.random().toString(36).substr(2, 5),
      driverName: 'Chauffeur Ligne ' + selectedLine.name.split(' ')[1],
      vehiclePlate: 'GA-CLD-' + (Math.floor(Math.random()*900)+100),
      type: TransportType.CLANDO,
      startTime: Date.now(),
      destination: selectedLine.route.split('→')[1].trim(),
      isLocationShared: false,
      price: selectedLine.price * seats,
      status: 'ACCEPTED'
    };
    onStartRide(ride);
  };

  return (
    <div className="p-6 space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('home')} className="p-2 bg-white rounded-full shadow-sm">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h2 className="text-2xl font-black text-slate-800">Clando Ndjele</h2>
        </div>
        <span className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
          COLLECTIF
        </span>
      </div>

      <div className="bg-cyan-600 p-6 rounded-[2.5rem] text-white space-y-4 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <p className="text-[10px] font-black opacity-60 uppercase tracking-widest">Trajets de Quartier</p>
          <h3 className="text-xl font-bold">Transport à petit prix</h3>
          <p className="text-xs text-cyan-100 leading-relaxed">Le "Clando" digital vous permet de réserver votre place dans les véhicules de ligne habituels.</p>
        </div>
        <Truck className="absolute -bottom-4 -right-4 w-24 h-24 text-white/10" />
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Lignes Disponibles</h4>
          <Search className="w-4 h-4 text-slate-300" />
        </div>
        
        <div className="space-y-3">
          {CLANDO_LINES.map((line) => (
            <button
              key={line.id}
              onClick={() => setSelectedLine(line)}
              className={`w-full p-5 rounded-[2rem] border-2 text-left transition-all flex items-center gap-4 ${
                selectedLine?.id === line.id ? 'border-cyan-500 bg-cyan-50' : 'border-slate-100 bg-white shadow-sm'
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${selectedLine?.id === line.id ? 'bg-cyan-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                <Navigation className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800 text-sm">{line.name}</span>
                  <span className="text-sm font-black text-cyan-600">{line.price} F</span>
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase truncate mt-1">{line.route}</p>
                <div className="flex items-center gap-2 mt-2">
                   <Clock className="w-3 h-3 text-cyan-500" />
                   <span className="text-[10px] font-black text-cyan-700">Attente: {line.wait}</span>
                </div>
              </div>
              {selectedLine?.id === line.id && <CheckCircle className="w-5 h-5 text-cyan-500 shrink-0" />}
            </button>
          ))}
        </div>
      </section>

      {selectedLine && (
        <div className="bg-white border-2 border-slate-100 p-6 rounded-[2.5rem] space-y-6 animate-in slide-in-from-bottom-4 shadow-xl">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Nombre de places</label>
            <div className="flex gap-3">
              {[1, 2, 3, 4].map(n => (
                <button
                  key={n}
                  onClick={() => setSeats(n)}
                  className={`flex-1 py-3 rounded-2xl border-2 font-black transition-all ${
                    seats === n ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-100 text-slate-400'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase">Total</p>
               <p className="text-2xl font-black text-slate-900">{selectedLine.price * seats} F</p>
            </div>
            <button 
              onClick={handleBook}
              className="px-8 py-4 bg-cyan-600 text-white rounded-2xl font-black text-xs uppercase shadow-lg shadow-cyan-500/20 active:scale-95 transition-transform flex items-center gap-2"
            >
              Je monte <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClandoView;
