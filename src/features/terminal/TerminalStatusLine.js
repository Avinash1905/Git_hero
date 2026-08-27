/**
 * TerminalStatusLine
 * Real-time status line rendering active branch ref, staged files, HEAD hash, and session status.
 */

export class TerminalStatusLine {
  renderHtml(session = {}) {
    const branch = session.branch || 'master';
    const headSha = session.headSha || 'dac1658';
    const isClean = session.isClean !== false;

    return `
      <div class="px-3 py-1.5 bg-surface-container-lowest border-t border-outline-variant/20 flex items-center justify-between text-[11px] font-mono text-on-surface-variant select-none">
        <div class="flex items-center gap-3">
          <span class="flex items-center gap-1 text-primary">
            <span class="material-symbols-outlined text-[14px]">alt_route</span>
            <strong>${branch}</strong>
          </span>
          <span class="flex items-center gap-1 text-on-surface">
            <span>HEAD @ ${headSha.substring(0, 7)}</span>
          </span>
        </div>

        <div class="flex items-center gap-2">
          <span class="flex items-center gap-1 ${isClean ? 'text-primary' : 'text-amber-400'}">
            <span class="material-symbols-outlined text-[14px]">${isClean ? 'check_circle' : 'pending'}</span>
            <span>${isClean ? 'Working Tree Clean' : 'Unstaged Modifications'}</span>
          </span>
        </div>
      </div>
    `;
  }
}

export const terminalStatusLine = new TerminalStatusLine();
