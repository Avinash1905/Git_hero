// GitHero Session Auditor & Cross-Tab Activity Coordinator
// Manages idle timeouts, background token refresh cycles, and multi-tab auth synchronization.

export class SessionAuditor {
  constructor(options = {}) {
    this.idleTimeoutMs = options.idleTimeoutMs || 30 * 60 * 1000; // 30 minutes
    this.refreshIntervalMs = options.refreshIntervalMs || 5 * 60 * 1000; // 5 minutes
    this.onSessionExpired = options.onSessionExpired || (() => {});
    this.onSessionRefreshed = options.onSessionRefreshed || (() => {});
    
    this.lastActivityTime = Date.now();
    this.idleTimer = null;
    this.refreshTimer = null;
    this.broadcastChannel = null;
    this.isListening = false;
  }

  /**
   * Start listening for user activity and cross-tab events
   */
  start() {
    if (this.isListening) return;
    this.isListening = true;
    this.lastActivityTime = Date.now();

    // 1. Cross-tab synchronization via BroadcastChannel if available
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        this.broadcastChannel = new BroadcastChannel('githero_session_channel');
        this.broadcastChannel.onmessage = (event) => this.handleBroadcastMessage(event);
      }
    } catch (err) {
      console.warn('[SessionAuditor] BroadcastChannel unavailable:', err);
    }

    // 2. Activity event listeners
    if (typeof window !== 'undefined') {
      const activityEvents = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'];
      this.activityHandler = () => this.recordActivity();
      activityEvents.forEach(evt => window.addEventListener(evt, this.activityHandler, { passive: true }));
    }

    // 3. Periodic idle check
    this.idleTimer = setInterval(() => this.checkIdleStatus(), 15000);

    // 4. Periodic token refresh trigger
    this.refreshTimer = setInterval(() => this.triggerTokenRefresh(), this.refreshIntervalMs);
  }

  /**
   * Stop auditing and cleanup listeners
   */
  stop() {
    this.isListening = false;
    if (this.idleTimer) clearInterval(this.idleTimer);
    if (this.refreshTimer) clearInterval(this.refreshTimer);
    if (this.broadcastChannel) {
      try { this.broadcastChannel.close(); } catch (e) {}
      this.broadcastChannel = null;
    }
    if (typeof window !== 'undefined' && this.activityHandler) {
      const activityEvents = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'];
      activityEvents.forEach(evt => window.removeEventListener(evt, this.activityHandler));
    }
  }

  /**
   * Record user interaction timestamp
   */
  recordActivity() {
    this.lastActivityTime = Date.now();
  }

  /**
   * Check if session has exceeded idle threshold
   */
  checkIdleStatus() {
    const elapsed = Date.now() - this.lastActivityTime;
    if (elapsed > this.idleTimeoutMs) {
      this.notifySessionExpired('Session timed out due to inactivity.');
    }
  }

  /**
   * Trigger background token refresh
   */
  async triggerTokenRefresh() {
    const elapsed = Date.now() - this.lastActivityTime;
    // Only refresh if user was active within idle timeout window
    if (elapsed < this.idleTimeoutMs) {
      this.onSessionRefreshed();
      this.broadcast({ type: 'HEARTBEAT', timestamp: Date.now() });
    }
  }

  /**
   * Handle incoming broadcast message from peer browser tabs
   */
  handleBroadcastMessage(event) {
    if (!event || !event.data) return;
    const { type, payload } = event.data;

    switch (type) {
      case 'AUTH_LOGIN':
        if (this.onSessionRefreshed) this.onSessionRefreshed(payload);
        break;
      case 'AUTH_LOGOUT':
        this.notifySessionExpired('Logged out in another window.');
        break;
      case 'HEARTBEAT':
        this.lastActivityTime = Date.now();
        break;
      default:
        break;
    }
  }

  /**
   * Broadcast message to all open tabs
   */
  broadcast(data) {
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(data);
      } catch (err) {
        console.warn('[SessionAuditor] Broadcast post failed:', err);
      }
    }
  }

  /**
   * Notify subscribers of session expiry
   */
  notifySessionExpired(reason) {
    this.stop();
    this.onSessionExpired(reason);
  }
}
