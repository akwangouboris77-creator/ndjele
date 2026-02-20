
import React, { useState } from 'react';
import { ShieldCheck, ScrollText, CheckCircle2, ArrowRight, Gavel, FileText, Wallet } from 'lucide-react';
import { ViewState } from '../types';

interface TermsViewProps {
  onAccept: () => void;
}

const TermsView: React.FC<TermsViewProps> = ({ onAccept }) => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 20) {
      setHasScrolled(true);
    }
  };

  return (
    <div className="p-6 h-full flex flex-col space-y-6 animate-in fade-in duration-500 bg-white">
      <div className="text-center space-y-2 pt-4">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 mx-auto mb-2">
          <ScrollText className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-800">Contrat Ndjele</h2>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Conditions Générales d'Utilisation</p>
      </div>

      <div 
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto bg-slate-50 rounded-[2rem] p-6 text-slate-600 text-xs leading-relaxed space-y-4 border border-slate-100 shadow-inner"
      >
        <div className="space-y-4">
          <section className="space-y-2">
            <h4 className="font-black text-slate-800 flex items-center gap-2">
              <FileText className="w-3 h-3" /> 1. OBJET DU SERVICE
            </h4>
            <p>Ndjele Solution est une plateforme technologique mettant en relation des utilisateurs avec des prestataires de transport (taxis, clando) et des artisans qualifiés en République Gabonaise.</p>
          </section>

          <section className="space-y-2">
            <h4 className="font-black text-slate-800 flex items-center gap-2">
              <Gavel className="w-3 h-3" /> 2. ABONNEMENT OBLIGATOIRE
            </h4>
            <p>L'accès à tous les services Ndjele (Transport, Artisans, Livraison) est strictement conditionné par un abonnement mensuel de 5 000 FCFA. Cet abonnement est personnel, non transférable et renouvelable chaque mois.</p>
          </section>

          <section className="space-y-2">
            <h4 className="font-black text-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-3 h-3" /> 3. FRAIS DE PLATEFORME
            </h4>
            <p>Une commission de 9% est prélevée sur chaque transaction finalisée via la plateforme. Ces frais sont obligatoires pour tous les utilisateurs et couvrent les frais de maintenance, de sécurité et d'assistance.</p>
          </section>

          <section className="space-y-2">
            <h4 className="font-black text-slate-800 flex items-center gap-2">
              <Wallet className="w-3 h-3" /> 4. EXCLUSIVITÉ DES PAIEMENTS
            </h4>
            <p>Tous les paiements relatifs aux services gérés par Ndjele (Trajets, Prestations d'artisans, Livraisons) doivent impérativement être effectués via la plateforme (Portefeuille NS, Mobile Money intégré ou QR Code). Tout paiement direct non enregistré sur l'application est strictement interdit, dégage Ndjele de toute responsabilité en cas de litige et peut entraîner la suspension du compte.</p>
          </section>

          <section className="space-y-2">
            <h4 className="font-black text-slate-800 flex items-center gap-2">
              <CheckCircle2 className="w-3 h-3" /> 5. RESPONSABILITÉ
            </h4>
            <p>Ndjele Solution s'engage à vérifier l'identité des chauffeurs et artisans (Numéro NS). Cependant, Ndjele n'est pas responsable des dommages survenant lors d'une prestation, mais fournit un support de médiation et une assistance via le bouton SOS pour les services payés via la plateforme.</p>
          </section>

          <section className="space-y-2">
            <h4 className="font-black text-slate-800 flex items-center gap-2">
              <ScrollText className="w-3 h-3" /> 6. DONNÉES PERSONNELLES
            </h4>
            <p>Conformément aux directives de l'APDP (Gabon), vos données de géolocalisation et informations d'identité sont cryptées et utilisées uniquement pour le bon fonctionnement des services et votre sécurité.</p>
          </section>
          
          <div className="py-4 text-center">
            <p className="text-[10px] font-black text-slate-300 italic">Fin du document</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <label className={`flex items-start gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${isChecked ? 'bg-amber-50 border-amber-200 shadow-sm' : 'bg-white border-slate-100'}`}>
          <input 
            type="checkbox" 
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
            className="mt-1 w-4 h-4 rounded text-amber-500 border-slate-300 focus:ring-amber-500"
          />
          <span className="text-[11px] font-bold text-slate-600 leading-tight">
            Je confirme avoir lu et j'accepte sans réserve les conditions générales d'utilisation de Ndjele Solution, incluant l'obligation de paiement via la plateforme.
          </span>
        </label>

        <button 
          onClick={onAccept}
          disabled={!isChecked}
          className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl shadow-slate-900/20 active:scale-95 disabled:opacity-20 flex items-center justify-center gap-3 transition-all"
        >
          Accepter et Continuer <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default TermsView;
