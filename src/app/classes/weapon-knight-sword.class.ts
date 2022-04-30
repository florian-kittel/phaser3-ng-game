import { Physics } from "phaser";


export class WeaponKnightSword extends Physics.Arcade.Sprite {

  isAttacking = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'knightSword', 0);

    this.setData({
      config: {
        angle: Phaser.Math.DegToRad(-100),
        startAngle: Phaser.Math.DegToRad(-100),
        endAngle: Phaser.Math.DegToRad(100),
        distance: 10,
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
    const targetAngle = config.angle === config.startAngle ? config.endAngle : config.startAngle;
    this.scene.tweens.add({
      targets: this,
      duration: 300,
      repeat: 0,
      yoyo: false,
      rotation: targetAngle,
      onStart: () => {
      },
      onUpdate: (tween, target) => {
        Phaser.Math.RotateTo(this, 0, 0, Phaser.Math.DegToRad(target.angle), config.distance );
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
