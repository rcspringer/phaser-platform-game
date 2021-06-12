import Phaser from 'phaser';

const events = new Phaser.Events.EventEmitter();

const COIN_COLLECTED = 'coin_collected';
const PLAYER_HIT = 'player_hit';

export {events, COIN_COLLECTED, PLAYER_HIT};
