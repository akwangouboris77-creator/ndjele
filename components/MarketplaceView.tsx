import React, { useState } from 'react';
import { Search, ShoppingBag, Store, ArrowLeft, Star, ShieldCheck, ChevronRight, UserPlus, Phone, MapPin, Tag, LayoutDashboard, X, CreditCard, CheckCircle2, PlusCircle } from 'lucide-react';
import { ViewState, Merchant, Product, MarketplaceOrder } from '../types';

interface MarketplaceViewProps {
  onNavigate: (view: ViewState) => void;
  registeredMerchant: Merchant | null;
  onCreateOrder: (order: MarketplaceOrder) => void;
  onBuyNow: (product: Product, merchant: Merchant) => void;
}

const MOCK_MERCHANTS: Merchant[] = [
  { 
    id: 'm1', ownerName: 'Mme Boussougou', shopName: 'Épicerie du Coin', phone: '+241 07 11 22 33', neighborhood: 'Nzeng-Ayong', category: 'Alimentation', rating: 4.8, isVerified: true, 
    products: [
      { id: 'p1', name: 'Pain Beurre', price: 500, image: '🥖', category: 'Alimentation', merchantId: 'm1' },
      { id: 'p2', name: 'Sucre (1kg)', price: 900, image: '📦', category: 'Alimentation', merchantId: 'm1' }
    ]
  },
  { 
    id: 'm2', ownerName: 'Jean P.', shopName: 'Tech Gabon', phone: '+241 06 44 55 66', neighborhood: 'Louis', category: 'Électronique', rating: 4.9, isVerified: true, 
    products: [
      { id: 'p3', name: 'Câble USB-C', price: 2500, image: '🔌', category: 'Accessoires', merchantId: 'm2' },
      { id: 'p4', name: 'Écouteurs', price: 5000, image: '🎧', category: 'Audio', merchantId: 'm2' }
    ]
  },
];

