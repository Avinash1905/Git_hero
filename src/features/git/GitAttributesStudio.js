/**
 * GitQuest Frontend - Git Attributes Studio
 * Visual editor for .gitattributes configuration, custom merge driver assigner,
 * LFS filter bindings, and EOL line-ending normalization rules.
 */

export class GitAttributesStudio {
  constructor(mergeDriver) {
    this.driver = mergeDriver;
  }

  renderStudioHtml() {
    const rules = this.driver.rules;

    return `
      <div class="git-attributes-panel" style="background:#090d16; color:#e2e8f0; padding:18px; border-radius:10px; border:1px solid rgba(56,189,248,0.25); max-width:580px; font-family:Inter, sans-serif;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div>
            <h4 style="margin:0; color:#38bdf8; font-size:15px;">📜 .gitattributes & Merge Drivers</h4>
            <span style="font-size:11px; color:#94a3b8;">Path attributes, EOL filters, and custom merge logic</span>
          </div>
          <button class="btn-add-rule" style="background:#0284c7; color:#fff; border:none; padding:4px 10px; border-radius:4px; font-size:11px; font-weight:bold; cursor:pointer;">+ Add Rule</button>
        </div>

        <div class="rules-list" style="display:flex; flex-direction:column; gap:6px; font-family:monospace; font-size:11px;">
          ${rules.map(r => `
            <div style="background:#0f172a; border:1px solid #1e293b; padding:8px 12px; border-radius:6px; display:flex; justify-content:space-between; align-items:center;">
              <span style="color:#fcd34d; font-weight:bold;">${r.pattern}</span>
              <div style="display:flex; gap:6px;">
                ${Object.entries(r.attributes).map(([k, v]) => `
                  <span style="background:rgba(56,189,248,0.1); color:#38bdf8; padding:2px 6px; border-radius:3px; font-size:10px;">${k}=${v}</span>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}
