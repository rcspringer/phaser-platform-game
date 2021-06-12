import Phaser from 'phaser';
import Game from './scenes/Game';
import GameOver from './scenes/GameOver';
import UI from './scenes/UI';

const config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 500,
  height: 300,
  zoom: 2,
  disableContextMenu: true,
  physics: {
    default: 'matter',
    matter: {
      debug: false,
    },
  },
  scene: [Game, UI, GameOver],
};

const game = new Phaser.Game(config);
