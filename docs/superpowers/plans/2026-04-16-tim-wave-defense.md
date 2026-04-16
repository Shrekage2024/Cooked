# TIM Wave Defense — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fully playable browser-based 2D wave defense game where the player controls TIM with keyboard input to protect a gem from 5 waves of alien enemies.

**Architecture:** Vanilla JS + Phaser 3 (CDN), no build step required. Game logic splits across Phaser Scene classes, entity classes (Tim, Scout, Brute), and pure-logic systems (WaveManager, CollisionHandler). Served with a static file server. WaveManager is unit-tested using Node's built-in test runner.

**Tech Stack:** Phaser 3.70.0 (CDN), ES Modules (native browser), Node.js built-in test runner (`node --test`), `npx serve .` for local dev.

---

### Task 1: Project Scaffold

**Files:**
- Create: `index.html`
- Create: `package.json`
- Create: `src/constants.js`
- Create: `src/main.js`
- Create (stubs): `src/scenes/Boot.js`, `MainMenu.js`, `Game.js`, `GameOver.js`, `YouWin.js`
- Create (stubs): `src/entities/Tim.js`, `Enemy.js`, `Scout.js`, `Brute.js`
- Create (stubs): `src/systems/WaveManager.js`, `CollisionHandler.js`
- Create: `tests/WaveManager.test.mjs`
- Create: `.gitignore`

- [ ] **Step 1: Create `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>TIM: Wave Defense</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #000; display: flex; justify-content: center; align-items: center; height: 100vh; overflow: hidden; }
  </style>
</head>
<body>
  <script src="https://cdn.jsdelivr.net/npm/phaser@3.70.0/dist/phaser.min.js"></script>
  <script type="module" src="src/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create `package.json`**

```json
{
  "name": "tim-wave-defense",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "test": "node --test tests/",
    "serve": "npx serve ."
  }
}
```

- [ ] **Step 3: Create `src/constants.js`**

```js
export const W = 800;
export const H = 600;
export const HUD_HEIGHT = 36;
export const FLOOR_Y = 520;
export const GEM_X = 400;
export const GEM_Y = 490;
export const SPAWN_Y = 70;
export const SPEED_TIM = 200;
export const ATTACK_DAMAGE = 1;
export const SLAM_DAMAGE = 2;
export const ATTACK_DURATION = 200;
export const SLAM_DURATION = 300;
export const ATTACK_COOLDOWN = 500;
export const SLAM_COOLDOWN = 1500;
export const SLAM_KNOCKBACK = 150;
export const BETWEEN_WAVES_DELAY = 3000;
export const DEPTH = { BG: 0, GEM: 5, ENEMY: 10, TIM: 20, HITBOX: 30, HUD: 100 };
```

- [ ] **Step 4: Create `src/main.js`**

```js
import { Boot } from './scenes/Boot.js';
import { MainMenu } from './scenes/MainMenu.js';
import { Game } from './scenes/Game.js';
import { GameOver } from './scenes/GameOver.js';
import { YouWin } from './scenes/YouWin.js';
import { W, H } from './constants.js';

