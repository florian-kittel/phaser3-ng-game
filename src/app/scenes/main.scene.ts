import { Scene, Tilemaps } from 'phaser';

export class MainScene extends Scene {

  constructor() {
    super({ key: 'main' });

  }

  map!: Tilemaps.Tilemap;
  tileset!: Tilemaps.Tileset;
  platform!: Tilemaps.TilemapLayer;
  player: any;


  preload() {
    console.log('Preload assets');

    this.load.baseURL = 'assets/';
    this.load.tilemapTiledJSON('dungeon', 'dungeon.json');
    this.load.tilemapTiledJSON('dungeon-test', 'dungeon-test.json');

    this.load.image('king', 'king.png');
    this.load.atlas('a-king', 'king_sprite_sheet.png', 'king_sprite_sheet-atlas.json');

    // enemies
    this.load.atlas('demon', 'enemies/demon.png', 'enemies/demon-atlas.json');
    this.load.atlas('zombie', 'enemies/zombie.png', 'enemies/zombie-atlas.json');
    this.load.atlas('chort', 'enemies/chort.png', 'enemies/chort-atlas.json');

    // heroe
    this.load.atlas('knight-m', 'knight-m.png', 'knight-atlas.json');

    this.load.audio('arrowShotSfx', 'sounds/shoot.ogg');
    this.load.audio('arrowHitSfx', 'sounds/mixkit-hard-typewriter-hit-1364.ogg');
    this.load.audio('pickCoinSfx', 'sounds/pick-coin.ogg');
    this.load.audio('monsterGrowSfx', 'sounds/monster-1.ogg');
    this.load.audio('monsterDeadSfx', 'sounds/monster-7.ogg');

    this.load.spritesheet('tiles_spr', 'dungeon-16-16.png', {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.image('tiles', 'dungeon-16-16.png');
    this.load.image('projectile', 'weapons/arrow.png');
    this.load.image('bow', 'weapons/bow.png');
    this.load.image('wip', 'weapons/wip_32.png');
    this.load.image('knightSword', 'weapons/weapon_knight_sword.png');

    this.load.image('arrow', 'green-arrow.png');
    this.load.atlas('coin', 'coin.png', 'coin-atlas.json');
  }

  create() {
    console.log('Create scenes');

    this.scene.start('level-test-scene');
    this.scene.start('ui-scene');
  }


  override update() { }
}
