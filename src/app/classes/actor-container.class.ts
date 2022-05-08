import { GameObjects, Physics, Tilemaps } from "phaser";
import { EVENTS_NAME, GameStatus } from "../helpers/consts";
import { Actor } from "./actor.class";
import { WeaponAxe } from "./weapon-axe.class";
import { WeaponBow } from "./weapon-bow.class";
import { WeaponHammer } from "./weapon-hammer.class";
import { WeaponKnightSword } from "./weapon-knight-sword.class";
import { WeaponSpear } from "./weapon-spear.class";
import { WeaponSword } from "./weapon-sword.class";

import { Text } from './text.class';

/**
 * Todo:
 * Extend player container to use that container
 * / Add camara follow
 * / Add cursor move
 * / Add Animation
 * / Add Projectile on the fly
 * / Add Projectile type based on Weapon
 * Add diffrent hitboxs and mass
 */

export class ActorContainer extends GameObjects.Container {

  facingAngle = 0;
  bodyDimension = 6;

  weaponContainer: GameObjects.Container;
  weapon!: any;

  collider!: Tilemaps.TilemapLayer;
  bullets!: any;

  hitbox!: any;
  hitboxes!: Phaser.GameObjects.Group;

  showDebugElement = false;
  triangle!: any;

  actor!: Actor;

  velocity = 100;
  isMoving = false;

  getsDamage = false;

  private hpValue!: Text;
  hp = 100;

  damage = 5;

  target = {
    x: 0,
    y: 0
  }

  constructor(scene: Phaser.Scene, x: number | undefined, y: number | undefined, collider?: Tilemaps.TilemapLayer) {
    super(scene, x, y);

    this.setSize(this.bodyDimension, this.bodyDimension);
    scene.add.existing(this);
    scene.physics.world.enable(this);
    this.setDimensions();

    this.hitboxes = new GameObjects.Group(this.scene);

    if (collider) {
      this.collider = collider;
      this.scene.physics.add.collider(this, this.collider)
    }

    this.addDebugObject();

    this.weaponContainer = this.scene.add.container(0, 0);
    this.add(this.weaponContainer);

    this.setHpValueBar();

    this.scene.game.events.on(EVENTS_NAME.setWeapon, this.setWeapon, this);
  }

  setDimensions() {
    const body = this.getBody();
    body.setBounce(1, 1).setCollideWorldBounds(true);
    body.setCircle(this.bodyDimension);
    body.offset.y = -this.bodyDimension / 2;
    body.offset.x = -this.bodyDimension / 2;
  }

  setHpValueBar() {
    this.hpValue = new Text(this.scene, 0, 0, this.hp.toString()).setFontSize(12);
    this.hpValue.setOrigin(.5, 1);
    this.hpValue.y = -18;
    this.add(this.hpValue);
  }

  public getBody() {
    // Need new type reference with physics type otherwise complain that velocity not exists
    return this.body as unknown as Physics.Arcade.Body;
  }

  public move(directionX: number, directionY: number, flip = false) {
    const body = this.getBody();

    let playerVelocity = new Phaser.Math.Vector2();
    playerVelocity.x = directionX;
    playerVelocity.y = directionY;

    playerVelocity.normalize();
    playerVelocity.scale(this.velocity);

    body.setVelocity(playerVelocity.x, playerVelocity.y);

    if (this.actor && this.isMoving) {
      this.actor.setState('run');
    }
  }

