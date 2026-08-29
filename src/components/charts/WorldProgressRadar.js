/**
 * WorldProgressRadar & CommandDistributionChart
 * Visual analytics charts for developer profile and stats displays.
 */

export class WorldProgressRadar {
  /**
   * Render SVG radar polygon showing mastery across key worlds
   * @param {Array<{world: number, name: string, percentage: number}>} worldStats
   * @returns {string}
   */
  static renderRadarSvg(worldStats = []) {
    const size = 300;
    const center = size / 2;
    const radius = 100;

    const stats = (worldStats && worldStats.length >= 3) ? worldStats : [
      { name: 'Foundations', percentage: 100 },
      { name: 'Branches', percentage: 85 },
      { name: 'Merges', percentage: 60 },
      { name: 'Rebases', percentage: 40 },
      { name: 'Submodules', percentage: 30 },
      { name: 'Bisect', percentage: 20 }
    ];

    const totalAxes = stats.length;
    const angleStep = (Math.PI * 2) / totalAxes;

    // Web lines
    let webLines = '';
    [0.25, 0.5, 0.75, 1.0].forEach((level) => {
      const pts = [];
      for (let i = 0; i < totalAxes; i++) {
        const a = i * angleStep - Math.PI / 2;
        const x = center + Math.cos(a) * (radius * level);
        const y = center + Math.sin(a) * (radius * level);
        pts.push(`${x},${y}`);
      }
      webLines += `<polygon points="${pts.join(' ')}" fill="none" stroke="rgba(60, 74, 66, 0.3)" stroke-width="1" />`;
    });

    // Data polygon
    const dataPoints = [];
    let axisLabels = '';

    stats.forEach((s, idx) => {
      const a = idx * angleStep - Math.PI / 2;
      const r = (radius * (s.percentage || 0)) / 100;
      const x = center + Math.cos(a) * r;
      const y = center + Math.sin(a) * r;
      dataPoints.push(`${x},${y}`);

      // Labels outside radar
      const lx = center + Math.cos(a) * (radius + 24);
      const ly = center + Math.sin(a) * (radius + 24);
      axisLabels += `
        <text 
          x="${lx}" 
          y="${ly}" 
          text-anchor="middle" 
          alignment-baseline="middle"
          fill="#86948a" 
          font-family="JetBrains Mono, monospace" 
          font-size="9"
        >
          ${s.name}
        </text>
      `;
    });

    return `
      <div class="glass-panel p-5 rounded-2xl border border-outline-variant/30 flex flex-col items-center justify-center">
        <h4 class="text-xs font-bold text-on-surface font-terminal-code mb-2 uppercase tracking-wider">
          Repository Discipline Radar
        </h4>
        <svg viewBox="0 0 ${size} ${size}" class="w-full max-w-[280px] h-auto">
          ${webLines}
          <polygon points="${dataPoints.join(' ')}" fill="rgba(78, 222, 163, 0.25)" stroke="#4edea3" stroke-width="2" />
          ${axisLabels}
        </svg>
      </div>
    `;
  }
}

export class CommandDistributionChart {
  /**
   * Render horizontal progress breakdown
   * @param {Array<{command: string, count: number, percentage: number, color: string}>} distribution
   * @returns {string}
   */
  static renderHtml(distribution = []) {
    const items = distribution.length > 0 ? distribution : [
      { command: 'git push', count: 412, percentage: 42, color: 'bg-primary' },
      { command: 'git pull', count: 280, percentage: 28, color: 'bg-secondary' },
      { command: 'git status', count: 184, percentage: 18, color: 'bg-tertiary' },
      { command: 'git commit', count: 118, percentage: 12, color: 'bg-purple-400' }
    ];

    const bars = items.map((item) => `
      <div class="space-y-1 font-terminal-code text-xs">
        <div class="flex justify-between items-center">
          <span class="text-on-surface font-medium">${item.command}</span>
          <span class="text-on-surface-variant text-[11px]">${item.count} executions (${item.percentage}%)</span>
        </div>
        <div class="w-full bg-surface-container-lowest h-2 rounded-full overflow-hidden">
          <div class="${item.color} h-full rounded-full transition-all duration-500" style="width: ${item.percentage}%"></div>
        </div>
      </div>
    `).join('');

    return `
      <div class="glass-panel p-5 rounded-2xl border border-outline-variant/30 space-y-4">
        <h4 class="text-xs font-bold text-on-surface font-terminal-code uppercase tracking-wider">
          Command Frequency Distribution
        </h4>
        <div class="space-y-3">
          ${bars}
        </div>
      </div>
    `;
  }
}
