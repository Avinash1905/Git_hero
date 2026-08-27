/**
 * Accordion & Tooltip UI Components
 */

export function renderAccordionItem({
  id = '',
  title = '',
  content = '',
  isOpen = false,
  badge = ''
}) {
  return `
    <div class="border border-outline-variant/30 rounded-xl overflow-hidden glass-panel">
      <button 
        type="button"
        class="accordion-header w-full px-4 py-3 bg-surface-container/60 hover:bg-surface-container flex items-center justify-between transition-colors text-left select-none cursor-pointer"
        data-accordion-target="${id}"
        aria-expanded="${isOpen ? 'true' : 'false'}"
      >
        <span class="font-headline-sm font-semibold text-sm text-on-surface flex items-center gap-2">
          <span>${title}</span>
          ${badge ? `<span class="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded font-terminal-label">${badge}</span>` : ''}
        </span>
        <span class="material-symbols-outlined text-[18px] text-on-surface-variant transform transition-transform duration-200 ${isOpen ? 'rotate-180 text-primary' : ''}">
          keyboard_arrow_down
        </span>
      </button>
      <div 
        id="${id}" 
        class="accordion-content px-4 py-3 bg-surface-container-lowest/80 text-xs text-on-surface-variant font-terminal-code leading-relaxed ${isOpen ? '' : 'hidden'}"
      >
        ${content}
      </div>
    </div>
  `;
}

export function renderTooltip({
  text = '',
  position = 'top', // 'top' | 'bottom' | 'left' | 'right'
  childrenHtml = ''
}) {
  let posClass = 'bottom-full left-1/2 -translate-x-1/2 mb-2';
  if (position === 'bottom') posClass = 'top-full left-1/2 -translate-x-1/2 mt-2';
  if (position === 'left') posClass = 'right-full top-1/2 -translate-y-1/2 mr-2';
  if (position === 'right') posClass = 'left-full top-1/2 -translate-y-1/2 ml-2';

  return `
    <div class="relative group inline-block">
      ${childrenHtml}
      <div class="absolute ${posClass} hidden group-hover:block z-30 px-2.5 py-1 text-[11px] font-terminal-code text-on-surface bg-surface-container-highest border border-outline-variant/50 rounded-md shadow-xl whitespace-nowrap pointer-events-none transition-opacity duration-150">
        ${text}
      </div>
    </div>
  `;
}
