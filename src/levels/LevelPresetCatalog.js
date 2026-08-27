/**
 * LevelPresetCatalog
 * Rich environmental definitions, hazard configurations, and visual themes
 * for all 20 GitHero worlds and special anomaly sectors.
 */

export const LEVEL_PRESETS = {
  worldThemes: {
    1: { name: 'Terminal Foundations', bg: '#0b1120', floor: '#1e293b', grid: 'rgba(0,255,204,0.06)', glow: '#00ffcc' },
    2: { name: 'Branch Valley', bg: '#082f49', floor: '#0c4a6e', grid: 'rgba(56,189,248,0.06)', glow: '#38bdf8' },
    3: { name: 'Merge Peaks', bg: '#2e1065', floor: '#3b0764', grid: 'rgba(168,85,247,0.06)', glow: '#a855f7' },
    4: { name: 'Rebase Wasteland', bg: '#451a03', floor: '#78350f', grid: 'rgba(245,158,11,0.06)', glow: '#f59e0b' },
    5: { name: 'Kernel Core', bg: '#4c0519', floor: '#881337', grid: 'rgba(244,63,94,0.06)', glow: '#f43f5e' },
    6: { name: 'Stash Sanctuary', bg: '#042f2e', floor: '#134e4a', grid: 'rgba(20,184,166,0.06)', glow: '#14b8a6' },
    7: { name: 'Cherry-Pick Orchard', bg: '#4c0519', floor: '#9f1239', grid: 'rgba(225,29,72,0.06)', glow: '#e11d48' },
    8: { name: 'Reset Abyss', bg: '#0f172a', floor: '#1e293b', grid: 'rgba(234,88,12,0.06)', glow: '#ea580c' },
    9: { name: 'Reflog Nether', bg: '#1e1b4b', floor: '#312e81', grid: 'rgba(129,140,248,0.06)', glow: '#818cf8' },
    10: { name: 'Conflict Coliseum', bg: '#3b0764', floor: '#581c87', grid: 'rgba(217,70,239,0.06)', glow: '#d946ef' },
    11: { name: 'Plumbing Depths', bg: '#022c22', floor: '#064e3b', grid: 'rgba(52,211,153,0.06)', glow: '#34d399' },
    12: { name: 'Submodule Archipelago', bg: '#064e3b', floor: '#047857', grid: 'rgba(16,185,129,0.06)', glow: '#10b981' },
    13: { name: 'Worktree Labyrinth', bg: '#14532d', floor: '#166534', grid: 'rgba(132,204,22,0.06)', glow: '#84cc16' },
    14: { name: 'Bisect Observatory', bg: '#1e1b4b', floor: '#3730a3', grid: 'rgba(99,102,241,0.06)', glow: '#6366f1' },
    15: { name: 'Remote Nebula', bg: '#082f49', floor: '#0369a1', grid: 'rgba(14,165,233,0.06)', glow: '#0ea5e9' },
    16: { name: 'Hook Foundry', bg: '#422006', floor: '#713f12', grid: 'rgba(234,179,8,0.06)', glow: '#eab308' },
    17: { name: 'Sparse-Checkout Enclave', bg: '#4a044e', floor: '#701a75', grid: 'rgba(217,70,239,0.06)', glow: '#d946ef' },
    18: { name: 'Rerere Matrix', bg: '#500724', floor: '#831843', grid: 'rgba(244,114,182,0.06)', glow: '#f472b6' },
    19: { name: 'Subtree Dominion', bg: '#172554', floor: '#1e40af', grid: 'rgba(96,165,250,0.06)', glow: '#60a5fa' },
    20: { name: 'Git Singularity', bg: '#09090b', floor: '#18181b', grid: 'rgba(250,204,21,0.08)', glow: '#facc15' }
  },

  hazards: {
    LASER_EMITTER: { type: 'laser', damage: 'lethal', blockableByBox: true, color: '#f43f5e' },
    BRANCH_GATE: { type: 'gate', requirement: 'matching_branch_ref', color: '#38bdf8' },
    QUANTUM_PORTAL: { type: 'portal', bidirectional: true, color: '#a855f7' },
    DIRTY_WORKING_TREE: { type: 'trap', requiresStash: true, color: '#14b8a6' }
  }
};

export class LevelPresetCatalog {
  getWorldTheme(worldId = 1) {
    return LEVEL_PRESETS.worldThemes[worldId] || LEVEL_PRESETS.worldThemes[1];
  }

  getHazardConfig(hazardType) {
    return LEVEL_PRESETS.hazards[hazardType] || null;
  }
}

export const levelPresetCatalog = new LevelPresetCatalog();
