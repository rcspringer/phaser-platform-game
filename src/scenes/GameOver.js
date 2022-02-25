import Phaser from 'phaser';

export default class GameOver extends Phaser.Scene {
    constructor() {
        super('game-over');
    }

    create() {
        const { width, height } = this.scale;
        const text = this.add.text(width * 0.5, height * 0.4, 'Game Over', {
            fontSize: '30px',
        });
        text.setOrigin(0.5);
        this.input.keyboard.on('keyup', this.resetGame, this);
        // Removing the event when this scene is destroyed
        this.events.once('destroy', () => {
            this.input.keyboard.off('keyup', this.resetGame, this);
        });
    }

    resetGame(event) {
        const code = event.keyCode;
        if (code === Phaser.Input.Keyboard.KeyCodes.R) {
            // Relaunch the game
            this.scene.start('game');
        }
    }
}
