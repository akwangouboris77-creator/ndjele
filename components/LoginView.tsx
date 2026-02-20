
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Loader2, Sparkles, Phone, ArrowRight, Smartphone, MessageSquare, ArrowLeft, CheckCircle2, User, Car, Hammer, Store, Truck, Info } from 'lucide-react';
import { UserProfile, UserRole } from '../types';

interface LoginViewProps {
  onLogin: (user: UserProfile) => void;
  onOpenOnePager: () => void;
}

type LoginStep = 'phone' | 'role' | 'otp' | 'loading';

const LoginView: React.FC<LoginViewProps> = ({ onLogin, onOpenOnePager }) => {
  const [step, setStep] = useState<LoginStep>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('CLIENT');
  const [otpCode, setOtpCode] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    let interval: any;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const detectOperator = (num: string) => {
    if (num.startsWith('074') || num.startsWith('077')) return { name: 'Airtel', color: 'text-red-500' };
    if (num.startsWith('066') || num.startsWith('062')) return { name: 'Moov', color: 'text-blue-500' };
    return null;
  };

  const handleGoToRole = () => {
    if (phoneNumber.length < 8) return;
    setStep('role');
  };

  const handleSendOtp = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('otp');
      setTimer(60);
    }, 1500);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);

    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = () => {
    if (otpCode.some(val => val === '')) return;
    setIsProcessing(true);
    setStep('loading');

    setTimeout(() => {
      const mockUser: UserProfile = {
        id: selectedRole.toLowerCase() + '-user-' + Math.random().toString(36).substr(2, 5),
        name: selectedRole === 'CLIENT' ? 'Client ' + phoneNumber.slice(-4) : 'Prestataire ' + phoneNumber.slice(-4),
        email: phoneNumber + '@ndjele.ga',
        phone: phoneNumber,
        photo: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?fit=crop&w=150&h=150',
        role: selectedRole
      };
      onLogin(mockUser);
    }, 2000);
  };

  const operator = detectOperator(phoneNumber);

  const roles = [
    { id: 'CLIENT', label: 'Usager / Client', icon: User, color: 'bg-blue-500' },
    { id: 'DRIVER', label: 'Chauffeur', icon: Car, color: 'bg-amber-500' },
    { id: 'ARTISAN', label: 'Artisan', icon: Hammer, color: 'bg-indigo-500' },
    { id: 'MERCHANT', label: 'Commerçant', icon: Store, color: 'bg-violet-500' },
    { id: 'DELIVERY', label: 'Livreur', icon: Truck, color: 'bg-pink-500' },
  ];

  return (
    <div className="h-full relative overflow-hidden flex flex-col items-center justify-between p-8 bg-slate-900">
      <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-indigo-600/30 to-transparent"></div>
      
      <div className="relative z-10 text-center space-y-4 pt-8">
        <div className="w-16 h-16 gradient-brand rounded-[1.8rem] flex items-center justify-center text-white mx-auto shadow-2xl border border-white/20">
          <span className="text-2xl font-black">NS</span>
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-white tracking-tighter">Ndjele</h1>
          <p className="text-slate-400 font-bold text-[8px] uppercase tracking-[0.3em]">Connexion Sécurisée</p>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-sm space-y-8 pb-4">
        {step === 'phone' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-10">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[2.5rem] space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <p className="text-white font-black text-[10px] uppercase tracking-widest">Numéro Gabonais</p>
                {operator && <span className={`text-[8px] font-black uppercase px-2 py-1 bg-white/10 rounded-lg ${operator.color}`}>{operator.name}</span>}
              </div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-white/10 pr-3">
                  <span className="text-white font-bold text-sm">+241</span>
                </div>
                <input 
                  type="tel" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="074 00 00 00"
                  className="w-full pl-24 pr-4 py-5 bg-white/10 border border-white/10 rounded-2xl text-white font-black text-lg outline-none"
                />
              </div>
            </div>

            <div className="space-y-3">
               <button onClick={handleGoToRole} disabled={phoneNumber.length < 8} className="w-full bg-white text-slate-900 py-5 rounded-[2.2rem] font-black flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50">
                 Continuer <ArrowRight className="w-5 h-5" />
               </button>
               <button 
                 onClick={onOpenOnePager}
                 className="w-full bg-white/5 border border-white/10 text-white py-4 rounded-[2rem] font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
               >
                 <Info className="w-4 h-4 text-emerald-400" /> Découvrir Ndjele
               </button>
            </div>
          </div>
        )}

        {step === 'role' && (
          <div className="space-y-6 animate-in slide-in-from-right-10">
            <h3 className="text-center text-white font-black text-sm uppercase tracking-widest">Je me connecte en tant que :</h3>
            <div className="grid grid-cols-2 gap-3">
              {roles.map(r => (
                <button 
                  key={r.id} 
                  onClick={() => setSelectedRole(r.id as UserRole)}
                  className={`p-4 rounded-3xl border-2 flex flex-col items-center gap-2 transition-all ${selectedRole === r.id ? 'border-white bg-white/10' : 'border-white/5 bg-white/5 opacity-50'}`}
                >
                  <div className={`w-10 h-10 ${r.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                    <r.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-black text-white uppercase">{r.label}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStep('phone')} className="p-5 bg-white/5 text-white rounded-3xl"><ArrowLeft className="w-5 h-5" /></button>
              <button onClick={handleSendOtp} className="flex-1 bg-white text-slate-900 py-5 rounded-[2.2rem] font-black uppercase text-xs">Recevoir le code</button>
            </div>
          </div>
        )}

        {step === 'otp' && (
          <div className="space-y-6 animate-in slide-in-from-right-10">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] text-center space-y-6">
              <h3 className="text-white font-black text-sm uppercase tracking-widest">Code de vérification</h3>
              <div className="flex justify-center gap-2">
                {otpCode.map((val, i) => (
                  <input key={i} id={`otp-${i}`} type="number" maxLength={1} value={val} onChange={(e) => handleOtpChange(i, e.target.value)} className="w-12 h-16 bg-white/10 border border-white/10 rounded-2xl text-center text-2xl font-black text-white outline-none" />
                ))}
              </div>
              <p className="text-[8px] text-slate-500 font-bold uppercase">Code envoyé au +241 {phoneNumber}</p>
            </div>
            <button onClick={handleVerifyOtp} disabled={otpCode.some(v => v === '')} className="w-full bg-emerald-500 text-white py-5 rounded-[2.2rem] font-black uppercase text-xs active:scale-95 disabled:opacity-50">Vérifier et entrer</button>
          </div>
        )}

        {step === 'loading' && (
          <div className="py-20 flex flex-col items-center justify-center space-y-6">
            <Loader2 className="w-12 h-12 text-indigo-400 animate-spin" />
            <p className="text-[10px] font-black text-white uppercase tracking-widest">Ouverture de session...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginView;
