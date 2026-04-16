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
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: { default: 'arcade', arcade: { debug: false } },
  input: { keyboard: { target: window } },
  scene: [Boot, MainMenu, Game, GameOver, YouWin],
});
