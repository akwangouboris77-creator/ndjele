
import React, { useState, useRef } from 'react';
import { Package, Plus, Trash2, Camera, Tag, ArrowLeft, TrendingUp, Wallet, ShoppingBag, CheckCircle2, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { ViewState, Merchant, Product } from '../types';

interface MerchantDashboardProps {
  onNavigate: (view: ViewState) => void;
  registeredMerchant: Merchant | null;
  onUpdateMerchant: (merchant: Merchant) => void;
}

const PRODUCT_ICONS = ['🍞', '🥛', '🍎', '👕', '📱', '👟', '🧴', '💄', '📦', '🎁'];

const MerchantDashboard: React.FC<MerchantDashboardProps> = ({ onNavigate, registeredMerchant, onUpdateMerchant }) => {
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', image: '📦', isCustomImage: false });

  if (!registeredMerchant) {
    onNavigate('merchant-registration');
    return null;
  }

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;

    const product: Product = {
      id: 'p-' + Math.random().toString(36).substr(2, 5),
      name: newProduct.name,
      price: parseInt(newProduct.price),
      image: newProduct.image,
      category: registeredMerchant.category,
      merchantId: registeredMerchant.id
    };

    const updatedMerchant = {
      ...registeredMerchant,
      products: [...registeredMerchant.products, product]
    };

    onUpdateMerchant(updatedMerchant);
    setIsAddingProduct(false);
    setNewProduct({ name: '', price: '', image: '📦', isCustomImage: false });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result as string, isCustomImage: true });
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProduct = (id: string) => {
    const updatedMerchant = {
      ...registeredMerchant,
      products: registeredMerchant.products.filter(p => p.id !== id)
    };
    onUpdateMerchant(updatedMerchant);
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500 pb-24 h-full overflow-y-auto">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('marketplace')} className="p-2 bg-white rounded-full shadow-sm hover:bg-slate-50 transition-colors border border-slate-100">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h2 className="text-2xl font-black text-slate-800">Ma Vitrine</h2>
        </div>
        <button 
          onClick={() => setIsAddingProduct(true)}
          className="w-12 h-12 bg-violet-600 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-transform"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <div className="bg-slate-900 p-6 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden flex items-center justify-between">
        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-violet-400" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Commerçant Certifié</p>
          </div>
          <h3 className="text-lg font-bold">{registeredMerchant.shopName}</h3>
          <p className="text-xs opacity-70">{registeredMerchant.neighborhood}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl text-center border border-white/30">
          <p className="text-[8px] font-black uppercase mb-1">Articles</p>
          <p className="text-lg font-black tracking-tighter">{registeredMerchant.products.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-1">
          <TrendingUp className="w-5 h-5 text-emerald-500 mb-2" />
          <p className="text-2xl font-black text-slate-800">45 000 F</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ventes du jour</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-1">
          <ShoppingBag className="w-5 h-5 text-violet-500 mb-2" />
          <p className="text-2xl font-black text-slate-800">14</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Commandes</p>
        </div>
      </div>

      <section className="space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Inventaire des articles</h3>
        <div className="grid grid-cols-2 gap-4">
          {registeredMerchant.products.map(p => (
            <div key={p.id} className="bg-white border-2 border-slate-50 p-4 rounded-3xl shadow-sm space-y-3 relative group">
               <button 
                 onClick={() => removeProduct(p.id)}
                 className="absolute top-2 right-2 p-1.5 bg-red-50 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
               >
                 <Trash2 className="w-3.5 h-3.5" />
               </button>
               <div className="w-full aspect-square bg-slate-50 rounded-2xl flex items-center justify-center text-3xl mx-auto shadow-inner overflow-hidden">
                  {p.image.length > 4 ? (
                    <img src={p.image} className="w-full h-full object-cover" alt={p.name} />
                  ) : (
                    <span>{p.image}</span>
                  )}
               </div>
               <div className="text-center">
                  <h4 className="font-bold text-slate-800 text-xs truncate px-1">{p.name}</h4>
                  <p className="text-sm font-black text-violet-600 mt-1">{p.price} F</p>
               </div>
            </div>
          ))}
          {registeredMerchant.products.length === 0 && !isAddingProduct && (
            <button 
              onClick={() => setIsAddingProduct(true)}
              className="col-span-2 p-12 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center gap-3 text-slate-400 hover:bg-slate-50 transition-colors"
            >
              <Package className="w-8 h-8 opacity-30" />
              <p className="text-xs font-bold">Ajoutez votre premier article</p>
            </button>
          )}
        </div>
      </section>

      {/* Modal Ajout Produit */}
      {isAddingProduct && (
        <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-end animate-in fade-in duration-300">
           <form onSubmit={handleAddProduct} className="w-full bg-white rounded-t-[3rem] p-8 space-y-6 animate-in slide-in-from-bottom-10 max-h-[95vh] overflow-y-auto">
              <div className="flex justify-between items-center">
                 <h3 className="text-xl font-black text-slate-800">Nouvel Article</h3>
                 <button type="button" onClick={() => setIsAddingProduct(false)} className="p-2 bg-slate-100 rounded-full"><X className="w-5 h-5" /></button>
              </div>

              <div className="space-y-6">
                 <div className="flex flex-col items-center gap-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Image de l'article</p>
                    
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="relative w-32 h-32 bg-slate-50 rounded-[2.5rem] flex items-center justify-center border-4 border-dashed border-slate-200 overflow-hidden group cursor-pointer hover:border-violet-400 transition-colors"
                    >
                       {isUploading ? (
                         <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
                       ) : newProduct.isCustomImage ? (
                         <img src={newProduct.image} className="w-full h-full object-cover" alt="Preview" />
                       ) : (
                         <div className="flex flex-col items-center gap-1 text-slate-400">
                            <span className="text-4xl">{newProduct.image}</span>
                            <Camera className="w-5 h-5" />
                         </div>
                       )}
                       <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Plus className="w-6 h-6 text-white" />
                       </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-2">
                       {PRODUCT_ICONS.map(icon => (
                         <button 
                           key={icon}
                           type="button"
                           onClick={() => setNewProduct({...newProduct, image: icon, isCustomImage: false})}
                           className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${!newProduct.isCustomImage && newProduct.image === icon ? 'bg-violet-600 text-white scale-110 shadow-lg' : 'bg-slate-50 border border-slate-100'}`}
                         >
                           {icon}
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div className="group space-y-1">
                       <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Nom de l'article</label>
                       <input 
                         type="text" 
                         autoFocus
                         required
                         value={newProduct.name}
                         onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                         placeholder="Ex: Sac de Riz 5kg" 
                         className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-violet-500 transition-all shadow-inner"
                       />
                    </div>
                    <div className="group space-y-1">
                       <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Prix de vente (FCFA)</label>
                       <div className="relative">
                          <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                          <input 
                            type="number" 
                            required
                            value={newProduct.price}
                            onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                            placeholder="Ex: 4500" 
                            className="w-full pl-11 pr-4 py-4 bg-slate-50 rounded-2xl font-black text-lg outline-none border-2 border-transparent focus:border-violet-500 transition-all shadow-inner"
                          />
                       </div>
                    </div>
                 </div>
              </div>

              <button 
                type="submit"
                disabled={!newProduct.name || !newProduct.price || isUploading}
                className="w-full py-5 bg-violet-600 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all"
              >
                {isUploading ? 'Chargement photo...' : 'Ajouter à l\'inventaire'}
              </button>
           </form>
        </div>
      )}
    </div>
  );
};

export default MerchantDashboard;
