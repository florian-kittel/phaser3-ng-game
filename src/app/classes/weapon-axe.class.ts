import { ActorContainer } from "./actor-container.class";
import { Weapon } from "./weapon.class";


export class WeaponAxe extends Weapon {

  container: ActorContainer;
  constructor(scene: Phaser.Scene, x: number, y: number, container: ActorContainer) {
    super(scene, x, y, 'axe');

    this.container = container;
    this.damage = 20;

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

    this.initProjectile(container.collider, 'axe', 200, true);
  }

  playWeaponAnimation() {
    if (this.isAttacking) {
      return;
    }

    this.fire(this.container.x, this.container.y, Phaser.Math.RadToDeg(this.container.facingAngle));

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
