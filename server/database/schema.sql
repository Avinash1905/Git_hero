-- GitQuest Relational Database Schema (SQLite)

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_active INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS player_profiles (
  user_id TEXT PRIMARY KEY,
  avatar_url TEXT DEFAULT 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDud6okIV02jhmDlAPEHxgYXcDNc2q1nsOHBV3pwTdA_ggOX2dzSjnWA_qfp7oeCXrhLG7W3rDWPQ4NwC7RUAeywZ753egcw2iJitcVtN5DOJRewUcoo4pYrSG0YJ8cUUYVbJ3YzTX7ND9ZlBAw0QJUSZj-SnOk2PRX5n9209agFlczi_Sb3C2MCIe-0qHJlPtIFeLmWypXAd8L431J07JqHbYlHoDEANVtXYddeAxPurorUqmvW8',
  title TEXT DEFAULT 'Novice Contributor',
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  lives INTEGER DEFAULT 3,
  streak_days INTEGER DEFAULT 1,
  last_active_date TEXT DEFAULT CURRENT_DATE,
  command_usage_json TEXT DEFAULT '{}',
  settings_json TEXT DEFAULT '{"soundEffects":true,"backgroundMusic":true,"volume":70,"language":"English (US)","theme":"Terminal (Dark)"}',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS levels (
  id TEXT PRIMARY KEY,
  number INTEGER NOT NULL UNIQUE,
  name TEXT NOT NULL,
  world INTEGER NOT NULL,
  difficulty TEXT NOT NULL,
  xp_reward INTEGER NOT NULL DEFAULT 500,
  commits_req INTEGER NOT NULL DEFAULT 2,
  grid_size INTEGER NOT NULL DEFAULT 6,
  def_json TEXT NOT NULL,
  unlock_req_level_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_levels_world ON levels(world);
CREATE INDEX IF NOT EXISTS idx_levels_number ON levels(number);

CREATE TABLE IF NOT EXISTS level_progress (
  user_id TEXT NOT NULL,
  level_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('LOCKED', 'UNLOCKED', 'IN_PROGRESS', 'COMPLETED')),
  stars INTEGER DEFAULT 0,
  best_time_sec INTEGER DEFAULT 0,
  best_moves INTEGER DEFAULT 0,
  best_score INTEGER DEFAULT 0,
  commands_used INTEGER DEFAULT 0,
  hints_used INTEGER DEFAULT 0,
  completed_at DATETIME,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, level_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (level_id) REFERENCES levels(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_level_progress_user ON level_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_level_progress_status ON level_progress(user_id, status);

CREATE TABLE IF NOT EXISTS game_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  level_id TEXT NOT NULL,
  started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  ended_at DATETIME,
  status TEXT NOT NULL CHECK(status IN ('ACTIVE', 'COMPLETED', 'ABANDONED')),
  moves_count INTEGER DEFAULT 0,
  commands_count INTEGER DEFAULT 0,
  push_count INTEGER DEFAULT 0,
  pull_count INTEGER DEFAULT 0,
  history_json TEXT DEFAULT '[]',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (level_id) REFERENCES levels(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_game_sessions_user_active ON game_sessions(user_id, status);

CREATE TABLE IF NOT EXISTS achievements (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  xp_reward INTEGER NOT NULL DEFAULT 100,
  max_progress INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS player_achievements (
  user_id TEXT NOT NULL,
  achievement_id TEXT NOT NULL,
  unlocked INTEGER DEFAULT 0,
  progress INTEGER DEFAULT 0,
  unlocked_at DATETIME,
  PRIMARY KEY (user_id, achievement_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS xp_events (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  source_type TEXT NOT NULL,
  source_id TEXT,
  xp_amount INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_xp_events_user ON xp_events(user_id);

CREATE TABLE IF NOT EXISTS daily_challenges (
  challenge_date TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  reward_xp INTEGER NOT NULL DEFAULT 500,
  grid_size TEXT NOT NULL DEFAULT '8x8',
  config_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS daily_challenge_progress (
  user_id TEXT NOT NULL,
  challenge_date TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('IN_PROGRESS', 'COMPLETED')),
  completed_at DATETIME,
  PRIMARY KEY (user_id, challenge_date),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (challenge_date) REFERENCES daily_challenges(challenge_date) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token_hash TEXT NOT NULL,
  expires_at DATETIME NOT NULL,
  used INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
