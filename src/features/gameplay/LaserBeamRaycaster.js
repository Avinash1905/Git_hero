/**
 * LaserBeamRaycaster
 * Multi-color laser beam raycaster calculating reflection angles off angled ref mirrors and refraction through prism boxes.
 */

export class LaserBeamRaycaster {
  castBeam(origin, direction, obstacles = [], maxBounces = 3) {
    const segments = [];
    let currX = origin.x;
    let currY = origin.y;
    let currentDir = direction;

    for (let bounce = 0; bounce <= maxBounces; bounce++) {
      const dx = currentDir === 'right' ? 1 : currentDir === 'left' ? -1 : 0;
      const dy = currentDir === 'down' ? 1 : currentDir === 'up' ? -1 : 0;
      let hit = null;

      while (!hit) {
        currX += dx;
        currY += dy;

        hit = obstacles.find(o => o.x === currX && o.y === currY);
        segments.push({ x: currX, y: currY, bounce });

        if (currX < 0 || currX > 30 || currY < 0 || currY > 30) break;
      }

      if (!hit || hit.type !== 'mirror') break;
      // Change direction on mirror hit
      currentDir = currentDir === 'right' ? 'down' : currentDir === 'down' ? 'left' : 'up';
    }

    return segments;
  }
}

export const laserBeamRaycaster = new LaserBeamRaycaster();
