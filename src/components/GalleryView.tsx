import React, { useState } from 'react';
import { CardData, ActiveView } from '../types';
import { CardView } from './CardView';
import { StorageService } from '../services/storage';
import { ExportService } from '../services/exportService';
import {
  FolderHeart,
  PlusCircle,
  Search,
  Star,
  Copy,
  Trash2,
  Edit3,
  Download,
  Upload,
  Swords,
  Printer,
  Sparkles,
  Check,
  Globe,
  Package,
} from 'lucide-react';

interface GalleryViewProps {
  cards: CardData[];
  onSelectCardToEdit: (card: CardData) => void;
  onSelectCardsForBattle: (card1: CardData, card2?: CardData) => void;
  onRefreshCards: () => void;
  setActiveView: (view: ActiveView) => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({
  cards,
  onSelectCardToEdit,
  onSelectCardsForBattle,
  onRefreshCards,
  setActiveView,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterFavorite, setFilterFavorite] = useState<boolean>(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [notification, setNotification] = useState<string>('');

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 2500);
  };

  const handleToggleFav = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    StorageService.toggleFavorite(id);
    onRefreshCards();
  };

  const handleDuplicate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const duplicated = StorageService.duplicateCard(id);
    if (duplicated) {
      showNotification(`Card duplicado com sucesso!`);
      onRefreshCards();
    }
  };

  const handleDelete = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Tem certeza que deseja excluir o card "${name}"?`)) {
      StorageService.deleteCard(id);
      showNotification(`Card excluído.`);
      onRefreshCards();
    }
  };

  const handleExportDeckJson = () => {
    const jsonStr = StorageService.exportDeckAsJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deck_cardforge_kids3d_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Backup do Deck exportado em JSON!');
  };

  const handleImportDeckJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const count = StorageService.importDeckFromJson(event.target?.result as string);
        showNotification(`${count} cards importados com sucesso!`);
        onRefreshCards();
      } catch (err: any) {
        alert(err.message || 'Erro ao importar arquivo.');
      }
    };
    reader.readAsText(file);
  };

  const handleExportAllZip = async () => {
    if (cards.length === 0) {
      alert('Nenhum card cadastrado na galeria para exportar.');
      return;
    }
    showNotification(`Gerando arquivo .ZIP com todos os ${cards.length} cards...`);
    try {
      await ExportService.downloadCardsDeckZip(cards, `Colecao_Total_${cards.length}_Cards`);
      showNotification(`Pacote .ZIP com ${cards.length} cards baixado com sucesso!`);
    } catch (e) {
      console.error(e);
      alert('Erro ao gerar pacote ZIP.');
    }
  };

  const handleExportCardZip = async (card: CardData, e: React.MouseEvent) => {
    e.stopPropagation();
    showNotification(`Gerando pacote .ZIP de "${card.heroName}"...`);
    try {
      await ExportService.downloadCardZip(card);
      showNotification(`Pacote .ZIP de "${card.heroName}" baixado!`);
    } catch (e) {
      console.error(e);
      alert('Erro ao exportar ZIP.');
    }
  };

  // Filter cards
  const filteredCards = cards.filter((card) => {
    const matchesSearch =
      card.heroName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.power.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFav = !filterFavorite || !!card.isFavorite;
    const matchesCat = categoryFilter === 'all' || card.templateCategory === categoryFilter;

    return matchesSearch && matchesFav && matchesCat;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-pink-400/20 text-pink-300 text-xs font-bold px-3 py-1 rounded-full mb-1 border border-pink-400/30">
            <FolderHeart className="w-3.5 h-3.5" />
            Coleção Pessoal
          </div>
          <h1 className="font-display text-2xl sm:text-3xl text-white">Meus Cards Salvos</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Gerencie, edite, duplique, teste em batalha e exporte seus cards salvos localmente.
          </p>
        </div>

        {/* Top Deck Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportAllZip}
            className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-1.5 active:scale-95 border border-amber-300/50"
            title="Baixar todos os cards interativos em arquivo ZIP com menu de jogo"
          >
            <Package className="w-4 h-4 text-slate-950" />
            <span>📦 Baixar Tudo em ZIP</span>
          </button>

          <button
            onClick={() => setActiveView('editor')}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl shadow flex items-center gap-1.5 active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-amber-400" />
            <span>Novo Card</span>
          </button>

          <button
            onClick={handleExportDeckJson}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold px-3 py-2.5 rounded-xl flex items-center gap-1.5 active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Backup JSON</span>
          </button>

          <label className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold px-3 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer active:scale-95">
            <Upload className="w-3.5 h-3.5" />
            <span>Importar</span>
            <input type="file" accept=".json" onChange={handleImportDeckJson} className="hidden" />
          </label>
        </div>
      </div>

      {/* Notification toast */}
      {notification && (
        <div className="bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs font-bold px-4 py-2.5 rounded-2xl flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por herói ou poder..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setFilterFavorite(!filterFavorite)}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              filterFavorite
                ? 'bg-amber-400 text-slate-950 font-black'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${filterFavorite ? 'fill-slate-950' : 'text-amber-400'}`} />
            <span>Favoritos</span>
          </button>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400"
          >
            <option value="all">Todas Categorias</option>
            <option value="superhero">Super-herói</option>
            <option value="mage">Mago</option>
            <option value="knight">Cavaleiro</option>
            <option value="robot">Robô</option>
            <option value="dino">Dinossauro</option>
            <option value="pirate">Pirata</option>
            <option value="princess">Princesa</option>
            <option value="dragon">Dragão</option>
          </select>
        </div>
      </div>

      {/* Cards Grid */}
      {filteredCards.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-dashed border-slate-800 space-y-3">
          <Sparkles className="w-10 h-10 mx-auto text-amber-400/50" />
          <h3 className="font-heading font-bold text-base text-white">Nenhum card encontrado</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Não há cards correspondentes aos filtros selecionados. Crie um novo card ou altere a busca!
          </p>
          <button
            onClick={() => setActiveView('editor')}
            className="bg-amber-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl shadow active:scale-95"
          >
            Criar Primeiro Card
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCards.map((card) => {
            const formattedDate = new Date(card.updatedAt || card.createdAt).toLocaleDateString('pt-BR');

            return (
              <div
                key={card.id}
                className="bg-slate-900/90 rounded-3xl p-4 border border-slate-800 hover:border-amber-400/80 transition-all flex flex-col justify-between group shadow-xl"
              >
                {/* Top Quick Badges */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-slate-400 font-mono">{formattedDate}</span>
                  <button
                    onClick={(e) => handleToggleFav(card.id, e)}
                    className="p-1 rounded-lg hover:bg-slate-800 transition-colors"
                    title="Favoritar"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        card.isFavorite
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-600 hover:text-amber-400'
                      }`}
                    />
                  </button>
                </div>

                {/* Card Thumbnail */}
                <div
                  onClick={() => onSelectCardToEdit(card)}
                  className="flex justify-center py-2 cursor-pointer"
                >
                  <div className="transform group-hover:scale-104 transition-transform duration-300">
                    <CardView card={card} interactiveTilt={false} showHoloFoil={card.enableFoil} />
                  </div>
                </div>

                {/* Card Info */}
                <div className="mt-3 pt-3 border-t border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-heading font-black text-xs text-white truncate max-w-[150px]">
                      {card.heroName}
                    </h4>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                      {card.stats.hp} HP
                    </span>
                  </div>

                  {/* Action Bar (Edit, Duplicate, Battle, Web Card, ZIP, Delete) */}
                  <div className="grid grid-cols-5 gap-1.5 pt-1">
                    <button
                      onClick={() => onSelectCardToEdit(card)}
                      className="bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-slate-300 p-2 rounded-xl text-xs font-bold flex items-center justify-center transition-all"
                      title="Editar no Estúdio 3D"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        onSelectCardsForBattle(card);
                        setActiveView('battle');
                      }}
                      className="bg-rose-950 hover:bg-rose-600 text-rose-300 hover:text-white p-2 rounded-xl text-xs font-bold flex items-center justify-center transition-all border border-rose-800/40"
                      title="Duelo 1v1 na Arena"
                    >
                      <Swords className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={(e) => handleExportCardZip(card, e)}
                      className="bg-amber-950/80 hover:bg-amber-500 text-amber-300 hover:text-slate-950 p-2 rounded-xl text-xs font-bold flex items-center justify-center transition-all border border-amber-500/40"
                      title="Baixar Pacote do Card em ZIP (.zip)"
                    >
                      <Package className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => ExportService.downloadInteractiveHtmlCard(card)}
                      className="bg-purple-950 hover:bg-purple-600 text-purple-300 hover:text-white p-2 rounded-xl text-xs font-bold flex items-center justify-center transition-all border border-purple-800/40"
                      title="Baixar Card Web Interativo (.html)"
                    >
                      <Globe className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={(e) => handleDuplicate(card.id, e)}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-xl text-xs font-bold flex items-center justify-center transition-all"
                      title="Duplicar Card"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => handleDelete(card.id, card.heroName, e)}
                    className="w-full text-[10px] text-slate-500 hover:text-rose-400 font-bold py-1 flex items-center justify-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Excluir Card</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
