import Phaser from "phaser";
import baseTiles from "./assets/Tilemap/tiles_packed.png";
import characters from "./assets/Tilemap/characters_packed.png";
import tilemap from "./assets/map/smallmap.json";

class MyGame extends Phaser.Scene {
  constructor() {
    super();
  }

  preload() {
    // load the tiles
    this.load.image("base_tiles", baseTiles);
    this.load.spritesheet("characters", characters, {
      frameWidth: 24,
      frameHeight: 24,
    });
    // load the tilemap JSON file
    this.load.tilemapTiledJSON("tilemap", tilemap);
  }

  create() {
    // create the Tilemap
    const map = this.make.tilemap({ key: "tilemap" });

    // add the tileset image we are using
    const tileset = map.addTilesetImage("tiles", "base_tiles");
    // create the layers we want in the right order
    map.createStaticLayer("Background", tileset);
    // "Ground" layer will be on top of "Background" layer
    const groundLayer = map.createStaticLayer("Ground", tileset);
    groundLayer.setCollisionByExclusion([-1]);

    // set the boundaries of our game world
    this.physics.world.bounds.width = groundLayer.width;
    this.physics.world.bounds.height = groundLayer.height;

    // set the boundaries of our game world
    this.physics.world.bounds.width = groundLayer.width;
    this.physics.world.bounds.height = groundLayer.height;

    // create the player sprite
    this.player = this.physics.add.sprite(200, 200, "player");
    this.player.setBounce(0.2); // our player will bounce from items
    this.player.setCollideWorldBounds(true); // don't go out of the map

    // small fix to our player images, we resize the physics body object slightly
    this.player.body.setSize(player.width, player.height - 8);

    // player will collide with the level tiles
    this.physics.add.collider(groundLayer, player);

    // set bounds so the camera won't go outside the game world
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // make the camera follow the player
    this.cameras.main.startFollow(player);

    // set background color, so the sky is not black
    this.cameras.main.setBackgroundColor("#ccccff");
  }
}

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 600,
  height: 600,
  scene: MyGame,
};

const game = new Phaser.Game(config);
