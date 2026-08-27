/**
 * GitHero GameplayView Component
 * Faithful to Google Stitch Design:
 * - 60% Left Game Canvas / Arena with 2D/Isometric Grid, Player, Movable Box, Goal, Gates, Switches, Hazards
 * - 40% Right Fixed-Height Auto-Scrolling Terminal with Real-time Objective Checklist
 * - Responsive Mobile Command bar & Quick Navigation
 */

import { renderGameHUD } from '../components/GameHUD.js';
import { ObjectiveEngine } from '../engine/ObjectiveEngine.js';

export function generateGridTilesHtml(gameState) {
  const size = gameState.gridSize || 6;
  const totalTiles = size * size;
  let tilesHtml = '';

  const player = gameState.player;
  const box = gameState.box;
  const goal = gameState.goal;
  const walls = gameState.walls || [];
  const gates = gameState.gates || [];
  const switches = gameState.switches || [];
  const hazards = gameState.hazards || [];

  for (let i = 0; i < totalTiles; i++) {
    const x = i % size;
    const y = Math.floor(i / size);

    const isPlayer = player.x === x && player.y === y;
    const isBox = box && box.x === x && box.y === y;
    const isGoal = goal && goal.x === x && goal.y === y;
    const isWall = walls.some(w => w.x === x && w.y === y);
    const gate = gates.find(g => g.x === x && g.y === y);
    const switchEl = switches.find(s => s.x === x && s.y === y);
    const hazard = hazards.find(h => h.x === x && h.y === y);

    let cellContent = '';
    let cellBg = 'bg-surface-container-low/80 border-outline-variant/20';

    if (isWall) {
      cellBg = 'bg-surface-variant/90 border-outline-variant/60 shadow-inner';
      cellContent = `<div class="w-full h-full flex items-center justify-center opacity-30 text-outline"><span class="material-symbols-outlined text-sm">grid_4x4</span></div>`;
    } else if (gate) {
      if (gate.isOpen) {
        cellBg = 'bg-primary/10 border-primary/40 border-dashed';
        cellContent = `<div class="w-full h-full flex items-center justify-center text-primary/60"><span class="material-symbols-outlined text-sm">lock_open</span></div>`;
      } else {
        cellBg = 'bg-error/20 border-error/60';
        cellContent = `<div class="w-full h-full flex items-center justify-center text-error animate-pulse"><span class="material-symbols-outlined text-sm">lock</span></div>`;
      }
    } else if (switchEl) {
      const active = switchEl.isActive || isPlayer || isBox;
      cellBg = active ? 'bg-tertiary/25 border-tertiary glow-amber' : 'bg-surface-container border-tertiary/40';
      cellContent = `<div class="w-full h-full flex items-center justify-center text-tertiary"><span class="material-symbols-outlined text-sm">${active ? 'radio_button_checked' : 'radio_button_unchecked'}</span></div>`;
    } else if (hazard) {
      cellBg = 'bg-error/15 border-error/40';
      cellContent = `<div class="w-full h-full flex items-center justify-center text-error/80"><span class="material-symbols-outlined text-sm">warning</span></div>`;
    } else if (isGoal) {
      cellBg = 'bg-primary/20 border-primary/60 glow-primary';
      cellContent = `
        <div class="w-full h-full flex items-center justify-center text-primary animate-pulse">
          <span class="material-symbols-outlined text-lg" style="font-variation-settings: 'FILL' 1;">target</span>
        </div>
      `;
    }

    if (isBox) {
      const onGoal = isGoal;
      cellContent += `
        <div class="absolute inset-1 rounded bg-secondary text-on-secondary flex items-center justify-center font-bold text-xs shadow-lg transform transition-transform duration-200 ${onGoal ? 'bg-primary text-on-primary ring-2 ring-primary glow-primary' : 'glow-secondary'}">
          <span class="material-symbols-outlined text-base">package_2</span>
        </div>
      `;
    }

    if (isPlayer) {
      const dir = player.dir || 'up';
      let rotation = '0deg';
      if (dir === 'right') rotation = '90deg';
      else if (dir === 'down') rotation = '180deg';
      else if (dir === 'left') rotation = '270deg';

      cellContent += `
        <div class="absolute inset-1.5 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-[0_0_15px_#4edea3] z-20 transform transition-transform duration-150" style="transform: rotate(${rotation});">
          <span class="material-symbols-outlined text-sm font-bold" style="font-variation-settings: 'FILL' 1;">arrow_upward</span>
        </div>
      `;
    }

    tilesHtml += `
      <div data-cell-x="${x}" data-cell-y="${y}" class="relative aspect-square rounded border ${cellBg} flex items-center justify-center transition-all duration-200 select-none">
        ${cellContent}
      </div>
    `;
  }

  return tilesHtml;
}

