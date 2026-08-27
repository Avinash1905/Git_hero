// GitHero Export & Data Portability Service
// Handles client-side exporting of player profiles, solution replays, and level DAG diagrams.

export class ExportService {
  /**
   * Export player profile and achievements to a JSON download
   * @param {Object} profile 
   * @param {Object} progress 
   * @param {Array} achievements 
   */
  static exportPlayerData(profile, progress, achievements) {
    const payload = {
      app: 'GitHero',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      profile,
      progress,
      achievements
    };

    this.triggerDownload(
      `githero-profile-${profile?.username || 'player'}-${Date.now()}.json`,
      JSON.stringify(payload, null, 2),
      'application/json'
    );
  }

  /**
   * Export level replay solution
   * @param {string} levelId 
   * @param {Array} history 
   * @param {Object} stats 
   */
  static exportSolutionReplay(levelId, history, stats) {
    const payload = {
      levelId,
      exportedAt: new Date().toISOString(),
      stats,
      history
    };

    this.triggerDownload(
      `githero-level-${levelId}-solution.json`,
      JSON.stringify(payload, null, 2),
      'application/json'
    );
  }

  /**
   * Helper to trigger native browser file download
   * @param {string} filename 
   * @param {string} content 
   * @param {string} mimeType 
   */
  static triggerDownload(filename, content, mimeType = 'text/plain') {
    if (typeof document === 'undefined') return;

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// Global Singleton
export const exportService = ExportService;
