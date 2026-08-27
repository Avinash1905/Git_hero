// GitQuest Production SPA Main Application Controller
// Orchestrates routing, auth guarding, GameEngineAdapter, reactive state stores,
// 250-level progression, terminal integration, and Stitch design views.

import { soundService } from '../src/services/soundService.js';
import { authService } from '../src/services/authService.js';
import { playerService } from '../src/services/playerService.js';
import { levelService } from '../src/services/levelService.js';
import { progressService } from '../src/services/progressService.js';
import { leaderboardService } from '../src/services/leaderboardService.js';
import { achievementService } from '../src/services/achievementService.js';
import { challengeService } from '../src/services/challengeService.js';

import { authStore } from '../src/state/AuthStore.js';
import { playerStore } from '../src/state/PlayerStore.js';
import { levelStore } from '../src/state/LevelStore.js';
import { gameStore } from '../src/state/GameStore.js';
import { uiStore } from '../src/state/UIStore.js';
import { leaderboardStore, achievementStore } from '../src/state/LeaderboardStore.js';

import { AuthManager } from '../src/auth/AuthManager.js';
import { AuthGuard } from '../src/auth/AuthGuards.js';
import { GameEngineAdapter } from '../src/adapters/GameEngineAdapter.js';
import { TerminalController } from '../src/features/terminal/TerminalController.js';
import { LevelVictoryHandler } from '../src/features/gameplay/LevelVictoryHandler.js';
import { GameControls } from '../src/features/gameplay/GameControls.js';
import { ParticleEffects } from '../src/features/gameplay/ParticleEffects.js';

// App Shell Components
import { renderTopAppBar } from './components/TopAppBar.js';
import { renderBottomNavBar } from './components/BottomNavBar.js';

// Modular Page Views
import { renderHomePage } from '../src/pages/HomePage.js';
import { renderDashboardPage } from '../src/pages/DashboardPage.js';
import { renderLevelSelectionPage } from '../src/pages/LevelSelectionPage.js';
import { renderWorldMapPage } from '../src/pages/WorldMapPage.js';
import { renderGameplayPage } from '../src/pages/GameplayPage.js';
import { renderProfilePage } from '../src/pages/ProfilePage.js';
import { renderLeaderboardPage } from '../src/pages/LeaderboardPage.js';
import { renderAchievementsPage } from '../src/pages/AchievementsPage.js';
import { renderDailyChallengePage } from '../src/pages/DailyChallengePage.js';
import { renderSettingsPage } from '../src/pages/SettingsPage.js';
import { renderUserManualPage, renderNotFoundPage } from '../src/pages/UserManualPage.js';

// Auth Views
import { renderLoginForm } from '../src/auth/views/LoginForm.js';
import { renderRegisterForm } from '../src/auth/views/RegisterForm.js';
import { renderForgotPasswordForm, renderResetPasswordForm } from '../src/auth/views/ForgotPasswordForm.js';

class GitQuestApp {
  constructor() {
    this.currentRoute = 'hero';
    this.currentLevelId = '01';
    this.adapter = new GameEngineAdapter();
    this.terminalController = null;
    this.cleanupConfetti = null;
    this.authErrorMessage = '';
    this.authSuccessMessage = '';
  }

