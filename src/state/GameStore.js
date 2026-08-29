/**
 * GameStore
 * Manages active gameplay view state, terminal output logs, victory modal display,
 * and subscriptions to the active GameEngineAdapter.
 */

import { Store } from './Store.js';
import { EngineStateMapper } from '../adapters/EngineStateMapper.js';

export class GameStore extends Store {
  constructor() {
    super({
      gameState: EngineStateMapper.getEmptyState(),
      terminalLogs: [
        { type: 'output', text: 'GitQuest Terminal v2.5.4 [Environment: Production Core]' },
        { type: 'output', text: 'Type "git status" or "help" for a list of available commands.' }
      ],
      isVictoryModalOpen: false,
      victoryStats: null,
      isPaused: false,
      activeLevelId: '01'
    });
  }

  updateEngineState(frontendState) {
    this.setState({ gameState: frontendState }, 'ENGINE_STATE_SYNC');
  }

  addTerminalLog(logEntry) {
    this.setState((prev) => ({
      terminalLogs: [...prev.terminalLogs.slice(-100), logEntry] // Keep last 100 entries
    }), 'TERMINAL_LOG_ADD');
  }

  clearTerminal() {
    this.setState({
      terminalLogs: [
        { type: 'output', text: 'Terminal output buffer cleared.' }
      ]
    }, 'TERMINAL_CLEAR');
  }

  showVictoryModal(stats) {
    this.setState({
      isVictoryModalOpen: true,
      victoryStats: stats
    }, 'SHOW_VICTORY_MODAL');
  }

  hideVictoryModal() {
    this.setState({
      isVictoryModalOpen: false,
      victoryStats: null
    }, 'HIDE_VICTORY_MODAL');
  }

  setPaused(isPaused) {
    this.setState({ isPaused: Boolean(isPaused) }, 'SET_GAME_PAUSED');
  }

  setActiveLevelId(levelId) {
    this.setState({ activeLevelId: String(levelId || '01').padStart(2, '0') }, 'SET_ACTIVE_LEVEL');
  }
}

export const gameStore = new GameStore();
