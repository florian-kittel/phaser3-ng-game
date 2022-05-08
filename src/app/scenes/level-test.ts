import { Scene, Tilemaps } from 'phaser';
import { ActorKnight } from '../classes/actor-knight.class';
import { Enemy } from '../classes/enemy.class';
import { Player } from '../classes/player.class';
import { Projectile, Projectiles } from '../classes/projectile.class';
import { EVENTS_NAME } from '../helpers/consts';
import { gameObjectsToObjectPoints } from '../helpers/gameobject-to-object-point';
import { initCamera } from '../inits/set-camera';

import Bullet from 'phaser3-rex-plugins/plugins/bullet.js';

export class LevelTest extends Scene {
  private player!: ActorKnight;

  private map!: Tilemaps.Tilemap;
  private tileset!: Tilemaps.Tileset;
  private wallsLayer!: Tilemaps.TilemapLayer;
  private groundLayer!: Tilemaps.TilemapLayer;
  private enemies!: Enemy[];

  public static enemyId = 0;

  private bullets!: any;
  private chests!: Phaser.GameObjects.Sprite[];

  RADIUS = 32;

  constructor() {
    super('level-test-scene');
  }

  create(): void {
    this.initMap();

    this.player = new ActorKnight(this, 320, 192, this.wallsLayer).followPointer().pointerAction();
    this.physics.add.collider(this.player, this.wallsLayer);
    this.player.setWeapon('hammer');

    const box1 = this.add.rectangle(230, 152, 16, 16, 0x6666ff);
    this.physics.add.existing(box1);
    box1.fillAlpha = 0.5;
    box1.body.mass = 20;
    // box1.body.setBounce();
    const box2 = this.add.rectangle(296, 136, 16, 16, 0xff6600);
    this.physics.add.existing(box2);
    box2.fillAlpha = 0.5;
    box2.body.mass = 0.1;


    initCamera(this, this.player);
    this.initChests();

    const circle = this.add.circle(200, 200, 4, 0xff6600);

    // this.bullets = new Projectiles(this, this.wallsLayer);

    this.initEnemies();

    this.physics.add.overlap(this.enemies, this.player.weapon.hitbox, (enemy: any, bullet: any) => {
      const damage = Math.floor(Math.random() * (20 - 5) + 1);
      enemy.getDamage(damage);
      enemy.isAttacked = true;
      // if (!bullet.hasHit) {
      // }
      // bullet.justHit();
    });

    // this.physics.add.overlap([box1, box2], this.player.hitbox, (box: any, bullet: any) => {
    //   // box.destroy();wa
    //   // bullet.justHit();
    // });

    this.physics.add.collider(this.enemies, this.player.bullets);
    this.physics.add.collider(this.wallsLayer, [box1, box2]);
    this.physics.add.collider(this.player, [box1, box2]);

    this.physics.add.collider(this.enemies, this.player.weapon.hitbox);
    // this.physics.add.collider(this.player.hitbox, [box1, box2]);

  }

  override update(): void {
    this.player.update();
  }

  private initMap(): void {
    this.map = this.make.tilemap({ key: 'dungeon-test', tileWidth: 16, tileHeight: 16 });

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

  private initEnemies(): void {
    const enemiesPoints = gameObjectsToObjectPoints(
      this.map.filterObjects('enemies', (point) => point.name === 'EnemyPoint'),
    );

    this.enemies = enemiesPoints.map((enemyPoint) =>
      new Enemy(this, enemyPoint.x + Math.random() * 100, enemyPoint.y, 'chort')
        .setName(enemyPoint.id.toString() + LevelTest.enemyId++)
        .setScale(1)
    );

    this.enemies.forEach(enemy => {
      // new Weapon(this, enemy, 'bow');

      enemy.setTarget(this.player);
    });

    this.physics.add.collider(this.player, this.enemies, (player, enemy: any) => {
      (player as Player).getDamage(2);
      enemy.attack()
    });

    this.physics.add.collider(this.enemies, this.wallsLayer);
    this.physics.add.collider(this.enemies, this.enemies);
  }

}
