/**
 * UIStore
 * Manages global application shell state: current route, toast notifications,
 * modals, mobile navigation drawer, and design theme.
 */

import { Store } from './Store.js';

export class UIStore extends Store {
  constructor() {
    super({
      currentRoute: 'hero',
      previousRoute: null,
      toasts: [],
      activeModal: null,
      isMobileNavOpen: false,
      theme: 'dark'
    });
  }

  setRoute(route) {
    this.setState((prev) => ({
      previousRoute: prev.currentRoute,
      currentRoute: route,
      isMobileNavOpen: false
    }), 'SET_ROUTE');
  }

  showToast(message, type = 'info', duration = 3000) {
    const id = Math.random().toString(36).substring(2, 9);
    const toast = { id, message, type, duration };

    this.setState((prev) => ({
      toasts: [...prev.toasts, toast]
    }), 'SHOW_TOAST');

    if (duration > 0) {
      setTimeout(() => {
        this.removeToast(id);
      }, duration);
    }
  }

  removeToast(id) {
    this.setState((prev) => ({
      toasts: prev.toasts.filter((t) => t.id !== id)
    }), 'REMOVE_TOAST');
  }

  openModal(modalType, props = {}) {
    this.setState({ activeModal: { type: modalType, props } }, 'OPEN_MODAL');
  }

  closeModal() {
    this.setState({ activeModal: null }, 'CLOSE_MODAL');
  }

  toggleMobileNav() {
    this.setState((prev) => ({ isMobileNavOpen: !prev.isMobileNavOpen }), 'TOGGLE_MOBILE_NAV');
  }
}

export const uiStore = new UIStore();
