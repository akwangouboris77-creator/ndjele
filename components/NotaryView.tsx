
import React, { useState } from 'react';
import { ArrowLeft, Search, MapPin, Star, ShieldCheck, Phone, MessageSquare, Gavel, X } from 'lucide-react';
import { ViewState, Notary } from '../types';

interface NotaryViewProps {
  onNavigate: (view: ViewState) => void;
}

const MOCK_NOTARIES: Notary[] = [
  { id: 'n1', name: 'Me. Angue Marie', office: 'Étude Angue', phone: '077 44 55 66', rating: 4.9, neighborhood: 'Sablière', experience: 15, avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?fit=crop&w=150&h=150', isVerified: true },
  { id: 'n2', name: 'Me. Obiang Jean', office: 'Étude Obiang', phone: '066 11 22 33', rating: 4.7, neighborhood: 'Louis', experience: 10, avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?fit=crop&w=150&h=150', isVerified: true },
  { id: 'n3', name: 'Me. Ndong Sophie', office: 'Étude Ndong', phone: '062 99 88 77', rating: 4.8, neighborhood: 'Akanda', experience: 8, avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?fit=crop&w=150&h=150', isVerified: true },
];

const NotaryView: React.FC<NotaryViewProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [contactingId, setContactingId] = useState<string | null>(null);

  const filteredNotaries = MOCK_NOTARIES.filter(n => 
    n.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    n.office.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.neighborhood.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContact = (notary: Notary, type: 'tel' | 'sms') => {
    window.location.href = `${type}:${notary.phone.replace(/\s/g, '')}`;
    setContactingId(null);
  };

  return (
    <div className="p-6 space-y-6 animate-in slide-in-from-right-4 duration-300 h-full flex flex-col bg-slate-50/30 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('home')} className="p-2 bg-white rounded-full shadow-sm">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h2 className="text-2xl font-black text-slate-800">Notaires</h2>
        </div>
        <span className="bg-slate-900 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase">Justice Maraude</span>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Chercher une étude ou un quartier..." 
          className="w-full pl-11 pr-4 py-4 bg-white border border-slate-100 rounded-2xl text-slate-800 font-bold text-sm outline-none shadow-sm focus:border-slate-900 transition-all"
        />
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-1">
        {filteredNotaries.map((notary) => (
          <div key={notary.id} className="bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4 group active:scale-[0.98] transition-all relative">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md border-2 border-white group-hover:border-slate-900 transition-colors">
                <img src={notary.avatar} className="w-full h-full object-cover" alt={notary.name} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-slate-900 text-sm">{notary.name}</h4>
                  {notary.isVerified && <ShieldCheck className="w-3 h-3 text-blue-500" />}
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{notary.office}</p>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-current" />
                    <span className="text-[10px] font-black text-slate-700">{notary.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    <MapPin className="w-3 h-3" />
                    <span className="text-[10px] font-bold">{notary.neighborhood}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 pt-2">
              <button className="flex-1 py-3 bg-slate-50 text-slate-600 rounded-xl font-black uppercase text-[9px] tracking-widest flex items-center justify-center gap-2">
                Prendre RDV <Gavel className="w-3 h-3" />
              </button>
              <button 
                onClick={() => setContactingId(contactingId === notary.id ? null : notary.id)}
                className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-black uppercase text-[9px] tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-slate-200"
              >
                Contacter <Phone className="w-3 h-3" />
              </button>
            </div>

            {contactingId === notary.id && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-[2.5rem] flex flex-col items-center justify-center p-6 space-y-4 animate-in fade-in zoom-in-95 z-10">
                <button onClick={() => setContactingId(null)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900">
                  <X className="w-5 h-5" />
                </button>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Contacter {notary.name}</p>
                <div className="grid grid-cols-2 gap-4 w-full">
                  <button 
                    onClick={() => handleContact(notary, 'tel')}
                    className="flex flex-col items-center justify-center p-4 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 active:scale-95 transition-all"
                  >
                    <Phone className="w-6 h-6 mb-2" />
                    <span className="text-[10px] font-black uppercase">Appeler</span>
                  </button>
                  <button 
                    onClick={() => handleContact(notary, 'sms')}
                    className="flex flex-col items-center justify-center p-4 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 active:scale-95 transition-all"
                  >
                    <MessageSquare className="w-6 h-6 mb-2" />
                    <span className="text-[10px] font-black uppercase">SMS</span>
                  </button>
                </div>
                <p className="text-[10px] font-bold text-slate-400">{notary.phone}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotaryView;
