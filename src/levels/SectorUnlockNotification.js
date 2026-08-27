/**
 * SectorUnlockNotification
 * Celebratory toast and modal notifications when new sectors, worlds, or milestones are unlocked.
 */

export class SectorUnlockNotification {
  constructor() {
    this.queue = [];
  }

  /**
   * Push an unlock notification to the queue
   */
  notifyUnlock(type = 'sector', data = {}) {
    const item = {
      id: Date.now() + Math.random(),
      type, // 'sector', 'world', 'milestone', 'title'
      title: data.title || 'New Sector Unlocked!',
      subtitle: data.subtitle || 'Access granted in mission selector',
      icon: data.icon || (type === 'world' ? 'public' : 'lock_open'),
      xp: data.xp || 0,
      timestamp: Date.now()
    };

    this.queue.push(item);
    return item;
  }

  /**
   * Render transient toast HTML banner
   */
  renderToastHtml(item, onDismiss = 'handleDismissUnlockToast') {
    if (!item) return '';

    return `
      <div 
        id="unlock-toast-${item.id}" 
        class="fixed bottom-20 right-6 z-50 p-4 rounded-2xl bg-surface-container-high border border-primary/40 shadow-2xl flex items-center gap-3.5 animate-slide-up max-w-sm"
      >
        <div class="p-2.5 rounded-xl bg-primary/20 text-primary border border-primary/30 animate-pulse">
          <span class="material-symbols-outlined text-2xl">${item.icon}</span>
        </div>
        <div class="flex-1 space-y-0.5">
          <div class="text-[10px] uppercase font-mono tracking-wider font-bold text-primary">Mission Update</div>
          <div class="text-xs font-bold text-on-surface font-mono">${item.title}</div>
          <div class="text-[11px] text-on-surface-variant">${item.subtitle}</div>
        </div>
        <button onclick="${onDismiss}('${item.id}')" class="p-1 rounded-md text-on-surface-variant hover:text-on-surface">
          <span class="material-symbols-outlined text-[16px]">close</span>
        </button>
      </div>
    `;
  }
}

export const sectorUnlockNotification = new SectorUnlockNotification();
