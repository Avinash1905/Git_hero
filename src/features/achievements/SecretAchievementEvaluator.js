/**
 * SecretAchievementEvaluator
 * Evaluates hidden triggers, secret easter eggs, and edge-case player behaviors
 * to award rare and legendary hidden achievements.
 */

export class SecretAchievementEvaluator {
  constructor() {
    this.secretTriggers = [
      {
        id: 'secret_konami',
        name: 'Retro Cheater',
        desc: 'Entered the classic Konami code in the game canvas.',
        icon: 'sports_esports',
        xp: 250,
        evaluator: (event) => event.type === 'KONAMI_CODE_ENTERED'
      },
      {
        id: 'secret_reflog_rescue',
        name: 'Void Resurrector',
        desc: 'Used git reflog to recover a commit after executing git reset --hard.',
        icon: 'auto_fix_high',
        xp: 300,
        evaluator: (event, playerState) => event.type === 'COMMAND_EXECUTED' && event.command === 'git reflog' && playerState.didHardReset
      },
      {
        id: 'secret_zero_push_pull_only',
        name: 'Magnetic Master',
        desc: 'Completed a sector using only directional pull mechanics and zero pushes.',
        icon: 'attractions',
        xp: 350,
        evaluator: (event) => event.type === 'LEVEL_COMPLETED' && event.pushCount === 0 && event.pullCount > 5
      },
      {
        id: 'secret_night_owl',
        name: 'Midnight Committer',
        desc: 'Completed a sector between 2:00 AM and 4:00 AM local time.',
        icon: 'bedtime',
        xp: 200,
        evaluator: (event) => {
          if (event.type !== 'LEVEL_COMPLETED') return false;
          const hour = new Date().getHours();
          return hour >= 2 && hour < 4;
        }
      }
    ];
  }

  /**
   * Evaluate all secret triggers against an incoming game event
   */
  evaluateEvent(event = {}, playerState = {}, alreadyUnlocked = []) {
    const newlyAwarded = [];

    for (const secret of this.secretTriggers) {
      if (alreadyUnlocked.includes(secret.id)) continue;

      try {
        if (secret.evaluator(event, playerState)) {
          newlyAwarded.push(secret);
        }
      } catch (err) {
        console.warn(`[SecretEvaluator] Failed evaluating ${secret.id}:`, err);
      }
    }

    return newlyAwarded;
  }
}

export const secretAchievementEvaluator = new SecretAchievementEvaluator();
