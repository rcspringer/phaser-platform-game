import Phaser from "phaser";

export default class Player extends Phaser.Physics.Arcade.Body {
  constructor(scene, x, y) {
    super(scene, x, y, "characters");
    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("characters", { frames: [0, 1] }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("characters", { frames: [0] }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "jump",
      frames: this.anims.generateFrameNumbers("characters", { frames: [1] }),
      frameRate: 8,
      repeat: -1,
    });

    this.initialize();
  }

  initialize() {
    this.cursors = this.input.keyboard.createCursorKeys();
    if (cursors.left.isDown) {
      // if the left arrow key is down
      player.body.setVelocityX(-200); // move left
    } else if (cursors.right.isDown) {
      // if the right arrow key is down
      player.body.setVelocityX(200); // move right
    }
    if ((cursors.space.isDown || cursors.up.isDown) && player.body.onFloor()) {
      player.body.setVelocityY(-500); // jump up
    }
  }
}
