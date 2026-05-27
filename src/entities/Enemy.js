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
    
    this.state = 'WALK'; // WALK, STEER, ESCAPE, UNSTUCK
    this.steerTimer = 0;
    this.steerDir = 0;

    this.targetMode = 'gem'; // 'gem' | 'tim'

    // Stuck detection: if we don't make meaningful progress toward the target
    // for STUCK_THRESHOLD ms, we trigger an UNSTUCK maneuver.
    this.stuckTimer = 0;
    this.lastDistToGem = null;
    this.unstuckPhase = 0;       // 0=backtrack, 1=lateral sweep
    this.unstuckPhaseTimer = 0;
    this.unstuckDir = 0;
  }

  static STUCK_THRESHOLD = 2000;       // ms with ~no progress before escape
  static STUCK_PROGRESS_EPS = 8;       // px progress per check window
  static UNSTUCK_BACKTRACK_MS = 500;
  static UNSTUCK_LATERAL_MS = 1200;

  setTarget(mode) {
    this.targetMode = mode;
  }

  _getTarget() {
    if (this.targetMode === 'tim' && this.scene.tim && this.scene.tim.sprite && this.scene.tim.sprite.active) {
      return { x: this.scene.tim.sprite.x, y: this.scene.tim.sprite.y };
    }
    return { x: GEM_X, y: GEM_Y };
  }

  setupPhysics() {
    this.body.setCircle(this.configRadius);
    // Center the unscaled circle in the 470x465 frame
    this.body.setOffset((470 - this.configRadius * 2) / 2, (465 - this.configRadius * 2) / 2);
    this.body.setBounce(0.2);
  }

  update(time, delta) {
    if (!this.active || !this.body) return;

    if (this.state === 'WALK' || this.state === 'STEER' || this.state === 'ESCAPE' || this.state === 'UNSTUCK') {
      this.play('bug-walk', true);
      this.setFlipX(this.body.velocity.x > 0);
    } else {
      this.stop();
      this.setFrame(0);
    }

    // Track progress toward the target while in WALK/STEER. If we stall, escape.
    if (this.state === 'WALK' || this.state === 'STEER') {
      const tgt = this._getTarget();
      const dist = Phaser.Math.Distance.Between(this.x, this.y, tgt.x, tgt.y);
      if (this.lastDistToGem === null) this.lastDistToGem = dist;
      this.stuckTimer += delta;
      if (this.stuckTimer >= 400) {
        if (this.lastDistToGem - dist < Enemy.STUCK_PROGRESS_EPS) {
          // Not making progress — escalate
          if (this.stuckTimer >= Enemy.STUCK_THRESHOLD) {
            this._enterUnstuck();
          }
        } else {
          // Made progress, reset
          this.stuckTimer = 0;
        }
        this.lastDistToGem = dist;
      }
    } else {
      this.stuckTimer = 0;
      this.lastDistToGem = null;
    }

    // Wrap back to top if the enemy slips below the play area
    if (this.state !== 'ESCAPE' && this.y > FLOOR_Y + 40) {
      this.setPosition(Phaser.Math.Between(40, W - 40), SPAWN_Y);
      this.body.setVelocity(0, 0);
      this.state = 'WALK';
    }

    if (this.state === 'WALK') {
      const tgt = this._getTarget();
      this._moveTowards(tgt.x, tgt.y);
      // Check if hitting a tree specifically (blocked by static objects)
      if (this.body.blocked.none === false || this.body.touching.none === false) {
          // If we are stuck or touching something, start steering
          this.state = 'STEER';
          this.steerTimer = 400 + Math.random() * 400;
          
          if (this.body.blocked.left || this.body.touching.left) {
              this.steerDir = 1; // Steer right
          } else if (this.body.blocked.right || this.body.touching.right) {
              this.steerDir = -1; // Steer left
          } else {
              this.steerDir = Math.random() < 0.5 ? -1 : 1;
          }
      }
    } else if (this.state === 'STEER') {
      this.steerTimer -= delta;
      // Veer to the side to get around the tree
      const tgt = this._getTarget();
      const angle = Phaser.Math.Angle.Between(this.x, this.y, tgt.x, tgt.y);
      const steerAngle = angle + (Math.PI / 2) * this.steerDir;
      this.body.setVelocity(Math.cos(steerAngle) * this.speed, Math.sin(steerAngle) * this.speed);
      
      if (this.body.blocked.left || this.body.touching.left) this.steerDir = 1;
      if (this.body.blocked.right || this.body.touching.right) this.steerDir = -1;

      if (this.steerTimer <= 0) {
        this.state = 'WALK';
      }
    } else if (this.state === 'UNSTUCK') {
      this.unstuckPhaseTimer -= delta;
      if (this.unstuckPhase === 0) {
        // Phase 0: backtrack away from target
        const tgt = this._getTarget();
        const angle = Phaser.Math.Angle.Between(this.x, this.y, tgt.x, tgt.y);
        this.body.setVelocity(-Math.cos(angle) * this.speed, -Math.sin(angle) * this.speed);
        if (this.unstuckPhaseTimer <= 0) {
          this.unstuckPhase = 1;
          this.unstuckPhaseTimer = Enemy.UNSTUCK_LATERAL_MS;
        }
      } else {
        // Phase 1: sweep laterally outward (toward nearer screen edge)
        // with a slight downward bias so we keep heading roughly toward the gem row.
        this.body.setVelocity(this.unstuckDir * this.speed, this.speed * 0.3);
        // Exit early if we're clearly clear of obstacles AND have drifted enough
        const cleared = this.unstuckPhaseTimer <= 0 ||
          (this.body.blocked.none && this.body.touching.none && this.unstuckPhaseTimer < Enemy.UNSTUCK_LATERAL_MS - 300);
        if (cleared) {
          this.state = 'WALK';
          this.stuckTimer = 0;
          this.lastDistToGem = null;
        }
      }
    } else if (this.state === 'ESCAPE') {
      // Run off bottom
      this.body.setVelocityY(this.speed * 2);
      if (this.y > H + 50) {
        this.scene.enemyDied(); // Must notify scene so wave counter triggers
        this.destroy();
      }
    }
  }

  _enterUnstuck() {
    this.state = 'UNSTUCK';
    this.unstuckPhase = 0;
    this.unstuckPhaseTimer = Enemy.UNSTUCK_BACKTRACK_MS;
    // Go toward the nearer screen edge so we curl around the obstacle
    this.unstuckDir = this.x > W / 2 ? 1 : -1;
    this.stuckTimer = 0;
    this.lastDistToGem = null;
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
