import { Enemy } from './Enemy.js';

export class Brute extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, 'bug', { hp: 3, speed: 55, score: 30, displaySize: 100, radius: 140 });
  }
}
