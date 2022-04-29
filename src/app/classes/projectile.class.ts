import { Physics, Tilemaps } from "phaser";

export class Projectile extends Physics.Arcade.Sprite {
  public speed = 300;
  public hasHit = false;
  private hitSize = 8;
  private projectile = 'arrow';

  constructor(scene: Phaser.Scene, x: number, y: number, projectile: string = 'arrow', hitSize: number = 8) {
    super(scene, x, y, projectile);
    this.hitSize = hitSize;
    this.projectile = projectile;
  }

  fire(x: number, y: number, angle: number) {
    this.body.reset(x, y);
    this.body.setCircle(this.hitSize)
    // this.body.setSize(8, 8);

    this.setActive(true);
    this.setVisible(true);

    const direction = this.scene.physics.velocityFromAngle(angle, this.speed);
    this.rotation = Phaser.Math.DegToRad(angle + 90);

    this.setVelocityX(direction.x);
    this.setVelocityY(direction.y);

    this.scene.sound.play('arrowShotSfx');

    if (this.projectile !== 'arrow') {
      // this.scene.time.addEvent({ delay: 120, callback: () => { this.destroy(); } });
    }
  }

  justHit() {
    if (this.hasHit) {
      return;
    }

    this.hasHit = true;

    this.setActive(false);
    this.setVisible(false);

    this.scene.sound.play('arrowHitSfx');

    this.scene.time.addEvent({ delay: 120, callback: () => { this.destroy(); } });
  }

  override preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    if (this.x > this.scene.game.scale.width) {
      this.setActive(false);
      this.setVisible(false);
    }
  }

  onWorldBounds() {
    this.setActive(false);
    this.setVisible(false);
  }
}

export class Projectiles extends Physics.Arcade.Group {
  constructor(
    scene: Phaser.Scene,
    private worldCollider: Tilemaps.TilemapLayer,
  ) {
    super(scene.physics.world, scene);

    this.createProjectiles(1);
  }

  createProjectiles(count: number) {
    this.createMultiple({
      frameQuantity: count,
      key: 'projectile',
      active: false,
      visible: false,
      classType: Projectile,
      setOrigin: {
        x: 0.5,
        y: 0.5
      },
    })
  }

  fireBullet(x: number, y: number, angle: number) {
    let bullet = this.getFirstDead(false);

    if (bullet) {
      bullet.fire(x, y, angle);

      this.scene.time.addEvent({ delay: 200, callback: () => { this.createProjectiles(1); } });

      this.scene.physics.add.collider(bullet, this.worldCollider, () => {
        bullet.setActive(false);
        bullet.setVisible(false);
        bullet.destroy();
      });

    }
  }
}
