import React, { useState, useRef } from 'react';
import { CardData, PowerIconType, FrameStyle, CardRarity, ActiveView } from '../types';
import { CardView } from './CardView';
import { POWER_ICONS_LIST } from './PowerIcon';
import { PRESET_ARTWORKS } from '../data/presetArtwork';
import { ExportService } from '../services/exportService';
import {
  Sparkles,
  RotateCw,
  ZoomIn,
  ZoomOut,
  FlipHorizontal,
  FlipVertical,
  Upload,
  Trash2,
  Save,
  Download,
  Printer,
  Swords,
  Heart,
  Shield,
  Zap,
  Repeat,
  Eye,
  Sliders,
  Maximize2,
  Check,
  Globe,
  Share2,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Move,
  Target,
  Package,
  FileArchive,
} from 'lucide-react';

interface EditorViewProps {
  card: CardData;
  onUpdateCard: (card: CardData) => void;
  onSaveCard: (card: CardData) => void;
  setActiveView: (view: ActiveView) => void;
}

export const EditorView: React.FC<EditorViewProps> = ({
  card,
  onUpdateCard,
  onSaveCard,
  setActiveView,
}) => {
  const [activeTab, setActiveTab] = useState<'character' | 'power' | 'illustration' | 'backside' | 'combat'>('character');
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [interactiveTilt, setInteractiveTilt] = useState<boolean>(true);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cardPreviewRef = useRef<HTMLDivElement>(null);

  // Field change helpers
  const handleTextChange = (field: keyof CardData, value: any) => {
    onUpdateCard({ ...card, [field]: value });
  };

  const handlePowerChange = (field: keyof CardData['power'], value: any) => {
    onUpdateCard({
      ...card,
      power: {
        ...card.power,
        [field]: value,
      },
    });
  };

  const handleStatsChange = (field: keyof CardData['stats'], value: number) => {
    onUpdateCard({
      ...card,
      stats: {
        ...card.stats,
        [field]: value,
        maxHp: field === 'hp' ? value : card.stats.maxHp,
      },
    });
  };

  const handleTransformChange = (field: keyof CardData['illustrationTransform'], value: any) => {
    onUpdateCard({
      ...card,
      illustrationTransform: {
        ...card.illustrationTransform,
        [field]: value,
      },
    });
  };

  const handleBackConfigChange = (field: keyof CardData['backConfig'], value: any) => {
    onUpdateCard({
      ...card,
      backConfig: {
        ...card.backConfig,
        [field]: value,
      },
    });
  };

  // Image Upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUpdateCard({
            ...card,
            illustrationUrl: event.target.result as string,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove image
  const handleRemoveImage = () => {
    onUpdateCard({
      ...card,
      illustrationUrl: '',
    });
  };

  // Reset image transform
  const handleResetTransform = () => {
    onUpdateCard({
      ...card,
      illustrationTransform: {
        zoom: 1,
        rotation: 0,
        flipHorizontal: false,
        flipVertical: false,
        offsetX: 0,
        offsetY: 0,
      },
    });
  };

  // Save Card
  const handleSave = () => {
    onSaveCard(card);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Quick Single Exports
  const handleQuickPng = async () => {
    if (!cardPreviewRef.current) return;
    setIsExporting(true);
    try {
      await ExportService.exportAsPng(cardPreviewRef.current, `${card.heroName}_frente`, 4);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleQuickJpg = async () => {
    if (!cardPreviewRef.current) return;
    setIsExporting(true);
    try {
      await ExportService.exportAsJpg(cardPreviewRef.current, `${card.heroName}_frente`, 4);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadInteractiveWebCard = () => {
    ExportService.downloadInteractiveHtmlCard(card);
  };

  const handleDownloadZip = async () => {
    setIsExporting(true);
    try {
      await ExportService.downloadCardZip(card, cardPreviewRef.current);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  const frameOptions: { id: FrameStyle; label: string; color: string }[] = [
    { id: 'gold', label: 'Dourada Real', color: 'bg-yellow-400' },
    { id: 'cyber', label: 'Cyber Neon', color: 'bg-cyan-400' },
    { id: 'cosmic', label: 'Cósmica Astral', color: 'bg-purple-500' },
    { id: 'crystal', label: 'Cristal Encantado', color: 'bg-pink-400' },
    { id: 'fire', label: 'Fogo Vulcânico', color: 'bg-orange-500' },
    { id: 'nature', label: 'Floresta Mágica', color: 'bg-emerald-500' },
  ];

  const rarityOptions: CardRarity[] = ['Comum', 'Raro', 'Épico', 'Lendário', 'Mítico'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-16">
      {/* ========================================================================= */}
      {/* 1. PAINEL LATERAL DO EDITOR (Left Sidebar)                                */}
      {/* ========================================================================= */}
      <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-5">
        {/* Editor Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
          {[
            { id: 'character', label: '1. Personagem', icon: <Sparkles className="w-4 h-4" /> },
            { id: 'power', label: '2. Poder Especial', icon: <Zap className="w-4 h-4" /> },
            { id: 'illustration', label: '3. Ilustração 3D', icon: <Sliders className="w-4 h-4" /> },
            { id: 'combat', label: '4. Atributos HP/ATQ', icon: <Heart className="w-4 h-4" /> },
            { id: 'backside', label: '5. Frente & Verso', icon: <Repeat className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                  : 'bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* TAB 1: PERSONAGEM                                                       */}
        {/* ----------------------------------------------------------------------- */}
        {activeTab === 'character' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h3 className="text-sm font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Identidade do Personagem
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Nome do Herói</label>
                <input
                  type="text"
                  value={card.heroName}
                  onChange={(e) => handleTextChange('heroName', e.target.value)}
                  placeholder="Ex: Astro Boy Galáctico"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Subtítulo / Título</label>
                <input
                  type="text"
                  value={card.subtitle}
                  onChange={(e) => handleTextChange('subtitle', e.target.value)}
                  placeholder="Ex: Defensor da Terra e Estrelas"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>
            </div>

            {/* Raridade */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Raridade do Card</label>
              <div className="grid grid-cols-5 gap-2">
                {rarityOptions.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleTextChange('rarity', r)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      card.rarity === r
                        ? 'bg-amber-400 text-slate-950 font-black ring-2 ring-amber-300'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Estilo de Moldura 3D */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Moldura 3D Estilizada</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {frameOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleTextChange('frameStyle', opt.id)}
                    className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-all ${
                      card.frameStyle === opt.id
                        ? 'bg-slate-800 border-amber-400 ring-2 ring-amber-400/40 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full ${opt.color} shadow`} />
                    <span className="text-[10px] font-bold leading-tight">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Cores Principal & Secundária */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Cor Principal</label>
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-700 rounded-xl p-1.5">
                  <input
                    type="color"
                    value={card.primaryColor}
                    onChange={(e) => handleTextChange('primaryColor', e.target.value)}
                    className="w-9 h-9 rounded-lg border-0 cursor-pointer bg-transparent"
                  />
                  <span className="text-xs font-mono text-slate-300">{card.primaryColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Cor Secundária</label>
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-700 rounded-xl p-1.5">
                  <input
                    type="color"
                    value={card.secondaryColor}
                    onChange={(e) => handleTextChange('secondaryColor', e.target.value)}
                    className="w-9 h-9 rounded-lg border-0 cursor-pointer bg-transparent"
                  />
                  <span className="text-xs font-mono text-slate-300">{card.secondaryColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Cor de Destaque</label>
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-700 rounded-xl p-1.5">
                  <input
                    type="color"
                    value={card.accentColor}
                    onChange={(e) => handleTextChange('accentColor', e.target.value)}
                    className="w-9 h-9 rounded-lg border-0 cursor-pointer bg-transparent"
                  />
                  <span className="text-xs font-mono text-slate-300">{card.accentColor}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* TAB 2: PODER                                                            */}
        {/* ----------------------------------------------------------------------- */}
        {activeTab === 'power' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h3 className="text-sm font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              Poder Especial & Habilidades
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Nome do Poder</label>
                <input
                  type="text"
                  value={card.power.name}
                  onChange={(e) => handlePowerChange('name', e.target.value)}
                  placeholder="Ex: Raio Cósmico Veloz"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Limite de Utilização</label>
                <input
                  type="text"
                  value={card.power.usageLimit}
                  onChange={(e) => handlePowerChange('usageLimit', e.target.value)}
                  placeholder="Ex: 1x por rodada / Custa 2 Energias"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Descrição do Poder</label>
              <textarea
                rows={2}
                value={card.power.description}
                onChange={(e) => handlePowerChange('description', e.target.value)}
                placeholder="Ex: Dispara uma rajada estelar que atinge adversários com pura energia cósmica."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Regra de Uso do Card</label>
              <textarea
                rows={2}
                value={card.power.rule}
                onChange={(e) => handlePowerChange('rule', e.target.value)}
                placeholder="Ex: Causa 40 de dano direto. Se tirar 5 ou 6 no dado, ganha +1 turno."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>

            {/* Ícones do Poder (Estrela, Raio, Foguete, Escudo, Vida, Fogo, Gelo, Vento, Meteoro, Cristal...) */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Ícone do Poder</label>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {POWER_ICONS_LIST.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handlePowerChange('icon', item.id)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                      card.power.icon === item.id
                        ? 'bg-amber-400 text-slate-950 font-black ring-2 ring-amber-300 shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xl">{item.emoji}</span>
                    <span className="text-[10px]">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* TAB 3: ILUSTRAÇÃO                                                       */}
        {/* ----------------------------------------------------------------------- */}
        {activeTab === 'illustration' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h3 className="text-sm font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-amber-400" />
              Ilustração Central & Ajustes 3D
            </h3>

            {/* Upload & Remove */}
            <div className="flex flex-wrap items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 active:scale-95 shadow transition-all"
              >
                <Upload className="w-4 h-4" />
                <span>Upload de Imagem</span>
              </button>

              {card.illustrationUrl && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="bg-rose-950 hover:bg-rose-900 border border-rose-700 text-rose-300 font-bold text-xs px-3 py-2.5 rounded-xl flex items-center gap-1.5 active:scale-95"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Remover Imagem</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleResetTransform}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs px-3 py-2.5 rounded-xl flex items-center gap-1.5 border border-slate-700 active:scale-95"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Centralizar & Resetar</span>
              </button>
            </div>

            {/* Presets de Ilustrações 3D Prontas */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Ou Escolha uma Ilustração 3D Pronta:
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {PRESET_ARTWORKS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleTextChange('illustrationUrl', preset.svgDataUri)}
                    className={`relative p-1 rounded-xl border overflow-hidden aspect-square bg-slate-950 transition-all ${
                      card.illustrationUrl === preset.svgDataUri
                        ? 'border-amber-400 ring-2 ring-amber-400'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                    title={preset.name}
                  >
                    <img src={preset.svgDataUri} alt={preset.name} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders & Controles: Posição Manual (Subir/Descer), Zoom, Girar, Espelhar */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-4">
              
              {/* POSICIONAMENTO MANUAL: SUBIR / DESCER & ESQUERDA / DIREITA */}
              <div className="p-3 bg-slate-900/90 rounded-xl border border-amber-400/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Move className="w-4 h-4 text-amber-400" />
                    Posicionamento Manual da Imagem
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateCard({
                        ...card,
                        illustrationTransform: {
                          ...card.illustrationTransform,
                          offsetX: 0,
                          offsetY: 0,
                        },
                      });
                    }}
                    className="text-[10px] font-bold text-slate-400 hover:text-amber-300 flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700 active:scale-95 transition-all"
                  >
                    <Target className="w-3 h-3 text-amber-400" />
                    <span>Zerar Posição (0,0)</span>
                  </button>
                </div>

                {/* D-Pad Direcional Rápido & Presets de Alinhamento */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center pt-1">
                  {/* D-Pad */}
                  <div className="flex flex-col items-center justify-center bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 mb-1.5 flex items-center gap-1">
                      Controle Direcional Rápido
                    </span>
                    <div className="grid grid-cols-3 gap-1 w-32">
                      <div />
                      <button
                        type="button"
                        title="Subir Imagem (-5%)"
                        onClick={() =>
                          handleTransformChange('offsetY', Math.max(-80, (card.illustrationTransform.offsetY || 0) - 5))
                        }
                        className="bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-white font-bold p-2 rounded-lg border border-slate-700 flex items-center justify-center active:scale-90 transition-all shadow"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <div />

                      <button
                        type="button"
                        title="Mover para Esquerda (-5%)"
                        onClick={() =>
                          handleTransformChange('offsetX', Math.max(-80, (card.illustrationTransform.offsetX || 0) - 5))
                        }
                        className="bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-white font-bold p-2 rounded-lg border border-slate-700 flex items-center justify-center active:scale-90 transition-all shadow"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        title="Centralizar no Meio"
                        onClick={() => {
                          onUpdateCard({
                            ...card,
                            illustrationTransform: {
                              ...card.illustrationTransform,
                              offsetX: 0,
                              offsetY: 0,
                            },
                          });
                        }}
                        className="bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-slate-950 font-bold p-2 rounded-lg border border-amber-400/40 flex items-center justify-center active:scale-90 transition-all"
                      >
                        <Target className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        title="Mover para Direita (+5%)"
                        onClick={() =>
                          handleTransformChange('offsetX', Math.min(80, (card.illustrationTransform.offsetX || 0) + 5))
                        }
                        className="bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-white font-bold p-2 rounded-lg border border-slate-700 flex items-center justify-center active:scale-90 transition-all shadow"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <div />
                      <button
                        type="button"
                        title="Descer Imagem (+5%)"
                        onClick={() =>
                          handleTransformChange('offsetY', Math.min(80, (card.illustrationTransform.offsetY || 0) + 5))
                        }
                        className="bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-white font-bold p-2 rounded-lg border border-slate-700 flex items-center justify-center active:scale-90 transition-all shadow"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <div />
                    </div>
                  </div>

                  {/* Atalhos de Encaixe Vertical */}
                  <div className="flex flex-col justify-between h-full bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400">Atalhos de Posição Vertical:</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleTransformChange('offsetY', -20)}
                        className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all ${
                          (card.illustrationTransform.offsetY || 0) === -20
                            ? 'bg-amber-400 text-slate-950 font-black'
                            : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        ⬆️ Topo
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTransformChange('offsetY', 0)}
                        className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all ${
                          (card.illustrationTransform.offsetY || 0) === 0
                            ? 'bg-amber-400 text-slate-950 font-black'
                            : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        🎯 Centro
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTransformChange('offsetY', 20)}
                        className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all ${
                          (card.illustrationTransform.offsetY || 0) === 20
                            ? 'bg-amber-400 text-slate-950 font-black'
                            : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        ⬇️ Base
                      </button>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono text-center bg-slate-900 py-1 rounded border border-slate-800">
                      Posição Atual: <span className="text-amber-300 font-bold">X: {card.illustrationTransform.offsetX || 0}%</span> | <span className="text-amber-300 font-bold">Y: {card.illustrationTransform.offsetY || 0}%</span>
                    </div>
                  </div>
                </div>

                {/* Slider Posição Vertical (Subir e Descer) */}
                <div>
                  <div className="flex justify-between items-center text-xs font-bold text-slate-300 mb-1">
                    <span className="flex items-center gap-1 text-amber-300">
                      <ArrowUp className="w-3.5 h-3.5" />
                      <ArrowDown className="w-3.5 h-3.5" />
                      Subir / Descer Imagem (Posição Vertical Y)
                    </span>
                    <span className="text-amber-400 font-mono font-bold">
                      {(card.illustrationTransform.offsetY || 0) > 0 ? `+${card.illustrationTransform.offsetY}% (Baixo)` : (card.illustrationTransform.offsetY || 0) < 0 ? `${card.illustrationTransform.offsetY}% (Cima)` : '0% (Centro)'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleTransformChange('offsetY', Math.max(-80, (card.illustrationTransform.offsetY || 0) - 2))}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-black px-2.5 py-1 rounded border border-slate-700 active:scale-95"
                    >
                      ⬆️ Subir
                    </button>
                    <input
                      type="range"
                      min="-80"
                      max="80"
                      step="1"
                      value={card.illustrationTransform.offsetY || 0}
                      onChange={(e) => handleTransformChange('offsetY', parseInt(e.target.value))}
                      className="flex-1 accent-amber-400 cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={() => handleTransformChange('offsetY', Math.min(80, (card.illustrationTransform.offsetY || 0) + 2))}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-black px-2.5 py-1 rounded border border-slate-700 active:scale-95"
                    >
                      ⬇️ Descer
                    </button>
                  </div>
                </div>

                {/* Slider Posição Horizontal (Esquerda e Direita) */}
                <div>
                  <div className="flex justify-between items-center text-xs font-bold text-slate-300 mb-1">
                    <span className="flex items-center gap-1 text-slate-300">
                      <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
                      <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                      Mover para os Lados (Posição Horizontal X)
                    </span>
                    <span className="text-amber-400 font-mono font-bold">
                      {(card.illustrationTransform.offsetX || 0) > 0 ? `+${card.illustrationTransform.offsetX}% (Direita)` : (card.illustrationTransform.offsetX || 0) < 0 ? `${card.illustrationTransform.offsetX}% (Esquerda)` : '0% (Centro)'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleTransformChange('offsetX', Math.max(-80, (card.illustrationTransform.offsetX || 0) - 2))}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-black px-2.5 py-1 rounded border border-slate-700 active:scale-95"
                    >
                      ⬅️ Esq.
                    </button>
                    <input
                      type="range"
                      min="-80"
                      max="80"
                      step="1"
                      value={card.illustrationTransform.offsetX || 0}
                      onChange={(e) => handleTransformChange('offsetX', parseInt(e.target.value))}
                      className="flex-1 accent-amber-400 cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={() => handleTransformChange('offsetX', Math.min(80, (card.illustrationTransform.offsetX || 0) + 2))}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-black px-2.5 py-1 rounded border border-slate-700 active:scale-95"
                    >
                      Dir. ➡️
                    </button>
                  </div>
                </div>
              </div>

              {/* Zoom */}
              <div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-300 mb-1">
                  <span className="flex items-center gap-1">
                    <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
                    Zoom da Imagem
                  </span>
                  <span className="text-amber-400 font-mono">
                    {Math.round(card.illustrationTransform.zoom * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.05"
                  value={card.illustrationTransform.zoom}
                  onChange={(e) => handleTransformChange('zoom', parseFloat(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              {/* Girar */}
              <div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-300 mb-1">
                  <span className="flex items-center gap-1">
                    <RotateCw className="w-3.5 h-3.5 text-amber-400" />
                    Girar Imagem
                  </span>
                  <span className="text-amber-400 font-mono">{card.illustrationTransform.rotation}°</span>
                </div>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="5"
                  value={card.illustrationTransform.rotation}
                  onChange={(e) => handleTransformChange('rotation', parseInt(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              {/* Espelhar */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() =>
                    handleTransformChange('flipHorizontal', !card.illustrationTransform.flipHorizontal)
                  }
                  className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    card.illustrationTransform.flipHorizontal
                      ? 'bg-amber-400 text-slate-950 font-black'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <FlipHorizontal className="w-4 h-4" />
                  <span>Espelhar Horizontal</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleTransformChange('flipVertical', !card.illustrationTransform.flipVertical)
                  }
                  className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    card.illustrationTransform.flipVertical
                      ? 'bg-amber-400 text-slate-950 font-black'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <FlipVertical className="w-4 h-4" />
                  <span>Espelhar Vertical</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* TAB 4: ATRIBUTOS HP/ATQ (Combate)                                       */}
        {/* ----------------------------------------------------------------------- */}
        {activeTab === 'combat' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h3 className="text-sm font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-400" />
              Atributos de Combate para Tabuleiro & Batalha
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-rose-300 mb-1">❤️ Pontos de Vida (HP)</label>
                <input
                  type="number"
                  min="10"
                  max="999"
                  value={card.stats.hp}
                  onChange={(e) => handleStatsChange('hp', parseInt(e.target.value) || 100)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-rose-300 font-bold focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-300 mb-1">⚔️ Poder de Ataque</label>
                <input
                  type="number"
                  min="0"
                  max="999"
                  value={card.stats.attack}
                  onChange={(e) => handleStatsChange('attack', parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-amber-300 font-bold focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-sky-300 mb-1">🛡️ Pontos de Defesa</label>
                <input
                  type="number"
                  min="0"
                  max="999"
                  value={card.stats.defense}
                  onChange={(e) => handleStatsChange('defense', parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-sky-300 font-bold focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-300 mb-1">⚡ Velocidade / Agilidade</label>
                <input
                  type="number"
                  min="0"
                  max="999"
                  value={card.stats.speed}
                  onChange={(e) => handleStatsChange('speed', parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-emerald-300 font-bold focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-300 mb-1">🔮 Pontos de Energia</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={card.stats.energy}
                  onChange={(e) => handleStatsChange('energy', parseInt(e.target.value) || 3)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-purple-300 font-bold focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>

            {/* Direct shortcut to Play with Friends */}
            <div className="bg-gradient-to-r from-rose-950/60 to-purple-950/60 border border-rose-500/40 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <h4 className="font-heading font-bold text-xs text-white flex items-center gap-1.5">
                  <Swords className="w-4 h-4 text-amber-400" />
                  Duelo Interativo com Amigos
                </h4>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Teste o card no modo arena ou baixe o arquivo web jogável com controle de vida!
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveView('battle')}
                className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-black px-4 py-2 rounded-xl shadow active:scale-95 whitespace-nowrap"
              >
                Abrir Arena 1v1
              </button>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* TAB 5: FRENTE & VERSO                                                   */}
        {/* ----------------------------------------------------------------------- */}
        {activeTab === 'backside' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h3 className="text-sm font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Repeat className="w-4 h-4 text-amber-400" />
              Configuração do Verso do Card
            </h3>

            {/* Checkbox: Criar verso automaticamente */}
            <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <input
                id="autoBack"
                type="checkbox"
                checked={card.backConfig.autoGenerate}
                onChange={(e) => handleBackConfigChange('autoGenerate', e.target.checked)}
                className="w-5 h-5 accent-amber-400 rounded cursor-pointer"
              />
              <label htmlFor="autoBack" className="text-xs font-bold text-slate-200 cursor-pointer">
                Criar verso automaticamente (com logo, escudo do herói e tema integrado)
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Logo do Jogo (Verso)</label>
                <input
                  type="text"
                  value={card.backConfig.gameLogoText}
                  onChange={(e) => handleBackConfigChange('gameLogoText', e.target.value)}
                  placeholder="CARD FORGE 3D"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Nome no Verso</label>
                <input
                  type="text"
                  value={card.backConfig.characterName || card.heroName}
                  onChange={(e) => handleBackConfigChange('characterName', e.target.value)}
                  placeholder={card.heroName}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Frase de Efeito / Citação</label>
              <input
                type="text"
                value={card.backConfig.customQuote}
                onChange={(e) => handleBackConfigChange('customQuote', e.target.value)}
                placeholder="Ex: Pela justiça do universo!"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Cor de fundo do Verso */}
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-300 mb-1">Fundo Temático do Verso</label>
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-700 rounded-xl p-1.5">
                  <input
                    type="color"
                    value={card.backConfig.themeBackground}
                    onChange={(e) => handleBackConfigChange('themeBackground', e.target.value)}
                    className="w-9 h-9 rounded-lg border-0 cursor-pointer bg-transparent"
                  />
                  <span className="text-xs font-mono text-slate-300">{card.backConfig.themeBackground}</span>
                </div>
              </div>

              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-300 mb-1">Escudo do Herói (Verso)</label>
                <select
                  value={card.backConfig.heroShieldIcon}
                  onChange={(e) => handleBackConfigChange('heroShieldIcon', e.target.value as PowerIconType)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-amber-400"
                >
                  {POWER_ICONS_LIST.map((ic) => (
                    <option key={ic.id} value={ic.id}>
                      {ic.emoji} {ic.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Action Save Footer */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              className="bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-black text-xs px-5 py-3 rounded-2xl shadow-lg flex items-center gap-2 active:scale-95 transition-all"
            >
              {saveSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{saveSuccess ? 'Card Salvo com Sucesso!' : 'Salvar Alterações'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleTextChange('enableFoil', !card.enableFoil)}
              className={`text-xs font-bold px-3.5 py-3 rounded-2xl border transition-all ${
                card.enableFoil
                  ? 'bg-amber-400/20 border-amber-400 text-amber-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              ✨ Brilho Holográfico: {card.enableFoil ? 'LIGADO' : 'DESLIGADO'}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setActiveView('gallery')}
            className="text-xs text-slate-400 hover:text-amber-400 font-bold"
          >
            Ver na Galeria →
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. PRÉ-VISUALIZAÇÃO 3D EM TEMPO REAL (Right Preview Area)                 */}
      {/* ========================================================================= */}
      <div className="lg:col-span-5 flex flex-col items-center">
        <div className="sticky top-20 w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col items-center space-y-4">
          {/* Header */}
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-amber-400" />
              <span className="font-heading font-bold text-xs uppercase tracking-wider text-white">
                Pré-Visualização 3D (63x88 mm)
              </span>
            </div>
            <span className="text-[10px] bg-slate-950 text-slate-400 px-2 py-0.5 rounded-full border border-slate-800">
              {isFlipped ? 'VERSO' : 'FRENTE'}
            </span>
          </div>

          {/* Interactive Card Stage */}
          <div className="relative py-2 perspective-1000 flex items-center justify-center">
            <div ref={cardPreviewRef}>
              <CardView
                card={card}
                isBackSide={isFlipped}
                interactiveTilt={interactiveTilt}
                showHoloFoil={card.enableFoil}
              />
            </div>
          </div>

          {/* Botão de Virar Card (Frente / Verso) */}
          <div className="w-full flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsFlipped(!isFlipped)}
              className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black py-3 rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all text-xs"
            >
              <Repeat className="w-4 h-4 text-slate-950" />
              <span>Virar Card ({isFlipped ? 'Ver Frente' : 'Ver Verso'})</span>
            </button>

            <button
              type="button"
              onClick={() => setInteractiveTilt(!interactiveTilt)}
              className={`p-3 rounded-2xl border transition-all ${
                interactiveTilt
                  ? 'bg-blue-600/30 border-blue-400 text-blue-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
              title="Alternar Tilt 3D"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Export Bar for this Card (PNG, JPG, Standalone Web Card, PDF) */}
          <div className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl p-3 space-y-2">
            <div className="flex justify-between items-center text-[11px] font-bold text-slate-300">
              <span>Exportar Card Instantâneo:</span>
              <span className="text-[10px] text-amber-400">300 DPI</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={handleQuickPng}
                disabled={isExporting}
                className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs py-2 rounded-xl active:scale-95 transition-all"
              >
                PNG HD
              </button>
              <button
                type="button"
                onClick={handleQuickJpg}
                disabled={isExporting}
                className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs py-2 rounded-xl active:scale-95 transition-all"
              >
                JPG 100%
              </button>
              <button
                type="button"
                onClick={() => setActiveView('print')}
                className="bg-gradient-to-r from-emerald-600 to-green-600 text-white font-black text-xs py-2 rounded-xl active:scale-95 shadow"
              >
                PDF A4 Folha
              </button>
            </div>

            {/* Special Download: Interactive Playable Web Card for PC and Android */}
            <div className="space-y-1.5 pt-1">
              <button
                type="button"
                onClick={handleDownloadZip}
                disabled={isExporting}
                className="w-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs py-2.5 rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all border border-amber-300/50 disabled:opacity-50"
              >
                <Package className="w-4 h-4 text-slate-950" />
                <span>📦 Baixar Pacote Completo do Card (.ZIP)</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadInteractiveWebCard}
                className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-black text-xs py-2 rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all border border-purple-400/30"
              >
                <Globe className="w-3.5 h-3.5 text-yellow-300" />
                <span>Baixar Card HTML Interativo (.html)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
