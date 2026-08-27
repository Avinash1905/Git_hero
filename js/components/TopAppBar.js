// TopAppBar Component - 100% faithful to Stitch design

export function renderTopAppBar(activeRoute = 'main', onNavigate, onOpenSettings) {
  const avatarUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDud6okIV02jhmDlAPEHxgYXcDNc2q1nsOHBV3pwTdA_ggOX2dzSjnWA_qfp7oeCXrhLG7W3rDWPQ4NwC7RUAeywZ753egcw2iJitcVtN5DOJRewUcoo4pYrSG0YJ8cUUYVbJ3YzTX7ND9ZlBAw0QJUSZj-SnOk2PRX5n9209agFlczi_Sb3C2MCIe-0qHJlPtIFeLmWypXAd8L431J07JqHbYlHoDEANVtXYddeAxPurorUqmvW8';

  const isMain = activeRoute === 'dashboard' || activeRoute === 'hero' || activeRoute === 'main';
  const isLogs = activeRoute === 'leaderboard' || activeRoute === 'achievements' || activeRoute === 'profile';

  return `
    <header class="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-hud-margin h-16 bg-surface/80 backdrop-blur-xl bg-surface-container-high/80 border-b border-outline-variant/30 shadow-md">
      <div class="flex items-center gap-md">
        <button id="brand-logo-btn" class="text-headline-sm font-headline-sm font-bold text-primary tracking-tighter hover:opacity-90 transition-opacity flex items-center gap-2">
          GitHero
        </button>
      </div>
      
      <nav class="hidden md:flex gap-lg h-full items-end">
        <button id="nav-main-btn" class="${isMain ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-on-surface-variant font-medium pb-1 hover:bg-surface-bright/50'} text-terminal-label font-terminal-label transition-colors">
          ~/quest/main
        </button>
        <button id="nav-logs-btn" class="${isLogs ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-on-surface-variant font-medium pb-1 hover:bg-surface-bright/50'} text-terminal-label font-terminal-label transition-colors">
          ~/quest/logs
        </button>
        <button id="nav-map-btn" class="${activeRoute === 'world-map' ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-on-surface-variant font-medium pb-1 hover:bg-surface-bright/50'} text-terminal-label font-terminal-label transition-colors">
          ~/quest/world-map
        </button>
        <button id="nav-levels-btn" class="${activeRoute === 'levels' ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-on-surface-variant font-medium pb-1 hover:bg-surface-bright/50'} text-terminal-label font-terminal-label transition-colors">
          ~/quest/levels
        </button>
        <button id="nav-manual-btn" class="${activeRoute === 'manual' ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-on-surface-variant font-medium pb-1 hover:bg-surface-bright/50'} text-terminal-label font-terminal-label transition-colors">
          ~/quest/manual
        </button>
      </nav>

      <div class="flex items-center gap-sm">
        <button id="top-help-btn" title="User Manual & Tutorial" class="${activeRoute === 'manual' ? 'text-primary' : 'text-on-surface-variant'} hover:text-primary transition-colors p-sm rounded-full hover:bg-surface-variant/40">
          <span class="material-symbols-outlined" data-icon="help">help</span>
        </button>
        <button id="top-settings-btn" title="Settings" class="text-on-surface-variant hover:text-primary transition-colors p-sm rounded-full hover:bg-surface-variant/40">
          <span class="material-symbols-outlined" data-icon="settings">settings</span>
        </button>
        <button id="top-menu-btn" title="Menu" class="text-on-surface-variant hover:text-primary transition-colors p-sm rounded-full hover:bg-surface-variant/40 md:hidden">
          <span class="material-symbols-outlined" data-icon="menu">menu</span>
        </button>
        <button id="top-profile-btn" title="View Profile" class="w-10 h-10 rounded-full bg-surface-variant border border-primary/40 overflow-hidden ml-sm hover:scale-105 transition-transform">
          <img class="w-full h-full object-cover" alt="Player Avatar" src="${avatarUrl}">
        </button>
      </div>
    </header>
  `;
}
