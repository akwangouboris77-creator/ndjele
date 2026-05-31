
import React from 'react';
import { MapPin, Smartphone, Star, Car, Truck, ChevronRight, Package, Hammer, Crown, ShoppingBag, Plus, CreditCard, ArrowUpRight, CheckCircle2, Clock, Lock, Zap, Home, LayoutDashboard, AlertTriangle, Stethoscope, Pill, User as UserIcon, ShieldCheck, Gavel, BarChart3, Scale, Calculator, Dog, Brain, Ruler, Users, Navigation, ArrowRight, Briefcase } from 'lucide-react';
import { ViewState, ActiveRide, SubscriptionTier, MarketplaceOrder } from '../types';

interface HomeViewProps {
  onNavigate: (view: ViewState) => void;
  activeRide: ActiveRide | null;
  subscriptionTier: SubscriptionTier;
  activeOrders: MarketplaceOrder[];
  onUpdateOrder: (id: string, updates: Partial<MarketplaceOrder>) => void;
  userName: string;
  appModule: 'MARAUDE' | 'SERVICES';
  onSwitchModule: (module: 'MARAUDE' | 'SERVICES') => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onNavigate, activeRide, subscriptionTier, activeOrders, onUpdateOrder, userName, appModule, onSwitchModule }) => {
  const firstName = userName.split(' ')[0];
  const isFree = subscriptionTier === 'FREE';
  const isMaraudeMode = appModule === 'MARAUDE';

  return (
    <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top Welcome Section */}
      <section className="flex justify-between items-center bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
            Salut {firstName} 👋
          </h2>
          <p className="text-slate-500 font-medium text-xs">
            {isMaraudeMode ? "Bon voyage avec Maraude !" : "Vos prestations et soins à portée de main."}
          </p>
        </div>
        <button 
          onClick={() => onNavigate('subscription')} 
          className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-all ${
            isFree ? 'bg-slate-100 text-slate-600' : 'bg-emerald-600 text-white'
          }`}
        >
          <Crown className={`w-3.5 h-3.5 ${!isFree ? 'fill-white text-white' : 'text-emerald-600'}`} />
          <span className="text-[9px] font-black uppercase tracking-wider">
            {isFree ? 'PRO' : 'Premium'}
          </span>
        </button>
      </section>

      {/* Module Quick Switcher */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full">
        <button
          onClick={() => onSwitchModule('MARAUDE')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
            isMaraudeMode 
              ? 'bg-emerald-600 text-white shadow-md' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Car className="w-4 h-4" />
          <span>Maraude Transport</span>
        </button>
        <button
          onClick={() => onSwitchModule('SERVICES')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
            !isMaraudeMode 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Services & Pro</span>
        </button>
      </div>

      {/* RIDE ACTIVE OVERLAY (Only in Maraude/Transport app) */}
      {isMaraudeMode && activeRide && (
        <section onClick={() => onNavigate('ride-progress')} className="bg-emerald-50 p-6 rounded-[2.5rem] shadow-sm flex items-center justify-between border-2 border-emerald-500/20 animate-pulse cursor-pointer">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                 <Car className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">Course en cours</p>
                <p className="font-bold text-slate-900 truncate max-w-[150px]">Vers {activeRide.destination}</p>
              </div>
           </div>
           <ChevronRight className="w-6 h-6 text-emerald-600" />
        </section>
      )}

      {/* ORDERS ACTIVE OVERLAY (Only in Services app) */}
      {!isMaraudeMode && activeOrders.filter(o => o.status !== 'DELIVERED').length > 0 && (
        <section className="space-y-4">
          <h3 className="font-black text-[10px] text-slate-400 uppercase tracking-widest px-2">Suivi de vos commandes</h3>
          <div className="space-y-3">
            {activeOrders.filter(o => o.status !== 'DELIVERED').map((order) => (
              <div 
                key={order.id} 
                onClick={() => onNavigate('client-dashboard')}
                className="bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-emerald-200 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Commande #{order.id.slice(-5)}</p>
                    <p className="font-bold text-slate-900">{order.status === 'PENDING' ? 'En préparation' : 'En livraison'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-emerald-600 uppercase">Voir</span>
                  <ChevronRight className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Core Dynamic Section based on selected App */}
      {isMaraudeMode ? (
        /* ================= MARAUDE TRANSPORT MODULE ================= */
        <section className="space-y-5 animate-in fade-in duration-300">
          <h3 className="font-black text-[10px] text-slate-400 uppercase tracking-widest px-2">Commandez votre moyen de transport</h3>
          
          <div className="grid grid-cols-2 gap-4">
             <button onClick={() => onNavigate('booking')} className="p-6 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:border-emerald-200 transition-all group flex flex-col items-start gap-4">
              <div className="w-14 h-14 bg-gradient-to-tr from-emerald-600 to-teal-500 text-white rounded-[1.5rem] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <MapPin className="w-7 h-7" />
              </div>
              <div className="text-left">
                <span className="font-black text-slate-900 text-sm block tracking-tight uppercase">Taxi Privé</span>
                <span className="text-[10px] text-emerald-600 font-black uppercase mt-1">Immédiat</span>
              </div>
            </button>

            <button onClick={() => onNavigate('booking')} className="p-6 bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-xl hover:border-emerald-500/50 transition-all group flex flex-col items-start gap-4">
              <div className="w-14 h-14 bg-emerald-600 text-white rounded-[1.5rem] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform shadow-emerald-500/20">
                <Users className="w-7 h-7" />
              </div>
              <div className="text-left">
                <span className="font-black text-white text-sm block tracking-tight uppercase">Taxi Collectif</span>
                <span className="text-[10px] text-emerald-400 font-black uppercase mt-1">500 - 1000 F</span>
              </div>
            </button>
          </div>

          <button onClick={() => onNavigate('booking')} className="w-full bg-amber-500 p-6 rounded-[2.5rem] flex items-center justify-between group active:scale-[0.98] transition-all shadow-lg shadow-amber-500/20 border border-amber-400">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-amber-600 shadow-sm">
                  <Navigation className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black text-amber-900 uppercase tracking-widest">Au bord de la route ?</p>
                  <p className="font-black text-white text-sm uppercase italic">Signaler ma présence</p>
                </div>
             </div>
             <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Grid of subset transport links only */}
          <div className="space-y-4 pt-2">
            <h4 className="font-black text-[10px] text-slate-400 uppercase tracking-widest px-2">Raccourcis Mobilité</h4>
            <div className="grid grid-cols-4 gap-4">
              {[
                { id: 'clando', icon: Car, label: 'Clando', color: 'bg-cyan-50 text-cyan-600 border border-cyan-100' },
                { id: 'quartier-maison', icon: Home, label: 'Zone', color: 'bg-amber-50 text-amber-600 border border-amber-100' },
                { id: 'maraude', icon: Smartphone, label: 'Radar', color: 'bg-blue-50 text-blue-600 border border-blue-100' },
                { id: 'map', icon: MapPin, label: 'Carte', color: 'bg-teal-50 text-teal-600 border border-teal-100' },
                { id: 'wallet', icon: CreditCard, label: 'Wallet', color: 'bg-emerald-50 text-emerald-600 border border-emerald-100' },
                { id: 'sos', icon: AlertTriangle, label: 'Urgence', color: 'bg-red-50 text-red-600 border border-red-100' },
              ].map((item) => (
                <button key={item.id} onClick={() => onNavigate(item.id as ViewState)} className="flex flex-col items-center gap-2 transition-transform hover:scale-105 active:scale-95">
                  <div className={`w-14 h-14 ${item.color} rounded-[1.5rem] flex items-center justify-center shadow-sm`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Banner Driver Enrollment */}
          <section className="relative h-44 rounded-[3rem] overflow-hidden group shadow-xl border border-slate-100 mt-6">
             <img src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms]" alt="Driver" />
             <div className="absolute inset-0 bg-gradient-to-t from-amber-900 via-amber-900/40 to-transparent p-8 flex flex-col justify-end">
                <h4 className="text-xl font-black text-white leading-tight">Chauffeur ? Inscrivez-vous</h4>
                <p className="text-[10px] text-amber-300 font-bold uppercase tracking-widest mt-1">Obtenez votre matricule Maraude officiel.</p>
                <button onClick={() => onNavigate('driver-registration')} className="mt-4 bg-amber-500 text-white px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest w-fit active:scale-95 shadow-lg shadow-amber-500/20">
                  S'enrôler Maintenant
                </button>
             </div>
          </section>
        </section>
      ) : (
        /* ================= SERVICES DÉDIÉS MODULE ================= */
        <section className="space-y-6 animate-in fade-in duration-300">
          <h3 className="font-black text-[10px] text-slate-400 uppercase tracking-widest px-2">Découvrez les Prestations locales</h3>
          
          <div className="grid grid-cols-4 gap-4">
            {[
              { id: 'doctors', icon: Stethoscope, label: 'Médecins', color: 'bg-emerald-50 text-emerald-600 border border-emerald-100' },
              { id: 'pharmacies', icon: Pill, label: 'Pharmacies', color: 'bg-cyan-50 text-cyan-600 border border-cyan-100' },
              { id: 'artisans', icon: Hammer, label: 'Artisans', color: 'bg-indigo-50 text-indigo-600 border border-indigo-100' },
              { id: 'delivery', icon: Package, label: 'Livraison', color: 'bg-pink-50 text-pink-600 border border-pink-100' },
              { id: 'marketplace', icon: ShoppingBag, label: 'Boutique', color: 'bg-violet-50 text-violet-600 border border-violet-100' },
              { id: 'lawyers', icon: ShieldCheck, label: 'Juridique', color: 'bg-slate-100 text-slate-800 border border-slate-200' },
              { id: 'wallet', icon: CreditCard, label: 'Wallet', color: 'bg-emerald-50 text-emerald-600 border border-emerald-100' },
            ].map((item) => (
              <button key={item.id} onClick={() => onNavigate(item.id as ViewState)} className="flex flex-col items-center gap-2 transition-transform hover:scale-105 active:scale-95">
                <div className={`w-14 h-14 ${item.color} rounded-[1.5rem] flex items-center justify-center shadow-sm`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">
                  {item.label}
                </span>
              </button>
            ))}
          </div>

          {/* Banner Santé */}
          <section className="relative h-44 rounded-[3rem] overflow-hidden group shadow-xl border border-slate-100">
             <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms]" alt="Health" />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent p-8 flex flex-col justify-end">
                <h4 className="text-xl font-black text-white leading-tight">Vivre en bonne santé</h4>
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mt-1">Médecins & Pharmacies de garde.</p>
                <button onClick={() => onNavigate('doctors')} className="mt-4 bg-emerald-600 text-white px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest w-fit active:scale-95 shadow-lg shadow-emerald-500/20">
                  Découvrir Santé de garde
                </button>
             </div>
          </section>

          {/* Banner Artisan Enrollment */}
          <section className="relative h-44 rounded-[3rem] overflow-hidden group shadow-xl border border-slate-100">
             <img src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms]" alt="Artisan" />
             <div className="absolute inset-0 bg-gradient-to-t from-indigo-900 via-indigo-900/40 to-transparent p-8 flex flex-col justify-end">
                <h4 className="text-xl font-black text-white leading-tight">Gagnez plus avec Maraude</h4>
                <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest mt-1">Rejoignez le réseau d'artisans certifiés.</p>
                <button onClick={() => onNavigate('artisan-registration')} className="mt-4 bg-white text-indigo-600 px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest w-fit active:scale-95 shadow-lg">
                  Devenir Artisan Certifié
                </button>
             </div>
          </section>

          {/* Banner Notary Enrollment */}
          <section className="relative h-44 rounded-[3rem] overflow-hidden group shadow-xl border border-slate-100">
             <img src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms]" alt="Notary" />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent p-8 flex flex-col justify-end">
                <h4 className="text-xl font-black text-white leading-tight">Étude notariale digitale</h4>
                <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest mt-1">Rejoignez le réseau Justice & Notariat.</p>
                <button onClick={() => onNavigate('notary-registration')} className="mt-4 bg-white text-slate-900 px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest w-fit active:scale-95 shadow-lg">
                  S'enrôler Maintenant
                </button>
             </div>
          </section>

          {/* Banner Accountant Enrollment */}
          <section className="relative h-44 rounded-[3rem] overflow-hidden group shadow-xl border border-slate-100">
             <img src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms]" alt="Accountant" />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-800 via-slate-800/40 to-transparent p-8 flex flex-col justify-end">
                <h4 className="text-xl font-black text-white leading-tight">Experts Comptables</h4>
                <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest mt-1">Optimisez votre cabinet d'expertise.</p>
                <button onClick={() => onNavigate('accountant-registration')} className="mt-4 bg-slate-900 text-white px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest w-fit active:scale-95 shadow-lg shadow-slate-900/20">
                  S'enrôler Maintenant
                </button>
             </div>
          </section>
        </section>
      )}
    </div>
  );
};

export default HomeView;
