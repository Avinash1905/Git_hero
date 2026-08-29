/**
 * ResponsiveGridShell
 * Layout shell orchestrating responsive canvas viewports, terminal sidebars, and HUD drawers across desktop and mobile screens.
 */

export class ResponsiveGridShell {
  renderShell(canvasHtml, terminalHtml, hudHtml, headerHtml, footerHtml) {
    return `
      <div class="min-h-screen flex flex-col bg-background text-on-surface select-none font-sans overflow-hidden">
        <!-- Top App Bar -->
        ${headerHtml || ''}

        <!-- Main Workspace Grid -->
        <main class="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 overflow-hidden max-w-7xl mx-auto w-full">
          <!-- Left Game Viewport & Tactical HUD (7 cols) -->
          <div class="lg:col-span-7 flex flex-col gap-4 overflow-hidden">
            <div class="flex-1 relative rounded-3xl bg-surface-container-lowest border border-outline-variant/30 overflow-hidden shadow-2xl flex items-center justify-center">
              ${canvasHtml || ''}
            </div>
            ${hudHtml ? `<div>${hudHtml}</div>` : ''}
          </div>

          <!-- Right Tactical Terminal & Visualizers (5 cols) -->
          <div class="lg:col-span-5 flex flex-col rounded-3xl bg-surface-container-high border border-outline-variant/30 overflow-hidden shadow-2xl">
            ${terminalHtml || ''}
          </div>
        </main>

        <!-- Bottom Navigation Bar -->
        ${footerHtml || ''}
      </div>
    `;
  }
}

export const responsiveGridShell = new ResponsiveGridShell();
