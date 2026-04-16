import { DEPTH } from '../constants.js';

export class Enemy extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y, texture, config) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setDepth(DEPTH.ENEMY);
    this.hp = config.hp;
    this.speed = config.speed;
    this.scoreValue = config.score;
    this.body.setVelocityY(this.speed);
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
      if (this.active) this.body.setVelocityY(this.speed);
    });
  }

  _die() {
    this.scene.addScore(this.scoreValue);
    this.scene.enemyDied();
    this.destroy();
  }
}
