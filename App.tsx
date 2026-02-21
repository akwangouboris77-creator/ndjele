
import React, { useState, useEffect } from 'react';
import { 
  Home, MapPin, Wallet, LayoutDashboard, AlertTriangle, Menu, X, Bell, Package, Hammer, Crown, ShoppingBag, Settings, LogOut, User as UserIcon, Store, Car, Stethoscope, Pill, BarChart3, Info
} from 'lucide-react';
import { ViewState, TransportType, ActiveRide, Contact, DriverRegistration, Artisan, SubscriptionTier, Livreur, Merchant, MarketplaceOrder, Product, UserProfile, UserRole, Pharmacy, Doctor } from './types';

// Imports des vues
import HomeView from './components/HomeView';
import BookingView from './components/BookingView';
import WalletView from './components/WalletView';
import SOSView from './components/SOSView';
import RideProgressView from './components/RideProgressView';
import WaitingValidationView from './components/WaitingValidationView';
import DeliveryView from './components/DeliveryView';
import ArtisansView from './components/ArtisansView';
import ArtisanRegistrationView from './components/ArtisanRegistrationView';
import SubscriptionView from './components/SubscriptionView';
import TermsView from './components/TermsView';
import MarketplaceView from './components/MarketplaceView';
import LoginView from './components/LoginView';
import OrderCheckoutView from './components/OrderCheckoutView';
import DriverRegistrationView from './components/DriverRegistrationView';
import DriverDashboard from './components/DriverDashboard';
import DeliveryRegistrationView from './components/DeliveryRegistrationView';
import DeliveryDashboard from './components/DeliveryDashboard';
import MerchantRegistrationView from './components/MerchantRegistrationView';
import MerchantDashboard from './components/MerchantDashboard';
import ClientDashboard from './components/ClientDashboard';
import DoctorView from './components/DoctorView';
import RoleSelectionView from './components/RoleSelectionView';
import ArtisanDashboard from './components/ArtisanDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import PharmacyView from './components/PharmacyView';
import MedicationOrderView from './components/MedicationOrderView';
import DoctorRegistrationView from './components/DoctorRegistrationView';
import PharmacyRegistrationView from './components/PharmacyRegistrationView';
import PharmacyDashboard from './components/PharmacyDashboard';
import BusinessDashboard from './components/BusinessDashboard';
import OnePagerView from './components/OnePagerView';
import LawyerView from './components/LawyerView';
import BailiffView from './components/BailiffView';

