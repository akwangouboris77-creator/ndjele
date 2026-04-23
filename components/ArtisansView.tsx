
import React, { useState, useEffect, useRef } from 'react';
import { Search, Droplet, Zap, Snowflake, ArrowLeft, Star, ShieldCheck, MessageSquare, Sparkles, Loader2, X, CheckCircle2, CreditCard, Info, Phone } from 'lucide-react';
import { ViewState, Artisan, ChatMessage, ArtisanCategory } from '../types';
import { getArtisanDiagnosis, getDriverChatResponse } from '../services/geminiService';

interface ArtisansViewProps {
  onNavigate: (view: ViewState) => void;
  registeredArtisan: Artisan | null;
  artisansList: Artisan[];
  onRateArtisan: (id: string, rating: number) => void;
}

const CATEGORIES: { id: ArtisanCategory, label: string, icon: any, color: string }[] = [
  { id: 'froid', label: 'Froid & Clim', icon: Snowflake, color: 'bg-blue-100 text-blue-600' },
  { id: 'plomberie', label: 'Plomberie', icon: Droplet, color: 'bg-cyan-100 text-cyan-600' },
  { id: 'electricite', label: 'Électricité', icon: Zap, color: 'bg-yellow-100 text-yellow-600' },
];

const ArtisansView: React.FC<ArtisansViewProps> = ({ onNavigate, artisansList }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<any>(null);
  const [prePaidArtisanId, setPrePaidArtisanId] = useState<string[]>([]);
  const [payingForId, setPayingForId] = useState<string | null>(null);
  const [selectedArtisanForContact, setSelectedArtisanForContact] = useState<Artisan | null>(null);
  const [chatArtisan, setChatArtisan] = useState<Artisan | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const COMMISSION_RATE = 0.09;
  const PROVISION_AMOUNT = 2000;
  const fees = Math.round(PROVISION_AMOUNT * COMMISSION_RATE);
  const totalProvision = PROVISION_AMOUNT + fees;

  const handleDiagnosis = async () => {
    if (!searchQuery.trim()) return;
    setIsDiagnosing(true);
    try {
      const result = await getArtisanDiagnosis(searchQuery);
      setDiagnosis(result);
    } catch (e) { console.error(e); } finally { setIsDiagnosing(false); }
  };

  const processPrePayment = (id: string) => {
    setPayingForId(id);
    setTimeout(() => {
      setPrePaidArtisanId([...prePaidArtisanId, id]);
      setPayingForId(null);
      const artisan = artisansList.find(a => a.id === id);
      if (artisan) handleStartChat(artisan);
    }, 2000);
  };

  const handleStartChat = (artisan: Artisan) => {
    if (!prePaidArtisanId.includes(artisan.id)) {
      setPayingForId(artisan.id);
      return;
    }
    setChatArtisan(artisan);
    setMessages([{ id: '1', sender: 'DRIVER', text: `Bonjour ! Votre provision de ${PROVISION_AMOUNT}F a été sécurisée. Parlons de votre souci technique.`, timestamp: Date.now() }]);
  };

  return (
    <div className="p-6 space-y-8 animate-in slide-in-from-right-4 duration-500 pb-32">
      {payingForId && (
        <div className="fixed inset-0 z-[700] bg-slate-900/90 backdrop-blur-xl flex items-center justify-center p-8 animate-in fade-in">
           <div className="bg-white rounded-[3rem] p-8 w-full max-w-sm text-center space-y-6 shadow-2xl">
              <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                 <CreditCard className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                 <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Pré-paiement Provision</h3>
                 <div className="bg-slate-50 p-4 rounded-2xl text-left space-y-2">
                    <div className="flex justify-between text-[10px] font-bold">
                       <span className="text-slate-400">Dépôt artisan (Acompte)</span>
                       <span>{PROVISION_AMOUNT} F</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold">
                       <span className="text-slate-400">Frais Maraude (Non-remb.)</span>
                       <span className="text-indigo-600">{fees} F</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                       <span className="font-black uppercase text-[10px]">Total</span>
                       <span className="text-xl font-black text-slate-900">{totalProvision} F</span>
                    </div>
                 </div>
              </div>
              <div className="flex items-start gap-2 bg-amber-50 p-3 rounded-xl">
                 <Info className="w-4 h-4 text-amber-600 shrink-0" />
                 <p className="text-[9px] text-amber-800 text-left font-bold">
                   L'acompte est déductible du devis final. Si l'artisan ne vient pas, vous récupérez {PROVISION_AMOUNT}F. Les frais {fees}F restent acquis à Maraude.
                 </p>
              </div>
              <button 
                onClick={() => processPrePayment(payingForId)}
                className="w-full py-5 gradient-primary text-white rounded-[2rem] font-black uppercase text-xs shadow-xl active:scale-95"
              >
                Payer {totalProvision}F & Chatter
              </button>
              <button onClick={() => setPayingForId(null)} className="text-slate-400 font-bold text-xs uppercase">Annuler</button>
           </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        <button onClick={() => onNavigate('home')} className="p-2 bg-white rounded-full shadow-sm border border-slate-100">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Artisans Pro</h2>
      </div>

      <section className="bg-indigo-600 rounded-[2.5rem] p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-200" />
            <h3 className="font-black text-xs uppercase tracking-widest">Diagnostic IA</h3>
          </div>
          <div className="flex gap-2">
            <input 
              type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ex: Panne clim, fuite..."
              className="flex-1 bg-indigo-700 border border-white/20 rounded-2xl px-4 py-4 text-sm font-bold text-white placeholder:text-indigo-200 outline-none focus:bg-indigo-800 transition-all"
            />
            <button onClick={handleDiagnosis} disabled={isDiagnosing} className="bg-white p-4 rounded-2xl shadow-lg">
              {isDiagnosing ? <Loader2 className="w-6 h-6 animate-spin text-indigo-600" /> : <Search className="w-6 h-6 text-indigo-600" />}
            </button>
          </div>
        </div>
      </section>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Artisans certifiés à proximité</h3>
          <button 
            onClick={() => onNavigate('artisan-registration')}
            className="text-[9px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100"
          >
            Devenir Artisan Maraude
          </button>
        </div>
        {artisansList.map((artisan) => (
          <div key={artisan.id} className="bg-white border border-slate-100 p-5 rounded-[2.5rem] shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <img src={artisan.avatar} className="w-16 h-16 rounded-2xl object-cover shadow-sm" alt={artisan.name} />
              <div className="flex-1 text-left">
                <div className="flex justify-between items-start">
                   <h4 className="font-black text-slate-800 text-sm">{artisan.name}</h4>
                   <div className="flex items-center gap-1 text-indigo-600"><Star className="w-3 h-3 fill-current" /><span className="text-[10px] font-black">{artisan.rating}</span></div>
                </div>
                <p className="text-[9px] text-indigo-500 font-black uppercase">{artisan.job}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleStartChat(artisan)}
                className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase shadow-lg transition-all flex items-center justify-center gap-2 ${prePaidArtisanId.includes(artisan.id) ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white'}`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                {prePaidArtisanId.includes(artisan.id) ? 'Chat' : 'Payer & Chatter'}
              </button>
              <button 
                onClick={() => setSelectedArtisanForContact(artisan)}
                className="flex-1 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl font-black text-[10px] uppercase active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Phone className="w-3.5 h-3.5" /> Direct
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedArtisanForContact && (
        <div className="fixed inset-0 z-[700] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="w-full max-w-sm bg-white rounded-[3rem] p-8 space-y-8 animate-in zoom-in-95 shadow-2xl relative">
            <button onClick={() => setSelectedArtisanForContact(null)} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full text-slate-400"><X className="w-4 h-4" /></button>
            <div className="text-center space-y-4 pt-4">
              <img src={selectedArtisanForContact.avatar} className="w-24 h-24 rounded-[2.5rem] mx-auto object-cover border-4 border-indigo-50 shadow-xl" />
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">{selectedArtisanForContact.name}</h3>
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{selectedArtisanForContact.job}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl">
                <p className="text-sm font-black text-slate-800">{selectedArtisanForContact.phone}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">Plateforme Artisan Maraude</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <a href={`tel:${selectedArtisanForContact.phone}`} className="flex flex-col items-center gap-3 p-6 bg-indigo-600 text-white rounded-[2rem] shadow-lg shadow-indigo-200 active:scale-95 transition-transform">
                <Phone className="w-6 h-6" />
                <span className="text-[10px] font-black uppercase tracking-widest">Appeler</span>
              </a>
              <a href={`sms:${selectedArtisanForContact.phone}`} className="flex flex-col items-center gap-3 p-6 bg-slate-900 text-white rounded-[2rem] shadow-lg active:scale-95 transition-transform">
                <MessageSquare className="w-6 h-6" />
                <span className="text-[10px] font-black uppercase tracking-widest">SMS</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {chatArtisan && (
        <div className="fixed inset-0 z-[800] bg-slate-900/40 backdrop-blur-sm flex items-end animate-in fade-in">
          <div className="w-full max-w-md h-[70vh] bg-white rounded-t-[3.5rem] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-emerald-50/30">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600"><ShieldCheck className="w-5 h-5" /></div>
                  <div>
                    <h4 className="font-black text-slate-800 text-sm">{chatArtisan.name}</h4>
                    <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Acompte Sécurisé</p>
                  </div>
               </div>
               <button onClick={() => setChatArtisan(null)} className="p-3 bg-white rounded-full text-slate-400"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'PASSENGER' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-[2rem] text-sm font-medium shadow-sm leading-relaxed ${msg.sender === 'PASSENGER' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-800'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtisansView;