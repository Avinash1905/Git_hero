// LevelEditorView - 100% faithful to Stitch Level Editor Screen

import { soundFX } from '../audio.js';

export class LevelEditorController {
  constructor(onTestLevel) {
    this.onTestLevel = onTestLevel;
    this.selectedTool = 'player'; // 'player', 'box', 'goal', 'wall', 'hazard', 'erase'
    this.gridSize = 10;
    this.grid = Array(10).fill(null).map(() => Array(10).fill('empty'));
    
    // Seed default sample pattern matching Stitch
    this.grid[0][2] = 'player';
    this.grid[1][3] = 'box';
    this.grid[0][5] = 'wall';
    this.grid[0][6] = 'wall';
    this.grid[4][4] = 'goal';
  }

  setTool(tool) {
    this.selectedTool = tool;
    soundFX.playKey();
  }

  handleCellClick(x, y) {
    soundFX.playKey();
    if (this.selectedTool === 'player') {
      // Clear previous player
      for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 10; c++) {
          if (this.grid[r][c] === 'player') this.grid[r][c] = 'empty';
        }
      }
      this.grid[y][x] = 'player';
    } else if (this.selectedTool === 'box') {
      this.grid[y][x] = this.grid[y][x] === 'box' ? 'empty' : 'box';
    } else if (this.selectedTool === 'goal') {
      this.grid[y][x] = this.grid[y][x] === 'goal' ? 'empty' : 'goal';
    } else if (this.selectedTool === 'wall') {
      this.grid[y][x] = this.grid[y][x] === 'wall' ? 'empty' : 'wall';
    } else if (this.selectedTool === 'hazard') {
      this.grid[y][x] = this.grid[y][x] === 'hazard' ? 'empty' : 'hazard';
    } else if (this.selectedTool === 'erase') {
      this.grid[y][x] = 'empty';
    }
  }

  clear() {
    this.grid = Array(10).fill(null).map(() => Array(10).fill('empty'));
    soundFX.playKey();
  }

  exportLevel() {
    let player = { x: 1, y: 1 };
    let box = { x: 2, y: 2 };
    let goal = { x: 3, y: 3 };
    const walls = [];
    const hazards = [];

    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        const item = this.grid[y][x];
        if (item === 'player') player = { x, y };
        else if (item === 'box') box = { x, y };
        else if (item === 'goal') goal = { x, y };
        else if (item === 'wall') walls.push({ x, y });
        else if (item === 'hazard') hazards.push({ x, y });
      }
    }

    return {
      id: 'CUSTOM',
      name: 'Custom Level',
      world: 9,
      worldName: 'Community Space',
      difficulty: 'CUSTOM',
      stars: 0,
      xpReward: 500,
      commitsReq: 3,
      description: 'Player constructed level scenario.',
      gridSize: 10,
      player,
      box,
      goal,
      walls,
      hazards
    };
  }
}

