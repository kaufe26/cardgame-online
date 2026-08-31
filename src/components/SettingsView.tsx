import React, { useState } from 'react';
import { AppSettings, ActiveView } from '../types';
import { StorageService } from '../services/storage';
import {
  Settings,
  Globe,
  SunMoon,
  Sparkles,
  Printer,
  Volume2,
  Download,
  Smartphone,
  Monitor,
  Check,
  ShieldCheck,
} from 'lucide-react';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  setActiveView: (view: ActiveView) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  setActiveView,
}) => {
  const [savedToast, setSavedToast] = useState<boolean>(false);

  const handleChange = (key: keyof AppSettings, value: any) => {
    const updated = { ...settings, [key]: value };
    onUpdateSettings(updated);
    StorageService.saveSettings(updated);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="inline-flex items-center gap-1.5 bg-slate-800 text-slate-300 text-xs font-bold px-3 py-1 rounded-full mb-1 border border-slate-700">
          <Settings className="w-3.5 h-3.5 text-amber-400" />
          Preferências Globais
        </div>
        <h1 className="font-display text-2xl sm:text-3xl text-white">Configurações do Aplicativo</h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Personalize idioma, resolução de exportação para impressão e recursos PWA offline.
        </p>
      </div>

      {savedToast && (
        <div className="bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs font-bold px-4 py-3 rounded-2xl flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>Configurações salvas automaticamente!</span>
        </div>
      )}

      {/* Settings Grid */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        {/* 1. Idioma */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-400" />
              Idioma da Interface
            </h3>
            <p className="text-xs text-slate-400">Escolha o idioma principal do gerador de cards</p>
          </div>
          <select
            value={settings.language}
            onChange={(e) => handleChange('language', e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs font-bold rounded-xl px-4 py-2.5 focus:outline-none focus:border-amber-400"
          >
            <option value="pt-BR">Português (Brasil)</option>
            <option value="en-US">English (US)</option>
            <option value="es-ES">Español</option>
          </select>
        </div>

        {/* 2. Tema */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
              <SunMoon className="w-4 h-4 text-purple-400" />
              Tema Visual
            </h3>
            <p className="text-xs text-slate-400">Estilo de cores da interface do estúdio</p>
          </div>
          <div className="flex items-center gap-2">
            {[
              { id: 'dark', label: 'Dark Cósmico' },
              { id: 'neon', label: 'Neon Kids 3D' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => handleChange('theme', t.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  settings.theme === t.id
                    ? 'bg-amber-400 text-slate-950 font-black'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Qualidade de Exportação (300 DPI) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
              <Printer className="w-4 h-4 text-emerald-400" />
              Qualidade de Renderização & Impressão
            </h3>
            <p className="text-xs text-slate-400">Resolução usada nas exportações PNG, JPG e PDF</p>
          </div>
          <select
            value={settings.exportScale}
            onChange={(e) => handleChange('exportScale', parseInt(e.target.value))}
            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs font-bold rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-400"
          >
            <option value={1}>Padrão (1x)</option>
            <option value={2}>Alta Definição (2x)</option>
            <option value={4}>Ultra Qualidade 300 DPI (4x Gráfica)</option>
          </select>
        </div>

        {/* 4. Unidade Padrão */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <h3 className="font-heading font-bold text-sm text-white">Unidade de Medida</h3>
            <p className="text-xs text-slate-400">Padrão TCG internacional: 63 x 88 mm</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleChange('unit', 'mm')}
              className={`px-4 py-2 rounded-xl text-xs font-bold ${
                settings.unit === 'mm'
                  ? 'bg-amber-400 text-slate-950 font-black'
                  : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
            >
              Milímetros (mm)
            </button>
            <button
              type="button"
              onClick={() => handleChange('unit', 'in')}
              className={`px-4 py-2 rounded-xl text-xs font-bold ${
                settings.unit === 'in'
                  ? 'bg-amber-400 text-slate-950 font-black'
                  : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
            >
              Polegadas (in)
            </button>
          </div>
        </div>

        {/* 5. Efeitos Visuais Holográficos */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Efeitos de Brilho Foil 3D
            </h3>
            <p className="text-xs text-slate-400">Exibir animação cintilante holográfica nos cards</p>
          </div>
          <input
            type="checkbox"
            checked={settings.holographicPreview}
            onChange={(e) => handleChange('holographicPreview', e.target.checked)}
            className="w-5 h-5 accent-amber-400 rounded cursor-pointer"
          >
          </input>
        </div>
      </div>

      {/* PWA Information & Installation Guide */}
      <div className="bg-gradient-to-br from-indigo-950/80 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-400 flex items-center justify-center text-indigo-300">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-base text-white">
              Status PWA (Progressive Web App)
            </h3>
            <p className="text-xs text-slate-300">
              Instalável no Windows, Android, Tablet e Navegador • Funciona 100% Offline
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
          <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 flex items-center gap-2">
            <Monitor className="w-4 h-4 text-sky-400" />
            <div>
              <span className="font-bold block text-white">Windows / PC</span>
              <span>Instalar via Chrome ou Edge</span>
            </div>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="font-bold block text-white">Android & Tablet</span>
              <span>Adicionar à tela de início</span>
            </div>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <div>
              <span className="font-bold block text-white">Modo Offline</span>
              <span>Service Worker Ativo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
