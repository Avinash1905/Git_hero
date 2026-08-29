/**
 * GitQuest Frontend - Daily Challenge Calendar
 * Procedural daily challenge generation, streak tracker,
 * reward multiplier calculator, and daily calendar UI view.
 */

export class DailyChallengeCalendar {
  constructor(currentStreak = 0, completedDates = []) {
    this.currentStreak = currentStreak;
    this.completedDates = new Set(completedDates);
  }

  getTodayDateString() {
    return new Date().toISOString().split('T')[0];
  }

  generateDailyChallenge(dateStr = this.getTodayDateString()) {
    // Deterministic pseudo-random seed from date string
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
      hash = (hash << 5) - hash + dateStr.charCodeAt(i);
      hash |= 0;
    }
    const seed = Math.abs(hash);

    const levelPool = ['01', '03', '07', '12', '18', '24', '35', '50', '75', '100', '150', '200', '250', '275'];
    const modifiers = [
      { id: 'par_moves', name: 'Move Par Restriction', desc: 'Solve in under 15 moves', xpMultiplier: 1.5 },
      { id: 'no_undo', name: 'Ironman Mode', desc: 'No undo allowed during attempt', xpMultiplier: 2.0 },
      { id: 'speed_trial', name: 'Speed Trial', desc: 'Solve within 60 seconds', xpMultiplier: 1.8 },
      { id: 'pull_only', name: 'Magnetized', desc: 'Only pull commands permitted', xpMultiplier: 2.2 }
    ];

    const targetLevel = levelPool[seed % levelPool.length];
    const modifier = modifiers[seed % modifiers.length];
    const baseReward = 500 + (seed % 500);

    return {
      date: dateStr,
      levelId: targetLevel,
      title: `Daily Quest: Protocol ${dateStr}`,
      modifier,
      baseReward,
      totalReward: Math.round(baseReward * modifier.xpMultiplier),
      isCompletedToday: this.completedDates.has(dateStr)
    };
  }

  recordDailyCompletion(dateStr = this.getTodayDateString()) {
    if (!this.completedDates.has(dateStr)) {
      this.completedDates.add(dateStr);
      this.currentStreak++;
      return {
        success: true,
        newStreak: this.currentStreak,
        streakBonusXp: this.currentStreak * 100
      };
    }
    return { success: false, reason: 'Already completed today' };
  }

  renderCalendarHtml(year = 2026, month = 7) {
    const challenge = this.generateDailyChallenge();
    const daysInMonth = 31;

    let daysHtml = '';
    for (let d = 1; d <= daysInMonth; d++) {
      const dateKey = `2026-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isDone = this.completedDates.has(dateKey);
      const isToday = dateKey === this.getTodayDateString();

      daysHtml += `
        <div class="cal-day ${isToday ? 'today' : ''} ${isDone ? 'done' : ''}" style="width:36px; height:36px; display:flex; align-items:center; justify-content:center; border-radius:6px; font-size:12px; font-weight:600; background:${isDone ? '#065f46' : (isToday ? '#1e293b' : '#090d16')}; border:1px solid ${isToday ? '#38bdf8' : 'rgba(255,255,255,0.08)'}; color:${isDone ? '#34d399' : '#cbd5e1'};">
          ${d}
        </div>
      `;
    }

    return `
      <div class="daily-challenge-panel" style="background:#090d16; color:#e2e8f0; padding:20px; border-radius:12px; border:1px solid rgba(56,189,248,0.3); max-width:600px; font-family:Inter, sans-serif;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <div>
            <h3 style="margin:0; font-size:18px; color:#f59e0b;">🔥 Daily Challenge & Streak</h3>
            <p style="margin:4px 0 0 0; font-size:12px; color:#94a3b8;">Solve daily modifier trials to maximize XP streak multipliers.</p>
          </div>
          <div style="background:#1e1b4b; padding:6px 12px; border-radius:6px; border:1px solid #6366f1; text-align:center;">
            <div style="font-size:16px; font-weight:bold; color:#a78bfa;">${this.currentStreak} Days</div>
            <div style="font-size:10px; color:#c7d2fe;">CURRENT STREAK</div>
          </div>
        </div>

        <div class="today-card" style="background:#0f172a; border-left:4px solid #f59e0b; padding:12px; border-radius:6px; margin-bottom:16px;">
          <div style="font-weight:bold; font-size:14px; color:#f8fafc;">${challenge.title} (Level ${challenge.levelId})</div>
          <div style="font-size:12px; color:#fcd34d; margin:4px 0;">⚡ Modifier: ${challenge.modifier.name} — ${challenge.modifier.desc}</div>
          <div style="font-size:11px; color:#34d399;">Reward: +${challenge.totalReward} XP (${challenge.modifier.xpMultiplier}x Multiplier)</div>
        </div>

        <div style="display:grid; grid-template-columns:repeat(7, 1fr); gap:6px; margin-top:12px;">
          ${daysHtml}
        </div>
      </div>
    `;
  }
}
