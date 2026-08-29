/**
 * GitQuest Game Engine - Anti-Cheat Move Sequence Integrity Verifier
 * Validates player move logs, calculates deterministic cryptographic checksums,
 * detects impossible teleport jumps or out-of-bounds pushes, and signs completion tokens.
 */

import { EngineUtils } from '../core/Utils.js';

export class GitAntiCheatIntegrityVerifier {
  verifyLevelRun(levelDef, moveSequence = [], finalMovesCount, isCommitted) {
    if (!levelDef) {
      return { isValid: false, reason: 'Null level definition' };
    }

    if (!isCommitted) {
      return { isValid: false, reason: 'Level completion requires committed repository payload.' };
    }

    if (moveSequence.length !== finalMovesCount) {
      return { isValid: false, reason: 'Move sequence length does not match reported move count.' };
    }

    // Step-by-step physics validation
    let curPlayer = { ...levelDef.player };
    let curBox = { ...levelDef.box };
    const walls = new Set((levelDef.walls || []).map(w => `${w.x},${w.y}`));
    const size = levelDef.gridSize || 6;

    const dirVectors = {
      up: { x: 0, y: -1 },
      down: { x: 0, y: 1 },
      left: { x: -1, y: 0 },
      right: { x: 1, y: 0 }
    };

    for (let i = 0; i < moveSequence.length; i++) {
      const move = moveSequence[i];
      const dir = dirVectors[move.direction];
      if (!dir) continue; // Command or utility action

      if (move.type === 'move') {
        const nextX = curPlayer.x + dir.x;
        const nextY = curPlayer.y + dir.y;

        // Check if hitting wall or bounds
        if (nextX < 0 || nextX >= size || nextY < 0 || nextY >= size || walls.has(`${nextX},${nextY}`)) {
          return { isValid: false, step: i, reason: `Invalid move into wall or boundary at (${nextX}, ${nextY})` };
        }

        // If walking into box, it's a push
        if (nextX === curBox.x && nextY === curBox.y) {
          const nextBoxX = curBox.x + dir.x;
          const nextBoxY = curBox.y + dir.y;
          if (nextBoxX < 0 || nextBoxX >= size || nextBoxY < 0 || nextBoxY >= size || walls.has(`${nextBoxX},${nextBoxY}`)) {
            return { isValid: false, step: i, reason: 'Box pushed into obstruction.' };
          }
          curBox = { x: nextBoxX, y: nextBoxY };
        }

        curPlayer = { x: nextX, y: nextY };
      }
    }

    // Check final box position equals goal
    const onGoal = curBox.x === levelDef.goal.x && curBox.y === levelDef.goal.y;
    if (!onGoal) {
      return { isValid: false, reason: 'Final box position is not on the target goal coordinate.' };
    }

    const verificationHash = EngineUtils.generateGitHash(
      `verified_${levelDef.id}_${finalMovesCount}_${Date.now()}`
    );

    return {
      isValid: true,
      levelId: levelDef.id,
      finalMoves: finalMovesCount,
      verificationHash,
      signature: `SHA256:${verificationHash.substring(0, 16)}`
    };
  }
}
