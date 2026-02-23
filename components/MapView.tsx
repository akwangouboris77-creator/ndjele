
import React from 'react';
import { ArrowLeft, MapPin, Navigation, Search, Layers, Compass, Info } from 'lucide-react';
import { ViewState } from '../types';

interface MapViewProps {
  onNavigate: (view: ViewState) => void;
}

const MapView: React.FC<MapViewProps> = ({ onNavigate }) => {
  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white p-6 border-b border-slate-100 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => onNavigate('home')} className="p-2 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div className="flex-1">
          <h2 className="text-lg font-black text-slate-900 tracking-tighter uppercase">Carte Ndjele</h2>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Libreville, Gabon</p>
        </div>
        <button className="p-2 bg-slate-50 rounded-full">
          <Layers className="w-5 h-5 text-slate-400" />
        </button>
      </header>

      {/* Search Bar Overlay */}
      <div className="px-6 py-4 absolute top-24 left-0 right-0 z-10 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md p-2 rounded-[2rem] shadow-2xl border border-white/20 flex items-center gap-2 pointer-events-auto">
          <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
            <Search className="w-5 h-5" />
          </div>
          <input 
            type="text" 
            placeholder="Où allez-vous ?" 
            className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-slate-800 placeholder:text-slate-400"
          />
          <button className="p-2 text-slate-400">
            <Compass className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Map Content */}
      <div className="flex-1 relative overflow-hidden">
        {/* Real Map via OpenStreetMap Iframe */}
        <iframe 
          title="Libreville Map"
          width="100%" 
          height="100%" 
          frameBorder="0" 
          scrolling="no" 
          marginHeight={0} 
          marginWidth={0} 
          src="https://www.openstreetmap.org/export/embed.html?bbox=9.3900,0.3500,9.5500,0.4500&layer=mapnik&marker=0.39,9.45"
          className="grayscale-[0.2] contrast-[1.1]"
        ></iframe>

        {/* Floating Action Buttons */}
        <div className="absolute bottom-28 right-6 flex flex-col gap-3">
          <button className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-slate-600 active:scale-95 transition-transform border border-slate-100">
            <Navigation className="w-6 h-6" />
          </button>
          <button className="w-12 h-12 bg-slate-900 rounded-2xl shadow-xl flex items-center justify-center text-white active:scale-95 transition-transform">
            <MapPin className="w-6 h-6" />
          </button>
        </div>

        {/* Info Card */}
        <div className="absolute bottom-6 left-6 right-6 bg-white p-5 rounded-[2.5rem] shadow-2xl border border-slate-100 animate-in slide-in-from-bottom-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
              <Info className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Zone de Service Active</h3>
              <p className="text-[10px] text-slate-500 font-bold leading-relaxed mt-1">
                Vous êtes dans la zone de couverture Ndjele. Les chauffeurs sont disponibles à Louis, Akanda et Nzeng-Ayong.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
