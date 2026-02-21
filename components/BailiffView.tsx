
import React, { useState } from 'react';
import { ArrowLeft, Gavel, MapPin, Search, MessageSquare, X, Send, UserPlus, ShieldCheck, FileText } from 'lucide-react';
import { ViewState, ChatMessage } from '../types';

interface BailiffViewProps {
  onNavigate: (view: ViewState) => void;
}

const MOCK_BAILIFFS = [
  { id: 'b1', name: 'Me. Christian Obiang', office: 'Étude Obiang & Associés', rating: 4.7, neighborhood: 'Glass', experience: 20, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fit=crop&w=150&h=150' },
  { id: 'b2', name: 'Me. Alice Bignoumba', office: 'Étude Bignoumba', rating: 4.9, neighborhood: 'Owendo', experience: 12, avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?fit=crop&w=150&h=150' },
];

const BailiffView: React.FC<BailiffViewProps> = ({ onNavigate }) => {
  const [chatBailiff, setChatBailiff] = useState<any>(null);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const handleStartChat = (bailiff: any) => {
    setChatBailiff(bailiff);
    setMessages([
      { id: '1', sender: 'DRIVER', text: `Bonjour, Étude de ${bailiff.name}. Comment pouvons-nous vous aider pour vos actes ?`, timestamp: Date.now() }
    ]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const newMsg: ChatMessage = { id: Date.now().toString(), sender: 'PASSENGER', text: chatInput, timestamp: Date.now() };
    setMessages([...messages, newMsg]);
    setChatInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'DRIVER', text: "Un clerc va vous recontacter pour les modalités de signification.", timestamp: Date.now() }]);
    }, 1500);
  };

  return (
    <div className="p-6 space-y-8 animate-in slide-in-from-right-4 duration-500 pb-32">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('home')} className="p-2 bg-white rounded-full shadow-sm text-slate-600 border border-slate-100">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Huissiers NS</h2>
        </div>
        <button 
          onClick={() => onNavigate('bailiff-registration')}
          className="p-3 bg-slate-700 text-white rounded-2xl flex items-center gap-2 font-black text-[9px] uppercase shadow-lg"
        >
          <UserPlus className="w-4 h-4" /> Enrôler une Étude
        </button>
      </div>

      <section className="bg-slate-700 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <Gavel className="w-5 h-5 text-slate-300" />
            <h3 className="font-black text-xs uppercase tracking-widest">Actes & Significations</h3>
          </div>
          <p className="text-xs font-bold leading-relaxed text-slate-200">Signification d'actes, constats et exécutions de décisions.</p>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Rechercher une étude..." 
              className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:bg-white/20 transition-all"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
          </div>
        </div>
      </section>

      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Études disponibles</h3>
        <div className="space-y-4">
          {MOCK_BAILIFFS.map(bailiff => (
            <div key={bailiff.id} className="bg-white border border-slate-100 p-5 rounded-[2.5rem] shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <img src={bailiff.avatar} className="w-16 h-16 rounded-2xl object-cover shadow-sm" />
                <div className="flex-1">
                  <h4 className="font-black text-slate-900 text-sm">{bailiff.name}</h4>
                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-tight">{bailiff.office}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[8px] font-black bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full uppercase">{bailiff.neighborhood}</span>
                    <span className="text-[8px] font-black bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full uppercase">Certifié NS</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => handleStartChat(bailiff)}
                className="w-full py-3 bg-slate-700 text-white rounded-xl font-black text-[10px] uppercase shadow-lg flex items-center justify-center gap-2"
              >
                <FileText className="w-3.5 h-3.5" /> Demander un acte
              </button>
            </div>
          ))}
        </div>
      </div>

      {chatBailiff && (
        <div className="fixed inset-0 z-[600] bg-slate-900/40 backdrop-blur-sm flex items-end justify-center p-0 animate-in fade-in">
          <div className="w-full max-w-md h-[85vh] bg-white rounded-t-[3.5rem] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
               <div className="flex items-center gap-4">
                  <img src={chatBailiff.avatar} className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-700/10" />
                  <div>
                    <h4 className="font-black text-slate-900 text-sm">{chatBailiff.name}</h4>
                    <p className="text-[9px] font-black text-slate-500 uppercase">{chatBailiff.office}</p>
                  </div>
               </div>
               <button onClick={() => setChatBailiff(null)} className="p-3 bg-white rounded-full text-slate-400 shadow-sm"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/20">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'PASSENGER' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-[2rem] text-sm font-medium shadow-sm leading-relaxed ${msg.sender === 'PASSENGER' ? 'bg-slate-700 text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="p-6 bg-white border-t border-slate-100">
               <div className="relative">
                  <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Message..." className="w-full pl-6 pr-14 py-5 bg-slate-100 border border-slate-200 rounded-[2.5rem] text-sm font-bold text-slate-900 outline-none focus:border-slate-700 transition-all shadow-inner" />
                  <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-slate-700 text-white rounded-full flex items-center justify-center shadow-lg"><Send className="w-5 h-5" /></button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BailiffView;
