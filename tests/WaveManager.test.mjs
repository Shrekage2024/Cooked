import { test } from 'node:test';
import assert from 'node:assert';
import { WaveManager, WAVES } from '../src/systems/WaveManager.js';

test('starts at wave 0', () => {
  assert.strictEqual(new WaveManager().current, 0);
});

test('total is 5', () => {
  assert.strictEqual(new WaveManager().total, 5);
});

test('getWaveConfig(0) has 5 scouts', () => {
  const cfg = new WaveManager().getWaveConfig(0);
  const scouts = cfg.spawns.find(s => s.type === 'scout');
  assert.strictEqual(scouts.count, 5);
});

test('advance increments current', () => {
  const wm = new WaveManager();
  wm.advance();
  assert.strictEqual(wm.current, 1);
});

test('advance does not exceed last wave index', () => {
  const wm = new WaveManager();
  for (let i = 0; i < 10; i++) wm.advance();
  assert.strictEqual(wm.current, 4);
});

test('isLastWave true at index 4', () => {
  const wm = new WaveManager();
  for (let i = 0; i < 4; i++) wm.advance();
  assert.ok(wm.isLastWave);
});

test('buildSpawnQueue(2) returns 7 entries (6 scouts + 1 brute)', () => {
  assert.strictEqual(new WaveManager().buildSpawnQueue(2).length, 7);
});

test('buildSpawnQueue only produces valid enemy types', () => {
  const wm = new WaveManager();
  for (let i = 0; i < 5; i++) {
    wm.buildSpawnQueue(i).forEach(type => {
      assert.ok(['scout', 'brute'].includes(type), `unexpected type: ${type}`);
    });
  }
});

test('all WAVES have spawns array and interval > 0', () => {
  WAVES.forEach((w, i) => {
    assert.ok(Array.isArray(w.spawns), `wave ${i}: missing spawns`);
    assert.ok(w.interval > 0, `wave ${i}: interval must be > 0`);
  });
});
