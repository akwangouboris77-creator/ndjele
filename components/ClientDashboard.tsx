
import React, { useRef, useState } from 'react';
import { 
  User, Shield, Crown, Award, Clock, MapPin, ShoppingBag, 
  ChevronRight, ArrowLeft, Star, Wallet, Settings, Bell, 
  CheckCircle2, HelpCircle, LogOut, Trophy, CreditCard,
  History, ShieldCheck, Heart, Zap, Camera, X, ShieldAlert, Info,
  Smartphone, Languages, Moon, Volume2, MessageSquare, PhoneCall, ExternalLink
} from 'lucide-react';
import { ViewState, UserProfile, SubscriptionTier, MarketplaceOrder } from '../types';

interface ClientDashboardProps {
  onNavigate: (view: ViewState) => void;
  user: UserProfile;
  subscriptionTier: SubscriptionTier;
  orders: MarketplaceOrder[];
  onUpdateProfile?: (updatedUser: UserProfile) => void;
  walletBalance: number;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ onNavigate, user, subscriptionTier, orders, onUpdateProfile, walletBalance }) => {
  const isPremium = subscriptionTier === 'PREMIUM';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeModal, setActiveModal] = useState<'settings' | 'payments' | 'help' | null>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onUpdateProfile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateProfile({ ...user, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const renderSettings = () => (
    <div className="space-y-6 animate-in slide-in-from-bottom-4">
      <div className="bg-slate-50 p-4 rounded-[2rem] border border-slate-100 space-y-4">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Notifications</h4>
        {[
          { icon: Bell, label: 'Alertes de courses', state: true },
          { icon: ShoppingBag, label: 'Promotions Market', state: false },
          { icon: MessageSquare, label: 'Messages Prestataires', state: true },
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-white rounded-2xl shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><item.icon className="w-4 h-4" /></div>
              <span className="text-xs font-bold text-slate-700">{item.label}</span>
            </div>
            <div className={`w-10 h-5 rounded-full relative transition-colors ${item.state ? 'bg-emerald-500' : 'bg-slate-200'}`}>
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${item.state ? 'left-6' : 'left-1'}`}></div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-50 p-4 rounded-[2rem] border border-slate-100 space-y-4">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Apparence</h4>
        <div className="flex items-center justify-between p-3 bg-white rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-900 text-white rounded-lg"><Moon className="w-4 h-4" /></div>
            <span className="text-xs font-bold text-slate-700">Mode Sombre</span>
          </div>
          <div className="w-10 h-5 bg-slate-200 rounded-full relative">
            <div className="absolute top-1 left-1 w-3 h-3 bg-white rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-6 animate-in slide-in-from-bottom-4">
      <div className="bg-slate-900 p-6 rounded-[2.5rem] text-white space-y-4 shadow-xl">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Solde Wallet</p>
            <p className="text-3xl font-black">{walletBalance.toLocaleString()} F</p>
          </div>
          <button onClick={() => onNavigate('wallet')} className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
            <PlusCircle className="w-5 h-5 text-emerald-400" />
          </button>
        </div>
        <button onClick={() => onNavigate('wallet')} className="w-full py-3 bg-emerald-600 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/20">
          Recharger le compte
        </button>
      </div>

      <div className="space-y-3">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Comptes Liés</h4>
        {[
          { provider: 'Airtel Money', number: '074 11 22 33', color: 'bg-red-600' },
          { provider: 'Moov Money', number: '066 99 88 77', color: 'bg-blue-600' },
        ].map((p, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 ${p.color} rounded-xl flex items-center justify-center text-white font-black text-xs`}>{p.provider[0]}</div>
              <div>
                <p className="text-xs font-bold text-slate-800">{p.provider}</p>
                <p className="text-[10px] text-slate-400">{p.number}</p>
              </div>
            </div>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
        ))}
      </div>
    </div>
  );

  const renderHelp = () => (
    <div className="space-y-6 animate-in slide-in-from-bottom-4">
      <div className="grid grid-cols-1 gap-3">
        {[
          { q: "Comment payer ma course ?", a: "Utilisez le Wallet NS crédité via Airtel ou Moov Money." },
          { q: "Qu'est-ce que le Numéro NS ?", a: "C'est l'identifiant unique peint sur la portière des taxis certifiés." },
          { q: "Ma commande est en retard", a: "Contactez directement le livreur via le chat de suivi." },
        ].map((faq, i) => (
          <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
            <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{faq.q}</p>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <button className="w-full flex items-center justify-between p-4 bg-emerald-50 border border-emerald-100 rounded-2xl group">
          <div className="flex items-center gap-3">
            <PhoneCall className="w-5 h-5 text-emerald-600" />
            <span className="text-xs font-bold text-emerald-700">Appeler l'assistance (1722)</span>
          </div>
          <ChevronRight className="w-4 h-4 text-emerald-400" />
        </button>
        <button className="w-full flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-2xl group">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <span className="text-xs font-bold text-blue-700">Chatter avec un conseiller</span>
          </div>
          <ChevronRight className="w-4 h-4 text-blue-400" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500 pb-32">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('home')} className="p-2 bg-white rounded-full shadow-sm hover:bg-slate-50 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Mon Profil</h2>
        </div>
        <button className="p-2 bg-white rounded-full shadow-sm relative">
          <Bell className="w-5 h-5 text-slate-600" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </div>

      <section className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm flex flex-col items-center text-center space-y-4">
        <div className="relative cursor-pointer group/avatar" onClick={handleImageClick}>
          <div className="relative w-24 h-24 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl">
            <img src={user.photo} className="w-full h-full object-cover" alt={user.name} />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-800">{user.name}</h3>
          <div className="flex items-center justify-center gap-2 mt-1">
             <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${isPremium ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
               {isPremium ? 'Premium member' : 'Free account'}
             </span>
          </div>
        </div>
      </section>

      <div className="space-y-3">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Paramètres du compte</h3>
        <div className="space-y-2">
          <button onClick={() => setActiveModal('settings')} className="w-full flex items-center justify-between p-5 bg-white border border-slate-100 rounded-[2rem] group hover:border-indigo-200 transition-all shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                <Settings className="w-5 h-5" />
              </div>
              <p className="font-bold text-slate-800 text-sm">Préférences</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300" />
          </button>
          
          <button onClick={() => setActiveModal('payments')} className="w-full flex items-center justify-between p-5 bg-white border border-slate-100 rounded-[2rem] group hover:border-emerald-200 transition-all shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <p className="font-bold text-slate-800 text-sm">Modes de paiement</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300" />
          </button>

          <button onClick={() => setActiveModal('help')} className="w-full flex items-center justify-between p-5 bg-white border border-slate-100 rounded-[2rem] group hover:border-blue-200 transition-all shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              <p className="font-bold text-slate-800 text-sm">Centre d'aide</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300" />
          </button>
        </div>
      </div>

      <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="w-full flex items-center justify-center gap-3 p-5 bg-red-50 text-red-500 rounded-[2rem] font-black text-xs uppercase tracking-widest border border-red-100 active:scale-95 transition-transform">
        <LogOut className="w-5 h-5" /> Déconnexion
      </button>

      {/* Modal Dynamique */}
      {activeModal && (
        <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-end">
          <div className="w-full bg-white rounded-t-[3rem] p-8 space-y-6 animate-in slide-in-from-bottom-10 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                 <div className={`p-2 rounded-xl ${
                   activeModal === 'settings' ? 'bg-indigo-50 text-indigo-600' : 
                   activeModal === 'payments' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                 }`}>
                   {activeModal === 'settings' ? <Settings className="w-5 h-5" /> : 
                    activeModal === 'payments' ? <CreditCard className="w-5 h-5" /> : <HelpCircle className="w-5 h-5" />}
                 </div>
                 <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">
                   {activeModal === 'settings' ? 'Préférences' : activeModal === 'payments' ? 'Paiements' : 'Centre d\'aide'}
                 </h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            
            <div className="py-2">
               {activeModal === 'settings' && renderSettings()}
               {activeModal === 'payments' && renderPayments()}
               {activeModal === 'help' && renderHelp()}
               
               <button 
                 onClick={() => setActiveModal(null)} 
                 className="w-full mt-8 py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all"
               >
                 Enregistrer & Fermer
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Internal utility component for renderPayments
const PlusCircle = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/>
  </svg>
);

export default ClientDashboard;
