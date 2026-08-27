/**
 * NetworkHealthMonitor
 * Live network latency pinger, online/offline status tracker, and reconnection notification coordinator.
 */

export class NetworkHealthMonitor {
  constructor() {
    this.isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    this.lastPingMs = 0;
    this.listeners = [];

    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleStatusChange(true));
      window.addEventListener('offline', () => this.handleStatusChange(false));
    }
  }

  handleStatusChange(online) {
    this.isOnline = online;
    this.listeners.forEach(fn => fn(this.isOnline, this.lastPingMs));
  }

  subscribe(fn) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  async ping(url = '/api/health') {
    if (!this.isOnline) return -1;
    const start = Date.now();
    try {
      await fetch(url, { method: 'HEAD', cache: 'no-store' });
      this.lastPingMs = Date.now() - start;
      return this.lastPingMs;
    } catch {
      this.lastPingMs = -1;
      return -1;
    }
  }
}

export const networkHealthMonitor = new NetworkHealthMonitor();
