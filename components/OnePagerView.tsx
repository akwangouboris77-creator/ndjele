
import React from 'react';
import { ArrowRight, ShieldCheck, Zap, Smartphone, Users, MapPin, Star, Heart, CheckCircle2, ChevronDown, Car, Hammer, Stethoscope, ShoppingBag } from 'lucide-react';
import { ViewState } from '../types';

interface OnePagerViewProps {
  onNavigate: (view: ViewState) => void;
}

const OnePagerView: React.FC<OnePagerViewProps> = ({ onNavigate }) => {
  return (
    <div className="h-full bg-slate-900 overflow-y-auto hide-scrollbar scroll-smooth">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center p-8 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-600/20 to-transparent z-0"></div>
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute top-1/2 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[120px]"></div>

        <div className="relative z-10 space-y-6 animate-in fade-in slide-in-from-bottom-10 duration-700">
           <div className="w-20 h-20 gradient-brand rounded-[2rem] flex items-center justify-center text-white mx-auto shadow-2xl shadow-emerald-500/20 animate-float">
             <span className="text-3xl font-black">NS</span>
           </div>
           <h1 className="text-5xl font-black text-white tracking-tighter leading-[0.9]">
             NDJELE <br/><span className="text-emerald-400">SOLUTION</span>
           </h1>
           <p className="text-slate-400 font-bold text-sm uppercase tracking-[0.3em]">La Confiance Digitalisée au Gabon</p>
           
           <div className="pt-8">
             <button 
               onClick={() => onNavigate('login')}
               className="px-10 py-5 bg-white text-slate-900 rounded-[2.5rem] font-black uppercase text-xs tracking-widest shadow-2xl active:scale-95 transition-all flex items-center gap-3 mx-auto"
             >
               Démarrer l'aventure <ArrowRight className="w-5 h-5" />
             </button>
           </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
           <ChevronDown className="text-slate-500 w-6 h-6" />
        </div>
      </section>

      {/* Trust Factors */}
      <section className="p-8 space-y-12 bg-white rounded-t-[4rem] text-slate-900">
         <div className="text-center space-y-2">
            <h2 className="text-3xl font-black tracking-tighter">Pourquoi Ndjele ?</h2>
            <p className="text-slate-500 font-medium">Le nouveau standard de sécurité au Gabon.</p>
         </div>

         <div className="grid grid-cols-1 gap-8">
            <div className="flex gap-6 items-start">
               <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center shrink-0">
                  <ShieldCheck className="text-emerald-600 w-8 h-8" />
               </div>
               <div className="space-y-1">
                  <h4 className="font-black text-lg">Paiement Séquestre</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">Votre argent est bloqué par Ndjele. Le prestataire n'est payé qu'une fois le travail fini et validé par vous.</p>
               </div>
            </div>

            <div className="flex gap-6 items-start">
               <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center shrink-0">
                  <Zap className="text-amber-600 w-8 h-8" />
               </div>
               <div className="space-y-1">
                  <h4 className="font-black text-lg">Numéro NS Unique</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">Chaque taxi certifié porte son numéro NS sur la portière. Identifiez et notez vos chauffeurs en un clin d'œil.</p>
               </div>
            </div>

            <div className="flex gap-6 items-start">
               <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center shrink-0">
                  <Smartphone className="text-blue-600 w-8 h-8" />
               </div>
               <div className="space-y-1">
                  <h4 className="font-black text-lg">IA de Proximité</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">Négociation de prix, diagnostic de panne et orientation médicale : notre IA comprend le contexte local du Gabon.</p>
               </div>
            </div>
         </div>
      </section>

      {/* Services Showcase */}
      <section className="p-8 pb-24 space-y-8 bg-slate-50">
         <div className="text-center space-y-1">
            <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em]">Écosystème</h3>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Tout dans une main.</h2>
         </div>

         <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-4">
               <Car className="text-amber-500 w-8 h-8" />
               <h5 className="font-black text-xs uppercase">Ndjele Go</h5>
               <p className="text-[10px] text-slate-400 font-bold leading-tight">Taxi & Clando avec prix négocié par IA.</p>
            </div>
            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-4">
               <Stethoscope className="text-emerald-500 w-8 h-8" />
               <h5 className="font-black text-xs uppercase">Ndjele Santé</h5>
               <p className="text-[10px] text-slate-400 font-bold leading-tight">Médecins & Pharmacies de garde livrées.</p>
            </div>
            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-4">
               <Hammer className="text-indigo-500 w-8 h-8" />
               <h5 className="font-black text-xs uppercase">Artisans Pro</h5>
               <p className="text-[10px] text-slate-400 font-bold leading-tight">Plomberie, Clim, Élec certifiés NS.</p>
            </div>
            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-4">
               <ShoppingBag className="text-violet-500 w-8 h-8" />
               <h5 className="font-black text-xs uppercase">Marketplace</h5>
               <p className="text-[10px] text-slate-400 font-bold leading-tight">Achetez local, payez à la livraison.</p>
            </div>
         </div>

         <div className="pt-8">
            <div className="bg-slate-900 p-8 rounded-[3rem] text-white text-center space-y-6 shadow-2xl">
               <Heart className="w-12 h-12 text-red-500 mx-auto fill-red-500 animate-pulse" />
               <h3 className="text-xl font-black">Prêt à changer de vie ?</h3>
               <p className="text-xs text-slate-400 leading-relaxed">Rejoignez les milliers de Gabonais qui font confiance à Ndjele pour simplifier leur quotidien.</p>
               <button 
                 onClick={() => onNavigate('login')}
                 className="w-full py-5 gradient-primary text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-emerald-500/20"
               >
                 Créer mon compte
               </button>
            </div>
         </div>
      </section>
    </div>
  );
};

export default OnePagerView;
