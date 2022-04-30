import { GameObjects, Physics } from "phaser";
import { EVENTS_NAME } from "../helpers/consts";
import { WeaponAxe } from "./weapon-axe.class";
import { WeaponBow } from "./weapon-bow.class";
import { WeaponKnightSword } from "./weapon-knight-sword.class";
import { WeaponSpear } from "./weapon-spear.class";
import { WeaponSword } from "./weapon-sword.class";

export class DebugContainer extends GameObjects.Container {

  facingAngle = 0;

  weaponContainer: GameObjects.Container;
  weapon!: any;

  showDebugElement = false;
  triangle!: any;

  constructor(scene: Phaser.Scene, x: number | undefined, y: number | undefined) {
    super(scene, x, y);

    this.setSize(32, 32);
    scene.add.existing(this);
    scene.physics.world.enable(this);

    const body = this.body as unknown as Physics.Arcade.Body;
    body.setCircle(16);

    this.addDebugObject();
    this.add(this.scene.add.sprite(0, -8, 'knight-m', 0));

    this.weaponContainer = this.scene.add.container(0, 0);
    this.add(this.weaponContainer);

    this.scene.input.enableDebug(this.weaponContainer);
    this.addWeaponBox('bow');

    // Update Angle to pointer Position
    this.followPointer();
    this.pointerAction();

    this.scene.game.events.on(EVENTS_NAME.changeWeapon, this.changeWeapon, this);
  }

  addWeaponBox(weapon: string) {
    this.weaponContainer.remove(this.weapon);

    switch (weapon) {
      case 'spear':
        this.weapon = new WeaponSpear(this.scene, 0, 0);
        break;
      case 'bow':
        this.weapon = new WeaponBow(this.scene, 0, 0);
        break;
      case 'knightSword':
        this.weapon = new WeaponKnightSword(this.scene, 0, 0);
        break;
      case 'axe':
        this.weapon = new WeaponAxe(this.scene, 0, 0);
        break;

      default:
        this.weapon = new WeaponSword(this.scene, 0, 0);
    }

    this.weaponContainer.add(this.weapon);
  }

  changeWeapon(weapon: string) {
    console.log(weapon);
    this.addWeaponBox(weapon);
  }

  followPointer() {
    this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      this.facingAngle = Phaser.Math.Angle.Between(this.x, this.y, pointer.worldX, pointer.worldY);
    });
  }

  pointerAction() {
    this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.weapon.playWeaponAnimation();
    });
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
    if (!this.weapon.isAttacking) {
      if (this.showDebugElement) {
        this.updateTriangleRotation();
      }
      this.updateWeaponContainerRotation();
    }
  }

  addDebugObject() {
    this.showDebugElement = true;
    // Background Circle
    const obj1 = this.scene.add.circle(0, 0, 8, 0xff6600);
    obj1.setStrokeStyle(1, 0xff0000);
    obj1.alpha = 0.5;
    this.add(obj1);

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
