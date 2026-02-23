
import React, { useState } from 'react';
import { 
  Users, Car, Hammer, ShoppingBag, Truck, ShieldCheck, 
  BarChart3, Search, Filter, MoreVertical, CheckCircle2, 
  XCircle, AlertTriangle, ArrowUpRight, ArrowDownRight,
  Settings, Bell, LogOut, LayoutDashboard, Database,
  Stethoscope, Pill, Scale, Gavel
} from 'lucide-react';
import { ViewState, UserProfile, MarketplaceOrder, ActiveRide, Artisan } from '../types';

interface AdminDashboardProps {
  onNavigate: (view: ViewState) => void;
  users: UserProfile[];
  orders: MarketplaceOrder[];
  rides: ActiveRide[];
  artisans: Artisan[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  onNavigate, users, orders, rides, artisans 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'services' | 'security'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    { label: 'Utilisateurs', value: users.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+12%' },
    { label: 'Courses Actives', value: rides.length, icon: Car, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+5%' },
    { label: 'Commandes', value: orders.length, icon: ShoppingBag, color: 'text-violet-600', bg: 'bg-violet-50', trend: '+18%' },
    { label: 'Artisans', value: artisans.length, icon: Hammer, color: 'text-amber-600', bg: 'bg-amber-50', trend: '+3%' },
  ];

  const renderOverview = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm space-y-3">
            <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <div className="flex items-end justify-between">
                <h4 className="text-2xl font-black text-slate-900">{stat.value}</h4>
                <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" /> {stat.trend}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Activités Récentes</h3>
            <button className="text-[10px] font-black text-blue-600 uppercase">Voir tout</button>
          </div>
          <div className="space-y-4">
            {orders.slice(0, 4).map((order, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{order.productName}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">{order.clientName} • {order.merchantName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900">{order.totalPrice} F</p>
                  <span className="text-[8px] font-black text-emerald-500 uppercase">{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white space-y-6 shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Santé du Système</h3>
            <div className="mt-6 grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-500 uppercase">Uptime</p>
                <p className="text-2xl font-black text-emerald-400">99.9%</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-500 uppercase">Latence</p>
                <p className="text-2xl font-black text-blue-400">42ms</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-500 uppercase">Erreurs (24h)</p>
                <p className="text-2xl font-black text-pink-400">0</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-500 uppercase">Sécurité</p>
                <p className="text-2xl font-black text-emerald-400">Optimale</p>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Rechercher un utilisateur..." 
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-blue-500 transition-all"
            />
          </div>
          <button className="p-3 bg-slate-900 text-white rounded-2xl">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Utilisateur</th>
                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Rôle</th>
                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut</th>
                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((user, i) => (
                <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 overflow-hidden">
                        {user.photo ? <img src={user.photo} alt="" className="w-full h-full object-cover" /> : <Users className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{user.name}</p>
                        <p className="text-[9px] font-bold text-slate-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="text-[10px] font-black text-slate-600 bg-slate-100 px-2 py-1 rounded-lg uppercase">
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-1.5 text-emerald-600">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                      <span className="text-[10px] font-black uppercase">Actif</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24">
      {/* Admin Header */}
      <header className="bg-white border-b border-slate-100 p-6 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tighter uppercase">Ndjele Control</h1>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Mission Control Center</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-900 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full border-2 border-white"></span>
            </button>
            <button onClick={() => onNavigate('home')} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">
              <LogOut className="w-4 h-4" /> Quitter
            </button>
          </div>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto space-y-8">
        {/* Navigation Tabs */}
        <div className="flex gap-2 p-1 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto hide-scrollbar">
          {[
            { id: 'overview', label: 'Vue d\'ensemble', icon: LayoutDashboard },
            { id: 'users', label: 'Utilisateurs', icon: Users },
            { id: 'services', label: 'Services', icon: Database },
            { id: 'security', label: 'Sécurité', icon: ShieldCheck },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shrink-0 ${
                activeTab === tab.id 
                  ? 'bg-slate-900 text-white shadow-lg' 
                  : 'text-slate-400 hover:bg-slate-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'services' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Car className="w-5 h-5" /></div>
                <h3 className="font-black text-xs uppercase tracking-widest text-slate-800">Transport</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-slate-400">Courses en cours</span>
                  <span className="text-slate-900">{rides.length}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-slate-400">Chauffeurs actifs</span>
                  <span className="text-slate-900">12</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-violet-50 text-violet-600 rounded-xl"><ShoppingBag className="w-5 h-5" /></div>
                <h3 className="font-black text-xs uppercase tracking-widest text-slate-800">Marketplace</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-slate-400">Commandes du jour</span>
                  <span className="text-slate-900">{orders.length}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-slate-400">Boutiques actives</span>
                  <span className="text-slate-900">8</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><Stethoscope className="w-5 h-5" /></div>
                <h3 className="font-black text-xs uppercase tracking-widest text-slate-800">Santé</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-slate-400">Consultations</span>
                  <span className="text-slate-900">4</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-slate-400">Pharmacies de garde</span>
                  <span className="text-slate-900">2</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-900 text-white rounded-xl"><Scale className="w-5 h-5" /></div>
                <h3 className="font-black text-xs uppercase tracking-widest text-slate-800">Justice</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-slate-400">Dossiers juridiques</span>
                  <span className="text-slate-900">6</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-slate-400">Huissiers en mission</span>
                  <span className="text-slate-900">3</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
