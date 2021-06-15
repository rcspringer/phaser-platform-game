import Phaser from 'phaser';
import {
  COIN_COLLECTED,
  PLAYER_HIT,
  PLAYER_JUMP,
  events,
} from '../utils/EventCenter';

export default class Player extends Phaser.Physics.Matter.Sprite {
  constructor(world, x, y, cursors, obstacles) {
    super(world, x, y, 'characters');
    this.obstacles = obstacles;
    this.cursors = cursors;
    this.speed = 2;
    this.jumpHeight = 5;
    this.hitColor = Phaser.Display.Color.GetColor(255, 0, 0);
    // Change the physics body size
    this.setRectangle(10, 22, {
      friction: 0,
      frictionAir: 0.01,
      frictionStatic: 0,
    });

    // this.setFriction(1, 1, 0);
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
    console.log('Inited');
    this.dead = false;
    this.health = 3;
    this.isInvincible = false;
    this.invincibleTime = 0;
    this.isTouchingGround = false;
    this.play('idle');
    this.setOnCollide(data => this.onCollide(data));
  }

  // This is the update function called when and object is in the updateList
  preUpdate(time, deltaTime) {
    super.preUpdate(time, deltaTime);
    this.update(time, deltaTime);
  }

  update() {
    if (this.dead) return;
    // Invicible timer and check
    if (this.isInvincible) {
      this.invincibleTime--;
      if (this.invincibleTime % 5 === 0) {
        this.clearTint();
      } else {
        this.setTint(this.hitColor);
      }
      if (this.invincibleTime < 0) {
        this.removeInvincible();
        this.clearTint();
      }
    }

    if (this.cursors.left.isDown) {
      // if the left arrow key is down
      this.setVelocityX(-this.speed); // move left
      this.flipX = false;
    } else if (this.cursors.right.isDown) {
      // if the right arrow key is down
      this.setVelocityX(this.speed); // move right
      this.flipX = true;
    }
    const jumpJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space);

    if (jumpJustPressed && this.isTouchingGround) {
      this.setVelocityY(-this.jumpHeight); // jump up
      this.isTouchingGround = false;
      events.emit(PLAYER_JUMP);
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

// at the bottom of the player.js file
Phaser.GameObjects.GameObjectFactory.register(
  'player',
  function (x, y, cursors, obstacles) {
    const player = new Player(
      this.scene.matter.world,
      x,
      y,
      cursors,
      obstacles,
    );

    this.displayList.add(player);
    this.updateList.add(player);

    return player;
  },
);
