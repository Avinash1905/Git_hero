// GitQuest SPA Main Application Controller

import { soundFX } from './audio.js';
import { StorageService } from './services/StorageService.js';
import { LEVELS } from './engine/Levels.js';
import { GameState } from './engine/GameState.js';
import { GridEngine } from './engine/GridEngine.js';
import { GitCLI } from './terminal/GitCLI.js';

// Components
import { renderTopAppBar } from './components/TopAppBar.js';
import { renderBottomNavBar } from './components/BottomNavBar.js';
import { renderLevelCompleteModal, initParticleSystem } from './components/LevelCompleteModal.js';

// Views
import { renderHeroView } from './views/HeroView.js';
import { renderDashboardView } from './views/DashboardView.js';
import { renderWorldMapView } from './views/WorldMapView.js';
import { renderLevelSelectionView } from './views/LevelSelectionView.js';
import { renderGameplayView, generateGridTilesHtml } from './views/GameplayView.js';
import { renderProfileView } from './views/ProfileView.js';
import { renderLeaderboardView } from './views/LeaderboardView.js';
import { renderAchievementsView } from './views/AchievementsView.js';
import { renderDailyChallengeView } from './views/DailyChallengeView.js';
import { renderSettingsView } from './views/SettingsView.js';
import { renderLevelEditorView, LevelEditorController } from './views/LevelEditorView.js';
import { renderLoginView } from './views/LoginView.js';
import { renderRegisterView } from './views/RegisterView.js';

class GitQuestApp {
  constructor() {
    this.currentRoute = 'hero';
    this.currentLevelId = '07';
    this.gameState = null;
    this.gridEngine = null;
    this.gitCli = null;
    this.editor = new LevelEditorController();
    this.leaderboardTab = 'global';
    this.settingsCategory = 'general';
    this.particleInterval = null;

    // Load initial settings
    const saved = StorageService.load();
    soundFX.setMuted(!saved.settings.soundEffects);
    soundFX.setVolume(saved.settings.volume / 100);
  }

