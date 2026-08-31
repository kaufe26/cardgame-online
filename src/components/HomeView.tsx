import React from 'react';
import { ActiveView, CardData } from '../types';
import { CardView } from './CardView';
import {
  Sparkles,
  PlusCircle,
  FolderHeart,
  LayoutGrid,
  Swords,
  Printer,
  Settings,
  Zap,
  Shield,
  Heart,
  Crown,
  Smartphone,
  Monitor,
  Flame,
} from 'lucide-react';

interface HomeViewProps {
  setActiveView: (view: ActiveView) => void;
  cards: CardData[];
  onSelectCardToEdit: (card: CardData) => void;
  onCreateNewFromTemplate: (templateId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  setActiveView,
  cards,
  onSelectCardToEdit,
  onCreateNewFromTemplate,
}) => {
  const featuredCard = cards[0] || null;

  return (
    <div className="space-y-10 pb-16">
      {/* 1. HERO BANNER - Modern, Colorful & Futuristic */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 border-2 border-indigo-500/30 p-6 sm:p-10 shadow-2xl">
        {/* Background Glowing Orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400/20 to-pink-500/20 border border-amber-400/40 px-3.5 py-1.5 rounded-full">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              <span className="text-xs font-black tracking-wide text-amber-300 uppercase">
                Estúdio Profissional de Cards 3D
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white tracking-wider leading-tight drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
              CARD FORGE <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-pink-400 to-sky-400">KIDS 3D</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
              Crie cards incríveis para seus jogos de tabuleiro. Edite heróis 3D, poderes, regras, imprima em PDF A4 de 300 DPI e batalhe com cards interativos com controle de HP!
            </p>

            {/* Quick Action Navigation Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={() => setActiveView('editor')}
                className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm px-6 py-3.5 rounded-2xl shadow-[0_0_25px_rgba(234,179,8,0.4)] flex items-center gap-2 active:scale-95 transition-all"
              >
                <PlusCircle className="w-5 h-5 text-slate-950" />
                <span>Criar Novo Card</span>
              </button>

              <button
                onClick={() => setActiveView('battle')}
                className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-black text-sm px-5 py-3.5 rounded-2xl shadow-[0_0_20px_rgba(225,29,72,0.4)] flex items-center gap-2 active:scale-95 transition-all border border-rose-400/30"
              >
                <Swords className="w-5 h-5 text-yellow-300" />
                <span>Arena de Duelo 1v1</span>
              </button>

              <button
                onClick={() => setActiveView('templates')}
                className="bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-bold text-sm px-5 py-3.5 rounded-2xl border border-slate-700 flex items-center gap-2 active:scale-95 transition-all"
              >
                <LayoutGrid className="w-4 h-4 text-sky-400" />
                <span>Ver Templates</span>
              </button>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1 rounded-lg border border-slate-800">
                <Printer className="w-3.5 h-3.5 text-amber-400" />
                Impressão A4 300 DPI
              </span>
              <span className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1 rounded-lg border border-slate-800">
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                PWA Android & Tablet
              </span>
              <span className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1 rounded-lg border border-slate-800">
                <Monitor className="w-3.5 h-3.5 text-sky-400" />
                Windows & Offline
              </span>
            </div>
          </div>

          {/* Right Column: 3D Showcase Card */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            {featuredCard ? (
              <div className="flex flex-col items-center group cursor-pointer" onClick={() => onSelectCardToEdit(featuredCard)}>
                <div className="transform group-hover:scale-105 group-hover:-rotate-1 transition-all duration-300 drop-shadow-[0_25px_35px_rgba(0,0,0,0.8)]">
                  <CardView card={featuredCard} interactiveTilt={true} showHoloFoil={true} />
                </div>
                <p className="text-xs text-amber-400/90 font-bold mt-3 bg-slate-900/80 px-3 py-1 rounded-full border border-amber-400/30 flex items-center gap-1.5 shadow">
                  <Sparkles className="w-3.5 h-3.5" />
                  Clique para Editar no Estúdio 3D
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* 2. SIX MAIN MODULE SHORTCUTS (Conforme o Prompt do Usuário) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold text-white flex items-center gap-2">
              <Crown className="w-6 h-6 text-amber-400" />
              Painel Principal de Criação
            </h2>
            <p className="text-xs text-slate-400">Acesse todas as ferramentas do CARD FORGE KIDS 3D</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {/* Novo Card */}
          <div
            onClick={() => setActiveView('editor')}
            className="group bg-gradient-to-b from-blue-950/80 to-slate-900 p-4 rounded-2xl border border-blue-500/30 hover:border-amber-400 cursor-pointer transition-all hover:-translate-y-1 shadow-lg text-center flex flex-col items-center justify-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-400 flex items-center justify-center text-blue-300 group-hover:scale-110 group-hover:bg-amber-400 group-hover:text-slate-950 transition-all mb-2 shadow">
              <PlusCircle className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-sm font-bold text-white">Novo Card</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Criar do zero</p>
          </div>

          {/* Meus Cards */}
          <div
            onClick={() => setActiveView('gallery')}
            className="group bg-gradient-to-b from-purple-950/80 to-slate-900 p-4 rounded-2xl border border-purple-500/30 hover:border-amber-400 cursor-pointer transition-all hover:-translate-y-1 shadow-lg text-center flex flex-col items-center justify-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-600/30 border border-purple-400 flex items-center justify-center text-purple-300 group-hover:scale-110 group-hover:bg-amber-400 group-hover:text-slate-950 transition-all mb-2 shadow">
              <FolderHeart className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-sm font-bold text-white">Meus Cards</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">{cards.length} salvos</p>
          </div>

          {/* Templates */}
          <div
            onClick={() => setActiveView('templates')}
            className="group bg-gradient-to-b from-amber-950/80 to-slate-900 p-4 rounded-2xl border border-amber-500/30 hover:border-amber-400 cursor-pointer transition-all hover:-translate-y-1 shadow-lg text-center flex flex-col items-center justify-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-600/30 border border-amber-400 flex items-center justify-center text-amber-300 group-hover:scale-110 group-hover:bg-amber-400 group-hover:text-slate-950 transition-all mb-2 shadow">
              <LayoutGrid className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-sm font-bold text-white">Templates</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">8 modelos 3D</p>
          </div>

          {/* Arena 1v1 */}
          <div
            onClick={() => setActiveView('battle')}
            className="group bg-gradient-to-b from-rose-950/80 to-slate-900 p-4 rounded-2xl border border-rose-500/30 hover:border-amber-400 cursor-pointer transition-all hover:-translate-y-1 shadow-lg text-center flex flex-col items-center justify-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-600/30 border border-rose-400 flex items-center justify-center text-rose-300 group-hover:scale-110 group-hover:bg-amber-400 group-hover:text-slate-950 transition-all mb-2 shadow">
              <Swords className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-sm font-bold text-white">Arena 1v1</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Duelo com HP</p>
          </div>

          {/* Exportações */}
          <div
            onClick={() => setActiveView('print')}
            className="group bg-gradient-to-b from-emerald-950/80 to-slate-900 p-4 rounded-2xl border border-emerald-500/30 hover:border-amber-400 cursor-pointer transition-all hover:-translate-y-1 shadow-lg text-center flex flex-col items-center justify-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/30 border border-emerald-400 flex items-center justify-center text-emerald-300 group-hover:scale-110 group-hover:bg-amber-400 group-hover:text-slate-950 transition-all mb-2 shadow">
              <Printer className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-sm font-bold text-white">Exportações</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">PDF A4, PNG, Web</p>
          </div>

          {/* Configurações */}
          <div
            onClick={() => setActiveView('settings')}
            className="group bg-gradient-to-b from-slate-800 to-slate-900 p-4 rounded-2xl border border-slate-700 hover:border-amber-400 cursor-pointer transition-all hover:-translate-y-1 shadow-lg text-center flex flex-col items-center justify-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-slate-700/50 border border-slate-600 flex items-center justify-center text-slate-300 group-hover:scale-110 group-hover:bg-amber-400 group-hover:text-slate-950 transition-all mb-2 shadow">
              <Settings className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-sm font-bold text-white">Ajustes</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Tema & Idioma</p>
          </div>
        </div>
      </section>

      {/* 3. TEMPLATES RÁPIDOS (Super-herói, Mago, Cavaleiro, Robô, Dinossauro, Pirata, Princesa, Dragão) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              Templates Populares Prontos
            </h2>
            <p className="text-xs text-slate-400">Escolha um estilo visual e comece a editar instantaneamente</p>
          </div>
          <button
            onClick={() => setActiveView('templates')}
            className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 hover:underline"
          >
            Ver todos (8) →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            { id: 'superhero', label: 'Super-herói', emoji: '🦸‍♂️', color: 'border-blue-500/50' },
            { id: 'mage', label: 'Mago', emoji: '🧙‍♀️', color: 'border-purple-500/50' },
            { id: 'knight', label: 'Cavaleiro', emoji: '🛡️', color: 'border-amber-500/50' },
            { id: 'robot', label: 'Robô', emoji: '🤖', color: 'border-sky-500/50' },
            { id: 'dino', label: 'Dinossauro', emoji: '🦖', color: 'border-emerald-500/50' },
            { id: 'pirate', label: 'Pirata', emoji: '🏴‍☠️', color: 'border-red-500/50' },
            { id: 'princess', label: 'Princesa', emoji: '👑', color: 'border-pink-500/50' },
            { id: 'dragon', label: 'Dragão', emoji: '🐉', color: 'border-orange-500/50' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onCreateNewFromTemplate(item.id)}
              className={`bg-slate-900/90 hover:bg-slate-800 p-3 rounded-2xl border ${item.color} hover:border-amber-400 flex flex-col items-center justify-center text-center transition-all hover:scale-105 active:scale-95 shadow-md`}
            >
              <span className="text-2xl mb-1">{item.emoji}</span>
              <span className="text-xs font-bold text-slate-200">{item.label}</span>
              <span className="text-[9px] text-amber-400 mt-1 font-semibold">Usar Modelo</span>
            </button>
          ))}
        </div>
      </section>

      {/* 4. RECENT CREATIONS */}
      {cards.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
              <FolderHeart className="w-5 h-5 text-pink-400" />
              Seus Cards Salvos ({cards.length})
            </h2>
            <button
              onClick={() => setActiveView('gallery')}
              className="text-xs text-amber-400 hover:text-amber-300 font-bold hover:underline"
            >
              Gerenciar Galeria →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {cards.slice(0, 4).map((card) => (
              <div
                key={card.id}
                onClick={() => onSelectCardToEdit(card)}
                className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 hover:border-amber-400/80 cursor-pointer transition-all hover:-translate-y-1 shadow-xl flex flex-col items-center group"
              >
                <div className="transform group-hover:scale-102 transition-transform">
                  <CardView card={card} interactiveTilt={false} showHoloFoil={false} />
                </div>
                <div className="w-full mt-3 flex items-center justify-between px-1">
                  <div>
                    <h4 className="font-heading font-bold text-xs text-white truncate max-w-[150px]">
                      {card.heroName}
                    </h4>
                    <p className="text-[10px] text-slate-400">{card.rarity} • {card.stats.hp} HP</p>
                  </div>
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
                    Editar
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
