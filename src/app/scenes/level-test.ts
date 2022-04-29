import { Physics, Scene, Tilemaps } from 'phaser';
import { ActorContainer } from '../classes/actor-container.class';
import { Enemy } from '../classes/enemy.class';
import { Player } from '../classes/player.class';
import { Projectiles } from '../classes/projectile.class';
import { Weapon } from '../classes/weapon.class';
import { EVENTS_NAME } from '../helpers/consts';
import { gameObjectsToObjectPoints } from '../helpers/gameobject-to-object-point';
import { initCamera } from '../inits/set-camera';

export class LevelTest extends Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyW!: Phaser.Input.Keyboard.Key;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyS!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;

  private player!: ActorContainer;

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
    super('level-test-scene');
  }

  create(): void {
    this.initMap();

    // KEYS
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyW = this.input.keyboard.addKey('W');
    this.keyA = this.input.keyboard.addKey('A');
    this.keyS = this.input.keyboard.addKey('S');
    this.keyD = this.input.keyboard.addKey('D');

    this.player = new ActorContainer(this, 280, 168, this.wallsLayer)
    .activateFollowPointer().activateCurorMove();
    this.physics.add.collider(this.player, this.wallsLayer);

    const box1 = this.add.rectangle(230, 152, 16, 16, 0x6666ff);
    box1.fillAlpha = 0.5;
    const box2 = this.add.rectangle(296, 136, 16, 16, 0xff6600);
    box2.fillAlpha = 0.5;

    this.physics.add.existing(box1);
    this.physics.add.existing(box2);

    initCamera(this, this.player);
    this.initChests();

    this.bullets = new Projectiles(this, this.wallsLayer);

    this.initEnemies();

    this.input.on('pointerdown', () => {
      this.player.attack();
      // this.bullets.fireBullet(this.player.x, this.player.y, this.player.weapon.angle);
    });

    this.input.keyboard.on('keydown-' + 'SPACE', () => {
      this.player.attack();
      // this.bullets.fireBullet(this.player.x, this.player.y, this.player.weapon.angle);
    });

    this.physics.add.overlap(this.enemies, this.player.bullets, (enemy: any, bullet: any) => {
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
    // this.player.update();

    if (this.player) {
      const actor = this.player.body as unknown as Physics.Arcade.Body;
      actor.setVelocity(0);

      if (this.cursors) {
        let moveX = 0;
        let moveY = 0;

        if (this.cursors.left.isDown || this.keyA.isDown) {
          moveX = -1;
        } else if (this.cursors.right.isDown || this.keyD.isDown) {
          moveX = 1;
        }

        if (this.cursors.up.isDown || this.keyW.isDown) {
          moveY = -1;
        } else if (this.cursors.down.isDown || this.keyS.isDown) {
          moveY = 1;
        }

        this.player.setState((moveX || moveY) ? 'run' : 'idle');

        if (moveX || moveY) {
          this.player.move(moveX, moveY);
        }

      }
    }
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
      new Enemy(this, enemyPoint.x, enemyPoint.y, 'chort')
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
