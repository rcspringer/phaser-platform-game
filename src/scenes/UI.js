import Phaser from 'phaser';
import {COIN_COLLECTED, PLAYER_HIT, events} from '../utils/EventCenter';

export default class UI extends Phaser.Scene {
  constructor() {
    super({key: 'ui'});
    this.coins = 0;
  }

  init() {
    // Make sure that the coins are back to 0 when restarting the game.
    this.coins = 0;
  }

  create() {
    this.coinsText = this.add.text(10, 10, 'Coins: 0', {fontSize: '12px'});
    this.healthText = this.add.text(10, 20, 'Health: 3', {fontSize: '12px'});

    // Listening to the coin collected event
    events.on(COIN_COLLECTED, this.handleCoinCollected, this);

    events.on(PLAYER_HIT, this.handlePlayerHit, this);

    // Removing the event COIN_COLLECTED when this scene is destroyed
    this.events.once(Phaser.Scenes.DESTROYED, () => {
      events.off(COIN_COLLECTED, this.handleCoinCollected, this);
      events.off(PLAYER_HIT, this.handlePlayerHit, this);
    });
  }

  handleCoinCollected() {
    this.coinsText.text = `Coins: ${++this.coins}`;
  }

  handlePlayerHit(event) {
    console.log(event);
    if (event.health === 0) {
      this.scene.launch('game-over');
    }
    this.healthText.text = `Health: ${event.health}`;
  }
}
