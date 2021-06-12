import Phaser from 'phaser';
import baseTiles from '../assets/Tilemap/tiles_packed.png';
import characters from '../assets/Tilemap/characters_packed.png';
import tilemap from '../assets/map/smallmap.json';
import Player from '../Player';

export default class Game extends Phaser.Scene {
  constructor() {
    super();
  }

  preload() {
    // load the tiles
    this.load.image('base_tiles', baseTiles);
    this.load.spritesheet('characters', characters, {
      frameWidth: 24,
      frameHeight: 24,
    });
    // load the tilemap JSON file
    this.load.tilemapTiledJSON('tilemap', tilemap);
  }

  create() {
    const {width, height} = this.scale;

    // create the Tilemap
    const map = this.make.tilemap({key: 'tilemap'});

    // add the tileset image we are using
    const tileset = map.addTilesetImage('tiles', 'base_tiles');
    // create the layers we want in the right order
    const backgroundLayer = map.createLayer('Background', tileset);
    // "Ground" layer will be on top of "Background" layer
    const groundLayer = map.createLayer('Ground', tileset);
    groundLayer.setCollisionByProperty({collides: true});

    const objectsLayer = map.getObjectLayer('Objects');

    this.matter.world.convertTilemapLayer(groundLayer);

    // Creating a main layer
    this.mainLayer = this.add.layer();

    // // set bounds so the camera won't go outside the game world
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // set background color, so the sky is not black
    this.cameras.main.setBackgroundColor('#ccccff');
    for (const objectData of objectsLayer.objects) {
      const {x = 0, y = 0, name, width = 0} = objectData;
      switch (name) {
        case 'PlayerSpawn':
          // create the player sprite
          this.player = new Player(
            this.matter.world,
            x + width * 0.5,
            y,
            this.input.keyboard.createCursorKeys(),
          );
          this.matter.world.add(this.player);
          this.mainLayer.add(this.player);

          // make the camera follow the player
          this.cameras.main.startFollow(this.player);
          break;
      }
    }
  }

  update(t, dt) {
    for (let go of this.mainLayer.getAll()) {
      go.update();
    }
  }
}
