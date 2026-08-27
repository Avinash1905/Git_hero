/**
 * GitQuest Reusable UI Component: Navigation Components (Sidebar, Mobile Drawer, Breadcrumbs, Pagination)
 */

export function renderBreadcrumbs(crumbs = [{ label: 'Home', route: 'hero' }]) {
  const itemsHtml = crumbs.map((crumb, idx) => {
    const isLast = idx === crumbs.length - 1;
    if (isLast) {
      return `<span class="text-primary font-bold font-terminal-label text-xs uppercase">${crumb.label}</span>`;
    }
    return `
      <a href="#${crumb.route}" class="text-on-surface-variant hover:text-on-surface transition-colors font-terminal-label text-xs uppercase">
        ${crumb.label}
      </a>
      <span class="material-symbols-outlined text-[14px] text-outline-variant/60">chevron_right</span>
    `;
  }).join('');

  return `
    <nav aria-label="Breadcrumb" class="flex items-center gap-1.5 py-2">
      ${itemsHtml}
    </nav>
  `;
}

export function renderPagination({
  currentPage = 1,
  totalPages = 10,
  onPageChangeCallbackName = 'onPageSelect'
}) {
  const pagesHtml = [];
  for (let i = 1; i <= totalPages; i++) {
    const isCurrent = i === currentPage;
    pagesHtml.push(`
      <button 
        data-page="${i}"
        class="w-8 h-8 rounded-lg font-terminal-label text-xs font-bold transition-all ${isCurrent ? 'bg-primary text-on-primary glow-primary' : 'bg-surface-container text-on-surface hover:bg-surface-container-high'}"
      >
        ${i}
      </button>
    `);
  }

  return `
    <div class="flex items-center justify-center gap-2 py-4">
      <button 
        ${currentPage <= 1 ? 'disabled' : ''}
        class="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high disabled:opacity-40 disabled:pointer-events-none text-xs font-terminal-label"
      >
        PREV
      </button>
      <div class="flex items-center gap-1.5">
        ${pagesHtml.join('')}
      </div>
      <button 
        ${currentPage >= totalPages ? 'disabled' : ''}
        class="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high disabled:opacity-40 disabled:pointer-events-none text-xs font-terminal-label"
      >
        NEXT
      </button>
    </div>
  `;
}

export function renderSidebarNav({ activeRoute = 'dashboard' }) {
  const links = [
    { route: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { route: 'levels', label: 'Level Selection', icon: 'grid_view' },
    { route: 'world-map', label: 'World Map', icon: 'map' },
    { route: 'daily', label: 'Daily Protocol', icon: 'event_available' },
    { route: 'leaderboard', label: 'Leaderboard', icon: 'leaderboard' },
    { route: 'achievements', label: 'Achievements', icon: 'military_tech' },
    { route: 'profile', label: 'Player Profile', icon: 'person' },
    { route: 'editor', label: 'Level Editor', icon: 'construction' },
    { route: 'settings', label: 'System Settings', icon: 'settings' }
  ];

  const linksHtml = links.map(link => {
    const isActive = activeRoute === link.route;
    return `
      <a 
        href="#${link.route}" 
        class="flex items-center gap-3 px-4 py-3 rounded-xl font-terminal-label text-xs uppercase tracking-wider transition-all duration-200 ${isActive ? 'bg-primary/10 text-primary border border-primary/30 glow-primary-sm font-bold' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'}"
      >
        <span class="material-symbols-outlined text-[18px]">${link.icon}</span>
        <span>${link.label}</span>
      </a>
    `;
  }).join('');

  return `
    <aside class="w-64 h-full bg-surface-container border-r border-outline-variant/30 flex flex-col justify-between p-4">
      <div class="space-y-1">
        <div class="px-4 py-3 mb-4 flex items-center gap-2">
          <span class="material-symbols-outlined text-primary text-2xl">terminal</span>
          <span class="font-headline-sm font-bold text-on-surface tracking-wider">GITQUEST</span>
        </div>
        ${linksHtml}
      </div>
      <div class="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/20 text-center">
        <span class="text-[10px] text-on-surface-variant/60 font-terminal-code uppercase tracking-widest">v2.4.0-PROD</span>
      </div>
    </aside>
  `;
}
