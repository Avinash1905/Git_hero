/**
 * DuelMatchmaker
 * Ghost duel matchmaker that pairs operatives with simulated community ghost runs
 * across different skill division tiers.
 */

export class DuelMatchmaker {
  constructor() {
    this.botOpponents = [
      { id: 'bot_cadet', username: 'Operative_Echo', tier: 'Recruit', skillMultiplier: 1.4, avatar: 'terminal_ghost' },
      { id: 'bot_hacker', username: 'BranchViper', tier: 'Contributor', skillMultiplier: 1.15, avatar: 'branch_ninja' },
      { id: 'bot_maintainer', username: 'KernelPhantom', tier: 'Maintainer', skillMultiplier: 1.0, avatar: 'quantum_coder' },
      { id: 'bot_speedrun', username: 'GitGod_Linus', tier: 'Grandmaster', skillMultiplier: 0.85, avatar: 'kernel_overlord' }
    ];
  }

  /**
   * Find opponent for a level matching player skill tier
   */
  findMatch(levelId = '01', playerXp = 0) {
    let opponent = this.botOpponents[0];
    if (playerXp >= 15000) {
      opponent = this.botOpponents[3];
    } else if (playerXp >= 5000) {
      opponent = this.botOpponents[2];
    } else if (playerXp >= 1000) {
      opponent = this.botOpponents[1];
    }

    const baselineParTime = 40;
    const simulatedGhostTime = Math.round(baselineParTime * opponent.skillMultiplier * 10) / 10;
    const simulatedGhostMoves = Math.round(18 * opponent.skillMultiplier);

    return {
      levelId,
      opponent,
      ghostRun: {
        username: opponent.username,
        tier: opponent.tier,
        avatar: opponent.avatar,
        durationSeconds: simulatedGhostTime,
        moves: simulatedGhostMoves
      }
    };
  }
}

export const duelMatchmaker = new DuelMatchmaker();
