/**
 * Dropdown & Tabs UI Components
 * Stitch-compliant accessible select dropdowns and interactive tab strips.
 */

export function renderDropdown({
  id = '',
  name = '',
  label = '',
  options = [], // Array<{ value: string, label: string, selected?: boolean }>
  className = '',
  disabled = false,
  helperText = ''
}) {
  const optionsHtml = options.map((opt) => `
    <option value="${opt.value}" ${opt.selected ? 'selected' : ''}>
      ${opt.label}
    </option>
  `).join('');

  return `
    <div class="space-y-1 ${className}">
      ${label ? `
        <label for="${id}" class="block text-terminal-label font-terminal-label text-xs text-on-surface-variant uppercase tracking-wider">
          ${label}
        </label>
      ` : ''}
      <div class="relative">
        <select 
          ${id ? `id="${id}"` : ''} 
          ${name ? `name="${name}"` : ''}
          ${disabled ? 'disabled' : ''}
          class="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg px-3.5 py-2 text-on-surface font-terminal-code text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all appearance-none cursor-pointer pr-8"
        >
          ${optionsHtml}
        </select>
        <span class="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[16px]">
          expand_more
        </span>
      </div>
      ${helperText ? `<p class="text-[10px] text-on-surface-variant/70 font-terminal-code">${helperText}</p>` : ''}
    </div>
  `;
}

export function renderTabs({
  id = '',
  tabs = [], // Array<{ id: string, label: string, active?: boolean, count?: number }>
  className = ''
}) {
  const tabsHtml = tabs.map((tab) => `
    <button 
      data-tab-id="${tab.id}"
      class="px-4 py-2 text-xs font-terminal-label uppercase tracking-wider transition-all cursor-pointer rounded-lg flex items-center gap-1.5 ${tab.active ? 'bg-primary text-on-primary font-bold shadow-md' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/40'}"
    >
      <span>${tab.label}</span>
      ${tab.count !== undefined ? `<span class="px-1.5 py-0.2 rounded-full text-[10px] ${tab.active ? 'bg-on-primary/20 text-on-primary' : 'bg-surface-container-high text-on-surface-variant'}">${tab.count}</span>` : ''}
    </button>
  `).join('');

  return `
    <div ${id ? `id="${id}"` : ''} class="flex items-center gap-1.5 p-1 bg-surface-container-high/60 rounded-xl border border-outline-variant/20 overflow-x-auto scrollbar-thin ${className}">
      ${tabsHtml}
    </div>
  `;
}
