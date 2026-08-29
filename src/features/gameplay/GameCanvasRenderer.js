/**
 * GameCanvasRenderer
 * Hardware-accelerated HTML5 Canvas 2D renderer for active gameplay arena.
 * Supports smooth sprite lerping, particle trails, grid lighting, high-DPI retina display,
 * and dynamic camera framing.
 */

export class GameCanvasRenderer {
  constructor(canvasElement, options = {}) {
    this.canvas = canvasElement;
    this.ctx = canvasElement ? canvasElement.getContext('2d') : null;
    this.options = {
      tileSize: options.tileSize || 64,
      smoothMoves: options.smoothMoves !== false,
      showGridLines: options.showGridLines !== false,
      enableGlow: options.enableGlow !== false,
      ...options
    };

    // Camera and display scaling
    this.camera = { x: 0, y: 0, zoom: 1 };
    this.dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1;
    this.animFrameId = null;

    // Interpolation state
    this.interpolatedPlayer = { x: 1, y: 1, currentX: 1, currentY: 1 };
    this.interpolatedBox = { x: 2, y: 2, currentX: 2, currentY: 2 };
    this.particles = [];
  }

  /**
   * Resize canvas according to device pixel ratio
   */
  resize(width, height) {
    if (!this.canvas) return;
    this.canvas.width = width * this.dpr;
    this.canvas.height = height * this.dpr;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    if (this.ctx) {
      this.ctx.scale(this.dpr, this.dpr);
    }
  }

  /**
   * Main render loop executing at 60 FPS
   * @param {import('../../adapters/EngineStateMapper.js').FrontendGameplayState} gameState
   */
  render(gameState) {
    if (!this.ctx || !gameState || !gameState.grid) return;

    const { width, height, gridSize } = gameState.grid;
    const tileSize = this.options.tileSize;
    const canvasWidth = width * tileSize;
    const canvasHeight = height * tileSize;

    // Clear background
    this.ctx.fillStyle = '#081425'; // surface background
    this.ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // 1. Draw Grid Lines
    if (this.options.showGridLines) {
      this.drawGridLines(width, height, tileSize);
    }

    // 2. Draw Floor & Ambient Glow
    this.drawFloorTiles(width, height, tileSize);

    // 3. Draw Hazards
    for (const h of gameState.grid.hazards || []) {
      this.drawHazardTile(h.x, h.y, tileSize);
    }

    // 4. Draw Goal Node
    if (gameState.goal) {
      this.drawGoalNode(gameState.goal.x, gameState.goal.y, tileSize, gameState.isGoalReached);
    }

    // 5. Draw Walls
    for (const w of gameState.grid.walls || []) {
      this.drawWallTile(w.x, w.y, tileSize);
    }

    // 6. Draw Switches & Doors
    for (const s of gameState.grid.switches || []) {
      this.drawSwitch(s.x, s.y, tileSize, s.active);
    }
    for (const d of gameState.grid.doors || []) {
      this.drawDoor(d.x, d.y, tileSize, d.open);
    }

    // 7. Update & Draw Interpolated Pushable Box
    this.updateBoxInterpolation(gameState.box);
    this.drawPushableBox(this.interpolatedBox.currentX, this.interpolatedBox.currentY, tileSize, gameState.isGoalReached);

    // 8. Update & Draw Interpolated Player Avatar
    this.updatePlayerInterpolation(gameState.player);
    this.drawPlayerAvatar(this.interpolatedPlayer.currentX, this.interpolatedPlayer.currentY, tileSize, gameState.player.direction);

    // 9. Draw Particle Trail
    this.updateAndDrawParticles();
  }

  drawGridLines(cols, rows, size) {
    this.ctx.strokeStyle = 'rgba(60, 74, 66, 0.2)'; // outline-variant/20
    this.ctx.lineWidth = 1;

    this.ctx.beginPath();
    for (let x = 0; x <= cols; x++) {
      this.ctx.moveTo(x * size, 0);
      this.ctx.lineTo(x * size, rows * size);
    }
    for (let y = 0; y <= rows; y++) {
      this.ctx.moveTo(0, y * size);
      this.ctx.lineTo(cols * size, y * size);
    }
    this.ctx.stroke();
  }

