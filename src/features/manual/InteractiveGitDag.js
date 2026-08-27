/**
 * InteractiveGitDag
 * Interactive Directed Acyclic Graph (DAG) visualizer for git commits and branch pointers.
 * Generates interactive SVG topologies showing branch divergency, merge vertices,
 * and HEAD indicators.
 */

export class InteractiveGitDag {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.options = {
      nodeRadius: 14,
      colSpacing: 60,
      rowSpacing: 50,
      ...options
    };
    this.commits = []; // Array<{ hash, message, parents, branch, isHead }>
  }

  /**
   * Set commit history graph
   * @param {Array<Object>} commits
   */
  setCommits(commits) {
    this.commits = commits;
  }

  /**
   * Generate SVG diagram markup
   * @returns {string}
   */
  renderSvg() {
    if (!this.commits || this.commits.length === 0) {
      return `<div class="p-8 text-center text-xs text-on-surface-variant font-terminal-code">Empty commit graph</div>`;
    }

    const { nodeRadius, colSpacing, rowSpacing } = this.options;
    const branches = Array.from(new Set(this.commits.map(c => c.branch || 'main')));
    const branchLaneMap = new Map(branches.map((b, idx) => [b, idx]));

    const svgWidth = Math.max(400, this.commits.length * colSpacing + 100);
    const svgHeight = Math.max(200, branches.length * rowSpacing + 80);

    let linksMarkup = '';
    let nodesMarkup = '';

    const nodeCoords = new Map();

    // 1. Calculate Coordinates
    this.commits.forEach((c, idx) => {
      const lane = branchLaneMap.get(c.branch || 'main') || 0;
      const x = 50 + idx * colSpacing;
      const y = 40 + lane * rowSpacing;
      nodeCoords.set(c.hash, { x, y, c });
    });

    // 2. Draw Connections (Edges)
    for (const [hash, coord] of nodeCoords.entries()) {
      for (const parentHash of coord.c.parents || []) {
        const parentCoord = nodeCoords.get(parentHash);
        if (parentCoord) {
          const color = coord.c.branch === 'main' ? '#4edea3' : '#adc6ff';
          linksMarkup += `
            <path 
              d="M ${parentCoord.x} ${parentCoord.y} C ${(parentCoord.x + coord.x) / 2} ${parentCoord.y}, ${(parentCoord.x + coord.x) / 2} ${coord.y}, ${coord.x} ${coord.y}" 
              fill="none" 
              stroke="${color}" 
              stroke-width="2.5" 
              stroke-linecap="round"
            />
          `;
        }
      }
    }

    // 3. Draw Commit Nodes
    for (const [hash, coord] of nodeCoords.entries()) {
      const isHead = coord.c.isHead;
      const nodeColor = isHead ? '#ffb95f' : (coord.c.branch === 'main' ? '#4edea3' : '#adc6ff');

      nodesMarkup += `
        <g class="cursor-pointer group" data-commit-hash="${hash}">
          <circle 
            cx="${coord.x}" 
            cy="${coord.y}" 
            r="${nodeRadius}" 
            fill="#081425" 
            stroke="${nodeColor}" 
            stroke-width="3"
            class="transition-all group-hover:scale-110"
          />
          <circle cx="${coord.x}" cy="${coord.y}" r="${nodeRadius * 0.4}" fill="${nodeColor}" />
          
          <!-- Label -->
          <text 
            x="${coord.x}" 
            y="${coord.y + nodeRadius + 14}" 
            text-anchor="middle" 
            fill="#d8e3fb" 
            font-family="JetBrains Mono, monospace" 
            font-size="10"
            font-weight="bold"
          >
            ${hash.substring(0, 7)}
          </text>

          <!-- Branch Tag if HEAD or tip -->
          ${isHead ? `
            <rect 
              x="${coord.x - 22}" 
              y="${coord.y - nodeRadius - 16}" 
              width="44" 
              height="14" 
              rx="3" 
              fill="#ffb95f" 
            />
            <text 
              x="${coord.x}" 
              y="${coord.y - nodeRadius - 6}" 
              text-anchor="middle" 
              fill="#000" 
              font-family="JetBrains Mono, monospace" 
              font-size="8" 
              font-weight="bold"
            >
              HEAD
            </text>
          ` : ''}
        </g>
      `;
    }

    return `
      <div class="w-full overflow-x-auto scrollbar-thin p-4 glass-panel rounded-xl border border-outline-variant/30">
        <svg viewBox="0 0 ${svgWidth} ${svgHeight}" class="w-full min-w-[500px]" style="height: ${svgHeight}px;">
          ${linksMarkup}
          ${nodesMarkup}
        </svg>
      </div>
    `;
  }
}
