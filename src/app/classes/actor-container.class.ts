import { GameObjects, Physics } from 'phaser';
import { EVENTS_NAME, GameStatus } from '../helpers/consts';
import { Weapon } from './weapon.class';
import { Text } from './text.class';

export class ActorContainer extends GameObjects.Container {
  protected hp = 100;
  private hpValue: Text;
  velocity = 150;
  actor: GameObjects.Sprite;
  weapon: GameObjects.Sprite;

  followPointer = false;
  cursorMove = false;

  radius = 16;
  facingAngle = 0;

  private rectangle!: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, []);

    this.setSize(16, 32);
    scene.add.existing(this);
    scene.physics.world.enable(this);

    this.rectangle = this.scene.add.rectangle(0, 0, 16, 32, 0x7CFC00);
    this.actor = this.scene.add.sprite(0, 0, 'knight-m', 0);
    this.weapon = new Physics.Arcade.Sprite(this.scene, 0, 0, 'bow', 0);


    this.add(this.rectangle);
    this.add(this.actor);
    this.add(this.weapon);

    this.initAnimations();

    this.hpValue = new Text(this.scene, -this.width, 0 - this.height, this.hp.toString()).setFontSize(12);

    this.add(this.hpValue);
  }

  private getBody() {
    // Need new type reference with physics type otherwise complain that velocity not exists
    return this.body as unknown as Physics.Arcade.Body;
  }

  preUpdate(): void {
    if (this.followPointer) {
      this.updatePosition();
    }
  }

  override update(...args: any[]): void {

  }

  public getDamage(value?: number): void {
    this.hpValue.setText(this.hp.toString());

    if (this.hp <= 0) {
      this.scene.game.events.emit(EVENTS_NAME.gameEnd, GameStatus.LOSE , this.scene.scene.key);
    } else {}
      this.scene.tweens.add({
        targets: this,
        duration: 100,
        repeat: 3,
        yoyo: true,
        alpha: 0.5,
        onStart: () => {
          if (value) {
            this.hp = this.hp - value;
          }
        },
        onComplete: () => {
          this.setAlpha(1);
        },
      });

  }

  move(directionX: number, directionY: number, flip = false) {
    const body = this.getBody();

    let playerVelocity = new Phaser.Math.Vector2();
    playerVelocity.x = directionX;
    playerVelocity.y = directionY;

    playerVelocity.normalize();
    playerVelocity.scale(this.velocity);

    body.setVelocity(playerVelocity.x, playerVelocity.y);

    if (!this.followPointer) {
      this.actor.flipX = playerVelocity.x < 0;
    }
  }

  override setState(state: string) {
    this.actor.anims.play(state, true);
    return this;
  }

  activateFollowPointer() {
    this.followPointer = true;
    this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      this.setWeaponAngle(pointer);

      this.actor.flipX = this.x > pointer.worldX;
    });

    return this;
  }

  activateCurorMove() {
    this.cursorMove = true;

    return this;
  }

  addWeapon(weapon: Weapon) {
    this.weapon = weapon;
    this.add(this.weapon);
  }

  setWeaponAngle(pointer: Phaser.Input.Pointer) {
    this.facingAngle = Phaser.Math.Angle.Between(this.x, this.y, pointer.worldX, pointer.worldY);
  }

  updatePosition() {
    this.weapon.setRotation(this.facingAngle);
    this.weapon = Phaser.Math.RotateTo(this.weapon, 0, 0, this.facingAngle, this.radius);    // this.weapon.x = 0;
  }

  private initAnimations(): void {
    this.actor.anims.create({
      key: 'idle',
      frames: this.actor.anims.generateFrameNames('knight-m', {
        prefix: 'idle-',
        start: 0,
        end: 3,
      }),
      frameRate: 6,
    });
    this.actor.anims.create({
      key: 'run',
      frames: this.actor.anims.generateFrameNames('knight-m', {
        prefix: 'run-',
        start: 0,
        end: 3,
      }),
      frameRate: 12,
    });
  }
}
