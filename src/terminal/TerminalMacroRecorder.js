/**
 * TerminalMacroRecorder
 * Record and playback multi-step command sequences / aliases.
 */

export class TerminalMacroRecorder {
  constructor() {
    this.isRecording = false;
    this.recordedCommands = [];
    this.savedMacros = {};
  }

  startRecording() {
    this.isRecording = true;
    this.recordedCommands = [];
  }

  recordCommand(cmd) {
    if (!this.isRecording) return;
    this.recordedCommands.push(cmd);
  }

  stopRecording(macroName = 'default') {
    this.isRecording = false;
    this.savedMacros[macroName] = [...this.recordedCommands];
    return this.savedMacros[macroName];
  }

  getMacro(macroName) {
    return this.savedMacros[macroName] || [];
  }
}

export const terminalMacroRecorder = new TerminalMacroRecorder();
