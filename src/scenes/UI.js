import Phaser from 'phaser';
import {
    COIN_COLLECTED,
    PLAYER_HIT,
    PLAYER_JUMP,
    events,
} from '../utils/EventCenter';
import pickupCoin from '../assets/Sounds/pickup_coin.wav';
import hitSound from '../assets/Sounds/hit_hurt.wav';
import jumpSound from '../assets/Sounds/jump.wav';

export default class UI extends Phaser.Scene {
    constructor() {
        super('ui');
        this.coins = 0;
    }

    init() {
        // Make sure that the coins are back to 0 when restarting the game.
        this.coins = 0;
    }

    preload() {
        // load sounds
        this.load.audio('pickupCoin', pickupCoin);
        this.load.audio('hitSound', hitSound);
        this.load.audio('jumpSound', jumpSound);
    }

    create() {
        this.coinsText = this.add.text(10, 10, 'Coins: 0', {
            fontSize: '12px',
        });
        this.healthText = this.add.text(10, 20, 'Health: 3', {
            fontSize: '12px',
        });

        // Load the coin sound
        this.coinSound = this.sound.add('pickupCoin', {
            volume: 0.5,
            loop: false,
        });

        // Load the hit sound
        this.hitSound = this.sound.add('hitSound', {
            volume: 0.5,
            loop: false,
        });

        // Load the jump sound
        this.jumpSound = this.sound.add('jumpSound', {
            volume: 0.5,
            loop: false,
        });

        // Listening to the coin collected event
        events.on(COIN_COLLECTED, this.handleCoinCollected, this);

        events.on(PLAYER_HIT, this.handlePlayerHit, this);
        events.on(PLAYER_JUMP, this.handlePlayerJump, this);

        // Removing the event COIN_COLLECTED when this scene is destroyed
        this.events.once('destroy', () => {
            events.off(COIN_COLLECTED, this.handleCoinCollected, this);
            events.off(PLAYER_HIT, this.handlePlayerHit, this);
            events.off(PLAYER_JUMP, this.handlePlayerJump, this);
        });
    }

    handleCoinCollected() {
        this.coinsText.text = `Coins: ${++this.coins}`;
        this.coinSound.play();
    }

    handlePlayerHit(event) {
        if (event.health === 0) {
            this.scene.launch('game-over');
        }
        this.healthText.text = `Health: ${event.health}`;
        this.hitSound.play();
        this.cameras.main.shake(300, 0.01);
    }

    handlePlayerJump() {
        this.jumpSound.play();
    }
}
