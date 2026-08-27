/**
 * GitHero SPA Master Application Controller
 * Manages reactive routing, active session state, keyboard bindings, and modal lifecycles.
 */

import { soundFX } from './audio.js';
import { StorageService } from './services/StorageService.js';
import { appStore } from './state/appStore.js';
import { eventBus, EVENTS } from './state/eventBus.js';
import { LEVELS } from './engine/Levels.js';
import { GameState } from './engine/GameState.js';
import { GridEngine } from './engine/GridEngine.js';
import { GitCLI } from './terminal/GitCLI.js';
import { TerminalHistory } from './terminal/TerminalHistory.js';
import { AutocompleteEngine } from './terminal/AutocompleteEngine.js';
import { authService } from './services/authService.js';
import { notificationService } from './services/notificationService.js';

// Components
import { renderTopAppBar } from './components/TopAppBar.js';
import { renderBottomNavBar } from './components/BottomNavBar.js';
import { renderLevelCompleteModal, initParticleSystem } from './components/LevelCompleteModal.js';
import { renderHintDialog } from './components/HintDialog.js';

// Views
import { renderHeroView } from './views/HeroView.js';
import { renderAuthView } from './views/AuthView.js';
import { renderDashboardView } from './views/DashboardView.js';
import { renderWorldMapView } from './views/WorldMapView.js';
import { renderLevelSelectionView } from './views/LevelSelectionView.js';
import { renderGameplayView, generateGridTilesHtml } from './views/GameplayView.js';
import { renderProfileView } from './views/ProfileView.js';
import { renderLeaderboardView } from './views/LeaderboardView.js';
import { renderAchievementsView } from './views/AchievementsView.js';
import { renderDailyChallengeView } from './views/DailyChallengeView.js';
import { renderSettingsView } from './views/SettingsView.js';
import { renderUserManualView } from './views/UserManualView.js';
import { renderLevelEditorView, LevelEditorController } from './views/LevelEditorView.js';

class GitHeroApp {
  constructor() {
    this.currentRoute = 'hero';
    this.currentLevelId = '01';
    this.selectedWorldFilter = null;
    this.activeSettingsCategory = 'general';
    this.activeLeaderboardTab = 'global';
    this.activeAchievementsCategory = 'all';

    this.gameState = null;
    this.gridEngine = null;
    this.gitCli = null;
    this.terminalHistory = new TerminalHistory();
    this.autocompleteEngine = new AutocompleteEngine();
    this.editor = new LevelEditorController();
    this.customLevelDef = null;
  }

  init() {
    appStore.init();
    soundFX.init();

    // Global Key Listener
    window.addEventListener('keydown', (e) => this.handleGlobalKeyDown(e));

    // Handle initial route
    this.navigate('hero');
  }

  navigate(route, params = {}) {
    this.currentRoute = route;

    if (route === 'gameplay') {
      if (params.levelId) this.currentLevelId = String(params.levelId).padStart(2, '0');
      this.customLevelDef = params.customLevel || null;
      this.initGameplaySession(this.currentLevelId, this.customLevelDef);
    } else {
      if (this.gameState) {
        this.gameState.stopTimer();
      }
    }

    if (params.worldFilter) this.selectedWorldFilter = params.worldFilter;
    if (params.settingsCategory) this.activeSettingsCategory = params.settingsCategory;
    if (params.leaderboardTab) this.activeLeaderboardTab = params.leaderboardTab;
    if (params.achievementsCategory) this.activeAchievementsCategory = params.achievementsCategory;

    this.render();
    window.scrollTo(0, 0);
  }

  initGameplaySession(levelId, customLevel = null) {
    const formattedId = String(levelId).padStart(2, '0');
    this.gameState = new GameState(formattedId, customLevel);
    this.gridEngine = new GridEngine(this.gameState);
    
    this.gitCli = new GitCLI(
      this.gameState,
      this.gridEngine,
      () => this.handleLevelComplete(),
      () => this.updateGameplayUI(),
      (newLevelId) => this.navigate('gameplay', { levelId: newLevelId })
    );

    this.gameState.startTimer((formattedTime) => {
      const timerEl = document.getElementById('game-timer-display');
      if (timerEl) timerEl.textContent = formattedTime;
    });
  }

