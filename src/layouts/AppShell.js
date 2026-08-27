// GitHero Application Shell Layout Builder
// Assembles responsive TopAppBar, Sidebar, Main Content, and Mobile Bottom Navigation.

import { renderTopAppBar } from '../../js/components/TopAppBar.js';
import { renderBottomNavBar } from '../../js/components/BottomNavBar.js';
import { ToastContainer } from '../components/ToastContainer.js';
import { notificationStore } from '../state/NotificationStore.js';

export class AppShell {
  /**
   * Render complete SPA shell layout
   * @param {string} currentRoute 
   * @param {string} contentHtml 
   * @returns {string} full layout HTML
   */
  static render(currentRoute, contentHtml) {
    const isGameplay = currentRoute === 'gameplay';
    const topBar = renderTopAppBar(currentRoute);
    const bottomNav = renderBottomNavBar(isGameplay);
    const activeToast = notificationStore.getState().activeToast;
    const toastHtml = activeToast ? ToastContainer.renderToast(activeToast) : '';

    return `
      <div id="githero-app-layout" class="min-h-screen flex flex-col bg-background text-on-background">
        <!-- Top App Bar Navigation -->
        ${topBar}

        <!-- Main Page View Content Container -->
        <main id="main-content-viewport" class="flex-1 flex flex-col relative overflow-x-hidden ${isGameplay ? '' : 'container mx-auto px-4 py-6 max-w-7xl'}">
          ${contentHtml}
        </main>

        <!-- Floating Notifications & Toasts -->
        ${toastHtml}

        <!-- Mobile Bottom Navigation Bar -->
        ${bottomNav}
      </div>
    `;
  }
}
