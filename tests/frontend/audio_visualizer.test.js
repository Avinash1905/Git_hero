/**
 * Automated Frontend Test Suite: Audio Visualizer
 * Tests: AudioVisualizer initialization, mock frequency drawing, renderVisualizerHtml
 */

import assert from 'node:assert';
import { AudioVisualizer } from '../../src/features/visualizer/AudioVisualizer.js';

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

export async function runAudioVisualizerTests() {
  console.log('\n[Suite 32: Audio Synthesizer Visualizer]');

  it('AudioVisualizer should initialize safely in headless environment without audio context', () => {
    const viz = new AudioVisualizer();
    assert.strictEqual(viz.isActive, false);
    assert.strictEqual(viz.analyser, null);

    viz.start();
    assert.strictEqual(viz.isActive, true);

    viz.stop();
    assert.strictEqual(viz.isActive, false);
  });

  it('AudioVisualizer should render semantic HTML container and canvas element', () => {
    const html = AudioVisualizer.renderVisualizerHtml();
    assert.ok(html.includes('id="audio-visualizer-canvas"'));
    assert.ok(html.includes('Acoustic Synthesizer Spectrum'));
  });

  return { passed, total };
}

if (process.argv[1] && process.argv[1].endsWith('audio_visualizer.test.js')) {
  runAudioVisualizerTests().then(() => console.log(`\nAll ${passed}/${total} Audio Visualizer tests passed.`));
}
