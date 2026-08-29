/**
 * ActivityHeatmap
 * Renders an interactive 52-week activity calendar grid (GitHub style contribution matrix)
 * for daily GitHero puzzle completions, commit frequencies, and streak tracking.
 */

export class ActivityHeatmap {
  constructor(options = {}) {
    this.weeks = options.weeks || 26; // 6 months default view
    this.daysPerWeek = 7;
    this.cellSize = options.cellSize || 11;
    this.cellGap = options.cellGap || 3;
    this.dayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
    this.monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  }

  /**
   * Aggregate activity data from completion history
   */
  generateActivityMatrix(activityHistory = []) {
    const historyMap = {};
    activityHistory.forEach(item => {
      const dateKey = item.date || (item.completedAt ? item.completedAt.split('T')[0] : null);
      if (dateKey) {
        historyMap[dateKey] = (historyMap[dateKey] || 0) + (item.count || 1);
      }
    });

    const now = new Date();
    const cells = [];
    const totalDays = this.weeks * this.daysPerWeek;

    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;
    let totalCommits = 0;
    let activeDays = 0;

    for (let i = totalDays - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = historyMap[dateStr] || 0;
      
      totalCommits += count;
      if (count > 0) {
        activeDays++;
        tempStreak++;
        if (tempStreak > maxStreak) maxStreak = tempStreak;
      } else {
        tempStreak = 0;
      }

      cells.push({
        date: dateStr,
        count,
        dayOfWeek: d.getDay(),
        month: d.getMonth()
      });
    }

    // Current streak calculation
    for (let i = cells.length - 1; i >= 0; i--) {
      if (cells[i].count > 0) {
        currentStreak++;
      } else if (i < cells.length - 1) {
        break; // streak broke
      }
    }

    return {
      cells,
      currentStreak,
      maxStreak,
      totalCommits,
      activeDays
    };
  }

  /**
   * Get color intensity class based on activity count
   */
  getColorClass(count) {
    if (count === 0) return 'fill-surface-container-lowest stroke-outline-variant/10';
    if (count === 1) return 'fill-primary/30 stroke-primary/40';
    if (count <= 3) return 'fill-primary/60 stroke-primary/70';
    if (count <= 6) return 'fill-primary/85 stroke-primary';
    return 'fill-primary stroke-white/80';
  }

  /**
   * Render HTML heatmap container
   */
  renderHtml(activityHistory = []) {
    const stats = this.generateActivityMatrix(activityHistory);
    const { cells } = stats;

    const width = this.weeks * (this.cellSize + this.cellGap) + 30;
    const height = this.daysPerWeek * (this.cellSize + this.cellGap) + 20;

    // Render cells
    const rects = cells.map((c, index) => {
      const weekIndex = Math.floor(index / this.daysPerWeek);
      const dayIndex = c.dayOfWeek;
      const x = 24 + weekIndex * (this.cellSize + this.cellGap);
      const y = 14 + dayIndex * (this.cellSize + this.cellGap);
      const colorCls = this.getColorClass(c.count);

      return `
        <rect 
          x="${x}" 
          y="${y}" 
          width="${this.cellSize}" 
          height="${this.cellSize}" 
          rx="2" 
          class="${colorCls} hover:stroke-white transition-colors cursor-pointer"
          data-date="${c.date}" 
          data-count="${c.count}"
        >
          <title>${c.count} sector commits on ${c.date}</title>
        </rect>
      `;
    }).join('');

    // Day labels
    const dayTexts = this.dayLabels.map((lbl, idx) => {
      if (!lbl) return '';
      const y = 14 + idx * (this.cellSize + this.cellGap) + (this.cellSize * 0.8);
      return `<text x="0" y="${y}" fill="#64748b" font-size="8" font-family="monospace">${lbl}</text>`;
    }).join('');

    return `
      <div class="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/20 space-y-3">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px] text-primary">calendar_month</span>
            <span class="text-xs font-mono font-bold text-on-surface uppercase tracking-wider">Sector Activity Matrix</span>
          </div>
          <div class="flex items-center gap-4 text-[11px] font-mono">
            <span class="text-on-surface-variant">Active Days: <strong class="text-on-surface">${stats.activeDays}</strong></span>
            <span class="text-on-surface-variant">Max Streak: <strong class="text-primary">${stats.maxStreak}d</strong></span>
            <span class="text-on-surface-variant">Current: <strong class="text-primary">${stats.currentStreak}d</strong></span>
          </div>
        </div>

        <!-- Heatmap SVG -->
        <div class="overflow-x-auto pb-1">
          <svg width="${width}" height="${height}" class="select-none min-w-full">
            ${dayTexts}
            ${rects}
          </svg>
        </div>

        <!-- Legend -->
        <div class="flex items-center justify-between text-[10px] text-on-surface-variant font-mono pt-1 border-t border-outline-variant/10">
          <span>${stats.totalCommits} total sector puzzle commits logged</span>
          <div class="flex items-center gap-1.5">
            <span>Less</span>
            <span class="w-2.5 h-2.5 rounded-xs bg-surface-container-lowest border border-outline-variant/20 inline-block"></span>
            <span class="w-2.5 h-2.5 rounded-xs bg-primary/30 inline-block"></span>
            <span class="w-2.5 h-2.5 rounded-xs bg-primary/60 inline-block"></span>
            <span class="w-2.5 h-2.5 rounded-xs bg-primary inline-block"></span>
            <span>More</span>
          </div>
        </div>
      </div>
    `;
  }
}

export const activityHeatmap = new ActivityHeatmap();
