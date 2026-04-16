export class MainMenu extends Phaser.Scene {
  constructor() { super('MainMenu'); }
  create() { this.scene.start('Game'); }
}
