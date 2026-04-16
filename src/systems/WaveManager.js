export const WAVES = [
  { spawns: [{ type: 'scout', count: 5 }],                              interval: 1200 },
  { spawns: [{ type: 'scout', count: 7 }],                              interval: 1000 },
  { spawns: [{ type: 'scout', count: 6 }, { type: 'brute', count: 1 }], interval: 1000 },
  { spawns: [{ type: 'scout', count: 5 }, { type: 'brute', count: 2 }], interval: 900  },
  { spawns: [{ type: 'scout', count: 4 }, { type: 'brute', count: 3 }], interval: 800  },
];

export class WaveManager {
  constructor() { this._index = 0; }

  get current() { return this._index; }
  get total() { return WAVES.length; }
  get isLastWave() { return this._index >= WAVES.length - 1; }

  getWaveConfig(index = this._index) { return WAVES[index]; }

  buildSpawnQueue(index = this._index) {
    const queue = [];
    WAVES[index].spawns.forEach(({ type, count }) => {
      for (let i = 0; i < count; i++) queue.push(type);
    });
    for (let i = queue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [queue[i], queue[j]] = [queue[j], queue[i]];
    }
    return queue;
  }

  advance() { if (!this.isLastWave) this._index++; }
}
