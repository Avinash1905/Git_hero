/**
 * GitQuest Reusable UI Component: Card Components (Stat Bento Card, Level Card, Achievement Card, Leaderboard Row)
 */

import { renderStarDisplay } from '../hud/HUDComponents.js';
import { ColorUtils } from '../../utils/ColorUtils.js';

export function renderStatBentoCard({
  title = '',
  value = '',
  icon = '',
  subtitle = '',
  accentColor = 'primary', // 'primary' | 'secondary' | 'tertiary'
  className = ''
}) {
  let textAccent = 'text-primary';
  let iconAccent = 'text-primary';
  if (accentColor === 'secondary') {
    textAccent = 'text-secondary';
    iconAccent = 'text-secondary';
  } else if (accentColor === 'tertiary') {
    textAccent = 'text-tertiary';
    iconAccent = 'text-tertiary';
  }

  return `
    <div class="glass-panel rounded-xl p-md flex flex-col justify-between ${className}">
      <div class="flex items-center justify-between mb-sm">
        <span class="text-terminal-label font-terminal-label text-on-surface-variant text-xs">${title}</span>
        ${icon ? `<span class="material-symbols-outlined ${iconAccent} text-xl">${icon}</span>` : ''}
      </div>
      <div class="text-headline-md font-headline-md ${textAccent} font-bold my-1">${value}</div>
      ${subtitle ? `<div class="text-xs text-on-surface-variant/80 font-terminal-code">${subtitle}</div>` : ''}
    </div>
  `;
}

export function renderLevelCard({
  level,
  thumbnailUrl = '',
  onClickAttribute = ''
}) {
  const isCompleted = level.status === 'COMPLETED';
  const isUnlocked = level.unlocked || level.status === 'UNLOCKED' || level.status === 'IN_PROGRESS' || isCompleted;
  const isActive = isUnlocked && !isCompleted;
  const diffBadge = ColorUtils.getDifficultyBadgeClass(level.difficulty);

  return `
    <article 
      data-level-id="${level.id}" 
      data-unlocked="${isUnlocked ? 'true' : 'false'}"
      class="hud-panel rounded-xl overflow-hidden level-card relative group transition-all duration-200 ${isUnlocked ? 'cursor-pointer hover:scale-[1.03] hover:shadow-[0_0_20px_#4edea330]' : 'opacity-60 cursor-not-allowed border border-outline-variant/20'}"
      ${onClickAttribute}
    >
      <div class="relative w-full aspect-video bg-surface-dim overflow-hidden">
        <img class="w-full h-full object-cover ${isCompleted ? 'opacity-80 group-hover:opacity-100' : (isUnlocked ? 'opacity-50 group-hover:opacity-80' : 'opacity-25 grayscale')} transition-all duration-300" alt="${level.name}" src="${thumbnailUrl}">
        <div class="absolute inset-0 bg-gradient-to-t from-surface-container to-transparent opacity-80"></div>
        
        <!-- Status Badge -->
        <div class="absolute top-sm right-sm">
          ${isCompleted ? `
            <span class="bg-primary text-on-primary px-2.5 py-1 rounded text-terminal-label font-terminal-label font-bold shadow-md flex items-center gap-1 text-[11px]">
              <span class="material-symbols-outlined text-[14px]">check</span> COMPLETED
            </span>
          ` : (isActive ? `
            <span class="bg-secondary text-on-secondary px-2.5 py-1 rounded text-terminal-label font-terminal-label font-bold animate-pulse shadow-md flex items-center gap-1 text-[11px]">
              <span class="material-symbols-outlined text-[14px]">play_arrow</span> AVAILABLE
            </span>
          ` : `
            <span class="bg-surface-variant/90 text-on-surface-variant px-2.5 py-1 rounded text-terminal-label font-terminal-label border border-outline-variant/40 flex items-center gap-1 backdrop-blur-sm text-[11px]">
              <span class="material-symbols-outlined text-[14px]">lock</span> LOCKED
            </span>
          `)}
        </div>

        <div class="absolute bottom-sm left-sm">
          <span class="px-2 py-0.5 rounded text-[10px] font-terminal-label font-bold border ${diffBadge}">
            ${level.difficulty}
          </span>
        </div>
      </div>

      <div class="p-md">
        <div class="flex justify-between items-start mb-2">
          <div>
            <span class="text-[10px] text-on-surface-variant font-terminal-label uppercase tracking-wider">World ${level.world}</span>
            <h3 class="text-headline-sm font-headline-sm text-on-surface ${isUnlocked ? 'group-hover:text-primary' : ''} transition-colors text-base font-bold">Level ${level.id}: ${level.name}</h3>
          </div>
          <div>
            ${renderStarDisplay(isCompleted ? (level.stars || 3) : 0)}
          </div>
        </div>
        
        <p class="text-body-md font-body-md text-on-surface-variant text-xs line-clamp-2 mb-md">
          ${level.description}
        </p>

        <div class="flex justify-between items-center pt-sm border-t border-outline-variant/30 text-xs">
          <span class="text-terminal-label font-terminal-label text-tertiary font-bold">+${level.xpReward} XP</span>
          <span class="text-terminal-code font-terminal-code text-on-surface-variant text-[11px]">${level.commitsReq} commits req.</span>
        </div>
      </div>
    </article>
  `;
}
