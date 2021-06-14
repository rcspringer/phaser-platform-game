import Phaser from 'phaser';

export default class Coin extends Phaser.Physics.Matter.Sprite {
  constructor(world, x, y) {
    super(world, x, y, 'base_tiles', [151]);
    this.setData('type', 'coin');
    // Change the physics body size
    this.setCircle(7);
    // Stop the rotation on the body
    this.setFixedRotation();
    this.setStatic(true);

    // Create coin anim
    this.anims.create({
      key: 'coin_turn',
      frames: this.anims.generateFrameNumbers('base_tiles', {
        frames: [151, 152, 151],
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.play('coin_turn');
  }

  init() {
    console.log('Inited');
  }
}

// at the bottom of the coin.js file
Phaser.GameObjects.GameObjectFactory.register('coin', function (x, y) {
  const coin = new Coin(this.scene.matter.world, x, y);

  this.displayList.add(coin);
  this.updateList.add(coin);

  return coin;
});
