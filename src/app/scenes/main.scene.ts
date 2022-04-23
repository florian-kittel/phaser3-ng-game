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
    console.log('preload method');

    this.load.baseURL = 'assets/';
    this.load.image('king', 'king.png');
    this.load.atlas('a-king', 'king_sprite_sheet.png', 'king_sprite_sheet-atlas.json');

    this.load.spritesheet('tiles_spr', 'dungeon-16-16.png', {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.image('tiles', 'dungeon-16-16.png');
    this.load.image('projectile', 'arrow.png');
    this.load.image('arrow', 'green-arrow.png');
    this.load.image('bow', 'bow.png');
    this.load.tilemapTiledJSON('dungeon', 'dungeon.json');

  }

  create() {
    console.log('create method');

    this.scene.start('level-1-scene');
    this.scene.start('ui-scene');
  }


  override update() {
    // console.log('update method');
  }

  animate(player: string) {
    this.anims.create({
      key: 'move',
      frames: this.anims.generateFrameNames(player, {
        prefix: 'survivor-move_handgun_',
        start: 0,
        end: 19,
      }),
      frameRate: 10,
      repeat: -1
    });
  }

  animateMario() {
    this.anims.create({
      key: 'idle',
      frames: [{ key: 'atlas', frame: 'mario-atlas_0' }],
      frameRate: 10
    });
  }

}
