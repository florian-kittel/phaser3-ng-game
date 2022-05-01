import { Tilemaps } from 'phaser';
import { ActorContainer } from './actor-container.class';
import { Actor } from './actor.class';

export class ActorKnight extends ActorContainer {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyW: Phaser.Input.Keyboard.Key;
  private keyA: Phaser.Input.Keyboard.Key;
  private keyS: Phaser.Input.Keyboard.Key;
  private keyD: Phaser.Input.Keyboard.Key;


  override velocity = 150;
  override bodyDimension = 8;

  override hp = 100;

  constructor(scene: Phaser.Scene, x: number, y: number, collider?: Tilemaps.TilemapLayer) {
    super(scene, x, y, collider);

    // KEYS
    // Todo move to user class
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.keyW = this.scene.input.keyboard.addKey('W');
    this.keyA = this.scene.input.keyboard.addKey('A');
    this.keyS = this.scene.input.keyboard.addKey('S');
    this.keyD = this.scene.input.keyboard.addKey('D');

    this.actor = new Actor(this.scene, 0, -6, 'knight-m', 0);
    this.add(this.actor);
    this.initActorAnimations();

    this.setWeapon('sword');

    this.on('destroy', () => { });

    this.bringToTop(this.actor);
  }

  override update(): void {
    let playerVelocity = new Phaser.Math.Vector2();
    this.getBody().setVelocity(0);
    this.isMoving = false;


    if (this.cursors) {
      let moveX = 0;
      let moveY = 0;

      if (this.cursors.left.isDown || this.keyA.isDown) {
        moveX = -1;
      } else if (this.cursors.right.isDown || this.keyD.isDown) {
        moveX = 1;
      }

      if (this.cursors.up.isDown || this.keyW.isDown) {
        moveY = -1;
      } else if (this.cursors.down.isDown || this.keyS.isDown) {
        moveY = 1;
      }

      if (moveX || moveY) {
        this.isMoving = true;
        this.move(moveX, moveY);
      }

    }
  }

  private initActorAnimations(): void {
    this.actor.anims.create({
      key: 'idle',
      frames: this.actor.anims.generateFrameNames('knight-m', {
        prefix: 'idle-',
        start: 0,
        end: 3,
      }),
      frameRate: 4,
    });
    this.actor.anims.create({
      key: 'run',
      frames: this.actor.anims.generateFrameNames('knight-m', {
        prefix: 'run-',
        start: 0,
        end: 3,
      }),
      frameRate: 10,
    });
  }
}
