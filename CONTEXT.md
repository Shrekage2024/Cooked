# TIM: Wave Defense — Project Context

A running record of design decisions, what has been built, and the reasoning behind it. Keep this updated as the game evolves.

---

## Concept

TIM: Wave Defense is a browser-based 2D action game built with Phaser 3. It is **not** a traditional tower defense — there is no tower placement. The player directly controls TIM using the keyboard.

**Story:** TIM is a boy who grew up in a forest, becoming stronger and gathering weapons over time. He now guards a powerful gem inside a temple from waves of alien invaders.

**Core loop:** Aliens spawn from the top of the screen and march downward toward the gem. TIM must intercept them using melee attacks. If too many reach the gem, TIM loses all his lives and the run ends.

---

## Designer

Kian (game designer, project owner). Sprites and character art are custom illustrated (comic-book style, thick outlines). The placeholder textures in the current build were generated programmatically in `Boot.js` and should be replaced with the real sprite sheets when provided.

---

## Character: TIM

TIM is a young boy with a **hammer head** (rectangular metal head) and **saw-blade hands** (circular blades on his wrists). His body is blue, with orange arms, a red bandana, and glowing cyan eyes.

### Controls

| Key | Action |
|-----|--------|
| Arrow keys | Move in four directions |
| A | Attack — saw-blade swing (short range, front-facing) |
| S | Slam — hammer shockwave (radial, centered on TIM) |

### Stats

- Speed: 200 px/s
- TIM is **invincible** to direct enemy contact — enemies do not hurt TIM; they only deal damage by reaching the gem

### Attack (A key — Saw Blade)
- Short-range hitbox in the direction TIM is facing (~80×60 px)
- Active for 200ms, cooldown 500ms
- Damage: 1 hit to all enemies in hitbox
- Hitbox is visible: glowing yellow rectangle that fades out

### Slam (S key — Hammer Head)
- Radial shockwave centered on TIM (~120 px radius / 240×240 hitbox)
- Active for 300ms, cooldown 1500ms
- Damage: 2 hits to all enemies in range
- Knockback: 150 px push away from TIM; enemies resume their drift + downward speed after 280ms
- Hitbox is visible: orange shockwave circle that fades out

### Lives
- TIM starts with 3 lives
- A life is lost each time an enemy reaches the gem zone (the enemy is destroyed on contact)
- At 0 lives → GameOver scene

---

## Enemies

All enemies spawn at a random x position along the top of the play area (y ≈ 64) and move downward toward the gem. Each enemy is given a small random horizontal drift (±20–50 px/s) at spawn so they weave through the forest rather than stacking in a column. Drift is restored after knockback.

### Scout
- Small, fast alien
- Speed: 120 px/s, HP: 1, Score: +10

### Brute
- Large, slow alien (scaled to 1.2×)
- Speed: 55 px/s, HP: 3, Score: +30
- Requires 3 saw hits or 1 slam + 1 saw hit to kill

---

## Forest Obstacles

Eleven trees are placed at fixed positions across the play area in three loose rows:

```
Row 1 (y≈145–165):  x = 120, 390, 650
Row 2 (y≈265–280):  x = 65, 250, 470, 680
Row 3 (y≈380–395):  x = 155, 360, 600, 730
```

Each tree has a circular physics body (radius 13) centered on its canopy. Both TIM and enemies collide with trees via Phaser Arcade static colliders — enemies naturally slide around the canopy as they push against it, creating organic weaving paths without requiring A* pathfinding.

Tree positions are defined in `TREE_POSITIONS` at the top of `Game.js` for easy tuning.

---

## Wave Structure (Level 1)

| Wave | Composition | Spawn interval |
|------|-------------|---------------|
| 1 | 5 Scouts | 1.2s |
| 2 | 7 Scouts | 1.0s |
| 3 | 6 Scouts + 1 Brute | 1.0s |
| 4 | 5 Scouts + 2 Brutes | 0.9s |
| 5 | 4 Scouts + 3 Brutes | 0.8s |

- 3-second pause between waves
- "WAVE X" banner flashes at the start of each wave
- Clearing all 5 waves → YouWin scene
- +100 score bonus for completing each wave

---

## Scoring

| Event | Points |
|-------|--------|
| Kill Scout | +10 |
| Kill Brute | +30 |
| Complete a wave | +100 |

Score is displayed in the HUD (top-right). No persistent leaderboard in this version.

---

## Screen Layout

- **Canvas:** 800 × 600 px logical resolution, scaled via `Phaser.Scale.FIT` + `CENTER_BOTH` to fill the browser window while maintaining aspect ratio
- **HUD strip:** top 36 px — lives (left), wave counter (center), score (right)
- **Spawn zone:** y ≈ 64 (just below HUD), full width
- **Play area:** y 64–520, TIM moves freely
- **Floor line:** y = 520 (decorative brown line)
- **Gem:** centered at x=400, y=490 — always visible, animated pulse
- **TIM start position:** x=460, y=490 (just right of the gem)

---

## Scene Flow

```
Boot → MainMenu → Game → GameOver
                       → YouWin
```

- **Boot** — generates all placeholder textures programmatically (no image files required for MVP)
- **MainMenu** — title card, TIM sprite, "Press SPACE to Start"
- **Game** — main play scene
- **GameOver** — triggered at 0 lives; "Play Again" restarts Game scene
- **YouWin** — triggered after wave 5; shows final score + "Play Again"

---

## Tech Stack

