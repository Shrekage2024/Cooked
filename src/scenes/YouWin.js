import { W, H } from '../constants.js';

export class YouWin extends Phaser.Scene {
  constructor() { super('YouWin'); }

  create(data) {
    this.add.rectangle(W / 2, H / 2, W, H, 0x001a00);

    this.add.text(W / 2, 180, 'LEVEL COMPLETE!', {
      fontSize: '52px', fontFamily: 'monospace',
      color: '#00ff88', stroke: '#003300', strokeThickness: 5,
    }).setOrigin(0.5);

    this.add.text(W / 2, 270, 'The gem is safe.', {
      fontSize: '22px', fontFamily: 'monospace', color: '#aaaaaa',
    }).setOrigin(0.5);

    this.add.text(W / 2, 340, `FINAL SCORE: ${data?.score ?? 0}`, {
      fontSize: '26px', fontFamily: 'monospace', color: '#ffd700',
    }).setOrigin(0.5);

    const btn = this.add.text(W / 2, 440, '[ PLAY AGAIN ]', {
      fontSize: '24px', fontFamily: 'monospace', color: '#00ffff',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btn.on('pointerover', () => btn.setColor('#ffffff'));
    btn.on('pointerout',  () => btn.setColor('#00ffff'));
    btn.on('pointerdown', () => this.scene.start('Game'));
    this.input.keyboard.once('keydown-SPACE', () => this.scene.start('Game'));
  }
}
