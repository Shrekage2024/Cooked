export class Boot extends Phaser.Scene {
  constructor() { super('Boot'); }

  preload() {
    this.load.spritesheet('tim', 'assets/images/tim.png', { frameWidth: 512, frameHeight: 512 });
    this.load.spritesheet('bug', 'assets/images/bug.png', { frameWidth: 470, frameHeight: 465 });
    this.load.spritesheet('shockwave', 'assets/images/shockwave.png', { frameWidth: 512, frameHeight: 512 });
    this.load.image('bg', 'assets/images/bg.png');
    this.load.image('gem', 'assets/images/gem.png');
    this.load.image('tree', 'assets/images/tree.png');
  }

  create() {
    this.anims.create({
      key: 'tim-walk',
      frames: this.anims.generateFrameNumbers('tim', { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1
    });

    this.anims.create({
      key: 'bug-walk',
      frames: this.anims.generateFrameNumbers('bug', { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1
    });

    this.anims.create({
      key: 'shockwave-anim',
      frames: this.anims.generateFrameNumbers('shockwave', { start: 0, end: 3 }),
      frameRate: 20,
      repeat: 0
    });

    this.scene.start('MainMenu');
  }
}
