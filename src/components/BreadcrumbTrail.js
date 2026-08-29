// GitHero Breadcrumb Trail Component
// Accessible breadcrumb trail for sector and workbench navigation.

export class BreadcrumbTrail {
  /**
   * Render semantic breadcrumbs HTML
   * @param {Array<{ label: string, route?: string, icon?: string, active?: boolean }>} items 
   * @returns {string} HTML markup
   */
  static render(items = []) {
    const listItems = items.map((item, index) => {
      const isLast = index === items.length - 1 || item.active;
      const iconHtml = item.icon ? `<span class="material-symbols-Outlined text-xs mr-1">${item.icon}</span>` : '';

      if (isLast) {
        return `
          <li class="flex items-center text-primary font-semibold" aria-current="page">
            ${iconHtml}
            <span>${item.label}</span>
          </li>
        `;
      }

      return `
        <li class="flex items-center">
          <a href="#${item.route || 'hero'}" class="flex items-center text-on-surface-variant hover:text-primary transition text-xs">
            ${iconHtml}
            <span>${item.label}</span>
          </a>
          <span class="material-symbols-Outlined text-xs text-outline mx-2">chevron_right</span>
        </li>
      `;
    }).join('');

    return `
      <nav aria-label="Breadcrumb" class="py-2.5 px-4 bg-surface-container-low/60 rounded-lg border border-outline-variant/20 mb-4 inline-block">
        <ol class="flex items-center flex-wrap text-xs">
          ${listItems}
        </ol>
      </nav>
    `;
  }
}
