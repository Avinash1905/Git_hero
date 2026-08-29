/**
 * GitQuest Reusable UI Component: HUD Components (LiveTimer, StarDisplay, BranchIndicator, HealthBar)
 */

import { Formatters } from '../../utils/Formatters.js';

export function renderLiveTimer(seconds = 0, isRunning = false) {
  return `
    <div id="game-live-timer-container" class="flex items-center gap-1.5 px-3 py-1 bg-surface-container rounded-lg border border-outline-variant/30 text-on-surface font-hud-stat text-sm">
      <span class="material-symbols-outlined text-[16px] ${isRunning ? 'text-primary animate-pulse' : 'text-on-surface-variant'}">timer</span>
      <span id="game-live-timer">${Formatters.formatTime(seconds)}</span>
    </div>
  `;
}

export function renderStarDisplay(earnedStars = 0, maxStars = 3) {
  const starsHtml = [];
  for (let i = 1; i <= maxStars; i++) {
    if (i <= earnedStars) {
      starsHtml.push(`<span class="material-symbols-outlined text-[16px] text-tertiary" style="font-variation-settings: 'FILL' 1;">star</span>`);
    } else {
      starsHtml.push(`<span class="material-symbols-outlined text-[16px] text-outline-variant/40" style="font-variation-settings: 'FILL' 0;">star</span>`);
    }
  }
  return `<div class="flex items-center gap-0.5">${starsHtml.join('')}</div>`;
}

export function renderBranchIndicator(branchName = 'main', isDetached = false) {
  return `
    <div class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface-container-high/90 rounded-md border border-outline-variant/40 text-xs font-terminal-code">
      <span class="material-symbols-outlined text-[14px] ${isDetached ? 'text-error' : 'text-primary'}">alt_route</span>
      <span class="text-on-surface font-bold">${branchName}</span>
      ${isDetached ? '<span class="text-error text-[10px] uppercase font-bold">(DETACHED)</span>' : ''}
    </div>
  `;
}

export function renderHealthBar(lives = 3, maxLives = 3) {
  const heartsHtml = [];
  for (let i = 1; i <= maxLives; i++) {
    if (i <= lives) {
      heartsHtml.push(`<span class="material-symbols-outlined text-error text-[18px]" style="font-variation-settings: 'FILL' 1;">favorite</span>`);
    } else {
      heartsHtml.push(`<span class="material-symbols-outlined text-outline-variant/40 text-[18px]" style="font-variation-settings: 'FILL' 0;">favorite</span>`);
    }
  }
  return `<div class="flex items-center gap-1">${heartsHtml.join('')}</div>`;
}
