/**
 * AuthCard Component
 * Consistent glassmorphic card container for authentication forms adhering to the Stitch design system.
 */

export function renderAuthCard({
  badgeText = 'Auth Terminal :: Node 01',
  title = '',
  subtitle = '',
  errorMessage = '',
  successMessage = '',
  childrenHtml = '',
  footerHtml = ''
}) {
  return `
    <main class="min-h-screen pt-20 pb-20 px-4 flex items-center justify-center relative overflow-hidden bg-background">
      <div class="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none"></div>

      <div class="relative z-10 w-full max-w-md">
        <!-- Brand & Terminal Header -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-variant/60 border border-primary/30 backdrop-blur-md mb-3">
            <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span class="text-terminal-label font-terminal-label text-primary uppercase tracking-widest text-xs">${badgeText}</span>
          </div>
          <h1 class="text-headline-md font-headline-md text-on-surface font-bold">${title}</h1>
          ${subtitle ? `<p class="text-on-surface-variant text-sm font-terminal-code mt-1">${subtitle}</p>` : ''}
        </div>

        <!-- Glassmorphic Card -->
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

          ${childrenHtml}
        </div>

        ${footerHtml ? `<div class="mt-6 text-center text-xs text-on-surface-variant font-terminal-code">${footerHtml}</div>` : ''}
      </div>
    </main>
  `;
}
