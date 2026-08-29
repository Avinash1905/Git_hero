/**
 * GitQuest Frontend - Submodule Topology Visualizer
 * SVG hierarchy map showing nested sub-repositories, remote URLs,
 * pointer commit pins, and synchronization health status.
 */

export class SubmoduleTopologyVisualizer {
  constructor(submodules = []) {
    this.submodules = submodules;
  }

  renderTopologySvg(width = 540, height = 240) {
    if (this.submodules.length === 0) {
      return `
        <div style="background:#090d16; padding:16px; border-radius:8px; border:1px solid #1e293b; color:#64748b; font-size:12px; text-align:center;">
          No nested submodules registered in .gitmodules.
        </div>
      `;
    }

    const rootX = 60;
    const rootY = height / 2;

    let subNodesSvg = '';
    let linksSvg = '';

    this.submodules.forEach((sub, idx) => {
      const ny = 40 + (idx * (height - 80) / Math.max(1, this.submodules.length - 1));
      const nx = width - 160;

      linksSvg += `<path d="M ${rootX + 60} ${rootY} C ${(rootX + nx) / 2} ${rootY}, ${(rootX + nx) / 2} ${ny}, ${nx} ${ny}" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3,3"/>`;

      subNodesSvg += `
        <g transform="translate(${nx}, ${ny - 18})">
          <rect width="140" height="36" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
          <text x="10" y="16" font-size="11" font-weight="bold" fill="#f8fafc">${sub.name || sub.prefix}</text>
          <text x="10" y="28" font-size="9" font-family="monospace" fill="#a78bfa">${sub.commitHash ? sub.commitHash.substring(0, 7) : 'HEAD'}</text>
        </g>
      `;
    });

    return `
      <div class="submodule-topology-container" style="background:#090d16; padding:14px; border-radius:10px; border:1px solid rgba(56,189,248,0.25);">
        <h4 style="margin:0 0 10px 0; color:#38bdf8; font-size:14px; font-family:Inter, sans-serif;">Submodule Hierarchy Topology</h4>
        <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}">
          ${linksSvg}
          <!-- Root Repository Node -->
          <g transform="translate(${rootX - 40}, ${rootY - 24})">
            <rect width="100" height="48" rx="8" fill="#1e1b4b" stroke="#818cf8" stroke-width="2"/>
            <text x="50" y="22" font-size="12" font-weight="bold" fill="#f8fafc" text-anchor="middle">Root Repo</text>
            <text x="50" y="36" font-size="9" fill="#94a3b8" text-anchor="middle">HEAD: main</text>
          </g>
          ${subNodesSvg}
        </svg>
      </div>
    `;
  }
}
