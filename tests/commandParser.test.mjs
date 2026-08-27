import { describe, test, assert, assertEqual } from './runTests.mjs';
import { CommandParser } from '../js/terminal/CommandParser.js';

describe('Command Parser & Tokenizer', () => {
  const parser = new CommandParser();

  test('parses basic git commands correctly', () => {
    const res = parser.parse('git status');
    assertEqual(res.primary, 'git');
    assertEqual(res.subCommand, 'status');
  });

  test('parses directional movement commands', () => {
    const res = parser.parse('git up');
    assertEqual(res.primary, 'git');
    assertEqual(res.subCommand, 'up');
  });

  test('parses directional pull with arguments', () => {
    const res = parser.parse('git pull left');
    assertEqual(res.primary, 'git');
    assertEqual(res.subCommand, 'pull');
    assertEqual(res.arg, 'left');
  });

  test('parses commit with quoted message argument', () => {
    const res = parser.parse('git commit -m "fix merge issue"');
    assertEqual(res.primary, 'git');
    assertEqual(res.subCommand, 'commit');
    assert(res.flags.includes('-m'), 'Should include -m flag');
  });

  test('fuzzy suggestion for typos', () => {
    const suggestion = parser.getFuzzySuggestion('git statsu');
    assertEqual(suggestion, 'git status');
  });
});