  drawFloorTiles(cols, rows, size) {
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        this.ctx.fillStyle = (x + y) % 2 === 0 ? '#040e1f' : '#081425';
        this.ctx.fillRect(x * size + 1, y * size + 1, size - 2, size - 2);
      }
    }
  }

  drawWallTile(gx, gy, size) {
    const px = gx * size;
    const py = gy * size;

    this.ctx.fillStyle = '#1f2a3c'; // surface-container-high
    this.ctx.fillRect(px + 1, py + 1, size - 2, size - 2);

    this.ctx.strokeStyle = '#3c4a42'; // outline-variant
    this.ctx.lineWidth = 1.5;
    this.ctx.strokeRect(px + 2, py + 2, size - 4, size - 4);

    // Decorative inner micro-dot
    this.ctx.fillStyle = '#86948a';
    this.ctx.beginPath();
    this.ctx.arc(px + size / 2, py + size / 2, 2, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawHazardTile(gx, gy, size) {
    const px = gx * size;
    const py = gy * size;

    this.ctx.fillStyle = 'rgba(255, 180, 171, 0.12)'; // error/12
    this.ctx.fillRect(px + 1, py + 1, size - 2, size - 2);

    this.ctx.strokeStyle = '#ffb4ab';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(px + 4, py + 4, size - 8, size - 8);
  }

  drawGoalNode(gx, gy, size, isSatisfied) {
    const px = gx * size;
    const py = gy * size;

    this.ctx.save();
    if (isSatisfied) {
      this.ctx.fillStyle = 'rgba(78, 222, 163, 0.25)'; // primary/25
      this.ctx.strokeStyle = '#4edea3';
      this.ctx.shadowColor = '#4edea3';
      this.ctx.shadowBlur = 15;
    } else {
      this.ctx.fillStyle = 'rgba(78, 222, 163, 0.06)';
      this.ctx.strokeStyle = 'rgba(78, 222, 163, 0.6)';
    }

    this.ctx.setLineDash([4, 4]);
    this.ctx.lineWidth = 2;
    this.ctx.fillRect(px + 4, py + 4, size - 8, size - 8);
    this.ctx.strokeRect(px + 4, py + 4, size - 8, size - 8);
    this.ctx.restore();
  }

  drawSwitch(gx, gy, size, active) {
    const cx = gx * size + size / 2;
    const cy = gy * size + size / 2;

    this.ctx.save();
    this.ctx.fillStyle = active ? '#ffb95f' : '#2a3548';
    if (active) {
      this.ctx.shadowColor = '#ffb95f';
      this.ctx.shadowBlur = 10;
    }
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, size * 0.25, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }

  drawDoor(gx, gy, size, open) {
    const px = gx * size;
    const py = gy * size;

    this.ctx.fillStyle = open ? 'rgba(173, 198, 255, 0.15)' : '#0566d9';
    this.ctx.fillRect(px + 2, py + 2, size - 4, size - 4);
    this.ctx.strokeStyle = '#adc6ff';
    this.ctx.strokeRect(px + 2, py + 2, size - 4, size - 4);
  }

  updateBoxInterpolation(targetBox) {
    if (!targetBox) return;
    this.interpolatedBox.x = targetBox.x;
    this.interpolatedBox.y = targetBox.y;

    const speed = 0.35;
    this.interpolatedBox.currentX += (this.interpolatedBox.x - this.interpolatedBox.currentX) * speed;
    this.interpolatedBox.currentY += (this.interpolatedBox.y - this.interpolatedBox.currentY) * speed;
  }

  drawPushableBox(bx, by, size, onGoal) {
    const px = bx * size + 4;
    const py = by * size + 4;
    const w = size - 8;
    const h = size - 8;

    this.ctx.save();
    if (onGoal) {
      this.ctx.fillStyle = '#4edea3'; // primary
      this.ctx.shadowColor = '#4edea3';
      this.ctx.shadowBlur = 18;
    } else {
      this.ctx.fillStyle = '#152031'; // surface-container
      this.ctx.strokeStyle = '#4edea3';
      this.ctx.lineWidth = 1.5;
    }

    this.ctx.fillRect(px, py, w, h);
    if (!onGoal) this.ctx.strokeRect(px, py, w, h);

    // Label on box
    this.ctx.fillStyle = onGoal ? '#003824' : '#4edea3';
    this.ctx.font = 'bold 10px JetBrains Mono, monospace';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(onGoal ? 'STAGED' : 'COMMIT', px + w / 2, py + h / 2);
    this.ctx.restore();
  }

  updatePlayerInterpolation(targetPlayer) {
    if (!targetPlayer) return;
    this.interpolatedPlayer.x = targetPlayer.x;
    this.interpolatedPlayer.y = targetPlayer.y;

    const speed = 0.35;
    this.interpolatedPlayer.currentX += (this.interpolatedPlayer.x - this.interpolatedPlayer.currentX) * speed;
    this.interpolatedPlayer.currentY += (this.interpolatedPlayer.y - this.interpolatedPlayer.currentY) * speed;
  }

  drawPlayerAvatar(px, py, size, direction = 'up') {
    const cx = px * size + size / 2;
    const cy = py * size + size / 2;
    const radius = size * 0.32;

    this.ctx.save();
    this.ctx.translate(cx, cy);

    let angle = 0;
    if (direction === 'right') angle = Math.PI / 2;
    if (direction === 'down') angle = Math.PI;
    if (direction === 'left') angle = -Math.PI / 2;

    this.ctx.rotate(angle);

    // Avatar body
    this.ctx.fillStyle = 'rgba(78, 222, 163, 0.2)';
    this.ctx.strokeStyle = '#4edea3';
    this.ctx.lineWidth = 2;
    this.ctx.shadowColor = '#4edea3';
    this.ctx.shadowBlur = 12;

    this.ctx.beginPath();
    this.ctx.arc(0, 0, radius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();

    // Direction arrow pointer
    this.ctx.fillStyle = '#4edea3';
    this.ctx.beginPath();
    this.ctx.moveTo(0, -radius * 0.7);
    this.ctx.lineTo(radius * 0.45, radius * 0.45);
    this.ctx.lineTo(-radius * 0.45, radius * 0.45);
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.restore();
  }

  updateAndDrawParticles() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.02;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.life;
      this.ctx.fillRect(p.x, p.y, p.size, p.size);
    }
    this.ctx.globalAlpha = 1;
  }

  spawnDust(x, y, color = '#4edea3') {
    for (let i = 0; i < 8; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        color,
        life: 1
      });
    }
  }

  destroy() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
  }
}
