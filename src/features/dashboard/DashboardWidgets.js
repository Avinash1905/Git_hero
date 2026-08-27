/**
 * GitQuest Feature: Advanced Dashboard Visualizers & Activity Heatmap
 */

export class DashboardWidgets {
  static renderActivityHeatmap(activityHistory = []) {
    // Generate 7 days x 12 weeks grid
    const weeks = 12;
    const days = 7;
    const cellsHtml = [];

    for (let w = 0; w < weeks; w++) {
      const colHtml = [];
      for (let d = 0; d < days; d++) {
        const randomActivity = Math.floor(Math.random() * 5);
        let colorCls = 'bg-surface-container-lowest border-outline-variant/10';
        if (randomActivity === 1) colorCls = 'bg-primary/20 border-primary/30';
        if (randomActivity === 2) colorCls = 'bg-primary/40 border-primary/50';
        if (randomActivity === 3) colorCls = 'bg-primary/70 border-primary/80';
        if (randomActivity >= 4) colorCls = 'bg-primary border-primary glow-primary-sm';

        colHtml.push(`<div class="w-3.5 h-3.5 rounded-sm border ${colorCls} transition-all hover:scale-125 cursor-pointer"></div>`);
      }
      cellsHtml.push(`<div class="flex flex-col gap-1">${colHtml.join('')}</div>`);
    }

    return `
      <div class="glass-panel p-6 rounded-2xl border border-outline-variant/30">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-headline-sm font-headline-sm text-on-surface font-bold flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">calendar_month</span>
            Repository Commit Velocity
          </h3>
          <span class="text-xs font-terminal-label text-on-surface-variant uppercase">Last 12 Weeks</span>
        </div>
        <div class="flex items-center gap-1.5 overflow-x-auto pb-2">
          ${cellsHtml.join('')}
        </div>
        <div class="flex items-center justify-end gap-2 mt-4 text-[10px] font-terminal-label text-on-surface-variant uppercase">
          <span>Less</span>
          <div class="w-2.5 h-2.5 rounded-sm bg-surface-container-lowest border border-outline-variant/20"></div>
          <div class="w-2.5 h-2.5 rounded-sm bg-primary/20"></div>
          <div class="w-2.5 h-2.5 rounded-sm bg-primary/50"></div>
          <div class="w-2.5 h-2.5 rounded-sm bg-primary"></div>
          <span>More</span>
        </div>
      </div>
    `;
  }

  static renderWorldProgressRadial(worldNumber, completed, total) {
    const pct = Math.round((completed / (total || 1)) * 100);
    const strokeDash = 283; // 2 * pi * 45
    const strokeOffset = strokeDash - (strokeDash * pct) / 100;

    return `
      <div class="flex flex-col items-center justify-center p-4 bg-surface-container rounded-xl border border-outline-variant/30">
        <div class="relative w-24 h-24 flex items-center justify-center">
          <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" stroke="rgba(173,198,255,0.1)" stroke-width="8" fill="transparent"/>
            <circle cx="50" cy="50" r="42" stroke="#4edea3" stroke-width="8" stroke-dasharray="${strokeDash}" stroke-dashoffset="${strokeOffset}" stroke-linecap="round" fill="transparent" class="transition-all duration-1000"/>
          </svg>
          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <span class="text-headline-sm font-bold font-hud-stat text-on-surface">${pct}%</span>
          </div>
        </div>
        <span class="text-xs font-terminal-label font-bold text-on-surface mt-2">World ${worldNumber}</span>
        <span class="text-[10px] font-terminal-code text-on-surface-variant">${completed}/${total} Cleared</span>
      </div>
    `;
  }
}
