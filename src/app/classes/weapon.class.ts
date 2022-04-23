import { Physics } from "phaser";
import { Actor } from "./actor.class";

export class Weapon extends Physics.Arcade.Sprite {

  actor!: Actor;
  radius = 28;
  facingAngle = 0;

  constructor(scene: Phaser.Scene, actor: Actor) {
    super(scene, actor.x, actor.y, 'bow');
    this.scene = scene;
    this.actor = actor;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setSize(8, 8);

    scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      this.setWeaponAngle(pointer);
    });

    this.onCreate();
  }

  onCreate() {
    console.log('create');
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
