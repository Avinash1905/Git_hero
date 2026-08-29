/**
 * GitQuest Custom Hook: useGameEngine
 */

import { gameStore } from '../state/DomainStores.js';
import { globalEventBus } from '../state/EventBus.js';

export function useGameEngine(engineFacade) {
  const moveDirection = (direction) => {
    if (!engineFacade) return { success: false };
    const res = engineFacade.moveDirection(direction);
    if (res.success) {
      globalEventBus.emit('game:move', { direction, res });
    }
    return res;
  };

  const pullDirection = (direction) => {
    if (!engineFacade) return { success: false };
    const res = engineFacade.pullDirection(direction);
    if (res.success) {
      globalEventBus.emit('game:pull', { direction, res });
    }
    return res;
  };

  const gitPush = () => {
    if (!engineFacade) return { success: false };
    const res = engineFacade.gitPush();
    if (res.success) {
      globalEventBus.emit('game:push', { res });
    }
    return res;
  };

  const undo = () => {
    if (!engineFacade) return false;
    const res = engineFacade.undo();
    if (res) {
      globalEventBus.emit('game:undo');
    }
    return res;
  };

  const reset = () => {
    if (!engineFacade) return;
    engineFacade.loadLevel(engineFacade.levelId);
    globalEventBus.emit('game:reset');
  };

  return {
    state: gameStore.getState(),
    moveDirection,
    pullDirection,
    gitPush,
    undo,
    reset
  };
}
