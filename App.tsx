
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { 
  Home, MapPin, Wallet, LayoutDashboard, AlertTriangle, Menu, X, Bell, Package, Hammer, Crown, ShoppingBag, Settings, LogOut, User as UserIcon, Store, Car, Stethoscope, Pill, BarChart3, Info, Sparkles, Smartphone, ShieldCheck
} from 'lucide-react';
import { ViewState, TransportType, ActiveRide, Contact, DriverRegistration, Artisan, SubscriptionTier, Livreur, Merchant, MarketplaceOrder, Product, UserProfile, UserRole, Pharmacy, Doctor, Lawyer, Bailiff, Notary, Accountant } from './types';

// Eagerly loaded core views for instantaneous visual bootstrap
import HomeView from './components/HomeView';
import LoginView from './components/LoginView';
import RoleSelectionView from './components/RoleSelectionView';
import AppLauncher from './components/AppLauncher';

// Lazily loaded supplemental views to bypass high-latency transport cost
const BookingView = lazy(() => import('./components/BookingView'));
const WalletView = lazy(() => import('./components/WalletView'));
const SOSView = lazy(() => import('./components/SOSView'));
const RideProgressView = lazy(() => import('./components/RideProgressView'));
const WaitingValidationView = lazy(() => import('./components/WaitingValidationView'));
const DeliveryView = lazy(() => import('./components/DeliveryView'));
const ArtisansView = lazy(() => import('./components/ArtisansView'));
const ArtisanRegistrationView = lazy(() => import('./components/ArtisanRegistrationView'));
const SubscriptionView = lazy(() => import('./components/SubscriptionView'));
const TermsView = lazy(() => import('./components/TermsView'));
const MarketplaceView = lazy(() => import('./components/MarketplaceView'));
const OrderCheckoutView = lazy(() => import('./components/OrderCheckoutView'));
const DriverRegistrationView = lazy(() => import('./components/DriverRegistrationView'));
const DriverDashboard = lazy(() => import('./components/DriverDashboard'));
const DeliveryRegistrationView = lazy(() => import('./components/DeliveryRegistrationView'));
const DeliveryDashboard = lazy(() => import('./components/DeliveryDashboard'));
const MerchantRegistrationView = lazy(() => import('./components/MerchantRegistrationView'));
const MerchantDashboard = lazy(() => import('./components/MerchantDashboard'));
const ClientDashboard = lazy(() => import('./components/ClientDashboard'));
const DoctorView = lazy(() => import('./components/DoctorView'));
const ArtisanDashboard = lazy(() => import('./components/ArtisanDashboard'));
const DoctorDashboard = lazy(() => import('./components/DoctorDashboard'));
const PharmacyView = lazy(() => import('./components/PharmacyView'));
const MedicationOrderView = lazy(() => import('./components/MedicationOrderView'));
const DoctorRegistrationView = lazy(() => import('./components/DoctorRegistrationView'));
const PharmacyRegistrationView = lazy(() => import('./components/PharmacyRegistrationView'));
const PharmacyDashboard = lazy(() => import('./components/PharmacyDashboard'));
const BusinessDashboard = lazy(() => import('./components/BusinessDashboard'));
const OnePagerView = lazy(() => import('./components/OnePagerView'));
const LawyerView = lazy(() => import('./components/LawyerView'));
const BailiffView = lazy(() => import('./components/BailiffView'));
const LawyerRegistrationView = lazy(() => import('./components/LawyerRegistrationView'));
const BailiffRegistrationView = lazy(() => import('./components/BailiffRegistrationView'));
const LawyerDashboard = lazy(() => import('./components/LawyerDashboard'));
const BailiffDashboard = lazy(() => import('./components/BailiffDashboard'));
const NotaryView = lazy(() => import('./components/NotaryView'));
const AccountantView = lazy(() => import('./components/AccountantView'));
const NotaryRegistrationView = lazy(() => import('./components/NotaryRegistrationView'));
const AccountantRegistrationView = lazy(() => import('./components/AccountantRegistrationView'));
const NotaryDashboard = lazy(() => import('./components/NotaryDashboard'));
const AccountantDashboard = lazy(() => import('./components/AccountantDashboard'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const MapView = lazy(() => import('./components/MapView'));
const DeliveryTrackingView = lazy(() => import('./components/DeliveryTrackingView'));
const OnboardingOverlay = lazy(() => import('./components/OnboardingOverlay'));
const MaraudeView = lazy(() => import('./components/MaraudeView'));
const ClandoView = lazy(() => import('./components/ClandoView'));
const QuartierMaisonView = lazy(() => import('./components/QuartierMaisonView'));

import { AnimatePresence } from 'motion/react';

const DEFAULT_ARTISANS: Artisan[] = [
  { id: 'a1', name: 'Tonton Serge', job: 'Frigoriste Expert', category: 'froid', rating: 4.9, distance: 1.2, isVerified: true, avatar: 'https://images.unsplash.com/photo-1590086782792-42dd2350140d?fit=crop&w=150&h=150', completedTasks: 124, yearsOnPlatform: 3, neighborhood: 'Nzeng-Ayong', phone: '074 11 11 11' },
  { id: 'a2', name: 'Moussa Plomberie', job: 'Plombier Sanitaire', category: 'plomberie', rating: 4.7, distance: 2.5, isVerified: true, avatar: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?fit=crop&w=150&h=150', completedTasks: 89, yearsOnPlatform: 2, neighborhood: 'Louis', phone: '077 22 22 22' },
];

const DEFAULT_CONTACTS: Contact[] = [
  { id: 'c1', name: 'Maman (Urgence)', phone: '074 11 22 33', isTrusted: true },
  { id: 'c2', name: 'Commissariat Central', phone: '1722', isTrusted: true },
];

import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { auth } from './src/lib/firebase';
import { dbService } from './src/services/dbService';
import { useRef } from 'react';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('maraude_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) { return null; }
  });

  const userRef = useRef<UserProfile | null>(user);
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    // Sync Firebase Auth with localStorage user
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      const currentUser = userRef.current;
      if (firebaseUser) {
        console.log("Firebase Auth Synced:", firebaseUser.uid);
        // If we have a user in state, ensure their id matches the firebaseUser's uid
        if (currentUser && currentUser.id !== firebaseUser.uid) {
          console.log("Updating user ID to match Firebase Auth session:", firebaseUser.uid);
          const updatedUser = { ...currentUser, id: firebaseUser.uid };
          localStorage.setItem('maraude_user', JSON.stringify(updatedUser));
          setUser(updatedUser);
          try {
            await dbService.setData('users', firebaseUser.uid, updatedUser);
          } catch (e) {
            console.error("Failed to update user profile in Firestore:", e);
          }
        } else if (!currentUser) {
          // If we have an auth user but no localStorage user, fetch profile
          try {
            const profile = await dbService.getData('users', firebaseUser.uid);
            if (profile) {
              localStorage.setItem('maraude_user', JSON.stringify(profile));
              setUser(profile as UserProfile);
            }
          } catch (e) {
            console.error("Failed to fetch user profile from Firestore:", e);
          }
        }
      } else {
        // No firebaseUser, sign in anonymously if no local user exists
        if (!userRef.current) {
          console.log("No Firebase Auth user & no local user. Signing in anonymously...");
          try {
            const userCredential = await signInAnonymously(auth);
            console.log("Anonymous Sign-in successful:", userCredential.user.uid);
          } catch (error) {
            console.warn("Failed to sign in anonymously (expected if anonymous auth is disabled in your Firebase/Google Cloud setup):", error);
          }
        } else {
          console.log("No Firebase Auth user, but local session found. Using local profile:", userRef.current.id);
        }
      }
    });

    // Test connection
    dbService.testConnection();

    return () => unsubscribe();
  }, []);

  const [walletBalance, setWalletBalance] = useState<number>(() => {
    const saved = localStorage.getItem('maraude_wallet');
    return saved ? parseInt(saved) : 14250;
  });

  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>(() => {
    return (localStorage.getItem('maraude_sub') as SubscriptionTier) || 'FREE';
  });

  const [hasAcceptedTerms, setHasAcceptedTerms] = useState<boolean>(() => {
    return localStorage.getItem('maraude_terms_accepted') === 'true';
  });

  const [appModule, setAppModule] = useState<'MARAUDE' | 'SERVICES' | null>(() => {
    return (localStorage.getItem('maraude_app_module') as any) || null;
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
  
  const [registeredDriver, setRegisteredDriver] = useState<DriverRegistration | null>(() => {
    try {
      const saved = localStorage.getItem('maraude_driver_data');
      return saved ? JSON.parse(saved) : null;
    } catch (e) { return null; }
  });
  const [registeredLivreur, setRegisteredLivreur] = useState<Livreur | null>(null);
  const [registeredMerchant, setRegisteredMerchant] = useState<Merchant | null>(null);
  const [registeredArtisanPro, setRegisteredArtisanPro] = useState<Artisan | null>(null);
  const [registeredDoctor, setRegisteredDoctor] = useState<Doctor | null>(null);
  const [registeredPharmacy, setRegisteredPharmacy] = useState<Pharmacy | null>(null);
  const [registeredLawyer, setRegisteredLawyer] = useState<Lawyer | null>(null);
  const [registeredBailiff, setRegisteredBailiff] = useState<Bailiff | null>(null);
  const [registeredNotary, setRegisteredNotary] = useState<Notary | null>(null);
  const [registeredAccountant, setRegisteredAccountant] = useState<Accountant | null>(null);

  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const [checkoutData, setCheckoutData] = useState<{product: Product, merchant: Merchant} | null>(null);
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<MarketplaceOrder | null>(null);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    return localStorage.getItem('maraude_onboarding_completed') !== 'true';
  });

  useEffect(() => {
    localStorage.setItem('maraude_wallet', walletBalance.toString());
  }, [walletBalance]);

  const handleLogin = (profile: UserProfile) => {
    localStorage.setItem('maraude_user', JSON.stringify(profile));
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
      localStorage.setItem('maraude_user', JSON.stringify(updatedUser));
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
    if (!hasAcceptedTerms) return <TermsView onAccept={() => { setHasAcceptedTerms(true); localStorage.setItem('maraude_terms_accepted', 'true'); setActiveView('home'); }} />;

    if (activeView === 'home') {
      if (appModule === 'MARAUDE') {
        switch (user.role) {
          case 'DRIVER': return <DriverDashboard user={user} onNavigate={navigateProtected} onAcceptRequest={(r) => { setActiveRide(r); setActiveView('ride-progress'); }} registeredDriver={registeredDriver} />;
          case 'DELIVERY': return <DeliveryDashboard 
            onNavigate={setActiveView} 
            registeredLivreur={registeredLivreur} 
            marketplaceOrders={orders} 
            onAcceptRequest={(r) => { setActiveRide(r); setActiveView('ride-progress'); }} 
            onAcceptOrder={(id, name) => setOrders(orders.map(o => o.id === id ? { ...o, status: 'PICKED_UP', livreurName: name } : o))} 
            onMarkDelivered={(id) => setOrders(orders.map(o => o.id === id ? { ...o, status: 'DELIVERED' } : o))} 
            onUpdateOrder={(id, updates) => setOrders(orders.map(o => o.id === id ? { ...o, ...updates } : o))} 
          />;
          case 'ADMIN': return <AdminDashboard onNavigate={setActiveView} users={user ? [user] : []} orders={orders} rides={activeRide ? [activeRide] : []} artisans={artisans} />;
          default: return <HomeView onNavigate={navigateProtected} activeRide={activeRide} subscriptionTier={subscriptionTier} activeOrders={orders} onUpdateOrder={() => {}} userName={user.name} appModule="MARAUDE" onSwitchModule={(m) => { setAppModule(m); localStorage.setItem('maraude_app_module', m); }} />;
        }
      } else {
        switch (user.role) {
          case 'DOCTOR': return registeredDoctor ? <DoctorDashboard onNavigate={setActiveView} doctorName={user.name} /> : <DoctorRegistrationView onNavigate={setActiveView} onRegister={(d) => {setRegisteredDoctor(d); setActiveView('home');}} />;
          case 'PHARMACY': return registeredPharmacy ? <PharmacyDashboard onNavigate={setActiveView} pharmacy={registeredPharmacy} onUpdatePharmacy={setRegisteredPharmacy} /> : <PharmacyRegistrationView onNavigate={setActiveView} onRegister={(p) => { setRegisteredPharmacy(p); setActiveView('home'); }} />;
          case 'ARTISAN': return registeredArtisanPro ? <ArtisanDashboard onNavigate={setActiveView} artisan={registeredArtisanPro} /> : <ArtisanRegistrationView onNavigate={setActiveView} onRegister={(art) => { setRegisteredArtisanPro(art); setArtisans([art, ...artisans]); setActiveView('home'); }} />;
          case 'LAWYER': return registeredLawyer ? <LawyerDashboard onNavigate={setActiveView} lawyer={registeredLawyer} /> : <LawyerRegistrationView onNavigate={setActiveView} onRegister={(l) => { setRegisteredLawyer(l); setActiveView('home'); }} />;
          case 'BAILIFF': return registeredBailiff ? <BailiffDashboard onNavigate={setActiveView} bailiff={registeredBailiff} /> : <BailiffRegistrationView onNavigate={setActiveView} onRegister={(b) => { setRegisteredBailiff(b); setActiveView('home'); }} />;
          case 'NOTARY': return registeredNotary ? <NotaryDashboard onNavigate={setActiveView} notary={registeredNotary} /> : <NotaryRegistrationView onNavigate={setActiveView} onRegister={(n) => { setRegisteredNotary(n); setActiveView('home'); }} />;
          case 'ACCOUNTANT': return registeredAccountant ? <AccountantDashboard onNavigate={setActiveView} accountant={registeredAccountant} /> : <AccountantRegistrationView onNavigate={setActiveView} onRegister={(a) => { setRegisteredAccountant(a); setActiveView('home'); }} />;
          case 'MERCHANT': return <MerchantDashboard onNavigate={setActiveView} registeredMerchant={registeredMerchant} onUpdateMerchant={setRegisteredMerchant} />;
          case 'ADMIN': return <AdminDashboard onNavigate={setActiveView} users={user ? [user] : []} orders={orders} rides={activeRide ? [activeRide] : []} artisans={artisans} />;
          default: return <HomeView onNavigate={navigateProtected} activeRide={activeRide} subscriptionTier={subscriptionTier} activeOrders={orders} onUpdateOrder={() => {}} userName={user.name} appModule="SERVICES" onSwitchModule={(m) => { setAppModule(m); localStorage.setItem('maraude_app_module', m); }} />;
        }
      }
    }

    switch (activeView) {
      case 'business-dashboard': return <BusinessDashboard onNavigate={setActiveView} />;
      case 'pharmacies': return <PharmacyView onNavigate={setActiveView} onSelectPharmacy={(p) => { setSelectedPharmacy(p); setActiveView('medication-order'); }} registeredPharmacy={registeredPharmacy} />;
      case 'pharmacy-registration': return <PharmacyRegistrationView onNavigate={setActiveView} onRegister={(p) => { setRegisteredPharmacy(p); setActiveView('home'); }} />;
      case 'medication-order': return selectedPharmacy ? <MedicationOrderView onNavigate={setActiveView} pharmacy={selectedPharmacy} onCreateOrder={(o) => setOrders([o, ...orders])} clientName={user.name} /> : null;
      case 'doctor-registration': return <DoctorRegistrationView onNavigate={setActiveView} onRegister={(d) => { setRegisteredDoctor(d); setActiveView('home'); }} />;
      case 'client-dashboard': return <ClientDashboard onNavigate={setActiveView} user={user} subscriptionTier={subscriptionTier} orders={orders} walletBalance={walletBalance} onUpdateProfile={(u) => {setUser(u); localStorage.setItem('maraude_user', JSON.stringify(u));}} onTrackOrder={(o) => { setSelectedOrderForTracking(o); setActiveView('order-tracking'); }} />;
      case 'driver-registration': return <DriverRegistrationView onNavigate={navigateProtected} onRegister={(d) => { 
        setRegisteredDriver(d); 
        localStorage.setItem('maraude_driver_data', JSON.stringify(d)); 
        if (user) {
          const updated = { ...user, role: 'DRIVER' as UserRole };
          setUser(updated);
          localStorage.setItem('maraude_user', JSON.stringify(updated));
        }
        setActiveView('home'); 
      }} />;
      case 'artisans': return <ArtisansView onNavigate={setActiveView} registeredArtisan={registeredArtisanPro} artisansList={artisans} onRateArtisan={() => {}} />;
      case 'doctors': return <DoctorView onNavigate={setActiveView} />;
      case 'ride-progress': return activeRide ? <RideProgressView ride={activeRide} onEndRide={() => { setActiveRide(null); setActiveView('home'); }} onOpenSOS={() => setActiveView('sos')} contacts={contacts} user={user} /> : null;
      case 'wallet': return <WalletView onNavigate={setActiveView} balance={walletBalance} onUpdateBalance={setWalletBalance} />;
      case 'terms': return <TermsView isOnboarding={false} onClose={() => setActiveView('home')} />;
      case 'sos': return <SOSView onNavigate={setActiveView} contacts={contacts} activeRide={activeRide} onUpdateRide={(r) => setActiveRide(r)} />;
      case 'subscription': return <SubscriptionView onNavigate={setActiveView} currentTier={subscriptionTier} onUpgrade={() => {setSubscriptionTier('PREMIUM'); setActiveView('home');}} />;
      case 'booking': return <BookingView onNavigate={setActiveView} onStartRideRequest={(r) => { setPendingRide(r); setActiveView('waiting-validation'); }} />;
      case 'waiting-validation': return pendingRide ? <WaitingValidationView pendingRide={pendingRide} onCancel={() => { setPendingRide(null); setActiveView('booking'); }} onSimulateAccept={() => { setActiveRide({...pendingRide, status: 'ACCEPTED'}); setPendingRide(null); setActiveView('ride-progress'); }} onSimulateReject={() => { setPendingRide(null); setActiveView('booking'); }} /> : null;
      case 'marketplace': return <MarketplaceView onNavigate={setActiveView} registeredMerchant={registeredMerchant} onCreateOrder={(o) => setOrders([o, ...orders])} onBuyNow={(p, m) => { setCheckoutData({product: p, merchant: m}); setActiveView('order-checkout'); }} />;
      case 'maraude': return <MaraudeView user={user} onNavigate={setActiveView} onStartRide={setActiveRide} />;
      case 'clando': return <ClandoView onNavigate={setActiveView} onStartRide={setActiveRide} />;
      case 'quartier-maison': return <QuartierMaisonView onNavigate={setActiveView} onStartRide={setActiveRide} />;
      case 'order-tracking': return selectedOrderForTracking ? <DeliveryTrackingView order={selectedOrderForTracking} onNavigate={setActiveView} /> : null;
      case 'order-checkout': return checkoutData ? <OrderCheckoutView onNavigate={setActiveView} product={checkoutData.product} merchant={checkoutData.merchant} onCreateOrder={(o) => setOrders([o, ...orders])} clientName={user.name} /> : null;
      case 'delivery': return <DeliveryView onNavigate={setActiveView} registeredLivreur={registeredLivreur} onStartRideRequest={(r) => { setPendingRide(r); setActiveView('waiting-validation'); }} />;
      case 'lawyers': return <LawyerView onNavigate={setActiveView} />;
      case 'bailiffs': return <BailiffView onNavigate={setActiveView} />;
      case 'notaries': return <NotaryView onNavigate={setActiveView} />;
      case 'accountants': return <AccountantView onNavigate={setActiveView} />;
      case 'lawyer-registration': return <LawyerRegistrationView onNavigate={setActiveView} onRegister={(l) => { setRegisteredLawyer(l); setActiveView('home'); }} />;
      case 'bailiff-registration': return <BailiffRegistrationView onNavigate={setActiveView} onRegister={(b) => { setRegisteredBailiff(b); setActiveView('home'); }} />;
      case 'notary-registration': return <NotaryRegistrationView onNavigate={setActiveView} onRegister={(n) => { setRegisteredNotary(n); setActiveView('home'); }} />;
      case 'accountant-registration': return <AccountantRegistrationView onNavigate={setActiveView} onRegister={(a) => { setRegisteredAccountant(a); setActiveView('home'); }} />;
      case 'admin': return <AdminDashboard onNavigate={setActiveView} users={user ? [user] : []} orders={orders} rides={activeRide ? [activeRide] : []} artisans={artisans} />;
      case 'map': return <MapView onNavigate={setActiveView} />;
      case 'artisan-registration': return <ArtisanRegistrationView onNavigate={setActiveView} onRegister={(art) => { setRegisteredArtisanPro(art); setArtisans([art, ...artisans]); setActiveView('home'); }} />;
      case 'delivery-registration': return <DeliveryRegistrationView onNavigate={navigateProtected} onRegister={(l) => { setRegisteredLivreur(l); setActiveView('home'); }} />;
      case 'merchant-registration': return <MerchantRegistrationView onNavigate={navigateProtected} onRegister={(m) => { setRegisteredMerchant(m); setActiveView('home'); }} />;
      default: return <HomeView onNavigate={navigateProtected} activeRide={activeRide} subscriptionTier={subscriptionTier} activeOrders={orders} onUpdateOrder={() => {}} userName={user.name} appModule={appModule || 'MARAUDE'} onSwitchModule={(m) => { setAppModule(m); localStorage.setItem('maraude_app_module', m); }} />;
    }
  };

  const getBottomNavItems = () => {
    if (!user) return [];
    if (user.role === 'CLIENT') {
      if (appModule === 'MARAUDE') {
        return [
          { id: 'home', icon: Home, label: 'Accueil' },
          { id: 'booking', icon: MapPin, label: 'Course' },
          { id: 'map', icon: MapPin, label: 'Carte' },
        ];
      } else {
        return [
          { id: 'home', icon: Home, label: 'Accueil' },
          { id: 'pharmacies', icon: Pill, label: 'Santé' },
          { id: 'marketplace', icon: ShoppingBag, label: 'Marché' },
        ];
      }
    }
    return [
      { id: 'home', icon: LayoutDashboard, label: 'Dashboard' },
      { id: 'wallet', icon: Wallet, label: 'Wallet' },
    ];
  };

  if (user && appModule === null) {
    return (
      <div className="flex flex-col h-screen max-w-md mx-auto bg-white relative shadow-2xl overflow-hidden border-x border-slate-100">
        <AppLauncher 
          currentModule={appModule} 
          onSelect={(module) => { 
            setAppModule(module); 
            localStorage.setItem('maraude_app_module', module); 
            setActiveView('home'); 
          }} 
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white relative shadow-2xl overflow-hidden border-x border-slate-100">
      {user && activeView !== 'role-selection' && activeView !== 'one-pager' && (
        <header className="flex items-center justify-between px-6 py-3 glass-morphism sticky top-0 z-[50] shadow-sm">
          <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-slate-100 rounded-2xl transition-all">
            <Menu className="w-5 h-5 text-slate-800" />
          </button>
          
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-white font-black text-[10px] shadow-lg ${appModule === 'MARAUDE' ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-emerald-200' : 'bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-indigo-200'}`}>
              {appModule === 'MARAUDE' ? 'MA' : 'SE'}
            </div>
            <h1 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>{appModule === 'MARAUDE' ? 'Maraude' : 'Services'}</span>
              <span className={`w-1.5 h-1.5 rounded-full ${appModule === 'MARAUDE' ? 'bg-emerald-500' : 'bg-indigo-500'}`}></span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => { 
                setAppModule(null); 
                localStorage.removeItem('maraude_app_module'); 
              }} 
              className="p-1.5 hover:bg-slate-100 rounded-xl text-amber-500 hover:text-amber-600 transition-all flex items-center justify-center border border-amber-100 bg-amber-50/50"
              title="Portail Dual Apps"
            >
              <Sparkles className="w-4 h-4 fill-amber-500 animate-pulse" />
            </button>
            <button onClick={() => setActiveView('client-dashboard')} className="w-8 h-8 rounded-xl overflow-hidden border border-emerald-500/20">
              <img src={user.photo} className="w-full h-full object-cover" alt="Profile" />
            </button>
          </div>
        </header>
      )}

      <main className={`flex-1 overflow-y-auto relative bg-slate-50/30 z-0 hide-scrollbar ${user && activeView !== 'role-selection' && activeView !== 'one-pager' ? 'pb-32' : ''}`}>
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center p-20 space-y-4">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Chargement Sécurisé...</p>
          </div>
        }>
          {renderView()}
        </Suspense>
      </main>

      {user && activeView !== 'role-selection' && activeView !== 'one-pager' && (
        <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-[400px] glass-morphism px-2 py-2 flex justify-between items-center rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] z-[50]">
          {getBottomNavItems().map((item) => (
            <button key={item.id} onClick={() => navigateProtected(item.id as ViewState)} className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all min-w-[50px] ${activeView === item.id || (activeView === 'home' && item.id === 'home') ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-emerald-600'}`}>
              <item.icon className="w-4 h-4" />
              <span className="text-[8px] font-black uppercase tracking-tighter">{item.label}</span>
            </button>
          ))}
          <div className="h-6 w-px bg-slate-200 mx-1"></div>
          <button onClick={() => navigateProtected('sos')} className={`flex flex-col items-center gap-1 p-2 rounded-2xl min-w-[50px] ${activeView === 'sos' ? 'bg-red-500 text-white' : 'text-red-400'}`}>
            <AlertTriangle className="w-4 h-4" />
            <span className="text-[8px] font-black uppercase tracking-tighter">SOS</span>
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
                 { id: 'hub', icon: Sparkles, iconColor: 'text-amber-500', label: 'Portail Dual Apps 🌟' },
                 { id: 'home', icon: Home, label: 'Accueil' },
                 // Maraude only
                 ...(appModule === 'MARAUDE' ? [
                   { id: 'booking', icon: MapPin, label: 'Course' },
                   { id: 'maraude', icon: Smartphone, label: 'Radar Proximité' },
                   { id: 'one-pager', icon: Info, label: 'Présentation Maraude' },
                 ] : []),
                 // Services only
                 ...(appModule === 'SERVICES' ? [
                   { id: 'pharmacies', icon: Pill, label: 'Pharmacie' },
                   { id: 'doctors', icon: Stethoscope, label: 'Médecins' },
                   { id: 'marketplace', icon: ShoppingBag, label: 'Marketplace' },
                   { id: 'business-dashboard', icon: BarChart3, label: 'Projections Business' },
                 ] : []),
                 // Shared
                 { id: 'wallet', icon: Wallet, label: 'Portefeuille' },
                 { id: 'role-selection', icon: LayoutDashboard, label: 'Changer Profil' },
                 { id: 'terms', icon: ShieldCheck, label: 'Légal & Confidentialité' },
               ].map((nav) => (
                 <button key={nav.id} onClick={() => { 
                   if (nav.id === 'hub') {
                     setAppModule(null);
                     localStorage.removeItem('maraude_app_module');
                   } else {
                     setActiveView(nav.id as ViewState);
                   }
                   setSidebarOpen(false); 
                 }} className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-emerald-50 text-slate-600 font-bold text-xs transition-all">
                   <nav.icon className={`w-4 h-4 ${nav.iconColor || ''}`} /> {nav.label}
                 </button>
               ))}
               <div className="pt-6 border-t border-slate-100 mt-4">
                  <button onClick={() => setShowOnboarding(true)} className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-emerald-50 text-slate-600 font-bold text-xs transition-all">
                    <Sparkles className="w-4 h-4 text-emerald-500" /> Revoir l'Onboarding
                  </button>
                  <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-red-50 text-red-500 font-bold text-xs transition-all">
                    <LogOut className="w-4 h-4" /> Déconnexion
                  </button>
               </div>
            </div>
          </aside>
          <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-slate-900/40 z-[200] backdrop-blur-sm"></div>
        </>
      )}

      <AnimatePresence>
        {showOnboarding && (
          <OnboardingOverlay onComplete={() => {
            setShowOnboarding(false);
            localStorage.setItem('maraude_onboarding_completed', 'true');
          }} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
