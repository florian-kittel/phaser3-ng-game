import { Weapon } from "./weapon.class";

export class WeaponSpear extends Weapon {

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'spear',);

    this.setData({
      config: {
        angle: 0,
        startAngle: Phaser.Math.DegToRad(-120),
        endAngle: Phaser.Math.DegToRad(120),
        distance: 10,
      }
    });

    this.damage = 40;

    const config = this.getData('config');

    this.rotation = config.angle;
    this.x = config.distance;

    this.initHitbox({
      distance: 16,
      radius: 8,
      delay: 0,
      duration: 150,
      moveX: 56,
      fromRadius: 4
    });
  }

  playWeaponAnimation() {
    if (this.isAttacking) {
      return;
    }

    this.attack();

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
