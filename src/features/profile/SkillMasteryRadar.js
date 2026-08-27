/**
 * SkillMasteryRadar
 * Computes player mastery percentiles across 6 core Git disciplines
 * and renders an interactive SVG radar polygon chart.
 */

export class SkillMasteryRadar {
  constructor(options = {}) {
    this.disciplines = [
      { id: 'branching', label: 'Branching', icon: 'alt_route', maxScore: 100 },
      { id: 'merging', label: 'Merging', icon: 'merge_type', maxScore: 100 },
      { id: 'rebasing', label: 'Rebasing', icon: 'linear_scale', maxScore: 100 },
      { id: 'plumbing', label: 'Plumbing', icon: 'plumbing', maxScore: 100 },
      { id: 'history', label: 'History Editing', icon: 'history', maxScore: 100 },
      { id: 'remotes', label: 'Remotes & Sync', icon: 'cloud_sync', maxScore: 100 }
    ];
    this.size = options.size || 280;
    this.center = this.size / 2;
    this.radius = (this.size / 2) - 40;
  }

  /**
   * Compute discipline scores based on player progress across 250 levels
   */
  evaluateSkills(completedLevels = [], achievements = []) {
    const totalLevels = completedLevels.length;
    const scores = {
      branching: Math.min(100, Math.round((completedLevels.filter(l => l.worldId <= 5 || l.id <= 50).length / 30) * 100)),
      merging: Math.min(100, Math.round((completedLevels.filter(l => l.id >= 16 && l.id <= 70).length / 35) * 100)),
      rebasing: Math.min(100, Math.round((completedLevels.filter(l => l.id >= 31 && l.id <= 100).length / 35) * 100)),
      plumbing: Math.min(100, Math.round((completedLevels.filter(l => l.id >= 60 && l.id <= 180).length / 40) * 100)),
      history: Math.min(100, Math.round((completedLevels.filter(l => l.id >= 100 && l.id <= 220).length / 40) * 100)),
      remotes: Math.min(100, Math.round((completedLevels.filter(l => l.id >= 150 || l.worldId >= 15).length / 50) * 100))
    };

    // Boost scores based on achievements
    const achCount = achievements.length;
    if (achCount > 0) {
      Object.keys(scores).forEach(key => {
        scores[key] = Math.min(100, scores[key] + Math.min(25, achCount * 3));
      });
    }

    // Default base floor for active operatives
    if (totalLevels > 0) {
      Object.keys(scores).forEach(key => {
        scores[key] = Math.max(scores[key], 15);
      });
    }

    return scores;
  }

  /**
   * Calculate 2D point coordinates on radar axis
   */
  getCoordinates(index, total, value, max = 100) {
    const angle = (Math.PI * 2 / total) * index - (Math.PI / 2);
    const r = (value / max) * this.radius;
    return {
      x: this.center + r * Math.cos(angle),
      y: this.center + r * Math.sin(angle)
    };
  }

  /**
   * Render SVG markup for skill radar chart
   */
  renderSvg(skillScores = {}) {
    const total = this.disciplines.length;
    const gridLevels = [0.25, 0.5, 0.75, 1.0];

    // Concentric grid circles / polygons
    const gridPolygons = gridLevels.map(level => {
      const points = this.disciplines.map((_, i) => {
        const pt = this.getCoordinates(i, total, level * 100, 100);
        return `${pt.x},${pt.y}`;
      }).join(' ');
      return `<polygon points="${points}" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1" stroke-dasharray="${level === 1 ? 'none' : '2,2'}" />`;
    }).join('');

    // Axis spokes
    const axisSpokes = this.disciplines.map((d, i) => {
      const outerPt = this.getCoordinates(i, total, 100, 100);
      return `<line x1="${this.center}" y1="${this.center}" x2="${outerPt.x}" y2="${outerPt.y}" stroke="rgba(255,255,255,0.12)" stroke-width="1" />`;
    }).join('');

    // Data polygon
    const dataPoints = this.disciplines.map((d, i) => {
      const val = skillScores[d.id] || 0;
      const pt = this.getCoordinates(i, total, val, d.maxScore);
      return `${pt.x},${pt.y}`;
    }).join(' ');

    // Vertex dots
    const vertexDots = this.disciplines.map((d, i) => {
      const val = skillScores[d.id] || 0;
      const pt = this.getCoordinates(i, total, val, d.maxScore);
      return `
        <circle cx="${pt.x}" cy="${pt.y}" r="4" fill="#00ffcc" stroke="#0f172a" stroke-width="2" />
      `;
    }).join('');

    // Axis labels
    const labels = this.disciplines.map((d, i) => {
      const labelPt = this.getCoordinates(i, total, 118, 100);
      const score = skillScores[d.id] || 0;
      return `
        <text x="${labelPt.x}" y="${labelPt.y}" text-anchor="middle" dominant-baseline="central" fill="#94a3b8" font-size="9" font-family="monospace" font-weight="bold">
          ${d.label.toUpperCase()} (${score}%)
        </text>
      `;
    }).join('');

    return `
      <div class="flex flex-col items-center justify-center p-4 bg-surface-container-low rounded-2xl border border-outline-variant/20">
        <div class="w-full flex items-center justify-between mb-2">
          <span class="text-xs font-mono font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px] text-primary">radar</span>
            <span>Git Skill Mastery Radar</span>
          </span>
          <span class="text-[10px] text-primary font-mono bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
            6 Disciplines
          </span>
        </div>
        <svg width="${this.size}" height="${this.size}" viewBox="0 0 ${this.size} ${this.size}" class="overflow-visible select-none">
          <defs>
            <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#00ffcc" stop-opacity="0.3" />
              <stop offset="100%" stop-color="#00ffcc" stop-opacity="0.05" />
            </radialGradient>
          </defs>
          ${gridPolygons}
          ${axisSpokes}
          <polygon points="${dataPoints}" fill="url(#radarGlow)" stroke="#00ffcc" stroke-width="2" stroke-linejoin="round" class="animate-pulse" />
          ${vertexDots}
          ${labels}
        </svg>
      </div>
    `;
  }
}

export const skillMasteryRadar = new SkillMasteryRadar();
