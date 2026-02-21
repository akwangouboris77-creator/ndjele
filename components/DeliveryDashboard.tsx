
import React, { useState } from 'react';
import { Package, MapPin, Zap, Smartphone, Check, Clock, TrendingUp, Wallet, Star, Navigation, AlertTriangle, ChevronRight, CheckCircle2, X, Store, ArrowRight } from 'lucide-react';
import { ViewState, Livreur, ActiveRide, MarketplaceOrder } from '../types';

interface DeliveryDashboardProps {
  onNavigate: (view: ViewState) => void;
  registeredLivreur: Livreur | null;
  onAcceptRequest: (ride: ActiveRide) => void;
  marketplaceOrders: MarketplaceOrder[];
  onAcceptOrder: (id: string, livreurName: string) => void;
  onMarkDelivered: (id: string) => void;
  onUpdateOrder: (id: string, updates: Partial<MarketplaceOrder>) => void;
}

const DeliveryDashboard: React.FC<DeliveryDashboardProps> = ({ 
  onNavigate, 
  registeredLivreur, 
  onAcceptRequest, 
  marketplaceOrders, 
  onAcceptOrder, 
  onMarkDelivered,
  onUpdateOrder
}) => {
  const [isOnline, setIsOnline] = useState(true);
  const [tab, setTab] = useState<'express' | 'store'>('express');
  const [incomingRequests] = useState<any[]>([
    { id: 'del1', customer: 'Mme Boussougou', pickup: 'Boulangerie Choisie', dropoff: 'Nzeng-Ayong', price: 2500, items: 'Pâtisseries' }
  ]);

  if (!registeredLivreur) {
    return (
      <div className="p-8 h-full flex flex-col items-center justify-center text-center space-y-4">
        <AlertTriangle className="w-16 h-16 text-amber-500" />
        <h3 className="text-xl font-black text-slate-800">Profil Non Trouvé</h3>
        <button onClick={() => onNavigate('delivery-registration')} className="px-8 py-4 bg-pink-600 text-white rounded-2xl font-bold">S'enregistrer maintenant</button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500 pb-24">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-800 leading-tight">Livreur Pro</h2>
        <button onClick={() => setIsOnline(!isOnline)} className={`w-14 h-8 rounded-full transition-all relative ${isOnline ? 'bg-pink-500' : 'bg-slate-200'}`}>
          <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm ${isOnline ? 'left-7' : 'left-1'}`}></div>
        </button>
      </div>

      <div className="bg-slate-900 p-6 rounded-[2.5rem] text-white shadow-xl flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold">{registeredLivreur.name}</h3>
          <p className="text-[10px] font-black uppercase text-pink-400">Certifié NS • {registeredLivreur.neighborhood}</p>
        </div>
        <div className="bg-white/10 px-4 py-2 rounded-2xl text-center"><p className="text-lg font-black tracking-tighter">★ {registeredLivreur.rating}</p></div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
        <button onClick={() => setTab('express')} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase transition-all ${tab === 'express' ? 'bg-white text-pink-600 shadow-sm' : 'text-slate-400'}`}>Express Direct</button>
        <button onClick={() => setTab('store')} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase transition-all relative ${tab === 'store' ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-400'}`}>
          Commandes Boutique
          {marketplaceOrders.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-violet-600 text-white rounded-full flex items-center justify-center text-[8px] border-2 border-white">{marketplaceOrders.length}</span>}
        </button>
      </div>

      <section className="space-y-4">
        {tab === 'express' ? (
          <div className="space-y-4">
            {incomingRequests.map(req => (
              <div key={req.id} className="bg-white border border-slate-100 p-5 rounded-[2.5rem] shadow-sm space-y-4">
                <div className="flex justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center text-pink-600"><Package className="w-6 h-6" /></div>
                    <h4 className="font-bold text-slate-800 text-sm">{req.customer}</h4>
                  </div>
                  <p className="text-lg font-black text-slate-900">{req.price} F</p>
                </div>
                <button className="w-full py-3 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase shadow-lg">Accepter</button>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {marketplaceOrders.map(order => (
              <div key={order.id} className="bg-white border-2 border-violet-100 p-6 rounded-[2.5rem] shadow-sm space-y-4 animate-in slide-in-from-right-4">
                <div className="flex justify-between items-start">
                   <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-violet-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner">📦</div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm leading-tight">{order.productName}</h4>
                        <p className="text-[10px] font-black text-violet-500 uppercase">{order.merchantName}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-lg font-black text-slate-900 leading-tight">{order.deliveryFee} F</p>
                      <p className="text-[8px] font-black text-emerald-500 uppercase">Livraison</p>
                   </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl space-y-3">
                   <div className="flex items-center gap-3 text-[10px]">
                      <Store className="w-3.5 h-3.5 text-violet-400" />
                      <span className="font-bold text-slate-400">PICKUP :</span>
                      <span className="font-black text-slate-800">{order.merchantNeighborhood}</span>
                   </div>
                   <div className="flex items-center gap-3 text-[10px]">
                      <MapPin className="w-3.5 h-3.5 text-pink-400" />
                      <span className="font-bold text-slate-400">DROP :</span>
                      <span className="font-black text-slate-800">{order.clientNeighborhood}</span>
                   </div>
                </div>

                {order.status === 'PENDING_DELIVERY' ? (
                  <button 
                    onClick={() => onAcceptOrder(order.id, registeredLivreur.name)}
                    className="w-full py-4 bg-violet-600 text-white rounded-2xl font-black text-xs uppercase shadow-lg shadow-violet-200 flex items-center justify-center gap-2 active:scale-95 transition-transform"
                  >
                    Accepter la commande <ArrowRight className="w-4 h-4" />
                  </button>
                ) : order.status === 'PICKED_UP' ? (
                  <button 
                    onClick={() => onUpdateOrder(order.id, { status: 'WAITING_CLIENT_VALIDATION' })}
                    className="w-full py-4 bg-amber-500 text-white rounded-2xl font-black text-xs uppercase shadow-lg shadow-amber-200 flex items-center justify-center gap-2"
                  >
                    <Clock className="w-4 h-4" /> Marquer comme livré (Attente client)
                  </button>
                ) : order.status === 'WAITING_CLIENT_VALIDATION' ? (
                  <button 
                    onClick={() => onMarkDelivered(order.id)}
                    className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Confirmer livraison définitive
                  </button>
                ) : (
                  <div className="py-3 text-center text-[10px] font-black text-slate-400 uppercase bg-slate-50 rounded-2xl">
                    Livraison terminée
                  </div>
                )}
              </div>
            ))}
            {marketplaceOrders.length === 0 && (
              <div className="p-12 text-center text-slate-300 italic text-sm">Aucune commande boutique disponible.</div>
            )}
          </div>
        )}
      </section>

      <div className="bg-emerald-600 p-8 rounded-[2.5rem] text-white shadow-2xl text-center space-y-4">
        <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Gains Sécurisés (Escrow)</p>
        <div className="flex items-end justify-center gap-2">
          <span className="text-4xl font-black">15 200</span>
          <span className="text-lg font-bold opacity-60 mb-1.5">F</span>
        </div>
        <p className="text-[8px] font-medium leading-relaxed opacity-60 px-6">L'argent est versé sur votre solde retirable dès que le client confirme la réception.</p>
      </div>
    </div>
  );
};

export default DeliveryDashboard;
