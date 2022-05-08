import { Physics, Tilemaps } from "phaser";

export class Projectile extends Physics.Arcade.Sprite {
  public speed = 300;
  public hasHit = false;
  private hitSize = 8;
  private projectile = 'wip';

  range = 200;
  spin = false;

  private start = {
    x: 0, y: 0
  }

  constructor(scene: Phaser.Scene, x: number, y: number, projectile: string = 'wip', hitSize: number = 8) {
    super(scene, x, y, projectile);
    this.hitSize = hitSize;
    this.projectile = projectile;
  }

  fire(x: number, y: number, angle: number) {
    this.body.reset(x, y);
    this.body.setSize(8, 8);

    this.start.x = x;
    this.start.y = y;

    this.setActive(true);
    this.setVisible(true);

    this.state = 32;

    const direction = this.scene.physics.velocityFromAngle(angle, this.speed);
    this.rotation = Phaser.Math.DegToRad(angle);

    this.setVelocityX(direction.x);
    this.setVelocityY(direction.y);

    this.scene.sound.play('arrowShotSfx');

    if (this.projectile !== 'arrow') {
      // this.scene.time.addEvent({ delay: 120, callback: () => { this.destroy(); } });
    }
  }

  justHit(playSound = true) {
    if (this.hasHit) {
      return;
    }

    this.hasHit = true;

    this.setActive(false);
    this.setVisible(false);

    if (playSound) {
      this.scene.sound.play('arrowHitSfx');
    }

    this.scene.time.addEvent({ delay: 120, callback: () => { this.destroy(); } });
  }

  override preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    if (this.x > this.scene.game.scale.width) {
      this.setActive(false);
      this.setVisible(false);
    }
    const body = this.body as unknown as Physics.Arcade.Body;
    var dist = Phaser.Math.Distance.BetweenPoints({ x: body.x, y: body.y }, { x: this.start.x, y: this.start.y });

    if (this.spin) {
      this.angle += 25;
    }

    if (dist > this.range) {
      this.justHit(false);
    }
  }

  onWorldBounds() {
    this.setActive(false);
    this.setVisible(false);
  }
}

export class Projectiles extends Physics.Arcade.Group {
  sprite: string = 'arrow';
  spin: boolean = false;
  range: number;

  constructor(
    scene: Phaser.Scene,
    sprite: string,
    range = 200,
    spin = false,
    private worldCollider: Tilemaps.TilemapLayer,
  ) {
    super(scene.physics.world, scene);

    this.sprite = sprite;
    this.spin = spin;
    this.range = range;
    this.createProjectiles(1);
  }

  createProjectiles(count: number) {
    this.createMultiple({
      frameQuantity: count,
      key: this.sprite,
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
    bullet.spin = this.spin;
    bullet.range = this.range;

    if (bullet) {
      bullet.fire(x, y, angle);

      this.scene.time.addEvent({ delay: 100, callback: () => { this.createProjectiles(1); } });

      this.scene.physics.add.collider(bullet, this.worldCollider, () => {
        bullet.setActive(false);
        bullet.setVisible(false);
        bullet.destroy();
      });

    }
  }
}
