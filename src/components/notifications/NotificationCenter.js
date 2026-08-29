/**
 * NotificationCenter
 * Central notification hub for activity logs, achievement unlocks, and level unlock broadcasts.
 */

export class NotificationCenter {
  constructor() {
    this.notifications = [];
    this.unreadCount = 0;
    this.listeners = new Set();
  }

  addNotification({ title, message, type = 'info', icon = 'notifications', actionUrl = '' }) {
    const notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleTimeString(),
      title,
      message,
      type,
      icon,
      actionUrl,
      read: false
    };

    this.notifications.unshift(notification);
    this.unreadCount++;
    this.notify();
    return notification;
  }

  markAllAsRead() {
    this.notifications.forEach(n => { n.read = true; });
    this.unreadCount = 0;
    this.notify();
  }

  clear() {
    this.notifications = [];
    this.unreadCount = 0;
    this.notify();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    listener(this.notifications, this.unreadCount);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const l of this.listeners) {
      l(this.notifications, this.unreadCount);
    }
  }

  static renderDrawerHtml(notifications = [], unreadCount = 0) {
    const listHtml = notifications.length > 0 ? notifications.map((n) => `
      <div class="glass-panel p-3 rounded-xl border ${n.read ? 'border-outline-variant/20 opacity-70' : 'border-primary/40 bg-primary/5'} flex items-start gap-3 text-xs font-terminal-code">
        <span class="material-symbols-outlined text-[18px] text-primary shrink-0 mt-0.5">${n.icon}</span>
        <div class="flex-1">
          <div class="flex justify-between items-center mb-0.5">
            <span class="font-bold text-on-surface">${n.title}</span>
            <span class="text-[10px] text-on-surface-variant">${n.timestamp}</span>
          </div>
          <p class="text-on-surface-variant leading-relaxed text-[11px]">${n.message}</p>
        </div>
      </div>
    `).join('') : `
      <div class="p-8 text-center text-xs text-on-surface-variant font-terminal-code">
        No active transmissions in cluster buffer
      </div>
    `;

    return `
      <div id="notification-drawer" class="fixed right-0 top-0 bottom-0 w-80 max-w-full bg-surface-container-low border-l border-outline-variant/30 z-50 p-4 shadow-2xl flex flex-col justify-between font-terminal-code animate-slide-left">
        <div>
          <div class="flex items-center justify-between border-b border-surface-variant/30 pb-3 mb-3">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-primary text-lg">notifications</span>
              <span class="font-bold text-on-surface text-sm uppercase">Transmissions</span>
              ${unreadCount > 0 ? `<span class="px-1.5 py-0.2 rounded-full bg-primary text-on-primary text-[10px] font-bold">${unreadCount}</span>` : ''}
            </div>
            <button id="close-drawer-btn" class="p-1 text-on-surface-variant hover:text-on-surface cursor-pointer">
              <span class="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          <div class="space-y-2 overflow-y-auto max-h-[calc(100vh-140px)] scrollbar-thin">
            ${listHtml}
          </div>
        </div>

        <div class="pt-3 border-t border-surface-variant/30 flex justify-between">
          <button id="mark-all-read-btn" class="text-xs text-primary font-terminal-label hover:underline cursor-pointer">
            Mark all read
          </button>
          <button id="clear-all-notif-btn" class="text-xs text-on-surface-variant font-terminal-label hover:text-error cursor-pointer">
            Clear all
          </button>
        </div>
      </div>
    `;
  }
}

export const notificationCenter = new NotificationCenter();
