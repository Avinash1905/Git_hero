/**
 * DataTable
 * Accessible, sortable, and responsive data table component.
 */

export class DataTable {
  /**
   * Render table HTML
   * @param {Object} options
   * @param {Array<{key: string, label: string, sortable?: boolean, align?: 'left'|'center'|'right'}>} options.columns
   * @param {Array<Object>} options.data
   * @param {string} [options.sortColumn]
   * @param {'asc'|'desc'} [options.sortDirection]
   * @returns {string}
   */
  static renderTableHtml({
    columns = [],
    data = [],
    sortColumn = '',
    sortDirection = 'asc',
    emptyMessage = 'No records available'
  }) {
    if (!data || data.length === 0) {
      return `
        <div class="glass-panel p-8 text-center text-xs text-on-surface-variant font-terminal-code rounded-xl border border-outline-variant/30">
          ${emptyMessage}
        </div>
      `;
    }

    const headerCells = columns.map((col) => {
      const isSorted = sortColumn === col.key;
      const alignCls = col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left';

      return `
        <th 
          scope="col" 
          data-column-key="${col.key}"
          class="px-4 py-3 text-[11px] font-terminal-label uppercase tracking-wider text-on-surface-variant select-none ${alignCls} ${col.sortable ? 'cursor-pointer hover:text-primary' : ''}"
        >
          <div class="inline-flex items-center gap-1">
            <span>${col.label}</span>
            ${isSorted ? `
              <span class="material-symbols-outlined text-[14px] text-primary">
                ${sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward'}
              </span>
            ` : ''}
          </div>
        </th>
      `;
    }).join('');

    const bodyRows = data.map((row, rIdx) => {
      const rowCells = columns.map((col) => {
        const val = row[col.key] !== undefined ? row[col.key] : '';
        const alignCls = col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left';
        return `<td class="px-4 py-3 text-xs font-terminal-code text-on-surface ${alignCls}">${val}</td>`;
      }).join('');

      return `
        <tr class="border-t border-outline-variant/15 hover:bg-surface-container-high/40 transition-colors ${rIdx % 2 === 0 ? 'bg-surface-container-lowest/30' : ''}">
          ${rowCells}
        </tr>
      `;
    }).join('');

    return `
      <div class="w-full overflow-x-auto rounded-xl border border-outline-variant/30 glass-panel shadow-lg">
        <table class="w-full text-left border-collapse">
          <thead class="bg-surface-container-high/60 border-b border-outline-variant/30">
            <tr>
              ${headerCells}
            </tr>
          </thead>
          <tbody>
            ${bodyRows}
          </tbody>
        </table>
      </div>
    `;
  }
}
