import Phaser from 'phaser';
import baseTiles from '../assets/Tilemap/tiles_packed.png';
import characters from '../assets/Tilemap/characters_packed.png';
import tilemap from '../assets/map/smallmap.json';
import musicPlatformerBackground from '../assets/Music/retro-forest.mp3';
import musicForestBackground from '../assets/Music/retro-platformer.mp3';
import pickupCoin from '../assets/Sounds/pickup_coin.wav';
import hitSound from '../assets/Sounds/hit_hurt.wav';
import jumpSound from '../assets/Sounds/jump.wav';
import ObstaleController from '../utils/ObstacleController';
import Player from '../GameObjects/Player';
import Coin from '../GameObjects/Coin';
import { PLAYER_HIT, events } from '../utils/EventCenter';

export default class Game extends Phaser.Scene {
    constructor() {
        super({ key: 'game' });
        this.obstacles;
    }

    init() {
        this.obstacles = new ObstaleController();
    }

    preload() {
        // load the tiles
        this.load.spritesheet('base_tiles', baseTiles, {
            frameWidth: 18,
            frameHeight: 18,
        });
        this.load.spritesheet('characters', characters, {
            frameWidth: 24,
            frameHeight: 24,
        });
        // load the tilemap JSON file
        this.load.tilemapTiledJSON('tilemap', tilemap);

        // load music
        this.load.audio('platformer', musicPlatformerBackground);
        this.load.audio('forest', musicForestBackground);

        // load sounds
        this.load.audio('pickupCoin', pickupCoin);
        this.load.audio('hitSound', hitSound);
        this.load.audio('jumpSound', jumpSound);
    }

    create() {
        // Loading the ui scene on top
        this.scene.launch('ui');

        // create the Tilemap
        const map = this.make.tilemap({ key: 'tilemap' });

        // add the tileset image we are using
        const tileset = map.addTilesetImage('tiles', 'base_tiles');
        // create the layers we want in the right order
        const spikesLayer = map.createLayer('Spikes', tileset);
        const backgroundLayer = map.createLayer('Background', tileset);
        // "Ground" layer will be on top of "Background" layer
        const groundLayer = map.createLayer('Ground', tileset);
        groundLayer.setCollisionByProperty({ collides: true }, undefined, true);

        this.matter.world.convertTilemapLayer(groundLayer);

        // Creating a main layer
        this.mainLayer = this.add.layer();

        // // set bounds so the camera won't go outside the game world
        this.cameras.main.setBounds(
            0,
            0,
            map.widthInPixels,
            map.heightInPixels
        );

        // set background color, so the sky is not black
        this.cameras.main.setBackgroundColor('#ccccff');

        // Creating and loading the objects
        const objectsLayer = map.getObjectLayer('Objects');
        for (const objectData of objectsLayer.objects) {
            const { x = 0, y = 0, name, width = 0, height = 0 } = objectData;
            switch (name) {
                // Spanwing the player
                case 'PlayerSpawn':
                    // create the player sprite using the GameFactory Pattern
                    this.player = this.add.player(
                        x + width * 0.5,
                        y,
                        this.input.keyboard.createCursorKeys(),
                        this.obstacles
                    );
                    this.matter.world.add(this.player);
                    this.mainLayer.add(this.player);

                    // make the camera follow the player
                    this.cameras.main.startFollow(this.player);
                    break;
                // Creating the coins
                case 'Coin':
                    const coin = this.add.coin(
                        x + width * 0.5,
                        y - height * 0.5
                    );
                    this.matter.world.add(coin);
                    break;
                // Creating the coins
                case 'Spike':
                    const spike = this.matter.add.rectangle(
                        x + width * 0.5,
                        y + height * 0.5,
                        width,
                        height,
                        {
                            isStatic: true,
                        }
                    );
                    this.obstacles.add(name, spike);
                    break;
            }
        }

        // Initialize the game object of the main layer
        for (let go of this.mainLayer.getAll()) {
            go.init();
        }

        // Loading the music
        this.music = this.sound.add('platformer', {
            volume: 0.5,
            loop: true,
        });

        if (!this.sound.locked) {
            // already unlocked so play
            this.music.play();
        } else {
            // wait for 'unlocked' to fire and then play
            this.sound.once(Phaser.Sound.Events.UNLOCKED, () => {
                this.music.play();
            });
        }

        events.on(PLAYER_HIT, this.handlePlayerHit, this);

        // Removing the event COIN_COLLECTED when this scene is destroyed
        this.events.once('destroy', () => {
            events.off(PLAYER_HIT, this.handlePlayerHit, this);
        });
    }

    update(t, dt) {
        super.update(t, dt);
    }

    handlePlayerHit(event) {
        this.cameras.main.shake(300, 0.01);
        if (event.health <= 0) {
            this.cameras.main.zoomTo(6, 7000);
        }
    }
}
