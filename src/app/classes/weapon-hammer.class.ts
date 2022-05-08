import { Weapon } from "./weapon.class";

export class WeaponHammer extends Weapon {

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'bighammer');

    this.setData({
      config: {
        startAngle: -230,
        endAngle: 0,
        distance: 16
      },
    });

    this.damage = 80;

    const config = this.getData('config');
    this.rotateTo(config.startAngle);

    this.initHitbox({
      distance: 30,
      radius: 28,
      delay: 180,
      duration: 100,
      moveX: 0
    });
  }

  playWeaponAnimation() {
    if (this.isAttacking) {
      return;
    }

    const config = this.getData('config');
    this.isAttacking = true;

    this.attack();

    this.scene.tweens.addCounter({
      from: config.startAngle,
      to: config.endAngle,
      duration: 500,
      completeDelay: 200,
      ease: Phaser.Math.Easing.Bounce.Out,
      repeat: 0,
      onUpdate: (tween) => {
        this.rotateTo(tween.getValue());
      },
      onComplete: () => {
        this.rotateTo(config.startAngle);
        this.isAttacking = false;
      },
    });
  }
}
