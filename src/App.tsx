import React, { useState, useEffect } from 'react';
import { CardData, ActiveView, TemplatePreset, AppSettings } from './types';
import { StorageService, DEFAULT_SETTINGS } from './services/storage';
import { DEFAULT_TEMPLATES, createNewCardFromTemplate } from './data/templates';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { EditorView } from './components/EditorView';
import { TemplatesView } from './components/TemplatesView';
import { GalleryView } from './components/GalleryView';
import { BattleArenaView } from './components/BattleArenaView';
import { PrintExportView } from './components/PrintExportView';
import { SettingsView } from './components/SettingsView';
import { PWAInstallBanner } from './components/PWAInstallBanner';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [cards, setCards] = useState<CardData[]>([]);
  const [currentEditingCard, setCurrentEditingCard] = useState<CardData>(() =>
    createNewCardFromTemplate('superhero')
  );
  const [battleFighters, setBattleFighters] = useState<{
    player?: CardData | null;
    opponent?: CardData | null;
  }>({});
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  // Load cards and settings on startup
  useEffect(() => {
    const loadedCards = StorageService.getCards();
    setCards(loadedCards);
    if (loadedCards.length > 0) {
      setCurrentEditingCard(loadedCards[0]);
    }
    const loadedSettings = StorageService.getSettings();
    setSettings(loadedSettings);
  }, []);

  const handleRefreshCards = () => {
    setCards(StorageService.getCards());
  };

  const handleSaveCard = (cardToSave: CardData) => {
    const saved = StorageService.saveCard(cardToSave);
    handleRefreshCards();
    setCurrentEditingCard(saved);
  };

  const handleSelectCardToEdit = (card: CardData) => {
    setCurrentEditingCard(card);
    setActiveView('editor');
  };

  const handleCreateNewFromTemplate = (templateId: string) => {
    const newCard = createNewCardFromTemplate(templateId);
    setCurrentEditingCard(newCard);
    StorageService.saveCard(newCard);
    handleRefreshCards();
    setActiveView('editor');
  };

  const handleApplyTemplate = (template: TemplatePreset) => {
    const newCard = createNewCardFromTemplate(template.id);
    setCurrentEditingCard(newCard);
    StorageService.saveCard(newCard);
    handleRefreshCards();
  };

  const handleSelectCardsForBattle = (playerCard: CardData, opponentCard?: CardData) => {
    setBattleFighters({
      player: playerCard,
      opponent: opponentCard || cards.find((c) => c.id !== playerCard.id) || playerCard,
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-400 selection:text-slate-950 font-sans">
      {/* Top Navbar */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        cardsCount={cards.length}
      />

      {/* Main Dynamic View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 pt-6">
        {activeView === 'home' && (
          <HomeView
            setActiveView={setActiveView}
            cards={cards}
            onSelectCardToEdit={handleSelectCardToEdit}
            onCreateNewFromTemplate={handleCreateNewFromTemplate}
          />
        )}

        {activeView === 'editor' && (
          <EditorView
            card={currentEditingCard}
            onUpdateCard={setCurrentEditingCard}
            onSaveCard={handleSaveCard}
            setActiveView={setActiveView}
          />
        )}

        {activeView === 'templates' && (
          <TemplatesView
            onApplyTemplate={handleApplyTemplate}
            setActiveView={setActiveView}
          />
        )}

        {activeView === 'gallery' && (
          <GalleryView
            cards={cards}
            onSelectCardToEdit={handleSelectCardToEdit}
            onSelectCardsForBattle={handleSelectCardsForBattle}
            onRefreshCards={handleRefreshCards}
            setActiveView={setActiveView}
          />
        )}

        {activeView === 'battle' && (
          <BattleArenaView
            cards={cards}
            initialPlayerCard={battleFighters.player || currentEditingCard || cards[0]}
            initialOpponentCard={battleFighters.opponent || cards[1] || cards[0]}
            setActiveView={setActiveView}
          />
        )}

        {activeView === 'print' && (
          <PrintExportView
            cards={cards}
            selectedCard={currentEditingCard}
            setActiveView={setActiveView}
          />
        )}

        {activeView === 'settings' && (
          <SettingsView
            settings={settings}
            onUpdateSettings={setSettings}
            setActiveView={setActiveView}
          />
        )}
      </main>

      {/* PWA Floating Install Prompt */}
      <PWAInstallBanner />
    </div>
  );
}
