export class Boot extends Phaser.Scene {
  constructor() { super('Boot'); }

  preload() {
    const g = this.make.graphics({ add: false });

    // TIM: 48×56 — blue body, orange bandana, cyan eyes
    g.fillStyle(0x2a3a5a); g.fillRect(0, 0, 48, 56);
    g.fillStyle(0xc45508); g.fillRect(8, 2, 32, 10);
    g.fillStyle(0x00ccff); g.fillRect(14, 18, 8, 8); g.fillRect(26, 18, 8, 8);
    g.generateTexture('tim', 48, 56); g.clear();

    // Scout: 28×28 — small red alien
    g.fillStyle(0xff3333); g.fillRect(0, 0, 28, 28);
    g.fillStyle(0xffff00); g.fillRect(5, 7, 6, 8); g.fillRect(17, 7, 6, 8);
    g.generateTexture('scout', 28, 28); g.clear();

    // Brute: 42×42 — large dark-red alien
    g.fillStyle(0x8b0000); g.fillRect(0, 0, 42, 42);
    g.fillStyle(0xff6600); g.fillRect(7, 10, 10, 12); g.fillRect(25, 10, 10, 12);
    g.generateTexture('brute', 42, 42); g.clear();

    // Gem: 28×28 — cyan diamond (two triangles)
    g.fillStyle(0x00ffff);
    g.fillTriangle(14, 0, 28, 14, 14, 28);
    g.fillTriangle(14, 0, 0, 14, 14, 28);
    g.generateTexture('gem', 28, 28); g.clear();

    // Attack hitbox: 80×60 — transparent yellow rect
    g.fillStyle(0xffff00, 0.25); g.fillRect(0, 0, 80, 60);
    g.generateTexture('hitbox-attack', 80, 60); g.clear();

    // Slam hitbox: 240×240 — transparent orange circle
    g.fillStyle(0xff8800, 0.2); g.fillCircle(120, 120, 120);
    g.generateTexture('hitbox-slam', 240, 240); g.clear();

    g.destroy();
  }

  create() { this.scene.start('MainMenu'); }
}
