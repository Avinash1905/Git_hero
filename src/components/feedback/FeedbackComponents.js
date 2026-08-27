/**
 * GitQuest Reusable UI Component: Feedback Components (Toast Container, Empty State, Error Banner, Notification Badge)
 */

export function renderEmptyState({
  title = 'No Data Found',
  description = 'There are no active records in this registry.',
  icon = 'inbox',
  actionButtonHtml = ''
}) {
  return `
    <div class="flex flex-col items-center justify-center p-12 text-center rounded-2xl glass-panel border border-outline-variant/30 my-6">
      <div class="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mb-4 text-on-surface-variant">
        <span class="material-symbols-outlined text-3xl">${icon}</span>
      </div>
      <h3 class="text-headline-sm font-headline-sm text-on-surface font-bold mb-2">${title}</h3>
      <p class="text-on-surface-variant text-sm font-terminal-code max-w-md mb-6">${description}</p>
      ${actionButtonHtml}
    </div>
  `;
}

export function renderErrorBanner({
  title = 'Execution Error',
  message = 'An unexpected fault occurred.',
  onRetry = null
}) {
  return `
    <div class="p-4 rounded-xl bg-error/10 border border-error/30 flex items-start gap-3 my-4 animate-shake">
      <span class="material-symbols-outlined text-error text-xl mt-0.5">error</span>
      <div class="flex-1">
        <h4 class="text-error font-terminal-label text-xs uppercase font-bold tracking-wider">${title}</h4>
        <p class="text-on-surface text-sm font-terminal-code mt-1">${message}</p>
      </div>
      ${onRetry ? `
        <button class="px-3 py-1 bg-error text-on-error rounded text-xs font-terminal-label font-bold uppercase hover:bg-error-container">
          RETRY
        </button>
      ` : ''}
    </div>
  `;
}

export function renderToastItem({
  id = '',
  title = '',
  message = '',
  severity = 'info' // 'info' | 'success' | 'warning' | 'error'
}) {
  let icon = 'info';
  let borderCls = 'border-primary/40 text-primary';
  if (severity === 'success') {
    icon = 'check_circle';
    borderCls = 'border-primary/50 text-primary';
  } else if (severity === 'warning') {
    icon = 'warning';
    borderCls = 'border-tertiary/50 text-tertiary';
  } else if (severity === 'error') {
    icon = 'error';
    borderCls = 'border-error/50 text-error';
  }

  return `
    <div 
      id="toast-${id}" 
      class="glass-panel max-w-sm w-full p-4 rounded-xl border ${borderCls} shadow-2xl flex items-start gap-3 animate-slide-in pointer-events-auto"
    >
      <span class="material-symbols-outlined text-xl mt-0.5">${icon}</span>
      <div class="flex-1">
        <h5 class="font-terminal-label text-xs font-bold uppercase tracking-wider">${title}</h5>
        <p class="text-on-surface text-xs font-terminal-code mt-0.5">${message}</p>
      </div>
      <button onclick="document.getElementById('toast-${id}')?.remove()" class="text-on-surface-variant hover:text-on-surface p-0.5">
        <span class="material-symbols-outlined text-sm">close</span>
      </button>
    </div>
  `;
}
