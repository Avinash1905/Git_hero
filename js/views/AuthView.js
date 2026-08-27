// AuthView: Real Authentication Screens (Login, Register, Forgot Password, Reset Password)
// 100% faithful to GitQuest dark cyberpunk / terminal design system

export function renderLoginView(errorMessage = '', successMessage = '') {
  return `
    <main class="min-h-screen pt-20 pb-20 px-4 flex items-center justify-center relative overflow-hidden bg-background">
      <div class="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none"></div>

      <div class="relative z-10 w-full max-w-md">
        <!-- Brand & Badge -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-variant/60 border border-primary/30 backdrop-blur-md mb-3">
            <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span class="text-terminal-label font-terminal-label text-primary uppercase tracking-widest text-xs">Auth Terminal :: Node 01</span>
          </div>
          <h1 class="text-headline-md font-headline-md text-on-surface font-bold">Player Login</h1>
          <p class="text-on-surface-variant text-sm font-terminal-code mt-1">Authenticate to access repository challenges</p>
        </div>

        <!-- Glassmorphism Card -->
        <div class="glass-panel rounded-2xl p-6 md:p-8 border border-outline-variant/40 shadow-2xl relative overflow-hidden">
          <div class="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none"></div>

          ${errorMessage ? `
            <div class="mb-4 p-3 bg-error/15 border border-error/40 rounded-lg text-error text-xs font-terminal-code flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px]">error</span>
              <span>${errorMessage}</span>
            </div>
          ` : ''}

          ${successMessage ? `
            <div class="mb-4 p-3 bg-primary/15 border border-primary/40 rounded-lg text-primary text-xs font-terminal-code flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px]">check_circle</span>
              <span>${successMessage}</span>
            </div>
          ` : ''}

          <form id="auth-login-form" class="space-y-4">
            <div>
              <label class="block text-terminal-label font-terminal-label text-on-surface-variant text-xs mb-1.5 uppercase tracking-wider" for="login-username">
                Username or Email
              </label>
              <div class="relative">
                <input 
                  id="login-username" 
                  name="usernameOrEmail" 
                  type="text" 
                  required
                  placeholder="e.g. dev_pilot or dev@repo.io" 
                  class="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg px-4 py-2.5 text-on-surface font-terminal-code text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all placeholder:text-on-surface-variant/40"
                />
              </div>
            </div>

            <div>
              <div class="flex justify-between items-center mb-1.5">
                <label class="text-terminal-label font-terminal-label text-on-surface-variant text-xs uppercase tracking-wider" for="login-password">
                  Password
                </label>
                <a href="#forgot-password" class="text-xs text-secondary hover:text-primary transition-colors font-terminal-code">Forgot password?</a>
              </div>
              <div class="relative">
                <input 
                  id="login-password" 
                  name="password" 
                  type="password" 
                  required
                  placeholder="••••••••" 
                  class="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg px-4 py-2.5 text-on-surface font-terminal-code text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all placeholder:text-on-surface-variant/40"
                />
              </div>
            </div>

            <button 
              type="submit" 
              id="login-submit-btn"
              class="w-full py-3 mt-2 bg-primary text-on-primary font-terminal-label text-terminal-label uppercase tracking-widest rounded-lg glow-primary hover:scale-[1.02] transition-transform duration-200 shadow-lg font-bold flex items-center justify-center gap-2"
            >
              <span>[AUTHENTICATE]</span>
              <span class="material-symbols-outlined text-sm">login</span>
            </button>
          </form>

          <div class="mt-6 pt-4 border-t border-outline-variant/30 text-center">
            <p class="text-xs text-on-surface-variant font-terminal-code">
              New to GitHero? 
              <a href="#register" class="text-primary hover:underline font-bold ml-1">Create an Account →</a>
            </p>
          </div>
        </div>
      </div>
    </main>
  `;
}

