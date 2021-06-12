import Phaser from 'phaser';
import Game from './scenes/Game';

const config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 600,
  height: 300,
  zoom: 2,
  disableContextMenu: true,
  physics: {
    default: 'matter',
    matter: {
      debug: true,
    },
  },
  scene: Game,
};

const game = new Phaser.Game(config);
