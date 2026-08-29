/**
 * GitQuest Frontend - Git Object Database Visualizer
 * SVG graph diagram revealing relationships between Commits -> Trees -> Blobs,
 * raw object byte inspectors, and SHA-1 hash pointers.
 */

export class GitObjectDatabaseVisualizer {
  constructor(inspector) {
    this.inspector = inspector;
  }

  renderDatabaseSvg(width = 560, height = 220) {
    const counts = this.inspector.countByType();

    return `
      <div class="object-database-panel" style="background:#090d16; color:#e2e8f0; padding:18px; border-radius:12px; border:1px solid rgba(56,189,248,0.25); max-width:600px; font-family:Inter, sans-serif;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div>
            <h4 style="margin:0; color:#38bdf8; font-size:15px;">🔍 Git Object Database (.git/objects/)</h4>
            <span style="font-size:11px; color:#94a3b8;">Immutability tree: Commits, Trees & Blobs</span>
          </div>
          <div style="display:flex; gap:6px; font-size:10px; font-weight:bold;">
            <span style="background:rgba(56,189,248,0.15); color:#38bdf8; padding:2px 6px; border-radius:3px;">${counts.commit} Commits</span>
            <span style="background:rgba(52,211,153,0.15); color:#34d399; padding:2px 6px; border-radius:3px;">${counts.tree} Trees</span>
            <span style="background:rgba(245,158,11,0.15); color:#f59e0b; padding:2px 6px; border-radius:3px;">${counts.blob} Blobs</span>
          </div>
        </div>

        <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}">
          <!-- Connections -->
          <line x1="100" y1="110" x2="270" y2="110" stroke="#38bdf8" stroke-width="2"/>
          <line x1="270" y1="110" x2="440" y2="70" stroke="#34d399" stroke-width="1.5" stroke-dasharray="3,3"/>
          <line x1="270" y1="110" x2="440" y2="150" stroke="#34d399" stroke-width="1.5" stroke-dasharray="3,3"/>

          <!-- Commit Node -->
          <g transform="translate(40, 80)">
            <rect width="120" height="60" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
            <text x="60" y="24" font-size="11" font-weight="bold" fill="#38bdf8" text-anchor="middle">COMMIT</text>
            <text x="60" y="44" font-size="9" font-family="monospace" fill="#94a3b8" text-anchor="middle">tree 891f03a...</text>
          </g>

          <!-- Tree Node -->
          <g transform="translate(210, 80)">
            <rect width="120" height="60" rx="8" fill="#0f172a" stroke="#34d399" stroke-width="2"/>
            <text x="60" y="24" font-size="11" font-weight="bold" fill="#34d399" text-anchor="middle">TREE (ROOT)</text>
            <text x="60" y="44" font-size="9" font-family="monospace" fill="#94a3b8" text-anchor="middle">2 entries</text>
          </g>

          <!-- Blob 1 -->
          <g transform="translate(380, 40)">
            <rect width="120" height="50" rx="6" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5"/>
            <text x="60" y="20" font-size="10" font-weight="bold" fill="#f59e0b" text-anchor="middle">BLOB (main.js)</text>
            <text x="60" y="36" font-size="9" font-family="monospace" fill="#94a3b8" text-anchor="middle">hash 3c891f...</text>
          </g>

          <!-- Blob 2 -->
          <g transform="translate(380, 120)">
            <rect width="120" height="50" rx="6" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5"/>
            <text x="60" y="20" font-size="10" font-weight="bold" fill="#f59e0b" text-anchor="middle">BLOB (app.css)</text>
            <text x="60" y="36" font-size="9" font-family="monospace" fill="#94a3b8" text-anchor="middle">hash 4b2a8d...</text>
          </g>
        </svg>
      </div>
    `;
  }
}
