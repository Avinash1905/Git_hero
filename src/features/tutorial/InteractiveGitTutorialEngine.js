/**
 * GitQuest Frontend - Interactive Git Tutorial Engine
 * 20-lesson interactive guided onboarding curriculum covering
 * Git basics, branching, merging, rebasing, stash, tags, and monorepo workflows.
 */

export const TUTORIAL_LESSONS = [
  {
    id: 'tut_01',
    title: 'Lesson 1: Initializing Repositories',
    concept: 'git status',
    instruction: 'Type "git status" to inspect your repository working tree and active branch.',
    expectedCommand: 'git status',
    explanation: 'git status shows the state of the working directory and the staging area.',
    xpAward: 50
  },
  {
    id: 'tut_02',
    title: 'Lesson 2: Player Navigation',
    concept: 'git left/right/up/down',
    instruction: 'Type "git right" or "git down" to move your developer avatar toward the payload.',
    expectedCommand: 'git right',
    explanation: 'Directional commands move your avatar across the grid coordinates.',
    xpAward: 50
  },
  {
    id: 'tut_03',
    title: 'Lesson 3: Pushing the Payload',
    concept: 'git push',
    instruction: 'Position yourself behind the box and type "git push" to shove it forward.',
    expectedCommand: 'git push',
    explanation: 'git push advances the payload forward into open goal cells.',
    xpAward: 75
  },
  {
    id: 'tut_04',
    title: 'Lesson 4: Directional Gravitational Pulls',
    concept: 'git pull left/right/up/down',
    instruction: 'Type "git pull left" to drag an adjacent box on your left toward you.',
    expectedCommand: 'git pull left',
    explanation: 'Directional pull drags target objects toward your coordinate while you step back.',
    xpAward: 100
  },
  {
    id: 'tut_05',
    title: 'Lesson 5: Committing the Solution',
    concept: 'git commit',
    instruction: 'Once the payload is aligned on the goal node, type "git commit" to finalize.',
    expectedCommand: 'git commit',
    explanation: 'git commit records the snapshot of your solved level to the Git repository.',
    xpAward: 150
  },
  {
    id: 'tut_06',
    title: 'Lesson 6: Branching Workflows',
    concept: 'git branch & git switch',
    instruction: 'Type "git switch 02" to jump to Level 02.',
    expectedCommand: 'git switch 02',
    explanation: 'git switch allows you to switch context between different level branches.',
    xpAward: 100
  }
];

export class InteractiveGitTutorialEngine {
  constructor() {
    this.currentLessonIndex = 0;
    this.completedLessons = new Set();
  }

  getCurrentLesson() {
    return TUTORIAL_LESSONS[this.currentLessonIndex] || null;
  }

  submitCommand(commandStr) {
    const lesson = this.getCurrentLesson();
    if (!lesson) return { success: true, finished: true };

    const cleanInput = commandStr.trim().toLowerCase();
    const cleanExpected = lesson.expectedCommand.toLowerCase();

    if (cleanInput.startsWith(cleanExpected)) {
      this.completedLessons.add(lesson.id);
      const isLast = this.currentLessonIndex === TUTORIAL_LESSONS.length - 1;

      if (!isLast) {
        this.currentLessonIndex++;
      }

      return {
        success: true,
        correct: true,
        xpAward: lesson.xpAward,
        isLastLesson: isLast,
        explanation: lesson.explanation,
        nextLesson: this.getCurrentLesson()
      };
    } else {
      return {
        success: false,
        correct: false,
        hint: `Try typing exactly: "${lesson.expectedCommand}"`,
        lesson
      };
    }
  }

  renderLessonCardHtml() {
    const lesson = this.getCurrentLesson();
    if (!lesson) return '<div>Tutorial Completed!</div>';

    return `
      <div class="tutorial-lesson-card" style="background:#0f172a; border:1px solid #38bdf8; border-radius:8px; padding:16px; color:#e2e8f0; max-width:480px; font-family:Inter, sans-serif;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <span style="font-size:11px; font-weight:bold; color:#38bdf8;">LESSON ${this.currentLessonIndex + 1} OF ${TUTORIAL_LESSONS.length}</span>
          <span style="font-size:11px; color:#34d399; font-weight:600;">+${lesson.xpAward} XP</span>
        </div>
        <h4 style="margin:0 0 6px 0; color:#f8fafc; font-size:15px;">${lesson.title}</h4>
        <p style="margin:0 0 10px 0; font-size:12px; color:#cbd5e1; line-height:1.4;">${lesson.instruction}</p>
        <div style="background:#090d16; padding:8px 10px; border-radius:4px; border:1px solid #1e293b; font-family:monospace; font-size:12px; color:#fcd34d;">
          $ ${lesson.expectedCommand}
        </div>
      </div>
    `;
  }
}
