
import React, { useState, useRef } from 'react';
import { Wallet, Pill, Star, Clock, ShieldCheck, ChevronRight, History, Bell, Package, CheckCircle2, TrendingUp, Plus, X, Camera, Loader2, Trash2, Tag } from 'lucide-react';
import { ViewState, Pharmacy, Medication } from '../types';

interface PharmacyDashboardProps {
  onNavigate: (view: ViewState) => void;
  pharmacy: Pharmacy;
  onUpdatePharmacy: (pharmacy: Pharmacy) => void;
}

const PharmacyDashboard: React.FC<PharmacyDashboardProps> = ({ onNavigate, pharmacy, onUpdatePharmacy }) => {
  const [balance] = useState(85000);
  const [isAddingMed, setIsAddingMed] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newMed, setNewMed] = useState({ name: '', price: '', category: 'Douleur', needsPrescription: false });

  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMed.name || !newMed.price) return;

    const medication: Medication = {
      id: 'm-' + Math.random().toString(36).substr(2, 5),
      name: newMed.name,
      price: parseInt(newMed.price),
      needsPrescription: newMed.needsPrescription,
      category: newMed.category
    };

    const updatedPharmacy = {
      ...pharmacy,
      medications: [...(pharmacy.medications || []), medication]
    };

    onUpdatePharmacy(updatedPharmacy);
    setIsAddingMed(false);
    setNewMed({ name: '', price: '', category: 'Douleur', needsPrescription: false });
  };

  const removeMedication = (id: string) => {
    const updatedPharmacy = {
      ...pharmacy,
      medications: pharmacy.medications.filter(m => m.id !== id)
    };
    onUpdatePharmacy(updatedPharmacy);
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500 pb-24 h-full overflow-y-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-800 tracking-tighter">Espace Officine</h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsAddingMed(true)}
            className="w-10 h-10 bg-pink-600 text-white rounded-xl flex items-center justify-center shadow-lg active:scale-95 transition-transform"
          >
            <Plus className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1.5 text-pink-600 bg-pink-50 px-3 py-1.5 rounded-full border border-pink-100">
             <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
             <span className="text-[10px] font-black uppercase">Ouvert</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden text-center">
        <div className="relative z-10 flex flex-col items-center">
          <Wallet className="w-10 h-10 text-pink-400 mb-2" />
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Chiffre d'Affaires Santé</p>
          <div className="flex items-end gap-2 mt-2">
            <span className="text-4xl font-black text-pink-400">{balance.toLocaleString()}</span>
            <span className="text-xl font-medium text-slate-500 mb-1.5">F</span>
          </div>
          <button onClick={() => onNavigate('wallet')} className="w-full mt-6 py-4 bg-pink-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest active:scale-95 shadow-xl shadow-pink-500/20">
            Gérer mon portefeuille
          </button>
        </div>
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm text-center space-y-1">
          <Package className="w-6 h-6 text-pink-500 mx-auto mb-1" />
          <p className="text-xl font-black text-slate-800">{pharmacy.medications?.length || 0}</p>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Médicaments en Stock</p>
        </div>
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm text-center space-y-1">
          <Star className="w-6 h-6 text-pink-500 mx-auto mb-1" />
          <p className="text-xl font-black text-slate-800">4.9</p>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Note Clientèle</p>
        </div>
      </div>

      <section className="space-y-4">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2 px-2">
          <Pill className="w-4 h-4 text-pink-600" />
          Inventaire Médicaments
        </h3>
        <div className="space-y-3">
          {pharmacy.medications?.map(med => (
            <div key={med.id} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center">
                  <Pill className="w-5 h-5 text-pink-400" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{med.name}</h4>
                  <p className="text-[9px] text-slate-400 font-bold uppercase">
                    {med.category} {med.needsPrescription && '• ORDONNANCE REQUISE'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-black text-slate-900 text-sm">{med.price} F</span>
                <button onClick={() => removeMedication(med.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {(!pharmacy.medications || pharmacy.medications.length === 0) && (
            <div className="text-center py-8 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              <p className="text-xs font-bold text-slate-400">Aucun médicament dans votre inventaire</p>
              <button onClick={() => setIsAddingMed(true)} className="mt-2 text-pink-600 font-black text-[10px] uppercase tracking-widest">Ajouter maintenant</button>
            </div>
          )}
        </div>
      </section>

      {/* Modal Ajout Médicament */}
      {isAddingMed && (
        <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-end animate-in fade-in duration-300">
           <form onSubmit={handleAddMedication} className="w-full bg-white rounded-t-[3rem] p-8 space-y-6 animate-in slide-in-from-bottom-10 max-h-[95vh] overflow-y-auto">
              <div className="flex justify-between items-center">
                 <h3 className="text-xl font-black text-slate-800">Nouveau Médicament</h3>
                 <button type="button" onClick={() => setIsAddingMed(false)} className="p-2 bg-slate-100 rounded-full"><X className="w-5 h-5" /></button>
              </div>

              <div className="space-y-4">
                 <div className="group space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Nom du médicament</label>
                    <input 
                      type="text" 
                      autoFocus
                      required
                      value={newMed.name}
                      onChange={e => setNewMed({...newMed, name: e.target.value})}
                      placeholder="Ex: Paracétamol 500mg" 
                      className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-slate-900 outline-none border-2 border-transparent focus:border-pink-500 transition-all shadow-inner"
                    />
                 </div>
                 <div className="group space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Prix (FCFA)</label>
                    <div className="relative">
                       <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                       <input 
                         type="number" 
                         required
                         value={newMed.price}
                         onChange={e => setNewMed({...newMed, price: e.target.value})}
                         placeholder="Ex: 1200" 
                         className="w-full pl-11 pr-4 py-4 bg-slate-50 rounded-2xl font-black text-slate-900 text-lg outline-none border-2 border-transparent focus:border-pink-500 transition-all shadow-inner"
                       />
                    </div>
                 </div>
                 <div className="group space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Catégorie</label>
                    <select 
                      value={newMed.category}
                      onChange={e => setNewMed({...newMed, category: e.target.value})}
                      className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-slate-900 outline-none border-2 border-transparent focus:border-pink-500 transition-all shadow-inner"
                    >
                      <option value="Douleur">Douleur & Fièvre</option>
                      <option value="Antibiotique">Antibiotique</option>
                      <option value="Digestion">Digestion</option>
                      <option value="Vitamines">Vitamines</option>
                      <option value="Hygiène">Hygiène</option>
                    </select>
                 </div>
                 <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={newMed.needsPrescription}
                      onChange={e => setNewMed({...newMed, needsPrescription: e.target.checked})}
                      className="w-5 h-5 rounded-lg border-2 border-slate-200 text-pink-600 focus:ring-pink-500"
                    />
                    <span className="text-xs font-bold text-slate-700">Ordonnance obligatoire</span>
                 </label>
              </div>

              <button 
                type="submit"
                disabled={!newMed.name || !newMed.price}
                className="w-full py-5 bg-pink-600 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 disabled:opacity-50 transition-all"
              >
                Ajouter au stock
              </button>
           </form>
        </div>
      )}

      <section className="space-y-4">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2 px-2">
          <Clock className="w-4 h-4 text-pink-600" />
          Commandes en attente
        </h3>
        <div className="space-y-3">
          {[
            { id: 1, client: 'Mr. Bignoumba', items: 'Amoxicilline + Vitamine C', status: 'Vérification Ordonnance', time: 'Il y a 5 min' },
            { id: 2, client: 'Mme Obiang', items: 'Paracétamol 1g', status: 'En attente livreur', time: 'Il y a 15 min' },
          ].map(order => (
            <div key={order.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                 <div>
                    <h4 className="font-bold text-slate-800 text-sm">{order.client}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{order.items}</p>
                 </div>
                 <span className="text-[8px] font-black bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full uppercase border border-amber-100">{order.time}</span>
              </div>
              <button className="w-full py-2.5 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase shadow-lg active:scale-95 transition-all">
                Traiter la commande
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-pink-50 p-6 rounded-[2.5rem] border border-pink-100 flex items-start gap-3">
         <ShieldCheck className="w-5 h-5 text-pink-600 shrink-0" />
         <p className="text-[10px] text-pink-800 font-bold leading-relaxed">
           Votre officine <b>{pharmacy.name}</b> est certifiée Ndjele Care. Toutes les ventes de médicaments sont tracées pour la sécurité des patients.
         </p>
      </div>
    </div>
  );
};

export default PharmacyDashboard;
