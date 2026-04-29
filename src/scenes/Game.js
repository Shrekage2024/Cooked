import { W, H, HUD_HEIGHT, FLOOR_Y, GEM_X, GEM_Y, DEPTH, SPAWN_Y, BETWEEN_WAVES_DELAY } from '../constants.js';
import { Tim } from '../entities/Tim.js';
import { Scout } from '../entities/Scout.js';
import { Brute } from '../entities/Brute.js';
import { WaveManager } from '../systems/WaveManager.js';
import { CollisionHandler } from '../systems/CollisionHandler.js';

// Positions for the forest obstacles — scattered across the play area
const TREE_POSITIONS = [
  [120, 165], [390, 145], [650, 160],
  [65, 275],  [250, 265], [470, 280], [680, 270],
  [155, 385], [360, 395], [600, 380], [730, 390],
];

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
    this._buildForest();
    this._buildGem();
    this._buildGroups();
    this._buildTim();
    this._collisions = new CollisionHandler(this);
    this._collisions.setup();
    // Forest colliders added after collision handler (enemies/tim groups exist)
    this.physics.add.collider(this.enemies, this.trees);
    this.physics.add.collider(this.tim.sprite, this.trees);
    this._buildHUD();
    this._buildRestartButton();
    this._startWave();

    // Re-focus canvas on click so keyboard never stops working
    this.input.on('pointerdown', () => this.sys.game.canvas.focus());
  }

  _buildRestartButton() {
    const restartBtn = this.add.text(W / 2, H - 20, 'RESTART GAME', {
      fontSize: '14px',
      fontFamily: 'monospace',
      color: '#aaaaaa',
      backgroundColor: '#222222',
      padding: { x: 10, y: 5 }
    })
    .setOrigin(0.5, 1)
    .setInteractive({ useHandCursor: true })
    .setDepth(DEPTH.HUD);

    restartBtn.on('pointerover', () => restartBtn.setColor('#ffffff').setBackgroundColor('#444444'));
    restartBtn.on('pointerout', () => restartBtn.setColor('#aaaaaa').setBackgroundColor('#222222'));
    restartBtn.on('pointerdown', () => {
      this.scene.start('Boot'); // Restart from boot to reset everything
    });
  }

  _buildBackground() {
    this.add.image(W / 2, H / 2, 'bg').setDisplaySize(W, H).setDepth(DEPTH.BG);
    this.add.rectangle(W / 2, HUD_HEIGHT / 2, W, HUD_HEIGHT, 0x000000, 0.85).setDepth(DEPTH.HUD - 1);
    this.add.rectangle(W / 2, H - 30, W, 60, 0x1a1208).setDepth(DEPTH.BG);
    this.add.rectangle(W / 2, FLOOR_Y, W, 3, 0x6a4a20).setDepth(DEPTH.BG);
  }

  _buildForest() {
    this.trees = this.physics.add.staticGroup();
    TREE_POSITIONS.forEach(([x, y]) => {
      const tree = this.trees.create(x, y, 'tree');
      tree.setDisplaySize(120, 120);
      tree.setDepth(DEPTH.ENEMY - 1);
      // Unscaled size is 512x512.
      // Circular hitbox around the trunk, let's use 180 unscaled radius, offset to the bottom center.
      tree.body.setCircle(180, 76, 140);
      tree.refreshBody();
    });
  }

  _buildGem() {
    // Shift the gem slightly up visually if it touches the bottom bounds of the image
    this.gem = this.add.image(GEM_X, GEM_Y - 20, 'gem').setDepth(DEPTH.GEM);
    this.gem.setDisplaySize(120, 120);
    // Since displaySize is 120, the base scale is ~0.234
    this.tweens.add({
      targets: this.gem, scaleX: 0.26, scaleY: 0.26,
      duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
    });
    this.gemZone = this.physics.add.staticImage(GEM_X, GEM_Y - 20, 'gem').setAlpha(0);
    this.gemZone.setDisplaySize(120, 120);
    // Hitbox for the crystal itself
    this.gemZone.body.setCircle(200, 56, 112);
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
    const x = Phaser.Math.Between(40, W - 40);
    const enemy = type === 'brute' ? new Brute(this, x, SPAWN_Y) : new Scout(this, x, SPAWN_Y);

    // enemies.add(enemy, true) creates the physics body AND adds to display list.
    this.enemies.add(enemy, true);
    enemy.setupPhysics();

    enemy.body.setCollideWorldBounds(true);
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

  enemyDied() { this._checkWaveComplete(); }

  loseLife() {
    if (this.lives <= 0) return;
    this.lives = Math.max(0, this.lives - 1);
    this.updateGemHUD();
    this.cameras.main.shake(250, 0.012);
    if (this.lives <= 0) this.gameOver();
  }

  updateGemHUD() {
    this.waveText.setText(`GEMS: ${this.lives} | WAVE ${this._waveManager.current + 1}`);
  }

  updatePlayerHealth(hp) {
    this.livesText.setText(hp > 0 ? '❤️ '.repeat(hp).trim() : '💔');
  }

  gameOver() {
    this.time.delayedCall(500, () => this.scene.start('GameOver'));
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
    
    this._showWaveCompleteBanner();

    this.time.delayedCall(BETWEEN_WAVES_DELAY, () => {
      this._waveManager.advance();
      this._startWave();
    });
  }

  _showWaveCompleteBanner() {
    const t = this.add.text(W / 2, H / 2 - 20, 'WAVE COMPLETE!', {
      fontSize: '52px', fontFamily: 'monospace',
      color: '#00ff88', stroke: '#003300', strokeThickness: 5,
    }).setOrigin(0.5).setDepth(DEPTH.HUD);
    this.tweens.add({
      targets: t, alpha: 0, y: H / 2 - 80, duration: 1800, ease: 'Power2',
      onComplete: () => t.destroy(),
    });
  }

  update(time, delta) {
    this.tim.update();
    this.enemies.getChildren().forEach(e => {
        if (e && e.active) e.update(time, delta);
    });
  }
}