export function renderRegisterView(errorMessage = '') {
  return `
    <main class="min-h-screen pt-20 pb-20 px-4 flex items-center justify-center relative overflow-hidden bg-background">
      <div class="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none"></div>

      <div class="relative z-10 w-full max-w-md">
        <!-- Brand & Badge -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-variant/60 border border-secondary/30 backdrop-blur-md mb-3">
            <span class="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            <span class="text-terminal-label font-terminal-label text-secondary uppercase tracking-widest text-xs">New Contributor Registration</span>
          </div>
          <h1 class="text-headline-md font-headline-md text-on-surface font-bold">Register Account</h1>
          <p class="text-on-surface-variant text-sm font-terminal-code mt-1">Initialize your player profile & unlock Level 01</p>
        </div>

        <!-- Glassmorphism Card -->
        <div class="glass-panel rounded-2xl p-6 md:p-8 border border-outline-variant/40 shadow-2xl relative overflow-hidden">
          ${errorMessage ? `
            <div class="mb-4 p-3 bg-error/15 border border-error/40 rounded-lg text-error text-xs font-terminal-code flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px]">error</span>
              <span>${errorMessage}</span>
            </div>
          ` : ''}

          <form id="auth-register-form" class="space-y-4">
            <div>
              <label class="block text-terminal-label font-terminal-label text-on-surface-variant text-xs mb-1.5 uppercase tracking-wider" for="reg-username">
                Player Handle (Username)
              </label>
              <input 
                id="reg-username" 
                name="username" 
                type="text" 
                required
                minlength="3"
                placeholder="e.g. cyber_ninja" 
                class="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg px-4 py-2.5 text-on-surface font-terminal-code text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all placeholder:text-on-surface-variant/40"
              />
            </div>

            <div>
              <label class="block text-terminal-label font-terminal-label text-on-surface-variant text-xs mb-1.5 uppercase tracking-wider" for="reg-email">
                Email Address
              </label>
              <input 
                id="reg-email" 
                name="email" 
                type="email" 
                required
                placeholder="dev@githero.io" 
                class="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg px-4 py-2.5 text-on-surface font-terminal-code text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all placeholder:text-on-surface-variant/40"
              />
            </div>

            <div>
              <label class="block text-terminal-label font-terminal-label text-on-surface-variant text-xs mb-1.5 uppercase tracking-wider" for="reg-password">
                Password
              </label>
              <input 
                id="reg-password" 
                name="password" 
                type="password" 
                required
                minlength="6"
                placeholder="At least 6 characters" 
                class="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg px-4 py-2.5 text-on-surface font-terminal-code text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all placeholder:text-on-surface-variant/40"
              />
            </div>

            <button 
              type="submit" 
              id="register-submit-btn"
              class="w-full py-3 mt-2 bg-primary text-on-primary font-terminal-label text-terminal-label uppercase tracking-widest rounded-lg glow-primary hover:scale-[1.02] transition-transform duration-200 shadow-lg font-bold flex items-center justify-center gap-2"
            >
              <span>[INITIALIZE PROFILE]</span>
              <span class="material-symbols-outlined text-sm">person_add</span>
            </button>
          </form>

          <div class="mt-6 pt-4 border-t border-outline-variant/30 text-center">
            <p class="text-xs text-on-surface-variant font-terminal-code">
              Already have an account? 
              <a href="#login" class="text-primary hover:underline font-bold ml-1">Sign In →</a>
            </p>
          </div>
        </div>
      </div>
    </main>
  `;
}

