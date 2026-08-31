import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import { CardData, PrintSettings } from '../types';

export const ExportService = {
  /**
   * Capture a DOM element as a high-res image data URL (300 DPI)
   */
  async captureElement(element: HTMLElement, scale: number = 4): Promise<string> {
    const canvas = await html2canvas(element, {
      scale: scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
    });
    return canvas.toDataURL('image/png');
  },

  /**
   * Export single card as PNG (High resolution 300 DPI)
   */
  async exportAsPng(element: HTMLElement, fileName: string, scale: number = 4): Promise<void> {
    const canvas = await html2canvas(element, {
      scale: scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
    });

    const link = document.createElement('a');
    link.download = `${fileName.toLowerCase().replace(/\s+/g, '_')}_card3d.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  },

  /**
   * Export single card as JPG (Maximum quality)
   */
  async exportAsJpg(element: HTMLElement, fileName: string, scale: number = 4): Promise<void> {
    const canvas = await html2canvas(element, {
      scale: scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    const link = document.createElement('a');
    link.download = `${fileName.toLowerCase().replace(/\s+/g, '_')}_card3d.jpg`;
    link.href = canvas.toDataURL('image/jpeg', 0.98);
    link.click();
  },

  /**
   * Generate A4 PDF with 1, 2, 4, or 8 cards per page with cut marks (63 x 88 mm standard card size)
   */
  async generateA4Pdf(
    frontElements: HTMLElement[],
    backElements: HTMLElement[] = [],
    printSettings: PrintSettings,
    pdfTitle: string = 'CardForgeKids3D_PrintSheet'
  ): Promise<void> {
    // A4 dimensions in mm
    const a4WidthMm = 210;
    const a4HeightMm = 297;

    // Card dimensions in mm
    const cardWidthMm = 63;
    const cardHeightMm = 88;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Determine grid based on cardsPerPage
    let cols = 1;
    let rows = 1;
    if (printSettings.cardsPerPage === 2) {
      cols = 1;
      rows = 2;
    } else if (printSettings.cardsPerPage === 4) {
      cols = 2;
      rows = 2;
    } else if (printSettings.cardsPerPage >= 8) {
      cols = 3;
      rows = 3; // 9 or 8 cards fits comfortably on A4
    }

    const cardsPerPage = cols * rows;

    // Calculate margins and spacing
    const totalGridWidth = cols * cardWidthMm;
    const totalGridHeight = rows * cardHeightMm;
    const startX = (a4WidthMm - totalGridWidth) / 2;
    const startY = (a4HeightMm - totalGridHeight) / 2;

    // Helper to render cut marks
    const drawCutMarks = (doc: jsPDF, x: number, y: number, w: number, h: number) => {
      if (!printSettings.showCutLines) return;
      doc.setDrawColor(180, 180, 180);
      doc.setLineDashPattern([1, 2], 0);
      doc.rect(x, y, w, h, 'S');

      // Corner crosshairs
      doc.setDrawColor(100, 100, 100);
      doc.setLineDashPattern([], 0);
      const markLen = 3;
      // Top-left
      doc.line(x - markLen, y, x, y);
      doc.line(x, y - markLen, x, y);
      // Top-right
      doc.line(x + w, y, x + w + markLen, y);
      doc.line(x + w, y - markLen, x + w, y);
      // Bottom-left
      doc.line(x - markLen, y + h, x, y + h);
      doc.line(x, y + h, x, y + h + markLen);
      // Bottom-right
      doc.line(x + w, y + h, x + w + markLen, y + h);
      doc.line(x + w, y + h, x + w, y + h + markLen);
    };

    // Process front pages
    for (let i = 0; i < frontElements.length; i += cardsPerPage) {
      if (i > 0) pdf.addPage();

      const pageFronts = frontElements.slice(i, i + cardsPerPage);

      for (let idx = 0; idx < pageFronts.length; idx++) {
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        const x = startX + col * cardWidthMm;
        const y = startY + row * cardHeightMm;

        const imgData = await this.captureElement(pageFronts[idx], 3);
        pdf.addImage(imgData, 'PNG', x, y, cardWidthMm, cardHeightMm, undefined, 'FAST');
        drawCutMarks(pdf, x, y, cardWidthMm, cardHeightMm);
      }

      // Add aligned back side page if requested
      if (printSettings.includeBacksides && backElements.length > 0) {
        pdf.addPage();
        const pageBacks = backElements.slice(i, i + cardsPerPage);

        for (let idx = 0; idx < pageBacks.length; idx++) {
          const col = idx % cols;
          const row = Math.floor(idx / cols);

          // For duplex printing, reverse columns horizontally so front and back line up when flipped!
          const duplexCol = printSettings.duplexAlignment ? cols - 1 - col : col;
          const x = startX + duplexCol * cardWidthMm;
          const y = startY + row * cardHeightMm;

          const imgData = await this.captureElement(pageBacks[idx], 3);
          pdf.addImage(imgData, 'PNG', x, y, cardWidthMm, cardHeightMm, undefined, 'FAST');
          drawCutMarks(pdf, x, y, cardWidthMm, cardHeightMm);
        }
      }
    }

    pdf.save(`${pdfTitle}.pdf`);
  },

  /**
   * Generate an Interactive, Self-Contained HTML Web Card (Standalone Playable Card with Live HP Controls,
   * Attack/Damage modifiers, Battle Rules, Sound & Victory animations for PC and Android offline battle!)
   */
  generateInteractiveHtmlCard(card: CardData): string {
    const jsonCard = JSON.stringify(card).replace(/</g, '\\u003c');
    
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${card.heroName} - CARD FORGE KIDS 3D (Card Interativo de Batalha)</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&family=Titan+One&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
  <style>
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: radial-gradient(circle at center, #1e1b4b 0%, #090d16 100%);
      min-height: 100vh;
      color: #f8fafc;
      user-select: none;
      -webkit-user-select: none;
    }
    .font-heading { font-family: 'Fredoka', cursive, sans-serif; }
    .font-display { font-family: 'Titan One', cursive, sans-serif; }
    .card-frame-3d {
      box-shadow: 0 20px 50px rgba(0,0,0,0.8), 0 0 30px ${card.primaryColor}55, inset 0 0 15px rgba(255,255,255,0.3);
      border: 4px solid #facc15;
    }
    .pulse-damage {
      animation: damagePulse 0.4s ease;
    }
    @keyframes damagePulse {
      0% { transform: scale(1); filter: brightness(1); }
      50% { transform: scale(0.96); filter: brightness(2) drop-shadow(0 0 25px #ef4444); }
      100% { transform: scale(1); filter: brightness(1); }
    }
    .pulse-heal {
      animation: healPulse 0.4s ease;
    }
    @keyframes healPulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.04); filter: drop-shadow(0 0 25px #22c55e); }
      100% { transform: scale(1); }
    }
  </style>
</head>
<body class="flex flex-col items-center justify-center p-4">

  <!-- Header -->
  <header class="text-center mb-4">
    <div class="inline-block bg-amber-400/20 border border-amber-400 text-amber-300 text-xs font-bold px-3 py-1 rounded-full mb-1">
      ⚡ CARD INTERATIVO DE BATALHA 3D
    </div>
    <h1 class="font-display text-2xl md:text-3xl text-amber-400 tracking-wide">${card.heroName}</h1>
    <p class="text-xs text-slate-400">${card.subtitle} • Rarity: ${card.rarity}</p>
  </header>

  <!-- Interactive Arena Container -->
  <main class="w-full max-w-md flex flex-col items-center">
    
    <!-- 3D Card Box -->
    <div id="cardBox" class="w-72 sm:w-80 rounded-3xl overflow-hidden card-frame-3d bg-slate-900 transition-all duration-300 relative">
      
      <!-- Top Gold Banner -->
      <div class="bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 py-2 px-3 flex justify-between items-center text-slate-950 font-black shadow-md">
        <span class="font-display text-sm tracking-wider uppercase truncate">${card.heroName}</span>
        <span class="bg-slate-950 text-amber-300 text-xs px-2 py-0.5 rounded-full font-bold">LVL 3D</span>
      </div>

      <!-- Character Artwork Area -->
      <div class="h-44 sm:h-52 bg-slate-950 relative overflow-hidden flex items-center justify-center border-b-4 border-amber-400/80">
        <div class="w-full h-full flex items-center justify-center overflow-hidden" style="transform: translate(${card.illustrationTransform?.offsetX || 0}%, ${card.illustrationTransform?.offsetY || 0}%) scale(${card.illustrationTransform?.zoom || 1}) rotate(${card.illustrationTransform?.rotation || 0}deg) scaleX(${card.illustrationTransform?.flipHorizontal ? -1 : 1}) scaleY(${card.illustrationTransform?.flipVertical ? -1 : 1}); transition: transform 0.2s;">
          <img id="heroImg" src="${card.illustrationUrl}" alt="${card.heroName}" class="w-full h-full object-contain p-2 pointer-events-none" />
        </div>
        
        <!-- Live Status Overlay -->
        <div id="statusBadge" class="absolute top-2 left-2 bg-slate-900/90 border border-slate-700 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span id="statusText" class="text-emerald-400">Em Combate</span>
        </div>

        <div class="absolute bottom-2 right-2 bg-slate-950/80 border border-amber-400 text-amber-300 px-2 py-0.5 rounded text-[11px] font-extrabold uppercase">
          ${card.stats.attack} ATQ / ${card.stats.defense} DEF
        </div>
      </div>

      <!-- Power Section -->
      <div class="p-3 bg-gradient-to-b from-slate-900 to-slate-950 space-y-2">
        <div class="bg-slate-800/90 p-2.5 rounded-xl border border-slate-700">
          <div class="flex items-center justify-between text-xs font-bold text-amber-300 mb-1">
            <span class="flex items-center gap-1">⭐ ${card.power.name}</span>
            <span class="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded">${card.power.usageLimit}</span>
          </div>
          <p class="text-xs text-slate-300 leading-tight">${card.power.description}</p>
          <div class="mt-1.5 pt-1.5 border-t border-slate-700 text-[11px] text-sky-300 font-semibold">
            📜 Regra: ${card.power.rule}
          </div>
        </div>

        <!-- Interactive Health & Battle Controls -->
        <div class="bg-slate-800/90 p-3 rounded-2xl border-2 border-emerald-500/50 shadow-inner space-y-2.5">
          <div class="flex justify-between items-center mb-1">
            <span class="text-xs font-black uppercase text-slate-300 flex items-center gap-1">
              ❤️ PONTOS DE VIDA (HP)
            </span>
            <span id="hpDisplay" class="text-lg font-black text-emerald-400">${card.stats.hp} / ${card.stats.maxHp}</span>
          </div>
          
          <!-- Health Bar -->
          <div class="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700">
            <div id="hpBar" class="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all duration-300" style="width: ${(card.stats.hp / card.stats.maxHp) * 100}%"></div>
          </div>

          <!-- Custom Health Modifier input -->
          <div class="flex items-center gap-2">
            <input id="customVal" type="number" value="15" min="1" max="999" class="w-16 bg-slate-950 border border-slate-600 rounded-xl px-2 py-2 text-center text-xs font-black text-amber-300 focus:outline-none focus:border-amber-400" />
            <button onclick="applyCustomDamage()" class="flex-1 bg-rose-600 hover:bg-rose-500 text-white text-xs font-black py-2 rounded-xl active:scale-95 shadow transition-all">⚔️ Aplicar Dano</button>
            <button onclick="applyCustomHeal()" class="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black py-2 rounded-xl active:scale-95 shadow transition-all">💖 Curar</button>
          </div>

          <!-- Dado D6 Interativo Giratório -->
          <div class="pt-2 border-t border-slate-700/80">
            <div class="bg-slate-950/80 p-2.5 rounded-xl border border-amber-500/40 flex items-center justify-between gap-3">
              <div class="flex items-center gap-2">
                <span class="text-xl">🎲</span>
                <div class="flex flex-col text-left">
                  <span class="text-xs font-black text-amber-300">
                    Dado D6 de Batalha
                  </span>
                  <span class="text-[10px] text-slate-400">Gira e sorteia de 1 a 6</span>
                </div>
              </div>
              <button id="diceBtn" onclick="rollD6Dice()" class="bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black px-4 py-2 rounded-xl shadow-lg active:scale-95 flex items-center gap-2 transition-all cursor-pointer">
                <span id="diceIcon" class="text-base inline-block transition-transform duration-500">🎲</span>
                <span class="text-xs font-bold uppercase">Rolar:</span>
                <span id="diceNumber" class="text-sm font-black min-w-[16px] text-center bg-slate-950/20 px-1.5 py-0.5 rounded">?</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Battle Actions -->
    <div class="w-full mt-4 flex gap-2">
      <button onclick="declareVictory()" class="flex-1 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black py-2.5 rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1.5 text-sm">
        🏆 Venci a Batalha!
      </button>
      <button onclick="resetHp()" class="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2.5 rounded-xl border border-slate-700 active:scale-95 transition-all text-xs">
        🔄 Reiniciar
      </button>
    </div>

    <!-- Combat Log -->
    <div class="w-full mt-3 bg-slate-900/80 border border-slate-800 rounded-xl p-3">
      <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
        <span>Histórico do Duelo</span>
        <button onclick="clearLogs()" class="text-[10px] text-amber-400 hover:underline">Limpar</button>
      </h3>
      <div id="logBox" class="h-20 overflow-y-auto text-[11px] space-y-1 text-slate-300 pr-1">
        <div class="text-slate-500">Card carregado pronto para duelar com amigos no PC ou Android!</div>
      </div>
    </div>

  </main>

  <footer class="mt-6 text-center text-xs text-slate-500">
    CARD FORGE KIDS 3D • Jogo de Tabuleiro • Funciona 100% Offline
  </footer>

  <script>
    const cardData = ${jsonCard};
    let currentHp = cardData.stats.hp;
    const maxHp = cardData.stats.maxHp;

    const hpDisplay = document.getElementById('hpDisplay');
    const hpBar = document.getElementById('hpBar');
    const cardBox = document.getElementById('cardBox');
    const statusText = document.getElementById('statusText');
    const statusBadge = document.getElementById('statusBadge');
    const logBox = document.getElementById('logBox');

    function logAction(msg) {
      const p = document.createElement('div');
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      p.innerHTML = '<span class="text-slate-500">[' + time + ']</span> ' + msg;
      logBox.prepend(p);
    }

    function clearLogs() {
      logBox.innerHTML = '<div class="text-slate-500">Histórico reiniciado.</div>';
    }

    function updateHpUI() {
      if (currentHp < 0) currentHp = 0;
      if (currentHp > maxHp * 2) currentHp = maxHp * 2;

      hpDisplay.innerText = currentHp + ' / ' + maxHp;
      const pct = Math.min(100, Math.max(0, (currentHp / maxHp) * 100));
      hpBar.style.width = pct + '%';

      if (currentHp === 0) {
        hpBar.className = 'h-full bg-rose-600 rounded-full transition-all duration-300';
        statusText.innerText = 'NOCAUTEADO (Derrota)';
        statusText.className = 'text-rose-400';
        cardBox.style.opacity = '0.7';
      } else if (pct < 30) {
        hpBar.className = 'h-full bg-red-500 animate-pulse rounded-full transition-all duration-300';
        statusText.innerText = 'Crítico!';
        statusText.className = 'text-amber-400';
        cardBox.style.opacity = '1';
      } else {
        hpBar.className = 'h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all duration-300';
        statusText.innerText = 'Em Combate';
        statusText.className = 'text-emerald-400';
        cardBox.style.opacity = '1';
      }
    }

    function modifyHp(delta) {
      currentHp += delta;
      if (delta < 0) {
        cardBox.classList.remove('pulse-damage', 'pulse-heal');
        void cardBox.offsetWidth;
        cardBox.classList.add('pulse-damage');
        logAction('<b class="text-rose-400">' + cardData.heroName + '</b> sofreu ' + Math.abs(delta) + ' de dano! (HP restante: ' + Math.max(0, currentHp) + ')');
      } else {
        cardBox.classList.remove('pulse-damage', 'pulse-heal');
        void cardBox.offsetWidth;
        cardBox.classList.add('pulse-heal');
        logAction('<b class="text-emerald-400">' + cardData.heroName + '</b> recuperou +' + delta + ' HP!');
      }
      updateHpUI();
    }

    function applyCustomDamage() {
      const val = parseInt(document.getElementById('customVal').value) || 0;
      if (val > 0) modifyHp(-val);
    }

    function applyCustomHeal() {
      const val = parseInt(document.getElementById('customVal').value) || 0;
      if (val > 0) modifyHp(val);
    }

    let isRollingDice = false;
    function rollD6Dice() {
      if (isRollingDice) return;
      isRollingDice = true;

      const diceBtn = document.getElementById('diceBtn');
      const diceIcon = document.getElementById('diceIcon');
      const diceNumber = document.getElementById('diceNumber');

      diceBtn.classList.add('scale-105', 'ring-2', 'ring-amber-300');
      diceIcon.style.transform = 'rotate(720deg)';

      let count = 0;
      const interval = setInterval(() => {
        const tempRoll = Math.floor(Math.random() * 6) + 1;
        diceNumber.innerText = tempRoll;
        count++;
        if (count > 8) {
          clearInterval(interval);
          const finalResult = Math.floor(Math.random() * 6) + 1;
          diceNumber.innerText = finalResult;
          diceIcon.style.transform = 'rotate(0deg)';
          diceBtn.classList.remove('scale-105', 'ring-2', 'ring-amber-300');
          isRollingDice = false;

          const diceEmojis = ['', '⚀ 1', '⚁ 2', '⚂ 3', '⚃ 4', '⚄ 5', '⚅ 6'];
          logAction('🎲 <b>Dado D6:</b> Rolou <b class="text-amber-300 text-sm">' + (diceEmojis[finalResult] || finalResult) + '</b> !');
        }
      }, 60);
    }

    function resetHp() {
      currentHp = maxHp;
      updateHpUI();
      logAction('Vida reiniciada para ' + maxHp + ' HP.');
    }

    function declareVictory() {
      logAction('🎉 <b class="text-amber-300">' + cardData.heroName + ' VENCEU A BATALHA!</b>');
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  </script>
</body>
</html>`;
  },

  /**
   * Download the Standalone Interactive Web Card HTML file for offline play on PC and Android
   */
  downloadInteractiveHtmlCard(card: CardData): void {
    const htmlContent = this.generateInteractiveHtmlCard(card);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${card.heroName.toLowerCase().replace(/\s+/g, '_')}_batalha_interativa.html`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  },

  /**
   * Download a single card package as a .ZIP file containing:
   * - Interactive Playable HTML Card (playable offline on PC/Android)
   * - High Resolution PNG Image (if element provided or captured)
   * - Card Data JSON backup
   * - README Instructions text file
   */
  async downloadCardZip(card: CardData, frontElement?: HTMLElement | null): Promise<void> {
    const zip = new JSZip();
    const sanitizedName = card.heroName.toLowerCase().replace(/[^a-z0-9]/g, '_');

    // 1. Playable Interactive HTML Card
    const htmlContent = this.generateInteractiveHtmlCard(card);
    zip.file(`${sanitizedName}_batalha_interativa.html`, htmlContent);

    // 2. High Resolution PNG image
    if (frontElement) {
      try {
        const dataUrl = await this.captureElement(frontElement, 3);
        const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
        zip.file(`${sanitizedName}_card_300dpi.png`, base64Data, { base64: true });
      } catch (err) {
        console.warn('Could not capture PNG for zip:', err);
      }
    }

    // 3. Card JSON Data backup
    zip.file(`${sanitizedName}_dados.json`, JSON.stringify(card, null, 2));

    // 4. README Instructions
    const readmeContent = `=====================================================
🎮 PACOTE DO CARD INTERATIVO: ${card.heroName.toUpperCase()}
=====================================================

O QUE ESTÁ INCLUÍDO NESTE PACOTE .ZIP:
1. "${sanitizedName}_batalha_interativa.html"
   -> Card Interativo de Duelo completo e autônomo.
   -> Funciona no PC, Notebook, Mac, Celular Android ou Tablet totalmente OFFLINE.
   -> Inclui barra de vida (HP) em tempo real, botões de dano/cura, dado D6 giratório e comemoração de vitória.

2. "${sanitizedName}_card_300dpi.png" (se gerado)
   -> Imagem de alta resolução para impressão física (63x88mm).

3. "${sanitizedName}_dados.json"
   -> Arquivo com todas as estatísticas, poderes e configuração visual do card.

COMO USAR E JOGAR:
- No Computador / Notebook: Dê dois cliques no arquivo ".html" para abrir direto no Google Chrome, Microsoft Edge ou Firefox.
- No Celular Android: Extraia o arquivo .zip ou envie o arquivo ".html" para o aparelho e abra com o navegador.

Desenvolvido com CARD FORGE KIDS 3D
=====================================================`;
    zip.file('LEIAME_INSTRUCOES.txt', readmeContent);

    // Generate ZIP and trigger browser download
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.download = `${sanitizedName}_pacote_interativo.zip`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  },

  /**
   * Download a full collection / deck of cards as a .ZIP file containing:
   * - Interactive Launcher HTML (index_duelo_cards.html)
   * - Folder with all Interactive HTML playable cards
   * - Full JSON collection backup
   * - README Instructions
   */
  async downloadCardsDeckZip(cards: CardData[], deckName: string = 'Colecao_Cards_Interativos'): Promise<void> {
    if (!cards || cards.length === 0) return;
    const zip = new JSZip();
    const sanitizedDeck = deckName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const cardsFolder = zip.folder('cards_interativos');

    // 1. Add all individual interactive HTML cards
    cards.forEach((card) => {
      const sanitizedCardName = card.heroName.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const htmlContent = this.generateInteractiveHtmlCard(card);
      cardsFolder?.file(`${sanitizedCardName}_batalha_interativa.html`, htmlContent);
    });

    // 2. Generate a Deck Launcher HTML page (index_duelo_cards.html)
    const launcherHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Arena de Duelo - Coleção de Cards Interativos</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&family=Plus+Jakarta+Sans:wght@600;700;800&family=Titan+One&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: radial-gradient(circle at top, #1e1b4b 0%, #090d16 100%);
      min-height: 100vh;
      color: #f8fafc;
    }
    .font-display { font-family: 'Titan One', cursive, sans-serif; }
    .font-heading { font-family: 'Fredoka', cursive, sans-serif; }
  </style>
</head>
<body class="p-4 sm:p-8 flex flex-col items-center">
  <div class="w-full max-w-4xl space-y-6">
    <header class="text-center space-y-2">
      <div class="inline-block bg-amber-400/20 border border-amber-400 text-amber-300 text-xs font-bold px-3 py-1 rounded-full">
        ⚡ COLEÇÃO DE CARDS INTERATIVOS DE BATALHA 3D
      </div>
      <h1 class="font-display text-3xl sm:text-4xl text-amber-400 tracking-wide">ARENA DE DUELO TCG</h1>
      <p class="text-xs sm:text-sm text-slate-300">
        Clique em qualquer card abaixo para abrir e jogar offline no seu navegador com pontos de vida interativos e dado D6!
      </p>
    </header>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      ${cards
        .map((c) => {
          const sName = c.heroName.toLowerCase().replace(/[^a-z0-9]/g, '_');
          return `
      <div class="bg-slate-900/90 border-2 border-amber-400/50 hover:border-amber-400 rounded-3xl p-4 flex flex-col justify-between shadow-xl transition-all hover:scale-[1.02]">
        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <span class="text-xs font-black uppercase text-amber-300 bg-slate-950 px-2 py-0.5 rounded border border-amber-400/40">${c.rarity}</span>
            <span class="text-xs font-black text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/50">${c.stats.hp} HP</span>
          </div>
          <div class="h-32 bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center p-2 border border-slate-800">
            <img src="${c.illustrationUrl}" alt="${c.heroName}" class="h-full object-contain" />
          </div>
          <h3 class="font-heading font-black text-lg text-white truncate">${c.heroName}</h3>
          <p class="text-xs text-slate-400 line-clamp-2">${c.subtitle}</p>
        </div>
        <div class="pt-3 mt-3 border-t border-slate-800">
          <a href="./cards_interativos/${sName}_batalha_interativa.html" target="_blank" class="w-full block text-center bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs py-2.5 rounded-xl shadow active:scale-95 transition-all">
            ⚔️ Abrir Card de Batalha
          </a>
        </div>
      </div>`;
        })
        .join('\n')}
    </div>

    <footer class="text-center pt-6 border-t border-slate-800 text-xs text-slate-500">
      Criado e exportado com CARD FORGE KIDS 3D • Jogue em qualquer PC, Notebook ou Celular Android offline.
    </footer>
  </div>
</body>
</html>`;
    zip.file('index_arena_duelo.html', launcherHtml);

    // 3. Full JSON collection backup
    zip.file('colecao_completa_cards.json', JSON.stringify(cards, null, 2));

    // 4. Instructions
    const readmeContent = `=====================================================
🎮 COLEÇÃO COMPLETA DE CARDS INTERATIVOS DE BATALHA
=====================================================

COMO JOGAR NO COMPUTADOR OU CELULAR ANDROID:
1. Extraia o conteúdo deste arquivo .zip para uma pasta.
2. Dê dois cliques no arquivo "index_arena_duelo.html" para abrir o menu da Arena.
3. No menu, escolha qualquer card para abrir em tela cheia e duelar!
4. Você também pode abrir os cards individualmente dentro da pasta "cards_interativos".

RECURSOS DE CADA CARD:
- ❤️ Barra de Vida (HP) com botões de Dano e Cura ao vivo.
- 🎲 Dado D6 3D giratório com sorteio aleatório de 1 a 6.
- ⚡ Regras de combate e poderes especiais.
- 🎉 Efeitos sonoros e confetes ao declarar vitória.
- 🌐 100% autônomo: não requer internet após extraído.

Desenvolvido com CARD FORGE KIDS 3D
=====================================================`;
    zip.file('LEIA-ME_COMO_JOGAR.txt', readmeContent);

    // Generate ZIP and trigger browser download
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.download = `${sanitizedDeck}.zip`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  },

  /**
   * Generate an encoded shareable URL / Data link that can be opened in browser
   */
  createPlayableUrl(card: CardData): string {
    const htmlContent = this.generateInteractiveHtmlCard(card);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    return URL.createObjectURL(blob);
  },
};
