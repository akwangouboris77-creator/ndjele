
import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Navigation, Package, Truck, CheckCircle2, Clock, Loader2, Phone, MessageSquare } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { ViewState, MarketplaceOrder } from '../types';

interface DeliveryTrackingViewProps {
  order: MarketplaceOrder;
  onNavigate: (view: ViewState) => void;
}

const DeliveryTrackingView: React.FC<DeliveryTrackingViewProps> = ({ order, onNavigate }) => {
  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [status, setStatus] = useState(order.status);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    newSocket.emit("join-delivery", order.id);

    newSocket.on("delivery-update", (data: { lat: number, lng: number, status: string }) => {
      setLocation({ lat: data.lat, lng: data.lng });
      setStatus(data.status as any);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [order.id]);

  const simulateMovement = () => {
    if (!socket || isSimulating) return;
    setIsSimulating(true);

    let currentLat = 0.39;
    let currentLng = 9.45;
    const destLat = 0.42;
    const destLng = 9.48;
    const steps = 20;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      currentLat += (destLat - currentLat) / (steps - currentStep + 1);
      currentLng += (destLng - currentLng) / (steps - currentStep + 1);

      socket.emit("update-delivery-location", {
        deliveryId: order.id,
        lat: currentLat,
        lng: currentLng,
        status: currentStep === steps ? 'DELIVERED' : 'SHIPPED'
      });

      if (currentStep === steps) {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 2000);
  };

  const mapUrl = location 
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${location.lng - 0.01},${location.lat - 0.01},${location.lng + 0.01},${location.lat + 0.01}&layer=mapnik&marker=${location.lat},${location.lng}`
    : `https://www.openstreetmap.org/export/embed.html?bbox=9.44,0.38,9.46,0.40&layer=mapnik&marker=0.39,9.45`;

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white p-6 border-b border-slate-100 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => onNavigate('home')} className="p-2 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div className="flex-1">
          <h2 className="text-lg font-black text-slate-900 tracking-tighter uppercase">Suivi Livraison</h2>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Commande #{order.id.slice(-5)}</p>
        </div>
        <div className="flex items-center gap-2">
          {status === 'SHIPPED' && <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />}
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{status}</span>
        </div>
      </header>

      {/* Map Content */}
      <div className="flex-1 relative overflow-hidden">
        <iframe 
          title="Delivery Map"
          width="100%" 
          height="100%" 
          frameBorder="0" 
          scrolling="no" 
          marginHeight={0} 
          marginWidth={0} 
          src={mapUrl}
          className="grayscale-[0.2] contrast-[1.1]"
        ></iframe>

        {/* Floating Info Overlay */}
        <div className="absolute top-6 left-6 right-6 pointer-events-none">
          <div className="bg-white/90 backdrop-blur-md p-4 rounded-3xl shadow-xl border border-white/20 flex items-center gap-4 pointer-events-auto">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Livreur en route</p>
              <h3 className="text-sm font-black text-slate-800">Moussa le Rapide</h3>
            </div>
            <div className="flex gap-2">
              <button className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <Phone className="w-4 h-4" />
              </button>
              <button className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div className="absolute bottom-6 left-6 right-6 bg-white p-6 rounded-[2.5rem] shadow-2xl border border-slate-100 space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-xl font-black text-slate-900 leading-none">Arrivée prévue</h3>
              <p className="text-sm text-slate-500 font-bold mt-2">Dans environ 12 minutes</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Destination</p>
              <p className="text-sm font-black text-slate-800">{order.deliveryAddress || 'Libreville'}</p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-2">
            {[
              { label: 'Confirmé', active: true, icon: CheckCircle2 },
              { label: 'En route', active: status === 'SHIPPED' || status === 'DELIVERED', icon: Truck },
              { label: 'Livré', active: status === 'DELIVERED', icon: Package },
            ].map((step, i) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center gap-1 flex-1">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${step.active ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-slate-100 text-slate-400'}`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[8px] font-black uppercase tracking-tighter ${step.active ? 'text-emerald-600' : 'text-slate-400'}`}>{step.label}</span>
                </div>
                {i < 2 && <div className={`h-1 flex-1 rounded-full ${step.active && i === 0 ? 'bg-emerald-600' : 'bg-slate-100'}`} />}
              </React.Fragment>
            ))}
          </div>

          {/* Simulation Button (Only for demo) */}
          <button 
            onClick={simulateMovement}
            disabled={isSimulating || status === 'DELIVERED'}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSimulating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Simuler le mouvement'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryTrackingView;
