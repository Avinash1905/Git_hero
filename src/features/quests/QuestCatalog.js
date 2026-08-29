/**
 * QuestCatalog
 * Defines daily and weekly mission templates, requirements, and XP bounties.
 */

export const DAILY_QUEST_TEMPLATES = Object.freeze([
  {
    id: 'daily-push-master',
    title: 'Precision Pusher',
    description: 'Stage repository box and execute 3 successful git push deliveries.',
    type: 'push_count',
    target: 3,
    rewardXp: 300,
    icon: 'upload'
  },
  {
    id: 'daily-fast-clear',
    title: 'High Velocity Contributor',
    description: 'Clear any sector in fewer than 45 seconds.',
    type: 'speed_clear',
    target: 45,
    rewardXp: 450,
    icon: 'timer'
  },
  {
    id: 'daily-flawless',
    title: 'Zero Reversion',
    description: 'Complete 2 sectors consecutively without using undo (Ctrl+Z).',
    type: 'no_undo',
    target: 2,
    rewardXp: 500,
    icon: 'task_alt'
  }
]);

export const WEEKLY_QUEST_TEMPLATES = Object.freeze([
  {
    id: 'weekly-world-pioneer',
    title: 'Sector Pioneer',
    description: 'Master 10 distinct sectors across any world.',
    type: 'complete_levels',
    target: 10,
    rewardXp: 2000,
    icon: 'explore'
  },
  {
    id: 'weekly-streak-guardian',
    title: 'Cadence Architect',
    description: 'Maintain an uninterrupted activity streak for 5 days.',
    type: 'streak',
    target: 5,
    rewardXp: 2500,
    icon: 'local_fire_department'
  }
]);
