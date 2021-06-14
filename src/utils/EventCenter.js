import Phaser from 'phaser';

const events = new Phaser.Events.EventEmitter();

const COIN_COLLECTED = 'coin_collected';
const PLAYER_HIT = 'player_hit';
const PLAYER_JUMP = 'player_jump';

export {events, COIN_COLLECTED, PLAYER_HIT, PLAYER_JUMP};
