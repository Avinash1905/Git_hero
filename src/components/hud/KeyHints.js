/**
 * KeyHints & StarDisplay Components
 */

export function renderKeyHints({
  hints = [
    { key: 'W/A/S/D', label: 'Move' },
    { key: 'Ctrl+Z', label: 'Undo' },
    { key: 'Tab', label: 'Autocomplete' },
    { key: '↑/↓', label: 'History' }
  ]
}) {
  const hintsHtml = hints.map((h) => `
    <div class="flex items-center gap-1.5 font-terminal-code text-xs text-on-surface-variant">
      <kbd class="px-1.5 py-0.5 rounded bg-surface-container-high border border-outline-variant/30 text-on-surface text-[11px] font-mono shadow-sm">
        ${h.key}
      </kbd>
      <span class="text-[11px]">${h.label}</span>
    </div>
  `).join('');

  return `
    <div class="flex flex-wrap items-center gap-4 py-2 px-3 bg-surface-container-lowest/60 rounded-lg border border-outline-variant/20">
      ${hintsHtml}
    </div>
  `;
}

export function renderStarDisplay({
  stars = 0,
  maxStars = 3,
  size = 'md' // 'sm' | 'md' | 'lg'
}) {
  let sizeClass = 'text-[16px]';
  if (size === 'sm') sizeClass = 'text-[12px]';
  if (size === 'lg') sizeClass = 'text-[24px]';

  const starsHtml = Array.from({ length: maxStars }, (_, i) => i + 1).map((s) => {
    const isEarned = s <= stars;
    return `
      <span 
        class="material-symbols-outlined ${sizeClass} ${isEarned ? 'text-tertiary drop-shadow-[0_0_8px_#ffb95f]' : 'text-outline-variant/30'}"
        style="font-variation-settings: 'FILL' ${isEarned ? 1 : 0};"
      >
        star
      </span>
    `;
  }).join('');

  return `
    <div class="flex items-center gap-0.5" aria-label="${stars} out of ${maxStars} stars">
      ${starsHtml}
    </div>
  `;
}
