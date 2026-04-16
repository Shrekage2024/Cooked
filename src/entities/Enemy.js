import { DEPTH } from '../constants.js';

export class Enemy extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y, texture, config) {
    super(scene, x, y, texture);
    // Do NOT call scene.add.existing or scene.physics.add.existing here.
    // The physics group (enemies.add(this, true)) handles both when spawning.
    this.setDepth(DEPTH.ENEMY);
    this.hp = config.hp;
    this.speed = config.speed;
    this.scoreValue = config.score;
    this.drift = 0;
  }

  takeDamage(amount) {
    this.hp -= amount;
    this.setTint(0xffffff);
    this.scene.time.delayedCall(80, () => { if (this.active) this.clearTint(); });
    if (this.hp <= 0) this._die();
  }

  applyKnockback(fromX, fromY, force) {
    const angle = Phaser.Math.Angle.Between(fromX, fromY, this.x, this.y);
    this.body.setVelocity(Math.cos(angle) * force, Math.sin(angle) * force);
    this.scene.time.delayedCall(280, () => {
      if (this.active) this.body.setVelocity(this.drift, this.speed);
    });
  }

  _die() {
    this.scene.addScore(this.scoreValue);
    this.scene.enemyDied();
    this.destroy();
  }
}
