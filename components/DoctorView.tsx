
import React, { useState, useEffect, useRef } from 'react';
import { Search, ArrowLeft, Star, ShieldCheck, MessageSquare, Sparkles, Loader2, MapPin, X, Send, Activity, HeartPulse, Baby, User, Eye, Pill, Droplet, Microscope, UserPlus } from 'lucide-react';
import { ViewState, Doctor, ChatMessage } from '../types';
import { getMedicalOrientation, getDriverChatResponse } from '../services/geminiService';

interface DoctorViewProps {
  onNavigate: (view: ViewState) => void;
}

const MOCK_DOCTORS: Doctor[] = [
  { id: 'd1', name: 'Dr. Marc Obiang', specialty: 'Médecin Généraliste', category: 'generaliste', rating: 4.9, distance: 0.8, isVerified: true, avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?fit=crop&w=150&h=150', neighborhood: 'Louis', experience: 12, availability: 'disponible' },
  { id: 'd2', name: 'Dr. Sarah Bignoumba', specialty: 'Pédiatre Expert', category: 'pediatre', rating: 4.8, distance: 2.1, isVerified: true, avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?fit=crop&w=150&h=150', neighborhood: 'Nzeng-Ayong', experience: 8, availability: 'occupe' },
];

const CATEGORIES = [
  { id: 'generaliste', label: 'Généraliste', icon: User, color: 'bg-emerald-50 text-emerald-600' },
  { id: 'pediatre', label: 'Pédiatre', icon: Baby, color: 'bg-blue-50 text-blue-600' },
  { id: 'gynecologue', label: 'Gynécologue', icon: HeartPulse, color: 'bg-pink-50 text-pink-600' },
];

const DoctorView: React.FC<DoctorViewProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOrienting, setIsOrienting] = useState(false);
  const [orientation, setOrientation] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const [chatDoctor, setChatDoctor] = useState<Doctor | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, chatDoctor]);

  const handleOrientation = async () => {
    if (!searchQuery.trim()) return;
    setIsOrienting(true);
    setOrientation(null);
    try {
      const result = await getMedicalOrientation(searchQuery);
      setOrientation(result);
      setSelectedCategory(result.specialty);
    } catch (e) {
      console.error(e);
    } finally {
      setIsOrienting(false);
    }
  };

  const handleStartChat = (doctor: Doctor) => {
    setChatDoctor(doctor);
    setMessages([
      { id: '1', sender: 'DRIVER', text: `Bonjour, ici le cabinet du ${doctor.name}. Comment puis-je vous aider ?`, timestamp: Date.now() }
    ]);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !chatDoctor) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), sender: 'PASSENGER', text: chatInput, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = chatInput;
    setChatInput('');
    setIsTyping(true);

    try {
      const response = await getDriverChatResponse(chatDoctor.name, `Tu es un médecin spécialiste en ${chatDoctor.specialty}. Le patient dit : ${currentInput}`);
      const docMsg: ChatMessage = { id: (Date.now() + 1).toString(), sender: 'DRIVER', text: response || "D'accord, je vous suggère un examen.", timestamp: Date.now() };
      setMessages(prev => [...prev, docMsg]);
    } catch (error) { console.error(error); } finally { setIsTyping(false); }
  };

  const filteredDoctors = MOCK_DOCTORS.filter(d => 
    (!selectedCategory || d.category === selectedCategory) &&
    (d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.specialty.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-8 animate-in slide-in-from-right-4 duration-500 pb-32">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('home')} className="p-2 bg-white rounded-full shadow-sm text-slate-600 border border-slate-100">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Santé NS</h2>
        </div>
        <button 
          onClick={() => onNavigate('doctor-registration')}
          className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center gap-2 font-black text-[9px] uppercase border border-emerald-100"
        >
          <UserPlus className="w-4 h-4" /> Enrôler un Médecin
        </button>
      </div>

      <section className="bg-emerald-600 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-200" />
            <h3 className="font-black text-xs uppercase tracking-widest">Diagnostic IA</h3>
          </div>
          <p className="text-xs font-bold leading-relaxed text-emerald-50">Saisissez vos symptômes pour une orientation immédiate.</p>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ex: J'ai mal à la gorge..."
              className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-4 py-4 text-sm font-bold text-white placeholder:text-emerald-100 outline-none focus:bg-white/20 transition-all shadow-inner"
            />
            <button 
              onClick={handleOrientation}
              disabled={isOrienting}
              className="bg-white p-4 rounded-2xl shadow-lg active:scale-95 transition-transform disabled:opacity-50"
            >
              {isOrienting ? <Loader2 className="w-6 h-6 animate-spin text-emerald-600" /> : <Search className="w-6 h-6 text-emerald-600" />}
            </button>
          </div>
        </div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      </section>

      {orientation && (
        <div className="bg-white border-2 border-emerald-500/30 p-6 rounded-[2.5rem] animate-in zoom-in-95 space-y-4 shadow-sm">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2 text-emerald-600">
              <Activity className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Orientation Médicale</span>
            </div>
            <button onClick={() => setOrientation(null)} className="p-1 bg-slate-100 rounded-full text-slate-400">
               <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm font-bold text-slate-800 italic leading-relaxed">"{orientation.message}"</p>
        </div>
      )}

      <section className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Spécialités</h3>
        <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
              className={`flex flex-col items-center gap-2 shrink-0 p-4 rounded-[2rem] transition-all border-2 ${
                selectedCategory === cat.id ? 'border-emerald-600 bg-emerald-50 scale-105' : 'border-slate-100 bg-white'
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${cat.color} shadow-sm border border-black/5`}>
                <cat.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4 pb-12">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Docteurs certifiés</h3>
        </div>
        <div className="space-y-4">
          {filteredDoctors.map((doc) => (
            <div key={doc.id} className="bg-white border border-slate-100 p-5 rounded-[2.5rem] shadow-sm flex flex-col gap-4 group hover:border-emerald-500/20 transition-all">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img src={doc.avatar} className="w-16 h-16 rounded-2xl object-cover shadow-sm border border-slate-50" alt={doc.name} />
                  <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${doc.availability === 'disponible' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <h4 className="font-black text-slate-900 text-sm truncate">{doc.name}</h4>
                  <p className="text-[9px] text-emerald-600 font-black uppercase mt-0.5 tracking-tight">{doc.specialty}</p>
                  <p className="text-[8px] font-black bg-slate-50 text-slate-500 px-2 py-0.5 rounded-full uppercase inline-block mt-2">{doc.neighborhood}</p>
                </div>
              </div>
              <button 
                onClick={() => handleStartChat(doc)}
                className="w-full py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-3.5 h-3.5" /> Prendre RDV
              </button>
            </div>
          ))}
        </div>
      </section>

      {chatDoctor && (
        <div className="fixed inset-0 z-[600] bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 animate-in fade-in duration-300">
          <div className="w-full max-w-md h-[85vh] bg-white rounded-t-[3.5rem] flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 shadow-2xl border-t border-emerald-500/10">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
               <div className="flex items-center gap-4">
                  <img src={chatDoctor.avatar} className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-500/20 shadow-sm" />
                  <div>
                    <h4 className="font-black text-slate-900 text-sm">{chatDoctor.name}</h4>
                    <p className="text-[9px] font-black text-emerald-600 uppercase">{chatDoctor.specialty}</p>
                  </div>
               </div>
               <button onClick={() => setChatDoctor(null)} className="p-3 bg-white rounded-full text-slate-400 active:scale-90 shadow-sm"><X className="w-5 h-5" /></button>
            </div>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/20 hide-scrollbar">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'PASSENGER' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-[2rem] text-sm font-medium shadow-sm leading-relaxed ${msg.sender === 'PASSENGER' ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="p-6 bg-white border-t border-slate-100">
               <div className="relative">
                  <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Message..." className="w-full pl-6 pr-14 py-5 bg-slate-100 border border-slate-200 rounded-[2.5rem] text-sm font-bold text-slate-900 outline-none focus:border-emerald-500 transition-all shadow-inner" />
                  <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"><Send className="w-5 h-5" /></button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorView;
