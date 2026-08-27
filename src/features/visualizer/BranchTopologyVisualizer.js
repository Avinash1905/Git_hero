/**
 * BranchTopologyVisualizer
 * Renders an interactive Directed Acyclic Graph (DAG) commit topology
 * with branch lanes, HEAD indicators, merge bezier curves, and commit tooltips.
 */

export class BranchTopologyVisualizer {
  constructor(options = {}) {
    this.laneWidth = options.laneWidth || 40;
    this.rowHeight = options.rowHeight || 50;
    this.nodeRadius = options.nodeRadius || 9;
    this.laneColors = ['#00ffcc', '#38bdf8', '#a855f7', '#f59e0b', '#ec4899', '#10b981'];
  }

  /**
   * Assign branch lanes to linear commit list
   */
  computeGraphLanes(commits = []) {
    const activeLanes = [];
    const nodes = [];
    const edges = [];

    commits.forEach((commit, rowIndex) => {
      let laneIndex = activeLanes.indexOf(commit.branch);
      if (laneIndex === -1) {
        // Find first empty lane or allocate new
        laneIndex = activeLanes.indexOf(null);
        if (laneIndex === -1) {
          laneIndex = activeLanes.length;
          activeLanes.push(commit.branch);
        } else {
          activeLanes[laneIndex] = commit.branch;
        }
      }

      const x = 30 + laneIndex * this.laneWidth;
      const y = 30 + rowIndex * this.rowHeight;

      nodes.push({
        ...commit,
        lane: laneIndex,
        x,
        y,
        color: this.laneColors[laneIndex % this.laneColors.length]
      });

      // Connect to parents
      if (commit.parents && commit.parents.length > 0) {
        commit.parents.forEach(parentId => {
          edges.push({
            fromSha: commit.sha,
            toSha: parentId,
            fromX: x,
            fromY: y
          });
        });
      }
    });

    // Resolve edge coordinates
    const resolvedEdges = edges.map(edge => {
      const targetNode = nodes.find(n => n.sha === edge.toSha);
      if (targetNode) {
        return {
          ...edge,
          toX: targetNode.x,
          toY: targetNode.y,
          color: targetNode.color
        };
      }
      return null;
    }).filter(Boolean);

    return { nodes, edges: resolvedEdges, totalLanes: Math.max(1, activeLanes.length) };
  }

  /**
   * Render SVG markup for commit topology DAG
   */
  renderSvg(commits = [], currentHeadSha = '') {
    if (!commits || commits.length === 0) {
      return `<div class="p-8 text-center text-xs font-mono text-on-surface-variant">No commit graph history available.</div>`;
    }

    const { nodes, edges, totalLanes } = this.computeGraphLanes(commits);
    const width = Math.max(280, 60 + totalLanes * this.laneWidth);
    const height = Math.max(150, 40 + nodes.length * this.rowHeight);

    // Draw bezier curves for edges
    const edgePaths = edges.map(edge => {
      const isStraight = edge.fromX === edge.toX;
      let pathD = '';
      if (isStraight) {
        pathD = `M ${edge.fromX} ${edge.fromY} L ${edge.toX} ${edge.toY}`;
      } else {
        const midY = (edge.fromY + edge.toY) / 2;
        pathD = `M ${edge.fromX} ${edge.fromY} C ${edge.fromX} ${midY}, ${edge.toX} ${midY}, ${edge.toX} ${edge.toY}`;
      }
      return `<path d="${pathD}" fill="none" stroke="${edge.color}" stroke-width="2" stroke-opacity="0.6" />`;
    }).join('');

    // Draw commit nodes
    const nodeElements = nodes.map(node => {
      const isHead = node.sha === currentHeadSha || node.isHead;
      return `
        <g class="cursor-pointer group" data-sha="${node.sha}">
          ${isHead ? `
            <circle cx="${node.x}" cy="${node.y}" r="${this.nodeRadius + 4}" fill="none" stroke="#00ffcc" stroke-width="2" class="animate-ping" opacity="0.4" />
          ` : ''}
          <circle cx="${node.x}" cy="${node.y}" r="${this.nodeRadius}" fill="${node.color}" stroke="#0f172a" stroke-width="2.5" class="transition-transform group-hover:scale-125" />
          
          <!-- Node Label -->
          <text x="${node.x + 18}" y="${node.y - 2}" fill="#f8fafc" font-size="11" font-family="monospace" font-weight="bold">
            ${node.sha.substring(0, 7)}
          </text>
          <text x="${node.x + 18}" y="${node.y + 12}" fill="#94a3b8" font-size="10" font-family="monospace">
            ${node.message || 'commit'} (${node.branch})
          </text>
        </g>
      `;
    }).join('');

    return `
      <div class="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/20 overflow-x-auto">
        <div class="flex items-center justify-between mb-3 border-b border-outline-variant/10 pb-2">
          <span class="text-xs font-mono font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px] text-primary">account_tree</span>
            <span>Branch Topology DAG</span>
          </span>
          <span class="text-[10px] text-on-surface-variant font-mono">
            ${nodes.length} Commits • ${totalLanes} Lanes
          </span>
        </div>
        <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" class="overflow-visible select-none">
          ${edgePaths}
          ${nodeElements}
        </svg>
      </div>
    `;
  }
}

export const branchTopologyVisualizer = new BranchTopologyVisualizer();
