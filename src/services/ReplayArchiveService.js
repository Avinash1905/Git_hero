/**
 * ReplayArchiveService
 * Compresses move streams into shareable replay codes and downloads replay package files.
 */

export class ReplayArchiveService {
  compressMoveStream(moves = []) {
    // RLE / shorthand encoding (e.g. U3R2D1L4)
    if (!moves || moves.length === 0) return '';
    let encoded = '';
    let last = moves[0];
    let count = 1;

    for (let i = 1; i < moves.length; i++) {
      if (moves[i] === last) {
        count++;
      } else {
        encoded += `${last[0].toUpperCase()}${count > 1 ? count : ''}`;
        last = moves[i];
        count = 1;
      }
    }
    encoded += `${last[0].toUpperCase()}${count > 1 ? count : ''}`;
    return encoded;
  }

  decompressMoveStream(encoded = '') {
    const moves = [];
    const map = { 'U': 'up', 'D': 'down', 'L': 'left', 'R': 'right' };
    const matches = encoded.match(/([UDLR])(\d+)?/g) || [];

    matches.forEach(m => {
      const dirChar = m[0];
      const count = parseInt(m.substring(1) || '1', 10);
      const dir = map[dirChar] || 'up';
      for (let i = 0; i < count; i++) {
        moves.push(dir);
      }
    });

    return moves;
  }
}

export const replayArchiveService = new ReplayArchiveService();