export function renderForgotPasswordView(message = '', errorMessage = '') {
  return `
    <main class="min-h-screen pt-20 pb-20 px-4 flex items-center justify-center relative overflow-hidden bg-background">
      <div class="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none"></div>

      <div class="relative z-10 w-full max-w-md">
        <div class="text-center mb-8">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-variant/60 border border-tertiary/30 backdrop-blur-md mb-3">
            <span class="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
            <span class="text-terminal-label font-terminal-label text-tertiary uppercase tracking-widest text-xs">Credentials Recovery</span>
          </div>
          <h1 class="text-headline-md font-headline-md text-on-surface font-bold">Reset Password</h1>
          <p class="text-on-surface-variant text-sm font-terminal-code mt-1">Enter your account email to dispatch a recovery key</p>
        </div>

        <div class="glass-panel rounded-2xl p-6 md:p-8 border border-outline-variant/40 shadow-2xl relative overflow-hidden">
          ${errorMessage ? `
            <div class="mb-4 p-3 bg-error/15 border border-error/40 rounded-lg text-error text-xs font-terminal-code flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px]">error</span>
              <span>${errorMessage}</span>
            </div>
          ` : ''}

          ${message ? `
            <div class="mb-4 p-3 bg-primary/15 border border-primary/40 rounded-lg text-primary text-xs font-terminal-code flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px]">check_circle</span>
              <span>${message}</span>
            </div>
          ` : ''}

          <form id="auth-forgot-form" class="space-y-4">
            <div>
              <label class="block text-terminal-label font-terminal-label text-on-surface-variant text-xs mb-1.5 uppercase tracking-wider" for="forgot-email">
                Registered Email
              </label>
              <input 
                id="forgot-email" 
                name="email" 
                type="email" 
                required
                placeholder="dev@githero.io" 
                class="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg px-4 py-2.5 text-on-surface font-terminal-code text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all placeholder:text-on-surface-variant/40"
              />
            </div>

            <button 
              type="submit" 
              id="forgot-submit-btn"
              class="w-full py-3 mt-2 bg-tertiary text-on-tertiary font-terminal-label text-terminal-label uppercase tracking-widest rounded-lg glow-amber hover:scale-[1.02] transition-transform duration-200 shadow-lg font-bold flex items-center justify-center gap-2"
            >
              <span>[DISPATCH RECOVERY KEY]</span>
              <span class="material-symbols-outlined text-sm">send</span>
            </button>
          </form>

          <div class="mt-6 pt-4 border-t border-outline-variant/30 text-center flex justify-between text-xs font-terminal-code">
            <a href="#login" class="text-on-surface-variant hover:text-primary">← Back to Login</a>
            <a href="#register" class="text-primary hover:underline">Register Account</a>
          </div>
        </div>
      </div>
    </main>
  `;
}

export function renderResetPasswordView(token = '', errorMessage = '') {
  return `
    <main class="min-h-screen pt-20 pb-20 px-4 flex items-center justify-center relative overflow-hidden bg-background">
      <div class="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none"></div>

      <div class="relative z-10 w-full max-w-md">
        <div class="text-center mb-8">
          <h1 class="text-headline-md font-headline-md text-on-surface font-bold">Set New Password</h1>
          <p class="text-on-surface-variant text-sm font-terminal-code mt-1">Provide your recovery token and new credentials</p>
        </div>

        <div class="glass-panel rounded-2xl p-6 md:p-8 border border-outline-variant/40 shadow-2xl relative overflow-hidden">
          ${errorMessage ? `
            <div class="mb-4 p-3 bg-error/15 border border-error/40 rounded-lg text-error text-xs font-terminal-code flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px]">error</span>
              <span>${errorMessage}</span>
            </div>
          ` : ''}

          <form id="auth-reset-form" class="space-y-4">
            <div>
              <label class="block text-terminal-label font-terminal-label text-on-surface-variant text-xs mb-1.5 uppercase tracking-wider" for="reset-token">
                Recovery Token
              </label>
              <input 
                id="reset-token" 
                name="token" 
                type="text" 
                required
                value="${token}"
                placeholder="Paste token" 
                class="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg px-4 py-2.5 text-on-surface font-terminal-code text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all font-mono"
              />
            </div>

            <div>
              <label class="block text-terminal-label font-terminal-label text-on-surface-variant text-xs mb-1.5 uppercase tracking-wider" for="reset-new-password">
                New Password
              </label>
              <input 
                id="reset-new-password" 
                name="newPassword" 
                type="password" 
                required
                minlength="6"
                placeholder="At least 6 characters" 
                class="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg px-4 py-2.5 text-on-surface font-terminal-code text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all"
              />
            </div>

            <button 
              type="submit" 
              id="reset-submit-btn"
              class="w-full py-3 mt-2 bg-primary text-on-primary font-terminal-label text-terminal-label uppercase tracking-widest rounded-lg glow-primary hover:scale-[1.02] transition-transform duration-200 shadow-lg font-bold flex items-center justify-center gap-2"
            >
              <span>[UPDATE CREDENTIALS]</span>
              <span class="material-symbols-outlined text-sm">lock_reset</span>
            </button>
          </form>
        </div>
      </div>
    </main>
  `;
}