  async init() {
    // 1. Restore persistent user authentication session
    await AuthManager.initialize();

    // 2. Preload 250 levels and player progress into reactive LevelStore
    await levelStore.loadLevelsAndProgress();

    // 3. Load initial player profile data
    if (authService.isAuthenticated()) {
      await playerStore.loadPlayerProfile();
    }

    // 4. Global Hash Router Listener
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '') || 'hero';
      this.navigate(hash);
    });

    // 5. Global Keyboard Shortcuts Listener
    window.addEventListener('keydown', (e) => this.handleGlobalKeyDown(e));

    // 6. Navigate to initial route
    const initialHash = window.location.hash.replace('#', '') || 'hero';
    this.navigate(initialHash);
  }

  /**
   * Route navigation with security access checking
   */
  async navigate(route, params = {}) {
    if (this.cleanupConfetti) {
      this.cleanupConfetti();
      this.cleanupConfetti = null;
    }

    const access = AuthGuard.checkAccess(route);
    if (!access.allowed) {
      this.authErrorMessage = access.reason || 'Please authenticate to access this sector.';
      this.currentRoute = access.redirect || 'login';
      window.location.hash = this.currentRoute;
      this.render();
      return;
    }

    // Stop active engine timer if leaving gameplay
    if (this.currentRoute === 'gameplay' && route !== 'gameplay') {
      this.adapter.destroy();
    }

    this.currentRoute = route;
    window.location.hash = route;
    uiStore.setRoute(route);

    if (route === 'gameplay') {
      const targetLvl = params.levelId || this.currentLevelId || '01';
      await this.initGameplay(targetLvl, params.customLevel);
    } else if (route === 'leaderboard') {
      await leaderboardStore.loadRankings();
      this.render();
    } else if (route === 'achievements') {
      await achievementStore.loadAchievements();
      this.render();
    } else {
      this.render();
    }
  }

  /**
   * Initialize gameplay session for level
   */
  async initGameplay(levelId, customLevel = null) {
    this.currentLevelId = String(levelId || '01').padStart(2, '0');

    // 1. Initialize GameEngineAdapter for level
    const gameState = await this.adapter.initializeLevel(this.currentLevelId, customLevel);
    gameStore.updateEngineState(gameState);

    // 2. Setup Terminal Controller
    this.terminalController = new TerminalController(this.adapter, {
      onCommitSuccess: (state) => this.handleLevelComplete(state)
    });

    // 3. Bind live timer tick to HUD
    this.adapter.onTimerTick((formattedTime) => {
      const timerEl = document.getElementById('game-live-timer');
      if (timerEl) timerEl.textContent = formattedTime;
    });

    // 4. Subscribe to reactive state updates
    this.adapter.subscribe((state) => {
      gameStore.updateEngineState(state);
      const movesEl = document.getElementById('hud-moves-count');
      if (movesEl) movesEl.textContent = state.moves;

      const gridContainer = document.getElementById('game-puzzle-grid');
      if (gridContainer && this.currentRoute === 'gameplay') {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = renderGameplayPage(state, this.terminalController?.logs || []);
        const newGrid = tempDiv.querySelector('#game-puzzle-grid');
        if (newGrid) {
          gridContainer.replaceWith(newGrid);
        }
      }
    });

    this.render();
  }

  /**
   * Level completion event handler
   */
  handleLevelComplete(state) {
    const stats = {
      levelId: state.levelId,
      time: state.formattedTime,
      moves: state.moves,
      pushCount: state.pushCount,
      pullCount: state.pullCount,
      commands: state.commandsCount,
      score: state.score,
      stars: state.stars,
      xpAwarded: state.xpReward
    };

    LevelVictoryHandler.handleCompletion(state.levelId, stats, (r, p) => this.navigate(r, p));
    this.cleanupConfetti = ParticleEffects.startConfetti();
  }

  /**
   * Global keyboard navigation controls
   */
  handleGlobalKeyDown(e) {
    const isInput = document.activeElement && (
      document.activeElement.tagName === 'INPUT' ||
      document.activeElement.tagName === 'TEXTAREA' ||
      document.activeElement.tagName === 'SELECT'
    );

    if (this.currentRoute === 'gameplay' && this.adapter) {
      if (isInput && document.activeElement.id === 'terminal-cmd-input') {
        return; // Terminal handles its own arrow keys
      }

      let handled = false;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        this.adapter.movePlayer('up');
        soundService.playMove();
        handled = true;
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        this.adapter.movePlayer('down');
        soundService.playMove();
        handled = true;
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        this.adapter.movePlayer('left');
        soundService.playMove();
        handled = true;
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        this.adapter.movePlayer('right');
        soundService.playMove();
        handled = true;
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        this.adapter.undo();
        handled = true;
      }

      if (handled) {
        e.preventDefault();
      }
    }
  }

  /**
   * Main render method assembling App Shell and Active Page View
   */
  render() {
    const appRoot = document.getElementById('app-root');
    if (!appRoot) return;

    const isGameplay = this.currentRoute === 'gameplay';
    const topBarHtml = renderTopAppBar(this.currentRoute);

    let mainContentHtml = '';

    switch (this.currentRoute) {
      case 'hero':
      case 'home':
        mainContentHtml = renderHomePage();
        break;
      case 'login':
        mainContentHtml = renderLoginForm(this.authErrorMessage, this.authSuccessMessage);
        break;
      case 'register':
        mainContentHtml = renderRegisterForm(this.authErrorMessage, this.authSuccessMessage);
        break;
      case 'forgot-password':
        mainContentHtml = renderForgotPasswordForm(this.authErrorMessage, this.authSuccessMessage);
        break;
      case 'reset-password':
        mainContentHtml = renderResetPasswordForm(this.authErrorMessage, this.authSuccessMessage);
        break;
      case 'dashboard':
      case 'main':
        mainContentHtml = renderDashboardPage();
        break;
      case 'levels':
        mainContentHtml = renderLevelSelectionPage();
        break;
      case 'world-map':
        mainContentHtml = renderWorldMapPage();
        break;
      case 'gameplay':
        mainContentHtml = renderGameplayPage(this.adapter?.getFrontendState(), this.terminalController?.logs || []);
        break;
      case 'profile':
        mainContentHtml = renderProfilePage();
        break;
      case 'leaderboard':
        mainContentHtml = renderLeaderboardPage();
        break;
      case 'achievements':
        mainContentHtml = renderAchievementsPage();
        break;
      case 'daily':
        mainContentHtml = renderDailyChallengePage();
        break;
      case 'settings':
        mainContentHtml = renderSettingsPage();
        break;
      case 'manual':
        mainContentHtml = renderUserManualPage();
        break;
      default:
        mainContentHtml = renderNotFoundPage();
        break;
    }

    const bottomNavHtml = renderBottomNavBar(isGameplay);

    appRoot.innerHTML = `
      ${topBarHtml}
      <div id="view-content-area">${mainContentHtml}</div>
      ${bottomNavHtml}
    `;

    this.bindDOMEvents();
  }

  /**
   * Bind event handlers to freshly rendered DOM
   */
  bindDOMEvents() {
    // 1. Navigation Top Bar Links
    document.getElementById('brand-logo-btn')?.addEventListener('click', () => this.navigate('hero'));
    document.getElementById('nav-main-btn')?.addEventListener('click', () => this.navigate('dashboard'));
    document.getElementById('nav-logs-btn')?.addEventListener('click', () => this.navigate('leaderboard'));
    document.getElementById('nav-map-btn')?.addEventListener('click', () => this.navigate('world-map'));
    document.getElementById('nav-levels-btn')?.addEventListener('click', () => this.navigate('levels'));
    document.getElementById('top-settings-btn')?.addEventListener('click', () => this.navigate('settings'));
    document.getElementById('top-profile-btn')?.addEventListener('click', () => this.navigate('profile'));

    // 2. Mobile Bottom Nav Links
    document.getElementById('mob-nav-dash')?.addEventListener('click', () => this.navigate('dashboard'));
    document.getElementById('mob-nav-map')?.addEventListener('click', () => this.navigate('world-map'));
    document.getElementById('mob-nav-play')?.addEventListener('click', () => this.navigate('gameplay', { levelId: this.currentLevelId }));
    document.getElementById('mob-nav-profile')?.addEventListener('click', () => this.navigate('profile'));

    // 3. Auth Form Submissions
    const loginForm = document.getElementById('auth-login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const usernameOrEmail = document.getElementById('login-username')?.value;
        const password = document.getElementById('login-password')?.value;
        const res = await AuthManager.login(usernameOrEmail, password);
        if (res.success) {
          this.authErrorMessage = '';
          this.authSuccessMessage = '';
          this.navigate(res.nextRoute || 'dashboard');
        } else {
          this.authErrorMessage = res.error || 'Authentication rejected.';
          this.render();
        }
      });
    }

    const registerForm = document.getElementById('auth-register-form');
    if (registerForm) {
      registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('register-username')?.value;
        const email = document.getElementById('register-email')?.value;
        const password = document.getElementById('register-password')?.value;
        const confirm = document.getElementById('register-confirm-password')?.value;

        if (password !== confirm) {
          this.authErrorMessage = 'Passwords do not match.';
          this.render();
          return;
        }

        const res = await AuthManager.register(username, email, password);
        if (res.success) {
          this.authErrorMessage = '';
          this.authSuccessMessage = 'Registration complete! Welcome to Sector 01.';
          this.navigate('dashboard');
        } else {
          this.authErrorMessage = res.error || 'Registration failed.';
          this.render();
        }
      });
    }

    document.getElementById('profile-logout-btn')?.addEventListener('click', async () => {
      await AuthManager.logout();
      this.navigate('login');
    });

    // 4. Hero Actions
    document.getElementById('hero-play-btn')?.addEventListener('click', () => this.navigate('gameplay', { levelId: '01' }));
    document.getElementById('hero-explore-btn')?.addEventListener('click', () => this.navigate('levels'));

    // 5. Dashboard Actions
    document.getElementById('dash-continue-btn')?.addEventListener('click', (e) => {
      const lvl = e.currentTarget.getAttribute('data-continue-level') || '01';
      this.navigate('gameplay', { levelId: lvl });
    });
    document.getElementById('dash-daily-card')?.addEventListener('click', () => this.navigate('daily'));
    document.getElementById('dash-levels-card')?.addEventListener('click', () => this.navigate('levels'));

    // 6. Level Selection Clicks
    document.querySelectorAll('[data-level-id]').forEach((el) => {
      el.addEventListener('click', () => {
        const isUnlocked = el.getAttribute('data-unlocked') === 'true';
        const lvlId = el.getAttribute('data-level-id');
        if (isUnlocked) {
          this.navigate('gameplay', { levelId: lvlId });
        } else {
          soundService.playError();
        }
      });
    });

    // World Filter Pills
    document.querySelectorAll('[data-world-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const world = btn.getAttribute('data-world-tab');
        levelStore.setWorldFilter(world);
        this.render();
      });
    });

    // Levels Search
    const searchInput = document.getElementById('levels-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        levelStore.setSearchQuery(e.target.value);
        this.render();
        const reInput = document.getElementById('levels-search-input');
        if (reInput) {
          reInput.focus();
          reInput.setSelectionRange(reInput.value.length, reInput.value.length);
        }
      });
    }

    // 7. World Map Nodes
    document.querySelectorAll('[data-world-node]').forEach((node) => {
      node.addEventListener('click', () => {
        const worldNum = node.getAttribute('data-world-node');
        levelStore.setWorldFilter(worldNum);
        this.navigate('levels');
      });
    });

    // 8. Gameplay View Events
    if (this.currentRoute === 'gameplay') {
      if (this.terminalController) {
        this.terminalController.mount();
      }
      GameControls.bindEvents(this.adapter);

      document.getElementById('btn-reset-level')?.addEventListener('click', () => {
        if (this.adapter) this.adapter.reset();
      });
      document.getElementById('btn-undo-move')?.addEventListener('click', () => {
        if (this.adapter) this.adapter.undo();
      });
    }

    // 9. Daily Challenge Launch
    document.getElementById('start-daily-btn')?.addEventListener('click', () => {
      this.navigate('gameplay', { levelId: '01' });
    });

    // 10. Settings Events
    document.getElementById('toggle-sound')?.addEventListener('change', (e) => {
      const enabled = e.target.checked;
      soundService.setMuted(!enabled);
      playerStore.updateSettings({ soundEffects: enabled });
      soundService.playKey();
    });

    document.getElementById('slider-volume')?.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      const display = document.getElementById('volume-val-display');
      if (display) display.textContent = `${val}%`;
      soundService.setVolume(val / 100);
      playerStore.updateSettings({ volume: val });
    });
  }
}

// Bootstrap GitQuest Application on DOM Load
window.addEventListener('DOMContentLoaded', () => {
  const app = new GitQuestApp();
  app.init();
});

export default GitQuestApp;
