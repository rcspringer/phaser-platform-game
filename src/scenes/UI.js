import Phaser from 'phaser';
import {COIN_COLLECTED, events} from '../utils/EventCenter';

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

    // Listening to the coin collected event
    events.on(COIN_COLLECTED, this.handleCoinCollected, this);

    // Removing the event COIN_COLLECTED when this scene is destroyed
    this.events.once(Phaser.Scenes.DESTROYED, () => {
      events.off(COIN_COLLECTED, this.handleCoinCollected, this);
    });
  }

  handleCoinCollected() {
    this.coinsText.text = `Coins: ${++this.coins}`;
  }
}
