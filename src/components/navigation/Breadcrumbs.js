/**
 * Breadcrumbs & Pagination Components
 */

export function renderBreadcrumbs({
  items = [] // Array<{ label: string, href?: string, active?: boolean }>
}) {
  const itemsHtml = items.map((item, idx) => {
    const isLast = idx === items.length - 1;
    return `
      <li class="flex items-center gap-1.5 font-terminal-code text-xs">
        ${item.href && !isLast ? `
          <a href="${item.href}" class="text-on-surface-variant hover:text-primary transition-colors">
            ${item.label}
          </a>
        ` : `
          <span class="${isLast ? 'text-primary font-bold' : 'text-on-surface-variant'}">${item.label}</span>
        `}
        ${!isLast ? `<span class="material-symbols-outlined text-[14px] text-outline-variant">chevron_right</span>` : ''}
      </li>
    `;
  }).join('');

  return `
    <nav aria-label="Breadcrumb" class="py-2">
      <ol class="flex items-center gap-1.5">
        ${itemsHtml}
      </ol>
    </nav>
  `;
}

export function renderPagination({
  currentPage = 1,
  totalPages = 1,
  onPageChangeName = 'handlePageChange'
}) {
  if (totalPages <= 1) return '';

  return `
    <div class="flex items-center justify-center gap-2 py-4 font-terminal-code text-xs">
      <button 
        ${currentPage <= 1 ? 'disabled' : ''}
        onclick="${onPageChangeName}(${currentPage - 1})"
        class="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface disabled:opacity-40 disabled:pointer-events-none transition-colors border border-outline-variant/30 flex items-center gap-1"
      >
        <span class="material-symbols-outlined text-[14px]">chevron_left</span>
        <span>Prev</span>
      </button>

      <span class="px-3 py-1.5 text-on-surface-variant">
        Page <strong class="text-primary">${currentPage}</strong> of ${totalPages}
      </span>

      <button 
        ${currentPage >= totalPages ? 'disabled' : ''}
        onclick="${onPageChangeName}(${currentPage + 1})"
        class="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface disabled:opacity-40 disabled:pointer-events-none transition-colors border border-outline-variant/30 flex items-center gap-1"
      >
        <span>Next</span>
        <span class="material-symbols-outlined text-[14px]">chevron_right</span>
      </button>
    </div>
  `;
}
