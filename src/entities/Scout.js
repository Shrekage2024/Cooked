import { Enemy } from './Enemy.js';

export class Scout extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, 'scout', { hp: 1, speed: 120, score: 10 });
  }
}
