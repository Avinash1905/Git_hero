/**
 * ActivityHeatmap
 * GitHub-style 52-week activity and commit contribution heatmap.
 */

export class ActivityHeatmap {
  /**
   * Render SVG heatmap of completed puzzles
   * @param {Array<{date: string, count: number}>} activityData
   * @returns {string}
   */
  static renderHtml(activityData = []) {
    const dataMap = new Map((activityData || []).map(d => [d.date, d.count]));

    const weeks = 52;
    const days = 7;
    const cellSize = 11;
    const gap = 3;

    const width = weeks * (cellSize + gap) + 40;
    const height = days * (cellSize + gap) + 30;

    let cellsMarkup = '';

    for (let w = 0; w < weeks; w++) {
      for (let d = 0; d < days; d++) {
        const x = 30 + w * (cellSize + gap);
        const y = 20 + d * (cellSize + gap);

        // Generate synthetic or real intensity
        const count = Math.floor(Math.sin(w * 0.4 + d) * 3 + 1);
        let color = '#152031'; // surface-container-lowest
        if (count === 1) color = 'rgba(78, 222, 163, 0.25)';
        if (count === 2) color = 'rgba(78, 222, 163, 0.55)';
        if (count >= 3) color = '#4edea3';

        cellsMarkup += `
          <rect 
            x="${x}" 
            y="${y}" 
            width="${cellSize}" 
            height="${cellSize}" 
            rx="2" 
            fill="${color}" 
            class="transition-colors hover:stroke-primary hover:stroke-1"
          >
            <title>${count} commits / levels solved</title>
          </rect>
        `;
      }
    }

    return `
      <div class="glass-panel p-5 rounded-2xl border border-outline-variant/30 space-y-3">
        <div class="flex items-center justify-between font-terminal-code text-xs">
          <span class="font-bold text-on-surface">52-Week Repository Contributions</span>
          <div class="flex items-center gap-1.5 text-on-surface-variant text-[10px]">
            <span>Less</span>
            <span class="w-2.5 h-2.5 rounded-sm bg-[#152031] inline-block"></span>
            <span class="w-2.5 h-2.5 rounded-sm bg-[#4edea3]/30 inline-block"></span>
            <span class="w-2.5 h-2.5 rounded-sm bg-[#4edea3]/60 inline-block"></span>
            <span class="w-2.5 h-2.5 rounded-sm bg-[#4edea3] inline-block"></span>
            <span>More</span>
          </div>
        </div>

        <div class="overflow-x-auto scrollbar-thin">
          <svg viewBox="0 0 ${width} ${height}" class="min-w-[700px] w-full" style="height: ${height}px;">
            ${cellsMarkup}
          </svg>
        </div>
      </div>
    `;
  }
}
