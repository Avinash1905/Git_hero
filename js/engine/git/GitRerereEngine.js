/**
 * GitQuest Game Engine - Git Rerere (Reuse Recorded Resolution) Database Engine
 * Tracks conflict preimages, stores resolution postimages, and automatically
 * re-applies recorded resolutions to identical conflict hunks across rebase/merges.
 */

export class RerereResolutionRecord {
  constructor(preimageHash, resolutionText, filename, timestamp = Date.now()) {
    this.preimageHash = preimageHash;
    this.resolutionText = resolutionText;
    this.filename = filename;
    this.timestamp = timestamp;
    this.useCount = 0;
  }
}

export class GitRerereEngine {
  constructor(isEnabled = true) {
    this.isEnabled = isEnabled;
    this.database = new Map(); // preimageHash -> RerereResolutionRecord
  }

  hashConflictPreimage(currentHunkText, incomingHunkText) {
    const combined = `<<<<<<< HEAD\n${currentHunkText}\n=======\n${incomingHunkText}\n>>>>>>>`;
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      hash = ((hash << 5) - hash) + combined.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(10, '0');
  }

  recordResolution(currentHunkText, incomingHunkText, resolvedText, filename = 'main.js') {
    if (!this.isEnabled) return null;

    const preimageHash = this.hashConflictPreimage(currentHunkText, incomingHunkText);
    const record = new RerereResolutionRecord(preimageHash, resolvedText, filename);
    this.database.set(preimageHash, record);

    return {
      success: true,
      preimageHash,
      message: `Recorded resolution for '${filename}' (preimage: ${preimageHash.substring(0, 7)})`
    };
  }

  findAutoResolution(currentHunkText, incomingHunkText) {
    if (!this.isEnabled) return null;

    const preimageHash = this.hashConflictPreimage(currentHunkText, incomingHunkText);
    const record = this.database.get(preimageHash);

    if (record) {
      record.useCount++;
      return {
        hasMatch: true,
        resolvedText: record.resolutionText,
        filename: record.filename,
        message: `Resolved conflict using recorded resolution (${preimageHash.substring(0, 7)})`
      };
    }

    return { hasMatch: false };
  }

  clear() {
    this.database.clear();
  }
}
