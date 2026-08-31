import React, { useState, useRef } from 'react';
import { CardData, PrintSettings, ActiveView } from '../types';
import { CardView } from './CardView';
import { ExportService } from '../services/exportService';
import {
  Printer,
  FileDown,
  Image as ImageIcon,
  Globe,
  Sparkles,
  Check,
  Scissors,
  Grid,
  Layers,
  Repeat,
  Share2,
  Package,
} from 'lucide-react';

interface PrintExportViewProps {
  cards: CardData[];
  selectedCard?: CardData | null;
  setActiveView: (view: ActiveView) => void;
}

export const PrintExportView: React.FC<PrintExportViewProps> = ({
  cards,
  selectedCard,
  setActiveView,
}) => {
  const [activeCard, setActiveCard] = useState<CardData>(selectedCard || cards[0] || null);
  const [printSettings, setPrintSettings] = useState<PrintSettings>({
    cardsPerPage: 4,
    includeBacksides: true,
    showCutLines: true,
    marginMm: 10,
    duplexAlignment: true,
  });

  const [selectedCardIds, setSelectedCardIds] = useState<string[]>(
    cards.slice(0, 4).map((c) => c.id)
  );

  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportMessage, setExportMessage] = useState<string>('');

  const singleCardFrontRef = useRef<HTMLDivElement>(null);
  const singleCardBackRef = useRef<HTMLDivElement>(null);
  const printableSheetRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setExportMessage(msg);
    setTimeout(() => setExportMessage(''), 3000);
  };

  const handleToggleCardSelection = (id: string) => {
    if (selectedCardIds.includes(id)) {
      setSelectedCardIds(selectedCardIds.filter((cid) => cid !== id));
    } else {
      setSelectedCardIds([...selectedCardIds, id]);
    }
  };

  const handleSelectAll = () => {
    setSelectedCardIds(cards.map((c) => c.id));
  };

  // Export 1 Card as PNG (300 DPI)
  const handleExportPng = async () => {
    if (!singleCardFrontRef.current || !activeCard) return;
    setIsExporting(true);
    try {
      await ExportService.exportAsPng(singleCardFrontRef.current, activeCard.heroName, 4);
      showToast(`Card "${activeCard.heroName}" exportado em PNG (300 DPI)!`);
    } catch (e) {
      console.error(e);
      alert('Erro ao gerar PNG.');
    } finally {
      setIsExporting(false);
    }
  };

  // Export 1 Card as JPG (Maximum Quality)
  const handleExportJpg = async () => {
    if (!singleCardFrontRef.current || !activeCard) return;
    setIsExporting(true);
    try {
      await ExportService.exportAsJpg(singleCardFrontRef.current, activeCard.heroName, 4);
      showToast(`Card "${activeCard.heroName}" exportado em JPG (Qualidade Máxima)!`);
    } catch (e) {
      console.error(e);
      alert('Erro ao gerar JPG.');
    } finally {
      setIsExporting(false);
    }
  };

  // Export Standalone Interactive HTML Playable Web Card
  const handleExportWebCard = () => {
    if (!activeCard) return;
    ExportService.downloadInteractiveHtmlCard(activeCard);
    showToast(`Card Web Interativo de "${activeCard.heroName}" baixado para PC e Android!`);
  };

  // Export Single Card as .ZIP Package
  const handleExportSingleZip = async () => {
    if (!activeCard) return;
    setIsExporting(true);
    showToast(`Empacotando "${activeCard.heroName}" em arquivo .ZIP...`);
    try {
      await ExportService.downloadCardZip(activeCard, singleCardFrontRef.current);
      showToast(`Pacote ZIP de "${activeCard.heroName}" baixado com sucesso!`);
    } catch (e) {
      console.error(e);
      alert('Erro ao gerar pacote ZIP.');
    } finally {
      setIsExporting(false);
    }
  };

  // Export Selected Cards as a .ZIP Deck
  const handleExportSelectedDeckZip = async () => {
    if (selectedCardIds.length === 0) {
      alert('Selecione pelo menos 1 card para empacotar em ZIP.');
      return;
    }
    const selectedCards = cards.filter((c) => selectedCardIds.includes(c.id));
    setIsExporting(true);
    showToast(`Gerando pacote ZIP com ${selectedCards.length} cards interativos...`);
    try {
      await ExportService.downloadCardsDeckZip(selectedCards, `Colecao_${selectedCards.length}_Cards_Interativos`);
      showToast(`Pacote ZIP com ${selectedCards.length} cards baixado com sucesso!`);
    } catch (e) {
      console.error(e);
      alert('Erro ao gerar pacote ZIP da coleção.');
    } finally {
      setIsExporting(false);
    }
  };

  // Export A4 PDF Print Sheet with Cut Marks
  const handleExportA4Pdf = async () => {
    if (selectedCardIds.length === 0) {
      alert('Selecione pelo menos 1 card para a folha A4.');
      return;
    }
    setIsExporting(true);
    showToast('Gerando PDF A4 com marcas de corte a 300 DPI...');

    try {
      // Gather hidden DOM elements for the selected cards
      const frontEls: HTMLElement[] = [];
      const backEls: HTMLElement[] = [];

      selectedCardIds.forEach((id) => {
        const frontEl = document.getElementById(`print_front_${id}`);
        const backEl = document.getElementById(`print_back_${id}`);
        if (frontEl) frontEls.push(frontEl);
        if (backEl) backEls.push(backEl);
      });

      if (frontEls.length === 0) {
        alert('Carregando elementos de impressão...');
        return;
      }

      await ExportService.generateA4Pdf(
        frontEls,
        printSettings.includeBacksides ? backEls : [],
        printSettings,
        'CardForgeKids3D_FolhaA4'
      );

      showToast('PDF A4 pronto e baixado com marcas de corte!');
    } catch (e) {
      console.error(e);
      alert('Erro ao gerar PDF.');
    } finally {
      setIsExporting(false);
    }
  };

  // Standard Browser Print
  const handleDirectPrint = () => {
    window.print();
  };

  const cardsToPrint = cards.filter((c) => selectedCardIds.includes(c.id));

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 no-print">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full mb-1 border border-emerald-500/30">
            <Printer className="w-3.5 h-3.5" />
            Central de Impressão & Exportação
          </div>
          <h1 className="font-display text-2xl sm:text-3xl text-white">Exportação & Folha A4</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Exporte cards individuais em alta definição (300 DPI) ou monte folhas A4 com marcas de corte para jogos de tabuleiro.
          </p>
        </div>
      </div>

      {/* Toast */}
      {exportMessage && (
        <div className="bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs font-bold px-4 py-3 rounded-2xl flex items-center gap-2 animate-in fade-in no-print">
          <Check className="w-4 h-4" />
          <span>{exportMessage}</span>
        </div>
      )}

      {/* Grid: Left Single Card Export & Right A4 Sheet Organizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start no-print">
        {/* ===================================================================== */}
        {/* 1. EXPORTAÇÃO INDIVIDUAL (PNG, JPG, WEB CARD INTERATIVO)              */}
        {/* ===================================================================== */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
          <h3 className="font-heading font-black text-sm text-amber-300 uppercase tracking-wider flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-amber-400" />
            1. Exportar Card Único (300 DPI)
          </h3>

          {/* Card Selector dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Escolha o Card:</label>
            <select
              value={activeCard?.id || ''}
              onChange={(e) => {
                const found = cards.find((c) => c.id === e.target.value);
                if (found) setActiveCard(found);
              }}
              className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400"
            >
              {cards.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.heroName} ({c.rarity})
                </option>
              ))}
            </select>
          </div>

          {/* Preview stage */}
          {activeCard && (
            <div className="flex flex-col items-center py-2">
              <div ref={singleCardFrontRef} className="shadow-2xl rounded-[22px]">
                <CardView card={activeCard} interactiveTilt={false} showHoloFoil={activeCard.enableFoil} />
              </div>
            </div>
          )}

          {/* 3 Main Export Buttons Requested: PNG, JPG, WEB CARD */}
          <div className="space-y-2 pt-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleExportPng}
                disabled={isExporting}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black text-xs py-3 rounded-xl shadow active:scale-95 flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <FileDown className="w-4 h-4" />
                <span>Baixar PNG (300 DPI)</span>
              </button>

              <button
                type="button"
                onClick={handleExportJpg}
                disabled={isExporting}
                className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-black text-xs py-3 rounded-xl shadow active:scale-95 flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Baixar JPG (Max)</span>
              </button>
            </div>

            {/* Special Download Playable Web Card HTML & ZIP */}
            <button
              type="button"
              onClick={handleExportSingleZip}
              disabled={isExporting}
              className="w-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs py-3.5 rounded-2xl shadow-xl flex items-center justify-center gap-2 active:scale-95 border border-amber-300/50 disabled:opacity-50"
            >
              <Package className="w-4 h-4 text-slate-950" />
              <span>📦 Baixar Pacote do Card em ZIP (.zip)</span>
            </button>

            <button
              type="button"
              onClick={handleExportWebCard}
              className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs py-3 rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-95 border border-purple-400/40"
            >
              <Globe className="w-4 h-4 text-yellow-300" />
              <span>Baixar Card HTML Interativo (.html)</span>
            </button>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 2. IMPRESSÃO EM FOLHA A4 COM MARCAS DE CORTE                          */}
        {/* ===================================================================== */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-5">
          <h3 className="font-heading font-black text-sm text-emerald-300 uppercase tracking-wider flex items-center gap-2">
            <Scissors className="w-4 h-4 text-emerald-400" />
            2. Configurar Folha A4 para Impressão
          </h3>

          {/* Cards per page picker (1, 2, 4, 8) */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Cards por Folha A4:</label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 4, 8].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setPrintSettings({ ...printSettings, cardsPerPage: num as any })}
                  className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                    printSettings.cardsPerPage === num
                      ? 'bg-emerald-500 text-slate-950 font-black border-emerald-400 shadow-md ring-2 ring-emerald-400/40'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {num} {num === 1 ? 'Card' : 'Cards'}
                </button>
              ))}
            </div>
          </div>

          {/* Toggle options (Linhas pontilhadas, Frente/Verso) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-200">
              <input
                type="checkbox"
                checked={printSettings.showCutLines}
                onChange={(e) => setPrintSettings({ ...printSettings, showCutLines: e.target.checked })}
                className="w-4 h-4 accent-emerald-400 rounded"
              />
              <span>Adicionar marcas e linhas de corte pontilhadas</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-200">
              <input
                type="checkbox"
                checked={printSettings.includeBacksides}
                onChange={(e) =>
                  setPrintSettings({ ...printSettings, includeBacksides: e.target.checked })
                }
                className="w-4 h-4 accent-emerald-400 rounded"
              />
              <span>Incluir página com Versos alinhados</span>
            </label>
          </div>

          {/* Card Selection List for Print Sheet */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-300">
                Selecione os cards para imprimir ({selectedCardIds.length} selecionados):
              </label>
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-[11px] text-amber-400 hover:underline font-bold"
              >
                Selecionar Todos
              </button>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-1.5 p-2 bg-slate-950 rounded-2xl border border-slate-800">
              {cards.map((c) => {
                const isSelected = selectedCardIds.includes(c.id);
                return (
                  <div
                    key={c.id}
                    onClick={() => handleToggleCardSelection(c.id)}
                    className={`p-2 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-emerald-950/80 border border-emerald-500/60 text-white font-bold'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] font-black ${
                          isSelected ? 'bg-emerald-400 text-slate-950' : 'bg-slate-800'
                        }`}
                      >
                        {isSelected ? '✓' : ''}
                      </span>
                      <span className="text-xs truncate">{c.heroName}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{c.rarity} • {c.stats.hp} HP</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons for PDF, ZIP & Print */}
          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={handleExportSelectedDeckZip}
              disabled={isExporting || selectedCardIds.length === 0}
              className="w-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs py-3.5 rounded-2xl shadow-xl flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 transition-all border border-amber-300/50"
            >
              <Package className="w-4 h-4 text-slate-950" />
              <span>📦 Baixar Todos os Cards Selecionados em ZIP (.zip com Menu Interativo)</span>
            </button>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleExportA4Pdf}
                disabled={isExporting || selectedCardIds.length === 0}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-xs py-3.5 rounded-2xl shadow-xl flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>Gerar PDF A4 Automático (300 DPI)</span>
              </button>

              <button
                type="button"
                onClick={handleDirectPrint}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-5 py-3.5 rounded-2xl border border-slate-700 active:scale-95 flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Direto</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* HIDDEN PRINT PREVIEW ELEMENTS (Utilizados para captura 300 DPI e PDF) */}
      {/* ===================================================================== */}
      <div className="hidden">
        {cards.map((c) => (
          <div key={`hidden_${c.id}`}>
            <div id={`print_front_${c.id}`}>
              <CardView card={c} isBackSide={false} showHoloFoil={false} />
            </div>
            <div id={`print_back_${c.id}`}>
              <CardView card={c} isBackSide={true} showHoloFoil={false} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