export function renderGameplayView(gameState, gitCli) {
  const level = gameState.levelDef;
  const onGoal = gameState.checkGoal();
  const objectives = ObjectiveEngine.evaluate(gameState);

  const terminalLogsHtml = gitCli.logs.map(log => {
    if (log.type === 'cmd') {
      return `
        <div class="text-sm font-terminal-code flex items-start gap-2 py-0.5">
          <span class="text-primary font-bold select-none">&gt;</span>
          <span class="text-on-surface font-semibold">${log.text}</span>
        </div>
      `;
    } else if (log.type === 'status') {
      return `
        <div class="p-3 my-1.5 bg-surface-container/90 rounded border border-outline-variant/40 text-xs font-terminal-code space-y-1">
          <div class="text-on-surface-variant flex justify-between">
            <span>On branch: <strong class="text-primary">${log.branch}</strong></span>
            <span class="text-tertiary">${log.progress}</span>
          </div>
          <div class="text-on-surface">Mission: ${log.objective}</div>
          <div class="${onGoal ? 'text-primary font-bold' : 'text-on-surface-variant'}">Payload status: ${log.boxStatus}</div>
        </div>
      `;
    } else if (log.type === 'push' || log.type === 'pull' || log.type === 'commit' || log.type === 'switch') {
      return `
        <div class="text-xs font-terminal-code py-1 text-on-surface-variant space-y-0.5 border-l-2 border-primary/50 pl-2 my-1">
          <div class="text-secondary">${log.detail}</div>
          <div class="text-primary">${log.result || ''}</div>
        </div>
      `;
    } else if (log.type === 'error') {
      return `
        <div class="text-xs font-terminal-code text-error py-1 flex items-start gap-1.5">
          <span class="material-symbols-outlined text-sm">error</span>
          <span>${log.text}</span>
        </div>
      `;
    }
    return `
      <div class="text-xs font-terminal-code text-on-surface-variant/90 whitespace-pre-wrap py-0.5">
        ${log.text}
      </div>
    `;
  }).join('');

  const gridColsClass = `grid-cols-${gameState.gridSize || 6}`;

  return `
    <main class="w-full min-h-screen pt-16 pb-24 md:pb-6 px-4 md:px-hud-margin max-w-[1600px] mx-auto flex flex-col justify-start">
      <!-- Top HUD Bar -->
      <div class="w-full my-3 rounded-xl overflow-hidden shadow-lg">
        ${renderGameHUD(gameState)}
      </div>

      <!-- Main Layout: 60% Arena + 40% Fixed Terminal -->
      <div class="w-full flex-1 flex flex-col lg:flex-row gap-6 items-stretch min-h-[580px]">
        <!-- Left: Game World / Arena (60%) -->
        <section class="flex-1 glass-panel rounded-xl flex flex-col overflow-hidden shadow-2xl relative min-h-[460px]">
          <!-- Arena Header -->
          <div class="px-4 py-2.5 bg-surface-container-high/60 border-b border-outline-variant/30 flex justify-between items-center text-xs font-terminal-label">
            <span class="text-on-surface-variant flex items-center gap-1.5">
              <span class="material-symbols-outlined text-sm text-primary">view_in_ar</span> REPOSITORY ARENA
            </span>
            <span class="text-primary font-mono">${level.gridSize}x${level.gridSize} GRID</span>
          </div>

          <!-- Arena Body -->
          <div class="flex-1 flex items-center justify-center p-4 relative bg-surface-container-lowest/50 overflow-hidden">
            <div class="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none"></div>

            <!-- Puzzle Grid -->
            <div id="gameplay-grid" class="grid gap-1.5 w-full max-w-[420px] aspect-square relative z-10" style="grid-template-columns: repeat(${gameState.gridSize || 6}, minmax(0, 1fr));">
              ${generateGridTilesHtml(gameState)}
            </div>
          </div>
        </section>

        <!-- Right: Fixed-Height Terminal & Objective Tracker (40%) -->
        <section class="w-full lg:w-[480px] h-[580px] max-h-[580px] glass-panel rounded-xl flex flex-col relative z-20 shadow-2xl overflow-hidden shrink-0">
          <!-- Terminal Header -->
          <div class="h-9 bg-surface-container-high/80 border-b border-outline-variant/30 flex items-center justify-between px-4 shrink-0">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-error/60"></div>
              <div class="w-3 h-3 rounded-full bg-tertiary/60"></div>
              <div class="w-3 h-3 rounded-full bg-primary/60"></div>
              <span class="text-terminal-label font-terminal-label text-on-surface-variant ml-2">~/githero/terminal</span>
            </div>
            <span class="text-[10px] font-terminal-code text-primary/70">level-${level.id}</span>
          </div>

          <!-- Mission Objectives Checklist Banner -->
          <div class="bg-surface-container-high/40 border-b border-outline-variant/20 px-4 py-2.5 shrink-0">
            <div class="text-[11px] font-terminal-label uppercase tracking-wider text-primary font-bold flex items-center justify-between mb-1">
              <span class="flex items-center gap-1.5"><span class="material-symbols-outlined text-[14px]">checklist</span> MISSION OBJECTIVES</span>
              <span class="text-[10px] text-tertiary font-mono">${onGoal ? '100% (READY TO COMMIT)' : `${Math.min(80, Math.floor(gameState.moves * 10))}%`}</span>
            </div>
            <ul class="space-y-1 text-xs font-terminal-code text-on-surface-variant">
              ${objectives.map(obj => `
                <li class="flex items-center gap-2 ${obj.completed ? 'text-primary' : 'text-on-surface-variant/80'}">
                  <span class="material-symbols-outlined text-[14px] ${obj.completed ? 'text-primary' : 'text-outline-variant'}">${obj.completed ? 'check_box' : 'check_box_outline_blank'}</span>
                  <span>${obj.label}</span>
                </li>
              `).join('')}
            </ul>
          </div>

          <!-- Fixed Scrollable Terminal Output Buffer -->
          <div id="terminal-logs-container" class="flex-1 p-4 overflow-y-auto terminal-history-scroll flex flex-col justify-start space-y-1 font-terminal-code text-xs bg-surface-container-lowest/80">
            ${terminalLogsHtml}
          </div>

          <!-- Terminal Input Area -->
          <div class="p-3 bg-surface-container-high/90 border-t border-outline-variant/30 shrink-0">
            <form id="terminal-form" class="flex items-center gap-2 relative">
              <span class="text-primary font-bold font-terminal-code text-base pl-1 select-none">&gt;</span>
              <input 
                id="terminal-input" 
                type="text" 
                autocomplete="off" 
                autocorrect="off" 
                autocapitalize="off" 
                spellcheck="false"
                placeholder="git push, git pull, git status, git commit, git left..." 
                class="flex-1 bg-transparent text-on-surface font-terminal-code text-sm outline-none border-none placeholder:text-on-surface-variant/40"
              />
              <button type="submit" class="px-3 py-1.5 bg-primary text-on-primary rounded text-xs font-terminal-label font-bold hover:scale-105 transition-transform flex items-center gap-1">
                <span>RUN</span>
                <span class="material-symbols-outlined text-xs">keyboard_return</span>
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  `;
}
