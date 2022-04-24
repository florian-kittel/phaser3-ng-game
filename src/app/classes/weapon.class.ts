import { Physics } from "phaser";
import { Actor } from "./actor.class";

export const weaponProperties: { [name: string]: any } = {
  bow: {
    radius: 16
  },
  knightSword: {
    radius: 16
  }
}

export class Weapon extends Physics.Arcade.Sprite {

  actor!: Actor;
  radius = 16;
  facingAngle = 0;
  selectedWeapon!: any;

  constructor(scene: Phaser.Scene, actor: Actor, weapon: string = 'bow') {
    super(scene, actor.x +16, actor.y, weapon);
    this.scene = scene;
    this.actor = actor;

    if (weaponProperties[weapon]) {
      this.selectedWeapon = weaponProperties[weapon];
      this.applyWeaponProperties();
    }

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // this.body.setSize(8, 8);

    scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      this.setWeaponAngle(pointer);
    });

    this.onCreate();
  }

  onCreate() { }

  applyWeaponProperties() {
    this.radius = this.selectedWeapon.radius;
    // this.setOrigin(0.5,0.5);
  }

  override preUpdate(): void {
    this.updatePosition();
  }

  setWeaponAngle(pointer: Phaser.Input.Pointer) {
    this.facingAngle = Phaser.Math.Angle.Between(this.actor.x, this.actor.y, pointer.worldX, pointer.worldY);
  }

  updatePosition() {
    this.setRotation(this.facingAngle);
    Phaser.Math.RotateTo(this, this.actor.x, this.actor.y, this.facingAngle, this.radius);
    this.body.reset(this.x, this.y);
  }
}
