import Phaser from 'phaser';
import baseTiles from '../assets/Tilemap/tiles_packed.png';
import characters from '../assets/Tilemap/characters_packed.png';
import tilemap from '../assets/map/smallmap.json';
import Player from '../GameObjects/Player';
import ObstaleController from '../utils/ObstacleController';

export default class Game extends Phaser.Scene {
  constructor() {
    super({key: 'game'});
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
  }

  create() {
    // Loading the ui scene on top
    this.scene.launch('ui');

    // create the Tilemap
    const map = this.make.tilemap({key: 'tilemap'});

    // add the tileset image we are using
    const tileset = map.addTilesetImage('tiles', 'base_tiles');
    // create the layers we want in the right order
    const spikesLayer = map.createLayer('Spikes', tileset);
    const backgroundLayer = map.createLayer('Background', tileset);
    // "Ground" layer will be on top of "Background" layer
    const groundLayer = map.createLayer('Ground', tileset);
    groundLayer.setCollisionByProperty({collides: true});

    this.matter.world.convertTilemapLayer(groundLayer);

    // Creating a main layer
    this.mainLayer = this.add.layer();

    // // set bounds so the camera won't go outside the game world
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // set background color, so the sky is not black
    this.cameras.main.setBackgroundColor('#ccccff');

    // Create coin anim
    this.anims.create({
      key: 'coin_turn',
      frames: this.anims.generateFrameNumbers('base_tiles', {
        frames: [151, 152, 151],
      }),
      frameRate: 8,
      repeat: -1,
    });

    // Creating and loading the objects
    const objectsLayer = map.getObjectLayer('Objects');
    for (const objectData of objectsLayer.objects) {
      const {x = 0, y = 0, name, width = 0, height = 0} = objectData;
      switch (name) {
        // Spanwing the player
        case 'PlayerSpawn':
          // create the player sprite
          this.player = new Player(
            this.matter.world,
            x + width * 0.5,
            y,
            this.input.keyboard.createCursorKeys(),
            this.obstacles,
          );
          this.matter.world.add(this.player);
          this.mainLayer.add(this.player);

          // make the camera follow the player
          this.cameras.main.startFollow(this.player);
          break;
        // Creating the coins
        case 'Coin':
          const coin = this.matter.add.sprite(
            x + width * 0.5,
            y - height * 0.5,
            'base_tiles',
            151,
            {circleRadius: 7, isSensor: true, isStatic: true},
          );
          coin.play('coin_turn');
          coin.setData('type', 'coin');
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
            },
          );
          this.obstacles.add(name, spike);
          break;
      }
    }

    // Initialize the game object of the main layer
    for (let go of this.mainLayer.getAll()) {
      go.init();
    }
  }

  update(t, dt) {
    for (let go of this.mainLayer.getAll()) {
      go.update();
    }
  }
}
