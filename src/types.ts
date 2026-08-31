export type PowerIconType =
  | 'star' // ⭐ Estrela
  | 'lightning' // ⚡ Raio
  | 'rocket' // 🚀 Foguete
  | 'shield' // 🛡 Escudo
  | 'heart' // ❤️ Vida
  | 'fire' // 🔥 Fogo
  | 'ice' // ❄ Gelo
  | 'wind' // 🌪 Vento
  | 'meteor' // ☄ Meteoro
  | 'crystal' // 💎 Cristal
  | 'sword'
  | 'crown';

export type CardRarity = 'Comum' | 'Raro' | 'Épico' | 'Lendário' | 'Mítico';

export type FrameStyle = 'gold' | 'cyber' | 'cosmic' | 'crystal' | 'fire' | 'nature' | 'dark';

export interface ImageTransform {
  zoom: number; // 0.5 to 3
  rotation: number; // 0, 90, 180, 270 or continuous -180 to 180
  flipHorizontal: boolean;
  flipVertical: boolean;
  offsetX: number; // in percent
  offsetY: number; // in percent
}

export interface PowerData {
  name: string;
  description: string;
  rule: string;
  usageLimit: string; // Ex: "1x por rodada", "Passivo", "Custa 2 Energias"
  icon: PowerIconType;
}

export interface BattleStats {
  hp: number; // Pontos de Vida (ex: 100)
  maxHp: number;
  attack: number; // Poder de Ataque (ex: 80)
  defense: number; // Escudo / Defesa (ex: 60)
  speed: number; // Velocidade / Iniciativa (ex: 75)
  energy: number; // Pontos de Ação
}

export interface CardBackConfig {
  autoGenerate: boolean;
  gameLogoText: string;
  characterName: string;
  themeBackground: string;
  heroShieldIcon: PowerIconType;
  customQuote: string;
  showQrCode: boolean;
  simplifiedArtUrl?: string;
}

export interface CardData {
  id: string;
  createdAt: number;
  updatedAt: number;
  isFavorite?: boolean;
  templateCategory: string; // 'superhero' | 'mage' | 'knight' | 'robot' | 'dino' | 'pirate' | 'princess' | 'dragon' | 'custom'

  // Personagem
  heroName: string;
  subtitle: string;
  rarity: CardRarity;
  primaryColor: string; // Hex or gradient
  secondaryColor: string;
  accentColor: string;
  frameStyle: FrameStyle;

  // Ilustração
  illustrationUrl: string;
  illustrationTransform: ImageTransform;

  // Poder
  power: PowerData;

  // Atributos de Combate Interativo
  stats: BattleStats;

  // Verso do Card
  backConfig: CardBackConfig;

  // Efeitos visuais
  enableFoil: boolean;
}

export interface TemplatePreset {
  id: string;
  name: string;
  category: string;
  description: string;
  thumbnail: string;
  cardData: Partial<CardData>;
}

export type ActiveView = 'home' | 'editor' | 'templates' | 'gallery' | 'battle' | 'print' | 'settings';

export interface AppSettings {
  language: 'pt-BR' | 'en-US' | 'es-ES';
  theme: 'dark' | 'light' | 'neon';
  unit: 'mm' | 'in';
  exportScale: 1 | 2 | 4; // 1x standard, 2x high, 4x ultra 300 DPI
  defaultBackground: string;
  soundEffects: boolean;
  holographicPreview: boolean;
}

export interface PrintSettings {
  cardsPerPage: 1 | 2 | 4 | 8 | 9;
  includeBacksides: boolean;
  showCutLines: boolean;
  marginMm: number;
  duplexAlignment: boolean;
}
