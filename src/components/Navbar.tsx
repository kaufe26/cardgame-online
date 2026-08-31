import React, { useEffect, useState } from 'react';
import { ActiveView } from '../types';
import {
  Sparkles,
  PlusCircle,
  FolderHeart,
  LayoutGrid,
  Swords,
  Printer,
  Settings,
  Download,
  ShieldAlert,
  Home,
} from 'lucide-react';

interface NavbarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  cardsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeView, setActiveView, cardsCount }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstallable(false);
      }
      setDeferredPrompt(null);
    } else {
      alert('Para instalar no PC ou Android: clique no menu do seu navegador (três pontinhos) e escolha "Instalar aplicativo" ou "Adicionar à tela inicial"!');
    }
  };

  const navItems: { id: ActiveView; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'home', label: 'Início', icon: <Home className="w-4 h-4" /> },
    { id: 'editor', label: 'Novo Card', icon: <PlusCircle className="w-4 h-4" /> },
    { id: 'gallery', label: 'Meus Cards', icon: <FolderHeart className="w-4 h-4" />, badge: cardsCount },
    { id: 'templates', label: 'Templates', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'battle', label: 'Arena 1v1', icon: <Swords className="w-4 h-4 text-amber-400" /> },
    { id: 'print', label: 'Exportações', icon: <Printer className="w-4 h-4" /> },
    { id: 'settings', label: 'Configurações', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 shadow-xl no-print">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2">
        {/* Brand Title */}
        <div
          onClick={() => setActiveView('home')}
          className="flex items-center gap-2 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-pink-500 to-blue-600 p-0.5 shadow-[0_0_15px_rgba(234,179,8,0.4)] group-hover:scale-105 transition-transform flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display text-base sm:text-lg tracking-wider text-amber-400 drop-shadow">
                CARD FORGE
              </span>
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md shadow">
                KIDS 3D
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium -mt-1 hidden sm:block">
              Gerador Profissional de Cards TCG
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/90 p-1 rounded-2xl border border-slate-800">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-md font-black'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                      isActive ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-amber-400 border border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Controls & PWA install */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleInstallClick}
            className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-lg border border-blue-400/30 active:scale-95 transition-all"
            title="Instalar no Windows / Android / Tablet"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Instalar App PWA</span>
            <span className="sm:hidden">Instalar</span>
          </button>
        </div>
      </div>

      {/* Mobile Horizontal Sub-Navigation */}
      <div className="lg:hidden flex items-center gap-1 overflow-x-auto px-3 py-1.5 border-t border-slate-800/80 scrollbar-none bg-slate-950">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                isActive
                  ? 'bg-amber-400 text-slate-950 font-black shadow'
                  : 'text-slate-300 bg-slate-900 border border-slate-800'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {typeof item.badge === 'number' && item.badge > 0 && (
                <span className="text-[9px] px-1 rounded-full bg-slate-800 text-amber-300 font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
