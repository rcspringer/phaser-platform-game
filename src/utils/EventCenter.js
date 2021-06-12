import Phaser from 'phaser';

const events = new Phaser.Events.EventEmitter();

const COIN_COLLECTED = 'coin_collected';

export {events, COIN_COLLECTED};