  setWeapon(weapon?: string) {
    if (this.weapon) {
      this.weaponContainer.remove(this.weapon);

      if (this.weapon.bullets) {
        this.weapon.bullets.destroy();
      }

      if (this.hitbox) {
        this.weaponContainer.remove(this.hitbox);
        this.hitbox.destroy();
      }

      this.weapon.destroy();
    }

    switch (weapon) {
      case 'spear':
        this.weapon = new WeaponSpear(this.scene, 0, 0);
        break;
      case 'bow':
        this.weapon = new WeaponBow(this.scene, 0, 0, this);
        break;
      case 'knightSword':
        this.weapon = new WeaponKnightSword(this.scene, 0, 0);
        break;
      case 'axe':
        this.weapon = new WeaponAxe(this.scene, 0, 0, this);
        break;
      case 'hammer':
        this.weapon = new WeaponHammer(this.scene, 0, 0);
        break;

      default:
        this.weapon = new WeaponSword(this.scene, 0, 0);
    }

    this.weaponContainer.add(this.weapon);

    this.damage = this.weapon.damage;

    if (this.weapon.hitbox) {
      this.hitbox = this.weapon.hitbox;
      this.weaponContainer.add(this.hitbox);
      this.hitboxes.add(this.hitbox);
    }

    if (this.weapon.bullets) {
      this.hitboxes.add(this.weapon.bullets);
    }
  }

  attack() { }

  followPointer() {
    this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {

      this.facingAngle = Phaser.Math.Angle.Between(this.x, this.y, pointer.worldX, pointer.worldY);

      this.target.x = pointer.worldX;
      this.target.y = pointer.worldY;
      this.actor.flipX = this.x > pointer.worldX;
      this.weaponContainer.scaleY = this.x > pointer.worldX ? -1 : 1;

      this.bringToTop(this.y > pointer.worldY ? this.actor : this.weaponContainer);
    });

    return this;
  }

  pointerAction() {
    let timer: Phaser.Time.TimerEvent;
    const attack = () => {
      if (this.weapon && !this.weapon.isAttacking) {
        this.weapon.playWeaponAnimation();
        this.attack();
      }
    }

    this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (this.weapon) {
        attack();

        timer = this.scene.time.addEvent({
          delay: 100,
          callback: () => {
            attack();
          },
          loop: true
        })
      }
    });

    this.scene.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      if (this.weapon && timer) {
        timer.remove();
      }
    });

    return this;
  }

  public getDamage(value: number): void {
    if (!this.getsDamage) {
      this.getsDamage = true;
      this.hpValue.setText(this.hp.toString());
      if (this.hp > 0) {
        this.scene.tweens.add({
          targets: this.actor,
          duration: 50,
          repeat: 2,
          yoyo: true,
          alpha: 0.5,
          onStart: () => {
            if (value) {
              this.hp = this.hp - value;
            }
          },
          onComplete: () => {
            this.setAlpha(1);
            this.getsDamage = false;
          },
        });
      } else {
        this.scene.game.events.emit(EVENTS_NAME.gameEnd, GameStatus.LOSE, 'level-test-scene');
        this.scene.scene.stop();
      }
    }
  }

  updateTriangleRotation() {
    Phaser.Math.RotateTo(this.triangle, 0, 0, this.facingAngle, 12);
    this.triangle.rotation = this.facingAngle;
  }

  updateWeaponContainerRotation() {
    Phaser.Math.RotateTo(this.weaponContainer, 0, 0, this.facingAngle, 0);
    this.weaponContainer.rotation = this.facingAngle;
  }


  preUpdate(): void {
    if (this.weapon && !this.weapon.isAttacking) {
      if (this.showDebugElement) {
        this.updateTriangleRotation();
      }
      this.updateWeaponContainerRotation();
    }

    if (this.isMoving) {
      this.actor.setState('run');
    } else {
      this.actor.setState('idle');
    }
  }

  addDebugObject() {
    this.showDebugElement = true;
    // Background Circle
    const circle = this.scene.add.circle(0, 0, 16, 0xff6600);
    circle.setStrokeStyle(1, 0xff0000);
    circle.alpha = 0.25;
    this.add(circle);

    // Facing Triangle
    this.triangle = this.scene.add.triangle(
      12, 0,
      0, 0,
      8, 4,
      0, 8,
      0xff6600
    );
    this.triangle.setStrokeStyle(1, 0xff0000);
    this.triangle.setAlpha(0.5)
    this.add(this.triangle);
  }
}
