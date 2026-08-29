/**
 * GitQuest Reusable UI Component: Cyberpunk Button, Input, Badge, and ProgressBar
 */

import { ValidationUtils } from '../../utils/ValidationUtils.js';

export function renderButton({
  id = '',
  text = '',
  variant = 'primary', // 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'outline' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon = '',
  disabled = false,
  fullWidth = false,
  className = '',
  attributes = ''
}) {
  let variantCls = 'bg-primary text-on-primary glow-primary hover:scale-[1.02] shadow-lg';
  if (variant === 'secondary') {
    variantCls = 'bg-surface-container-high text-on-surface border border-outline-variant/50 hover:bg-surface-variant';
  } else if (variant === 'tertiary') {
    variantCls = 'bg-tertiary text-on-tertiary glow-amber hover:scale-[1.02] shadow-lg';
  } else if (variant === 'outline') {
    variantCls = 'bg-transparent text-primary border border-primary/50 hover:bg-primary/10';
  } else if (variant === 'danger') {
    variantCls = 'bg-error text-on-error hover:bg-error-container';
  } else if (variant === 'ghost') {
    variantCls = 'bg-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/30';
  }

  let sizeCls = 'px-4 py-2 text-xs';
  if (size === 'sm') sizeCls = 'px-3 py-1.5 text-[11px]';
  if (size === 'lg') sizeCls = 'px-6 py-3 text-sm font-bold';

  const widthCls = fullWidth ? 'w-full' : '';
  const disabledCls = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';

  return `
    <button
      ${id ? `id="${id}"` : ''}
      class="font-terminal-label uppercase tracking-widest rounded-lg transition-all duration-200 inline-flex items-center justify-center gap-2 ${variantCls} ${sizeCls} ${widthCls} ${disabledCls} ${className}"
      ${disabled ? 'disabled' : ''}
      ${attributes}
    >
      ${icon ? `<span class="material-symbols-outlined text-[16px]">${icon}</span>` : ''}
      <span>${text}</span>
    </button>
  `;
}

export function renderInput({
  id = '',
  name = '',
  label = '',
  type = 'text',
  placeholder = '',
  value = '',
  required = false,
  error = '',
  helperText = '',
  className = ''
}) {
  return `
    <div class="space-y-1.5 ${className}">
      ${label ? `
        <label for="${id}" class="block text-terminal-label font-terminal-label text-on-surface-variant text-xs uppercase tracking-wider">
          ${label} ${required ? '<span class="text-primary">*</span>' : ''}
        </label>
      ` : ''}
      <input
        id="${id}"
        name="${name || id}"
        type="${type}"
        placeholder="${ValidationUtils.sanitizeHtml(placeholder)}"
        value="${ValidationUtils.sanitizeHtml(value)}"
        ${required ? 'required' : ''}
        class="w-full bg-surface-container-lowest border ${error ? 'border-error' : 'border-outline-variant/40'} rounded-lg px-4 py-2.5 text-on-surface font-terminal-code text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all placeholder:text-on-surface-variant/40"
      />
      ${error ? `
        <p class="text-error text-xs font-terminal-code flex items-center gap-1">
          <span class="material-symbols-outlined text-[14px]">error</span>
          ${error}
        </p>
      ` : (helperText ? `
        <p class="text-on-surface-variant/70 text-xs font-terminal-code">${helperText}</p>
      ` : '')}
    </div>
  `;
}

export function renderBadge({
  text = '',
  variant = 'primary', // 'primary' | 'secondary' | 'tertiary' | 'error' | 'surface'
  icon = '',
  size = 'sm'
}) {
  let badgeCls = 'text-primary bg-primary/10 border-primary/30';
  if (variant === 'secondary') badgeCls = 'text-secondary bg-secondary/10 border-secondary/30';
  if (variant === 'tertiary') badgeCls = 'text-tertiary bg-tertiary/10 border-tertiary/30';
  if (variant === 'error') badgeCls = 'text-error bg-error/10 border-error/30';
  if (variant === 'surface') badgeCls = 'text-on-surface-variant bg-surface-variant/50 border-outline-variant/30';

  const sizeCls = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return `
    <span class="inline-flex items-center gap-1 font-terminal-label font-bold rounded border uppercase tracking-wider ${badgeCls} ${sizeCls}">
      ${icon ? `<span class="material-symbols-outlined text-[12px]">${icon}</span>` : ''}
      ${text}
    </span>
  `;
}

export function renderProgressBar({
  current = 0,
  max = 100,
  label = '',
  showLabel = true,
  color = 'primary' // 'primary' | 'secondary' | 'tertiary'
}) {
  const pct = Math.max(0, Math.min(100, Math.round((current / (max || 1)) * 100)));
  const bgBar = color === 'secondary' ? 'bg-secondary' : (color === 'tertiary' ? 'bg-tertiary' : 'bg-primary');

  return `
    <div class="space-y-1">
      ${showLabel ? `
        <div class="flex justify-between text-xs font-terminal-label">
          <span class="text-on-surface-variant">${label}</span>
          <span class="text-on-surface font-bold">${current} / ${max} (${pct}%)</span>
        </div>
      ` : ''}
      <div class="w-full bg-surface-container-lowest h-2 rounded-full overflow-hidden border border-outline-variant/20">
        <div class="${bgBar} h-full rounded-full transition-all duration-300" style="width: ${pct}%;"></div>
      </div>
    </div>
  `;
}
