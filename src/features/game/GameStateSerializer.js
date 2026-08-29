/**
 * GitQuest Frontend - Game State Serializer & Seed Code Generator
 * Encodes full level state, player position, box coordinates, and move history
 * into compact Base64 shareable replay codes.
 */

export class GameStateSerializer {
  serializeState(levelId, gameState, moveHistory = []) {
    const payload = {
      v: 1,
      lvl: levelId,
      t: Date.now(),
      p: gameState.player ? { x: gameState.player.x, y: gameState.player.y } : null,
      b: gameState.box ? { x: gameState.box.x, y: gameState.box.y } : null,
      m: gameState.moves || 0,
      c: Boolean(gameState.isCommitted),
      h: moveHistory
    };

    const json = JSON.stringify(payload);
    if (typeof btoa !== 'undefined') {
      return btoa(unescape(encodeURIComponent(json)));
    }
    return Buffer.from(json).toString('base64');
  }

  deserializeState(encodedCode) {
    if (!encodedCode) return null;

    try {
      let json = '';
      if (typeof atob !== 'undefined') {
        json = decodeURIComponent(escape(atob(encodedCode)));
      } else {
        json = Buffer.from(encodedCode, 'base64').toString('utf8');
      }
      return JSON.parse(json);
    } catch (err) {
      console.error('[GameStateSerializer] Decoding error:', err);
      return null;
    }
  }

  generateShareableUrl(levelId, gameState, moveHistory = []) {
    const code = this.serializeState(levelId, gameState, moveHistory);
    return `https://gitquest.dev/play?seed=${encodeURIComponent(code)}`;
  }
}