export function renderLevelEditorView(editor) {
  const tools = [
    { id: 'player', name: 'Player Start', icon: 'person', color: 'text-primary bg-primary/20 border-primary' },
    { id: 'box', name: 'Box (Payload)', icon: 'package_2', color: 'text-tertiary bg-tertiary/20 border-tertiary' },
    { id: 'goal', name: 'Goal Node', icon: 'flag', color: 'text-secondary bg-secondary/20 border-secondary' },
    { id: 'wall', name: 'Wall (Firewall)', icon: 'grid_4x4', color: 'text-on-surface-variant bg-surface-bright border-outline-variant' },
    { id: 'hazard', name: 'Obstacle (Bug)', icon: 'warning', color: 'text-error bg-error/20 border-error' },
    { id: 'erase', name: 'Eraser', icon: 'backspace', color: 'text-on-surface-variant bg-surface-container border-outline-variant' }
  ];

  const toolboxHtml = tools.map(t => {
    const isSelected = editor.selectedTool === t.id;
    return `
      <button data-tool-id="${t.id}" class="editor-tool-btn group flex items-center gap-3 p-3 rounded-lg ${isSelected ? 'bg-surface-variant border-primary shadow-[0_0_10px_#4edea340]' : 'hover:bg-surface-variant/40 border-transparent'} border cursor-pointer transition-all text-left w-full">
        <div class="w-8 h-8 rounded ${t.color} flex items-center justify-center">
          <span class="material-symbols-outlined text-[20px]">${t.icon}</span>
        </div>
        <span class="text-terminal-label font-terminal-label ${isSelected ? 'text-primary font-bold' : 'text-on-surface-variant group-hover:text-on-surface'}">${t.name}</span>
      </button>
    `;
  }).join('');

  // 10x10 Grid Cells
  let cellsHtml = '';
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const type = editor.grid[y][x];
      let cellContent = '';
      let bgClass = 'bg-surface-dim hover:bg-surface-container-high/60';

      if (type === 'player') {
        cellContent = `<div class="w-3/4 h-3/4 bg-primary rotate-45 shadow-[0_0_10px_#4edea3] flex items-center justify-center"><div class="w-2 h-2 bg-on-primary rotate-45"></div></div>`;
      } else if (type === 'box') {
        cellContent = `<div class="w-2/3 h-2/3 bg-tertiary rounded-sm border border-tertiary-fixed shadow-md flex items-center justify-center"><span class="material-symbols-outlined text-[14px] text-on-tertiary">package_2</span></div>`;
      } else if (type === 'goal') {
        cellContent = `<div class="w-full h-full bg-primary-container/20 border border-primary flex items-center justify-center"><span class="material-symbols-outlined text-primary text-[14px]" style="font-variation-settings: 'FILL' 1;">flag</span></div>`;
      } else if (type === 'wall') {
        bgClass = 'bg-surface-bright';
      } else if (type === 'hazard') {
        cellContent = `<span class="material-symbols-outlined text-error text-[14px]">warning</span>`;
      }

      cellsHtml += `
        <div data-cell-x="${x}" data-cell-y="${y}" class="editor-cell grid-tile w-full h-full rounded-[2px] cursor-pointer flex items-center justify-center transition-colors ${bgClass}">
          ${cellContent}
        </div>
      `;
    }
  }

  return `
    <main class="flex-1 flex pt-16 pb-20 md:pb-0 h-screen overflow-hidden">
      <!-- LEFT: Object Toolbox -->
      <aside class="w-64 glass-panel flex flex-col h-full z-10 border-r border-outline-variant/20 hidden md:flex">
        <div class="p-md border-b border-outline-variant/20 bg-surface-container/50 flex justify-between items-center">
          <h2 class="text-terminal-label font-terminal-label text-secondary uppercase tracking-widest">Toolbox</h2>
          <span class="text-[10px] font-terminal-code text-on-surface-variant">v1.2</span>
        </div>
        
        <div class="flex-1 p-md flex flex-col gap-sm overflow-y-auto">
          ${toolboxHtml}
        </div>

        <div class="p-md border-t border-outline-variant/20 bg-surface-container/30">
          <button id="editor-test-btn" class="w-full py-2.5 bg-primary text-on-primary font-terminal-label text-terminal-label uppercase tracking-widest rounded-lg glow-primary hover:brightness-110 transition-all text-xs font-bold mb-2">
            [TEST LEVEL]
          </button>
          <button id="editor-clear-btn" class="w-full py-2 bg-surface-container-high text-on-surface border border-outline-variant/40 font-terminal-label text-terminal-label uppercase tracking-widest rounded-lg hover:bg-surface-variant transition-all text-xs">
            CLEAR CANVAS
          </button>
        </div>
      </aside>

      <!-- CENTER: Canvas -->
      <section class="flex-1 flex flex-col relative overflow-hidden bg-[#081425]">
        <!-- Canvas HUD Header -->
        <div class="p-md flex justify-between items-center z-10">
          <div class="glass-panel px-4 py-2 rounded-lg flex items-center gap-3">
            <span class="material-symbols-outlined text-secondary text-sm">grid_on</span>
            <span class="text-terminal-label font-terminal-label text-on-surface">Grid: 10x10 Canvas</span>
          </div>

          <div class="flex items-center gap-2">
            <button id="editor-mob-test" class="md:hidden px-3 py-1.5 bg-primary text-on-primary rounded text-xs font-terminal-label">
              TEST
            </button>
          </div>
        </div>

        <!-- The 10x10 Grid Area -->
        <div class="flex-1 flex items-center justify-center p-hud-margin">
          <div class="aspect-square max-h-[500px] max-w-[500px] w-full glass-panel p-4 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-outline-variant/30">
            <div class="w-full h-full grid grid-cols-10 grid-rows-10 gap-[2px] bg-outline-variant/20 p-[2px] rounded">
              ${cellsHtml}
            </div>
          </div>
        </div>
      </section>
    </main>
  `;
}
