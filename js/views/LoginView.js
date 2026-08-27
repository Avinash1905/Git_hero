// LoginView: Modern Gaming-Style Login Screen for GitHero

export function renderLoginView() {
  return `
    <main class="min-h-screen pt-20 pb-16 px-4 flex items-center justify-center relative overflow-hidden hero-gradient">
      <!-- Background Cyber Grid Decoration -->
      <div class="absolute inset-0 bg-grid-pattern opacity-35 pointer-events-none"></div>

      <!-- Ambient Glow Orbs -->
      <div class="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-1/4 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="relative z-10 w-full max-w-lg">
        <!-- Terminal Header Tag -->
        <div class="flex items-center justify-between mb-3 px-2">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high/80 border border-outline-variant/40 backdrop-blur-md">
            <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span class="text-terminal-label font-terminal-label text-primary text-xs">git login --auth</span>
          </div>
          <span class="text-xs font-terminal-code text-on-surface-variant">BRANCH: auth/login</span>
        </div>

        <!-- Main Card -->
        <div class="glass-panel rounded-2xl p-6 sm:p-8 border border-outline-variant/40 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-80"></div>

          <!-- Title & Subtitle -->
          <div class="text-center mb-6">
            <h1 class="text-headline-md font-headline-md font-bold text-on-surface tracking-tight mb-2">
              Welcome Back, Operator
            </h1>
            <p class="text-body-md text-on-surface-variant text-sm">
              Enter your credentials to resume your Git quest.
            </p>
          </div>

          <!-- Status Banner (Hidden by default, used for validation errors & success) -->
          <div id="login-status-banner" class="hidden mb-5 p-3 rounded-lg border text-xs font-terminal-code flex items-start gap-2 transition-all">
            <span id="login-status-icon" class="material-symbols-outlined text-[18px] shrink-0"></span>
            <div id="login-status-text" class="flex-1"></div>
          </div>

          <!-- Forgot Password Info Modal / Toast (Interactive placeholder) -->
          <div id="login-forgot-modal" class="hidden mb-5 p-3.5 rounded-lg bg-surface-container-highest border border-secondary/40 text-xs font-terminal-code flex items-center justify-between gap-2 shadow-lg animate-fadeIn">
            <div class="flex items-center gap-2 text-secondary">
              <span class="material-symbols-outlined text-[18px]">info</span>
              <span>Password recovery will be available soon.</span>
            </div>
            <button
              type="button"
              id="login-close-modal-btn"
              class="text-on-surface-variant hover:text-on-surface p-1 transition-colors"
              title="Dismiss"
            >
              <span class="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>

          <!-- Login Form -->
          <form id="login-form" novalidate class="space-y-4">
            <!-- Name Field -->
            <div>
              <label for="login-name" class="block text-terminal-label font-terminal-label text-on-surface-variant text-xs uppercase tracking-wider mb-1.5">
                Operator Name <span class="text-primary">*</span>
              </label>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/70 text-[20px] pointer-events-none">
                  person
                </span>
                <input
                  id="login-name"
                  name="name"
                  type="text"
                  autocomplete="username"
                  placeholder="Enter your operator name"
                  class="w-full bg-surface-container-low/90 border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg py-2.5 pl-11 pr-4 text-on-surface placeholder:text-on-surface-variant/40 text-sm font-body-md transition-all outline-none"
                />
              </div>
              <div id="login-name-error" class="hidden mt-1.5 text-xs text-error font-terminal-code flex items-center gap-1">
                <span class="material-symbols-outlined text-[14px]">error</span>
                <span class="error-msg">Name is required.</span>
              </div>
            </div>

            <!-- Password Field -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label for="login-password" class="block text-terminal-label font-terminal-label text-on-surface-variant text-xs uppercase tracking-wider">
                  Password <span class="text-primary">*</span>
                </label>
                <!-- Forgot Password Clickable Link -->
                <button
                  type="button"
                  id="login-forgot-pwd-btn"
                  class="text-xs text-secondary hover:text-primary transition-colors font-terminal-label hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/70 text-[20px] pointer-events-none">
                  lock
                </span>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  autocomplete="current-password"
                  placeholder="••••••••"
                  class="w-full bg-surface-container-low/90 border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg py-2.5 pl-11 pr-11 text-on-surface placeholder:text-on-surface-variant/40 text-sm font-body-md transition-all outline-none"
                />
                <button
                  type="button"
                  id="login-toggle-pwd-btn"
                  title="Toggle Password Visibility"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/70 hover:text-on-surface transition-colors p-1"
                >
                  <span class="material-symbols-outlined text-[20px]">visibility</span>
                </button>
              </div>
              <div id="login-password-error" class="hidden mt-1.5 text-xs text-error font-terminal-code flex items-center gap-1">
                <span class="material-symbols-outlined text-[14px]">error</span>
                <span class="error-msg">Password is required.</span>
              </div>
            </div>

            <!-- Login Button -->
            <div class="pt-2">
              <button
                type="submit"
                id="login-submit-btn"
                class="w-full py-3 px-6 bg-primary text-on-primary text-terminal-label font-terminal-label uppercase tracking-wider rounded-lg glow-primary hover:scale-[1.02] active:scale-[0.99] transition-all duration-200 shadow-[0_0_20px_rgba(78,222,163,0.35)] flex items-center justify-center gap-2 font-bold relative overflow-hidden group cursor-pointer"
              >
                <div class="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span class="material-symbols-outlined text-[20px]">login</span>
                <span>[AUTHENTICATE & ENTER]</span>
              </button>
            </div>
          </form>

          <!-- Divider -->
          <div class="relative flex py-4 items-center">
            <div class="flex-grow border-t border-outline-variant/30"></div>
            <span class="flex-shrink mx-3 text-xs text-on-surface-variant font-terminal-code uppercase tracking-wider">
              or connect via
            </span>
            <div class="flex-grow border-t border-outline-variant/30"></div>
          </div>

          <!-- Login with Google Button -->
          <div>
            <button
              type="button"
              id="login-google-btn"
              class="w-full py-2.5 px-4 rounded-lg bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/50 hover:border-secondary/60 text-on-surface font-terminal-label text-xs sm:text-sm flex items-center justify-center gap-3 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-sm"
            >
              <!-- Official Google Multicolor SVG Icon -->
              <svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Login with Google</span>
            </button>
          </div>

          <!-- Navigation Footer Link -->
          <div class="mt-6 pt-5 border-t border-outline-variant/30 text-center">
            <p class="text-xs text-on-surface-variant font-terminal-label">
              Don't have an operator account?
              <button
                id="login-to-reg-link"
                class="text-primary hover:text-primary-fixed-dim hover:underline font-bold ml-1 inline-flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Register here</span>
                <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </p>
          </div>
        </div>

        <!-- Terminal Status Footer -->
        <div class="mt-4 text-center text-[11px] font-terminal-code text-on-surface-variant/60">
          GitHero Security Protocol v2.4 // Local Client Interface
        </div>
      </div>
    </main>
  `;
}
