// GitHero Accessible Modal Container Component
// Accessible ARIA dialog container with backdrop, title, and close trigger.

export class ModalContainer {
  /**
   * Render modal dialog structure
   * @param {Object} options 
   * @returns {string} HTML markup
   */
  static render(options = {}) {
    const {
      id = 'modal-generic',
      title = 'System Modal',
      icon = 'info',
      content = '',
      footer = '',
      maxWidth = 'max-w-xl'
    } = options;

    return `
      <div id="${id}" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="${id}-title">
        <div class="bg-surface-container rounded-2xl border border-outline-variant/40 shadow-2xl w-full ${maxWidth} overflow-hidden transform transition-all">
          <!-- Header -->
          <div class="px-6 py-4 bg-surface-container-high border-b border-outline-variant/30 flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <span class="material-symbols-Outlined text-primary text-xl">${icon}</span>
              <h3 id="${id}-title" class="text-base font-bold text-on-surface">${title}</h3>
            </div>
            <button class="modal-close-btn text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-container-highest transition" aria-label="Close modal">
              <span class="material-symbols-Outlined text-lg">close</span>
            </button>
          </div>

          <!-- Body -->
          <div class="p-6 overflow-y-auto max-h-[75vh]">
            ${content}
          </div>

          <!-- Footer -->
          ${footer ? `
            <div class="px-6 py-3.5 bg-surface-container-low border-t border-outline-variant/20 flex justify-end gap-2">
              ${footer}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }
}
