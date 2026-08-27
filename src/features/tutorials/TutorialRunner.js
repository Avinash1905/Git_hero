/**
 * TutorialRunner
 * Evaluates developer terminal input against tutorial step objectives.
 */

import { TUTORIAL_CATALOG } from './TutorialCatalog.js';

export class TutorialRunner {
  constructor(tutorialId = 'tut-01-foundations') {
    this.tutorial = TUTORIAL_CATALOG.find(t => t.id === tutorialId) || TUTORIAL_CATALOG[0];
    this.currentStepIndex = 0;
    this.isCompleted = false;
    this.attempts = 0;
  }

  loadTutorial(tutorialId) {
    const found = TUTORIAL_CATALOG.find(t => t.id === tutorialId);
    if (found) {
      this.tutorial = found;
      this.currentStepIndex = 0;
      this.isCompleted = false;
      this.attempts = 0;
      return true;
    }
    return false;
  }

  getCurrentStep() {
    return this.tutorial.steps[this.currentStepIndex] || null;
  }

  /**
   * Submit command attempt for the active step
   * @param {string} command
   * @returns {{success: boolean, message: string, explanation?: string, completedTutorial?: boolean}}
   */
  evaluateCommand(command) {
    const step = this.getCurrentStep();
    if (!step) {
      return { success: false, message: 'Tutorial already completed!' };
    }

    this.attempts++;
    const trimmedInput = String(command || '').trim().toLowerCase();
    const expected = step.expectedCommand.trim().toLowerCase();

    // Check match
    const isMatch = trimmedInput === expected || (expected.startsWith('git push') && trimmedInput.startsWith('git push'));

    if (isMatch) {
      const explanation = step.explanation;
      this.currentStepIndex++;

      if (this.currentStepIndex >= this.tutorial.steps.length) {
        this.isCompleted = true;
        return {
          success: true,
          message: 'Excellent! Step objective accomplished.',
          explanation,
          completedTutorial: true
        };
      }

      return {
        success: true,
        message: 'Step objective accomplished! Proceeding to next step.',
        explanation,
        completedTutorial: false
      };
    }

    return {
      success: false,
      message: `Command "${command}" does not satisfy objective. Hint: ${step.hint}`
    };
  }

  getProgressPercentage() {
    if (this.tutorial.steps.length === 0) return 100;
    return Math.round((this.currentStepIndex / this.tutorial.steps.length) * 100);
  }
}
