import { Physics } from "phaser";
import { Weapon } from "./weapon.class";


export class WeaponKnightSword extends Weapon {


  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'knightSword');

    this.setData({
      config: {
        angle: Phaser.Math.DegToRad(-110),
        startAngle: Phaser.Math.DegToRad(-110),
        endAngle: Phaser.Math.DegToRad(110),
        distance: 10,
      }
    });

    this.damage = 50;

    const config = this.getData('config');
    const angle = config.angle;
    Phaser.Math.RotateTo(this, 0, 0, angle, config.distance);
    this.rotation = angle;

    this.initHitbox({
      distance: 4,
      radius: 20,
      delay: 150,
      duration: 140,
      moveX: 32
    });
  }

  playWeaponAnimation() {
    if (this.isAttacking) {
      return;
    }

    const config = this.getData('config');
    this.isAttacking = true;
    this.attack();
    const targetAngle = config.angle === config.startAngle ? config.endAngle : config.startAngle;
    this.scene.tweens.add({
      targets: this,
      duration: 300,
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
