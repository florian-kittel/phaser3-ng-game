import { GameObjects, Scene, Tilemaps } from 'phaser';
import { Enemy } from '../classes/enemy.class';
import { Player } from '../classes/player.class';
import { Projectiles } from '../classes/projectile.class';
import { Weapon } from '../classes/weapon.class';
import { EVENTS_NAME } from '../helpers/consts';
import { gameObjectsToObjectPoints } from '../helpers/gameobject-to-object-point';

export class Level1 extends Scene {
  private player!: Player;
  private weapon!: Weapon;

  private map!: Tilemaps.Tilemap;
  private tileset!: Tilemaps.Tileset;
  private wallsLayer!: Tilemaps.TilemapLayer;
  private groundLayer!: Tilemaps.TilemapLayer;
  private enemies!: Enemy[];

  public static enemyId = 0;

  private bullets!: any;
  // private arrow!: any;
  private chests!: Phaser.GameObjects.Sprite[];

  RADIUS = 32;

  constructor() {
    super('level-1-scene');
  }

  create(): void {
    this.initMap();
    this.player = new Player(this, 248, 160);
    this.physics.add.collider(this.player, this.wallsLayer);

    this.initChests();
    this.initCamera();

    // this.bullets = new Projectiles(this, this.wallsLayer);

    this.initEnemies();

    this.input.on('pointerdown', () => {
      this.bullets.fireBullet(this.weapon.x, this.weapon.y, this.weapon.angle);
    });

    this.physics.add.overlap(this.enemies, this.bullets, (enemy: any, bullet: any) => {
      if (!bullet.hasHit) {
        const damage = Math.floor(Math.random() * (20 - 5) + 1);
        enemy.getDamage(damage);
        enemy.isAttacked = true;
      }
      bullet.justHit();
    });

    this.physics.add.collider(this.enemies, this.bullets);

    // setInterval(() => {
    //   this.initEnemies()
    // }, 10000);
  }

  override update(): void {
    this.player.update();
  }

  private initMap(): void {
    this.map = this.make.tilemap({ key: 'dungeon', tileWidth: 16, tileHeight: 16 });

    this.tileset = this.map.addTilesetImage('dungeon', 'tiles');

    this.groundLayer = this.map.createLayer('ground', this.tileset, 0, 0);
    this.wallsLayer = this.map.createLayer('walls', this.tileset, 0, 0);
    this.physics.world.setBounds(0, 0, this.wallsLayer.width, this.wallsLayer.height);

    this.wallsLayer.setCollisionByProperty({ collides: true });

    // this.showDebugWalls();
  }


  private initChests(): void {
    const chestPoints = gameObjectsToObjectPoints(
      this.map.filterObjects('chests', obj => obj.name === 'ChestPoint'),
    );

    this.chests = chestPoints.map(chestPoint =>
      this.physics.add.sprite(chestPoint.x, chestPoint.y, 'tiles_spr', 595).setScale(1),
    );

    this.chests.forEach(chest => {
      this.physics.add.overlap(this.player, chest, (obj1, obj2) => {
        this.game.events.emit(EVENTS_NAME.chestLoot);
        obj2.destroy();
        // this.cameras.main.flash();
        this.sound.play('pickCoinSfx')
      });
    });
  }

  private initCamera(): void {
    const cam = this.cameras.main;
    cam.setSize(this.game.scale.width, this.game.scale.height);
    cam.setBounds(-40, -40, this.game.scale.width + 80, this.game.scale.height + 80);
    cam.startFollow(this.player, true, 0.09, 0.09);
    cam.setZoom(2);
  }

  private initEnemies(): void {
    const enemiesPoints = gameObjectsToObjectPoints(
      this.map.filterObjects('enemies', (point) => point.name === 'EnemyPoint'),
    );

    const getRandomInt = () => Math.floor(Math.random() * 10) % 2;

    this.enemies = enemiesPoints.map((enemyPoint) =>
      new Enemy(this, enemyPoint.x + 30, enemyPoint.y + 30, getRandomInt() ? 'zombie' : 'demon')
        .setName(enemyPoint.id.toString() + Level1.enemyId++)
        .setScale(1)
        .setTarget(this.player)
    );

    this.physics.add.collider(this.player, this.enemies, (player, enemy: any) => {
      (player as Player).getDamage(2);
      enemy.attack()
    });

    this.physics.add.collider(this.enemies, this.wallsLayer);
    this.physics.add.collider(this.enemies, this.enemies);

  }

}
