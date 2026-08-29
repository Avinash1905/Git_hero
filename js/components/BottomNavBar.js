// BottomNavBar Component - Suppressed on gameplay screen to keep terminal as primary interface

export function renderBottomNavBar(arg = false) {
  const isGameplay = typeof arg === 'boolean' ? arg : (arg?.isGameplay || arg?.currentRoute === 'gameplay' || arg?.currentRoute === 'game');
  if (isGameplay) {
    return ''; // No bottom buttons on gameplay screen
  }

  return `
    <nav class="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-hud-margin py-xs h-20 bg-surface-container-highest/95 backdrop-blur-2xl border-t border-primary/20 shadow-[0_-4px_20px_rgba(78,222,163,0.15)] rounded-t-xl">
      <button id="mob-nav-dash" class="flex flex-col items-center justify-center text-on-surface-variant px-4 py-2 hover:bg-surface-variant/60 rounded-xl transition-colors">
        <span class="material-symbols-outlined mb-1">dashboard</span>
        <span class="text-terminal-label font-terminal-label">Dash</span>
      </button>
      <button id="mob-nav-map" class="flex flex-col items-center justify-center text-on-surface-variant px-4 py-2 hover:bg-surface-variant/60 rounded-xl transition-colors">
        <span class="material-symbols-outlined mb-1">map</span>
        <span class="text-terminal-label font-terminal-label">Map</span>
      </button>
      <button id="mob-nav-play" class="flex flex-col items-center justify-center bg-primary text-on-primary rounded-xl px-5 py-2 shadow-[0_0_15px_#4edea340] transition-colors scale-95 duration-100">
        <span class="material-symbols-outlined mb-1">sports_esports</span>
        <span class="text-terminal-label font-terminal-label">Play</span>
      </button>
      <button id="mob-nav-manual" class="flex flex-col items-center justify-center text-on-surface-variant px-3 py-2 hover:bg-surface-variant/60 rounded-xl transition-colors">
        <span class="material-symbols-outlined mb-1">menu_book</span>
        <span class="text-terminal-label font-terminal-label">Manual</span>
      </button>
      <button id="mob-nav-profile" class="flex flex-col items-center justify-center text-on-surface-variant px-3 py-2 hover:bg-surface-variant/60 rounded-xl transition-colors">
        <span class="material-symbols-outlined mb-1">person</span>
        <span class="text-terminal-label font-terminal-label">Profile</span>
      </button>
    </nav>
  `;
}
