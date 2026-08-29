/**
 * GitQuest Frontend - Game HUD Overlay
 * Top status bar rendering moves counter, star ratings, active Git branch badge,
 * stash indicator, par target comparison, and objective checklist HUD.
 */

export class GameHUDOverlay {
  constructor(containerId = 'game-hud') {
    this.containerId = containerId;
  }

  renderHudHtml(levelDef, gameState = {}) {
    if (!levelDef) return '<div class="game-hud-empty"></div>';

    const moves = gameState.moves || 0;
    const parMoves = levelDef.parMoves || (levelDef.gridSize * 3);
    const branchName = gameState.gitRepo?.currentBranch || `level-${levelDef.id}`;
    const onGoal = gameState.checkGoal ? gameState.checkGoal() : false;
    const isCommitted = Boolean(gameState.isCommitted);

    let starCount = 1;
    if (moves <= parMoves) starCount++;
    if (moves <= Math.floor(parMoves * 0.75)) starCount++;
    const starsHtml = '★'.repeat(starCount) + '☆'.repeat(3 - starCount);

    return `
      <div class="gitquest-hud-bar" style="display:flex; justify-content:space-between; align-items:center; background:#090d16; border:1px solid rgba(56,189,248,0.25); padding:10px 16px; border-radius:8px; margin-bottom:12px; font-family:Inter, sans-serif; color:#e2e8f0;">
        <div style="display:flex; align-items:center; gap:12px;">
          <div style="background:#1e1b4b; padding:4px 10px; border-radius:4px; border:1px solid #6366f1; font-weight:bold; font-size:12px; color:#a78bfa;">
            Level ${levelDef.id}: ${levelDef.name}
          </div>
          <div style="display:flex; align-items:center; gap:6px; font-size:12px; background:#0f172a; padding:4px 10px; border-radius:4px; border:1px solid #1e293b;">
            <span style="color:#64748b;">🌿 Branch:</span>
            <span style="color:#fcd34d; font-family:monospace; font-weight:600;">${branchName}</span>
          </div>
        </div>

        <div style="display:flex; align-items:center; gap:16px;">
          <div style="font-size:12px;">
            <span style="color:#64748b;">Moves:</span>
            <span style="font-weight:bold; color:${moves <= parMoves ? '#34d399' : '#f87171'};">${moves}</span>
            <span style="color:#64748b; font-size:10px;">(Par: ${parMoves})</span>
          </div>

          <div style="font-size:15px; color:#fcd34d;">
            ${starsHtml}
          </div>

          <div style="display:flex; align-items:center; gap:6px;">
            <span style="font-size:11px; padding:3px 8px; border-radius:4px; font-weight:bold; background:${onGoal ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}; color:${onGoal ? '#34d399' : '#f87171'}; border:1px solid ${onGoal ? '#10b981' : '#ef4444'};">
              ${onGoal ? '✓ STAGED' : 'UNSTAGED'}
            </span>
            ${isCommitted ? '<span style="font-size:11px; padding:3px 8px; border-radius:4px; font-weight:bold; background:#065f46; color:#34d399;">✓ COMMITTED</span>' : ''}
          </div>
        </div>
      </div>
    `;
  }
}
