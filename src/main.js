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
