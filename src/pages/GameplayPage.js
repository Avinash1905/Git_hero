/**
 * GameplayPage
 * Assembles active puzzle arena, top HUD, virtual movement controls, and fixed CLI terminal.
 */

import { GameplayHUD } from '../features/gameplay/GameplayHUD.js';
import { GridTileRenderer } from '../features/gameplay/GridTileRenderer.js';
import { TerminalView } from '../features/terminal/TerminalView.js';
import { GameControls } from '../features/gameplay/GameControls.js';

export function renderGameplayPage(gameState, terminalLogs = []) {
  if (!gameState) {
    return `<div class="min-h-screen flex items-center justify-center text-primary font-terminal-code">Initializing Game Engine...</div>`;
  }

  const hudHtml = GameplayHUD.renderHUDHtml(gameState);
  const gridHtml = GridTileRenderer.renderGridHtml(gameState);
  const terminalHtml = TerminalView.renderTerminalHtml(terminalLogs, gameState.goal?.branchName || 'main');
  const controlsHtml = GameControls.renderControlsHtml();

  return `
    <main class="min-h-screen pt-16 pb-20 px-2 sm:px-4 max-w-7xl mx-auto flex flex-col justify-between">
      <!-- Top HUD -->
      ${hudHtml}

      <!-- Main Stage Split View (Arena + Controls vs Terminal) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 items-start">
        <!-- Left / Center: 2D Arena & Touch Controls (7 cols on lg) -->
        <div class="lg:col-span-7 flex flex-col items-center justify-center space-y-4">
          <div class="w-full flex items-center justify-center p-2 sm:p-4 glass-panel rounded-2xl border border-outline-variant/30 relative overflow-hidden shadow-2xl">
            ${gridHtml}
          </div>

          <!-- Mobile / Touch Controls -->
          <div class="w-full glass-panel rounded-xl border border-outline-variant/30 flex items-center justify-center">
            ${controlsHtml}
          </div>
        </div>

        <!-- Right: Fixed Interactive Git CLI Terminal (5 cols on lg) -->
        <div class="lg:col-span-5 h-[480px] lg:h-[620px] sticky top-20">
          ${terminalHtml}
        </div>
      </div>
    </main>
  `;
}
