// GitHero Toast Notification Container
// Floating alert toasts for achievement popups and system notifications.

export class ToastContainer {
  /**
   * Render floating toast markup
   * @param {Object} toast 
   * @returns {string} HTML markup
   */
  static renderToast(toast) {
    if (!toast) return '';

    const typeIcons = {
      success: 'check_circle',
      error: 'error',
      warning: 'warning',
      info: 'info'
    };

    const typeStyles = {
      success: 'border-primary/50 text-primary bg-surface-container-high',
      error: 'border-error/50 text-error bg-surface-container-high',
      warning: 'border-tertiary/50 text-tertiary bg-surface-container-high',
      info: 'border-secondary/50 text-secondary bg-surface-container-high'
    };

    const icon = typeIcons[toast.type] || 'info';
    const style = typeStyles[toast.type] || typeStyles.info;

    return `
      <div id="toast-active-popup" class="fixed bottom-20 right-6 z-50 max-w-sm p-4 rounded-xl border ${style} shadow-2xl flex items-center gap-3 animate-slide-up backdrop-blur-md">
        <span class="material-symbols-Outlined text-xl">${icon}</span>
        <div class="flex-1 text-xs text-on-surface">
          <p class="font-semibold text-on-surface">${toast.message}</p>
        </div>
      </div>
    `;
  }
}
