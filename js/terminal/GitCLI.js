// GitCLI: Interactive Git Command Parser & Terminal Engine

import { StorageService } from '../services/StorageService.js';
import { soundFX } from '../audio.js';

export class GitCLI {
  constructor(gameState, gridEngine, options = {}) {
    this.state = gameState;
    this.engine = gridEngine;
    this.onCommitSuccess = options.onCommitSuccess || null;
    this.onSwitchLevel = options.onSwitchLevel || null;
    this.onLogUpdate = options.onLogUpdate || null;
    this.history = [];
    this.historyIndex = -1;
    this.logs = [
      { type: 'cmd', text: 'git status' },
      {
        type: 'status',
        branch: `level-${this.state.levelId}`,
        objective: 'Move the box to the goal',
        boxStatus: this.state.isGoalReached ? 'ON GOAL (READY TO COMMIT)' : 'NOT ON GOAL',
        progress: this.state.isGoalReached ? '100%' : '72%'
      }
    ];
  }

  setGameState(gameState, gridEngine) {
    this.state = gameState;
    this.engine = gridEngine;
    this.logs.push(
      { type: 'system', text: `Switched to branch level-${this.state.levelId}` },
      {
        type: 'status',
        branch: `level-${this.state.levelId}`,
        objective: this.state.levelDef.description || 'Move the box to the goal',
        boxStatus: this.state.isGoalReached ? 'ON GOAL (READY TO COMMIT)' : 'NOT ON GOAL',
        progress: this.state.isGoalReached ? '100%' : '45%'
      }
    );
    if (this.onLogUpdate) this.onLogUpdate();
  }

