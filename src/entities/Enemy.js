import { DEPTH, GEM_X, GEM_Y, W, H, SPAWN_Y, FLOOR_Y } from '../constants.js';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, config) {
    super(scene, x, y, texture);
    this.setDepth(DEPTH.ENEMY);
    this.hp = config.hp;
    this.speed = config.speed;
    this.scoreValue = config.score;
    this.configRadius = config.radius;
    this.setDisplaySize(config.displaySize, config.displaySize);
    
    this.state = 'WALK'; // WALK, STEER, ESCAPE
    this.steerTimer = 0;
    this.steerDir = 0;
  }

  setupPhysics() {
    this.body.setCircle(this.configRadius);
    // Center the unscaled circle in the 470x465 frame
    this.body.setOffset((470 - this.configRadius * 2) / 2, (465 - this.configRadius * 2) / 2);
    this.body.setBounce(0.2);
  }

  update(time, delta) {
    if (!this.active || !this.body) return;

    if (this.state === 'WALK' || this.state === 'STEER' || this.state === 'ESCAPE') {
      this.play('bug-walk', true);
      this.setFlipX(this.body.velocity.x > 0);
    } else {
      this.stop();
      this.setFrame(0);
    }

    // Wrap back to top if the enemy slips below the play area
    if (this.state !== 'ESCAPE' && this.y > FLOOR_Y + 40) {
      this.setPosition(Phaser.Math.Between(40, W - 40), SPAWN_Y);
      this.body.setVelocity(0, 0);
      this.state = 'WALK';
    }

    if (this.state === 'WALK') {
      this._moveTowards(GEM_X, GEM_Y);
      // Check if hitting a tree specifically (blocked by static objects)
      if (this.body.blocked.none === false || this.body.touching.none === false) {
          // If we are stuck or touching something, start steering
          this.state = 'STEER';
          this.steerTimer = 400 + Math.random() * 400;
          this.steerDir = Math.random() < 0.5 ? -1 : 1;
      }
    } else if (this.state === 'STEER') {
      this.steerTimer -= delta;
      // Veer to the side to get around the tree
      const angle = Phaser.Math.Angle.Between(this.x, this.y, GEM_X, GEM_Y);
      const steerAngle = angle + (Math.PI / 2) * this.steerDir;
      this.body.setVelocity(Math.cos(steerAngle) * this.speed, Math.sin(steerAngle) * this.speed);
      
      if (this.steerTimer <= 0) {
        this.state = 'WALK';
      }
    } else if (this.state === 'ESCAPE') {
      // Run off bottom
      this.body.setVelocityY(this.speed * 2);
      if (this.y > H + 50) this.destroy();
    }
  }

  _moveTowards(tx, ty) {
    const angle = Phaser.Math.Angle.Between(this.x, this.y, tx, ty);
    this.body.setVelocity(Math.cos(angle) * this.speed, Math.sin(angle) * this.speed);
  }

  takeDamage(amount) {
    if (!this.active) return;
    this.hp -= amount;
    this.setTint(0xffffff);
    this.scene.time.delayedCall(80, () => { if (this.active) this.clearTint(); });
    if (this.hp <= 0) this._die();
  }

  applyKnockback(fromX, fromY, force) {
    if (!this.body || !this.active) return;
    let angle = Phaser.Math.Angle.Between(fromX, fromY, this.x, this.y);
    if (fromX === this.x && fromY === this.y) angle = Math.random() * Math.PI * 2;
    
    this.body.setVelocity(Math.cos(angle) * force, Math.sin(angle) * force);
    // Pause state for a bit?
    const oldState = this.state;
    this.state = 'KNOCKED';
    this.scene.time.delayedCall(280, () => {
      if (this.active && this.body) this.state = oldState;
    });
  }

  setEscape() {
    this.state = 'ESCAPE';
    this.setAlpha(0.6);
  }

  _die() {
    this.scene.addScore(this.scoreValue);
    this.scene.enemyDied();
    this.destroy();
  }
}
