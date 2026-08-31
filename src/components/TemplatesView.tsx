import React, { useState } from 'react';
import { TemplatePreset, CardData, ActiveView } from '../types';
import { DEFAULT_TEMPLATES } from '../data/templates';
import { CardView } from './CardView';
import { LayoutGrid, Sparkles, Swords, Zap, Check, ArrowRight } from 'lucide-react';

interface TemplatesViewProps {
  onApplyTemplate: (template: TemplatePreset) => void;
  setActiveView: (view: ActiveView) => void;
}

export const TemplatesView: React.FC<TemplatesViewProps> = ({
  onApplyTemplate,
  setActiveView,
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(DEFAULT_TEMPLATES[0].id);

  const selectedTemplate =
    DEFAULT_TEMPLATES.find((t) => t.id === selectedTemplateId) || DEFAULT_TEMPLATES[0];

  const handleUseTemplate = (template: TemplatePreset) => {
    onApplyTemplate(template);
    setActiveView('editor');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full mb-1 border border-amber-400/30">
            <LayoutGrid className="w-3.5 h-3.5" />
            Modelos 3D Prontos
          </div>
          <h1 className="font-display text-2xl sm:text-3xl text-white">Galeria de Templates</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Escolha um arquétipo temático pronto e personalize todos os detalhes no estúdio 3D.
          </p>
        </div>
      </div>

      {/* Grid of Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {DEFAULT_TEMPLATES.map((template) => {
          const isSelected = selectedTemplateId === template.id;
          const dummyCard = template.cardData as CardData;

          return (
            <div
              key={template.id}
              onClick={() => setSelectedTemplateId(template.id)}
              className={`bg-slate-900/90 rounded-3xl p-4 border-2 transition-all flex flex-col justify-between cursor-pointer group shadow-xl ${
                isSelected
                  ? 'border-amber-400 ring-2 ring-amber-400/30 bg-slate-900 scale-102'
                  : 'border-slate-800 hover:border-slate-700 hover:-translate-y-1'
              }`}
            >
              {/* Card Mini Preview */}
              <div className="flex justify-center py-2">
                <div className="transform group-hover:scale-105 transition-transform duration-300">
                  <CardView card={dummyCard} interactiveTilt={false} showHoloFoil={dummyCard.enableFoil} />
                </div>
              </div>

              {/* Template Info & Action */}
              <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-black text-sm text-white">{template.name}</h3>
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-400/30">
                    {dummyCard.rarity}
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2">{template.description}</p>

                <div className="flex items-center justify-between text-[11px] text-slate-300 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800">
                  <span>HP: {dummyCard.stats?.hp}</span>
                  <span>ATQ: {dummyCard.stats?.attack}</span>
                  <span>DEF: {dummyCard.stats?.defense}</span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUseTemplate(template);
                  }}
                  className="w-full mt-2 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs py-2.5 rounded-xl shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Usar Este Template</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
