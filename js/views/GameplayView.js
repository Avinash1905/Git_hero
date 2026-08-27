// GameplayView - 100% faithful to Stitch Level 07 & Core Gameplay HUD
// Features Enhanced Large Directional Buttons, Multi-Step Mission Tracker & Fixed Stationary Arena

export function generateGridTilesHtml(gameState) {
  const gridSize = gameState.gridSize || 6;
  let tilesHtml = '';

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const isPlayer = gameState.player.x === x && gameState.player.y === y;
      const isBox = gameState.box.x === x && gameState.box.y === y;
      const isGoal = gameState.goal.x === x && gameState.goal.y === y;
      const isWall = gameState.walls.some(w => w.x === x && w.y === y);
      const isHazard = gameState.hazards.some(h => h.x === x && h.y === y);

      let cellClass = 'bg-surface-container-low grid-tile rounded-sm flex items-center justify-center relative overflow-hidden';
      let content = '';

      if (isWall) {
        cellClass = 'bg-surface-variant grid-tile rounded-sm';
      } else if (isHazard) {
        cellClass = 'bg-error/20 border border-error/50 grid-tile rounded-sm flex items-center justify-center';
        content = `<span class="material-symbols-outlined text-error text-sm">warning</span>`;
      } else if (isGoal && !isBox) {
        cellClass = 'bg-primary-container/20 grid-tile rounded-sm border border-primary shadow-[0_0_15px_#4edea340] flex items-center justify-center relative overflow-hidden';
        content = `
          <div class="absolute inset-0 bg-primary/10 animate-pulse"></div>
          <span class="material-symbols-outlined text-primary" style="font-variation-settings: 'FILL' 1;">flag</span>
        `;
      }

      if (isBox) {
        const onGoal = isGoal;
        cellClass = `${onGoal ? 'bg-primary-container border-2 border-primary glow-primary' : 'bg-tertiary-fixed'} grid-tile rounded-sm shadow-md flex items-center justify-center relative transform transition-all duration-100`;
        content = `
          <span class="material-symbols-outlined ${onGoal ? 'text-on-primary-container' : 'text-on-tertiary-fixed'}">package_2</span>
          <div class="absolute -top-1 -right-1 w-3 h-3 rounded-full ${onGoal ? 'bg-primary border-2 border-surface-dim' : 'bg-error border-2 border-surface-dim'}"></div>
        `;
      }

      if (isPlayer) {
        let rotationClass = 'rotate-45';
        if (gameState.player.dir === 'right') rotationClass = 'rotate-90';
        else if (gameState.player.dir === 'down') rotationClass = 'rotate-180';
        else if (gameState.player.dir === 'left') rotationClass = '-rotate-90';

        content = `
          <div class="w-8 h-8 bg-secondary ${rotationClass} shadow-[0_0_15px_#adc6ff60] flex items-center justify-center transition-all duration-100 z-20">
            <div class="w-4 h-4 bg-on-secondary border border-secondary rotate-45"></div>
          </div>
        `;
      }

      tilesHtml += `<div class="${cellClass}" data-x="${x}" data-y="${y}">${content}</div>`;
    }
  }

  return tilesHtml;
}

