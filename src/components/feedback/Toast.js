/**
 * Toast & EmptyState Feedback Components
 */

export function renderToast({
  id = '',
  message = '',
  type = 'info', // 'info' | 'success' | 'warning' | 'error'
  title = ''
}) {
  let icon = 'info';
  let borderCol = 'border-primary/40 text-primary';
  if (type === 'success') {
    icon = 'check_circle';
    borderCol = 'border-primary/50 text-primary';
  } else if (type === 'warning') {
    icon = 'warning';
    borderCol = 'border-tertiary/50 text-tertiary';
  } else if (type === 'error') {
    icon = 'error';
    borderCol = 'border-error/50 text-error';
  }

  return `
    <div 
      id="toast-${id}" 
      class="glass-panel p-3.5 rounded-xl border ${borderCol} shadow-2xl flex items-start gap-3 max-w-sm animate-slide-up pointer-events-auto select-none"
    >
      <span class="material-symbols-outlined text-[20px] shrink-0 mt-0.5">${icon}</span>
      <div class="flex-1 font-terminal-code text-xs">
        ${title ? `<div class="font-bold text-on-surface mb-0.5">${title}</div>` : ''}
        <div class="text-on-surface-variant leading-relaxed">${message}</div>
      </div>
      <button 
        onclick="document.getElementById('toast-${id}')?.remove()" 
        class="text-on-surface-variant/60 hover:text-on-surface cursor-pointer shrink-0"
      >
        <span class="material-symbols-outlined text-[16px]">close</span>
      </button>
    </div>
  `;
}

export function renderEmptyState({
  icon = 'inbox',
  title = 'No Records Found',
  description = 'There are no active entries to display for the selected parameters.',
  actionText = '',
  actionId = ''
}) {
  return `
    <div class="glass-panel p-10 rounded-2xl border border-outline-variant/30 text-center space-y-3 font-terminal-code my-4">
      <div class="w-12 h-12 rounded-2xl bg-surface-container-high text-on-surface-variant/60 flex items-center justify-center mx-auto">
        <span class="material-symbols-outlined text-2xl">${icon}</span>
      </div>
      <h3 class="font-headline-sm font-bold text-on-surface text-base">${title}</h3>
      <p class="text-xs text-on-surface-variant max-w-sm mx-auto leading-relaxed">${description}</p>
      ${actionText ? `
        <div class="pt-2">
          <button 
            id="${actionId}" 
            class="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-on-primary font-terminal-label text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            ${actionText}
          </button>
        </div>
      ` : ''}
    </div>
  `;
}
