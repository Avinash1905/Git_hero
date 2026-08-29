/**
 * GitQuest Game Engine - Git Packfile Offset Indexer
 * Implements packfile index v2 format:
 * 256-entry first-level fan-out table, SHA-1 object table, CRC32 table, and 4-byte offset table.
 */

export class PackIndexEntry {
  constructor(sha1Hash, offset, crc32) {
    this.sha1Hash = sha1Hash;
    this.offset = offset;
    this.crc32 = crc32;
  }
}

export class GitPackfileOffsetIndexer {
  constructor() {
    this.fanoutTable = new Array(256).fill(0);
    this.entries = []; // Sorted by SHA-1
  }

  addEntry(sha1Hash, offset, crc32 = 'a1b2c3d4') {
    const entry = new PackIndexEntry(sha1Hash, offset, crc32);
    this.entries.push(entry);
    this.entries.sort((a, b) => a.sha1Hash.localeCompare(b.sha1Hash));
    this._recomputeFanout();
  }

  _recomputeFanout() {
    this.fanoutTable.fill(0);
    for (const ent of this.entries) {
      const firstByte = parseInt(ent.sha1Hash.substring(0, 2), 16) || 0;
      for (let i = firstByte; i < 256; i++) {
        this.fanoutTable[i]++;
      }
    }
  }

  findObjectOffset(sha1Hash) {
    const firstByte = parseInt(sha1Hash.substring(0, 2), 16) || 0;
    const lowIdx = firstByte > 0 ? this.fanoutTable[firstByte - 1] : 0;
    const highIdx = this.fanoutTable[firstByte];

    // Binary search within bounded fanout slice
    let l = lowIdx;
    let r = highIdx - 1;

    while (l <= r) {
      const m = Math.floor((l + r) / 2);
      const midHash = this.entries[m]?.sha1Hash || '';

      if (midHash === sha1Hash) {
        return this.entries[m].offset;
      } else if (midHash < sha1Hash) {
        l = m + 1;
      } else {
        r = m - 1;
      }
    }

    return null;
  }
}
