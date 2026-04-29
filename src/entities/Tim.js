import {
  HUD_HEIGHT, FLOOR_Y, SPEED_TIM, DEPTH,
  ATTACK_COOLDOWN, SLAM_COOLDOWN, ATTACK_DAMAGE, SLAM_DAMAGE,
  ATTACK_DURATION, SLAM_DURATION,
} from '../constants.js';

export class Tim {
  constructor(scene, x, y, hitboxGroup) {
    this.scene = scene;
    this._hitboxGroup = hitboxGroup;
    this._facing = 'right';
    this._attackCooldown = 0;
    this._slamCooldown = 0;
    this.hp = 3;

    this.sprite = scene.physics.add.sprite(x, y, 'tim').setDepth(DEPTH.TIM);
    this.sprite.setDisplaySize(120, 120);
    this.sprite.setCollideWorldBounds(true);
    // 512x512 frame, character is centered. 
    // Unscaled radius 125, offset 131 so it's centered (131+125 = 256).
    this.sprite.body.setCircle(125, 131, 131);

    this._cursors = scene.input.keyboard.createCursorKeys();
    this._keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this._keyS = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
  }

  get x() { return this.sprite.x; }
  get y() { return this.sprite.y; }

  update() {
    this._move();
    this._clampToPlayArea();
    this._handleAttack();
    this._handleSlam();
    this._tickCooldowns();
  }

  _move() {
    const { left, right, up, down } = this._cursors;
    const vx = left.isDown ? -SPEED_TIM : right.isDown ? SPEED_TIM : 0;
    const vy = up.isDown ? -SPEED_TIM : down.isDown ? SPEED_TIM : 0;
    this.sprite.setVelocity(vx, vy);

    if (vx !== 0 || vy !== 0) {
      this.sprite.body.velocity.normalize().scale(SPEED_TIM);
      this.sprite.play('tim-walk', true);
    } else {
      this.sprite.stop();
      this.sprite.setFrame(0);
    }

    if (left.isDown)       { this._facing = 'left'; this.sprite.setFlipX(true); }
    else if (right.isDown) { this._facing = 'right'; this.sprite.setFlipX(false); }
    else if (up.isDown)    this._facing = 'up';
    else if (down.isDown)  this._facing = 'down';
  }

  _clampToPlayArea() {
    const half = this.sprite.displayHeight / 2;
    this.sprite.y = Phaser.Math.Clamp(
      this.sprite.y,
      HUD_HEIGHT + half + 4,
      FLOOR_Y - half - 4,
    );
  }

  _handleAttack() {
    if (this._attackCooldown > 0) return;
    if (!Phaser.Input.Keyboard.JustDown(this._keyA)) return;
    this._attackCooldown = ATTACK_COOLDOWN;
    this._spawnHitbox('attack');
  }

  _handleSlam() {
    if (this._slamCooldown > 0) return;
    if (!Phaser.Input.Keyboard.JustDown(this._keyS)) return;
    this._slamCooldown = SLAM_COOLDOWN;
    this._spawnHitbox('slam');
  }

  _spawnHitbox(type) {
    const isSlam = type === 'slam';
    const key      = 'shockwave';
    const duration = isSlam ? SLAM_DURATION    : ATTACK_DURATION;
    const damage   = isSlam ? SLAM_DAMAGE      : ATTACK_DAMAGE;

    const offsets = {
      right: [isSlam ? 0 : 44,  0],
      left:  [isSlam ? 0 : -44, 0],
      up:    [0, isSlam ? 0 : -38],
      down:  [0, isSlam ? 0 :  38],
    };
    const [ox, oy] = offsets[this._facing];

    const hb = this._hitboxGroup.create(this.x + ox, this.y + oy, key);
    hb.setDepth(DEPTH.HITBOX);
    
    const size = isSlam ? 200 : 100;
    hb.setDisplaySize(size, size);
    
    hb.setAlpha(0.9);
    hb.damage = damage;
    hb.isSlam = isSlam;
    hb.hitEnemies = new Set();

    if (isSlam) {
      hb.body.setCircle(256); // Unscaled radius for 512x512 image
    } else {
      hb.body.setSize(512, 512); // Unscaled size for 512x512 image
    }

    hb.play('shockwave-anim');

    this.scene.tweens.add({ targets: hb, alpha: 0, duration, ease: 'Power2' });
    this.scene.time.delayedCall(duration, () => { if (hb.active) hb.destroy(); });
  }

  takeDamage() {
    this.hp = Math.max(0, this.hp - 1);
    this.sprite.setTint(0xff0000);
    this.scene.time.delayedCall(150, () => { if (this.sprite.active) this.sprite.clearTint(); });
    this.scene.updatePlayerHealth(this.hp);
    if (this.hp <= 0) {
      this.scene.gameOver();
    }
  }

  _tickCooldowns() {
    const dt = this.scene.game.loop.delta;
    this._attackCooldown = Math.max(0, this._attackCooldown - dt);
    this._slamCooldown   = Math.max(0, this._slamCooldown - dt);
  }
}
