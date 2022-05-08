import { ActorContainer } from "./actor-container.class";
import { Weapon } from "./weapon.class";


export class WeaponBow extends Weapon {

  container: ActorContainer;
  constructor(scene: Phaser.Scene, x: number, y: number, container: ActorContainer) {
    super(scene, x, y, 'bow');

    this.container = container;
    this.damage = 15;

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

    this.initProjectile(container.collider, 'arrow', 400);
  }

  playWeaponAnimation() {
    if (this.isAttacking) {
      return;
    }

    this.fire(this.container.x, this.container.y, Phaser.Math.RadToDeg(this.container.facingAngle));

    this.isAttacking = true;

    this.scene.time.addEvent({
      delay: 200,
      callback: () => {
        this.isAttacking = false;
      }
    })
  }
}
