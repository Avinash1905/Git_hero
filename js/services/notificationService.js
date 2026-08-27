/**
 * GitHero Notification & Toast Queue Service
 * Manages toast display, audio cues, and auto-dismiss lifecycles.
 */

import { eventBus, EVENTS } from '../state/eventBus.js';
import { soundFX } from '../audio.js';

export class NotificationService {
  constructor() {
    this.queue = [];
    this.container = null;
    this.init();
  }

  init() {
    eventBus.on(EVENTS.TOAST_SHOW, (payload) => {
      this.show(payload);
    });
  }

  show({ type = 'info', title = 'NOTIFICATION', message = '', duration = 4000 }) {
    const id = 'toast_' + Math.random().toString(36).substring(2, 9);
    const toast = { id, type, title, message, duration };
    this.queue.push(toast);

    if (type === 'success') soundFX.playSuccess();
    else if (type === 'error') soundFX.playError();

    this.render();

    setTimeout(() => {
      this.dismiss(id);
    }, duration);
  }

  dismiss(id) {
    this.queue = this.queue.filter(t => t.id !== id);
    this.render();
  }

  render() {
    if (typeof document === 'undefined') return;

    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'fixed bottom-24 right-6 z-[100] flex flex-col gap-2 pointer-events-none max-w-sm w-full';
      document.body.appendChild(container);
    }

    container.innerHTML = this.queue.map(t => {
      let icon = 'info';
      let borderClr = 'border-primary/50';
      let textClr = 'text-primary';
      let bgClr = 'bg-surface-container-high/95';

      if (t.type === 'success') {
        icon = 'check_circle';
        borderClr = 'border-primary/60';
        textClr = 'text-primary';
      } else if (t.type === 'error') {
        icon = 'error';
        borderClr = 'border-error/60';
        textClr = 'text-error';
      } else if (t.type === 'warning') {
        icon = 'warning';
        borderClr = 'border-tertiary/60';
        textClr = 'text-tertiary';
      }

      return `
        <div class="pointer-events-auto p-3 rounded-lg ${bgClr} backdrop-blur-xl border ${borderClr} shadow-2xl flex items-start gap-3 transform transition-all duration-300 animate-in slide-in-from-bottom-2">
          <span class="material-symbols-outlined ${textClr} text-xl shrink-0 mt-0.5">${icon}</span>
          <div class="flex-1">
            <div class="text-xs font-terminal-label ${textClr} font-bold tracking-wider uppercase">${t.title}</div>
            <div class="text-xs font-terminal-code text-on-surface/90 mt-0.5">${t.message}</div>
          </div>
        </div>
      `;
    }).join('');
  }
}

export const notificationService = new NotificationService();
