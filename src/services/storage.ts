import { CardData, AppSettings } from '../types';
import { DEFAULT_TEMPLATES, createNewCardFromTemplate } from '../data/templates';

const CARDS_STORAGE_KEY = 'card_forge_kids_3d_cards';
const SETTINGS_STORAGE_KEY = 'card_forge_kids_3d_settings';

export const DEFAULT_SETTINGS: AppSettings = {
  language: 'pt-BR',
  theme: 'dark',
  unit: 'mm',
  exportScale: 4, // 4x = 300 DPI high resolution
  defaultBackground: '#090d16',
  soundEffects: true,
  holographicPreview: true,
};

export const StorageService = {
  getCards(): CardData[] {
    try {
      const data = localStorage.getItem(CARDS_STORAGE_KEY);
      if (!data) {
        // Initialize with default sample cards based on templates
        const initialCards: CardData[] = [
          createNewCardFromTemplate('superhero'),
          createNewCardFromTemplate('mage'),
          createNewCardFromTemplate('dragon'),
          createNewCardFromTemplate('robot'),
        ];
        initialCards[0].isFavorite = true;
        this.saveCards(initialCards);
        return initialCards;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Error loading cards from storage', e);
      return [];
    }
  },

  saveCards(cards: CardData[]): void {
    try {
      localStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(cards));
    } catch (e) {
      console.error('Error saving cards to storage', e);
    }
  },

  getCardById(id: string): CardData | undefined {
    const cards = this.getCards();
    return cards.find((c) => c.id === id);
  },

  saveCard(card: CardData): CardData {
    const cards = this.getCards();
    const index = cards.findIndex((c) => c.id === card.id);
    const updatedCard = { ...card, updatedAt: Date.now() };

    if (index >= 0) {
      cards[index] = updatedCard;
    } else {
      cards.unshift(updatedCard);
    }

    this.saveCards(cards);
    return updatedCard;
  },

  duplicateCard(id: string): CardData | null {
    const card = this.getCardById(id);
    if (!card) return null;

    const now = Date.now();
    const duplicated: CardData = {
      ...JSON.parse(JSON.stringify(card)),
      id: `card_${now}_${Math.random().toString(36).substring(2, 8)}`,
      heroName: `${card.heroName} (Cópia)`,
      createdAt: now,
      updatedAt: now,
      isFavorite: false,
    };

    const cards = this.getCards();
    cards.unshift(duplicated);
    this.saveCards(cards);
    return duplicated;
  },

  deleteCard(id: string): boolean {
    const cards = this.getCards();
    const filtered = cards.filter((c) => c.id !== id);
    this.saveCards(filtered);
    return true;
  },

  toggleFavorite(id: string): boolean {
    const cards = this.getCards();
    const card = cards.find((c) => c.id === id);
    if (!card) return false;
    card.isFavorite = !card.isFavorite;
    card.updatedAt = Date.now();
    this.saveCards(cards);
    return !!card.isFavorite;
  },

  getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (!data) return DEFAULT_SETTINGS;
      return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving settings', e);
    }
  },

  exportDeckAsJson(): string {
    const cards = this.getCards();
    return JSON.stringify(
      {
        version: '1.0',
        appName: 'CARD FORGE KIDS 3D',
        exportDate: new Date().toISOString(),
        cards,
      },
      null,
      2
    );
  },

  importDeckFromJson(jsonStr: string): number {
    try {
      const parsed = JSON.parse(jsonStr);
      const importedCards: CardData[] = Array.isArray(parsed)
        ? parsed
        : parsed.cards || [];
      if (!importedCards.length) return 0;

      const current = this.getCards();
      const currentIds = new Set(current.map((c) => c.id));
      let count = 0;

      for (const card of importedCards) {
        if (card.heroName) {
          if (currentIds.has(card.id)) {
            card.id = `card_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
          }
          current.unshift(card);
          count++;
        }
      }

      this.saveCards(current);
      return count;
    } catch (e) {
      console.error('Error importing deck', e);
      throw new Error('Arquivo JSON inválido.');
    }
  },
};
