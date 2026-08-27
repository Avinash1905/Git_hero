/**
 * PhysicsSimulationBridge
 * High-precision discrete grid collision checker and laser trajectory raycaster
 * bridging the game engine physics loop with tactile HUD overlays.
 */

export class PhysicsSimulationBridge {
  checkCollision(pos, obstacles = []) {
    return obstacles.some(o => o.x === pos.x && o.y === pos.y);
  }

  traceLaserBeam(emitter, maxDistance = 20, obstacles = []) {
    const points = [];
    let currX = emitter.x;
    let currY = emitter.y;

    const dx = emitter.dir === 'right' ? 1 : emitter.dir === 'left' ? -1 : 0;
    const dy = emitter.dir === 'down' ? 1 : emitter.dir === 'up' ? -1 : 0;

    for (let step = 1; step <= maxDistance; step++) {
      currX += dx;
      currY += dy;

      const hit = obstacles.find(o => o.x === currX && o.y === currY);
      points.push({ x: currX, y: currY, blocked: !!hit });

      if (hit) break;
    }

    return points;
  }
}

export const physicsSimulationBridge = new PhysicsSimulationBridge();
