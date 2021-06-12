import Phaser from 'phaser';

export default class GameOver extends Phaser.Scene {
  constructor() {
    super({key: 'game-over'});
  }

  create() {
    const {width, height} = this.scale;
    this.add.text(width / 2, height / 2, 'Game Over', {
      fontSize: '30px',
      align: 'center',
    });
    this.input.keyboard.on('keyup', this.resetGame, this);
    // Removing the event COIN_COLLECTED when this scene is destroyed
    this.events.on('destroy', () => {
      this.input.keyboard.off('keyup', this.resetGame, this);
      console.log('GameOver destroyed');
      // Relaunch the game
      this.scene.restart('game');
    });
  }

  resetGame(event) {
    const code = event.keyCode;
    if (code === Phaser.Input.Keyboard.KeyCodes.R) {
      this.scene.remove('game-over');
    }
  }
}