  handleLevelComplete() {
    if (this.gameState) {
      this.gameState.stopTimer();
    }

    const elapsed = this.gameState.elapsedSeconds;
    const moves = this.gameState.moves;
    const levelDef = this.gameState.levelDef;

    // Calculate stars: 3 stars for par moves and time
    let stars = 3;
    if (moves > (levelDef.commitsReq || 10) * 1.5 || elapsed > 180) stars = 1;
    else if (moves > (levelDef.commitsReq || 10) || elapsed > 120) stars = 2;

    const stats = {
      levelId: this.gameState.levelId,
      stars,
      time: this.gameState.getFormattedTime(),
      moves,
      commands: this.gameState.commandsCount,
      xpAwarded: levelDef.xpReward || (stars * 150),
      score: Math.max(1000, 10000 - (moves * 50) - (elapsed * 10))
    };

    appStore.completeLevel(this.gameState.levelId, stats);

    // Render modal
    const overlayHtml = renderLevelCompleteModal(
      stats,
      () => {
        const nextId = String(parseInt(this.gameState.levelId, 10) + 1).padStart(2, '0');
        if (LEVELS[nextId]) {
          this.navigate('gameplay', { levelId: nextId });
        } else {
          this.navigate('levels');
        }
      },
      () => this.navigate('gameplay', { levelId: this.gameState.levelId }),
      () => this.navigate('world-map')
    );

    const container = document.createElement('div');
    container.innerHTML = overlayHtml;
    document.body.appendChild(container.firstElementChild);
    initParticleSystem();

    document.getElementById('modal-next-btn')?.addEventListener('click', () => {
      document.getElementById('level-complete-overlay')?.remove();
      const nextId = String(parseInt(this.gameState.levelId, 10) + 1).padStart(2, '0');
      if (LEVELS[nextId]) this.navigate('gameplay', { levelId: nextId });
      else this.navigate('levels');
    });

    document.getElementById('modal-replay-btn')?.addEventListener('click', () => {
      document.getElementById('level-complete-overlay')?.remove();
      this.navigate('gameplay', { levelId: this.gameState.levelId });
    });

    document.getElementById('modal-map-btn')?.addEventListener('click', () => {
      document.getElementById('level-complete-overlay')?.remove();
      this.navigate('world-map');
    });
  }

  updateGameplayUI() {
    const gridEl = document.getElementById('gameplay-grid');
    if (gridEl && this.gameState) {
      gridEl.innerHTML = generateGridTilesHtml(this.gameState);
    }

    const movesEl = document.getElementById('game-moves-display');
    if (movesEl && this.gameState) {
      movesEl.textContent = this.gameState.moves;
    }

    const logsContainer = document.getElementById('terminal-logs-container');
    if (logsContainer && this.gitCli) {
      logsContainer.innerHTML = this.gitCli.logs.map(log => {
        if (log.type === 'cmd') {
          return `
            <div class="text-sm font-terminal-code flex items-start gap-2 py-0.5">
              <span class="text-primary font-bold select-none">&gt;</span>
              <span class="text-on-surface font-semibold">${log.text}</span>
            </div>
          `;
        } else if (log.type === 'status') {
          return `
            <div class="p-3 my-1.5 bg-surface-container/90 rounded border border-outline-variant/40 text-xs font-terminal-code space-y-1">
              <div class="text-on-surface-variant flex justify-between">
                <span>On branch: <strong class="text-primary">${log.branch}</strong></span>
                <span class="text-tertiary">${log.progress}</span>
              </div>
              <div class="text-on-surface">Mission: ${log.objective}</div>
              <div class="${this.gameState.checkGoal() ? 'text-primary font-bold' : 'text-on-surface-variant'}">Payload status: ${log.boxStatus}</div>
            </div>
          `;
        } else if (log.type === 'push' || log.type === 'pull' || log.type === 'commit' || log.type === 'switch') {
          return `
            <div class="text-xs font-terminal-code py-1 text-on-surface-variant space-y-0.5 border-l-2 border-primary/50 pl-2 my-1">
              <div class="text-secondary">${log.detail}</div>
              <div class="text-primary">${log.result || ''}</div>
            </div>
          `;
        } else if (log.type === 'error') {
          return `
            <div class="text-xs font-terminal-code text-error py-1 flex items-start gap-1.5">
              <span class="material-symbols-outlined text-sm">error</span>
              <span>${log.text}</span>
            </div>
          `;
        }
        return `
          <div class="text-xs font-terminal-code text-on-surface-variant/90 whitespace-pre-wrap py-0.5">
            ${log.text}
          </div>
        `;
      }).join('');
      logsContainer.scrollTop = logsContainer.scrollHeight;
    }
  }

