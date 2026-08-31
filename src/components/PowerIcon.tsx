import React from 'react';
import {
  Star,
  Zap,
  Rocket,
  Shield,
  Heart,
  Flame,
  Snowflake,
  Wind,
  Sparkles,
  Gem,
  Swords,
  Crown,
} from 'lucide-react';
import { PowerIconType } from '../types';

interface PowerIconProps {
  icon: PowerIconType;
  className?: string;
  size?: number;
}

export const POWER_ICONS_LIST: { id: PowerIconType; label: string; emoji: string }[] = [
  { id: 'star', label: 'Estrela', emoji: '⭐' },
  { id: 'lightning', label: 'Raio', emoji: '⚡' },
  { id: 'rocket', label: 'Foguete', emoji: '🚀' },
  { id: 'shield', label: 'Escudo', emoji: '🛡' },
  { id: 'heart', label: 'Vida', emoji: '❤️' },
  { id: 'fire', label: 'Fogo', emoji: '🔥' },
  { id: 'ice', label: 'Gelo', emoji: '❄' },
  { id: 'wind', label: 'Vento', emoji: '🌪' },
  { id: 'meteor', label: 'Meteoro', emoji: '☄' },
  { id: 'crystal', label: 'Cristal', emoji: '💎' },
  { id: 'sword', label: 'Espada', emoji: '⚔' },
  { id: 'crown', label: 'Coroa', emoji: '👑' },
];

export const PowerIcon: React.FC<PowerIconProps> = ({ icon, className = 'w-5 h-5', size }) => {
  switch (icon) {
    case 'star':
      return <Star className={className} size={size} />;
    case 'lightning':
      return <Zap className={className} size={size} />;
    case 'rocket':
      return <Rocket className={className} size={size} />;
    case 'shield':
      return <Shield className={className} size={size} />;
    case 'heart':
      return <Heart className={className} size={size} />;
    case 'fire':
      return <Flame className={className} size={size} />;
    case 'ice':
      return <Snowflake className={className} size={size} />;
    case 'wind':
      return <Wind className={className} size={size} />;
    case 'meteor':
      return <Sparkles className={className} size={size} />;
    case 'crystal':
      return <Gem className={className} size={size} />;
    case 'sword':
      return <Swords className={className} size={size} />;
    case 'crown':
      return <Crown className={className} size={size} />;
    default:
      return <Star className={className} size={size} />;
  }
};
