import React, { useState, useEffect } from 'react';
import { ShieldCheck, ScrollText, CheckCircle2, ArrowRight, Gavel, FileText, Wallet, Trash2, MapPin, EyeOff, RefreshCw, Smartphone, Camera, Lock } from 'lucide-react';

interface TermsViewProps {
  onAccept?: () => void;
  isOnboarding?: boolean;
  onClose?: () => void;
}

type LegalTab = 'cgu' | 'privacy' | 'gps' | 'delete-account';

const TermsView: React.FC<TermsViewProps> = ({ onAccept, isOnboarding = true, onClose }) => {
  const [activeTab, setActiveTab] = useState<LegalTab>('cgu');
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  
  // GPS State simulation for compliance dashboard
  const [isGpsExact, setIsGpsExact] = useState(true);
  const [gpsLogs, setGpsLogs] = useState<Array<{ id: string; time: string; coords: string; reason: string }>>([
    { id: '1', time: 'Il y a 2 min', coords: '0.3952 N, 9.4551 E', reason: 'Recherche de taxi' },
    { id: '2', time: 'Il y a 10 min', coords: '0.3884 N, 9.4673 E', reason: 'Validation de trajet' },
    { id: '3', time: 'Il y a 20 min', coords: '0.3811 N, 9.4501 E', reason: 'SOS Sécurité actif' },
  ]);
  const [gpsPurged, setGpsPurged] = useState(false);

  // Account deletion states
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 30) {
      setHasScrolled(true);
    }
  };

  const handlePurgeGps = () => {
    setGpsLogs([]);
    setGpsPurged(true);
    setTimeout(() => setGpsPurged(false), 3000);
  };

  const handleApplyAccountDeletion = () => {
    if (deleteConfirmationText !== 'SUPPRIMER') return;
    setIsDeleting(true);
    
    setTimeout(() => {
      // Clear all state tokens & keys
      sessionStorage.clear();
      localStorage.clear();
      setIsDeleting(false);
      setDeleteSuccess(true);
      
      // Force reload to restart onboarding
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }, 2500);
  };

  return (
    <div className="p-6 h-full flex flex-col space-y-6 animate-in fade-in duration-500 bg-white">
      {/* Title */}
      <div className="text-center space-y-1 pt-2">
        <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 mx-auto mb-1">
          <ShieldCheck className="w-7 h-7 text-emerald-600" />
        </div>
        <h2 className="text-xl font-black text-slate-800">Sécurité & Légal</h2>
        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Contrat et Protection des données</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto p-1 bg-slate-100 rounded-2xl shrink-0 hide-scrollbar">
        <button
          onClick={() => setActiveTab('cgu')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === 'cgu' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
        >
          CGU
        </button>
        <button
          onClick={() => setActiveTab('privacy')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === 'privacy' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
        >
          Confidentialité
        </button>
        <button
          onClick={() => setActiveTab('gps')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === 'gps' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
        >
          Données GPS
        </button>
        <button
          onClick={() => setActiveTab('delete-account')}
          className={`flex-1 py-1 px-3 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === 'delete-account' ? 'bg-red-500 text-white shadow-sm' : 'text-slate-500'}`}
        >
          Destruction Compte
        </button>
      </div>

      {/* Main Content Area */}
      <div 
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto bg-slate-50 rounded-[2rem] p-6 text-slate-600 text-xs leading-relaxed space-y-4 border border-slate-100 shadow-inner"
      >
        {activeTab === 'cgu' && (
          <div className="space-y-4">
            <h3 className="font-black text-xs text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-2">Conditions Générales Maraude</h3>
            
            <section className="space-y-1">
              <h4 className="font-black text-slate-800 flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-slate-500" /> 1. OBJET DU SERVICE
              </h4>
              <p className="text-slate-500">Maraude Solution est une plateforme technologique mettant en relation des utilisateurs avec des prestataires de transport (taxis certifiés, clando) et des professionnels libéraux en République Gabonaise (Libreville, Port-Gentil, Akanda, Owendo).</p>
            </section>

            <section className="space-y-1">
              <h4 className="font-black text-slate-800 flex items-center gap-2">
                <Gavel className="w-3.5 h-3.5 text-slate-500" /> 2. ABONNEMENT OBLIGATOIRE
              </h4>
              <p className="text-slate-400">Pour assurer son indépendance, la sécurité physique de nos usagers et la rémunération équitable des agents, l'accès à l'écosystème Maraude est conditionné par un abonnement mensuel obligatoire de <span className="font-bold text-slate-800">5 000 FCFA</span>.</p>
            </section>

            <section className="space-y-1">
              <h4 className="font-black text-slate-800 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-500" /> 3. FRAIS ET COMMISSION DE 9%
              </h4>
              <p className="text-slate-400">Une retenue fixe de <span className="font-bold text-slate-800">9%</span> s'applique sur chaque course live, diagnostic d'artisan ou livraison négociée par IA. Tout contournement entraîne le bannissement irréversible du terminal.</p>
            </section>

            <section className="space-y-1">
              <h4 className="font-black text-slate-800 flex items-center gap-2">
                <Wallet className="w-3.5 h-3.5 text-slate-500" /> 4. PAIEMENT SÉQUESTRE UNIQUE
              </h4>
              <p className="text-slate-400">Tous les paiements doivent impérativement s'initier à travers le Portefeuille MA ou Mobile Money connecté. L'argent est bloqué par Maraude et libéré uniquement sur confirmation de travail.</p>
            </section>

            <section className="space-y-1">
              <h4 className="font-black text-slate-800 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" /> 5. RESPONSABILITÉ CHAUFFEURS
              </h4>
              <p className="text-slate-400">Chaque chauffeur s'engage à porter ostensiblement son numéro MA certifié sur les deux portières de son véhicule.</p>
            </section>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="space-y-4">
            <h3 className="font-black text-xs text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-2">Charte de Confidentialité (APDP)</h3>
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-3">
              <Lock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h5 className="font-bold text-emerald-800 text-[10px] uppercase">Conforme Loi APDP Gabon</h5>
                <p className="text-[10px] text-emerald-700 leading-tight">Vos données privées sont cryptées à la source et stockées de manière pseudonymisée conformément aux réglementations de la Commission Gabonaise.</p>
              </div>
            </div>

            <section className="space-y-1">
              <h4 className="font-black text-slate-800 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-500" /> JUSTIFICATION DE LA GÉOLOCALISATION
              </h4>
              <p className="text-slate-400">Le suivi de localisation GPS en arrière-plan est obligatoire pour :</p>
              <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-400">
                <li>Calculer avec précision les distances de prise en charge et éviter les tarifs arbitraires au Gabon.</li>
                <li>Permettre le traceur de sécurité "SOS" partagé avec vos contacts de confiance en temps réel.</li>
                <li>Guider les livreurs et chauffeurs de façon optimale.</li>
              </ul>
            </section>

            <section className="space-y-1">
              <h4 className="font-black text-slate-800 flex items-center gap-2">
                <Camera className="w-3.5 h-3.5 text-slate-500" /> ACCÈS APPAREIL PHOTO & FICHIERS
              </h4>
              <p className="text-slate-400">L'accès caméra sert exclusivement à scanner la carte grise, la pièce d'identité des chauffeurs lors de la vérification de compte physique (Numéro MA) et à charger la photo de profil.</p>
            </section>

            <section className="space-y-1">
              <h4 className="font-black text-slate-800 flex items-center gap-2">
                <Smartphone className="w-3.5 h-3.5 text-slate-500" /> STOCKAGE DES TOKENS
              </h4>
              <p className="text-slate-400">Tous les jetons de session cryptographiques sont conservés localement par sandboxing dans l'application, encryptés par signature HMAC-SHA256.</p>
            </section>
          </div>
        )}

        {activeTab === 'gps' && (
          <div className="space-y-4">
            <h3 className="font-black text-xs text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-2">Contrôle de Traçage GPS (Sandbox)</h3>
            
            <p className="text-slate-400">Maraude respecte l'autonomie et le choix de ses usagers. Ajustez la précision de localisation affectée par les chauffeurs ou purgez de force votre historique spatial de nos clusters Firestore.</p>

            {/* Precision switch card */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-black text-slate-800 text-[10px] uppercase">Mode de Précision GPS</h5>
                  <p className="text-[10px] text-slate-400">Ajuste le degré de précision de vos coordonnées.</p>
                </div>
                <button 
                  onClick={() => setIsGpsExact(!isGpsExact)}
                  className={`w-14 h-7 rounded-full p-1 transition-all ${isGpsExact ? 'bg-emerald-500' : 'bg-slate-300'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-all ${isGpsExact ? 'translate-x-7' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="text-[11px] p-3 rounded-xl bg-slate-50 flex items-center gap-2 text-slate-500">
                {isGpsExact ? (
                  <span>精准 📡 <b>GPS Haute Précision :</b> Coordonnées précises à 4 décimales. Recommandé pour estimer les prix de course et commander l'assistance SOS.</span>
                ) : (
                  <span>模糊 👁️‍🗨️ <b>GPS Approximatif (Vicinité) :</b> Coordonnées limitées à 2 décimales. Renforce l'anonymat, mais rend l'estimation de distance moins fidèle d'environ 1 km.</span>
                )}
              </div>
            </div>

            {/* Location Log table */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black text-[10px] uppercase text-slate-400 tracking-wider">Caches Géographiques Actifs</span>
                <button 
                  onClick={handlePurgeGps}
                  className="text-[10px] font-black text-red-500 flex items-center gap-1 hover:underline"
                >
                  <Trash2 className="w-3 h-3" /> Purgér la mémoire GPS
                </button>
              </div>

              {gpsPurged && (
                <div className="p-3 bg-red-50 text-red-600 rounded-xl font-bold text-center text-[10px] uppercase tracking-wider animate-pulse">
                  ✓ Historique GPS vidé de l'appareil et de nos serveurs de stockage !
                </div>
              )}

              {gpsLogs.length > 0 ? (
                <div className="space-y-1.5">
                  {gpsLogs.map(log => (
                    <div key={log.id} className="bg-white p-3 rounded-xl border border-slate-100 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                          <span className="font-bold text-slate-700 text-[10px]">{log.reason}</span>
                        </div>
                        <span className="text-[9px] text-slate-400 font-mono">{log.coords}</span>
                      </div>
                      <span className="text-[9px] text-slate-400 italic">{log.time}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-slate-300 font-bold border border-dashed border-slate-200 rounded-xl">
                  Aucun historique spatial en mémoire.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'delete-account' && (
          <div className="space-y-4">
            <h3 className="font-black text-xs text-red-500 uppercase tracking-widest border-b border-red-200 pb-2">Destruction de Compte & Droits à l'Oubli</h3>
            
            {deleteSuccess ? (
              <div className="p-8 text-center space-y-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="font-black text-slate-800 text-sm">Compte Supprimé avec Succès !</h4>
                <p className="text-[11px] text-slate-500">Toutes vos informations ont été effacées définitivement de l'appareil et des serveurs Cloud Maraude. Redémarrage du système...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex items-start gap-3 text-red-700 text-[11px] leading-snug">
                  <EyeOff className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-black uppercase">Conséquences de la suppression :</p>
                    <ul className="list-disc pl-4 space-y-0.5">
                      <li>Effacement immédiat et irréversible de votre Solde Mobile Money fictif restant.</li>
                      <li>Perte de vos trajets enregistrés et accès à Maraude Santé.</li>
                      <li>Clôture de votre numéro d'immatriculation MA Unique (si prestataire/chauffeur).</li>
                      <li>Effacement complet de votre fiche APDP.</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-2 p-4 bg-slate-100 rounded-2xl border border-slate-200">
                  <p className="font-bold text-slate-700 text-[10px] uppercase tracking-wider text-center">Pour confirmer, veuillez saisir le mot clé :</p>
                  <p className="text-center font-black text-xs text-slate-600 uppercase tracking-[0.2em] bg-white py-1.5 rounded-lg border border-slate-200 shadow-sm transition-all select-none">SUPPRIMER</p>
                  
                  <input 
                    type="text" 
                    value={deleteConfirmationText}
                    onChange={(e) => setDeleteConfirmationText(e.target.value)}
                    placeholder="Saisissez le mot clé ici..."
                    className="w-full text-center font-black text-xs py-3 px-4 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-slate-800 uppercase"
                  />
                </div>

                <button
                  disabled={deleteConfirmationText !== 'SUPPRIMER' || isDeleting}
                  onClick={handleApplyAccountDeletion}
                  className="w-full py-4.5 bg-red-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg hover:bg-red-600 disabled:opacity-20 active:scale-95 duration-200 transition-all flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Suppression des bases de données...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" /> Détruire Définitivement mes Données
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Button footer based on state */}
      <div className="space-y-3 pt-1 shrink-0">
        {isOnboarding ? (
          <>
            <label className={`flex items-start gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${isChecked ? 'bg-amber-50 border-amber-200 shadow-sm' : 'bg-white border-slate-100'}`}>
              <input 
                type="checkbox" 
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-amber-500 border-slate-300 focus:ring-amber-500"
              />
              <span className="text-[10px] font-bold text-slate-500 leading-tight">
                Je confirme avoir lu et j'accepte sans réserve les conditions générales d'utilisation de Maraude Solution, incluant l'obligation de payer via l'application et la traçabilité de mes trajets.
              </span>
            </label>

            <button 
              onClick={onAccept}
              disabled={!isChecked}
              className="w-full py-4 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-[10px] tracking-widest shadow-xl shadow-slate-900/20 active:scale-95 disabled:opacity-20 flex items-center justify-center gap-2 transition-all"
            >
              Accepter et Déverrouiller l'App <ArrowRight className="w-4 h-4" />
            </button>
          </>
        ) : (
          <button 
            onClick={onClose}
            className="w-full py-4 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-[10px] tracking-widest shadow-md active:scale-95 flex items-center justify-center gap-2 transition-all"
          >
            Fermer le Panel Légal
          </button>
        )}
      </div>
    </div>
  );
};

export default TermsView;