const DEFAULT_ARTISANS: Artisan[] = [
  { id: 'a1', name: 'Tonton Serge', job: 'Frigoriste Expert', category: 'froid', rating: 4.9, distance: 1.2, isVerified: true, avatar: 'https://images.unsplash.com/photo-1590086782792-42dd2350140d?fit=crop&w=150&h=150', completedTasks: 124, yearsOnPlatform: 3, neighborhood: 'Nzeng-Ayong' },
  { id: 'a2', name: 'Moussa Plomberie', job: 'Plombier Sanitaire', category: 'plomberie', rating: 4.7, distance: 2.5, isVerified: true, avatar: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?fit=crop&w=150&h=150', completedTasks: 89, yearsOnPlatform: 2, neighborhood: 'Louis' },
];

const DEFAULT_CONTACTS: Contact[] = [
  { id: 'c1', name: 'Maman (Urgence)', phone: '074 11 22 33', isTrusted: true },
  { id: 'c2', name: 'Commissariat Central', phone: '1722', isTrusted: true },
];

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('ndjele_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) { return null; }
  });

  const [walletBalance, setWalletBalance] = useState<number>(() => {
    const saved = localStorage.getItem('ndjele_wallet');
    return saved ? parseInt(saved) : 14250;
  });

  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>(() => {
    return (localStorage.getItem('ndjele_sub') as SubscriptionTier) || 'FREE';
  });

  const [hasAcceptedTerms, setHasAcceptedTerms] = useState<boolean>(() => {
    return localStorage.getItem('ndjele_terms_accepted') === 'true';
  });

  const [activeView, setActiveView] = useState<ViewState>(() => {
    if (!user) return 'login';
    if (!user.role) return 'role-selection';
    return 'home';
  });

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeRide, setActiveRide] = useState<ActiveRide | null>(null);
  const [pendingRide, setPendingRide] = useState<ActiveRide | null>(null);
  const [orders, setOrders] = useState<MarketplaceOrder[]>([]);
  const [artisans, setArtisans] = useState<Artisan[]>(DEFAULT_ARTISANS);
  const [contacts, setContacts] = useState<Contact[]>(DEFAULT_CONTACTS);
  
  const [registeredDriver, setRegisteredDriver] = useState<DriverRegistration | null>(null);
  const [registeredLivreur, setRegisteredLivreur] = useState<Livreur | null>(null);
  const [registeredMerchant, setRegisteredMerchant] = useState<Merchant | null>(null);
  const [registeredArtisanPro, setRegisteredArtisanPro] = useState<Artisan | null>(null);
  const [registeredDoctor, setRegisteredDoctor] = useState<Doctor | null>(null);
  const [registeredPharmacy, setRegisteredPharmacy] = useState<Pharmacy | null>(null);

  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const [checkoutData, setCheckoutData] = useState<{product: Product, merchant: Merchant} | null>(null);

  useEffect(() => {
    localStorage.setItem('ndjele_wallet', walletBalance.toString());
  }, [walletBalance]);

  const handleLogin = (profile: UserProfile) => {
    localStorage.setItem('ndjele_user', JSON.stringify(profile));
    setUser(profile);
    if (!profile.role) {
      setActiveView('role-selection');
    } else {
      setActiveView('home');
    }
  };

  const handleSetRole = (role: UserRole) => {
    if (user) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      localStorage.setItem('ndjele_user', JSON.stringify(updatedUser));
      setActiveView('home');
    }
  };

  const navigateProtected = (view: ViewState) => {
    setActiveView(view);
    setSidebarOpen(false);
  };

  const renderView = () => {
    if (activeView === 'one-pager') return <OnePagerView onNavigate={setActiveView} />;
    if (!user) return <LoginView onLogin={handleLogin} onOpenOnePager={() => setActiveView('one-pager')} />;
    if (activeView === 'role-selection') return <RoleSelectionView onSelect={handleSetRole} />;
    if (!hasAcceptedTerms) return <TermsView onAccept={() => { setHasAcceptedTerms(true); localStorage.setItem('ndjele_terms_accepted', 'true'); setActiveView('home'); }} />;

    if (activeView === 'home') {
      switch (user.role) {
        case 'DRIVER': return <DriverDashboard onNavigate={navigateProtected} onAcceptRequest={(r) => { setActiveRide(r); setActiveView('ride-progress'); }} registeredDriver={registeredDriver} />;
        case 'DELIVERY': return <DeliveryDashboard onNavigate={setActiveView} registeredLivreur={registeredLivreur} marketplaceOrders={orders} onAcceptRequest={(r) => { setActiveRide(r); setActiveView('ride-progress'); }} onAcceptOrder={() => {}} onMarkDelivered={() => {}} onUpdateOrder={(id, updates) => setOrders(orders.map(o => o.id === id ? { ...o, ...updates } : o))} />;
        case 'MERCHANT': return <MerchantDashboard onNavigate={setActiveView} registeredMerchant={registeredMerchant} onUpdateMerchant={setRegisteredMerchant} />;
        case 'DOCTOR': return registeredDoctor ? <DoctorDashboard onNavigate={setActiveView} doctorName={user.name} /> : <DoctorRegistrationView onNavigate={setActiveView} onRegister={(d) => {setRegisteredDoctor(d); setActiveView('home');}} />;
        case 'PHARMACY': return registeredPharmacy ? <PharmacyDashboard onNavigate={setActiveView} pharmacy={registeredPharmacy} /> : <PharmacyRegistrationView onNavigate={setActiveView} onRegister={(p) => { setRegisteredPharmacy(p); setActiveView('home'); }} />;
        case 'ARTISAN': return registeredArtisanPro ? <ArtisanDashboard onNavigate={setActiveView} artisan={registeredArtisanPro} /> : <ArtisansView onNavigate={setActiveView} registeredArtisan={null} artisansList={artisans} onRateArtisan={() => {}} />;
        case 'CLIENT':
        default: return <HomeView onNavigate={navigateProtected} activeRide={activeRide} subscriptionTier={subscriptionTier} activeOrders={orders} onUpdateOrder={() => {}} userName={user.name} />;
      }
    }

    switch (activeView) {
      case 'business-dashboard': return <BusinessDashboard onNavigate={setActiveView} />;
      case 'pharmacies': return <PharmacyView onNavigate={setActiveView} onSelectPharmacy={(p) => { setSelectedPharmacy(p); setActiveView('medication-order'); }} registeredPharmacy={registeredPharmacy} />;
      case 'pharmacy-registration': return <PharmacyRegistrationView onNavigate={setActiveView} onRegister={(p) => { setRegisteredPharmacy(p); setActiveView('home'); }} />;
      case 'medication-order': return selectedPharmacy ? <MedicationOrderView onNavigate={setActiveView} pharmacy={selectedPharmacy} /> : null;
      case 'doctor-registration': return <DoctorRegistrationView onNavigate={setActiveView} onRegister={(d) => { setRegisteredDoctor(d); setActiveView('home'); }} />;
      case 'client-dashboard': return <ClientDashboard onNavigate={setActiveView} user={user} subscriptionTier={subscriptionTier} orders={orders} walletBalance={walletBalance} onUpdateProfile={(u) => {setUser(u); localStorage.setItem('ndjele_user', JSON.stringify(u));}} />;
      case 'driver-registration': return <DriverRegistrationView onNavigate={navigateProtected} onRegister={(d) => { setRegisteredDriver(d); setActiveView('home'); }} />;
      case 'artisans': return <ArtisansView onNavigate={setActiveView} registeredArtisan={registeredArtisanPro} artisansList={artisans} onRateArtisan={() => {}} />;
      case 'doctors': return <DoctorView onNavigate={setActiveView} />;
      case 'ride-progress': return activeRide ? <RideProgressView ride={activeRide} onEndRide={() => { setActiveRide(null); setActiveView('home'); }} onOpenSOS={() => setActiveView('sos')} contacts={contacts} /> : null;
      case 'wallet': return <WalletView onNavigate={setActiveView} balance={walletBalance} onUpdateBalance={setWalletBalance} />;
      case 'sos': return <SOSView onNavigate={setActiveView} contacts={contacts} activeRide={activeRide} onUpdateRide={(r) => setActiveRide(r)} />;
      case 'subscription': return <SubscriptionView onNavigate={setActiveView} currentTier={subscriptionTier} onUpgrade={() => {setSubscriptionTier('PREMIUM'); setActiveView('home');}} />;
      case 'booking': return <BookingView onNavigate={setActiveView} onStartRideRequest={(r) => { setPendingRide(r); setActiveView('waiting-validation'); }} />;
      case 'waiting-validation': return pendingRide ? <WaitingValidationView pendingRide={pendingRide} onCancel={() => { setPendingRide(null); setActiveView('booking'); }} onSimulateAccept={() => { setActiveRide({...pendingRide, status: 'ACCEPTED'}); setPendingRide(null); setActiveView('ride-progress'); }} onSimulateReject={() => { setPendingRide(null); setActiveView('booking'); }} /> : null;
      case 'marketplace': return <MarketplaceView onNavigate={setActiveView} registeredMerchant={registeredMerchant} onCreateOrder={(o) => setOrders([o, ...orders])} onBuyNow={(p, m) => { setCheckoutData({product: p, merchant: m}); setActiveView('order-checkout'); }} />;
      case 'order-checkout': return checkoutData ? <OrderCheckoutView onNavigate={setActiveView} product={checkoutData.product} merchant={checkoutData.merchant} onCreateOrder={(o) => setOrders([o, ...orders])} clientName={user.name} /> : null;
      case 'delivery': return <DeliveryView onNavigate={setActiveView} registeredLivreur={registeredLivreur} onStartRideRequest={(r) => { setPendingRide(r); setActiveView('waiting-validation'); }} />;
      case 'lawyers': return <LawyerView onNavigate={setActiveView} />;
      case 'bailiffs': return <BailiffView onNavigate={setActiveView} />;
      case 'artisan-registration': return <ArtisanRegistrationView onNavigate={setActiveView} onRegister={(art) => { setRegisteredArtisanPro(art); setArtisans([art, ...artisans]); setActiveView('home'); }} />;
      case 'delivery-registration': return <DeliveryRegistrationView onNavigate={navigateProtected} onRegister={(l) => { setRegisteredLivreur(l); setActiveView('home'); }} />;
      case 'merchant-registration': return <MerchantRegistrationView onNavigate={navigateProtected} onRegister={(m) => { setRegisteredMerchant(m); setActiveView('home'); }} />;
      default: return <HomeView onNavigate={navigateProtected} activeRide={activeRide} subscriptionTier={subscriptionTier} activeOrders={[]} onUpdateOrder={() => {}} userName={user.name} />;
    }
  };

  const getBottomNavItems = () => {
    if (!user) return [];
    if (user.role === 'CLIENT') {
      return [
        { id: 'home', icon: Home },
        { id: 'booking', icon: MapPin },
        { id: 'pharmacies', icon: Pill },
        { id: 'doctors', icon: Stethoscope },
      ];
    }
    return [
      { id: 'home', icon: LayoutDashboard },
      { id: 'wallet', icon: Wallet },
      { id: 'marketplace', icon: ShoppingBag },
    ];
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white relative shadow-2xl overflow-hidden border-x border-slate-100">
      {user && activeView !== 'role-selection' && activeView !== 'one-pager' && (
        <header className="flex items-center justify-between px-6 py-3 glass-morphism sticky top-0 z-[50] shadow-sm">
          <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-slate-100 rounded-2xl transition-all">
            <Menu className="w-5 h-5 text-slate-800" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 gradient-brand rounded-lg flex items-center justify-center text-white font-black text-[9px] shadow-lg shadow-emerald-200">NS</div>
            <h1 className="text-base font-extrabold text-slate-900 tracking-tight">Ndjele</h1>
          </div>
          <button onClick={() => setActiveView('client-dashboard')} className="w-8 h-8 rounded-xl overflow-hidden border border-emerald-500/20">
            <img src={user.photo} className="w-full h-full object-cover" alt="Profile" />
          </button>
        </header>
      )}

      <main className={`flex-1 overflow-y-auto relative bg-slate-50/30 z-0 hide-scrollbar ${user && activeView !== 'role-selection' && activeView !== 'one-pager' ? 'pb-32' : ''}`}>
        {renderView()}
      </main>

      {user && activeView !== 'role-selection' && activeView !== 'one-pager' && (
        <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[80%] max-w-[300px] glass-morphism px-1 py-1 flex justify-between items-center rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] z-[50]">
          {getBottomNavItems().map((item) => (
            <button key={item.id} onClick={() => navigateProtected(item.id as ViewState)} className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all ${activeView === item.id || (activeView === 'home' && item.id === 'home') ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-emerald-600'}`}>
              <item.icon className="w-4 h-4" />
            </button>
          ))}
          <div className="h-4 w-px bg-slate-200 mx-0.5"></div>
          <button onClick={() => navigateProtected('sos')} className={`flex flex-col items-center p-2 rounded-2xl ${activeView === 'sos' ? 'bg-red-500 text-white' : 'text-red-400'}`}>
            <AlertTriangle className="w-4 h-4" />
          </button>
        </nav>
      )}

      {isSidebarOpen && user && (
        <>
          <aside className="fixed top-0 left-0 h-full w-4/5 max-w-xs bg-white z-[210] shadow-2xl rounded-r-[2.5rem] animate-in slide-in-from-left duration-300 overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div onClick={() => { setActiveView('client-dashboard'); setSidebarOpen(false); }} className="flex items-center gap-3 cursor-pointer">
                <img src={user.photo} className="w-10 h-10 rounded-xl object-cover" />
                <div>
                  <p className="font-black text-slate-900 text-xs">{user.name}</p>
                  <p className="text-[9px] font-bold text-emerald-600 uppercase">{user.role}</p>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-2 bg-white rounded-full text-slate-400"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-4 space-y-1">
               {[
                 { id: 'home', icon: Home, label: 'Accueil' },
                 { id: 'one-pager', icon: Info, label: 'Présentation Ndjele' },
                 { id: 'business-dashboard', icon: BarChart3, label: 'Projections Business' },
                 { id: 'pharmacies', icon: Pill, label: 'Pharmacie' },
                 { id: 'doctors', icon: Stethoscope, label: 'Médecins' },
                 { id: 'marketplace', icon: ShoppingBag, label: 'Marketplace' },
                 { id: 'wallet', icon: Wallet, label: 'Portefeuille' },
                 { id: 'role-selection', icon: LayoutDashboard, label: 'Changer Profil' },
               ].map((nav) => (
                 <button key={nav.id} onClick={() => { setActiveView(nav.id as ViewState); setSidebarOpen(false); }} className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-emerald-50 text-slate-600 font-bold text-xs transition-all">
                   <nav.icon className="w-4 h-4" /> {nav.label}
                 </button>
               ))}
               <div className="pt-6 border-t border-slate-100 mt-4">
                  <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-red-50 text-red-500 font-bold text-xs transition-all">
                    <LogOut className="w-4 h-4" /> Déconnexion
                  </button>
               </div>
            </div>
          </aside>
          <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-slate-900/40 z-[200] backdrop-blur-sm"></div>
        </>
      )}
    </div>
  );
};

export default App;
