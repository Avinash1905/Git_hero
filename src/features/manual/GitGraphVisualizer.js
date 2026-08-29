/**
 * GitQuest Feature: Interactive Canvas Git Graph DAG Renderer
 */

export class GitGraphVisualizer {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement ? canvasElement.getContext('2d') : null;
    this.nodes = [];
    this.edges = [];
    this.branches = new Map();
    this.headNodeId = null;
  }

  setGraph(nodes, edges, headId = null) {
    this.nodes = nodes || [];
    this.edges = edges || [];
    this.headNodeId = headId;
    this.render();
  }

  render() {
    if (!this.ctx || !this.canvas) return;
    const { width, height } = this.canvas;
    this.ctx.clearRect(0, 0, width, height);

    // Draw background grid
    this.ctx.strokeStyle = 'rgba(173, 198, 255, 0.05)';
    this.ctx.lineWidth = 1;
    const gridSize = 24;
    for (let x = 0; x < width; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, height);
      this.ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(width, y);
      this.ctx.stroke();
    }

    // Draw Edges (DAG Connections)
    this.ctx.strokeStyle = '#adc6ff';
    this.ctx.lineWidth = 2;
    for (const edge of this.edges) {
      const fromNode = this.nodes.find(n => n.id === edge.from);
      const toNode = this.nodes.find(n => n.id === edge.to);
      if (fromNode && toNode) {
        this.ctx.beginPath();
        this.ctx.moveTo(fromNode.x, fromNode.y);
        this.ctx.bezierCurveTo(
          fromNode.x + 30, fromNode.y,
          toNode.x - 30, toNode.y,
          toNode.x, toNode.y
        );
        this.ctx.stroke();
      }
    }

    // Draw Nodes (Commits)
    for (const node of this.nodes) {
      const isHead = node.id === this.headNodeId;

      // Glow effect for HEAD
      if (isHead) {
        this.ctx.shadowColor = '#4edea3';
        this.ctx.shadowBlur = 12;
      } else {
        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;
      }

      this.ctx.fillStyle = isHead ? '#4edea3' : (node.color || '#1f2a3c');
      this.ctx.strokeStyle = isHead ? '#ffffff' : '#adc6ff';
      this.ctx.lineWidth = isHead ? 3 : 2;

      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, 14, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();

      // Commit Hash Label
      this.ctx.fillStyle = '#d8e3fb';
      this.ctx.font = '10px "JetBrains Mono", monospace';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(node.hash || node.id.substring(0, 7), node.x, node.y + 24);

      // Commit Message
      if (node.message) {
        this.ctx.fillStyle = '#bbcabf';
        this.ctx.font = '11px "Geist", sans-serif';
        this.ctx.fillText(node.message, node.x, node.y - 18);
      }
    }

    // Reset shadow
    this.ctx.shadowColor = 'transparent';
    this.ctx.shadowBlur = 0;
  }
}
