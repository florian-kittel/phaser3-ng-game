import { Physics } from "phaser";

export class Weapon extends Physics.Arcade.Sprite {
  isAttacking = false;
  isFlipped = false;
  hitbox!: any;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string = 'bow') {
    super(scene, x, y, texture, 0);
    this.scene = scene;
  }

  rotateTo(angle: number) {
    const config = this.getData('config');
    Phaser.Math.RotateTo(this, 0, 0, Phaser.Math.DegToRad(angle), config.distance);
    this.rotation = Phaser.Math.DegToRad(angle);
  }

  initHitbox() {
    this.hitbox = this.scene.add.circle(32, 0, 1, 0xff0000);
    this.scene.physics.world.enable(this.hitbox);

    this.hitbox.setOrigin(.5, .5)
    this.hitbox.body.setCircle(1);
    this.hitbox.body.setImmovable();
    this.hitbox.body.pushable = false;
    this.hitbox.body.enable = false;

    this.hitbox.setActive(false);
    this.hitbox.setVisible(false);
  }

  attack() {
    this.hitbox.setActive(true);
    this.hitbox.setVisible(true);

    this.scene.tweens.addCounter({
      from: 0,
      to: 30,
      delay: 180,
      duration: 100,
      completeDelay: 0,
      ease: Phaser.Math.Easing.Linear,
      repeat: 0,
      onStart: () => {
        this.scene.sound.play('impactshort');
      },
      onUpdate: (tween) => {
        this.hitbox.body.enable = true;
        this.hitbox.body.setCircle(tween.getValue());
        this.hitbox.radius = tween.getValue();
      },
      onComplete: () => {
        this.hitbox.radius = 1;
        this.hitbox.body.setCircle(1);
        this.hitbox.body.enable = false;
        this.hitbox.setActive(false);
        this.hitbox.setVisible(false);
      },
    });
  }
}
