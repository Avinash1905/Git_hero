/**
 * GitHero AuthView Component
 * Provides Login, Register, Forgot Password, and Onboarding interactive modals.
 */

export function renderAuthView(activeTab = 'login', onAuthSuccess) {
  return `
    <main class="min-h-screen pt-20 pb-20 px-4 flex items-center justify-center relative overflow-hidden">
      <div class="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none"></div>

      <div class="relative z-10 w-full max-w-md bg-surface-container-high/90 backdrop-blur-2xl border border-outline-variant/50 rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <!-- Logo Branding -->
        <div class="text-center mb-6">
          <h1 class="text-headline-md font-headline-md text-primary font-bold tracking-tight">GitHero</h1>
          <p class="text-xs font-terminal-code text-on-surface-variant mt-1">Authenticate developer credentials</p>
        </div>

        <!-- Auth Tabs -->
        <div class="flex bg-surface-container-low p-1 rounded-xl mb-6 border border-outline-variant/30">
          <button id="auth-tab-login" class="flex-1 py-2 text-xs font-terminal-label font-bold rounded-lg transition-all ${activeTab === 'login' ? 'bg-primary text-on-primary shadow-md' : 'text-on-surface-variant hover:text-on-surface'}">
            LOGIN
          </button>
          <button id="auth-tab-register" class="flex-1 py-2 text-xs font-terminal-label font-bold rounded-lg transition-all ${activeTab === 'register' ? 'bg-primary text-on-primary shadow-md' : 'text-on-surface-variant hover:text-on-surface'}">
            REGISTER
          </button>
        </div>

        <!-- Dynamic Form Container -->
        <form id="auth-form" class="space-y-4">
          <div>
            <label class="block text-xs font-terminal-label text-on-surface-variant uppercase mb-1.5">Developer Handle / Email</label>
            <input 
              id="auth-input-handle" 
              type="text" 
              required
              placeholder="e.g. @cyber_ninja" 
              class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3.5 py-2.5 text-sm font-terminal-code text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
            />
          </div>

          ${activeTab === 'register' ? `
            <div>
              <label class="block text-xs font-terminal-label text-on-surface-variant uppercase mb-1.5">Email Address</label>
              <input 
                id="auth-input-email" 
                type="email" 
                required
                placeholder="developer@githero.io" 
                class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3.5 py-2.5 text-sm font-terminal-code text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              />
            </div>
          ` : ''}

          <div>
            <div class="flex justify-between items-center mb-1.5">
              <label class="text-xs font-terminal-label text-on-surface-variant uppercase">Access Token / Password</label>
              ${activeTab === 'login' ? `
                <button type="button" id="auth-forgot-btn" class="text-xs font-terminal-code text-primary hover:underline">
                  Forgot?
                </button>
              ` : ''}
            </div>
            <input 
              id="auth-input-password" 
              type="password" 
              required
              placeholder="••••••••" 
              class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3.5 py-2.5 text-sm font-terminal-code text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
            />
          </div>

          <div id="auth-error-box" class="hidden p-3 bg-error/15 border border-error/40 rounded-lg text-xs font-terminal-code text-error"></div>

          <button type="submit" class="w-full py-3 bg-primary text-on-primary rounded-xl font-bold font-terminal-label uppercase tracking-wider hover:scale-[1.02] transition-transform shadow-[0_0_15px_rgba(78,222,163,0.3)] mt-2">
            ${activeTab === 'login' ? 'INITIALIZE SESSION' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <div class="mt-6 pt-4 border-t border-outline-variant/20 text-center">
          <button id="auth-guest-btn" class="text-xs font-terminal-code text-secondary hover:text-primary transition-colors">
            Continue as Guest Developer →
          </button>
        </div>
      </div>
    </main>
  `;
}
