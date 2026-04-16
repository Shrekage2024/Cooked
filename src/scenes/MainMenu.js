import { W, H } from '../constants.js';

export class MainMenu extends Phaser.Scene {
  constructor() { super('MainMenu'); }

  create() {
    this.add.rectangle(W / 2, H / 2, W, H, 0x0a0a1a);

    this.add.text(W / 2, 150, 'TIM', {
      fontSize: '88px', fontFamily: 'monospace',
      color: '#00ffff', stroke: '#003355', strokeThickness: 6,
    }).setOrigin(0.5);

    this.add.text(W / 2, 255, 'WAVE DEFENSE', {
      fontSize: '28px', fontFamily: 'monospace', color: '#88aaff',
    }).setOrigin(0.5);

    this.add.image(W / 2, 380, 'tim').setScale(3);

    const blink = this.add.text(W / 2, 520, 'PRESS SPACE TO START', {
      fontSize: '20px', fontFamily: 'monospace', color: '#ffd700',
    }).setOrigin(0.5);

    this.tweens.add({ targets: blink, alpha: 0, duration: 550, yoyo: true, repeat: -1 });
    this.input.keyboard.once('keydown-SPACE', () => this.scene.start('Game'));
  }
}
