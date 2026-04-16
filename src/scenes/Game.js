import { W, H, HUD_HEIGHT, FLOOR_Y, GEM_X, GEM_Y, DEPTH } from '../constants.js';
import { Tim } from '../entities/Tim.js';

export class Game extends Phaser.Scene {
  constructor() { super('Game'); }

  create() {
    this.lives = 3;
    this.score = 0;

    this._buildBackground();
    this._buildGem();
    this._buildGroups();
    this._buildTim();
    this._buildHUD();
  }

  _buildBackground() {
    this.add.rectangle(W / 2, H / 2, W, H, 0x0a0a1a).setDepth(DEPTH.BG);
    this.add.rectangle(W / 2, HUD_HEIGHT / 2, W, HUD_HEIGHT, 0x000000, 0.85).setDepth(DEPTH.HUD - 1);
    this.add.rectangle(W / 2, H - 30, W, 60, 0x1a1208).setDepth(DEPTH.BG);
    this.add.rectangle(W / 2, FLOOR_Y, W, 3, 0x6a4a20).setDepth(DEPTH.BG);
  }

  _buildGem() {
    this.gem = this.add.image(GEM_X, GEM_Y, 'gem').setDepth(DEPTH.GEM);
    this.tweens.add({
      targets: this.gem, scaleX: 1.15, scaleY: 1.15,
      duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
    });
    this.gemZone = this.physics.add.staticImage(GEM_X, GEM_Y, 'gem').setAlpha(0);
    this.gemZone.body.setCircle(18);
    this.gemZone.refreshBody();
  }

  _buildGroups() {
    this.enemies = this.physics.add.group();
    this.attackHitboxes = this.physics.add.group();
  }

  _buildTim() {
    this.tim = new Tim(this, 460, GEM_Y, this.attackHitboxes);
  }

  _buildHUD() {
    this.livesText = this.add.text(16, 9, '❤️ ❤️ ❤️', {
      fontSize: '18px', fontFamily: 'monospace',
    }).setDepth(DEPTH.HUD);

    this.waveText = this.add.text(W / 2, 9, 'WAVE 1 / 5', {
      fontSize: '15px', fontFamily: 'monospace', color: '#00ffff',
    }).setOrigin(0.5, 0).setDepth(DEPTH.HUD);

    this.scoreText = this.add.text(W - 16, 9, 'SCORE: 0', {
      fontSize: '14px', fontFamily: 'monospace', color: '#ffd700',
    }).setOrigin(1, 0).setDepth(DEPTH.HUD);
  }

  update() {
    this.tim.update();
  }
}
