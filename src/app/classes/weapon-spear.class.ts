import { Physics } from "phaser";

export class WeaponSpear extends Physics.Arcade.Sprite {

  isAttacking = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'spear', 0);

    this.setData({
      config: {
        angle: 0,
        startAngle: Phaser.Math.DegToRad(-120),
        endAngle: Phaser.Math.DegToRad(120),
        distance: 10,
      }
    });

    const config = this.getData('config');

    this.rotation = config.angle;
    this.x = config.distance;
  }

  playWeaponAnimation() {
    if (this.isAttacking) {
      return;
    }

    const config = this.getData('config');
    this.isAttacking = true;
    this.scene.tweens.add({
      targets: this,
      duration: 150,
      ease: Phaser.Math.Easing.Quadratic.In,
      yoyo: true,
      x: config.distance * 4,
      onComplete: () => {
        this.isAttacking = false;
      },
    });
  }
}
