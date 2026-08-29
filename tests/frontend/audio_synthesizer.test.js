/**
 * Automated Frontend Test Suite: Procedural Synthesizer Audio Engine
 * Tests: Volume control, mute logic, sound triggers execution safety
 */

import assert from 'node:assert';
import { SynthesizerAudioEngine } from '../../src/services/SynthesizerAudioEngine.js';

let passed = 0;
let total = 0;

function it(name, fn) {
  total++;
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✕ ${name}`);
    console.error(`    ${err.message}`);
    throw err;
  }
}

export async function runAudioSynthesizerTests() {
  console.log('\n[Suite 14: Procedural Audio Synthesizer]');

  const engine = new SynthesizerAudioEngine();

  it('Volume should clamp between 0.0 and 1.0', () => {
    engine.setVolume(1.5);
    assert.strictEqual(engine.volume, 1.0);

    engine.setVolume(-0.5);
    assert.strictEqual(engine.volume, 0.0);

    engine.setVolume(0.65);
    assert.strictEqual(engine.volume, 0.65);
  });

  it('Mute toggle should update internal state', () => {
    engine.setMuted(true);
    assert.strictEqual(engine.isMuted, true);

    engine.setMuted(false);
    assert.strictEqual(engine.isMuted, false);
  });

  it('All procedural sound triggers should execute safely without exceptions', () => {
    // In headless Node, ensureContext safely returns false without throwing
    assert.doesNotThrow(() => engine.playStepSound());
    assert.doesNotThrow(() => engine.playBoxSlideSound());
    assert.doesNotThrow(() => engine.playGoalStagedSound());
    assert.doesNotThrow(() => engine.playVictoryFanfare());
    assert.doesNotThrow(() => engine.playKeyClick());
  });

  return { passed, total };
}

if (process.argv[1] && process.argv[1].endsWith('audio_synthesizer.test.js')) {
  runAudioSynthesizerTests().then(() => console.log(`\nAll ${passed}/${total} Audio Synthesizer tests passed.`));
}
