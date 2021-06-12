import Phaser from 'phaser';
import {COIN_COLLECTED, PLAYER_HIT, events} from '../utils/EventCenter';

export default class Player extends Phaser.Physics.Matter.Sprite {
  constructor(world, x, y, cursors, obstacles) {
    super(world, x, y, 'characters');
    this.obstacles = obstacles;
    this.cursors = cursors;
    // Change the physics body size
    this.setRectangle(10, 22);
    // Stop the rotation on the body
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
  }

  init() {
    this.dead = false;
    this.health = 3;
    this.isInvincible = false;
    this.invincibleTime = 0;
    this.isTouchingGround = false;
    this.play('idle');
    this.setOnCollide(data => this.onCollide(data));
  }

  update() {
    if (this.dead) return;
    // Invicible timer and check
    if (this.isInvincible) {
      this.invincibleTime--;
      if (this.invincibleTime < 0) {
        this.removeInvincible();
      }
    }

    if (this.cursors.left.isDown) {
      // if the left arrow key is down
      this.setVelocityX(-2); // move left
      this.flipX = false;
    } else if (this.cursors.right.isDown) {
      // if the right arrow key is down
      this.setVelocityX(2); // move right
      this.flipX = true;
    }
    const jumpJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space);

    if (jumpJustPressed && this.isTouchingGround) {
      this.setVelocityY(-5); // jump up
      this.isTouchingGround = false;
    }
    this.updateAnimations();
  }

  updateAnimations() {
    if (
      this.isTouchingGround === false ||
      Math.abs(this.body.velocity.y) > 0.3
    ) {
      this.play('jump');
    } else if (this.body.velocity.x > 0.5) {
      this.play('walk', true);
    } else if (this.body.velocity.x < -0.5) {
      this.play('walk', true);
    } else {
      this.play('idle', true);
    }
  }

  onCollide(data) {
    if (this.dead) return;
    const {bodyA, bodyB} = data;
    const gameObject =
      bodyA.gameObject === this ? bodyB.gameObject : bodyA.gameObject;

    if (!this.isInvincible) {
      if (
        this.obstacles.is('Spike', bodyA) ||
        this.obstacles.is('Spike', bodyB)
      ) {
        this.setInvincible();
        this.health--;
        events.emit(PLAYER_HIT, {health: this.health});
        if (this.health === 0) {
          this.dead = true;
          this.setRotation((-90 * Math.PI) / 180);
          this.play('idle');
        }
        const xVel = this.flipX === true ? -3 : 3;
        this.setVelocity(xVel, -7);
      }
    }

    // If it is Touching a tile
    if (gameObject instanceof Phaser.Physics.Matter.TileBody) {
      this.isTouchingGround = true;
      return;
    }
    if (gameObject) {
      const type = gameObject.getData('type');
      if (type === 'coin') {
        events.emit(COIN_COLLECTED);
        gameObject.destroy();
      }
    }
  }

  setInvincible(time = 50) {
    this.isInvincible = true;
    this.invincibleTime = time;
  }

  removeInvincible() {
    this.isInvincible = false;
    this.invincibleTime = 0;
  }
}
