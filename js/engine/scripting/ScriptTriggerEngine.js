/**
 * GitQuest Engine - Script Trigger & Narrative Dialogue Engine
 * Event-driven trigger volume system and non-blocking in-game story dialogue sequences.
 */

export class ScriptTrigger {
  constructor(id, bounds, onEnter = null, isOneShot = true) {
    this.id = id;
    this.bounds = bounds;
    this.onEnter = onEnter;
    this.isOneShot = isOneShot;
    this.isTriggered = false;
  }

  evaluate(playerX, playerY, context = {}) {
    if (this.isTriggered && this.isOneShot) return false;

    if (
      playerX >= this.bounds.minX &&
      playerX <= this.bounds.maxX &&
      playerY >= this.bounds.minY &&
      playerY <= this.bounds.maxY
    ) {
      this.isTriggered = true;
      if (this.onEnter) {
        this.onEnter(context);
      }
      return true;
    }
    return false;
  }
}

export class DialogueLine {
  constructor(speaker, text, durationMs = 3000) {
    this.speaker = speaker;
    this.text = text;
    this.durationMs = durationMs;
  }
}

export class DialogueAndCutsceneEngine {
  constructor() {
    this.activeSequence = [];
    this.currentIndex = 0;
    this.isPlaying = false;
    this.onDialogueChange = null;
  }

  playSequence(dialogueLines = [], onComplete = null) {
    this.activeSequence = dialogueLines;
    this.currentIndex = 0;
    this.isPlaying = true;
    this.onComplete = onComplete;
    this._showCurrent();
  }

  _showCurrent() {
    if (this.currentIndex >= this.activeSequence.length) {
      this.isPlaying = false;
      if (this.onComplete) this.onComplete();
      return;
    }

    const line = this.activeSequence[this.currentIndex];
    if (this.onDialogueChange) {
      this.onDialogueChange(line);
    }
  }

  advance() {
    if (!this.isPlaying) return;
    this.currentIndex++;
    this._showCurrent();
  }
}
