/**
 * GitQuest Game Engine - Git Bundle Packer & Packfile Encoder
 * Packages repository objects, commit graphs, and ref heads into
 * portable binary/text bundles for offline synchronization and backup.
 */

import { EngineUtils } from '../core/Utils.js';

export class GitBundlePacker {
  createBundle(refs = {}, objects = []) {
    const bundleHeader = '# v2 git bundle';
    const refLines = Object.entries(refs).map(([ref, hash]) => `${hash} ${ref}`);
    const objectEntries = objects.map(o => `${o.type} ${o.hash} (${o.size || 0} bytes)`);

    const bundleData = [
      bundleHeader,
      ...refLines,
      '',
      `# PACK: ${objects.length} objects`,
      ...objectEntries
    ].join('\n');

    return {
      success: true,
      bundleData,
      checksum: EngineUtils.generateGitHash(bundleData).substring(0, 16),
      sizeBytes: bundleData.length
    };
  }

  verifyBundle(bundleData) {
    if (!bundleData.startsWith('# v2 git bundle')) {
      return { isValid: false, reason: 'Invalid bundle header' };
    }

    const lines = bundleData.split('\n');
    const refs = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.startsWith('#')) break;
      const [hash, ref] = line.split(/\s+/);
      if (hash && ref) {
        refs.push({ hash, ref });
      }
    }

    return {
      isValid: true,
      refsContained: refs,
      totalRefs: refs.length
    };
  }
}
