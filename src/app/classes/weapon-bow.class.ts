import { Physics } from "phaser";


export class WeaponBow extends Physics.Arcade.Sprite {

  isAttacking = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'bow', 0);

    this.setData({
      config: {
        angle: Phaser.Math.DegToRad(90),
        startAngle: Phaser.Math.DegToRad(-120),
        endAngle: Phaser.Math.DegToRad(120),
        distance: 12,
      }
    });

    const config = this.getData('config');
    this.x = config.distance;
  }

  playWeaponAnimation() {
    if (this.isAttacking) {
      return;
    }
  }
}
