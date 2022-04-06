import { GameObjects, Scene, Tilemaps } from 'phaser';

export class MainScene extends Scene {
  private king!: GameObjects.Sprite;

  constructor() {
    super({ key: 'main' });

  }

  map!: Tilemaps.Tilemap;
  tileset!: Tilemaps.Tileset;
  platform!: Tilemaps.TilemapLayer;
  player: any;

  private wallsLayer!: Tilemaps.TilemapLayer;
  private groundLayer!: Tilemaps.TilemapLayer;

  preload() {
    console.log('preload method');

    this.load.baseURL = 'assets/';
    // key: 'king'
    // path from baseURL to file: 'sprites/king.png'
    this.load.image('king', 'king.png');
    this.load.atlas('a-king', 'king_sprite_sheet.png', 'king_sprite_sheet-atlas.json');

    this.load.spritesheet('tiles_spr', 'dungeon-16-16.png', {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.image('tiles', 'dungeon-16-16.png');
    this.load.tilemapTiledJSON('dungeon', 'dungeon.json');

    // this.load.tilemapTiledJSON('map', './assets/street.json');
    // this.load.image('tiles', './assets/Modern_Exteriors_Complete_Tileset.png');
    // this.load.image('tiles1', './assets/tiles.png');

    // this.load.atlas('atlas', './assets/mario.png', './assets/mario_atlas.json');
    // this.load.atlas('survivor', './assets/survivor-handgun-move.png', './assets/survivor-handgun-move_atlas.json');

    // this.load.on('complete', () => {
    //   // generateAnimations(this);
    // });
  }

  create() {
    console.log('create method');

    // this.king = this.add.sprite(100, 100, 'king');
    this.scene.start('level-1-scene');
    this.scene.start('ui-scene');
    // this.map = this.make.tilemap({ key: 'map' });
    // this.tileset = this.map.addTilesetImage('Modern_Exteriors_Complete_Tileset', 'tiles');
    // this.map.createLayer('background', this.tileset, 0, 0);
    // this.platform = this.map.createLayer('colliders', this.tileset, 0, 0);
    // this.map.createLayer('overlay', this.tileset, 0, 0);

    // this.animate('survivor');
    // this.player = new Phaser.Physics.Matter.Sprite(this.matter.world, 200, 200, 'survivor', 0);
    // this.player.play('move');
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
