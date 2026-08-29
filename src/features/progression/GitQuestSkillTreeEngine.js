/**
 * GitQuest Frontend - Skill Tree & Mastery Progression Engine
 * Interactive discipline talent tree (Fundamentals, Branching, Merging,
 * Rebasing, Conflict Arbiter, Monorepo Architect), talent points, and node unlocks.
 */

export const SKILL_NODES = [
  { id: 'node_init', title: 'Repository Init', tier: 1, discipline: 'fundamentals', cost: 1, icon: '🌱', desc: 'Master git init and basic repository workspace layout.' },
  { id: 'node_commit', title: 'Atomic Commits', tier: 1, discipline: 'fundamentals', cost: 1, icon: '🌿', desc: 'Craft clean atomic commits with conventional headers.' },
  { id: 'node_branch', title: 'Branching Tactics', tier: 2, discipline: 'branching', cost: 2, icon: '🌳', desc: 'Create and navigate isolated feature branches.' },
  { id: 'node_merge_ff', title: 'Fast-Forward Ace', tier: 2, discipline: 'merging', cost: 2, icon: '⚡', desc: 'Execute linear fast-forward branch merges.' },
  { id: 'node_conflict', title: '3-Way Conflict Arbiter', tier: 3, discipline: 'conflicts', cost: 3, icon: '🛡️', desc: 'Resolve complex three-way merge conflict hunks.' },
  { id: 'node_rebase', title: 'Interactive Rebase', tier: 3, discipline: 'rebasing', cost: 3, icon: '🔬', desc: 'Squash, reword, and reorder commit DAG sequences.' },
  { id: 'node_sparse', title: 'Sparse Cone Architect', tier: 4, discipline: 'architecture', cost: 4, icon: '🏰', desc: 'Isolate package cones in 50GB monorepo workspaces.' },
  { id: 'node_godhead', title: 'Omnipotent Git Master', tier: 5, discipline: 'godhead', cost: 5, icon: '👑', desc: 'Supreme mastery over the entire Git universe.' }
];

export class GitQuestSkillTreeEngine {
  constructor(talentPoints = 5, unlockedNodeIds = ['node_init']) {
    this.talentPoints = talentPoints;
    this.unlockedNodeIds = new Set(unlockedNodeIds);
  }

  unlockNode(nodeId) {
    const node = SKILL_NODES.find(n => n.id === nodeId);
    if (!node) return { success: false, reason: 'Skill node not found' };
    if (this.unlockedNodeIds.has(nodeId)) return { success: false, reason: 'Node already unlocked' };
    if (this.talentPoints < node.cost) return { success: false, reason: 'Insufficient talent points' };

    this.talentPoints -= node.cost;
    this.unlockedNodeIds.add(nodeId);

    return {
      success: true,
      node,
      remainingTalentPoints: this.talentPoints
    };
  }

  renderSkillTreeHtml() {
    return `
      <div class="skill-tree-panel" style="background:#090d16; color:#e2e8f0; padding:20px; border-radius:12px; border:1px solid rgba(56,189,248,0.25); max-width:640px; font-family:Inter, sans-serif;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <div>
            <h4 style="margin:0; color:#38bdf8; font-size:16px;">🌲 Git Mastery Skill Tree</h4>
            <span style="font-size:11px; color:#94a3b8;">Invest talent points to master advanced Git skills</span>
          </div>
          <div style="background:#1e1b4b; padding:4px 10px; border-radius:6px; border:1px solid #6366f1; color:#a78bfa; font-weight:bold; font-size:12px;">
            ${this.talentPoints} Talent Points
          </div>
        </div>

        <div class="skill-nodes-grid" style="display:grid; grid-template-columns:repeat(2, 1fr); gap:10px;">
          ${SKILL_NODES.map(n => {
            const isUnlocked = this.unlockedNodeIds.has(n.id);
            return `
              <div style="background:#0f172a; border:1px solid ${isUnlocked ? '#10b981' : '#1e293b'}; padding:12px; border-radius:8px; display:flex; flex-direction:column; justify-content:space-between; opacity:${isUnlocked ? 1 : 0.7};">
                <div style="display:flex; gap:10px;">
                  <span style="font-size:22px;">${n.icon}</span>
                  <div>
                    <div style="font-weight:bold; font-size:13px; color:${isUnlocked ? '#34d399' : '#f8fafc'};">${n.title}</div>
                    <div style="font-size:11px; color:#94a3b8; margin-top:2px;">${n.desc}</div>
                  </div>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:10px; font-size:11px;">
                  <span style="color:#fcd34d;">Tier ${n.tier} • ${n.cost} TP</span>
                  ${isUnlocked
                    ? '<span style="color:#34d399; font-weight:bold;">✓ UNLOCKED</span>'
                    : `<button class="btn-unlock-skill" data-id="${n.id}" style="background:#0284c7; color:#fff; border:none; padding:3px 8px; border-radius:4px; font-size:10px; cursor:pointer;">Unlock</button>`}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }
}
