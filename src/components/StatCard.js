// GitHero Cyberpunk Bento Stat Card Component
// Displays key metrics, progress bars, and icon indicators.

export class StatCard {
  /**
   * Render cyberpunk stat card
   * @param {Object} options 
   * @returns {string} HTML markup
   */
  static render(options = {}) {
    const {
      title = 'METRIC',
      value = '0',
      subtitle = '',
      icon = 'analytics',
      iconColor = 'text-primary',
      badge = '',
      badgeColor = 'bg-primary/20 text-primary',
      trend = ''
    } = options;

    return `
      <div class="bg-surface-container rounded-xl p-5 border border-outline-variant/30 relative overflow-hidden shadow-md flex flex-col justify-between group hover:border-primary/40 transition-all">
        <!-- Glow accent on hover -->
        <div class="absolute -right-10 -bottom-10 w-24 h-24 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-all pointer-events-none"></div>

        <div>
          <div class="flex justify-between items-start mb-3">
            <span class="text-xs font-mono font-bold uppercase tracking-wider text-on-surface-variant">${title}</span>
            <div class="p-2 bg-surface-container-high rounded-lg ${iconColor}">
              <span class="material-symbols-Outlined text-lg">${icon}</span>
            </div>
          </div>
          <div class="text-2xl font-black text-on-surface font-mono tracking-tight mb-1">
            ${value}
          </div>
        </div>

        <div class="flex items-center justify-between mt-3 text-xs">
          <span class="text-on-surface-variant">${subtitle}</span>
          ${badge ? `<span class="px-2 py-0.5 rounded font-mono font-semibold ${badgeColor}">${badge}</span>` : ''}
          ${trend ? `<span class="text-primary font-mono font-bold">${trend}</span>` : ''}
        </div>
      </div>
    `;
  }
}
