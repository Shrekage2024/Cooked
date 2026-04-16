export class Boot extends Phaser.Scene {
  constructor() { super('Boot'); }

  preload() {
    const g = this.make.graphics({ add: false });

    // TIM: 56×60 — rectangular hammer head, blue body, saw-blade hands
    g.fillStyle(0x555555); g.fillRect(0, 0, 56, 18);       // hammer head (dark gray)
    g.fillStyle(0xaa3300); g.fillRect(8, 0, 40, 7);         // red bandana
    g.fillStyle(0x00ccff); g.fillRect(10, 5, 10, 8); g.fillRect(36, 5, 10, 8); // glowing eyes
    g.fillStyle(0x2a3a5a); g.fillRect(8, 16, 40, 38);       // blue body
    g.fillStyle(0xc45508); g.fillRect(2, 22, 8, 26);        // left arm (orange)
    g.fillStyle(0xaaaaaa); g.fillCircle(4, 50, 9);          // left saw blade (circle)
    g.fillStyle(0x333333); g.fillCircle(4, 50, 5);          // saw centre
    g.fillStyle(0xc45508); g.fillRect(46, 22, 8, 26);       // right arm (orange)
    g.fillStyle(0xaaaaaa); g.fillCircle(52, 50, 9);         // right saw blade
    g.fillStyle(0x333333); g.fillCircle(52, 50, 5);         // saw centre
    g.generateTexture('tim', 56, 60); g.clear();

    // Scout: 28×28 — small red alien
    g.fillStyle(0xff3333); g.fillRect(0, 0, 28, 28);
    g.fillStyle(0xffff00); g.fillRect(5, 7, 6, 8); g.fillRect(17, 7, 6, 8);
    g.generateTexture('scout', 28, 28); g.clear();

    // Brute: 42×42 — large dark-red alien
    g.fillStyle(0x8b0000); g.fillRect(0, 0, 42, 42);
    g.fillStyle(0xff6600); g.fillRect(7, 10, 10, 12); g.fillRect(25, 10, 10, 12);
    g.generateTexture('brute', 42, 42); g.clear();

    // Gem: 28×28 — cyan diamond
    g.fillStyle(0x00ffff);
    g.fillTriangle(14, 0, 28, 14, 14, 28);
    g.fillTriangle(14, 0, 0, 14, 14, 28);
    g.generateTexture('gem', 28, 28); g.clear();

    // Attack hitbox: 80×60 — glowing yellow saw-swing
    g.fillStyle(0xffee00, 0.75); g.fillRect(0, 0, 80, 60);
    g.lineStyle(2, 0xffffff, 0.9); g.strokeRect(1, 1, 78, 58);
    g.generateTexture('hitbox-attack', 80, 60); g.clear();

    // Slam hitbox: 240×240 — orange shockwave circle
    g.fillStyle(0xff6600, 0.55); g.fillCircle(120, 120, 120);
    g.lineStyle(3, 0xffaa00, 0.9); g.strokeCircle(120, 120, 118);
    g.generateTexture('hitbox-slam', 240, 240); g.clear();

    // Tree: 32×48 — brown trunk + dark green canopy
    g.fillStyle(0x4a2a0a); g.fillRect(12, 28, 8, 20);      // trunk
    g.fillStyle(0x1a5c1a); g.fillCircle(16, 20, 16);        // dark canopy
    g.fillStyle(0x2d8a2d); g.fillCircle(16, 16, 12);        // lighter canopy highlight
    g.generateTexture('tree', 32, 48); g.clear();

    g.destroy();
  }

  create() { this.scene.start('MainMenu'); }
}
