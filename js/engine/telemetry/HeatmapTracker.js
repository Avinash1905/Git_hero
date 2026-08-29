/**
 * GitQuest Engine - Spatial Heatmap Tracker & Level Analytics
 * Tracks spatial player activity, push hotspots, choke points, and failure dead zones.
 */

export class HeatmapTracker {
  constructor(width = 10, height = 10) {
    this.width = width;
    this.height = height;
    this.footstepGrid = new Uint32Array(width * height);
    this.pushGrid = new Uint32Array(width * height);
    this.pullGrid = new Uint32Array(width * height);
    this.errorGrid = new Uint32Array(width * height);
  }

  _idx(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return -1;
    return y * this.width + x;
  }

  recordFootstep(x, y) {
    const idx = this._idx(x, y);
    if (idx !== -1) this.footstepGrid[idx]++;
  }

  recordPush(x, y) {
    const idx = this._idx(x, y);
    if (idx !== -1) this.pushGrid[idx]++;
  }

  recordPull(x, y) {
    const idx = this._idx(x, y);
    if (idx !== -1) this.pullGrid[idx]++;
  }

  recordError(x, y) {
    const idx = this._idx(x, y);
    if (idx !== -1) this.errorGrid[idx]++;
  }

  getHotspot(x, y) {
    const idx = this._idx(x, y);
    if (idx === -1) return 0;
    return this.footstepGrid[idx] + this.pushGrid[idx] * 2 + this.pullGrid[idx] * 2;
  }

  getMostVisitedTile() {
    let max = 0;
    let maxCoord = { x: 0, y: 0 };
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const val = this.footstepGrid[this._idx(x, y)];
        if (val > max) {
          max = val;
          maxCoord = { x, y };
        }
      }
    }
    return { ...maxCoord, count: max };
  }

  clear() {
    this.footstepGrid.fill(0);
    this.pushGrid.fill(0);
    this.pullGrid.fill(0);
    this.errorGrid.fill(0);
  }
}
