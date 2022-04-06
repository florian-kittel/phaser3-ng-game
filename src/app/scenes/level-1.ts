import { GameObjects, Scene, Tilemaps } from 'phaser';
import { Enemy } from '../classes/enemy.class';
import { Player } from '../classes/player.class';
import { EVENTS_NAME } from '../helpers/consts';
import { gameObjectsToObjectPoints } from '../helpers/gameobject-to-object-point';

export class Level1 extends Scene {
  private king!: GameObjects.Sprite;
  private player!: Player;

  private map!: Tilemaps.Tilemap;
  private tileset!: Tilemaps.Tileset;
  private wallsLayer!: Tilemaps.TilemapLayer;
  private groundLayer!: Tilemaps.TilemapLayer;
  private enemies!: Enemy[];

  private chests!: Phaser.GameObjects.Sprite[];

  constructor() {
    super('level-1-scene');
  }

  create(): void {
    this.initMap();
    this.player = new Player(this, 200, 100);
    this.physics.add.collider(this.player, this.wallsLayer);
    this.initChests();
    // this.king = this.add.sprite(100, 100, 'king');

    this.initCamera();
    this.initEnemies();
  }

  override update(): void {
    this.player.update();
  }

  private initMap(): void {
    // this.map = this.make.tilemap({ key: 'map' });
    this.map = this.make.tilemap({ key: 'dungeon', tileWidth: 16, tileHeight: 16 });

    // this.tileset = this.map.addTilesetImage('Modern_Exteriors_Complete_Tileset', 'tiles');
    this.tileset = this.map.addTilesetImage('dungeon', 'tiles');

    // this.map.createLayer('background', this.tileset, 0, 0);
    // this.platform = this.map.createLayer('colliders', this.tileset, 0, 0);
    // this.map.createLayer('overlay', this.tileset, 0, 0);
    this.groundLayer = this.map.createLayer('ground', this.tileset, 0, 0);
    this.wallsLayer = this.map.createLayer('walls', this.tileset, 0, 0);
    this.physics.world.setBounds(0, 0, this.wallsLayer.width, this.wallsLayer.height);

    this.wallsLayer.setCollisionByProperty({ collides: true });

    this.showDebugWalls();
  }

  private showDebugWalls(): void {
    const debugGraphics = this.add.graphics().setAlpha(0.7);
    this.wallsLayer.renderDebug(debugGraphics, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
    });
  }

  private initChests(): void {
    const chestPoints = gameObjectsToObjectPoints(
      this.map.filterObjects('chests', obj => obj.name === 'ChestPoint'),
    );

    this.chests = chestPoints.map(chestPoint =>
      this.physics.add.sprite(chestPoint.x, chestPoint.y, 'tiles_spr', 595).setScale(1.5),
    );

    this.chests.forEach(chest => {
      this.physics.add.overlap(this.player, chest, (obj1, obj2) => {
        this.game.events.emit(EVENTS_NAME.chestLoot);
        obj2.destroy();
        this.cameras.main.flash();
      });
    });
  }

  private initCamera(): void {
    this.cameras.main.setSize(this.game.scale.width, this.game.scale.height);
    this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
    this.cameras.main.setZoom(1);
  }

  private initEnemies(): void {
    const enemiesPoints = gameObjectsToObjectPoints(
      this.map.filterObjects('enemies', (obj) => obj.name === 'EnemyPoint'),
    );

    this.enemies = enemiesPoints.map((enemyPoint) =>
      new Enemy(this, enemyPoint.x, enemyPoint.y, 'tiles_spr', this.player, 503)
        .setName(enemyPoint.id.toString())
        .setScale(2),
    );

    this.physics.add.collider(this.enemies, this.wallsLayer);
    this.physics.add.collider(this.enemies, this.enemies);

    this.physics.add.collider(this.player, this.enemies, (obj1, obj2) => {
      (obj1 as Player).getDamage(1);
    });
  }

}
