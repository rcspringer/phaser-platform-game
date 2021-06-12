import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Matter.Sprite {
  constructor(world, x, y, cursors) {
    super(world, x, y, 'characters');
    this.cursors = cursors;
    this.setFixedRotation();
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('characters', {frames: [0, 1]}),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('characters', {frames: [0]}),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNumbers('characters', {frames: [1]}),
      frameRate: 8,
      repeat: -1,
    });
    this.play('idle');

    this.setOnCollide(data => this.onCollide(data));
  }

  update() {
    if (this.cursors.left.isDown) {
      // if the left arrow key is down
      this.setVelocityX(-2); // move left
    } else if (this.cursors.right.isDown) {
      // if the right arrow key is down
      this.setVelocityX(2); // move right
    }
    const jumpJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space);
    if (jumpJustPressed && this.isTouchingGround) {
      this.setVelocityY(-5); // jump up
      this.isTouchingGround = false;
    }
    this.updateAnimations();
  }

  updateAnimations() {
    if (Math.abs(this.body.velocity.y) > 0.3) {
      this.play('jump');
    } else if (this.body.velocity.x > 0.5) {
      this.play('walk', true);
      this.flipX = true;
    } else if (this.body.velocity.x < -0.5) {
      this.play('walk', true);
      this.flipX = false;
    } else {
      this.play('idle', true);
    }
  }

  onCollide(data) {
    this.isTouchingGround = true;
  }
}
