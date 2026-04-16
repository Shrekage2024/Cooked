import { W, H, HUD_HEIGHT, FLOOR_Y, GEM_X, GEM_Y, DEPTH, SPAWN_Y, BETWEEN_WAVES_DELAY } from '../constants.js';
import { Tim } from '../entities/Tim.js';
import { Scout } from '../entities/Scout.js';
import { Brute } from '../entities/Brute.js';
import { WaveManager } from '../systems/WaveManager.js';
import { CollisionHandler } from '../systems/CollisionHandler.js';

export class Game extends Phaser.Scene {
  constructor() { super('Game'); }

  create() {
    this.lives = 3;
    this.score = 0;
    this._waveManager = new WaveManager();
    this._totalInWave = 0;
    this._spawnedInWave = 0;
    this._waveComplete = false;

    this._buildBackground();
    this._buildGem();
    this._buildGroups();
    this._buildTim();
    this._collisions = new CollisionHandler(this);
    this._collisions.setup();
    this._buildHUD();
    this._startWave();
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

  _startWave() {
    const n = this._waveManager.current;
    const queue = this._waveManager.buildSpawnQueue(n);
    this._totalInWave = queue.length;
    this._spawnedInWave = 0;
    this._waveComplete = false;

    this.waveText.setText(`WAVE ${n + 1} / ${this._waveManager.total}`);
    this._showWaveBanner(n + 1);

    let idx = 0;
    this.time.addEvent({
      delay: this._waveManager.getWaveConfig(n).interval,
      repeat: queue.length - 1,
      callback: () => this._spawnEnemy(queue[idx++]),
    });
  }

  _spawnEnemy(type) {
    this._spawnedInWave++;
    const x = Phaser.Math.Between(28, W - 28);
    const enemy = type === 'brute' ? new Brute(this, x, SPAWN_Y) : new Scout(this, x, SPAWN_Y);
    this.enemies.add(enemy, true);
  }

  _showWaveBanner(num) {
    const t = this.add.text(W / 2, H / 2 - 20, `WAVE ${num}`, {
      fontSize: '52px', fontFamily: 'monospace',
      color: '#00ffff', stroke: '#003355', strokeThickness: 5,
    }).setOrigin(0.5).setDepth(DEPTH.HUD);

    this.tweens.add({
      targets: t, alpha: 0, y: H / 2 - 80, duration: 1400, ease: 'Power2',
      onComplete: () => t.destroy(),
    });
  }

  addScore(points) {
    this.score += points;
    this.scoreText.setText(`SCORE: ${this.score}`);
  }

  enemyDied() {
    this._checkWaveComplete();
  }

  loseLife() {
    if (this.lives <= 0) return;
    this.lives = Math.max(0, this.lives - 1);
    this.livesText.setText(this.lives > 0 ? '❤️ '.repeat(this.lives).trim() : '💔');
    this.cameras.main.shake(250, 0.012);
    if (this.lives <= 0) {
      this.time.delayedCall(500, () => this.scene.start('GameOver'));
    }
  }

  _checkWaveComplete() {
    if (this._waveComplete) return;
    if (this._spawnedInWave < this._totalInWave) return;
    if (this.enemies.countActive(true) > 0) return;

    this.addScore(100);
    this._waveComplete = true;

    if (this._waveManager.isLastWave) {
      this.time.delayedCall(1000, () => this.scene.start('YouWin', { score: this.score }));
      return;
    }

    this.time.delayedCall(BETWEEN_WAVES_DELAY, () => {
      this._waveManager.advance();
      this._startWave();
    });
  }

  update() {
    this.tim.update();
  }
}