| Concern | Choice |
|---------|--------|
| Framework | Phaser 3.70.0 via CDN |
| Language | JavaScript ES6+ (native ES modules) |
| Physics | Phaser Arcade Physics |
| Renderer | WebGL / Canvas fallback |
| Build step | None — served with `npx serve .` |
| Tests | Node.js built-in test runner (`node --test 'tests/**/*.mjs'`) |

---

## File Structure

```
/
├── index.html
├── src/
│   ├── constants.js          — W, H, depths, speeds, damage, cooldowns
│   ├── main.js               — Phaser game config + scene list
│   ├── scenes/
│   │   ├── Boot.js           — programmatic texture generation
│   │   ├── MainMenu.js       — title screen
│   │   ├── Game.js           — main play scene
│   │   ├── GameOver.js       — 0-lives end screen
│   │   └── YouWin.js         — wave-5-clear end screen
│   ├── entities/
│   │   ├── Tim.js            — player: movement, attack, slam, hitbox spawning
│   │   ├── Enemy.js          — base class: HP, damage flash, knockback, death
│   │   ├── Scout.js          — fast/weak enemy config
│   │   └── Brute.js          — slow/tough enemy config
│   └── systems/
│       ├── WaveManager.js    — wave configs, spawn queue (Fisher-Yates shuffle)
│       └── CollisionHandler.js — hitbox↔enemy and enemy↔gem overlaps
├── tests/
│   └── WaveManager.test.mjs  — 9 unit tests for pure wave logic
└── docs/
    ├── superpowers/
    │   ├── specs/2026-04-16-tim-wave-defense-design.md
    │   └── plans/2026-04-16-tim-wave-defense.md
    └── CONTEXT.md            ← this file
```

---

## Key Technical Decisions and Why

**Phaser Physics group `add(enemy, true)`** — This call both adds the enemy to the display list AND creates its physics body. Velocity must be set *after* this call. Setting velocity in the Enemy constructor (before the group add) creates a body that gets replaced, resulting in frozen enemies. This is the root cause of the "aliens stuck at top" bug that was fixed.

**`input.keyboard.target: window`** — Phaser defaults to listening for keyboard events on the canvas element. When the canvas loses focus (user clicks browser chrome, etc.), keys stop working. Setting the target to `window` captures keyboard input regardless of focus. A `pointerdown` re-focus handler in `Game.create()` provides a belt-and-suspenders fallback.

**`hitEnemies = new Set()` per hitbox** — Each spawned hitbox tracks which enemies it has already hit. Without this, a single attack frame can damage the same enemy multiple times (once per physics tick while overlapping). The Set ensures one damage event per hitbox per enemy.

**`_spawnedInWave < _totalInWave` guard** — `_checkWaveComplete` is called every time an enemy dies. Without the counter guard, killing early enemies could trigger wave completion before all enemies in the queue have even spawned.

**`DEPTH.HITBOX = 30`** — Hitbox sprites must be assigned this depth explicitly after creation. Phaser's `group.create()` defaults to depth 0, which is buried under trees (depth 9), enemies (depth 10), and TIM (depth 20). The weapon flash effect would be invisible otherwise.

**Enemy `drift` property** — Each enemy stores its initial horizontal drift. `applyKnockback` restores `setVelocity(drift, speed)` after the 280ms tumble so enemies continue weaving through the forest after being hit, rather than falling into a dead-straight vertical line.

---

## Bugs Fixed (Session 1)

| Bug | Root Cause | Fix |
|-----|-----------|-----|
| Keyboard stops working | Canvas loses focus | `keyboard.target: window` + pointerdown re-focus |
| Enemies frozen at top | Velocity set before physics body created | Removed physics setup from Enemy constructor; velocity set after `enemies.add(enemy, true)` |
| Screen too small | No scale config | `Phaser.Scale.FIT + CENTER_BOTH` |
| No forest | Not implemented | `_buildForest()` with 11 static tree colliders |
| No weapon visuals | Hitbox alpha was 0; hitboxes rendered at depth 0 | Set initial alpha (0.80 attack / 0.55 slam), added `setDepth(DEPTH.HITBOX)`, fade-out tween |
| Knockback drift lost | `applyKnockback` reset X to 0 | Restore `setVelocity(this.drift, this.speed)` |
| Double game-over | Two simultaneous gem contacts both called `loseLife` | Guard: `if (this.lives <= 0) return` at top of `loseLife()` |
| Wave-clear bonus missing | Accidentally dropped from plan | Added `this.addScore(100)` in `_checkWaveComplete()` |

---

## Out of Scope (MVP)

- Multiple levels
- Tower / turret placement
- TIM upgrades or weapon unlocks
- Persistent save / leaderboard
- Mobile / touch controls
- Background music (sound effects only — audio assets not yet wired up)
- Enemy pathfinding (enemies use arcade physics collision + drift, not A*)

---

## Next Steps (When Ready)

- Replace placeholder textures in `Boot.js` with Kian's illustrated sprite sheets. Texture keys to target: `tim`, `scout`, `brute`, `gem`, `hitbox-attack`, `hitbox-slam`, `tree`
- Wire up audio assets (`assets/audio/attack.wav`, `slam.wav`, `alien-die.wav`) — Boot.js loads them, CollisionHandler and Tim.js have the right hooks but `this.sound.play(...)` calls are not yet present
- Add TIM walk/attack/slam animations once sprite sheets are loaded (animation keys: `idle`, `walk-left`, `walk-right`, `walk-up`, `walk-down`, `attack`, `slam`)
- Consider Level 2 wave config and enemy types once Level 1 is playtested thoroughly
