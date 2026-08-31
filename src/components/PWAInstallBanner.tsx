import React, { useState, useEffect } from 'react';
import { Download, Smartphone, Monitor, X, Sparkles } from 'lucide-react';

export const PWAInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!isDismissed) setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, [isDismissed]);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else {
      alert('Para instalar: abra o menu do navegador (três pontos) e clique em "Instalar CARD FORGE KIDS 3D" ou "Adicionar à tela inicial"!');
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm bg-gradient-to-r from-slate-900 to-indigo-950 border-2 border-amber-400 p-4 rounded-3xl shadow-2xl animate-in slide-in-from-bottom-5 no-print">
      <button
        onClick={() => {
          setShowBanner(false);
          setIsDismissed(true);
        }}
        className="absolute top-3 right-3 text-slate-400 hover:text-white"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-2xl bg-amber-400 flex items-center justify-center text-slate-950 flex-shrink-0 shadow">
          <Sparkles className="w-5 h-5 animate-spin" />
        </div>
        <div className="space-y-1 pr-4">
          <h4 className="font-heading font-black text-xs text-amber-300 uppercase">
            Instale o CARD FORGE 3D
          </h4>
          <p className="text-[11px] text-slate-300 leading-tight">
            Instale no Windows ou Android para usar sem internet em qualquer lugar!
          </p>
          <button
            onClick={handleInstall}
            className="mt-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-4 py-1.5 rounded-xl shadow active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Instalar Agora</span>
          </button>
        </div>
      </div>
    </div>
  );
};
