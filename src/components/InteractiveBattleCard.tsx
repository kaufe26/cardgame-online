import React, { useState } from 'react';
import { CardData } from '../types';
import { CardView } from './CardView';
import { Heart, Swords, Shield, Zap, Sparkles, Trophy, RotateCcw, Plus, Minus } from 'lucide-react';
import confetti from 'canvas-confetti';

interface InteractiveBattleCardProps {
  card: CardData;
  onVictory?: (winnerName: string) => void;
  onLogCombat?: (message: string) => void;
  isOpponent?: boolean;
}

export const InteractiveBattleCard: React.FC<InteractiveBattleCardProps> = ({
  card,
  onVictory,
  onLogCombat,
  isOpponent = false,
}) => {
  const [currentHp, setCurrentHp] = useState<number>(card.stats.hp);
  const [powerUsed, setPowerUsed] = useState<boolean>(false);
  const [isDamaged, setIsDamaged] = useState<boolean>(false);
  const [isHealed, setIsHealed] = useState<boolean>(false);
  const [customDelta, setCustomDelta] = useState<number>(15);
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [isRollingDice, setIsRollingDice] = useState<boolean>(false);

  const maxHp = card.stats.maxHp || 100;
  const isKnockedOut = currentHp <= 0;
  const hpPercentage = Math.min(100, Math.max(0, (currentHp / maxHp) * 100));

  const handleModifyHp = (delta: number) => {
    const newHp = Math.max(0, currentHp + delta);
    setCurrentHp(newHp);

    if (delta < 0) {
      setIsDamaged(true);
      setTimeout(() => setIsDamaged(false), 500);
      onLogCombat?.(`💥 ${card.heroName} sofreu ${Math.abs(delta)} de dano! (${newHp}/${maxHp} HP restante)`);
      if (newHp === 0) {
        onLogCombat?.(`☠️ ${card.heroName} FOI NOCAUTEADO!`);
      }
    } else {
      setIsHealed(true);
      setTimeout(() => setIsHealed(false), 500);
      onLogCombat?.(`💚 ${card.heroName} recuperou +${delta} HP! (${newHp}/${maxHp} HP)`);
    }
  };

  const handleRollD6 = () => {
    if (isRollingDice) return;
    setIsRollingDice(true);
    let count = 0;
    const interval = setInterval(() => {
      const temp = Math.floor(Math.random() * 6) + 1;
      setDiceValue(temp);
      count++;
      if (count > 8) {
        clearInterval(interval);
        const finalResult = Math.floor(Math.random() * 6) + 1;
        setDiceValue(finalResult);
        setIsRollingDice(false);
        const diceEmojis = ['', '⚀ 1', '⚁ 2', '⚂ 3', '⚃ 4', '⚄ 5', '⚅ 6'];
        onLogCombat?.(`🎲 ${card.heroName} rolou o Dado D6 e tirou: ${diceEmojis[finalResult] || finalResult}!`);
      }
    }, 60);
  };

  const handleUsePower = () => {
    setPowerUsed(!powerUsed);
    if (!powerUsed) {
      onLogCombat?.(`⚡ ${card.heroName} ativou [${card.power.name}]!`);
    }
  };

  const handleReset = () => {
    setCurrentHp(card.stats.hp);
    setPowerUsed(false);
    setDiceValue(null);
    onLogCombat?.(`🔄 ${card.heroName} teve sua vida restaurada para ${card.stats.hp} HP.`);
  };

  const handleCelebrate = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    onVictory?.(card.heroName);
    onLogCombat?.(`🏆 ${card.heroName} VENCEU A BATALHA!`);
  };

  return (
    <div
      className={`flex flex-col items-center bg-slate-900/90 border-2 ${
        isKnockedOut
          ? 'border-rose-600/60 opacity-80'
          : isOpponent
          ? 'border-rose-500/50'
          : 'border-emerald-500/50'
      } p-4 rounded-3xl shadow-2xl transition-all duration-300 w-full max-w-sm`}
    >
      {/* Top Combat Role Header */}
      <div className="w-full flex items-center justify-between mb-3">
        <span
          className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider ${
            isOpponent
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
          }`}
        >
          {isOpponent ? '⚔️ Oponente' : '🛡️ Seu Herói'}
        </span>

        {isKnockedOut ? (
          <span className="text-xs font-black text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-600 animate-bounce">
            NOCAUTEADO
          </span>
        ) : (
          <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            Em Combate
          </span>
        )}
      </div>

      {/* 3D Card Display */}
      <div
        className={`transition-transform duration-300 ${
          isDamaged ? 'scale-95 filter brightness-150 ring-4 ring-rose-500 rounded-3xl' : ''
        } ${isHealed ? 'scale-105 ring-4 ring-emerald-400 rounded-3xl' : ''}`}
      >
        <CardView
          card={{
            ...card,
            stats: {
              ...card.stats,
              hp: currentHp,
            },
          }}
          interactiveTilt={false}
          showHoloFoil={!isKnockedOut}
        />
      </div>

      {/* Combat Control Deck (Live Editable Health & Actions) */}
      <div className="w-full mt-4 bg-slate-950/90 border border-slate-800 rounded-2xl p-3.5 space-y-3">
        {/* HP Bar */}
        <div>
          <div className="flex justify-between items-center text-xs font-black mb-1">
            <span className="text-slate-300 flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              PONTOS DE VIDA (HP)
            </span>
            <span
              className={`text-sm ${
                currentHp === 0
                  ? 'text-rose-500 font-black'
                  : currentHp <= maxHp * 0.3
                  ? 'text-amber-400 font-black animate-pulse'
                  : 'text-emerald-400 font-black'
              }`}
            >
              {currentHp} / {maxHp}
            </span>
          </div>

          <div className="w-full h-3 bg-slate-900 rounded-full border border-slate-700 overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                currentHp <= maxHp * 0.3
                  ? 'bg-gradient-to-r from-red-600 to-rose-400'
                  : 'bg-gradient-to-r from-emerald-500 to-green-400'
              }`}
              style={{ width: `${hpPercentage}%` }}
            />
          </div>
        </div>

        {/* Custom Input for Any Custom Dice or Attack Value */}
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={customDelta}
            onChange={(e) => setCustomDelta(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-16 bg-slate-900 border border-slate-700 rounded-xl px-2 py-2 text-center text-xs font-black text-amber-300 focus:outline-none focus:border-amber-400"
          />
          <button
            onClick={() => handleModifyHp(-customDelta)}
            disabled={isKnockedOut}
            className="flex-1 bg-rose-600 hover:bg-rose-500 text-white text-xs font-black py-2 rounded-xl active:scale-95 disabled:opacity-40 shadow transition-all"
          >
            ⚔️ Aplicar Dano (-{customDelta})
          </button>
          <button
            onClick={() => handleModifyHp(customDelta)}
            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black py-2 rounded-xl active:scale-95 shadow transition-all"
          >
            💖 Curar (+{customDelta})
          </button>
        </div>

        {/* Dado D6 Interativo Giratório */}
        <div className="pt-2 border-t border-slate-800">
          <div className="bg-slate-900/90 p-2.5 rounded-xl border border-amber-500/40 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎲</span>
              <div className="flex flex-col text-left">
                <span className="text-xs font-black text-amber-300">
                  Dado D6 de Batalha
                </span>
                <span className="text-[10px] text-slate-400">Gira e sorteia de 1 a 6</span>
              </div>
            </div>
            <button
              onClick={handleRollD6}
              disabled={isRollingDice}
              className={`bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black px-4 py-2 rounded-xl shadow-lg active:scale-95 flex items-center gap-2 transition-all cursor-pointer ${
                isRollingDice ? 'animate-pulse scale-105 ring-2 ring-amber-300' : ''
              }`}
            >
              <span className={`text-base inline-block transition-transform duration-500 ${isRollingDice ? 'rotate-[720deg]' : ''}`}>
                🎲
              </span>
              <span className="text-xs font-bold uppercase">Rolar:</span>
              <span className="text-sm font-black min-w-[16px] text-center bg-slate-950/20 px-1.5 py-0.5 rounded">
                {diceValue !== null ? diceValue : '?'}
              </span>
            </button>
          </div>
        </div>

        {/* Power Activation Toggle */}
        <button
          onClick={handleUsePower}
          className={`w-full py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${
            powerUsed
              ? 'bg-amber-400/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
              : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-amber-500/50'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Zap className={`w-3.5 h-3.5 ${powerUsed ? 'text-amber-400' : 'text-slate-500'}`} />
            {card.power.name}
          </span>
          <span className="text-[10px] uppercase font-black">
            {powerUsed ? '⚡ ATIVADO' : 'Disponível'}
          </span>
        </button>

        {/* Quick Victory / Reset Buttons */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={handleCelebrate}
            className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black py-2 rounded-xl text-xs flex items-center justify-center gap-1 active:scale-95 shadow-md transition-all"
          >
            <Trophy className="w-3.5 h-3.5" />
            Vencedor!
          </button>
          <button
            onClick={handleReset}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-xl text-xs font-bold border border-slate-700 active:scale-95 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};
