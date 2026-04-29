import { Enemy } from './Enemy.js';

export class Scout extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, 'bug', { hp: 1, speed: 120, score: 10, displaySize: 60, radius: 80 });
  }
}
