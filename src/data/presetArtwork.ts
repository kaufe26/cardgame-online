export interface PresetArt {
  id: string;
  name: string;
  category: string;
  svgDataUri: string;
}

// Generate high quality SVG 3D character illustrations encoded as Data URIs
const createSvgUri = (svgContent: string): string => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent.trim())}`;
};

export const PRESET_ARTWORKS: PresetArt[] = [
  {
    id: 'superhero_boy',
    name: 'Super Menino Cósmico 3D',
    category: 'superhero',
    svgDataUri: createSvgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
        <defs>
          <radialGradient id="bgG" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stop-color="#38bdf8"/>
            <stop offset="60%" stop-color="#1e40af"/>
            <stop offset="100%" stop-color="#0f172a"/>
          </radialGradient>
          <linearGradient id="suitG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#ef4444"/>
            <stop offset="50%" stop-color="#dc2626"/>
            <stop offset="100%" stop-color="#991b1b"/>
          </linearGradient>
          <linearGradient id="goldG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#fde047"/>
            <stop offset="100%" stop-color="#eab308"/>
          </linearGradient>
          <filter id="soft3D">
            <feDropShadow dx="0" dy="12" stdDeviation="10" flood-color="#000000" flood-opacity="0.45"/>
          </filter>
        </defs>
        <rect width="500" height="500" rx="30" fill="url(#bgG)"/>
        <!-- Speed stars -->
        <circle cx="80" cy="90" r="4" fill="#ffffff" opacity="0.8"/>
        <circle cx="420" cy="110" r="5" fill="#fde047" opacity="0.9"/>
        <circle cx="390" cy="380" r="3" fill="#ffffff" opacity="0.6"/>
        <circle cx="90" cy="400" r="4" fill="#38bdf8" opacity="0.7"/>
        
        <!-- Cape -->
        <path d="M160 210 Q110 320 100 440 Q250 420 390 440 Q380 320 340 210 Z" fill="#2563eb" filter="url(#soft3D)"/>
        <!-- Body / Suit -->
        <path d="M180 230 Q250 200 320 230 L340 430 Q250 460 160 430 Z" fill="url(#suitG)" filter="url(#soft3D)"/>
        <!-- Belt -->
        <rect x="180" y="340" width="140" height="26" rx="8" fill="url(#goldG)"/>
        <circle cx="250" cy="353" r="18" fill="#3b82f6" stroke="#fde047" stroke-width="4"/>
        
        <!-- Head -->
        <ellipse cx="250" cy="150" rx="75" ry="80" fill="#fcd34d" filter="url(#soft3D)"/>
        <!-- Hair 3D -->
        <path d="M175 140 Q200 65 260 70 Q320 70 325 140 Q280 90 220 100 Z" fill="#78350f"/>
        <!-- Mask -->
        <path d="M180 140 Q250 160 320 140 Q310 175 250 170 Q190 175 180 140 Z" fill="#1e3a8a"/>
        <!-- Big Cute 3D Eyes -->
        <ellipse cx="215" cy="152" rx="16" ry="12" fill="#ffffff"/>
        <circle cx="215" cy="152" r="8" fill="#0f172a"/>
        <circle cx="219" cy="148" r="3" fill="#ffffff"/>
        <ellipse cx="285" cy="152" rx="16" ry="12" fill="#ffffff"/>
        <circle cx="285" cy="152" r="8" fill="#0f172a"/>
        <circle cx="289" cy="148" r="3" fill="#ffffff"/>
        <!-- Big Smile -->
        <path d="M225 190 Q250 215 275 190" stroke="#b45309" stroke-width="5" stroke-linecap="round" fill="none"/>
        <!-- Chest Emblem Star -->
        <path d="M250 250 L258 270 L280 272 L263 288 L268 310 L250 298 L232 310 L237 288 L220 272 L242 270 Z" fill="url(#goldG)" filter="url(#soft3D)"/>
      </svg>
    `)
  },
  {
    id: 'mage_girl',
    name: 'Maga Estelar dos Cristais 3D',
    category: 'mage',
    svgDataUri: createSvgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
        <defs>
          <radialGradient id="magBg" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stop-color="#9333ea"/>
            <stop offset="60%" stop-color="#4c1d95"/>
            <stop offset="100%" stop-color="#090514"/>
          </radialGradient>
          <linearGradient id="robeG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#c084fc"/>
            <stop offset="100%" stop-color="#6b21a8"/>
          </linearGradient>
          <linearGradient id="crystalG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#38bdf8"/>
            <stop offset="100%" stop-color="#0284c7"/>
          </linearGradient>
        </defs>
        <rect width="500" height="500" rx="30" fill="url(#magBg)"/>
        <!-- Magic sparks -->
        <circle cx="120" cy="150" r="8" fill="#f472b6" opacity="0.8"/>
        <circle cx="380" cy="180" r="10" fill="#38bdf8" opacity="0.9"/>
        <circle cx="100" cy="350" r="6" fill="#facc15" opacity="0.8"/>
        <!-- Robe -->
        <path d="M160 250 L250 200 L340 250 L380 450 L120 450 Z" fill="url(#robeG)"/>
        <!-- Hat -->
        <path d="M130 150 Q250 120 370 150 Q250 170 130 150 Z" fill="#581c87"/>
        <path d="M160 145 Q230 -10 320 145 Z" fill="#6b21a8"/>
        <ellipse cx="250" cy="148" rx="100" ry="16" fill="#facc15"/>
        <!-- Head -->
        <ellipse cx="250" cy="190" rx="65" ry="60" fill="#fed7aa"/>
        <!-- Hair -->
        <path d="M185 170 Q160 270 180 320" stroke="#ec4899" stroke-width="26" stroke-linecap="round" fill="none"/>
        <path d="M315 170 Q340 270 320 320" stroke="#ec4899" stroke-width="26" stroke-linecap="round" fill="none"/>
        <!-- Cute Eyes -->
        <circle cx="225" cy="190" r="12" fill="#3b0764"/>
        <circle cx="228" cy="186" r="4" fill="#ffffff"/>
        <circle cx="275" cy="190" r="12" fill="#3b0764"/>
        <circle cx="278" cy="186" r="4" fill="#ffffff"/>
        <path d="M235 220 Q250 235 265 220" stroke="#c2410c" stroke-width="4" fill="none" stroke-linecap="round"/>
        <!-- Glowing Wand Staff -->
        <rect x="340" y="160" width="18" height="260" rx="8" fill="#ca8a04"/>
        <polygon points="349,110 375,145 349,180 323,145" fill="url(#crystalG)"/>
        <circle cx="349" cy="145" r="28" fill="#38bdf8" opacity="0.35"/>
      </svg>
    `)
  },
  {
    id: 'knight_valiant',
    name: 'Cavaleiro Dourado 3D',
    category: 'knight',
    svgDataUri: createSvgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
        <defs>
          <radialGradient id="kBg" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stop-color="#475569"/>
            <stop offset="100%" stop-color="#0f172a"/>
          </radialGradient>
          <linearGradient id="silverG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#f8fafc"/>
            <stop offset="50%" stop-color="#94a3b8"/>
            <stop offset="100%" stop-color="#475569"/>
          </linearGradient>
          <linearGradient id="goldPlate" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#fef08a"/>
            <stop offset="50%" stop-color="#eab308"/>
            <stop offset="100%" stop-color="#854d0e"/>
          </linearGradient>
        </defs>
        <rect width="500" height="500" rx="30" fill="url(#kBg)"/>
        <!-- Shield on Left -->
        <path d="M80 200 Q150 180 180 220 Q180 360 120 420 Q60 360 80 200 Z" fill="url(#goldPlate)" stroke="#fef08a" stroke-width="6"/>
        <path d="M125 240 L135 340 M95 285 L155 285" stroke="#78350f" stroke-width="8" stroke-linecap="round"/>
        <!-- Armor Body -->
        <rect x="180" y="220" width="150" height="200" rx="30" fill="url(#silverG)"/>
        <rect x="200" y="240" width="110" height="80" rx="14" fill="url(#goldPlate)"/>
        <!-- Helmet with Plume -->
        <path d="M250 50 Q290 80 260 120 Z" fill="#ef4444"/>
        <ellipse cx="250" cy="160" rx="70" ry="65" fill="url(#silverG)"/>
        <rect x="200" y="145" width="100" height="24" rx="8" fill="#1e293b"/>
        <!-- Helmet Eyes glow -->
        <ellipse cx="225" cy="157" rx="14" ry="6" fill="#38bdf8"/>
        <ellipse cx="275" cy="157" rx="14" ry="6" fill="#38bdf8"/>
        <!-- Giant Sword on Right -->
        <polygon points="380,80 395,110 395,380 365,380 365,110" fill="url(#silverG)" stroke="#38bdf8" stroke-width="3"/>
        <rect x="350" y="380" width="60" height="16" rx="6" fill="url(#goldPlate)"/>
        <rect x="372" y="396" width="16" height="40" rx="4" fill="#78350f"/>
      </svg>
    `)
  },
  {
    id: 'robot_turbo',
    name: 'Robô Turbo-3000 3D',
    category: 'robot',
    svgDataUri: createSvgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
        <defs>
          <radialGradient id="botBg" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stop-color="#0284c7"/>
            <stop offset="60%" stop-color="#0f172a"/>
            <stop offset="100%" stop-color="#020617"/>
          </radialGradient>
          <linearGradient id="cyberG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#38bdf8"/>
            <stop offset="50%" stop-color="#0284c7"/>
            <stop offset="100%" stop-color="#0369a1"/>
          </linearGradient>
          <linearGradient id="orangeG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#fb923c"/>
            <stop offset="100%" stop-color="#ea580c"/>
          </linearGradient>
        </defs>
        <rect width="500" height="500" rx="30" fill="url(#botBg)"/>
        <!-- Grid lines -->
        <line x1="50" y1="250" x2="450" y2="250" stroke="#0ea5e9" stroke-width="1" opacity="0.3"/>
        <line x1="250" y1="50" x2="250" y2="450" stroke="#0ea5e9" stroke-width="1" opacity="0.3"/>
        <!-- Antenna -->
        <rect x="242" y="70" width="16" height="40" rx="6" fill="#94a3b8"/>
        <circle cx="250" cy="65" r="16" fill="#f43f5e"/>
        <circle cx="250" cy="65" r="8" fill="#ffe4e6"/>
        <!-- Head Box Rounded -->
        <rect x="160" y="110" width="180" height="140" rx="36" fill="url(#cyberG)" stroke="#e0f2fe" stroke-width="6"/>
        <!-- Screen Visor -->
        <rect x="180" y="135" width="140" height="70" rx="20" fill="#0f172a"/>
        <!-- Digital Pixel Eyes -->
        <circle cx="215" cy="170" r="14" fill="#22c55e"/>
        <circle cx="285" cy="170" r="14" fill="#22c55e"/>
        <!-- Chest Body -->
        <rect x="150" y="270" width="200" height="170" rx="34" fill="url(#orangeG)" stroke="#fed7aa" stroke-width="6"/>
        <circle cx="250" cy="340" r="38" fill="#0f172a" stroke="#38bdf8" stroke-width="6"/>
        <!-- Power Core -->
        <polygon points="250,318 268,340 250,362 232,340" fill="#38bdf8"/>
        <!-- Arms -->
        <rect x="100" y="290" width="40" height="110" rx="20" fill="#64748b"/>
        <rect x="360" y="290" width="40" height="110" rx="20" fill="#64748b"/>
      </svg>
    `)
  },
  {
    id: 'dino_rex',
    name: 'T-Rex Fofinho Vulcânico 3D',
    category: 'dino',
    svgDataUri: createSvgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
        <defs>
          <radialGradient id="dinoBg" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stop-color="#15803d"/>
            <stop offset="70%" stop-color="#14532d"/>
            <stop offset="100%" stop-color="#052e16"/>
          </radialGradient>
          <linearGradient id="skinG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#4ade80"/>
            <stop offset="70%" stop-color="#16a34a"/>
            <stop offset="100%" stop-color="#15803d"/>
          </linearGradient>
        </defs>
        <rect width="500" height="500" rx="30" fill="url(#dinoBg)"/>
        <!-- Dino Back Spikes -->
        <polygon points="170,160 140,140 160,190" fill="#ea580c"/>
        <polygon points="150,220 120,210 145,250" fill="#ea580c"/>
        <polygon points="140,280 100,280 135,320" fill="#ea580c"/>
        <!-- Dino Head & Body -->
        <ellipse cx="280" cy="210" rx="120" ry="90" fill="url(#skinG)"/>
        <ellipse cx="240" cy="330" rx="110" ry="110" fill="url(#skinG)"/>
        <ellipse cx="260" cy="350" rx="70" ry="80" fill="#fef08a"/>
        <!-- Big Cute Eye -->
        <circle cx="310" cy="180" r="28" fill="#ffffff"/>
        <circle cx="316" cy="180" r="18" fill="#0f172a"/>
        <circle cx="322" cy="174" r="6" fill="#ffffff"/>
        <!-- Cheek blush -->
        <circle cx="330" cy="230" r="16" fill="#f43f5e" opacity="0.6"/>
        <!-- Happy Teeth -->
        <path d="M280 250 L380 250" stroke="#14532d" stroke-width="6" stroke-linecap="round"/>
        <polygon points="300,250 310,265 320,250" fill="#ffffff"/>
        <polygon points="330,250 340,265 350,250" fill="#ffffff"/>
        <polygon points="360,250 370,265 380,250" fill="#ffffff"/>
        <!-- Tiny T-Rex Arms -->
        <path d="M280 310 Q320 310 320 330 Q300 340 270 330" fill="#22c55e" stroke="#15803d" stroke-width="4"/>
      </svg>
    `)
  },
  {
    id: 'pirate_capt',
    name: 'Capitão Barba-Doce 3D',
    category: 'pirate',
    svgDataUri: createSvgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
        <defs>
          <radialGradient id="piBg" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stop-color="#0284c7"/>
            <stop offset="70%" stop-color="#0369a1"/>
            <stop offset="100%" stop-color="#082f49"/>
          </radialGradient>
        </defs>
        <rect width="500" height="500" rx="30" fill="url(#piBg)"/>
        <!-- Pirate Coat -->
        <path d="M140 260 L250 220 L360 260 L390 460 L110 460 Z" fill="#991b1b"/>
        <rect x="230" y="240" width="40" height="220" fill="#fef08a"/>
        <!-- Head -->
        <ellipse cx="250" cy="180" rx="75" ry="70" fill="#fed7aa"/>
        <!-- Pirate Hat -->
        <path d="M120 150 Q250 80 380 150 Q250 170 120 150 Z" fill="#0f172a"/>
        <path d="M150 145 Q250 20 350 145 Z" fill="#1e293b"/>
        <!-- Skull on Hat -->
        <circle cx="250" cy="105" r="14" fill="#ffffff"/>
        <ellipse cx="245" cy="105" rx="3" ry="4" fill="#0f172a"/>
        <ellipse cx="255" cy="105" rx="3" ry="4" fill="#0f172a"/>
        <!-- Eye Patch -->
        <ellipse cx="215" cy="175" rx="16" ry="14" fill="#0f172a"/>
        <line x1="175" y1="160" x2="255" y2="190" stroke="#0f172a" stroke-width="4"/>
        <!-- Good Eye -->
        <circle cx="280" cy="175" r="12" fill="#0f172a"/>
        <circle cx="283" cy="172" r="4" fill="#ffffff"/>
        <!-- Cute Pirate Beard -->
        <path d="M190 200 Q250 260 310 200 Q250 280 190 200 Z" fill="#b45309"/>
        <!-- Smile -->
        <path d="M235 205 Q250 220 265 205" stroke="#78350f" stroke-width="4" fill="none"/>
      </svg>
    `)
  },
  {
    id: 'princess_aurora',
    name: 'Princesa Estelar 3D',
    category: 'princess',
    svgDataUri: createSvgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
        <defs>
          <radialGradient id="priBg" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stop-color="#f472b6"/>
            <stop offset="60%" stop-color="#db2777"/>
            <stop offset="100%" stop-color="#831843"/>
          </radialGradient>
          <linearGradient id="dressG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#fbcfe8"/>
            <stop offset="50%" stop-color="#f472b6"/>
            <stop offset="100%" stop-color="#db2777"/>
          </linearGradient>
        </defs>
        <rect width="500" height="500" rx="30" fill="url(#priBg)"/>
        <!-- Sparkles -->
        <circle cx="100" cy="120" r="10" fill="#fef08a"/>
        <circle cx="400" cy="160" r="12" fill="#ffffff"/>
        <circle cx="80" cy="380" r="8" fill="#fbcfe8"/>
        <!-- Gown -->
        <path d="M170 240 Q250 220 330 240 L380 460 L120 460 Z" fill="url(#dressG)"/>
        <ellipse cx="250" cy="370" rx="90" ry="70" fill="#ffffff" opacity="0.25"/>
        <!-- Head -->
        <ellipse cx="250" cy="160" rx="65" ry="60" fill="#fed7aa"/>
        <!-- Hair Blonde -->
        <path d="M170 140 Q250 80 330 140 Q350 250 330 320 Q250 260 170 320 Z" fill="#facc15"/>
        <!-- Crown -->
        <polygon points="210,110 225,80 250,105 275,80 290,110" fill="#fbbf24" stroke="#d97706" stroke-width="4"/>
        <circle cx="250" cy="85" r="6" fill="#ec4899"/>
        <!-- Big Anime Eyes -->
        <ellipse cx="225" cy="160" rx="14" ry="12" fill="#0284c7"/>
        <circle cx="228" cy="156" r="4" fill="#ffffff"/>
        <ellipse cx="275" cy="160" rx="14" ry="12" fill="#0284c7"/>
        <circle cx="278" cy="156" r="4" fill="#ffffff"/>
        <!-- Smile -->
        <path d="M238 185 Q250 198 262 185" stroke="#e11d48" stroke-width="4" fill="none" stroke-linecap="round"/>
      </svg>
    `)
  },
  {
    id: 'dragon_pyro',
    name: 'Piro Dragão Bebê 3D',
    category: 'dragon',
    svgDataUri: createSvgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
        <defs>
          <radialGradient id="draBg" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stop-color="#ea580c"/>
            <stop offset="60%" stop-color="#9a3412"/>
            <stop offset="100%" stop-color="#431407"/>
          </radialGradient>
          <linearGradient id="dG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#f97316"/>
            <stop offset="70%" stop-color="#dc2626"/>
            <stop offset="100%" stop-color="#991b1b"/>
          </linearGradient>
        </defs>
        <rect width="500" height="500" rx="30" fill="url(#draBg)"/>
        <!-- Fire particles -->
        <circle cx="120" cy="120" r="12" fill="#fde047" opacity="0.8"/>
        <circle cx="390" cy="140" r="10" fill="#fb923c" opacity="0.9"/>
        <!-- Dragon Wings -->
        <path d="M160 200 Q80 140 70 230 Q120 280 180 260 Z" fill="#fb923c" stroke="#b45309" stroke-width="4"/>
        <path d="M340 200 Q420 140 430 230 Q380 280 320 260 Z" fill="#fb923c" stroke="#b45309" stroke-width="4"/>
        <!-- Dragon Body -->
        <ellipse cx="250" cy="320" rx="100" ry="100" fill="url(#dG)"/>
        <ellipse cx="250" cy="340" rx="60" ry="70" fill="#fef08a"/>
        <!-- Dragon Horns -->
        <polygon points="190,140 160,80 210,120" fill="#fef08a" stroke="#ca8a04" stroke-width="3"/>
        <polygon points="310,140 340,80 290,120" fill="#fef08a" stroke="#ca8a04" stroke-width="3"/>
        <!-- Dragon Head -->
        <ellipse cx="250" cy="180" rx="90" ry="75" fill="url(#dG)"/>
        <!-- Big Eyes -->
        <ellipse cx="215" cy="170" rx="18" ry="16" fill="#fef08a"/>
        <ellipse cx="218" cy="170" rx="8" ry="14" fill="#0f172a"/>
        <ellipse cx="285" cy="170" rx="18" ry="16" fill="#fef08a"/>
        <ellipse cx="282" cy="170" rx="8" ry="14" fill="#0f172a"/>
        <!-- Cute Smoke Breath -->
        <circle cx="250" cy="220" r="8" fill="#f97316"/>
        <path d="M230 240 Q250 260 270 240" stroke="#7f1d1d" stroke-width="5" fill="none" stroke-linecap="round"/>
      </svg>
    `)
  }
];
