// Server-authoritative scoring, XP, and rank calculations

export class ScoringService {
  static calculateStars(moves, commitsReq = 2) {
    if (moves <= commitsReq * 4) return 3;
    if (moves <= commitsReq * 8) return 2;
    return 1;
  }

  static calculateScore(baseScore = 10000, moves = 10, commitsReq = 2, timeSeconds = 30) {
    const parMoves = commitsReq * 4;
    const movePenalty = Math.max(0, (moves - parMoves) * 50);
    const timePenalty = Math.max(0, (timeSeconds - 30) * 10);
    return Math.max(1000, baseScore - movePenalty - timePenalty);
  }

  static calculatePlayerLevel(xp = 0) {
    return Math.max(1, Math.floor(Math.sqrt(xp / 250)) + 1);
  }

  static getTitleForXP(xp = 0) {
    if (xp >= 50000) return 'Git Omnipotent Godhead';
    if (xp >= 30000) return 'Git Supreme Architect';
    if (xp >= 20000) return 'Git Grandmaster';
    if (xp >= 15000) return 'Principal Maintainer';
    if (xp >= 10000) return 'Staff Committer';
    if (xp >= 5000) return 'Senior Rebaser';
    if (xp >= 2500) return 'Branch Specialist';
    if (xp >= 1000) return 'Active Contributor';
    return 'Novice Contributor';
  }
}
