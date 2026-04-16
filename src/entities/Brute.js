import { Enemy } from './Enemy.js';

export class Brute extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, 'brute', { hp: 3, speed: 55, score: 30 });
    this.setScale(1.2);
  }
}
