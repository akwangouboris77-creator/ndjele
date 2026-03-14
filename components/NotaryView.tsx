
import React, { useState } from 'react';
import { ArrowLeft, Search, MapPin, Star, ShieldCheck, Phone, MessageSquare, Gavel } from 'lucide-react';
import { ViewState, Notary } from '../types';

interface NotaryViewProps {
  onNavigate: (view: ViewState) => void;
}

const MOCK_NOTARIES: Notary[] = [
  { id: 'n1', name: 'Me. Angue Marie', office: 'Étude Angue', rating: 4.9, neighborhood: 'Sablière', experience: 15, avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?fit=crop&w=150&h=150', isVerified: true },
  { id: 'n2', name: 'Me. Obiang Jean', office: 'Étude Obiang', rating: 4.7, neighborhood: 'Louis', experience: 10, avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?fit=crop&w=150&h=150', isVerified: true },
  { id: 'n3', name: 'Me. Ndong Sophie', office: 'Étude Ndong', rating: 4.8, neighborhood: 'Akanda', experience: 8, avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?fit=crop&w=150&h=150', isVerified: true },
];

const NotaryView: React.FC<NotaryViewProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotaries = MOCK_NOTARIES.filter(n => 
    n.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    n.office.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.neighborhood.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 animate-in slide-in-from-right-4 duration-300 h-full flex flex-col bg-slate-50/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('home')} className="p-2 bg-white rounded-full shadow-sm">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h2 className="text-2xl font-black text-slate-800">Notaires</h2>
        </div>
        <span className="bg-slate-900 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase">Justice NS</span>
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
          <div key={notary.id} className="bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4 group active:scale-[0.98] transition-all">
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
              <button className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-black uppercase text-[9px] tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-slate-200">
                Prendre RDV <Gavel className="w-3 h-3" />
              </button>
              <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-slate-900 transition-colors">
                <Phone className="w-4 h-4" />
              </button>
              <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-slate-900 transition-colors">
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotaryView;