  init() {
    // Handle URL hash changes
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '').replace(/^\//, '');
      this.navigate(hash);
    });

    // Global keyboard controls
    window.addEventListener('keydown', (e) => this.handleGlobalKeyDown(e));

    // Initial route (routes to login if unauthenticated, or dashboard if authenticated)
    const initialHash = window.location.hash.replace('#', '').replace(/^\//, '');
    this.navigate(initialHash);
  }

  navigate(route, params = {}) {
    if (this.particleInterval) {
      clearInterval(this.particleInterval);
      this.particleInterval = null;
    }

    if (this.gameState && route !== 'gameplay') {
      this.gameState.stopTimer();
    }

    // Clean and normalize target route
    let targetRoute = (route || '').replace(/^#\/?/, '').replace(/^\//, '').trim();

    const isAuthed = StorageService.isAuthenticated();

    // Authentication Route Guards:
    // 1. Unauthenticated users cannot access protected game pages (only login & register are public)
    if (!isAuthed) {
      if (targetRoute !== 'login' && targetRoute !== 'register') {
        targetRoute = 'login';
      }
    } else {
      // 2. Authenticated users should not see login or register pages; redirect to ~/quest/main ('dashboard')
      if (targetRoute === 'login' || targetRoute === 'register' || targetRoute === '' || targetRoute === 'main') {
        targetRoute = 'dashboard';
      }
    }

    this.currentRoute = targetRoute;
    if (window.location.hash !== `#${targetRoute}`) {
      window.location.hash = targetRoute;
    }

    if (targetRoute === 'gameplay') {
      const targetLvl = params.levelId || this.currentLevelId || '07';
      this.initGameplay(targetLvl, params.customLevel);
    } else {
      this.render();
    }
  }

  initGameplay(levelId, customLevel = null) {
    this.currentLevelId = levelId;
    this.gameState = new GameState(levelId);
    
    if (customLevel) {
      this.gameState.levelDef = customLevel;
      this.gameState.player = { ...customLevel.player, dir: 'up' };
      this.gameState.box = { ...customLevel.box };
      this.gameState.goal = { ...customLevel.goal };
      this.gameState.walls = [...customLevel.walls];
      this.gameState.hazards = [...(customLevel.hazards || [])];
      this.gameState.gridSize = customLevel.gridSize || 10;
    }

    this.gridEngine = new GridEngine(this.gameState, () => {
      this.updateGameplayGrid();
    });

    this.gitCli = new GitCLI(this.gameState, this.gridEngine, {
      onCommitSuccess: (state) => this.handleLevelComplete(state),
      onSwitchLevel: (lvlId) => this.navigate('gameplay', { levelId: lvlId }),
      onLogUpdate: () => this.updateTerminalOutput()
    });

    this.gameState.startTimer((formatted) => {
      const timerEl = document.getElementById('game-live-timer');
      if (timerEl) timerEl.textContent = formatted;
    });

    this.render();
  }

  handleLevelComplete(state) {
    this.gameState.stopTimer();
    const stats = {
      time: state.getFormattedTime(),
      commands: state.commandsCount,
      pushCount: state.pushCount,
      pullCount: state.pullCount,
      statusCount: state.statusCount,
      moves: state.moves,
      score: state.calculateScore(),
      stars: state.moves <= (state.levelDef.commitsReq * 4) ? 3 : (state.moves <= (state.levelDef.commitsReq * 8) ? 2 : 1),
      xpAwarded: state.levelDef.xpReward || 500
    };

    // Save to storage
    StorageService.completeLevel(state.levelId, stats);

    // Show victory modal
    const appContainer = document.getElementById('app-root');
    const modalHtml = renderLevelCompleteModal(stats);
    
    const existingModal = document.getElementById('level-complete-overlay');
    if (existingModal) existingModal.remove();

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = modalHtml;
    appContainer.appendChild(tempDiv.firstElementChild);

    this.particleInterval = initParticleSystem();

    // Bind modal buttons
    document.getElementById('modal-next-btn')?.addEventListener('click', () => {
      const nextId = String(parseInt(state.levelId, 10) + 1).padStart(2, '0');
      if (LEVELS[nextId]) {
        this.navigate('gameplay', { levelId: nextId });
      } else {
        this.navigate('world-map');
      }
    });

    document.getElementById('modal-replay-btn')?.addEventListener('click', () => {
      this.navigate('gameplay', { levelId: state.levelId });
    });

    document.getElementById('modal-map-btn')?.addEventListener('click', () => {
      this.navigate('world-map');
    });
  }

  handleGlobalKeyDown(e) {
    // If active input has focus in terminal or inputs, don't hijack WASD unless it's gameplay
    const isInputFocused = document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA' || document.activeElement.tagName === 'SELECT');

    if (this.currentRoute === 'gameplay' && this.gridEngine) {
      if (isInputFocused && document.activeElement.id === 'terminal-cmd-input') {
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          document.activeElement.value = this.gitCli.getPreviousHistory();
          return;
        }
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          document.activeElement.value = this.gitCli.getNextHistory();
          return;
        }
        return;
      }

      // Movement keys
      let handled = false;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        this.gridEngine.movePlayer(0, -1);
        handled = true;
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        this.gridEngine.movePlayer(0, 1);
        handled = true;
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        this.gridEngine.movePlayer(-1, 0);
        handled = true;
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        this.gridEngine.movePlayer(1, 0);
        handled = true;
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        this.gridEngine.undo();
        handled = true;
      }

      if (handled) {
        e.preventDefault();
      }
    }
  }

  updateGameplayGrid() {
    if (this.currentRoute !== 'gameplay' || !this.gameState) return;
    const gridEl = document.getElementById('game-puzzle-grid');
    if (gridEl) {
      gridEl.innerHTML = generateGridTilesHtml(this.gameState);
    } else {
      const viewContainer = document.getElementById('view-content-area');
      if (viewContainer) {
        viewContainer.innerHTML = renderGameplayView(this.gameState, this.gitCli);
        this.bindGameplayEvents();
      }
    }
  }

  updateTerminalOutput() {
    const terminalBody = document.getElementById('terminal-output-body');
    if (!terminalBody || !this.gitCli) return;

    terminalBody.innerHTML = this.gitCli.logs.map(log => {
      if (log.type === 'cmd') {
        return `<div class="flex items-center gap-2"><span class="text-primary font-bold">$</span><span class="text-on-surface">${log.text}</span></div>`;
      }
      if (log.type === 'status') {
        return `
          <div class="text-on-surface-variant pl-4 border-l-2 border-surface-variant my-1 space-y-0.5">
            <div class="text-xs">On ${log.branch}</div>
            <div class="text-on-surface text-sm">Objective: ${log.objective}</div>
            <div class="${log.boxStatus.includes('READY') ? 'text-primary font-bold' : 'text-tertiary'} text-xs">Box: ${log.boxStatus}</div>
            <div class="text-secondary text-xs">Progress: ${log.progress}</div>
          </div>
        `;
      }
      if (log.type === 'push' || log.type === 'pull') {
        return `
          <div class="text-on-surface-variant pl-4 my-1 space-y-0.5">
            <div class="text-on-surface-variant text-xs">${log.detail}</div>
            <div class="text-primary text-sm">${log.result}</div>
          </div>
        `;
      }
      if (log.type === 'commit_success') {
        return `
          <div class="text-primary pl-4 border-l-2 border-primary my-1 space-y-0.5">
            <div class="font-bold">[${log.branch} ${log.commitHash}] ${log.message}</div>
            <div class="text-xs text-on-surface-variant">${log.filesChanged}</div>
          </div>
        `;
      }
      if (log.type === 'error') {
        return `<div class="text-error pl-4 text-xs font-terminal-code my-1">${log.text.replace(/\n/g, '<br/>')}</div>`;
      }
      return `<div class="text-on-surface-variant text-xs pl-4 font-terminal-code my-1">${(log.text || '').replace(/\n/g, '<br/>')}</div>`;
    }).join('');

    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  render() {
    const appRoot = document.getElementById('app-root');
    if (!appRoot) return;

    // 1. Render Top App Bar (ONLY when authenticated and NOT on login/register screens)
    const isAuthRoute = this.currentRoute === 'login' || this.currentRoute === 'register';
    const topBarHtml = !isAuthRoute ? renderTopAppBar(this.currentRoute) : '';

    // 2. Render Main View Content
    let mainViewHtml = '';
    const isGameplay = this.currentRoute === 'gameplay' || isAuthRoute;

    switch (this.currentRoute) {
      case 'hero':
        mainViewHtml = renderHeroView();
        break;
      case 'login':
        mainViewHtml = renderLoginView();
        break;
      case 'register':
        mainViewHtml = renderRegisterView();
        break;
      case 'dashboard':
      case 'main':
        mainViewHtml = renderDashboardView();
        break;
      case 'world-map':
        mainViewHtml = renderWorldMapView();
        break;
      case 'levels':
        mainViewHtml = renderLevelSelectionView();
        break;
      case 'gameplay':
        mainViewHtml = renderGameplayView(this.gameState, this.gitCli);
        break;
      case 'profile':
        mainViewHtml = renderProfileView();
        break;
      case 'leaderboard':
        mainViewHtml = renderLeaderboardView(this.leaderboardTab);
        break;
      case 'achievements':
        mainViewHtml = renderAchievementsView();
        break;
      case 'daily':
        mainViewHtml = renderDailyChallengeView();
        break;
      case 'settings':
        mainViewHtml = renderSettingsView(this.settingsCategory);
        break;
      case 'editor':
        mainViewHtml = renderLevelEditorView(this.editor);
        break;
      default:
        mainViewHtml = renderHeroView();
        break;
    }

    // 3. Render Bottom Navigation Bar
    const bottomNavHtml = renderBottomNavBar(isGameplay);

    // Assemble Full Shell
    appRoot.innerHTML = `
      ${topBarHtml}
      <div id="view-content-area">${mainViewHtml}</div>
      ${bottomNavHtml}
    `;

    // 4. Attach Event Listeners
    this.bindGlobalEvents();
  }

  bindGlobalEvents() {
    // Top Bar Links
    document.getElementById('brand-logo-btn')?.addEventListener('click', () => {
      if (StorageService.isAuthenticated()) {
        this.navigate('dashboard');
      } else {
        this.navigate('login');
      }
    });
    document.getElementById('nav-main-btn')?.addEventListener('click', () => this.navigate('dashboard'));
    document.getElementById('nav-logs-btn')?.addEventListener('click', () => this.navigate('leaderboard'));
    document.getElementById('nav-map-btn')?.addEventListener('click', () => this.navigate('world-map'));
    document.getElementById('nav-levels-btn')?.addEventListener('click', () => this.navigate('levels'));
    document.getElementById('nav-editor-btn')?.addEventListener('click', () => this.navigate('editor'));

    document.getElementById('top-settings-btn')?.addEventListener('click', () => this.navigate('settings'));
    document.getElementById('top-profile-btn')?.addEventListener('click', () => this.navigate('profile'));
    document.getElementById('top-pause-btn')?.addEventListener('click', () => soundFX.playKey());
    document.getElementById('top-menu-btn')?.addEventListener('click', () => this.navigate('dashboard'));

    // Mobile Bottom Nav Links
    document.getElementById('mob-nav-dash')?.addEventListener('click', () => this.navigate('dashboard'));
    document.getElementById('mob-nav-map')?.addEventListener('click', () => this.navigate('world-map'));
    document.getElementById('mob-nav-play')?.addEventListener('click', () => this.navigate('gameplay', { levelId: this.currentLevelId }));
    document.getElementById('mob-nav-profile')?.addEventListener('click', () => this.navigate('profile'));

    // View specific events
    if (this.currentRoute === 'hero') {
      document.getElementById('hero-play-btn')?.addEventListener('click', () => this.navigate('gameplay', { levelId: '07' }));
      document.getElementById('hero-explore-btn')?.addEventListener('click', () => this.navigate('levels'));
    } else if (this.currentRoute === 'dashboard' || this.currentRoute === 'main') {
      document.getElementById('dash-continue-card')?.addEventListener('click', () => this.navigate('gameplay', { levelId: '07' }));
      document.getElementById('dash-play-btn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.navigate('gameplay', { levelId: '07' });
      });
      document.getElementById('dash-world-progress')?.addEventListener('click', () => this.navigate('world-map'));
      document.getElementById('dash-daily-card')?.addEventListener('click', () => this.navigate('daily'));
    } else if (this.currentRoute === 'world-map') {
      document.getElementById('node-world-1')?.addEventListener('click', () => this.navigate('levels'));
      document.getElementById('node-world-2')?.addEventListener('click', () => this.navigate('levels'));
      document.getElementById('node-world-3')?.addEventListener('click', () => this.navigate('gameplay', { levelId: '07' }));
    } else if (this.currentRoute === 'levels') {
      document.querySelectorAll('[data-level-id]').forEach(el => {
        el.addEventListener('click', () => {
          const isUnlocked = el.getAttribute('data-unlocked') === 'true';
          const lvlId = el.getAttribute('data-level-id');
          if (isUnlocked) {
            this.navigate('gameplay', { levelId: lvlId });
          } else {
            soundFX.playError();
          }
        });
      });
    } else if (this.currentRoute === 'gameplay') {
      this.bindGameplayEvents();
    } else if (this.currentRoute === 'leaderboard') {
      document.getElementById('tab-global-btn')?.addEventListener('click', () => {
        this.leaderboardTab = 'global';
        this.render();
      });
      document.getElementById('tab-friends-btn')?.addEventListener('click', () => {
        this.leaderboardTab = 'friends';
        this.render();
      });
      document.getElementById('tab-weekly-btn')?.addEventListener('click', () => {
        this.leaderboardTab = 'weekly';
        this.render();
      });
    } else if (this.currentRoute === 'daily') {
      document.getElementById('start-daily-btn')?.addEventListener('click', () => {
        this.navigate('gameplay', { levelId: '07' });
      });
    } else if (this.currentRoute === 'settings') {
      this.bindSettingsEvents();
    } else if (this.currentRoute === 'editor') {
      this.bindEditorEvents();
    } else if (this.currentRoute === 'login') {
      this.bindLoginEvents();
    } else if (this.currentRoute === 'register') {
      this.bindRegisterEvents();
    }
  }

  bindLoginEvents() {
    const form = document.getElementById('login-form');
    const nameInput = document.getElementById('login-name');
    const passwordInput = document.getElementById('login-password');

    const nameError = document.getElementById('login-name-error');
    const passwordError = document.getElementById('login-password-error');
    const statusBanner = document.getElementById('login-status-banner');
    const statusIcon = document.getElementById('login-status-icon');
    const statusText = document.getElementById('login-status-text');

    // Toggle password visibility
    const togglePwdBtn = document.getElementById('login-toggle-pwd-btn');
    if (togglePwdBtn && passwordInput) {
      togglePwdBtn.addEventListener('click', () => {
        const isPwd = passwordInput.type === 'password';
        passwordInput.type = isPwd ? 'text' : 'password';
        const icon = togglePwdBtn.querySelector('span');
        if (icon) icon.textContent = isPwd ? 'visibility_off' : 'visibility';
      });
    }

    // Switch to register page
    document.getElementById('login-to-reg-link')?.addEventListener('click', () => {
      this.navigate('register');
    });

    // Forgot Password clickable link
    const forgotModal = document.getElementById('login-forgot-modal');
    document.getElementById('login-forgot-pwd-btn')?.addEventListener('click', () => {
      soundFX.playKey();
      if (forgotModal) {
        forgotModal.classList.remove('hidden');
      }
    });

    document.getElementById('login-close-modal-btn')?.addEventListener('click', () => {
      if (forgotModal) {
        forgotModal.classList.add('hidden');
      }
    });

    // Real-time input error clearing
    const clearError = (inputEl, errorEl) => {
      if (errorEl) errorEl.classList.add('hidden');
      if (inputEl) {
        inputEl.classList.remove('border-error');
        inputEl.classList.add('border-outline-variant/50');
      }
      if (statusBanner && statusBanner.classList.contains('border-error/50')) {
        statusBanner.classList.add('hidden');
      }
    };

    nameInput?.addEventListener('input', () => clearError(nameInput, nameError));
    passwordInput?.addEventListener('input', () => clearError(passwordInput, passwordError));

    // Form submit validation
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        let isValid = true;
        const nameVal = nameInput ? nameInput.value.trim() : '';
        const pwdVal = passwordInput ? passwordInput.value : '';

        // Validate Name
        if (!nameVal) {
          isValid = false;
          if (nameError) {
            nameError.querySelector('.error-msg').textContent = 'Operator name is required.';
            nameError.classList.remove('hidden');
          }
          nameInput?.classList.add('border-error');
          nameInput?.classList.remove('border-outline-variant/50');
        } else {
          clearError(nameInput, nameError);
        }

        // Validate Password
        if (!pwdVal) {
          isValid = false;
          if (passwordError) {
            passwordError.querySelector('.error-msg').textContent = 'Password is required.';
            passwordError.classList.remove('hidden');
          }
          passwordInput?.classList.add('border-error');
          passwordInput?.classList.remove('border-outline-variant/50');
        } else {
          clearError(passwordInput, passwordError);
        }

        if (!isValid) {
          soundFX.playError();
          if (statusBanner && statusText && statusIcon) {
            statusBanner.className = 'mb-5 p-3 rounded-lg border border-error/50 bg-error-container/30 text-error text-xs font-terminal-code flex items-start gap-2';
            statusIcon.textContent = 'error';
            statusText.textContent = 'Validation error: Please fill in all required fields.';
            statusBanner.classList.remove('hidden');
          }
          return;
        }

        // 1. Get the registered user credentials from frontend storage
        const registeredUser = StorageService.getRegisteredUser();

        // 2. Check if a registered user exists
        if (!registeredUser || !registeredUser.name || !registeredUser.password) {
          soundFX.playError();
          if (statusBanner && statusText && statusIcon) {
            statusBanner.className = 'mb-5 p-3 rounded-lg border border-error/50 bg-error-container/30 text-error text-xs font-terminal-code flex items-start gap-2';
            statusIcon.textContent = 'error';
            statusText.textContent = 'No registered account found. Please register first.';
            statusBanner.classList.remove('hidden');
          }
          return;
        }

        // 3. Exact credential comparison against registered credentials
        const isNameMatch = (nameVal === registeredUser.name);
        const isPasswordMatch = (pwdVal === registeredUser.password);

        if (!isNameMatch || !isPasswordMatch) {
          soundFX.playError();
          if (statusBanner && statusText && statusIcon) {
            statusBanner.className = 'mb-5 p-3 rounded-lg border border-error/50 bg-error-container/30 text-error text-xs font-terminal-code flex items-start gap-2';
            statusIcon.textContent = 'error';
            statusText.textContent = 'Incorrect name or password';
            statusBanner.classList.remove('hidden');
          }
          nameInput?.classList.add('border-error');
          nameInput?.classList.remove('border-outline-variant/50');
          passwordInput?.classList.add('border-error');
          passwordInput?.classList.remove('border-outline-variant/50');
          return;
        }

        // 4. Valid Credentials: Login Successful & Set Authenticated State
        StorageService.setAuthenticated(true);
        soundFX.playSuccess();
        const submitBtn = document.getElementById('login-submit-btn');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
        }

        if (statusBanner && statusText && statusIcon) {
          statusBanner.className = 'mb-5 p-3 rounded-lg border border-primary/50 bg-primary/10 text-primary text-xs font-terminal-code flex items-start gap-2 shadow-[0_0_15px_rgba(78,222,163,0.2)]';
          statusIcon.textContent = 'verified_user';
          statusText.innerHTML = `<strong>Login Successful!</strong> Access granted for operator <code>${nameVal}</code>. Initializing game session...`;
          statusBanner.classList.remove('hidden');
        }

        // Update active player profile name in user state
        try {
          const userState = StorageService.load();
          userState.player.username = registeredUser.name;
          StorageService.save(userState);
        } catch (err) {
          console.warn('Could not update active player username', err);
        }

        setTimeout(() => {
          this.navigate('dashboard');
        }, 1000);
      });
    }
  }

  bindRegisterEvents() {
    const form = document.getElementById('register-form');
    const nameInput = document.getElementById('reg-name');
    const emailInput = document.getElementById('reg-email');
    const passwordInput = document.getElementById('reg-password');
    const confirmInput = document.getElementById('reg-confirm-password');

    const nameError = document.getElementById('reg-name-error');
    const emailError = document.getElementById('reg-email-error');
    const passwordError = document.getElementById('reg-password-error');
    const confirmError = document.getElementById('reg-confirm-error');
    const statusBanner = document.getElementById('reg-status-banner');
    const statusIcon = document.getElementById('reg-status-icon');
    const statusText = document.getElementById('reg-status-text');

    // Toggle password visibility
    const togglePwdBtn = document.getElementById('reg-toggle-pwd-btn');
    if (togglePwdBtn && passwordInput) {
      togglePwdBtn.addEventListener('click', () => {
        const isPwd = passwordInput.type === 'password';
        passwordInput.type = isPwd ? 'text' : 'password';
        const icon = togglePwdBtn.querySelector('span');
        if (icon) icon.textContent = isPwd ? 'visibility_off' : 'visibility';
      });
    }

    const toggleConfirmBtn = document.getElementById('reg-toggle-confirm-pwd-btn');
    if (toggleConfirmBtn && confirmInput) {
      toggleConfirmBtn.addEventListener('click', () => {
        const isPwd = confirmInput.type === 'password';
        confirmInput.type = isPwd ? 'text' : 'password';
        const icon = toggleConfirmBtn.querySelector('span');
        if (icon) icon.textContent = isPwd ? 'visibility_off' : 'visibility';
      });
    }

    // Switch to login page
    document.getElementById('reg-to-login-link')?.addEventListener('click', () => {
      this.navigate('login');
    });

    // Real-time input error clearing
    const clearError = (inputEl, errorEl) => {
      if (errorEl) errorEl.classList.add('hidden');
      if (inputEl) {
        inputEl.classList.remove('border-error');
        inputEl.classList.add('border-outline-variant/50');
      }
      if (statusBanner && statusBanner.classList.contains('border-error/50')) {
        statusBanner.classList.add('hidden');
      }
    };

    nameInput?.addEventListener('input', () => clearError(nameInput, nameError));
    emailInput?.addEventListener('input', () => clearError(emailInput, emailError));
    passwordInput?.addEventListener('input', () => clearError(passwordInput, passwordError));
    confirmInput?.addEventListener('input', () => clearError(confirmInput, confirmError));

    // Form submit validation
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        let isValid = true;
        const nameVal = nameInput ? nameInput.value.trim() : '';
        const emailVal = emailInput ? emailInput.value.trim() : '';
        const pwdVal = passwordInput ? passwordInput.value : '';
        const confirmVal = confirmInput ? confirmInput.value : '';

        // Validate Name
        if (!nameVal) {
          isValid = false;
          if (nameError) {
            nameError.querySelector('.error-msg').textContent = 'Operator name is required.';
            nameError.classList.remove('hidden');
          }
          nameInput?.classList.add('border-error');
          nameInput?.classList.remove('border-outline-variant/50');
        } else {
          clearError(nameInput, nameError);
        }

        // Validate Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailVal) {
          isValid = false;
          if (emailError) {
            emailError.querySelector('.error-msg').textContent = 'Email address is required.';
            emailError.classList.remove('hidden');
          }
          emailInput?.classList.add('border-error');
          emailInput?.classList.remove('border-outline-variant/50');
        } else if (!emailRegex.test(emailVal)) {
          isValid = false;
          if (emailError) {
            emailError.querySelector('.error-msg').textContent = 'Please enter a valid email address (e.g. name@domain.com).';
            emailError.classList.remove('hidden');
          }
          emailInput?.classList.add('border-error');
          emailInput?.classList.remove('border-outline-variant/50');
        } else {
          clearError(emailInput, emailError);
        }

        // Validate Password
        if (!pwdVal) {
          isValid = false;
          if (passwordError) {
            passwordError.querySelector('.error-msg').textContent = 'Password is required.';
            passwordError.classList.remove('hidden');
          }
          passwordInput?.classList.add('border-error');
          passwordInput?.classList.remove('border-outline-variant/50');
        } else {
          clearError(passwordInput, passwordError);
        }

        // Validate Confirm Password
        if (!confirmVal) {
          isValid = false;
          if (confirmError) {
            confirmError.querySelector('.error-msg').textContent = 'Confirm password is required.';
            confirmError.classList.remove('hidden');
          }
          confirmInput?.classList.add('border-error');
          confirmInput?.classList.remove('border-outline-variant/50');
        } else if (pwdVal !== confirmVal) {
          isValid = false;
          if (confirmError) {
            confirmError.querySelector('.error-msg').textContent = 'Passwords do not match.';
            confirmError.classList.remove('hidden');
          }
          confirmInput?.classList.add('border-error');
          confirmInput?.classList.remove('border-outline-variant/50');
        } else {
          clearError(confirmInput, confirmError);
        }

        if (!isValid) {
          soundFX.playError();
          if (statusBanner && statusText && statusIcon) {
            statusBanner.className = 'mb-5 p-3 rounded-lg border border-error/50 bg-error-container/30 text-error text-xs font-terminal-code flex items-start gap-2';
            statusIcon.textContent = 'error';
            statusText.textContent = 'Validation error: Please resolve the highlighted fields above.';
            statusBanner.classList.remove('hidden');
          }
          return;
        }

        // Valid Registration Submission
        soundFX.playSuccess();
        const submitBtn = document.getElementById('reg-submit-btn');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
        }

        // Save registered user credentials to frontend storage
        const userData = {
          name: nameVal,
          email: emailVal,
          password: pwdVal,
          registeredAt: new Date().toISOString()
        };
        StorageService.setRegisteredUser(userData);
        StorageService.setAuthenticated(false); // Registration != Login: user is NOT authenticated

        if (statusBanner && statusText && statusIcon) {
          statusBanner.className = 'mb-5 p-3 rounded-lg border border-primary/50 bg-primary/10 text-primary text-xs font-terminal-code flex items-start gap-2 shadow-[0_0_15px_rgba(78,222,163,0.2)]';
          statusIcon.textContent = 'check_circle';
          statusText.innerHTML = `<strong>Account initialized!</strong> Registration successful. Redirecting to login...`;
          statusBanner.classList.remove('hidden');
        }

        setTimeout(() => {
          this.navigate('login');
        }, 1500);
      });
    }
  }

  bindGameplayEvents() {
    // Terminal input form
    const form = document.getElementById('terminal-input-form');
    const input = document.getElementById('terminal-cmd-input');
    
    if (form && input) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const cmd = input.value;
        input.value = '';
        if (this.gitCli) {
          this.gitCli.execute(cmd);
        }
      });
    }

    // Reset & Undo buttons
    document.getElementById('btn-reset-level')?.addEventListener('click', () => {
      if (this.gridEngine) this.gridEngine.reset();
    });
    document.getElementById('btn-undo-move')?.addEventListener('click', () => {
      if (this.gridEngine) this.gridEngine.undo();
    });

    // 4-Way Movement D-Pad Controls (Up, Down, Left, Right)
    document.getElementById('btn-dpad-up')?.addEventListener('click', () => {
      if (this.gridEngine) this.gridEngine.moveDirection('up');
    });
    document.getElementById('btn-dpad-down')?.addEventListener('click', () => {
      if (this.gridEngine) this.gridEngine.moveDirection('down');
    });
    document.getElementById('btn-dpad-left')?.addEventListener('click', () => {
      if (this.gridEngine) this.gridEngine.moveDirection('left');
    });
    document.getElementById('btn-dpad-right')?.addEventListener('click', () => {
      if (this.gridEngine) this.gridEngine.moveDirection('right');
    });

    // Auto-focus terminal on desktop
    if (window.innerWidth > 768 && input) {
      input.focus();
    }
  }

  bindSettingsEvents() {
    const soundToggle = document.getElementById('toggle-sound');
    const volSlider = document.getElementById('slider-volume');
    const volDisplay = document.getElementById('volume-val-display');
    const langSelect = document.getElementById('setting-language');
    const themeSelect = document.getElementById('setting-theme');

    soundToggle?.addEventListener('change', (e) => {
      const enabled = e.target.checked;
      soundFX.setMuted(!enabled);
      StorageService.updateSettings({ soundEffects: enabled });
      soundFX.playKey();
    });

    volSlider?.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      if (volDisplay) volDisplay.textContent = `${val}%`;
      soundFX.setVolume(val / 100);
      StorageService.updateSettings({ volume: val });
    });

    langSelect?.addEventListener('change', (e) => {
      StorageService.updateSettings({ language: e.target.value });
      soundFX.playKey();
    });

    themeSelect?.addEventListener('change', (e) => {
      StorageService.updateSettings({ theme: e.target.value });
      soundFX.playKey();
    });
  }

  bindEditorEvents() {
    // Tool buttons
    document.querySelectorAll('.editor-tool-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tool = btn.getAttribute('data-tool-id');
        this.editor.setTool(tool);
        this.render();
      });
    });

    // Grid cells
    document.querySelectorAll('.editor-cell').forEach(cell => {
      cell.addEventListener('click', () => {
        const x = parseInt(cell.getAttribute('data-cell-x'), 10);
        const y = parseInt(cell.getAttribute('data-cell-y'), 10);
        this.editor.handleCellClick(x, y);
        this.render();
      });
    });

    // Clear
    document.getElementById('editor-clear-btn')?.addEventListener('click', () => {
      this.editor.clear();
      this.render();
    });

    // Test Level
    const runTest = () => {
      const customLevel = this.editor.exportLevel();
      this.navigate('gameplay', { levelId: 'CUSTOM', customLevel });
    };

    document.getElementById('editor-test-btn')?.addEventListener('click', runTest);
    document.getElementById('editor-mob-test')?.addEventListener('click', runTest);
  }
}

// Bootstrap GitQuest application
window.addEventListener('DOMContentLoaded', () => {
  const app = new GitQuestApp();
  app.init();
});
