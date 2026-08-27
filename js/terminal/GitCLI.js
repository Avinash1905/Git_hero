/**
 * GitHero Terminal CLI Execution Engine
 * Evaluates Git commands and coordinates audio, physical state transitions, and HUD logs.
 */

import { soundFX } from '../audio.js';
import { StorageService } from '../services/StorageService.js';
import { appStore } from '../state/appStore.js';
import { eventBus, EVENTS } from '../state/eventBus.js';
import { CommandParser } from './CommandParser.js';

export class GitCLI {
  constructor(gameState, gridEngine, onCompleteLevel, onLogUpdate, onSwitchLevel) {
    this.state = gameState;
    this.engine = gridEngine;
    this.onCompleteLevel = onCompleteLevel;
    this.onLogUpdate = onLogUpdate;
    this.onSwitchLevel = onSwitchLevel;
    this.parser = new CommandParser();

    this.logs = [
      {
        type: 'output',
        text: `GitHero Terminal [v2.4.0-release]\nRepository: level-${this.state.levelId} (branch: main)\nType "help" or "git status" to inspect mission objective.`
      }
    ];
  }

  execute(commandString) {
    if (!commandString || !commandString.trim()) return { success: false };

    const trimmed = commandString.trim();
    this.state.commandsCount++;

    const parsed = this.parser.parse(trimmed);
    const cmd = parsed.primary;
    const subCmd = parsed.subCommand;
    const arg = parsed.arg;

    // Log user input
    this.logs.push({ type: 'cmd', text: trimmed });

    if (cmd === 'clear') {
      this.logs = [];
      if (this.onLogUpdate) this.onLogUpdate();
      return { success: true };
    }

    if (cmd === 'help') {
      this.logs.push({
        type: 'output',
        text: `GitHero Supported Commands:\n  git left            - Move player left\n  git right           - Move player right\n  git up              - Move player up\n  git down            - Move player down\n  git push            - Push the payload box forward\n  git pull            - Pull the payload box toward player\n  git pull left       - Pull object on the left toward player\n  git pull right      - Pull object on the right toward player\n  git pull up         - Pull object above toward player\n  git pull down       - Pull object below toward player\n  git status          - Check current branch, stage status & objective\n  git commit          - Commit and finalize solved level\n  git switch <lvl>    - Switch to another level (e.g. git switch 08)\n  git branch          - List available repository branches\n  git log             - View commit history\n  git reset           - Undo last move\n  clear               - Clear terminal screen`
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
              if (res.onGoal) {
                soundFX.playSuccess();
                appStore.checkAchievement('push_master');
              } else {
                soundFX.playMove();
              }
            }
          } else {
            soundFX.playError();
            this.logs.push({ type: 'error', text: `fatal: ${res.reason || 'cannot push'}` });
          }
          break;
        }

        case 'pull': {
          let res;
          if (['left', 'right', 'up', 'down'].includes(arg)) {
            res = this.engine.gitPullDirectional(arg);
          } else {
            res = this.engine.gitPullDefault();
          }

          if (res.success) {
            this.logs.push({
              type: 'pull',
              detail: `← Pulling repository box ${arg ? arg : ''}...`,
              result: res.onGoal ? '✓ Box pulled onto goal! Ready to commit.' : '✓ Fast-forward update complete.'
            });
            if (res.onGoal) {
              soundFX.playSuccess();
            } else {
              soundFX.playMove();
            }
          } else {
            soundFX.playError();
            this.logs.push({ type: 'error', text: `fatal: ${res.reason || 'cannot pull'}` });
          }
          break;
        }

        case 'commit': {
          const onGoal = this.state.checkGoal();
          if (onGoal) {
            this.state.isCommitted = true;
            soundFX.playCommit();
            this.logs.push({
              type: 'commit',
              detail: `[level-${this.state.levelId} ${Math.random().toString(16).substring(2, 9)}] ${this.state.levelDef.name || 'Level Solved'}`,
              result: '1 file changed, 1 insertion(+)'
            });
            appStore.checkAchievement('first_commit');

            setTimeout(() => {
              if (this.onCompleteLevel) this.onCompleteLevel();
            }, 700);
          } else {
            soundFX.playError();
            this.logs.push({
              type: 'error',
              text: 'nothing to commit, working tree clean (Move repository box onto the designated goal first)'
            });
          }
          break;
        }

        case 'switch': {
          if (!arg) {
            soundFX.playError();
            this.logs.push({ type: 'error', text: 'fatal: missing level argument. Usage: git switch <level_id>' });
            break;
          }
          const targetId = arg.replace(/^level-/, '').padStart(2, '0');
          this.logs.push({
            type: 'switch',
            detail: `Switched to branch 'level-${targetId}'`
          });
          soundFX.playSuccess();
          if (this.onSwitchLevel) this.onSwitchLevel(targetId);
          break;
        }

        case 'branch': {
          soundFX.playSuccess();
          this.logs.push({
            type: 'output',
            text: `* level-${this.state.levelId} (HEAD)\n  main\n  develop\n  feature/solve-puzzle`
          });
          break;
        }

        case 'log': {
          soundFX.playSuccess();
          this.logs.push({
            type: 'output',
            text: `commit 8f4a1c0 (HEAD -> level-${this.state.levelId})\nAuthor: Cyber Ninja <ninja@githero.io>\nDate:   ${new Date().toDateString()}\n\n    Initial level setup`
          });
          break;
        }

        case 'reset': {
          const didUndo = this.state.undo();
          if (didUndo) {
            soundFX.playKey();
            this.logs.push({ type: 'output', text: 'Unstaged changes and reverted to previous step.' });
          } else {
            this.logs.push({ type: 'output', text: 'HEAD is at initial commit. Nothing to reset.' });
          }
          break;
        }

        // Directional Navigation
        case 'left':
        case 'right':
        case 'up':
        case 'down': {
          const res = this.engine.movePlayer(subCmd);
          if (res.success) {
            soundFX.playMove();
          } else {
            soundFX.playError();
            this.logs.push({ type: 'error', text: `fatal: ${res.reason}` });
          }
          break;
        }

        default: {
          soundFX.playError();
          const fuzzy = this.parser.getFuzzySuggestion(trimmed);
          let errText = `git: '${subCmd}' is not a git command. See 'help'.`;
          if (fuzzy) {
            errText += `\nDid you mean: "${fuzzy}"?`;
          }
          this.logs.push({ type: 'error', text: errText });
          break;
        }
      }
    } else {
      soundFX.playError();
      const fuzzy = this.parser.getFuzzySuggestion(trimmed);
      let errText = `Command not recognized: "${cmd}". Type "help" for a list of GitHero commands.`;
      if (fuzzy) {
        errText += `\nDid you mean: "${fuzzy}"?`;
      }
      this.logs.push({ type: 'error', text: errText });
    }

    eventBus.emit(EVENTS.COMMAND_EXECUTED, { command: trimmed });
    if (this.onLogUpdate) this.onLogUpdate();
    return { success: true };
  }
}
