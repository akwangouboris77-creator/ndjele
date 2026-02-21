
import React from 'react';
import { MapPin, Smartphone, Star, Car, Truck, ChevronRight, Package, Hammer, Crown, ShoppingBag, Plus, CreditCard, ArrowUpRight, CheckCircle2, Clock, Lock, Zap, Home, LayoutDashboard, AlertTriangle, Stethoscope, Pill, User as UserIcon, ShieldCheck, Gavel } from 'lucide-react';
import { ViewState, ActiveRide, SubscriptionTier, MarketplaceOrder } from '../types';

interface HomeViewProps {
  onNavigate: (view: ViewState) => void;
  activeRide: ActiveRide | null;
  subscriptionTier: SubscriptionTier;
  activeOrders: MarketplaceOrder[];
  onUpdateOrder: (id: string, updates: Partial<MarketplaceOrder>) => void;
  userName: string;
}

const HomeView: React.FC<HomeViewProps> = ({ onNavigate, activeRide, subscriptionTier, activeOrders, onUpdateOrder, userName }) => {
  const firstName = userName.split(' ')[0];
  const isFree = subscriptionTier === 'FREE';

  return (
    <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tighter leading-none">
            Salut {firstName} 👋
          </h2>
          <p className="text-slate-500 font-medium text-sm">Qu'est-ce qu'on règle aujourd'hui ?</p>
        </div>
        <button 
          onClick={() => onNavigate('subscription')} 
          className={`px-4 py-2 rounded-2xl flex items-center gap-2 shadow-sm transition-all ${
            isFree ? 'bg-slate-100 text-slate-600' : 'bg-emerald-600 text-white shadow-emerald-200'
          }`}
        >
          <Crown className={`w-4 h-4 ${!isFree ? 'fill-white' : 'text-emerald-600'}`} />
          <span className="text-[10px] font-black uppercase tracking-widest">
            {isFree ? 'Passer Pro' : 'Premium'}
          </span>
        </button>
      </section>

      {activeRide && (
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

      {/* Services Grid */}
      <section className="space-y-4">
        <h3 className="font-black text-[10px] text-slate-400 uppercase tracking-widest px-2">Services les plus utilisés</h3>
        
        <div className="grid grid-cols-2 gap-4">
           <button onClick={() => onNavigate('booking')} className="p-6 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:border-emerald-200 transition-all group flex flex-col items-start gap-4">
            <div className="w-14 h-14 gradient-brand text-white rounded-[1.5rem] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <MapPin className="w-7 h-7" />
            </div>
            <div className="text-left">
              <span className="font-black text-slate-900 text-sm block tracking-tight">RéSERVER TAXI</span>
              <span className="text-[10px] text-emerald-600 font-black uppercase mt-1">Immédiat</span>
            </div>
          </button>

          <button onClick={() => onNavigate('pharmacies')} className="p-6 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:border-emerald-200 transition-all group flex flex-col items-start gap-4">
            <div className="w-14 h-14 bg-pink-50 text-pink-600 rounded-[1.5rem] flex items-center justify-center border border-pink-100 group-hover:scale-105 transition-transform">
              <Pill className="w-7 h-7" />
            </div>
            <div className="text-left">
              <span className="font-black text-slate-900 text-sm block tracking-tight">PHARMACIES</span>
              <span className="text-[10px] text-pink-600 font-black uppercase mt-1">Achat & Livraison</span>
            </div>
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 pt-2">
          {[
            { id: 'doctors', icon: Stethoscope, label: 'Médecins', color: 'bg-emerald-50 text-emerald-600' },
            { id: 'artisans', icon: Hammer, label: 'Artisans', color: 'bg-indigo-50 text-indigo-600' },
            { id: 'delivery', icon: Package, label: 'Livraison', color: 'bg-pink-50 text-pink-600' },
            { id: 'marketplace', icon: ShoppingBag, label: 'Marché', color: 'bg-violet-50 text-violet-600' },
            { id: 'maraude', icon: Smartphone, label: 'Radar', color: 'bg-blue-50 text-blue-600' },
            { id: 'wallet', icon: CreditCard, label: 'Wallet', color: 'bg-emerald-50 text-emerald-600' },
            { id: 'sos', icon: AlertTriangle, label: 'Urgence', color: 'bg-red-50 text-red-600' },
            { id: 'lawyers', icon: ShieldCheck, label: 'Avocats', color: 'bg-slate-100 text-slate-800' },
            { id: 'bailiffs', icon: Gavel, label: 'Huissiers', color: 'bg-slate-100 text-slate-700' },
            { id: 'client-dashboard', icon: UserIcon, label: 'Compte', color: 'bg-slate-50 text-slate-400' },
          ].map((item) => (
            <button key={item.id} onClick={() => onNavigate(item.id as ViewState)} className="flex flex-col items-center gap-2 transition-transform hover:scale-105 active:scale-95">
              <div className={`w-14 h-14 ${item.color} rounded-[1.5rem] flex items-center justify-center shadow-sm border border-black/5`}>
                <item.icon className="w-6 h-6" />
              </div>
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Banner Santé */}
      <section className="relative h-44 rounded-[3rem] overflow-hidden group shadow-xl border border-slate-100">
         <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms]" alt="Health" />
         <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent p-8 flex flex-col justify-end">
            <h4 className="text-xl font-black text-slate-900 leading-tight">Vivre en bonne santé</h4>
            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-1">Médecins & Pharmacies de garde.</p>
            <button onClick={() => onNavigate('doctors')} className="mt-4 gradient-emerald text-white px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest w-fit active:scale-95 shadow-lg shadow-emerald-200">
              Découvrir Ndjele Santé
            </button>
         </div>
      </section>
    </div>
  );
};

export default HomeView;