const MarketplaceView: React.FC<MarketplaceViewProps> = ({ onNavigate, registeredMerchant, onCreateOrder, onBuyNow }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const deliveryFee = 1500;

  const handleCheckout = () => {
    if (!checkoutProduct || !selectedMerchant) return;
    setIsProcessing(true);
    
    setTimeout(() => {
      const newOrder: MarketplaceOrder = {
        id: 'ORD-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        productId: checkoutProduct.id,
        productName: checkoutProduct.name,
        productPrice: checkoutProduct.price,
        deliveryFee: deliveryFee,
        totalPrice: checkoutProduct.price + deliveryFee,
        merchantId: selectedMerchant.id,
        merchantName: selectedMerchant.shopName,
        merchantNeighborhood: selectedMerchant.neighborhood,
        clientName: 'Jean Dupont',
        clientNeighborhood: 'Akanda',
        status: 'PENDING_DELIVERY',
        timestamp: Date.now()
      };
      
      onCreateOrder(newOrder);
      setIsProcessing(false);
      setOrderComplete(true);
    }, 2000);
  };

  const allMerchants = registeredMerchant ? [registeredMerchant, ...MOCK_MERCHANTS] : MOCK_MERCHANTS;
  const filteredMerchants = allMerchants.filter(m => 
    m.shopName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.neighborhood.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedMerchant) {
    return (
      <div className="p-6 space-y-6 animate-in slide-in-from-right-4 duration-300">
        <div className="flex items-center gap-4">
          <button onClick={() => setSelectedMerchant(null)} className="p-2 bg-white rounded-full shadow-sm">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h2 className="text-xl font-black text-slate-800 truncate">{selectedMerchant.shopName}</h2>
        </div>

        <div className="bg-violet-600 p-6 rounded-[2.5rem] text-white shadow-xl space-y-3 relative overflow-hidden">
           <div className="flex items-center gap-2">
             <ShieldCheck className="w-4 h-4 text-violet-200" />
             <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Boutique Vérifiée</span>
           </div>
           <p className="text-xs opacity-90 leading-relaxed">Située à <span className="font-bold">{selectedMerchant.neighborhood}</span>.</p>
           <div className="flex items-center gap-4 pt-2">
              <div className="bg-white/20 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                <Star className="w-3 h-3 fill-white" />
                <span className="text-xs font-black">{selectedMerchant.rating}</span>
              </div>
           </div>
           <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {selectedMerchant.products.map(product => (
            <div key={product.id} className="bg-white border border-slate-100 p-4 rounded-3xl shadow-sm space-y-3 flex flex-col items-center text-center">
               <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center text-4xl shadow-inner">{product.image}</div>
               <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 text-sm leading-tight">{product.name}</h4>
                  <p className="text-violet-600 font-black text-lg">{product.price} F</p>
               </div>
               <div className="w-full space-y-2">
                 <button onClick={() => setCheckoutProduct(product)} className="w-full py-2 bg-slate-900 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest active:scale-95 transition-transform">
                    Commander
                 </button>
                 <button onClick={() => onBuyNow(product, selectedMerchant)} className="w-full py-2 bg-violet-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest active:scale-95 transition-transform">
                    Acheter maintenant
                 </button>
               </div>
            </div>
          ))}
        </div>

        {/* Checkout Modal */}
        {checkoutProduct && (
          <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-end animate-in fade-in duration-300">
            <div className="w-full bg-white rounded-t-[3rem] p-8 space-y-6 animate-in slide-in-from-bottom-10">
              {orderComplete ? (
                <div className="text-center space-y-6 py-6 animate-in zoom-in-95">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner"><CheckCircle2 className="w-12 h-12" /></div>
                  <h3 className="text-2xl font-black text-slate-800">Commande Payée !</h3>
                  <p className="text-sm text-slate-500 font-medium">L'argent est sécurisé par Ndjele Security. Un livreur va récupérer votre colis sous peu.</p>
                  <button onClick={() => onNavigate('home')} className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-bold text-sm shadow-xl active:scale-95">Suivre ma commande</button>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-black text-slate-800">Récapitulatif</h3>
                    <button onClick={() => setCheckoutProduct(null)} className="p-2 bg-slate-100 rounded-full"><X className="w-5 h-5" /></button>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-[2rem] space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 font-medium">{checkoutProduct.name}</span>
                      <span className="text-slate-800 font-bold">{checkoutProduct.price} F</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 font-medium">Livraison Express</span>
                      <span className="text-slate-800 font-bold">{deliveryFee} F</span>
                    </div>
                    <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                      <span className="font-black uppercase text-xs">Total à payer</span>
                      <span className="text-2xl font-black text-violet-600">{checkoutProduct.price + deliveryFee} F</span>
                    </div>
                  </div>
                  <div className="bg-violet-50 p-4 rounded-2xl border border-violet-100 flex items-start gap-3">
                    <CreditCard className="w-5 h-5 text-violet-600 shrink-0" />
                    <p className="text-[10px] text-violet-800 font-bold leading-relaxed">L'argent ne sera versé au marchand et au livreur qu'une fois que vous aurez confirmé la réception du colis.</p>
                  </div>
                  <button onClick={handleCheckout} disabled={isProcessing} className="w-full py-5 bg-violet-600 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl flex items-center justify-center gap-2 disabled:opacity-50">
                    {isProcessing ? 'Traitement...' : `Payer ${checkoutProduct.price + deliveryFee} F`}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 animate-in slide-in-from-right-4 duration-500 pb-24">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('home')} className="p-2 bg-white rounded-full shadow-sm"><ArrowLeft className="w-5 h-5 text-slate-600" /></button>
          <h2 className="text-2xl font-black text-slate-800">Ndjele Market</h2>
        </div>
        {registeredMerchant ? (
           <button 
            onClick={() => onNavigate('merchant-dashboard')}
            className="p-3 bg-violet-600 text-white rounded-2xl flex items-center gap-2 font-bold text-[10px] uppercase shadow-lg shadow-violet-200"
          >
            <LayoutDashboard className="w-4 h-4" /> Ma Boutique
          </button>
        ) : (
          <button 
            onClick={() => onNavigate('merchant-registration')}
            className="p-3 bg-violet-50 text-violet-600 rounded-2xl flex items-center gap-2 font-bold text-[10px] uppercase"
          >
            <PlusCircle className="w-4 h-4" /> Ouvrir ma boutique
          </button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-violet-500" />
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Chercher une boutique..." className="w-full pl-12 pr-4 py-5 bg-white border-2 border-slate-50 rounded-[2rem] text-slate-800 font-bold text-sm outline-none shadow-sm focus:border-violet-500 transition-all" />
      </div>

      <div className="space-y-4">
        {filteredMerchants.map((merchant) => (
          <button key={merchant.id} onClick={() => setSelectedMerchant(merchant)} className="w-full bg-white border border-slate-100 p-5 rounded-[2.5rem] shadow-sm flex items-center gap-4 text-left group hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-violet-50 rounded-3xl flex items-center justify-center text-3xl shadow-inner group-hover:scale-105 transition-transform"><Store className="w-8 h-8 text-violet-400" /></div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-slate-800 text-base truncate">{merchant.shopName}</h4>
                <div className="flex items-center gap-1 text-amber-500"><Star className="w-3 h-3 fill-current" /><span className="text-[10px] font-black">{merchant.rating}</span></div>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">{merchant.neighborhood}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MarketplaceView;