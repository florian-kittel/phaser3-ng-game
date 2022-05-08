import { Physics } from "phaser";
import { Weapon } from "./weapon.class";


export class WeaponSword extends Weapon {

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'sword');

    this.setData({
      config: {
        angle: Phaser.Math.DegToRad(-120),
        startAngle: Phaser.Math.DegToRad(-120),
        endAngle: Phaser.Math.DegToRad(120),
        distance: 12,
      }
    });

    const config = this.getData('config');
    const angle = config.angle;

    this.damage = 25;

    Phaser.Math.RotateTo(this, 0, 0, angle, config.distance);
    this.rotation = angle;

    this.initHitbox({
      distance: 4,
      radius: 10,
      delay: 50,
      duration: 100,
      moveX: 16
    });
  }

  playWeaponAnimation() {
    if (this.isAttacking) {
      return;
    }

    this.attack();

    const config = this.getData('config');
    this.isAttacking = true;
    const targetAngle = config.angle === config.startAngle ? config.endAngle : config.startAngle;
    this.scene.tweens.add({
      targets: this,
      duration: 200,
      ease: Phaser.Math.Easing.Circular.In,
      repeat: 0,
      yoyo: false,
      rotation: targetAngle,
      onStart: () => {
      },
      onUpdate: (tween, target) => {
        Phaser.Math.RotateTo(this, 0, 0, Phaser.Math.DegToRad(target.angle), config.distance);
      },
      onYoyo: () => {
        this.flipY = !this.flipY;
      },
      onComplete: () => {
        this.flipY = !this.flipY;
        config.angle = targetAngle;
        this.isAttacking = false;
      },
    });
  }
}
