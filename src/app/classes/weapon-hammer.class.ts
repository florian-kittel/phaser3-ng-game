import { Physics } from "phaser";


export class WeaponHammer extends Physics.Arcade.Sprite {

  isAttacking = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'hammer', 0);

    this.setData({
      config: {
        angle: Phaser.Math.DegToRad(-230),
        startAngle: Phaser.Math.DegToRad(-230),
        endAngle: Phaser.Math.DegToRad(0),
        distance: 16,
      }
    });

    const config = this.getData('config');
    const angle = config.angle;
    Phaser.Math.RotateTo(this, 0, 0, config.startAngle, config.distance);
    this.rotation = config.startAngle + Phaser.Math.DegToRad(90);
    // this.angle = 0;
    console.log(this.data);
  }

  playWeaponAnimation() {
    if (this.isAttacking) {
      return;
    }

    const config = this.getData('config');
    this.isAttacking = true;

    this.scene.tweens.addCounter({
      from: -230,
      to: 0,
      duration: 500,
      completeDelay: 200,
      ease: Phaser.Math.Easing.Bounce.Out,
      repeat: 0,
      onUpdate: (tween) => {
        Phaser.Math.RotateTo(this, 0, 0, Phaser.Math.DegToRad(tween.getValue()), config.distance);
        this.rotation = Phaser.Math.DegToRad(tween.getValue() + 90);
      },
      onComplete: () => {
        // this.flipY = !this.flipY;
        // config.angle = config.startAngle;
        Phaser.Math.RotateTo(this, 0, 0, config.startAngle, config.distance);
        this.rotation = config.startAngle + Phaser.Math.DegToRad(90);
        this.isAttacking = false;
      },
    });
  }
}
