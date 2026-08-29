/**
 * GitQuest Frontend - Git Graph DAG Visualizer
 * Dynamic SVG graph generator rendering branch lanes, commit nodes,
 * merge curved bezier connectors, branch label badges, and active HEAD pointers.
 */

export class GitGraphCommitNode {
  constructor(hash, branch = 'main', parents = [], message = '', author = 'Developer', timestamp = Date.now()) {
    this.hash = hash;
    this.branch = branch;
    this.parents = parents;
    this.message = message;
    this.author = author;
    this.timestamp = timestamp;
    this.lane = 0;
    this.x = 0;
    this.y = 0;
  }
}

export class GitGraphDAGVisualizer {
  constructor(options = {}) {
    this.nodeRadius = options.nodeRadius || 12;
    this.rowHeight = options.rowHeight || 44;
    this.laneWidth = options.laneWidth || 40;
    this.originX = options.originX || 40;
    this.originY = options.originY || 30;
    this.branchColors = [
      '#38bdf8', // Sky Blue (main)
      '#34d399', // Emerald (feature)
      '#f59e0b', // Amber (hotfix)
      '#a855f7', // Purple (release)
      '#ec4899', // Pink (experiment)
      '#fb7185'  // Rose (bugfix)
    ];
  }

  computeLayout(commits = []) {
    const laneMap = new Map();
    let nextLane = 0;

    const nodes = commits.map((c, idx) => {
      const node = new GitGraphCommitNode(c.hash, c.branch, c.parents, c.message, c.author, c.timestamp);

      if (!laneMap.has(node.branch)) {
        laneMap.set(node.branch, nextLane++);
      }
      node.lane = laneMap.get(node.branch);
      node.x = this.originX + node.lane * this.laneWidth;
      node.y = this.originY + idx * this.rowHeight;

      return node;
    });

    return { nodes, laneMap };
  }

  renderSvg(commits = [], activeHeadHash = null) {
    if (commits.length === 0) {
      return '<svg class="git-graph-empty" width="100%" height="80"></svg>';
    }

    const { nodes } = this.computeLayout(commits);
    const nodeMap = new Map(nodes.map(n => [n.hash, n]));

    let edgesSvg = '';
    let nodesSvg = '';

    // Draw branch connector lines / bezier curves
    for (const node of nodes) {
      for (const parentHash of node.parents) {
        const parentNode = nodeMap.get(parentHash);
        if (parentNode) {
          const color = this.branchColors[node.lane % this.branchColors.length];
          if (node.lane === parentNode.lane) {
            // Straight vertical line
            edgesSvg += `<line x1="${node.x}" y1="${node.y}" x2="${parentNode.x}" y2="${parentNode.y}" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>`;
          } else {
            // Smooth bezier curve
            const midY = (node.y + parentNode.y) / 2;
            const pathData = `M ${node.x} ${node.y} C ${node.x} ${midY}, ${parentNode.x} ${midY}, ${parentNode.x} ${parentNode.y}`;
            edgesSvg += `<path d="${pathData}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>`;
          }
        }
      }
    }

    // Draw commit nodes and labels
    for (const node of nodes) {
      const isHead = activeHeadHash && node.hash.startsWith(activeHeadHash);
      const color = this.branchColors[node.lane % this.branchColors.length];

      const headBadge = isHead ? `
        <g transform="translate(${node.x + 18}, ${node.y - 8})">
          <rect width="46" height="16" rx="3" fill="#10b981"/>
          <text x="23" y="11" font-size="9" fill="#000" font-weight="bold" text-anchor="middle">HEAD</text>
        </g>
      ` : '';

      nodesSvg += `
        <g class="dag-commit-node" data-hash="${node.hash}">
          <!-- Glow -->
          <circle cx="${node.x}" cy="${node.y}" r="${this.nodeRadius + 4}" fill="${color}" opacity="${isHead ? 0.4 : 0.15}"/>
          <!-- Main Circle -->
          <circle cx="${node.x}" cy="${node.y}" r="${this.nodeRadius}" fill="#0f172a" stroke="${color}" stroke-width="${isHead ? 3 : 2}"/>
          <!-- Inner Dot -->
          <circle cx="${node.x}" cy="${node.y}" r="${this.nodeRadius * 0.4}" fill="${color}"/>
          <!-- Commit Hash & Subject -->
          <text x="${node.x + (isHead ? 70 : 18)}" y="${node.y + 4}" font-size="11" fill="#e2e8f0" font-family="monospace">
            <tspan fill="#38bdf8" font-weight="bold">${node.hash.substring(0, 7)}</tspan>
            <tspan fill="#94a3b8" dx="6">${node.message}</tspan>
          </text>
          ${headBadge}
        </g>
      `;
    }

    const totalHeight = this.originY * 2 + nodes.length * this.rowHeight;

    return `
      <div class="git-dag-container" style="background:#090d16; border-radius:8px; border:1px solid rgba(56,189,248,0.2); padding:12px; overflow-x:auto;">
        <svg width="100%" height="${totalHeight}" viewBox="0 0 600 ${totalHeight}">
          <g class="dag-edges">${edgesSvg}</g>
          <g class="dag-nodes">${nodesSvg}</g>
        </svg>
      </div>
    `;
  }
}
