/**
 * Sidebar Component
 * Collapsible cyberpunk sidebar navigation for wide displays.
 */

export function renderSidebar(currentRoute = 'hero', isCollapsed = false) {
  const navItems = [
    { route: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { route: 'levels', label: '250 Sectors', icon: 'grid_view' },
    { route: 'world-map', label: 'World Map', icon: 'map' },
    { route: 'leaderboard', label: 'Standings', icon: 'leaderboard' },
    { route: 'achievements', label: 'Badges', icon: 'military_tech' },
    { route: 'daily', label: 'Daily Mission', icon: 'today' },
    { route: 'manual', label: 'Git Manual', icon: 'menu_book' },
    { route: 'settings', label: 'Settings', icon: 'settings' }
  ];

  const linksHtml = navItems.map((item) => {
    const isActive = currentRoute === item.route;
    return `
      <a 
        href="#${item.route}"
        class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-terminal-label transition-all ${isActive ? 'bg-primary text-on-primary font-bold shadow-md shadow-primary/20' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/40'}"
      >
        <span class="material-symbols-outlined text-[20px]">${item.icon}</span>
        ${!isCollapsed ? `<span>${item.label}</span>` : ''}
      </a>
    `;
  }).join('');

  return `
    <aside id="app-sidebar" class="hidden lg:flex flex-col justify-between fixed top-16 bottom-0 left-0 ${isCollapsed ? 'w-20' : 'w-64'} bg-surface-container-lowest/90 border-r border-outline-variant/30 p-4 transition-all duration-300 z-30 font-terminal-code backdrop-blur-md">
      <div class="space-y-1.5">
        ${linksHtml}
      </div>

      <div class="pt-4 border-t border-surface-variant/30">
        <a href="#profile" class="flex items-center gap-3 p-2 rounded-xl bg-surface-container-high hover:bg-surface-bright transition-colors">
          <div class="w-8 h-8 rounded-full bg-primary/20 border border-primary text-primary flex items-center justify-center font-bold text-xs">
            OP
          </div>
          ${!isCollapsed ? `
            <div class="overflow-hidden">
              <div class="font-bold text-on-surface text-xs truncate">Operative</div>
              <div class="text-[10px] text-on-surface-variant">Tier 1 Contributor</div>
            </div>
          ` : ''}
        </a>
      </div>
    </aside>
  `;
}
