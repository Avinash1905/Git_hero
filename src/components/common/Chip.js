/**
 * Chip & Spinner UI Components
 */

export function renderChip({
  label = '',
  icon = '',
  variant = 'primary', // 'primary' | 'secondary' | 'tertiary' | 'outline' | 'error'
  removable = false,
  className = ''
}) {
  let colorCls = 'bg-primary/10 text-primary border-primary/30';
  if (variant === 'secondary') colorCls = 'bg-secondary/10 text-secondary border-secondary/30';
  if (variant === 'tertiary') colorCls = 'bg-tertiary/10 text-tertiary border-tertiary/30';
  if (variant === 'error') colorCls = 'bg-error/10 text-error border-error/30';
  if (variant === 'outline') colorCls = 'bg-transparent text-on-surface-variant border-outline-variant/40';

  return `
    <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-terminal-label border ${colorCls} ${className}">
      ${icon ? `<span class="material-symbols-outlined text-[14px]">${icon}</span>` : ''}
      <span>${label}</span>
      ${removable ? `
        <button type="button" class="ml-1 hover:opacity-75 cursor-pointer flex items-center">
          <span class="material-symbols-outlined text-[12px]">close</span>
        </button>
      ` : ''}
    </span>
  `;
}

export function renderSpinner({
  size = 'md', // 'sm' | 'md' | 'lg'
  label = 'Loading...',
  className = ''
}) {
  let sizeClass = 'w-6 h-6 border-2';
  if (size === 'sm') sizeClass = 'w-4 h-4 border-2';
  if (size === 'lg') sizeClass = 'w-10 h-10 border-3';

  return `
    <div class="flex flex-col items-center justify-center gap-2 p-4 ${className}">
      <div class="${sizeClass} border-primary border-t-transparent rounded-full animate-spin"></div>
      ${label ? `<span class="text-xs text-on-surface-variant font-terminal-code">${label}</span>` : ''}
    </div>
  `;
}
