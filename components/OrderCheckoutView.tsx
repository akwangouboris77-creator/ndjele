
import React, { useState } from 'react';
import { ArrowLeft, MapPin, CreditCard, ShieldCheck, CheckCircle2, Loader2, Package, Store, Clock, Phone, Smartphone } from 'lucide-react';
import { ViewState, Product, Merchant, MarketplaceOrder } from '../types';

interface OrderCheckoutViewProps {
  onNavigate: (view: ViewState) => void;
  product: Product;
  merchant: Merchant;
  onCreateOrder: (order: MarketplaceOrder) => void;
  clientName: string;
}

type PaymentProvider = 'AIRTEL' | 'MOOV';

const OrderCheckoutView: React.FC<OrderCheckoutViewProps> = ({ onNavigate, product, merchant, onCreateOrder, clientName }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>('AIRTEL');
  const [showUssdPrompt, setShowUssdPrompt] = useState(false);
  
  const deliveryFee = 1500;
  const totalPrice = product.price + deliveryFee;

  const handleStartPayment = () => {
    if (phoneNumber.length < 8) return;
    setIsProcessing(true);
    setTimeout(() => {
      setShowUssdPrompt(true);
      setIsProcessing(false);
    }, 1500);
  };

  const handleConfirmUssd = () => {
    setShowUssdPrompt(false);
    setIsProcessing(true);
    setTimeout(() => {
      const newOrder: MarketplaceOrder = {
        id: 'ORD-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        productId: product.id,
        productName: product.name,
        productPrice: product.price,
        deliveryFee: deliveryFee,
        totalPrice: totalPrice,
        merchantId: merchant.id,
        merchantName: merchant.shopName,
        merchantNeighborhood: merchant.neighborhood,
        clientName: clientName,
        clientNeighborhood: 'Akanda',
        status: 'PENDING_DELIVERY',
        timestamp: Date.now()
      };
      onCreateOrder(newOrder);
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2500);
  };

  if (isSuccess) {
    return (
      <div className="p-8 h-full flex flex-col items-center justify-center text-center space-y-8 animate-in zoom-in-95 duration-500 bg-white">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-inner relative">
          <CheckCircle2 className="w-12 h-12" />
          <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 animate-ping"></div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Commande validée !</h2>
          <p className="text-sm text-slate-500 font-medium px-4 leading-relaxed">
            Votre paiement de <span className="text-slate-900 font-bold">{totalPrice} F</span> a été confirmé via {selectedProvider === 'AIRTEL' ? 'Airtel' : 'Moov'} Money.
          </p>
        </div>

        <div className="w-full bg-slate-50 border-2 border-slate-100 p-6 rounded-[2.5rem] space-y-4">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">{product.image}</div>
              <div className="text-left">
                 <p className="text-[10px] font-black text-slate-400 uppercase">Article en route</p>
                 <p className="font-bold text-slate-800">{product.name}</p>
              </div>
           </div>
           <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
              <Package className="w-4 h-4 text-violet-600" />
              <p className="text-[10px] font-bold text-slate-500 uppercase">Recherche d'un livreur en cours...</p>
           </div>
        </div>

        <button 
          onClick={() => onNavigate('home')}
          className="w-full py-5 gradient-primary text-white rounded-[2rem] font-black uppercase text-xs shadow-xl active:scale-95 transition-all"
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 animate-in slide-in-from-right-4 duration-300 pb-24 h-full flex flex-col relative">
      {/* Simulation USSD Push Overlay */}
      {showUssdPrompt && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="w-full max-w-[280px] bg-[#dfdfdf] rounded-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 border border-white/20">
            <div className="p-5 text-center space-y-4">
              <p className="text-sm font-mono text-black leading-tight">
                {selectedProvider === 'AIRTEL' ? 'Airtel Money' : 'Moov Money'}:<br/>
                Payer {totalPrice} FCFA à NDJELE MARKET ?<br/>
                Entrez votre code secret :
              </p>
              <input 
                type="password" 
                maxLength={4} 
                placeholder="****"
                className="w-full bg-white border border-slate-400 p-2 text-center font-mono text-xl tracking-widest text-black outline-none"
              />
            </div>
            <div className="grid grid-cols-2 border-t border-slate-400">
              <button onClick={() => setShowUssdPrompt(false)} className="py-3 font-mono text-blue-600 border-r border-slate-400 active:bg-slate-300">Non</button>
              <button onClick={handleConfirmUssd} className="py-3 font-mono text-blue-600 font-bold active:bg-slate-300">Oui</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        <button onClick={() => onNavigate('marketplace')} className="p-2 bg-white rounded-full shadow-sm">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h2 className="text-2xl font-black text-slate-800">Finaliser l'achat</h2>
      </div>

      <div className="flex-1 space-y-8 overflow-y-auto pr-1">
        {/* Product Card */}
        <section className="bg-white border border-slate-100 p-6 rounded-[2.5rem] shadow-sm flex items-center gap-5">
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-4xl shadow-inner shrink-0">
            {product.image}
          </div>
          <div className="space-y-1 min-w-0">
            <h3 className="font-black text-slate-800 text-lg truncate">{product.name}</h3>
            <div className="flex items-center gap-2">
              <Store className="w-3.5 h-3.5 text-violet-500" />
              <p className="text-[10px] font-bold text-slate-400 uppercase truncate">{merchant.shopName}</p>
            </div>
            <p className="text-2xl font-black text-violet-600 mt-2">{product.price} F</p>
          </div>
        </section>

        {/* Payment Summary */}
        <section className="space-y-4">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Récapitulatif</h4>
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-4 shadow-xl">
             <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 font-medium">Prix de l'article</span>
                <span className="font-bold">{product.price} F</span>
             </div>
             <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 font-medium">Frais de livraison</span>
                <span className="font-bold">{deliveryFee} F</span>
             </div>
             <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="font-black uppercase text-xs tracking-wider">Total à régler</span>
                <span className="text-3xl font-black text-violet-400">{totalPrice} F</span>
             </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Mode de paiement Mobile</label>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setSelectedProvider('AIRTEL')}
                className={`p-4 rounded-3xl border-2 flex items-center gap-3 transition-all ${selectedProvider === 'AIRTEL' ? 'border-red-500 bg-red-50' : 'bg-white border-slate-100'}`}
              >
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-black text-xs">A</div>
                <span className="text-[10px] font-black uppercase text-slate-800">Airtel</span>
              </button>
              <button 
                onClick={() => setSelectedProvider('MOOV')}
                className={`p-4 rounded-3xl border-2 flex items-center gap-3 transition-all ${selectedProvider === 'MOOV' ? 'border-blue-500 bg-blue-50' : 'bg-white border-slate-100'}`}
              >
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-xs">M</div>
                <span className="text-[10px] font-black uppercase text-slate-800">Moov</span>
              </button>
            </div>

            <div className="bg-white border border-slate-100 p-6 rounded-[2.5rem] space-y-4">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Numéro {selectedProvider === 'AIRTEL' ? 'Airtel' : 'Moov'}</label>
                 <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="tel" 
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder={selectedProvider === 'AIRTEL' ? '074...' : '066...'}
                      className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-lg outline-none focus:border-violet-500 transition-all"
                    />
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Badge */}
        <div className="bg-violet-50 p-6 rounded-[2rem] border border-violet-100 flex items-start gap-4">
          <ShieldCheck className="w-6 h-6 text-violet-600 shrink-0" />
          <div className="space-y-1">
            <h5 className="font-black text-violet-900 text-xs uppercase">Séquestre Ndjele Solution</h5>
            <p className="text-[10px] text-violet-700 font-bold leading-relaxed opacity-80">
              Votre argent est conservé en sécurité par Ndjele. Le marchand n'est payé que lorsque vous recevez votre colis.
            </p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="space-y-3">
        <button 
          onClick={handleStartPayment}
          disabled={isProcessing || phoneNumber.length < 8}
          className="w-full py-5 gradient-primary text-white rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 transition-all"
        >
          {isProcessing ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Traitement {selectedProvider}...</>
          ) : (
            <><Smartphone className="w-5 h-5" /> Payer {totalPrice} F</>
          )}
        </button>
      </div>
    </div>
  );
};

export default OrderCheckoutView;
