// GitHero Laser & Circuit Visual Animator
// Computes optical ray reflections and circuit gate wire glow styling.

export class LaserCircuitAnimator {
  /**
   * Render SVG overlays for laser beams and logic circuit links
   * @param {Object} state 
   * @param {number} tileSizePx 
   * @returns {string} SVG overlay markup
   */
  static renderLaserAndCircuitOverlays(state, tileSizePx = 48) {
    if (!state) return '';

    let laserLines = '';
    if (Array.isArray(state.lasers)) {
      laserLines = state.lasers.map(l => {
        const startX = l.startX * tileSizePx + tileSizePx / 2;
        const startY = l.startY * tileSizePx + tileSizePx / 2;
        const endX = l.endX * tileSizePx + tileSizePx / 2;
        const endY = l.endY * tileSizePx + tileSizePx / 2;
        const color = l.color || '#ff5555';

        return `
          <line x1="${startX}" y1="${startY}" x2="${endX}" y2="${endY}" stroke="${color}" stroke-width="3" stroke-linecap="round" opacity="0.85">
            <animate attributeName="opacity" values="0.7;1;0.7" dur="1s" repeatCount="indefinite" />
          </line>
        `;
      }).join('');
    }

    let circuitGates = '';
    if (Array.isArray(state.switches)) {
      circuitGates = state.switches.map(s => {
        const cx = s.x * tileSizePx + tileSizePx / 2;
        const cy = s.y * tileSizePx + tileSizePx / 2;
        const isActivated = !!s.activated;
        const fill = isActivated ? '#4edea3' : '#3c4a42';

        return `
          <circle cx="${cx}" cy="${cy}" r="${tileSizePx / 3}" fill="${fill}" stroke="#1f2a3c" stroke-width="2" opacity="0.9" />
        `;
      }).join('');
    }

    const gridSize = state.gridSize || 8;
    const totalPx = gridSize * tileSizePx;

    return `
      <svg class="absolute inset-0 pointer-events-none z-10" width="${totalPx}" height="${totalPx}" viewBox="0 0 ${totalPx} ${totalPx}">
        ${laserLines}
        ${circuitGates}
      </svg>
    `;
  }
}
