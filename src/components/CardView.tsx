import React from 'react';
import { CardData } from '../types';
import { PowerIcon } from './PowerIcon';
import { Shield, Sparkles, Heart, Zap, Swords } from 'lucide-react';

interface CardViewProps {
  card: CardData;
  isBackSide?: boolean;
  scale?: number;
  className?: string;
  showHoloFoil?: boolean;
  interactiveTilt?: boolean;
  elementId?: string;
}

export const CardView: React.FC<CardViewProps> = ({
  card,
  isBackSide = false,
  scale = 1,
  className = '',
  showHoloFoil = true,
  interactiveTilt = false,
  elementId,
}) => {
  const [tilt, setTilt] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactiveTilt) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 18, y: -y * 18 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Frame styling mapping
  const getFrameBorder = () => {
    switch (card.frameStyle) {
      case 'gold':
        return 'border-[#eab308] shadow-[0_0_20px_rgba(234,179,8,0.4)]';
      case 'cyber':
        return 'border-[#38bdf8] shadow-[0_0_20px_rgba(56,189,248,0.5)]';
      case 'cosmic':
        return 'border-[#c084fc] shadow-[0_0_25px_rgba(192,132,252,0.5)]';
      case 'crystal':
        return 'border-[#f472b6] shadow-[0_0_20px_rgba(244,114,182,0.45)]';
      case 'fire':
        return 'border-[#f97316] shadow-[0_0_25px_rgba(249,115,22,0.5)]';
      case 'nature':
        return 'border-[#4ade80] shadow-[0_0_20px_rgba(74,222,128,0.4)]';
      default:
        return 'border-[#fbbf24] shadow-[0_0_20px_rgba(251,191,36,0.35)]';
    }
  };

  const getRarityBadgeColor = () => {
    switch (card.rarity) {
      case 'Mítico':
        return 'bg-gradient-to-r from-purple-600 via-pink-500 to-amber-400 text-white';
      case 'Lendário':
        return 'bg-gradient-to-r from-amber-500 to-yellow-300 text-slate-950 font-black';
      case 'Épico':
        return 'bg-gradient-to-r from-violet-600 to-purple-400 text-white';
      case 'Raro':
        return 'bg-gradient-to-r from-blue-600 to-cyan-400 text-white';
      default:
        return 'bg-slate-700 text-slate-200';
    }
  };

  const transformStyle = {
    transform: interactiveTilt
      ? `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`
      : undefined,
    transition: interactiveTilt ? 'transform 0.1s ease-out' : undefined,
  };

  // 63mm x 88mm ratio is ~1 : 1.3968. Standard card width is 320px, height is 447px (or 280x391px)
  return (
    <div
      id={elementId}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={transformStyle}
      className={`relative select-none transition-shadow duration-300 rounded-[22px] overflow-hidden ${
        card.enableFoil && showHoloFoil ? 'holo-foil' : ''
      } ${className}`}
    >
      {/* Outer 3D Card Shell */}
      <div
        className={`w-[300px] h-[420px] rounded-[22px] border-[5px] ${getFrameBorder()} bg-slate-950 flex flex-col justify-between p-2 relative text-slate-100 shadow-2xl overflow-hidden`}
        style={{
          background: isBackSide
            ? `radial-gradient(circle at center, ${card.backConfig.themeBackground || '#1e1b4b'} 0%, #090d16 100%)`
            : `radial-gradient(circle at 50% 20%, ${card.primaryColor}22 0%, #0b0f19 80%)`,
        }}
      >
        {/* Subtle Decorative Background pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

        {isBackSide ? (
          /* ========================================================================= */
          /* CARD BACK SIDE (VERSO DO CARD)                                           */
          /* ========================================================================= */
          <div className="w-full h-full flex flex-col items-center justify-between p-3 rounded-[16px] border-2 border-amber-400/50 bg-slate-950/70 relative z-10">
            {/* Top Logo Banner */}
            <div className="w-full text-center py-1.5 px-2 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 rounded-xl shadow-md">
              <span className="font-display text-sm tracking-wider text-slate-950 uppercase font-black">
                {card.backConfig.gameLogoText || 'CARD FORGE 3D'}
              </span>
            </div>

            {/* Central Shield Crest */}
            <div className="my-auto flex flex-col items-center justify-center relative">
              <div
                className="w-32 h-32 rounded-full border-4 border-amber-400/80 flex items-center justify-center relative shadow-inner"
                style={{
                  background: `linear-gradient(135deg, ${card.primaryColor}, ${card.secondaryColor})`,
                }}
              >
                {/* Rotating accent aura */}
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-white/40 animate-[spin_20s_linear_infinite]" />
                <PowerIcon
                  icon={card.backConfig.heroShieldIcon || card.power.icon}
                  className="w-16 h-16 text-yellow-300 drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)]"
                />
              </div>

              {/* Character Name in Back */}
              <h3 className="font-heading text-lg font-bold text-amber-300 mt-3 text-center drop-shadow px-2">
                {card.backConfig.characterName || card.heroName}
              </h3>

              {card.backConfig.customQuote && (
                <p className="text-[11px] text-slate-300 italic text-center max-w-[220px] mt-1 line-clamp-2">
                  "{card.backConfig.customQuote}"
                </p>
              )}
            </div>

            {/* Bottom Backside Stats / QR section */}
            <div className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl p-2 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="bg-amber-400/20 text-amber-300 font-extrabold px-2 py-0.5 rounded text-[10px] uppercase border border-amber-400/30">
                  {card.rarity}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  HP {card.stats.hp} • ATQ {card.stats.attack}
                </span>
              </div>
              <div className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>KIDS 3D TCG</span>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* CARD FRONT SIDE (FRENTE DO CARD)                                          */
          /* ========================================================================= */
          <div className="w-full h-full flex flex-col justify-between relative z-10">
            {/* 1. FAIXA SUPERIOR DOURADA (Top Gold Ribbon) */}
            <div className="w-full bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 rounded-t-[14px] px-2.5 py-1 flex items-center justify-between shadow-md border-b-2 border-amber-600/30">
              <div className="flex items-center gap-1.5 truncate">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 border border-white/60 shadow-sm flex-shrink-0" />
                <h2 className="font-heading font-extrabold text-[13px] text-slate-950 uppercase tracking-tight truncate drop-shadow-sm">
                  {card.heroName || 'Herói sem Nome'}
                </h2>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-xs ${getRarityBadgeColor()}`}>
                  {card.rarity}
                </span>
                {/* Health Points Pill */}
                <span className="bg-slate-950 text-emerald-400 text-[10px] font-black px-1.5 py-0.5 rounded-md border border-emerald-400/40 flex items-center gap-0.5">
                  <Heart className="w-2.5 h-2.5 text-rose-500 fill-rose-500" />
                  {card.stats.hp}
                </span>
              </div>
            </div>

            {/* 2. ILUSTRAÇÃO CENTRAL (Central Artwork with Zoom/Rotation/Flip) */}
            <div className="w-full h-[165px] bg-slate-900/90 rounded-b-md relative overflow-hidden border-2 border-amber-400/60 shadow-inner flex items-center justify-center my-1">
              {/* Illustration Canvas Wrapper */}
              <div
                className="w-full h-full flex items-center justify-center transition-transform duration-200"
                style={{
                  transform: `translate(${card.illustrationTransform.offsetX || 0}%, ${
                    card.illustrationTransform.offsetY || 0
                  }%) scale(${card.illustrationTransform.zoom || 1}) rotate(${
                    card.illustrationTransform.rotation || 0
                  }deg) scaleX(${card.illustrationTransform.flipHorizontal ? -1 : 1}) scaleY(${
                    card.illustrationTransform.flipVertical ? -1 : 1
                  })`,
                }}
              >
                {card.illustrationUrl ? (
                  <img
                    src={card.illustrationUrl}
                    alt={card.heroName}
                    className="w-full h-full object-contain pointer-events-none"
                  />
                ) : (
                  <div className="text-center p-4 text-slate-500">
                    <Sparkles className="w-8 h-8 mx-auto text-amber-400 mb-1" />
                    <span className="text-xs">Sem Ilustração</span>
                  </div>
                )}
              </div>

              {/* Subtitle tag overlay */}
              {card.subtitle && (
                <div className="absolute top-1.5 left-1.5 bg-slate-950/80 backdrop-blur-xs border border-white/20 px-2 py-0.5 rounded-md text-[9px] font-medium text-slate-200 max-w-[200px] truncate">
                  {card.subtitle}
                </div>
              )}

              {/* Combat Stats Overlay (Ataque / Defesa) */}
              <div className="absolute bottom-1 right-1 flex items-center gap-1">
                <span className="bg-slate-950/85 border border-amber-400/80 text-amber-300 text-[9px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow">
                  <Swords className="w-2.5 h-2.5 text-amber-400" />
                  {card.stats.attack}
                </span>
                <span className="bg-slate-950/85 border border-sky-400/80 text-sky-300 text-[9px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow">
                  <Shield className="w-2.5 h-2.5 text-sky-400" />
                  {card.stats.defense}
                </span>
              </div>
            </div>

            {/* 3. PODER & CAIXAS DE DESCRIÇÃO E REGRA (Power Section) */}
            <div className="flex-1 flex flex-col justify-between bg-slate-900/95 border border-slate-800 rounded-xl p-2 shadow-inner space-y-1">
              {/* Header do Poder + Ícone */}
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div
                    className="w-5 h-5 rounded-md flex items-center justify-center text-slate-950 font-black shadow-xs flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${card.accentColor || '#facc15'}, ${card.secondaryColor || '#ef4444'})`,
                    }}
                  >
                    <PowerIcon icon={card.power.icon} className="w-3.5 h-3.5 text-slate-950" />
                  </div>
                  <span className="font-heading font-bold text-[11px] text-amber-300 truncate">
                    {card.power.name || 'Super Golpe'}
                  </span>
                </div>
                {/* Limite de Utilização */}
                <span className="text-[8.5px] font-bold bg-amber-500/15 border border-amber-500/30 text-amber-300 px-1.5 py-0.5 rounded flex-shrink-0">
                  {card.power.usageLimit || '1x por rodada'}
                </span>
              </div>

              {/* Caixa de Descrição do Poder */}
              <p className="text-[9.5px] text-slate-200 leading-tight line-clamp-2 px-0.5">
                {card.power.description || 'Descrição detalhada do super poder especial do personagem.'}
              </p>

              {/* Caixa de Regra de Uso */}
              <div className="bg-slate-950/90 border border-sky-500/30 rounded-lg px-2 py-1 flex items-start gap-1 text-[9px] text-sky-200">
                <span className="font-black text-amber-400 flex-shrink-0">REGRA:</span>
                <span className="leading-tight line-clamp-2">
                  {card.power.rule || 'Causa dano direto e concede bônus no dado.'}
                </span>
              </div>

              {/* Rodapé da Carta (Footer info) */}
              <div className="flex items-center justify-between text-[8px] text-slate-400 font-mono pt-0.5 border-t border-slate-800">
                <span>CARD FORGE 3D • 63x88mm</span>
                <span className="text-amber-400 font-bold">★ EDIÇÃO LIMITADA ★</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
