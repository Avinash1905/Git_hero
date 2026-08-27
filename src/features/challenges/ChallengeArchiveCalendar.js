/**
 * ChallengeArchiveCalendar
 * Archive browser enabling operatives to inspect and play past daily challenges.
 */

export class ChallengeArchiveCalendar {
  constructor() {
    this.daysCount = 14; // Past 14 days
  }

  /**
   * Generate calendar list of recent daily challenges
   */
  getRecentChallenges(completedDates = []) {
    const list = [];
    const today = new Date();

    for (let i = 0; i < this.daysCount; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const isCompleted = completedDates.includes(dateStr);
      const isToday = i === 0;

      list.push({
        date: dateStr,
        dayOfWeek: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayOfMonth: d.getDate(),
        month: d.toLocaleDateString('en-US', { month: 'short' }),
        isCompleted,
        isToday,
        rewardXp: isToday ? 500 : 250
      });
    }

    return list;
  }

  /**
   * Render HTML calendar cards
   */
  renderHtml(completedDates = [], onSelectDate = 'handleSelectChallengeDate') {
    const challenges = this.getRecentChallenges(completedDates);

    const cards = challenges.map(c => `
      <div 
        onclick="${onSelectDate}('${c.date}')"
        class="p-3.5 rounded-2xl border ${c.isToday ? 'border-primary bg-primary/10 ring-2 ring-primary/30' : c.isCompleted ? 'border-outline-variant/30 bg-surface-container-low' : 'border-outline-variant/15 bg-surface-container-lowest/40 hover:border-primary/40'} flex flex-col items-center justify-between text-center space-y-2 transition-all cursor-pointer"
      >
        <div class="space-y-0.5">
          <span class="text-[9px] uppercase font-mono text-on-surface-variant font-bold">${c.dayOfWeek}</span>
          <div class="font-mono text-lg font-bold ${c.isToday ? 'text-primary' : 'text-on-surface'}">${c.dayOfMonth}</div>
          <span class="text-[9px] font-mono text-on-surface-variant">${c.month}</span>
        </div>

        <div>
          ${c.isCompleted ? `
            <span class="material-symbols-outlined text-primary text-[18px]">verified</span>
          ` : `
            <span class="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary">
              +${c.rewardXp}
            </span>
          `}
        </div>
      </div>
    `).join('');

    return `
      <div class="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/20 space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-primary">calendar_month</span>
            <span class="text-xs font-mono font-bold text-on-surface uppercase tracking-wider">Challenge Calendar Archive</span>
          </div>
          <span class="text-[10px] font-mono text-on-surface-variant">Past 14 Days</span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          ${cards}
        </div>
      </div>
    `;
  }
}

export const challengeArchiveCalendar = new ChallengeArchiveCalendar();
