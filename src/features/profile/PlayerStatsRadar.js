/**
 * GitQuest Frontend - Player Stats Radar
 * Visual 6-discipline spider radar chart (Branching, Merging, Rebasing,
 * Conflict Resolution, Move Efficiency, Speed) rendered in dynamic SVG.
 */

export class PlayerStatsRadar {
  constructor(stats = {}) {
    this.disciplines = [
      { key: 'branching', label: 'Branching', max: 100 },
      { key: 'merging', label: 'Merging', max: 100 },
      { key: 'rebasing', label: 'Rebasing', max: 100 },
      { key: 'conflicts', label: 'Conflict Res', max: 100 },
      { key: 'efficiency', label: 'Efficiency', max: 100 },
      { key: 'speed', label: 'Speed', max: 100 }
    ];
    this.scores = {
      branching: stats.branching || 75,
      merging: stats.merging || 80,
      rebasing: stats.rebasing || 65,
      conflicts: stats.conflicts || 85,
      efficiency: stats.efficiency || 90,
      speed: stats.speed || 70
    };
  }

  updateScore(disciplineKey, value) {
    if (this.scores.hasOwnProperty(disciplineKey)) {
      this.scores[disciplineKey] = Math.max(0, Math.min(100, value));
    }
  }

  renderRadarSvg(size = 280) {
    const center = size / 2;
    const radius = size * 0.38;
    const totalAxes = this.disciplines.length;

    // Generate concentric rings
    let ringsSvg = '';
    [0.25, 0.5, 0.75, 1.0].forEach(factor => {
      const ringPts = [];
      for (let i = 0; i < totalAxes; i++) {
        const angle = (Math.PI * 2 / totalAxes) * i - Math.PI / 2;
        const x = center + Math.cos(angle) * (radius * factor);
        const y = center + Math.sin(angle) * (radius * factor);
        ringPts.push(`${x},${y}`);
      }
      ringsSvg += `<polygon points="${ringPts.join(' ')}" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>`;
    });

    // Generate axis spokes and labels
    let spokesSvg = '';
    let labelsSvg = '';
    for (let i = 0; i < totalAxes; i++) {
      const angle = (Math.PI * 2 / totalAxes) * i - Math.PI / 2;
      const x = center + Math.cos(angle) * radius;
      const y = center + Math.sin(angle) * radius;
      spokesSvg += `<line x1="${center}" y1="${center}" x2="${x}" y2="${y}" stroke="rgba(56,189,248,0.2)" stroke-width="1"/>`;

      const lx = center + Math.cos(angle) * (radius + 20);
      const ly = center + Math.sin(angle) * (radius + 20);
      const label = this.disciplines[i].label;
      labelsSvg += `<text x="${lx}" y="${ly}" font-size="10" fill="#94a3b8" text-anchor="middle" dominant-baseline="middle" font-family="Inter, sans-serif">${label}</text>`;
    }

    // Generate data polygon
    const dataPts = [];
    for (let i = 0; i < totalAxes; i++) {
      const angle = (Math.PI * 2 / totalAxes) * i - Math.PI / 2;
      const key = this.disciplines[i].key;
      const val = this.scores[key] || 0;
      const factor = val / 100;
      const x = center + Math.cos(angle) * (radius * factor);
      const y = center + Math.sin(angle) * (radius * factor);
      dataPts.push(`${x},${y}`);
    }

    const dataPolygon = `
      <polygon points="${dataPts.join(' ')}" fill="rgba(56,189,248,0.25)" stroke="#38bdf8" stroke-width="2"/>
    `;

    return `
      <div class="player-radar-container" style="display:flex; flex-direction:column; align-items:center; background:#090d16; padding:16px; border-radius:12px; border:1px solid rgba(56,189,248,0.2); max-width:320px;">
        <h4 style="margin:0 0 10px 0; color:#38bdf8; font-size:14px; font-family:Inter, sans-serif;">Git Mastery Discipline Radar</h4>
        <svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
          ${ringsSvg}
          ${spokesSvg}
          ${dataPolygon}
          ${labelsSvg}
        </svg>
      </div>
    `;
  }
}
