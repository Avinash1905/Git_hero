// Database Seeder: Seeds all 250 levels, default achievements, and daily challenge
import { db } from './db.js';
import { ALL_LEVELS } from '../../js/engine/levels/LevelRegistry.js';

export const DEFAULT_ACHIEVEMENTS = [
  {
    id: 'first_commit',
    code: 'FIRST_COMMIT',
    title: 'FIRST COMMIT',
    description: 'Complete your first level.',
    icon: 'emoji_events',
    xp_reward: 100,
    max_progress: 1
  },
  {
    id: 'push_master',
    code: 'PUSH_MASTER',
    title: 'PUSH MASTER',
    description: 'Complete a level using only push commands.',
    icon: 'upload',
    xp_reward: 250,
    max_progress: 1
  },
  {
    id: 'status_check',
    code: 'STATUS_CHECK',
    title: 'STATUS CHECK',
    description: 'Use git status 10 times across levels.',
    icon: 'find_in_page',
    xp_reward: 150,
    max_progress: 10
  },
  {
    id: 'pull_master',
    code: 'PULL_MASTER',
    title: 'PULL MASTER',
    description: 'Successfully execute 15 directional pulls.',
    icon: 'download',
    xp_reward: 300,
    max_progress: 15
  },
  {
    id: 'branch_weaver',
    code: 'BRANCH_WEAVER',
    title: 'BRANCH WEAVER',
    description: 'Complete 10 levels across World 2 and beyond.',
    icon: 'alt_route',
    xp_reward: 400,
    max_progress: 10
  },
  {
    id: 'speed_demon',
    code: 'SPEED_DEMON',
    title: 'SPEED DEMON',
    description: 'Complete any level in under 60 seconds.',
    icon: 'speed',
    xp_reward: 500,
    max_progress: 1
  },
  {
    id: 'grandmaster',
    code: 'GRANDMASTER',
    title: 'GIT GRANDMASTER',
    description: 'Reach 20,000 XP and master repositories.',
    icon: 'military_tech',
    xp_reward: 1000,
    max_progress: 20000
  }
];

export function seedLevels() {
  const insertLevelStmt = db.db.prepare(`
    INSERT INTO levels (id, number, name, world, difficulty, xp_reward, commits_req, grid_size, def_json, unlock_req_level_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      number = excluded.number,
      name = excluded.name,
      world = excluded.world,
      difficulty = excluded.difficulty,
      xp_reward = excluded.xp_reward,
      commits_req = excluded.commits_req,
      grid_size = excluded.grid_size,
      def_json = excluded.def_json,
      unlock_req_level_id = excluded.unlock_req_level_id
  `);

  db.transaction(() => {
    // Sort levels strictly numerically
    const sortedEntries = Object.entries(ALL_LEVELS).sort((a, b) => {
      const numA = parseInt(a[0], 10) || 0;
      const numB = parseInt(b[0], 10) || 0;
      return numA - numB;
    });

    for (let i = 0; i < sortedEntries.length; i++) {
      const [id, rawDef] = sortedEntries[i];
      const num = parseInt(id, 10) || (i + 1);
      const prevId = num > 1 ? String(num - 1).padStart(2, '0') : null;

      insertLevelStmt.run(
        String(id).padStart(2, '0'),
        num,
        rawDef.name || `Level ${id}`,
        rawDef.world || Math.ceil(num / 13) || 1,
        rawDef.difficulty || 'MEDIUM',
        rawDef.xpReward || 500,
        rawDef.commitsReq || 2,
        rawDef.gridSize || 6,
        JSON.stringify(rawDef),
        prevId
      );
    }
  });

  console.log(`[Seed] Seeded ${Object.keys(ALL_LEVELS).length} levels into database.`);
}

export function seedAchievements() {
  const insertAchStmt = db.db.prepare(`
    INSERT INTO achievements (id, code, title, description, icon, xp_reward, max_progress)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      code = excluded.code,
      title = excluded.title,
      description = excluded.description,
      icon = excluded.icon,
      xp_reward = excluded.xp_reward,
      max_progress = excluded.max_progress
  `);

  db.transaction(() => {
    for (const ach of DEFAULT_ACHIEVEMENTS) {
      insertAchStmt.run(
        ach.id,
        ach.code,
        ach.title,
        ach.description,
        ach.icon,
        ach.xp_reward,
        ach.max_progress
      );
    }
  });

  console.log(`[Seed] Seeded ${DEFAULT_ACHIEVEMENTS.length} achievements into database.`);
}

export function seedDailyChallenge() {
  const today = new Date().toISOString().split('T')[0];
  const challenge = {
    challenge_date: today,
    title: 'Memory Leak Substation',
    description: 'A severe memory leak has been detected in the core module. Navigate the fragmented memory grid to isolate and terminate the rogue processes before system failure.',
    difficulty: 'HARD',
    reward_xp: 1000,
    grid_size: '8x8',
    config_json: JSON.stringify({
      gridSize: 8,
      player: { x: 1, y: 1 },
      box: { x: 3, y: 3 },
      goal: { x: 6, y: 6 },
      walls: [{ x: 2, y: 2 }, { x: 5, y: 5 }, { x: 2, y: 5 }],
      hazards: [{ x: 3, y: 4 }, { x: 4, y: 3 }]
    })
  };

  db.run(`
    INSERT INTO daily_challenges (challenge_date, title, description, difficulty, reward_xp, grid_size, config_json)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(challenge_date) DO UPDATE SET
      title = excluded.title,
      description = excluded.description,
      difficulty = excluded.difficulty,
      reward_xp = excluded.reward_xp,
      grid_size = excluded.grid_size,
      config_json = excluded.config_json
  `, [
    challenge.challenge_date,
    challenge.title,
    challenge.description,
    challenge.difficulty,
    challenge.reward_xp,
    challenge.grid_size,
    challenge.config_json
  ]);

  console.log(`[Seed] Seeded Daily Challenge for ${today}.`);
}

export function seedAll() {
  seedLevels();
  seedAchievements();
  seedDailyChallenge();
}

// Auto-run if executed directly
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seedAll();
}
