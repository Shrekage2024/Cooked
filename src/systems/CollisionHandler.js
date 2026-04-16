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

    physics.add.overlap(enemies, gemZone, (enemy) => {
      if (!enemy.active) return;
      enemy.destroy();
      this.scene.loseLife();
      this.scene.enemyDied();
    });
  }
}
