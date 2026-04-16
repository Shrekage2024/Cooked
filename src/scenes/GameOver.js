import { W, H } from '../constants.js';

export class GameOver extends Phaser.Scene {
  constructor() { super('GameOver'); }

  create() {
    this.add.rectangle(W / 2, H / 2, W, H, 0x0a0007);

    this.add.text(W / 2, 200, 'GAME OVER', {
      fontSize: '64px', fontFamily: 'monospace',
      color: '#ff3333', stroke: '#330000', strokeThickness: 6,
    }).setOrigin(0.5);

    this.add.text(W / 2, 300, 'The gem has fallen.', {
      fontSize: '22px', fontFamily: 'monospace', color: '#aaaaaa',
    }).setOrigin(0.5);

    const btn = this.add.text(W / 2, 420, '[ PLAY AGAIN ]', {
      fontSize: '24px', fontFamily: 'monospace', color: '#ffd700',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btn.on('pointerover', () => btn.setColor('#ffffff'));
    btn.on('pointerout',  () => btn.setColor('#ffd700'));
    btn.on('pointerdown', () => this.scene.start('Game'));
    this.input.keyboard.once('keydown-SPACE', () => this.scene.start('Game'));
  }
}
