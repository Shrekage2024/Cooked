# TIM: Wave Defense — Game Design Spec

**Date:** 2026-04-16
**Designer:** Kian
**Status:** Approved for implementation

---

## Overview

A browser-based 2D wave defense action game built with Phaser 3. The player controls TIM — a young boy with a hammer head and saw-blade arms — who must protect a mysterious gem inside a temple from waves of alien invaders. Unlike a traditional tower defense, the player directly controls TIM using keyboard input.

---

## Story

TIM grew up in a forest, growing stronger and gathering weapons over time. He now guards a powerful gem inside a temple. Aliens from another planet are trying to steal it. TIM is the gem's only protector.

---

## Tech Stack

| Concern | Choice |
|---------|--------|
| Framework | Phaser 3 (MIT, open source) |
| Language | JavaScript (ES6+) |
| Renderer | WebGL (Canvas fallback via Phaser) |
| Entry point | `index.html` — no build step required for MVP |
| Physics | Phaser Arcade Physics |

---

## Screen Flow

```
Boot → MainMenu → Game → GameOver
                       → YouWin
```

- **Boot** — preloads all assets (sprites, audio)
- **MainMenu** — title card, TIM art, "Press SPACE to Start"
- **Game** — main play scene (see below)
- **GameOver** — triggered when lives reach 0; "Play Again" restarts Game scene
- **YouWin** — triggered when all 5 waves are cleared; "Level Complete" screen

---

## Canvas & Layout

- **Canvas size:** 800 × 600px
- **HUD strip:** top 36px — lives, wave counter, gem status
- **Enemy spawn zone:** just below HUD (y ≈ 64px), full width
- **Play area:** between HUD and floor (y 64–520px), TIM moves freely here
- **Floor/temple:** bottom 80px — decorative, TIM cannot go below floor line
- **Gem:** centered at bottom of play area (x=400, y≈490), always visible
- **TIM start position:** x=460, y=490 (just right of the gem)

---

## TIM — Player Character

### Sprite
- Source: provided illustrated sprite sheets (comic-book style, thick outlines)
- Animations required: `idle`, `walk-left`, `walk-right`, `walk-up`, `walk-down`, `attack`, `slam`

### Movement
- **Input:** Arrow keys (up/down/left/right)
- **Speed:** 200px/s
- **Constraints:** Clamped to play area bounds (cannot leave canvas or enter HUD)
- **Facing direction:** TIM faces the last arrow key pressed. Default facing is right when idle at game start.
- **TIM is invincible to contact** — enemies do not damage TIM directly

### Attack — A key (Saw Blade)
- Short-range hitbox in the direction TIM is facing (~80px wide, ~60px tall)
- Active for 200ms per press
- Cooldown: 500ms
- Damage: 1 hit to all enemies in hitbox
- Plays `attack` animation + attack sound

### Slam — S key (Hammer Head)
- Radial shockwave centered on TIM (~120px radius)
- Active for 300ms per press
- Cooldown: 1500ms
- Damage: 2 hits to all enemies in range
- Slight knockback (pushes enemies 40px away from TIM)
- Plays `slam` animation + slam sound

### Lives
- TIM starts with 3 lives
- A life is lost each time any enemy reaches the gem zone
- The offending enemy is destroyed on contact with the gem zone
- At 0 lives → GameOver scene

---

## Enemies

All enemies spawn at a random x position within the spawn zone (y ≈ 64) and move straight down toward the gem.

### Scout (Level 1 enemy)
- Small, fast alien sprite
- Speed: 120px/s
- HP: 1 (one saw hit kills)
- Reward: +10 score

### Brute (Level 1 enemy)
- Large, slow alien sprite
- Speed: 55px/s
- HP: 3 (requires 3 saw hits or 1 slam + 1 saw hit)
- Reward: +30 score

---

## Wave Structure — Level 1

| Wave | Enemies | Spawn interval |
|------|---------|---------------|
| 1 | 5 Scouts | 1.2s apart |
| 2 | 7 Scouts | 1.0s apart |
| 3 | 6 Scouts + 1 Brute | 1.0s / 1 Brute mid-wave |
| 4 | 5 Scouts + 2 Brutes | 0.9s apart |
| 5 | 4 Scouts + 3 Brutes | 0.8s apart |

- Next wave begins 3 seconds after all enemies from the current wave are destroyed
- A "Wave X" banner flashes on screen at the start of each wave
- Surviving all 5 waves → YouWin scene

---

## Scoring

- Score displayed in HUD (right side, optional for MVP)
- Scout kill: +10 pts
- Brute kill: +30 pts
- Completing a wave without losing a life: +100 bonus
- No persistent leaderboard in MVP

---

## Project File Structure

```
/
├── index.html
├── src/
│   ├── scenes/
│   │   ├── Boot.js
│   │   ├── MainMenu.js
│   │   ├── Game.js
│   │   ├── GameOver.js
│   │   └── YouWin.js
│   ├── entities/
│   │   ├── Tim.js
│   │   ├── Scout.js
│   │   └── Brute.js
│   └── systems/
│       ├── WaveManager.js
│       └── CollisionHandler.js
└── assets/
    ├── sprites/
    │   ├── tim-spritesheet.png
    │   ├── scout.png
    │   └── brute.png
    └── audio/
        ├── attack.wav
        ├── slam.wav
        └── alien-die.wav
```

---

## Out of Scope (MVP)

- Multiple levels
- Tower/turret placement
- TIM upgrades or weapon unlocks
- Persistent save / leaderboard
- Mobile/touch controls
- Background music (sound effects only)
- Enemy pathfinding (enemies move straight down only)