new Phaser.Game({
  type: Phaser.AUTO,
  width: W,
  height: H,
  backgroundColor: '#0a0a1a',
  physics: { default: 'arcade', arcade: { debug: false } },
  scene: [Boot, MainMenu, Game, GameOver, YouWin],
});
```

- [ ] **Step 5: Create stub scene files**

`src/scenes/Boot.js`:
```js
export class Boot extends Phaser.Scene {
  constructor() { super('Boot'); }
  preload() {}
  create() { this.scene.start('MainMenu'); }
}
```

`src/scenes/MainMenu.js`:
```js
export class MainMenu extends Phaser.Scene {
  constructor() { super('MainMenu'); }
  create() { this.scene.start('Game'); }
}
```

`src/scenes/Game.js`:
```js
export class Game extends Phaser.Scene {
  constructor() { super('Game'); }
  create() {}
  update() {}
}
```

`src/scenes/GameOver.js`:
```js
export class GameOver extends Phaser.Scene {
  constructor() { super('GameOver'); }
  create() {}
}
```

`src/scenes/YouWin.js`:
```js
export class YouWin extends Phaser.Scene {
  constructor() { super('YouWin'); }
  create() {}
}
```

- [ ] **Step 6: Create stub entity and system files**

`src/entities/Tim.js`:
```js
export class Tim {
  constructor(scene, x, y, hitboxGroup) {}
  update() {}
}
```

`src/entities/Enemy.js`:
```js
export class Enemy extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y, texture, config) { super(scene, x, y, texture); }
}
```

`src/entities/Scout.js`:
```js
import { Enemy } from './Enemy.js';
export class Scout extends Enemy {
  constructor(scene, x, y) { super(scene, x, y, 'scout', {}); }
}
```

`src/entities/Brute.js`:
```js
import { Enemy } from './Enemy.js';
export class Brute extends Enemy {
  constructor(scene, x, y) { super(scene, x, y, 'brute', {}); }
}
```

`src/systems/WaveManager.js`:
```js
export const WAVES = [];
export class WaveManager {}
```

`src/systems/CollisionHandler.js`:
```js
export class CollisionHandler {
  constructor(scene) { this.scene = scene; }
  setup() {}
}
```

`tests/WaveManager.test.mjs`:
```js
import { test } from 'node:test';
import assert from 'node:assert';
// placeholder — replaced in Task 2
test('placeholder', () => { assert.ok(true); });
```

- [ ] **Step 7: Create `.gitignore`**

```
node_modules/
.DS_Store
*.log
.superpowers/
```

- [ ] **Step 8: Verify the project loads**

Run:
```bash
npx serve .
```

Open `http://localhost:3000` in browser.

Expected: Black screen, zero console errors. (Scene chain Boot → MainMenu → Game runs silently through stubs.)

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: project scaffold — Phaser 3 CDN, scene/entity/system stubs, constants"
```

---

### Task 2: WaveManager — Pure Logic + Tests

**Files:**
- Modify: `src/systems/WaveManager.js`
- Modify: `tests/WaveManager.test.mjs`

- [ ] **Step 1: Write failing tests**

Replace `tests/WaveManager.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert';
import { WaveManager, WAVES } from '../src/systems/WaveManager.js';

test('starts at wave 0', () => {
  assert.strictEqual(new WaveManager().current, 0);
});

test('total is 5', () => {
  assert.strictEqual(new WaveManager().total, 5);
});

test('getWaveConfig(0) has 5 scouts', () => {
  const cfg = new WaveManager().getWaveConfig(0);
  const scouts = cfg.spawns.find(s => s.type === 'scout');
  assert.strictEqual(scouts.count, 5);
});

test('advance increments current', () => {
  const wm = new WaveManager();
  wm.advance();
  assert.strictEqual(wm.current, 1);
});

test('advance does not exceed last wave index', () => {
  const wm = new WaveManager();
  for (let i = 0; i < 10; i++) wm.advance();
  assert.strictEqual(wm.current, 4);
});

test('isLastWave true at index 4', () => {
  const wm = new WaveManager();
  for (let i = 0; i < 4; i++) wm.advance();
  assert.ok(wm.isLastWave);
});

test('buildSpawnQueue(2) returns 7 entries (6 scouts + 1 brute)', () => {
  assert.strictEqual(new WaveManager().buildSpawnQueue(2).length, 7);
});

test('buildSpawnQueue only produces valid enemy types', () => {
  const wm = new WaveManager();
  for (let i = 0; i < 5; i++) {
    wm.buildSpawnQueue(i).forEach(type => {
      assert.ok(['scout', 'brute'].includes(type), `unexpected type: ${type}`);
    });
  }
});

test('all WAVES have spawns array and interval > 0', () => {
  WAVES.forEach((w, i) => {
    assert.ok(Array.isArray(w.spawns), `wave ${i}: missing spawns`);
    assert.ok(w.interval > 0, `wave ${i}: interval must be > 0`);
  });
});
```

- [ ] **Step 2: Run tests — confirm all fail**

```bash
npm test
```

Expected: 9 failures — `WaveManager is not a constructor` or similar.

- [ ] **Step 3: Implement `src/systems/WaveManager.js`**

```js
export const WAVES = [
  { spawns: [{ type: 'scout', count: 5 }],                              interval: 1200 },
  { spawns: [{ type: 'scout', count: 7 }],                              interval: 1000 },
  { spawns: [{ type: 'scout', count: 6 }, { type: 'brute', count: 1 }], interval: 1000 },
  { spawns: [{ type: 'scout', count: 5 }, { type: 'brute', count: 2 }], interval: 900  },
  { spawns: [{ type: 'scout', count: 4 }, { type: 'brute', count: 3 }], interval: 800  },
];

