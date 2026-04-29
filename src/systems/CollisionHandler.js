import { SLAM_KNOCKBACK } from '../constants.js';

export class CollisionHandler {
  constructor(scene) { this.scene = scene; }

  setup() {
    const { physics, enemies, attackHitboxes, gemZone } = this.scene;

    physics.add.overlap(attackHitboxes, enemies, (hitbox, enemy) => {
      if (!hitbox.active || !enemy.active) return;
      if (hitbox.hitEnemies.has(enemy)) return;
      hitbox.hitEnemies.add(enemy);
      enemy.takeDamage(hitbox.damage);
      if (hitbox.isSlam) enemy.applyKnockback(hitbox.x, hitbox.y, SLAM_KNOCKBACK);
    });

    physics.add.overlap(enemies, gemZone, (obj1, obj2) => {
      const enemy = obj1.setEscape ? obj1 : obj2;
      if (!enemy || !enemy.active || enemy.state === 'ESCAPE') return;
      enemy.setEscape();
      this.scene.loseLife(); // Gem theft
    });

    physics.add.overlap(this.scene.tim.sprite, enemies, (obj1, obj2) => {
      const enemy = obj1.setEscape ? obj1 : obj2;
      if (!enemy || !enemy.active || enemy.state === 'ESCAPE') return;
      enemy.setEscape();
      this.scene.tim.takeDamage();
    });
  }
}
