// GitHero Notification & Toast Reactive Store
// Manages transient notification toasts, broadcasts, and system announcement drawers.

import { Store } from './Store.js';

export class NotificationStore extends Store {
  constructor() {
    super({
      notifications: [],
      unreadCount: 0,
      activeToast: null
    });
  }

  /**
   * Push a new notification toast
   * @param {string} message 
   * @param {'info' | 'success' | 'warning' | 'error'} type 
   * @param {number} durationMs 
   */
  notify(message, type = 'info', durationMs = 4000) {
    const notif = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      message,
      type,
      timestamp: Date.now(),
      read: false
    };

    const nextList = [notif, ...this.getState().notifications];
    this.setState({
      notifications: nextList,
      unreadCount: this.getState().unreadCount + 1,
      activeToast: notif
    });

    if (durationMs > 0) {
      setTimeout(() => {
        if (this.getState().activeToast?.id === notif.id) {
          this.setState({ activeToast: null });
        }
      }, durationMs);
    }
  }

  /**
   * Dismiss active toast
   */
  dismissToast() {
    this.setState({ activeToast: null });
  }

  /**
   * Mark all notifications as read
   */
  markAllRead() {
    const updated = this.getState().notifications.map(n => ({ ...n, read: true }));
    this.setState({ notifications: updated, unreadCount: 0 });
  }

  /**
   * Clear all notification history
   */
  clearAll() {
    this.setState({ notifications: [], unreadCount: 0, activeToast: null });
  }
}

// Global Notification Store Singleton
export const notificationStore = new NotificationStore();
