
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, ChevronRight, ChevronLeft, Sparkles, 
  Car, Stethoscope, Scale, ShoppingBag, 
  Wallet, ShieldCheck, ArrowRight
} from 'lucide-react';

interface OnboardingStep {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  image: string;
}

const STEPS: OnboardingStep[] = [
  {
    title: "Bienvenue sur Ndjele",
    description: "La super-app gabonaise qui simplifie votre quotidien. Transport, santé, justice et commerce dans une seule main.",
    icon: Sparkles,
    color: "bg-emerald-500",
    image: "https://picsum.photos/seed/ndjele1/800/600"
  },
  {
    title: "Transport Intelligent",
    description: "Commandez un taxi ou un clando en quelques secondes. Négociez le prix directement avec le chauffeur via notre IA.",
    icon: Car,
    color: "bg-amber-500",
    image: "https://picsum.photos/seed/ndjele2/800/600"
  },
  {
    title: "Santé à Portée de Main",
    description: "Trouvez les pharmacies de garde, consultez des médecins certifiés et commandez vos médicaments en ligne.",
    icon: Stethoscope,
    color: "bg-pink-500",
    image: "https://picsum.photos/seed/ndjele3/800/600"
  },
  {
    title: "Justice & Conseil",
    description: "Accédez facilement à des avocats, huissiers et experts pour protéger vos droits et vos intérêts.",
    icon: Scale,
    color: "bg-indigo-500",
    image: "https://picsum.photos/seed/ndjele4/800/600"
  },
  {
    title: "Marketplace Locale",
    description: "Soutenez les commerçants de votre quartier. Achetez des produits frais et faites-vous livrer rapidement.",
    icon: ShoppingBag,
    color: "bg-violet-500",
    image: "https://picsum.photos/seed/ndjele5/800/600"
  },
  {
    title: "Paiements Sécurisés",
    description: "Gérez votre budget avec le portefeuille Ndjele. Payez via Airtel Money ou Moov Money en toute sécurité.",
    icon: Wallet,
    color: "bg-blue-500",
    image: "https://picsum.photos/seed/ndjele6/800/600"
  }
];

interface OnboardingOverlayProps {
  onComplete: () => void;
}

const OnboardingOverlay: React.FC<OnboardingOverlayProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = STEPS[currentStep];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] bg-slate-900 flex flex-col"
    >
      <div className="absolute top-0 inset-x-0 h-2/3 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentStep}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.8 }}
            src={step.image}
            className="w-full h-full object-cover"
            alt={step.title}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
      </div>

      <div className="relative flex-1 flex flex-col justify-end p-8 pb-12 space-y-8">
        <div className="space-y-6">
          <motion.div
            key={`icon-${currentStep}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`w-16 h-16 ${step.color} rounded-[1.8rem] flex items-center justify-center text-white shadow-2xl`}
          >
            <step.icon className="w-8 h-8" />
          </motion.div>

          <div className="space-y-3">
            <motion.h2
              key={`title-${currentStep}`}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="text-4xl font-black text-white tracking-tighter leading-tight"
            >
              {step.title}
            </motion.h2>
            <motion.p
              key={`desc-${currentStep}`}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-slate-400 font-medium text-lg leading-relaxed"
            >
              {step.description}
            </motion.p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex gap-2">
            {STEPS.map((_, i) => (
              <div 
                key={i} 
                className={`h-1 rounded-full transition-all duration-500 ${i === currentStep ? 'w-8 bg-emerald-500' : 'w-2 bg-slate-700'}`} 
              />
            ))}
          </div>

          <div className="flex items-center justify-between gap-4">
            {currentStep > 0 ? (
              <button 
                onClick={handleBack}
                className="p-5 bg-white/5 text-white rounded-2xl border border-white/10 active:scale-95 transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            ) : (
              <div className="w-[66px]" />
            )}

            <button 
              onClick={handleNext}
              className="flex-1 py-5 bg-white text-slate-900 rounded-[2rem] font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-all"
            >
              {currentStep === STEPS.length - 1 ? "C'est parti !" : "Suivant"}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <button 
        onClick={onComplete}
        className="absolute top-8 right-8 p-3 bg-white/10 text-white rounded-full backdrop-blur-md border border-white/10 active:scale-95 transition-all"
      >
        <X className="w-5 h-5" />
      </button>
    </motion.div>
  );
};

export default OnboardingOverlay;
