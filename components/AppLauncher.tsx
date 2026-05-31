import React from 'react';
import { Car, Briefcase, ChevronRight, ShieldCheck, HeartPulse, Hammer, Sparkles, Navigation } from 'lucide-react';

interface AppLauncherProps {
  onSelect: (module: 'MARAUDE' | 'SERVICES') => void;
  currentModule: 'MARAUDE' | 'SERVICES' | null;
}

const AppLauncher: React.FC<AppLauncherProps> = ({ onSelect, currentModule }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="space-y-2 text-center pt-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          Écosystème Maraude
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tighter">
          Portail Maraude
        </h1>
        <p className="text-slate-500 text-sm max-w-[280px] mx-auto font-medium">
          Une plateforme, deux applications dédiées pour tous vos besoins quotidiens.
        </p>
      </div>

      {/* Launcher Cards */}
      <div className="space-y-5 my-auto py-8">
        {/* App 1: Maraude Transport */}
        <button
          id="btn-launch-maraude"
          onClick={() => onSelect('MARAUDE')}
          className={`w-full text-left bg-white p-6 rounded-[2.5rem] border-2 transition-all duration-300 relative overflow-hidden group shadow-lg active:scale-[0.98] ${
            currentModule === 'MARAUDE' ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-100 hover:border-emerald-300'
          }`}
        >
          {/* Decorative background circle */}
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-emerald-500/5 rounded-full group-hover:scale-110 transition-transform duration-500"></div>

          <div className="flex items-start gap-4 relative z-10">
            <div className="w-14 h-14 bg-gradient-to-tr from-emerald-600 to-teal-500 text-white rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Car className="w-7 h-7" />
            </div>
            
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 text-lg block leading-tight">
                  Maraude Transport
                </span>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-slate-500 text-xs font-semibold leading-relaxed">
                Mobilité urbaine, courses immédiates et radar de proximité.
              </p>
              
              {/* Feature Tags/Bullet points */}
              <div className="flex flex-wrap gap-1.5 pt-3">
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-lg text-[9px] font-bold">🚕 Taxi Privé/Collectif</span>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-lg text-[9px] font-bold">👁️ Clando</span>
                <span className="px-2 py-0.5 bg-rose-50 text-rose-600 rounded-lg text-[9px] font-bold">🚨 Bouton SOS</span>
              </div>
            </div>
          </div>
        </button>

        {/* App 2: Maraude Services */}
        <button
          id="btn-launch-services"
          onClick={() => onSelect('SERVICES')}
          className={`w-full text-left bg-white p-6 rounded-[2.5rem] border-2 transition-all duration-300 relative overflow-hidden group shadow-lg active:scale-[0.98] ${
            currentModule === 'SERVICES' ? 'border-indigo-500 bg-indigo-50/20' : 'border-slate-100 hover:border-indigo-300'
          }`}
        >
          {/* Decorative background circle */}
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-indigo-500/5 rounded-full group-hover:scale-110 transition-transform duration-500"></div>

          <div className="flex items-start gap-4 relative z-10">
            <div className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white rounded-3xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Briefcase className="w-7 h-7" />
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 text-lg block leading-tight">
                  Maraude Services
                </span>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-slate-500 text-xs font-semibold leading-relaxed">
                Professionnels certifiés, experts médicaux et boutique locale.
              </p>

              {/* Feature Tags/Bullet points */}
              <div className="flex flex-wrap gap-1.5 pt-3">
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-lg text-[9px] font-bold">🏥 Médecin & Garde</span>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-lg text-[9px] font-bold">🛠️ Artisans</span>
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-lg text-[9px] font-bold">⚖️ Juriste & Expert</span>
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* Footer Branding */}
      <div className="text-center py-4 space-y-1">
        <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
          Maraude Gabon Tech
        </p>
        <p className="text-[9px] text-slate-400">
          Rejoignez le premier réseau certifié et sécurisé.
        </p>
      </div>
    </div>
  );
};

export default AppLauncher;