  handleGlobalKeyDown(e) {
    if (this.currentRoute !== 'gameplay' || !this.gitCli) return;

    const termInput = document.getElementById('terminal-input');
    const isInputFocused = document.activeElement === termInput;

    // Terminal History Navigation (Arrow Up / Down)
    if (isInputFocused) {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = this.terminalHistory.getPrevious();
        if (prev) termInput.value = prev;
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = this.terminalHistory.getNext();
        termInput.value = next;
      } else if (e.key === 'Tab') {
        e.preventDefault();
        const completion = this.autocompleteEngine.getTabCompletion(termInput.value);
        termInput.value = completion;
      }
      return;
    }

    // Arrow Key Navigation when not typing in terminal
    const keyMap = {
      'ArrowUp': 'up',
      'ArrowDown': 'down',
      'ArrowLeft': 'left',
      'ArrowRight': 'right',
      'w': 'up',
      's': 'down',
      'a': 'left',
      'd': 'right'
    };

    if (keyMap[e.key]) {
      e.preventDefault();
      this.gitCli.execute(`git ${keyMap[e.key]}`);
    }
  }

  render() {
    const root = document.getElementById('app-root');
    if (!root) return;

    let viewHtml = '';
    const isGameplay = this.currentRoute === 'gameplay';

    switch (this.currentRoute) {
      case 'hero':
        viewHtml = renderHeroView(
          () => this.navigate('gameplay', { levelId: '01' }),
          () => this.navigate('levels')
        );
        break;
      case 'auth':
        viewHtml = renderAuthView('login', () => this.navigate('dashboard'));
        break;
      case 'dashboard':
        viewHtml = renderDashboardView(
          (lvlId) => this.navigate('gameplay', { levelId: lvlId }),
          () => this.navigate('daily'),
          () => this.navigate('world-map')
        );
        break;
      case 'world-map':
        viewHtml = renderWorldMapView((worldId) => this.navigate('levels', { worldFilter: String(worldId) }));
        break;
      case 'levels':
        viewHtml = renderLevelSelectionView(this.selectedWorldFilter);
        break;
      case 'gameplay':
        viewHtml = renderGameplayView(this.gameState, this.gitCli);
        break;
      case 'profile':
        viewHtml = renderProfileView();
        break;
      case 'leaderboard':
        viewHtml = renderLeaderboardView(this.activeLeaderboardTab, (tab) => this.navigate('leaderboard', { leaderboardTab: tab }));
        break;
      case 'achievements':
        viewHtml = renderAchievementsView(this.activeAchievementsCategory, (cat) => this.navigate('achievements', { achievementsCategory: cat }));
        break;
      case 'daily':
        viewHtml = renderDailyChallengeView(() => this.navigate('gameplay', { levelId: '07' }));
        break;
      case 'settings':
        viewHtml = renderSettingsView(this.activeSettingsCategory, (cat) => this.navigate('settings', { settingsCategory: cat }));
        break;
      case 'manual':
        viewHtml = renderUserManualView();
        break;
      case 'editor':
        viewHtml = renderLevelEditorView(this.editor);
        break;
      default:
        viewHtml = renderHeroView(() => this.navigate('gameplay'), () => this.navigate('levels'));
    }

    const topAppBarHtml = renderTopAppBar(
      this.currentRoute,
      (r) => this.navigate(r),
      () => this.navigate('settings')
    );
    const bottomNavHtml = renderBottomNavBar(isGameplay);

    root.innerHTML = `
      ${topAppBarHtml}
      ${viewHtml}
      ${bottomNavHtml}
    `;

    this.bindEvents();
  }

  bindEvents() {
    // Top App Bar Navigation
    document.getElementById('brand-logo-btn')?.addEventListener('click', () => this.navigate('hero'));
    document.getElementById('nav-main-btn')?.addEventListener('click', () => this.navigate('dashboard'));
    document.getElementById('nav-logs-btn')?.addEventListener('click', () => this.navigate('achievements'));
    document.getElementById('nav-map-btn')?.addEventListener('click', () => this.navigate('world-map'));
    document.getElementById('nav-levels-btn')?.addEventListener('click', () => this.navigate('levels'));
    document.getElementById('nav-editor-btn')?.addEventListener('click', () => this.navigate('editor'));
    document.getElementById('top-profile-btn')?.addEventListener('click', () => this.navigate('profile'));
    document.getElementById('top-settings-btn')?.addEventListener('click', () => this.navigate('settings'));

    // Bottom Navigation (Mobile)
    document.getElementById('mob-nav-dash')?.addEventListener('click', () => this.navigate('dashboard'));
    document.getElementById('mob-nav-map')?.addEventListener('click', () => this.navigate('world-map'));
    document.getElementById('mob-nav-play')?.addEventListener('click', () => this.navigate('gameplay', { levelId: this.currentLevelId }));
    document.getElementById('mob-nav-profile')?.addEventListener('click', () => this.navigate('profile'));

    // Hero View Events
    document.getElementById('hero-play-btn')?.addEventListener('click', () => this.navigate('gameplay', { levelId: '01' }));
    document.getElementById('hero-explore-btn')?.addEventListener('click', () => this.navigate('levels'));

    // Dashboard View Events
    document.getElementById('dash-play-btn')?.addEventListener('click', () => this.navigate('gameplay', { levelId: '07' }));
    document.getElementById('dash-continue-card')?.addEventListener('click', () => this.navigate('gameplay', { levelId: '07' }));
    document.getElementById('dash-world-progress')?.addEventListener('click', () => this.navigate('world-map'));
    document.getElementById('dash-daily-banner')?.addEventListener('click', () => this.navigate('daily'));
    document.getElementById('dash-quick-commit')?.addEventListener('click', () => this.navigate('gameplay', { levelId: '01' }));
    document.getElementById('dash-quick-merge')?.addEventListener('click', () => this.navigate('gameplay', { levelId: '07' }));
    document.getElementById('dash-quick-rebase')?.addEventListener('click', () => this.navigate('gameplay', { levelId: '10' }));

    // Level Selection World Filter Tabs & Cards
    document.querySelectorAll('[data-world-filter]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const filter = e.currentTarget.getAttribute('data-world-filter');
        this.selectedWorldFilter = filter === 'all' ? null : filter;
        this.render();
      });
    });

    document.querySelectorAll('.level-card[data-unlocked="true"]').forEach(card => {
      card.addEventListener('click', () => {
        const levelId = card.getAttribute('data-level-id');
        if (levelId) this.navigate('gameplay', { levelId });
      });
    });

    // World Map Interactive Nodes
    document.querySelectorAll('[id^="node-world-"]').forEach(node => {
      node.addEventListener('click', () => {
        const worldId = node.id.replace('node-world-', '');
        this.navigate('levels', { worldFilter: worldId });
      });
    });

    // Gameplay Terminal Input & Buttons
    const terminalForm = document.getElementById('terminal-form');
    const terminalInput = document.getElementById('terminal-input');
    if (terminalForm && terminalInput && this.gitCli) {
      terminalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const cmd = terminalInput.value;
        if (cmd.trim()) {
          this.terminalHistory.push(cmd);
          terminalInput.value = '';
          this.gitCli.execute(cmd);
        }
      });
    }

    // HUD Actions
    document.getElementById('hud-hint-btn')?.addEventListener('click', () => {
      if (!this.gameState) return;
      const overlayHtml = renderHintDialog(this.gameState.levelDef, () => {
        document.getElementById('hint-modal-overlay')?.remove();
      });
      const container = document.createElement('div');
      container.innerHTML = overlayHtml;
      document.body.appendChild(container.firstElementChild);

      document.getElementById('hint-close-btn')?.addEventListener('click', () => {
        document.getElementById('hint-modal-overlay')?.remove();
      });
      document.getElementById('hint-ok-btn')?.addEventListener('click', () => {
        document.getElementById('hint-modal-overlay')?.remove();
      });
    });

    document.getElementById('hud-reset-btn')?.addEventListener('click', () => {
      if (this.gitCli) {
        this.gitCli.execute('git reset');
      }
    });

    // Settings Category Buttons
    ['general', 'sound', 'graphics', 'accessibility', 'controls'].forEach(cat => {
      document.getElementById(`set-cat-${cat}`)?.addEventListener('click', () => {
        this.activeSettingsCategory = cat;
        this.render();
      });
    });

    // Settings Toggles & Sliders
    document.getElementById('toggle-sound')?.addEventListener('change', (e) => {
      appStore.updateSettings({ soundEffects: e.target.checked });
      soundFX.enabled = e.target.checked;
    });

    document.getElementById('slider-volume')?.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      appStore.updateSettings({ volume: val });
      soundFX.setVolume(val / 100);
      const valDisplay = document.getElementById('volume-val-display');
      if (valDisplay) valDisplay.textContent = `${val}%`;
    });

    document.getElementById('toggle-crt')?.addEventListener('change', (e) => {
      appStore.updateSettings({ crtFilter: e.target.checked });
    });

    document.getElementById('toggle-shake')?.addEventListener('change', (e) => {
      appStore.updateSettings({ screenShake: e.target.checked });
    });

    // Leaderboard Tabs
    document.getElementById('tab-global-btn')?.addEventListener('click', () => {
      this.activeLeaderboardTab = 'global';
      this.render();
    });
    document.getElementById('tab-friends-btn')?.addEventListener('click', () => {
      this.activeLeaderboardTab = 'friends';
      this.render();
    });
    document.getElementById('tab-weekly-btn')?.addEventListener('click', () => {
      this.activeLeaderboardTab = 'weekly';
      this.render();
    });

    // Level Editor Bindings
    if (this.currentRoute === 'editor') {
      document.querySelectorAll('[data-editor-tool]').forEach(btn => {
        btn.addEventListener('click', () => {
          this.editor.setTool(btn.getAttribute('data-editor-tool'));
          document.querySelectorAll('[data-editor-tool]').forEach(b => b.classList.remove('ring-2', 'ring-primary'));
          btn.classList.add('ring-2', 'ring-primary');
        });
      });

      document.querySelectorAll('[data-editor-cell]').forEach(cell => {
        cell.addEventListener('click', () => {
          const x = parseInt(cell.getAttribute('data-x'), 10);
          const y = parseInt(cell.getAttribute('data-y'), 10);
          this.editor.handleCellClick(x, y);
          this.render();
        });
      });

      document.getElementById('editor-clear-btn')?.addEventListener('click', () => {
        this.editor.clear();
        this.render();
      });

      const runTest = () => {
        const customLevel = this.editor.exportLevel();
        this.navigate('gameplay', { levelId: 'CUSTOM', customLevel });
      };

      document.getElementById('editor-test-btn')?.addEventListener('click', runTest);
    }
  }
}

// Bootstrap GitHero application
window.addEventListener('DOMContentLoaded', () => {
  const app = new GitHeroApp();
  app.init();
});
