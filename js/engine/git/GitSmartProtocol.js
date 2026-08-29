/**
 * GitQuest Engine - Git Smart Transfer Protocol & Packfile Parser
 * Models pkt-line encoding/decoding, capability negotiation (side-band-64k, multi_ack), and delta object packs.
 */

import { EngineUtils } from '../core/Utils.js';

export class PktLineEncoder {
  static encode(line) {
    if (!line) return '0000'; // Flush pkt
    const len = line.length + 4;
    const hexLen = len.toString(16).padStart(4, '0');
    return `${hexLen}${line}`;
  }

  static decode(pktStream) {
    const lines = [];
    let offset = 0;

    while (offset < pktStream.length) {
      const hexLen = pktStream.substring(offset, offset + 4);
      if (hexLen === '0000') {
        lines.push({ type: 'flush', content: '' });
        offset += 4;
        continue;
      }

      const len = parseInt(hexLen, 16);
      if (isNaN(len) || len <= 4) break;

      const content = pktStream.substring(offset + 4, offset + len);
      lines.push({ type: 'data', content });
      offset += len;
    }

    return lines;
  }
}

export class GitCapabilities {
  constructor() {
    this.caps = new Set([
      'multi_ack',
      'thin-pack',
      'side-band-64k',
      'ofs-delta',
      'shallow',
      'no-progress',
      'include-tag',
      'multi_ack_detailed'
    ]);
  }

  supports(cap) {
    return this.caps.has(cap);
  }

  formatNegotiation() {
    return Array.from(this.caps).join(' ');
  }
}

export class GitPackObject {
  constructor(type, size, data, deltaBaseHash = null) {
    this.type = type; // 'commit' | 'tree' | 'blob' | 'tag' | 'ofs-delta' | 'ref-delta'
    this.size = size;
    this.data = data;
    this.deltaBaseHash = deltaBaseHash;
    this.hash = EngineUtils.generateGitHash(data);
  }
}

export class GitPackfileParser {
  constructor() {
    this.objects = new Map(); // hash -> GitPackObject
  }

  parsePack(rawPackData) {
    // Simulated pack header validation
    const header = rawPackData.substring(0, 12);
    const objectEntries = rawPackData.split('---PACK_OBJ---').filter(Boolean);

    for (const entry of objectEntries) {
      const [meta, ...bodyParts] = entry.trim().split('\n');
      const body = bodyParts.join('\n');
      const [type, sizeStr] = meta.split(' ');
      const size = parseInt(sizeStr, 10) || body.length;

      const packObj = new GitPackObject(type || 'blob', size, body);
      this.objects.set(packObj.hash, packObj);
    }

    return Array.from(this.objects.values());
  }

  resolveDelta(deltaObj, baseObj) {
    if (!deltaObj || !baseObj) return null;
    // Delta application
    const resolvedData = `${baseObj.data}\n${deltaObj.data}`;
    return new GitPackObject(baseObj.type, resolvedData.length, resolvedData);
  }
}