  execute(rawCommand) {
    const trimmed = rawCommand.trim();
    if (!trimmed) return null;

    soundFX.playKey();
    this.history.push(trimmed);
    this.historyIndex = this.history.length;
    this.state.commandsCount++;

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const subCmd = parts[1] ? parts[1].toLowerCase() : '';
    const arg = parts[2] || '';

    // Log the input command
    this.logs.push({ type: 'cmd', text: trimmed });

    if (cmd === 'clear') {
      this.logs = [];
      if (this.onLogUpdate) this.onLogUpdate();
      return { success: true };
    }

    if (cmd === 'help') {
      this.logs.push({
        type: 'output',
        text: `GitQuest Supported Commands:\n  git left            - Move player left\n  git right           - Move player right\n  git up              - Move player up\n  git down            - Move player down\n  git push            - Push the payload box forward\n  git pull            - Pull the payload box toward player\n  git pull left       - Pull object on the left toward player\n  git pull right      - Pull object on the right toward player\n  git pull up         - Pull object above toward player\n  git pull down       - Pull object below toward player\n  git status          - Check current branch, stage status & objective\n  git commit          - Commit and finalize solved level\n  git switch <lvl>    - Switch to another level (e.g. git switch 08)\n  clear               - Clear terminal screen`
      });
      if (this.onLogUpdate) this.onLogUpdate();
      return { success: true };
    }

    if (cmd === 'git') {
      StorageService.updateCommandUsage(`git ${subCmd}`);

      switch (subCmd) {
        case 'status': {
          this.state.statusCount++;
          soundFX.playSuccess();
          const onGoal = this.state.checkGoal();
          this.logs.push({
            type: 'status',
            branch: `level-${this.state.levelId}`,
            objective: this.state.levelDef.description || 'Move the box to the goal',
            boxStatus: onGoal ? 'ON GOAL (READY TO COMMIT)' : 'NOT ON GOAL',
            progress: onGoal ? '100% (Changes staged)' : `${Math.min(90, Math.floor((this.state.moves * 12) + 20))}%`
          });
          break;
        }

        case 'push': {
          const res = this.engine.gitPush();
          if (res.success) {
            if (res.pushed) {
              this.logs.push({
                type: 'push',
                detail: '→ Pushing box...',
                result: res.onGoal ? '✓ Box moved onto goal! Ready to commit.' : '✓ Box moved'
              });
            } else {
              this.logs.push({
                type: 'push',
                detail: '→ Player moved forward',
                result: '✓ Position synced'
              });
            }
          } else {
            this.logs.push({
              type: 'error',
              text: res.reason === 'blocked_box' ? 'fatal: Push rejected. Path blocked by firewall.' : 'fatal: Cannot push into perimeter wall.'
            });
          }
          break;
        }

        case 'pull': {
          const dirMap = {
            left: 'to the left',
            right: 'to the right',
            up: 'upward',
            down: 'downward'
          };
          const dir = (arg || '').toLowerCase();
          const res = dir ? this.engine.pullDirection(dir) : this.engine.gitPull();

          if (res.success) {
            const dirDesc = dirMap[res.direction] || 'toward player';
            this.logs.push({
              type: 'pull',
              detail: `Pulling payload ${dirDesc}...`,
              result: res.onGoal ? `✓ Pulled object ${dirDesc}. Payload on goal!` : `✓ Pulled object ${dirDesc}.`
            });
          } else {
            if (res.reason === 'obstructed_pull_path') {
              this.logs.push({
                type: 'error',
                text: '✕ Pull blocked. Path obstructed by wall or perimeter boundary.'
              });
            } else {
              this.logs.push({
                type: 'error',
                text: '✕ Nothing to pull in that direction.'
              });
            }
          }
          break;
        }

        case 'commit': {
          const onGoal = this.state.checkGoal();
          if (onGoal) {
            soundFX.playLevelComplete();
            this.logs.push({
              type: 'commit_success',
              commitHash: Math.random().toString(16).substring(2, 9),
              branch: `level-${this.state.levelId}`,
              message: `Solve level ${this.state.levelId}: ${this.state.levelDef.name}`,
              filesChanged: '1 file changed, 1 insertion(+)'
            });
            if (this.onCommitSuccess) {
              this.onCommitSuccess(this.state);
            }
          } else {
            soundFX.playError();
            this.logs.push({
              type: 'error',
              text: `error: cannot commit. Working tree dirty:\n  Box is NOT ON GOAL. Move payload to goal node first.`
            });
          }
          break;
        }

        case 'left': {
          const res = this.engine.moveDirection('left');
          if (res.success) {
            this.logs.push({
              type: 'movement',
              detail: 'Moving player left...',
              result: '✓ Player moved left.'
            });
          } else {
            this.logs.push({
              type: 'error',
              text: '✕ Movement blocked\nObstacle detected.'
            });
          }
          break;
        }

        case 'right': {
          const res = this.engine.moveDirection('right');
          if (res.success) {
            this.logs.push({
              type: 'movement',
              detail: 'Moving player right...',
              result: '✓ Player moved right.'
            });
          } else {
            this.logs.push({
              type: 'error',
              text: '✕ Movement blocked\nObstacle detected.'
            });
          }
          break;
        }

        case 'up': {
          const res = this.engine.moveDirection('up');
          if (res.success) {
            this.logs.push({
              type: 'movement',
              detail: 'Moving player up...',
              result: '✓ Player moved up.'
            });
          } else {
            this.logs.push({
              type: 'error',
              text: '✕ Movement blocked\nObstacle detected.'
            });
          }
          break;
        }

        case 'down': {
          const res = this.engine.moveDirection('down');
          if (res.success) {
            this.logs.push({
              type: 'movement',
              detail: 'Moving player down...',
              result: '✓ Player moved down.'
            });
          } else {
            this.logs.push({
              type: 'error',
              text: '✕ Movement blocked\nObstacle detected.'
            });
          }
          break;
        }

        case 'switch': {
          const targetLevel = arg ? arg.padStart(2, '0') : '';
          if (targetLevel) {
            soundFX.playSuccess();
            this.logs.push({
              type: 'output',
              text: `Switched to branch 'level-${targetLevel}'`
            });
            if (this.onSwitchLevel) {
              this.onSwitchLevel(targetLevel);
            }
          } else {
            soundFX.playError();
            this.logs.push({
              type: 'error',
              text: `fatal: missing level argument. Usage: git switch <level_id>`
            });
          }
          break;
        }

        default:
          soundFX.playError();
          this.logs.push({
            type: 'error',
            text: `git: '${subCmd}' is not a git command. See 'help'.`
          });
          break;
      }
    } else {
      soundFX.playError();
      this.logs.push({
        type: 'error',
        text: `command not found: ${cmd}. Type 'help' for available commands.`
      });
    }

    if (this.onLogUpdate) this.onLogUpdate();
    return { success: true };
  }

  getPreviousHistory() {
    if (this.history.length === 0) return '';
    if (this.historyIndex > 0) this.historyIndex--;
    return this.history[this.historyIndex] || '';
  }

  getNextHistory() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      return this.history[this.historyIndex] || '';
    }
    this.historyIndex = this.history.length;
    return '';
  }
}
