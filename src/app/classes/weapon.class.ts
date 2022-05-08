import { Physics, Tilemaps } from "phaser";
import { Projectiles } from "./projectile.class";

export class Weapon extends Physics.Arcade.Sprite {
  isAttacking = false;
  isFlipped = false;
  hitbox!: any;
  bullets!: any;

  damage = 1;
  distance = 12;
  radius = 30;
  fromRadius = 0;
  delay = 180;
  duration = 100;
  moveX = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string = 'bow') {
    super(scene, x, y, texture, 0);
    this.scene = scene;
  }

  rotateTo(angle: number) {
    const config = this.getData('config');
    Phaser.Math.RotateTo(this, 0, 0, Phaser.Math.DegToRad(angle), config.distance);
    this.rotation = Phaser.Math.DegToRad(angle);
  }

  initProjectile(wallsLayer: Tilemaps.TilemapLayer, sprite: string, range: number, spin = false) {
    this.bullets = new Projectiles(this.scene, sprite, range, spin, wallsLayer);
  }

  fire(x: number, y: number, angle: number) {
    this.bullets.fireBullet(x, y, angle);
  }

  initHitbox({
    distance = 12,
    radius = 30,
    delay = 180,
    duration = 100,
    moveX = 0,
    fromRadius = 0,
  }) {
    this.distance = distance;
    this.radius = radius;
    this.delay = delay;
    this.duration = duration;
    this.moveX = moveX;
    this.fromRadius = fromRadius;

    this.hitbox = this.scene.add.circle(this.distance, 0, this.radius, 0xff0000);
    this.scene.physics.world.enable(this.hitbox);
    this.hitbox.body.setCircle(1);
    this.hitbox.setOrigin(.5, .5);
    this.hitbox.body.setImmovable();
    this.hitbox.body.pushable = false;
    this.hitbox.body.enable = false;

    this.hitbox.setActive(false);
    this.hitbox.setVisible(false);

    this.hitbox.justHit = () => { };
  }

  attack() {
    if (this.moveX && this.moveX > 0) {
      this.scene.tweens.add({
        targets: this.hitbox,
        delay: this.delay,
        duration: this.duration,
        x: {
          start: this.distance,
          to: this.moveX
        },
        onComplete: () => {
          this.hitbox.x = this.distance;
        }
      })
    }

    this.scene.tweens.addCounter({
      from: this.fromRadius,
      to: this.radius,
      delay: this.delay,
      duration: this.duration,
      completeDelay: 0,
      ease: Phaser.Math.Easing.Linear,
      repeat: 0,
      onStart: () => {
        this.hitbox.setActive(true);
        this.hitbox.setVisible(true);
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
