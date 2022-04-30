import { Physics } from "phaser";


export class WeaponAxe extends Physics.Arcade.Sprite {

  isAttacking = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'axe', 0);

    this.setData({
      config: {
        angle: Phaser.Math.DegToRad(-120),
        startAngle: Phaser.Math.DegToRad(-120),
        endAngle: Phaser.Math.DegToRad(0),
        distance: 12,
      }
    });

    const config = this.getData('config');
    const angle = config.angle;
    Phaser.Math.RotateTo(this, 0, 0, angle, config.distance);
    this.rotation = angle;
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
      repeat: 0,
      yoyo: false,
      rotation: config.endAngle,
      onStart: () => {
      },
      onUpdate: (tween, target) => {
        Phaser.Math.RotateTo(this, 0, 0, Phaser.Math.DegToRad(target.angle), config.distance);
      },
      onComplete: () => {
        config.angle = config.startAngle;
        Phaser.Math.RotateTo(this, 0, 0, config.angle, config.distance);
        this.rotation = config.angle;
        this.isAttacking = false;
      },
    });
  }
}
