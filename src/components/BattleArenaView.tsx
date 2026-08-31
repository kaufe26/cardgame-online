import React, { useState } from 'react';
import { CardData, ActiveView } from '../types';
import { InteractiveBattleCard } from './InteractiveBattleCard';
import { ExportService } from '../services/exportService';
import {
  Swords,
  Dices,
  Trophy,
  RotateCcw,
  Sparkles,
  Download,
  Globe,
  Share2,
  Check,
  Shield,
  Heart,
  ChevronRight,
  Package,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BattleArenaViewProps {
  cards: CardData[];
  initialPlayerCard?: CardData | null;
  initialOpponentCard?: CardData | null;
  setActiveView: (view: ActiveView) => void;
}

export const BattleArenaView: React.FC<BattleArenaViewProps> = ({
  cards,
  initialPlayerCard,
  initialOpponentCard,
  setActiveView,
}) => {
  const [playerCard, setPlayerCard] = useState<CardData>(initialPlayerCard || cards[0] || null);
  const [opponentCard, setOpponentCard] = useState<CardData>(
    initialOpponentCard || cards[1] || cards[0] || null
  );

  const [combatLogs, setCombatLogs] = useState<string[]>([
    '🔥 Arena de Batalha 1v1 pronta! Role os dados e use os botões de dano/cura para duelar com amigos!',
  ]);
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [winnerMessage, setWinnerMessage] = useState<string>('');

  const addCombatLog = (msg: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setCombatLogs((prev) => [`[${time}] ${msg}`, ...prev]);
  };

  const handleRollDice = (sides: number = 6) => {
    setIsRolling(true);
    let count = 0;
    const interval = setInterval(() => {
      setDiceResult(Math.floor(Math.random() * sides) + 1);
      count++;
      if (count > 8) {
        clearInterval(interval);
        const finalVal = Math.floor(Math.random() * sides) + 1;
        setDiceResult(finalVal);
        setIsRolling(false);
        addCombatLog(`🎲 Dado D${sides} rolado: Resultado = ${finalVal}!`);
      }
    }, 50);
  };

  const handleNextRound = () => {
    setRoundNumber((r) => r + 1);
    addCombatLog(`🔔 Início da Rodada #${roundNumber + 1}!`);
  };

  const handleVictory = (winnerName: string) => {
    setWinnerMessage(`🎉 ${winnerName} VENCEU A BATALHA!`);
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 },
    });
  };

  const handleDownloadBothWebCards = () => {
    if (playerCard) ExportService.downloadInteractiveHtmlCard(playerCard);
    if (opponentCard && opponentCard.id !== playerCard?.id) {
      setTimeout(() => ExportService.downloadInteractiveHtmlCard(opponentCard), 500);
    }
  };

  const handleDownloadDuelZip = async () => {
    const duelCards: CardData[] = [];
    if (playerCard) duelCards.push(playerCard);
    if (opponentCard && opponentCard.id !== playerCard?.id) duelCards.push(opponentCard);
    if (duelCards.length === 0) return;

    await ExportService.downloadCardsDeckZip(duelCards, `Duelo_${duelCards.map(c => c.heroName).join('_vs_')}`);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-rose-500/20 text-rose-300 text-xs font-bold px-3 py-1 rounded-full mb-1 border border-rose-500/30">
            <Swords className="w-3.5 h-3.5" />
            Modo Batalha Interativa
          </div>
          <h1 className="font-display text-2xl sm:text-3xl text-white">Arena de Duelo 1v1</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Duele entre amigos no PC ou Android com pontos de vida interativos, dados 3D e detector de vencedor!
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownloadDuelZip}
            className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 active:scale-95 transition-all border border-amber-300/50"
          >
            <Package className="w-4 h-4 text-slate-950" />
            <span>📦 Baixar Duelo em ZIP</span>
          </button>

          <button
            onClick={handleDownloadBothWebCards}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs px-3 py-2.5 rounded-xl shadow flex items-center gap-1.5 active:scale-95"
          >
            <Globe className="w-3.5 h-3.5 text-yellow-300" />
            <span>Cards HTML</span>
          </button>
        </div>
      </div>

      {/* Fighter Selectors */}
      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div>
          <label className="block text-xs font-bold text-emerald-300 mb-1">
            Selecione o Herói do Jogador 1 (Você):
          </label>
          <select
            value={playerCard?.id || ''}
            onChange={(e) => {
              const found = cards.find((c) => c.id === e.target.value);
              if (found) setPlayerCard(found);
            }}
            className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-400"
          >
            {cards.map((c) => (
              <option key={c.id} value={c.id}>
                {c.heroName} ({c.stats.hp} HP / {c.rarity})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-rose-300 mb-1">
            Selecione o Herói do Jogador 2 (Oponente):
          </label>
          <select
            value={opponentCard?.id || ''}
            onChange={(e) => {
              const found = cards.find((c) => c.id === e.target.value);
              if (found) setOpponentCard(found);
            }}
            className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:border-rose-400"
          >
            {cards.map((c) => (
              <option key={c.id} value={c.id}>
                {c.heroName} ({c.stats.hp} HP / {c.rarity})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Central Arena Tools (Dice roller, Round Counter, Winner banner) */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 p-4 rounded-3xl border border-indigo-500/30 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <span className="bg-amber-400 text-slate-950 font-black text-xs px-3 py-1.5 rounded-xl shadow">
            RODADA #{roundNumber}
          </span>
          <button
            onClick={handleNextRound}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-700 active:scale-95"
          >
            Próxima Rodada ⏩
          </button>
        </div>

        {/* Dice Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleRollDice(6)}
            disabled={isRolling}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow active:scale-95 disabled:opacity-50"
          >
            <Dices className="w-4 h-4 text-yellow-300" />
            <span>Rolar D6</span>
          </button>

          <button
            onClick={() => handleRollDice(20)}
            disabled={isRolling}
            className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow active:scale-95 disabled:opacity-50"
          >
            <Dices className="w-4 h-4 text-pink-300" />
            <span>Rolar D20</span>
          </button>

          {diceResult !== null && (
            <div className="bg-amber-400 text-slate-950 font-black text-base px-3 py-1 rounded-xl shadow-lg animate-bounce">
              🎲 {diceResult}
            </div>
          )}
        </div>
      </div>

      {/* Winner Banner */}
      {winnerMessage && (
        <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 p-4 rounded-2xl font-black text-center text-lg shadow-2xl flex items-center justify-center gap-3 animate-in zoom-in-95">
          <Trophy className="w-6 h-6 text-slate-950" />
          <span>{winnerMessage}</span>
          <button
            onClick={() => setWinnerMessage('')}
            className="bg-slate-950 text-amber-300 text-xs font-bold px-3 py-1 rounded-lg ml-2 hover:bg-slate-900"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Fighters Stage (Side-by-Side 1v1 interactive cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start justify-items-center">
        {/* Player 1 Card */}
        {playerCard ? (
          <InteractiveBattleCard
            card={playerCard}
            onVictory={handleVictory}
            onLogCombat={addCombatLog}
            isOpponent={false}
          />
        ) : (
          <div className="text-center p-8 text-slate-400">Nenhum herói selecionado.</div>
        )}

        {/* Player 2 Card */}
        {opponentCard ? (
          <InteractiveBattleCard
            card={opponentCard}
            onVictory={handleVictory}
            onLogCombat={addCombatLog}
            isOpponent={true}
          />
        ) : (
          <div className="text-center p-8 text-slate-400">Nenhum oponente selecionado.</div>
        )}
      </div>

      {/* Live Combat Log Feed */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
            <Swords className="w-4 h-4 text-amber-400" />
            Histórico e Registro do Combate
          </h3>
          <button
            onClick={() => setCombatLogs(['Histórico reiniciado.'])}
            className="text-xs text-slate-400 hover:text-amber-400 hover:underline"
          >
            Limpar Registro
          </button>
        </div>

        <div className="h-36 overflow-y-auto space-y-1.5 pr-2 text-xs font-mono text-slate-300">
          {combatLogs.map((log, idx) => (
            <div
              key={idx}
              className={`p-1.5 rounded-lg ${
                idx === 0
                  ? 'bg-slate-950 border border-amber-400/30 text-amber-300 font-bold'
                  : 'bg-slate-950/50 text-slate-400'
              }`}
            >
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
