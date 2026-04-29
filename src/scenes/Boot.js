export class Boot extends Phaser.Scene {
  constructor() { super('Boot'); }

  preload() {
    this.load.spritesheet('tim', 'assets/images/tim.png', { frameWidth: 512, frameHeight: 512 });
    this.load.spritesheet('bug', 'assets/images/bug.png', { frameWidth: 470, frameHeight: 465 });
    this.load.spritesheet('shockwave', 'assets/images/shockwave.png', { frameWidth: 512, frameHeight: 512 });
    this.load.image('bg', 'assets/images/bg.png');
    this.load.image('gem', 'assets/images/gem.png');
    this.load.image('tree', 'assets/images/tree.png');
    this.load.image('laser-bolt', 'assets/images/laser-bolt.png');
  }

  create() {
    // Generate orange texture procedurally
    const og = this.make.graphics({ x: 0, y: 0, add: false });
    og.fillStyle(0xff7700, 1);
    og.fillCircle(32, 32, 30);
    og.fillStyle(0xffaa33, 0.6);
    og.fillCircle(22, 20, 11);
    og.fillStyle(0x33aa00, 1);
    og.fillRect(30, 2, 5, 10);
    og.fillStyle(0x226600, 0.8);
    og.fillRect(32, 2, 8, 4);
    og.generateTexture('orange', 64, 64);
    og.destroy();

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