export class WaveManager {
  constructor() { this._index = 0; }

  get current() { return this._index; }
  get total() { return WAVES.length; }
  get isLastWave() { return this._index >= WAVES.length - 1; }

  getWaveConfig(index = this._index) { return WAVES[index]; }

  buildSpawnQueue(index = this._index) {
    const queue = [];
    WAVES[index].spawns.forEach(({ type, count }) => {
      for (let i = 0; i < count; i++) queue.push(type);
    });
    for (let i = queue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [queue[i], queue[j]] = [queue[j], queue[i]];
    }
    return queue;
  }

  advance() { if (!this.isLastWave) this._index++; }
}
```

- [ ] **Step 4: Run tests — confirm all pass**

```bash
npm test
```

Expected: 9 passing, 0 failures.

- [ ] **Step 5: Commit**

```bash
git add src/systems/WaveManager.js tests/WaveManager.test.mjs
git commit -m "feat: WaveManager — wave config, spawn queue, advance logic with 9 passing tests"
```

---

### Task 3: Boot Scene — Placeholder Texture Generation

**Files:**
- Modify: `src/scenes/Boot.js`

- [ ] **Step 1: Implement Boot with generated textures**

Replace `src/scenes/Boot.js`:

```js
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
```

- [ ] **Step 2: Verify — no texture errors**

Open `http://localhost:3000`. Expected: still black screen (stubs), but zero "missing texture" console warnings.

- [ ] **Step 3: Commit**

```bash
git add src/scenes/Boot.js
git commit -m "feat: Boot scene — generate all placeholder textures programmatically"
```

---

### Task 4: MainMenu Scene

**Files:**
- Modify: `src/scenes/MainMenu.js`

- [ ] **Step 1: Implement MainMenu**

Replace `src/scenes/MainMenu.js`:

```js
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
```

- [ ] **Step 2: Manual test**

Open `http://localhost:3000`.

