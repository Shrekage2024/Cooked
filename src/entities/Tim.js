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

    this.sprite = scene.physics.add.image(x, y, 'tim').setDepth(DEPTH.TIM);
    this.sprite.setCollideWorldBounds(true);

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

    if (left.isDown)       this._facing = 'left';
    else if (right.isDown) this._facing = 'right';
    else if (up.isDown)    this._facing = 'up';
    else if (down.isDown)  this._facing = 'down';
  }

  _clampToPlayArea() {
    const half = this.sprite.height / 2;
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
    const key      = isSlam ? 'hitbox-slam'   : 'hitbox-attack';
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
    hb.setAlpha(isSlam ? 0.55 : 0.80);
    hb.damage = damage;
    hb.isSlam = isSlam;
    hb.hitEnemies = new Set();

    this.scene.tweens.add({ targets: hb, alpha: 0, duration, ease: 'Power2' });
    this.scene.time.delayedCall(duration, () => { if (hb.active) hb.destroy(); });
  }

  _tickCooldowns() {
    const dt = this.scene.game.loop.delta;
    this._attackCooldown = Math.max(0, this._attackCooldown - dt);
    this._slamCooldown   = Math.max(0, this._slamCooldown - dt);
  }
}