export function renderGameplayView(gameState, gitCli) {
  const level = gameState.levelDef;
  const tilesHtml = generateGridTilesHtml(gameState);

  // Multi-step objective status checking
  const onGoal = gameState.checkGoal();
  const objectives = level.objectives || [
    'Inspect repository status with git status',
    'Maneuver payload to target node',
    'Execute git commit to resolve level'
  ];

  // Render Terminal Logs
  const terminalLogsHtml = gitCli.logs.map(log => {
    if (log.type === 'cmd') {
      return `
        <div class="flex items-center gap-2">
          <span class="text-primary font-bold">$</span>
          <span class="text-on-surface">${log.text}</span>
        </div>
      `;
    }
    if (log.type === 'movement') {
      return `
        <div class="text-on-surface-variant pl-4 my-1 space-y-0.5 font-terminal-code text-xs">
          <div class="text-on-surface-variant">${log.detail}</div>
          <div class="text-primary text-sm font-bold">${log.result}</div>
        </div>
      `;
    }
    if (log.type === 'status') {
      return `
        <div class="text-on-surface-variant pl-4 border-l-2 border-surface-variant my-1 space-y-0.5">
          <div class="text-xs">On ${log.branch}</div>
          <div class="text-on-surface text-sm">Objective: ${log.objective}</div>
          <div class="${log.boxStatus.includes('READY') ? 'text-primary font-bold' : 'text-tertiary'} text-xs">Box: ${log.boxStatus}</div>
          <div class="text-secondary text-xs">Progress: ${log.progress}</div>
        </div>
      `;
    }
    if (log.type === 'push' || log.type === 'pull') {
      return `
        <div class="text-on-surface-variant pl-4 my-1 space-y-0.5">
          <div class="text-on-surface-variant text-xs">${log.detail}</div>
          <div class="text-primary text-sm">${log.result}</div>
        </div>
      `;
    }
    if (log.type === 'commit_success') {
      return `
        <div class="text-primary pl-4 border-l-2 border-primary my-1 space-y-0.5">
          <div class="font-bold">[${log.branch} ${log.commitHash}] ${log.message}</div>
          <div class="text-xs text-on-surface-variant">${log.filesChanged}</div>
        </div>
      `;
    }
    if (log.type === 'error') {
      return `
        <div class="text-error pl-4 text-xs font-terminal-code my-1">
          ${log.text.replace(/\n/g, '<br/>')}
        </div>
      `;
    }
    return `
      <div class="text-on-surface-variant text-xs pl-4 font-terminal-code my-1">
        ${(log.text || '').replace(/\n/g, '<br/>')}
      </div>
    `;
  }).join('');

  return `
    <div class="min-h-screen bg-background text-on-background flex flex-col pt-16 pb-20 md:pb-0 overflow-x-hidden">
      <!-- Gameplay Center HUD Strip -->
      <div class="w-full bg-surface-container-high/60 border-b border-outline-variant/30 px-hud-margin py-2 flex items-center justify-between z-40 backdrop-blur-md">
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2 bg-surface-container/80 px-4 py-1 rounded-full border border-outline-variant/30">
            <span class="text-terminal-label font-terminal-label text-on-surface-variant uppercase">World 0${level.world || 1}</span>
            <span class="text-on-surface-variant mx-1">/</span>
            <span class="text-hud-stat font-hud-stat text-on-surface">Level ${level.id}</span>
            <span class="text-xs px-2 py-0.5 rounded bg-primary/20 text-primary font-terminal-label font-bold ml-1">${level.difficulty || 'MEDIUM'}</span>
          </div>

          <div class="hidden sm:flex items-center gap-2 bg-surface-container/80 px-4 py-1 rounded-full border border-outline-variant/30">
            <span class="text-terminal-label font-terminal-label text-tertiary">XP</span>
            <span class="text-hud-stat font-hud-stat text-tertiary-fixed">${gameState.xp || 2450}</span>
          </div>

          <div class="flex items-center gap-2 bg-surface-container/80 px-3 py-1 rounded-full border border-outline-variant/30">
            <span class="material-symbols-outlined text-primary text-sm">timer</span>
            <span id="game-live-timer" class="text-hud-stat font-hud-stat text-primary font-mono">${gameState.getFormattedTime()}</span>
          </div>
        </div>

        <!-- Right HUD Controls -->
        <div class="flex items-center gap-2">
          <!-- Lives Hearts -->
          <div class="flex items-center gap-1 text-error mr-2">
            <span class="material-symbols-outlined text-[18px]" style="font-variation-settings: 'FILL' 1;">favorite</span>
            <span class="material-symbols-outlined text-[18px]" style="font-variation-settings: 'FILL' 1;">favorite</span>
            <span class="material-symbols-outlined text-[18px]" style="font-variation-settings: 'FILL' 1;">favorite</span>
          </div>

          <button id="btn-undo-move" title="Undo Move (Ctrl+Z)" class="p-2 rounded-lg bg-surface-container text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center border border-outline-variant/30">
            <span class="material-symbols-outlined text-sm">undo</span>
          </button>
          <button id="btn-reset-level" title="Reset Level" class="p-2 rounded-lg bg-surface-container text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center border border-outline-variant/30">
            <span class="material-symbols-outlined text-sm">restart_alt</span>
          </button>
        </div>
      </div>

      <!-- Main Layout: Split Grid Arena and Terminal -->
      <main class="flex-grow flex flex-col lg:flex-row p-hud-margin gap-6 max-w-7xl mx-auto w-full items-stretch">
        <!-- FIXED GAME FRAME: Stationary 2D Grid Arena -->
        <section class="flex-1 flex flex-col items-center justify-center bg-surface-container-lowest rounded-xl shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] border border-surface-variant p-6 relative overflow-hidden min-h-[460px]">
          <!-- Background decorative grid -->
          <div class="absolute inset-0 opacity-15 bg-[radial-gradient(#4edea3_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>
          
          <!-- Directional Key Hint -->
          <div class="w-full max-w-[440px] flex items-center justify-between text-xs text-on-surface-variant font-terminal-label mb-2 px-1">
            <span class="flex items-center gap-1"><span class="text-primary">●</span> ARENA FRAME (FIXED)</span>
            <span class="text-[11px] opacity-75 font-terminal-code">${level.name}</span>
          </div>

          <!-- The Fixed 2D Grid (6x6) -->
          <div id="game-puzzle-grid" class="relative z-10 w-full max-w-[440px] aspect-square grid grid-cols-6 grid-rows-6 gap-grid-gutter bg-surface-dim p-2 rounded-lg border border-outline-variant/40 shadow-2xl">
            ${tilesHtml}
          </div>

          <!-- LARGER, HIGH-TACTILE 4-DIRECTIONAL MOVEMENT CONTROLS -->
          <div class="mt-6 flex flex-col items-center gap-3 z-20">
            <!-- UP [ ↑ ] -->
            <button id="btn-dpad-up" class="w-20 h-16 sm:w-24 sm:h-18 bg-surface-container hover:bg-surface-variant text-on-surface border-2 border-outline-variant/70 rounded-2xl flex items-center justify-center hover:border-primary hover:text-primary hover:shadow-[0_0_25px_rgba(78,222,163,0.45)] transition-all duration-150 shadow-xl active:scale-95 cursor-pointer group" title="Move Up (↑ / W)">
              <span class="material-symbols-outlined text-[32px] sm:text-[36px] group-hover:-translate-y-1 transition-transform">arrow_upward</span>
            </button>
            
            <!-- LEFT [ ← ] | DOWN [ ↓ ] | RIGHT [ → ] -->
            <div class="flex items-center gap-3">
              <button id="btn-dpad-left" class="w-20 h-16 sm:w-24 sm:h-18 bg-surface-container hover:bg-surface-variant text-on-surface border-2 border-outline-variant/70 rounded-2xl flex items-center justify-center hover:border-primary hover:text-primary hover:shadow-[0_0_25px_rgba(78,222,163,0.45)] transition-all duration-150 shadow-xl active:scale-95 cursor-pointer group" title="Move Left (← / A)">
                <span class="material-symbols-outlined text-[32px] sm:text-[36px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
              </button>
              
              <button id="btn-dpad-down" class="w-20 h-16 sm:w-24 sm:h-18 bg-surface-container hover:bg-surface-variant text-on-surface border-2 border-outline-variant/70 rounded-2xl flex items-center justify-center hover:border-primary hover:text-primary hover:shadow-[0_0_25px_rgba(78,222,163,0.45)] transition-all duration-150 shadow-xl active:scale-95 cursor-pointer group" title="Move Down (↓ / S)">
                <span class="material-symbols-outlined text-[32px] sm:text-[36px] group-hover:translate-y-1 transition-transform">arrow_downward</span>
              </button>
              
              <button id="btn-dpad-right" class="w-20 h-16 sm:w-24 sm:h-18 bg-surface-container hover:bg-surface-variant text-on-surface border-2 border-outline-variant/70 rounded-2xl flex items-center justify-center hover:border-primary hover:text-primary hover:shadow-[0_0_25px_rgba(78,222,163,0.45)] transition-all duration-150 shadow-xl active:scale-95 cursor-pointer group" title="Move Right (→ / D)">
                <span class="material-symbols-outlined text-[32px] sm:text-[36px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>

        <!-- Right Fixed Terminal & Objective Tracker (40%) -->
        <section class="w-full lg:w-[480px] h-[580px] max-h-[580px] glass-panel rounded-xl flex flex-col relative z-20 shadow-2xl overflow-hidden shrink-0">
          <!-- Terminal Header -->
          <div class="h-9 bg-surface-container-high/80 border-b border-outline-variant/30 flex items-center justify-between px-4 shrink-0">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-error/60"></div>
              <div class="w-3 h-3 rounded-full bg-tertiary/60"></div>
              <div class="w-3 h-3 rounded-full bg-primary/60"></div>
              <span class="text-terminal-label font-terminal-label text-on-surface-variant ml-2">~/gitquest/terminal</span>
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
              ${objectives.map((obj, i) => {
                const isChecked = (i === 0 && gameState.statusCount > 0) || (i === 1 && onGoal) || (i === 2 && gameState.isCommitted);
                return `
                  <li class="flex items-center gap-2 ${isChecked ? 'text-primary' : 'text-on-surface-variant/80'}">
                    <span class="material-symbols-outlined text-[14px] ${isChecked ? 'text-primary' : 'text-outline-variant'}">${isChecked ? 'check_box' : 'check_box_outline_blank'}</span>
                    <span>${obj}</span>
                  </li>
                `;
              }).join('')}
            </ul>
          </div>

          <!-- Terminal Content Output: Fixed Viewport with Internal History Scroll -->
          <div id="terminal-output-body" class="flex-1 p-4 overflow-y-auto text-terminal-code font-terminal-code text-on-surface space-y-2 text-sm select-text min-h-0 custom-scrollbar">
            ${terminalLogsHtml}
          </div>

          <!-- Terminal Interactive Input Bar (Permanently Pinned at Bottom) -->
          <form id="terminal-input-form" class="p-3 bg-surface-container-highest/60 border-t border-outline-variant/30 flex items-center gap-2 shrink-0">
            <span class="text-primary font-bold font-terminal-code">$</span>
            <input 
              id="terminal-cmd-input" 
              type="text" 
              autocomplete="off" 
              autocorrect="off" 
              autocapitalize="off" 
              spellcheck="false"
              placeholder="git push, git pull, git status, git commit, git left..." 
              class="flex-grow bg-transparent font-terminal-code text-terminal-code text-sm text-on-surface outline-none border-none placeholder:text-on-surface-variant/40"
            />
            <button type="submit" class="px-3 py-1 bg-primary/20 text-primary border border-primary/40 rounded text-xs font-terminal-label hover:bg-primary hover:text-on-primary transition-colors cursor-pointer">
              EXEC
            </button>
          </form>
        </section>
      </main>
    </div>
  `;
}