Expected:
- "TIM" in large cyan text
- "WAVE DEFENSE" subtitle in blue
- TIM placeholder sprite (blue rectangle) at center
- Blinking "PRESS SPACE TO START" in gold
- Pressing SPACE transitions to Game scene (black screen — that's fine for now)

- [ ] **Step 3: Commit**

```bash
git add src/scenes/MainMenu.js
git commit -m "feat: MainMenu scene — title, TIM sprite, blinking start prompt"
```

---

### Task 5: Game Scene Skeleton — Background, Gem, HUD

**Files:**
- Modify: `src/scenes/Game.js`

- [ ] **Step 1: Implement Game skeleton (no enemies, no TIM yet)**

Replace `src/scenes/Game.js`:

```js
import { W, H, HUD_HEIGHT, FLOOR_Y, GEM_X, GEM_Y, DEPTH } from '../constants.js';

export class Game extends Phaser.Scene {
  constructor() { super('Game'); }

  create() {
    this.lives = 3;
    this.score = 0;

    this._buildBackground();
    this._buildGem();
    this._buildHUD();
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

  update() {}
}
```

- [ ] **Step 2: Manual test**

Press SPACE on MainMenu.

Expected:
- Dark background
- Cyan gem pulsing at bottom-center
- HUD strip: ❤️❤️❤️ | WAVE 1/5 | SCORE: 0
- Brown floor line
- No console errors

- [ ] **Step 3: Commit**

```bash
git add src/scenes/Game.js
git commit -m "feat: Game scene skeleton — background, pulsing gem, HUD strip"
```

---

### Task 6: TIM — Movement

**Files:**
- Modify: `src/entities/Tim.js`
- Modify: `src/scenes/Game.js`

- [ ] **Step 1: Implement Tim movement in `src/entities/Tim.js`**

Replace `src/entities/Tim.js`:

```js
import {
  HUD_HEIGHT, FLOOR_Y, SPEED_TIM, DEPTH,
  ATTACK_COOLDOWN, SLAM_COOLDOWN, ATTACK_DAMAGE, SLAM_DAMAGE,
  ATTACK_DURATION, SLAM_DURATION,
} from '../constants.js';

export class Tim {
  constructor(scene, x, y, hitboxGroup) {
    this.scene = scene;
    this._hitboxGroup = hitboxGroup;
    this._facing = 'right';
    this._attackCooldown = 0;
    this._slamCooldown = 0;

    this.sprite = scene.physics.add.image(x, y, 'tim').setDepth(DEPTH.TIM);
    this.sprite.setCollideWorldBounds(true);

    this._cursors = scene.input.keyboard.createCursorKeys();
    this._keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this._keyS = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
  }

  get x() { return this.sprite.x; }
  get y() { return this.sprite.y; }

  update() {
    this._move();
    this._clampToPlayArea();
    this._tickCooldowns();
  }

  _move() {
    const { left, right, up, down } = this._cursors;
    const vx = left.isDown ? -SPEED_TIM : right.isDown ? SPEED_TIM : 0;
    const vy = up.isDown ? -SPEED_TIM : down.isDown ? SPEED_TIM : 0;
    this.sprite.setVelocity(vx, vy);

    if (left.isDown)       this._facing = 'left';
    else if (right.isDown) this._facing = 'right';
    else if (up.isDown)    this._facing = 'up';
    else if (down.isDown)  this._facing = 'down';
  }

  _clampToPlayArea() {
    const half = this.sprite.height / 2;
    this.sprite.y = Phaser.Math.Clamp(
      this.sprite.y,
      HUD_HEIGHT + half + 4,
      FLOOR_Y - half - 4,
    );
  }

  _tickCooldowns() {
    const dt = this.scene.game.loop.delta;
    this._attackCooldown = Math.max(0, this._attackCooldown - dt);
    this._slamCooldown   = Math.max(0, this._slamCooldown - dt);
  }
}
```

- [ ] **Step 2: Wire Tim into Game scene**

In `src/scenes/Game.js`, add these imports at the top:

```js
import { Tim } from '../entities/Tim.js';
```

Add two new methods and call them in `create()` (after `_buildGem`, before `_buildHUD`):

```js
create() {
  this.lives = 3;
  this.score = 0;

  this._buildBackground();
  this._buildGem();
  this._buildGroups();   // NEW
  this._buildTim();      // NEW
  this._buildHUD();
}

_buildGroups() {
  this.enemies = this.physics.add.group();
  this.attackHitboxes = this.physics.add.group();
}

_buildTim() {
  this.tim = new Tim(this, 460, GEM_Y, this.attackHitboxes);
}
```

Replace `update()`:

```js
update() {
  this.tim.update();
}
```

- [ ] **Step 3: Manual test**

Expected:
- Blue TIM rectangle visible just right of the gem
- Arrow keys move TIM smoothly in 4 directions
- TIM cannot enter the HUD strip or go below the floor line
- TIM cannot exit the canvas

- [ ] **Step 4: Commit**

```bash
git add src/entities/Tim.js src/scenes/Game.js
git commit -m "feat: Tim — 4-directional movement clamped to play area"
```

---

### Task 7: TIM — Attack (A Key)

**Files:**
- Modify: `src/entities/Tim.js`

- [ ] **Step 1: Add `_handleAttack` and `_spawnHitbox` to Tim**

Add these methods to the `Tim` class and call `_handleAttack()` from `update()`:

```js
// Updated update():
update() {
  this._move();
  this._clampToPlayArea();
  this._handleAttack();
  this._tickCooldowns();
}

_handleAttack() {
  if (this._attackCooldown > 0) return;
  if (!Phaser.Input.Keyboard.JustDown(this._keyA)) return;
  this._attackCooldown = ATTACK_COOLDOWN;
  this._spawnHitbox('attack');
}

_spawnHitbox(type) {
  const isSlam = type === 'slam';
  const key      = isSlam ? 'hitbox-slam' : 'hitbox-attack';
  const duration = isSlam ? SLAM_DURATION : ATTACK_DURATION;
  const damage   = isSlam ? SLAM_DAMAGE   : ATTACK_DAMAGE;

  const offsets = {
    right: [isSlam ? 0 : 44,  0],
    left:  [isSlam ? 0 : -44, 0],
    up:    [0, isSlam ? 0 : -38],
    down:  [0, isSlam ? 0 :  38],
  };
  const [ox, oy] = offsets[this._facing];

  const hb = this._hitboxGroup.create(this.x + ox, this.y + oy, key);
  hb.setAlpha(0);
  hb.damage = damage;
  hb.isSlam = isSlam;
  hb.hitEnemies = new Set();

  this.scene.time.delayedCall(duration, () => { if (hb.active) hb.destroy(); });
}
```

- [ ] **Step 2: Manual test with visible hitbox**

Temporarily change `hb.setAlpha(0)` to `hb.setAlpha(0.5)` in `_spawnHitbox`.

Expected:
- Press A → yellow rectangle appears briefly in TIM's facing direction, then vanishes
- Spam A: only fires every 500ms
- Hitbox offset matches the direction TIM last moved

Revert `setAlpha` back to `0` after confirming.

- [ ] **Step 3: Commit**

```bash
git add src/entities/Tim.js
git commit -m "feat: Tim attack — A key spawns directional hitbox, 500ms cooldown"
```

---

### Task 8: TIM — Slam (S Key)

**Files:**
- Modify: `src/entities/Tim.js`

- [ ] **Step 1: Add `_handleSlam` to Tim and call it from `update()`**

```js
// Updated update():
update() {
  this._move();
  this._clampToPlayArea();
  this._handleAttack();
  this._handleSlam();    // NEW
  this._tickCooldowns();
}

_handleSlam() {
  if (this._slamCooldown > 0) return;
  if (!Phaser.Input.Keyboard.JustDown(this._keyS)) return;
  this._slamCooldown = SLAM_COOLDOWN;
  this._spawnHitbox('slam');
}
```

`_spawnHitbox('slam')` reuses the existing method from Task 7 — no other changes needed.

- [ ] **Step 2: Manual test with visible hitbox**

Temporarily set `hb.setAlpha(0.4)` in `_spawnHitbox`.

Expected:
- Press S → orange circle appears centered on TIM for 300ms
- A cooldown (500ms) and S cooldown (1500ms) are independent of each other

Revert `setAlpha` to `0`.

- [ ] **Step 3: Commit**

```bash
git add src/entities/Tim.js
git commit -m "feat: Tim slam — S key spawns radial hitbox, 1500ms cooldown"
```

---

### Task 9: Enemy Base + Scout + Brute

**Files:**
- Modify: `src/entities/Enemy.js`
- Modify: `src/entities/Scout.js`
- Modify: `src/entities/Brute.js`
- Modify: `src/scenes/Game.js` (smoke test only, then revert)

- [ ] **Step 1: Implement `src/entities/Enemy.js`**

Replace `src/entities/Enemy.js`:

```js
import { DEPTH } from '../constants.js';

export class Enemy extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y, texture, config) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setDepth(DEPTH.ENEMY);
    this.hp = config.hp;
    this.speed = config.speed;
    this.scoreValue = config.score;
    this.body.setVelocityY(this.speed);
  }

  takeDamage(amount) {
    this.hp -= amount;
    this.setTint(0xffffff);
    this.scene.time.delayedCall(80, () => { if (this.active) this.clearTint(); });
    if (this.hp <= 0) this._die();
  }

  applyKnockback(fromX, fromY, force) {
    const angle = Phaser.Math.Angle.Between(fromX, fromY, this.x, this.y);
    this.body.setVelocity(Math.cos(angle) * force, Math.sin(angle) * force);
    this.scene.time.delayedCall(280, () => {
      if (this.active) this.body.setVelocityY(this.speed);
    });
  }

  _die() {
    this.scene.addScore(this.scoreValue);
    this.scene.enemyDied();
    this.destroy();
  }
}
```

- [ ] **Step 2: Implement `src/entities/Scout.js`**

Replace `src/entities/Scout.js`:

```js
import { Enemy } from './Enemy.js';

export class Scout extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, 'scout', { hp: 1, speed: 120, score: 10 });
  }
}
```

- [ ] **Step 3: Implement `src/entities/Brute.js`**

Replace `src/entities/Brute.js`:

```js
import { Enemy } from './Enemy.js';

export class Brute extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, 'brute', { hp: 3, speed: 55, score: 30 });
    this.setScale(1.2);
  }
}
```

- [ ] **Step 4: Smoke test — spawn one of each in Game.create()**

Add these temporary lines at the bottom of `Game.create()`:

```js
// TEMP — delete after smoke test
import { Scout } from '../entities/Scout.js';
import { Brute } from '../entities/Brute.js';
// (add imports at top of Game.js)

// at end of create():
const s = new Scout(this, 200, SPAWN_Y);
this.enemies.add(s, true);
const b = new Brute(this, 600, SPAWN_Y);
this.enemies.add(b, true);
```

Also add stub methods to `Game` so Enemy._die() doesn't crash:

```js
addScore(pts) {}
enemyDied() {}
```

Expected: Small red scout and larger dark-red brute both visible, moving straight down. No console errors.

Remove the temporary spawn lines and the stub method bodies after confirming.

- [ ] **Step 5: Commit**

```bash
git add src/entities/Enemy.js src/entities/Scout.js src/entities/Brute.js src/scenes/Game.js
git commit -m "feat: Enemy base, Scout, Brute — hp, speed, damage flash, knockback, die"
```

---

### Task 10: Wave Spawning in Game Scene

**Files:**
- Modify: `src/scenes/Game.js`

- [ ] **Step 1: Add all imports to top of `src/scenes/Game.js`**

Replace the import block at the top:

```js
import { W, H, HUD_HEIGHT, FLOOR_Y, GEM_X, GEM_Y, DEPTH, SPAWN_Y, BETWEEN_WAVES_DELAY } from '../constants.js';
import { Tim } from '../entities/Tim.js';
import { Scout } from '../entities/Scout.js';
import { Brute } from '../entities/Brute.js';
import { WaveManager } from '../systems/WaveManager.js';
```

- [ ] **Step 2: Add wave state to `create()` and call `_startWave()`**

Update `create()`:

```js
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
  this._buildHUD();
  this._startWave();
}
```

- [ ] **Step 3: Add spawning and wave-progress methods to Game**

Add these methods to the `Game` class:

```js
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
```

- [ ] **Step 4: Manual test — wave spawning**

Expected:
- Wave 1 banner fades in/out
- 5 scouts spawn from the top at ~1.2s intervals, moving down
- Since CollisionHandler is not wired yet: enemies fall off-screen, but `enemyDied()` and `_checkWaveComplete()` are called via `_die()` when they're destroyed (they won't be destroyed yet — enemies that fall off-screen won't trigger wave completion until Task 11)
- Note: wave completion will be verified fully in Task 11

- [ ] **Step 5: Commit**

```bash
git add src/scenes/Game.js
git commit -m "feat: wave spawning — WaveManager drives 5-wave spawn loop with banners"
```

---

### Task 11: CollisionHandler — Combat + Gem Defense

**Files:**
- Modify: `src/systems/CollisionHandler.js`
- Modify: `src/scenes/Game.js`

- [ ] **Step 1: Implement `src/systems/CollisionHandler.js`**

Replace `src/systems/CollisionHandler.js`:

```js
export class CollisionHandler {
  constructor(scene) { this.scene = scene; }

  setup() {
    const { physics, enemies, attackHitboxes, gemZone } = this.scene;

    physics.add.overlap(attackHitboxes, enemies, (hitbox, enemy) => {
      if (!hitbox.active || !enemy.active) return;
      if (hitbox.hitEnemies.has(enemy)) return;
      hitbox.hitEnemies.add(enemy);
      enemy.takeDamage(hitbox.damage);
      if (hitbox.isSlam) enemy.applyKnockback(hitbox.x, hitbox.y, 150);
    });

    physics.add.overlap(enemies, gemZone, (enemy) => {
      if (!enemy.active) return;
      enemy.destroy();
      this.scene.loseLife();
      this.scene.enemyDied();
    });
  }
}
```

- [ ] **Step 2: Wire CollisionHandler into Game.create()**

Add import at top of `src/scenes/Game.js`:

```js
import { CollisionHandler } from '../systems/CollisionHandler.js';
```

In `create()`, add after `_buildTim()` and before `_buildHUD()`:

```js
this._collisions = new CollisionHandler(this);
this._collisions.setup();
```

- [ ] **Step 3: Manual test — full combat loop**

Expected:
- Move TIM next to a scout and press A → scout flashes white and is destroyed; score shows +10
- Move TIM next to a brute and press A three times → brute flashes each hit, dies on 3rd; score +30
- Press S near enemies → 2 damage + knockback (brute pushed back briefly before resuming descent)
- Let a scout reach the gem (y ≈ 490) → life counter drops, screen shakes
- Kill all scouts in wave 1 → 3s later Wave 2 banner appears
- Lose 3 lives → transitions to GameOver scene (currently stub)
- Complete wave 5 → transitions to YouWin scene (currently stub)

- [ ] **Step 4: Commit**

```bash
git add src/systems/CollisionHandler.js src/scenes/Game.js
git commit -m "feat: CollisionHandler — attack/slam damage, gem zone costs lives"
```

---

### Task 12: GameOver + YouWin Scenes

**Files:**
- Modify: `src/scenes/GameOver.js`
- Modify: `src/scenes/YouWin.js`

- [ ] **Step 1: Implement `src/scenes/GameOver.js`**

Replace `src/scenes/GameOver.js`:

```js
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
```

- [ ] **Step 2: Implement `src/scenes/YouWin.js`**

Replace `src/scenes/YouWin.js`:

```js
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
```

- [ ] **Step 3: Manual test — end game flows**

GameOver test: let 3 enemies reach the gem. Expected: "GAME OVER" screen with "The gem has fallen." Click "PLAY AGAIN" or press SPACE → fresh game starts at wave 1.

YouWin test: kill all enemies across all 5 waves. Expected: "LEVEL COMPLETE!" with final score. Click "PLAY AGAIN" → fresh game.

- [ ] **Step 4: Commit**

```bash
git add src/scenes/GameOver.js src/scenes/YouWin.js
git commit -m "feat: GameOver and YouWin scenes with play again flow and final score"
```

---

### Task 13: Final Playthrough Verification

**Files:** No new files. This task is all manual testing.

- [ ] **Step 1: Full playthrough checklist**

Run `npx serve .` and play through the complete game:

- [ ] Main menu loads; SPACE starts game
- [ ] Wave 1 banner flashes; 5 scouts spawn from top
- [ ] A key (attack) kills a scout in 1 hit; score shows +10
- [ ] A key kills a brute in 3 hits; score shows +30
- [ ] S key (slam) deals 2 damage and knocks enemy backward
- [ ] Brute knocked back resumes downward movement after ~280ms
- [ ] Scout reaching gem costs 1 life; screen shakes
- [ ] Lives display decrements (❤️❤️ → ❤️ → 💔)
- [ ] All wave 1 enemies dead → 3s pause → Wave 2 banner + spawns
- [ ] Wave 3 includes at least 1 brute (larger, darker enemy)
- [ ] Waves 4 and 5 are noticeably harder (more brutes, faster spawns)
- [ ] 0 lives → GameOver screen; SPACE restarts from wave 1
- [ ] Clearing all 5 waves → YouWin screen with correct final score
- [ ] YouWin SPACE → clean restart with lives reset to 3 and score reset to 0

- [ ] **Step 2: Run unit tests one final time**

```bash
npm test
```

Expected: 9 passing, 0 failures.

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "chore: complete game — all 5 waves, combat, lives, score, end screens playable"
```

---

## Self-Review

**Spec coverage:**
- ✅ Browser-playable Phaser 3 game
- ✅ TIM controlled with arrow keys (movement), A (attack), S (slam)
- ✅ Gem at bottom-center, enemy spawn at top, HUD strip
- ✅ Scout (HP 1, fast) and Brute (HP 3, slow, knockback)
- ✅ 5 waves with escalating difficulty per spec table
- ✅ 3 lives — lost when enemy reaches gem
- ✅ Score: +10 scout, +30 brute
- ✅ Boot → MainMenu → Game → GameOver / YouWin scene flow
- ✅ Wave banner shown at start of each wave
- ✅ `_checkWaveComplete` guarded against early trigger with `_spawnedInWave` counter
- ✅ `hitEnemies` Set prevents multi-hit per hitbox per enemy
- ✅ TIM facing direction tracked; attack offset matches facing

**No TBDs, no placeholder steps, no references to undefined methods.**
