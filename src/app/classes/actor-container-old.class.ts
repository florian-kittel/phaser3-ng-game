import { GameObjects, Physics, Tilemaps } from 'phaser';
import { EVENTS_NAME, GameStatus } from '../helpers/consts';
import { Weapon } from './weapon.class';
import { Text } from './text.class';
import { Projectiles } from './projectile.class';

export class ActorContainer extends GameObjects.Container {
  protected hp = 100;
  private hpValue: Text;
  velocity = 150;
  actor: GameObjects.Sprite;
  weapon: Physics.Arcade.Sprite;
  weaponContainer: GameObjects.Container;
  collider!: Tilemaps.TilemapLayer;

  public bullets!: any;

  target = {
    x: 0,
    y: 0
  }

  followPointer = false;
  cursorMove = false;

  radius = 16;
  facingAngle = 0;

  weapons = {
    bow: {
      sprite: 'bow',
      radius: 12,
      rotation: 0,
      bullet: 'arrow',
      range: 0
    },
    sword: {
      sprite: 'knightSword',
      radius: 16,
      rotation: 90,
      attackMove: true,
      bullet: 'wip',
      range: 32,
    },
    spear: {
      sprite: 'spear',
      radius: 12,
      rotation: 90,
      attackMove: true,
      bullet: 'wip',
      range: 48
    }
  }

  selectedWeapon!: any;

  private rectangle!: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene, x: number, y: number, collider?: Tilemaps.TilemapLayer) {
    super(scene, x, y, []);

    this.setSize(16, 16);
    scene.add.existing(this);
    scene.physics.world.enable(this);


    if (collider) {
      this.collider = collider;
      this.scene.physics.add.collider(this, this.collider)
    }

    this.bullets = new Projectiles(this.scene, this.collider);

    this.weaponContainer = new GameObjects.Container(this.scene, 8, 0);

    this.rectangle = this.scene.add.rectangle(8, 0, 8, 16, 0x7CFC00);
    this.actor = this.scene.add.sprite(0, -8, 'knight-m', 0);

    this.selectedWeapon = this.weapons['bow'];

    this.weapon = new Physics.Arcade.Sprite(this.scene, 0, 0, this.selectedWeapon.sprite, 0);
    scene.physics.world.enable(this.weapon);
    this.weapon.body.setSize(8, 8);

    scene.physics.world.enable(this.rectangle);

    console.log(this.rectangle.body);
    const body = this.rectangle.body as unknown as Physics.Arcade.Body;
    // const sword = new Physics.Arcade.Sprite(this.scene, 0, 0, 'knightSword', 0);
    // scene.physics.world.enable(sword);

    // sword.rotation = Phaser.Math.DegToRad(-90);

    // this.weaponContainer.add(this.rectangle);
    // this.weaponContainer.add(sword);

    this.weaponContainer.angle = 0;
    // sword.setOrigin(0, 1)
    // this.add(this.weaponContainer);
    this.add(this.weapon);
    this.add(this.actor);
    // this.add(this.bullets);

    this.initAnimations();

    this.hpValue = new Text(this.scene, -this.width, 0 - this.height, this.hp.toString()).setFontSize(12);

    // this.add(this.hpValue);
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
      this.scene.game.events.emit(EVENTS_NAME.gameEnd, GameStatus.LOSE, this.scene.scene.key);
    } else { }
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

      this.bringToTop(this.y > pointer.worldY ? this.actor : this.weapon);
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
    this.target.x = pointer.worldX;
    this.target.y = pointer.worldY;
    this.facingAngle = Phaser.Math.Angle.Between(this.x, this.y, pointer.worldX, pointer.worldY);
  }

  updatePosition() {
    this.weapon.setRotation(this.facingAngle + Phaser.Math.DegToRad(this.selectedWeapon.rotation));
    this.weapon = Phaser.Math.RotateTo(this.weapon, 0, 0, this.facingAngle, this.selectedWeapon.radius);    // this.weapon.x = 0;
  }

  attack() {
    if (this.followPointer) {

      this.bullets.fireBullet(this.x, this.y, this.weapon.angle - this.selectedWeapon.rotation);

      let playerVelocity = new Phaser.Math.Vector2();
      playerVelocity.x = this.target.x - this.x;
      playerVelocity.y = this.target.y - this.y;

      playerVelocity.normalize();
      playerVelocity.scale(this.selectedWeapon.range);

      if (this.selectedWeapon.attackMove) {
        this.followPointer = false;
        this.scene.tweens.add({
          targets: this.weapon,
          ease: "Bounce", // 'Cubic', 'Elastic', 'Bounce', 'Back'
          duration: 100,
          repeat: 0,
          yoyo: true,
          alpha: .5,
          x: playerVelocity.x,
          y: playerVelocity.y,
          onComplete: () => {
            this.weapon.setAlpha(1);
            this.followPointer = true;
          },
        });
      }
    }

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
