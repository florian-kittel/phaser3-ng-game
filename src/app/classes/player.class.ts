import { EVENTS_NAME, GameStatus } from '../helpers/consts';
import { Actor } from './actor.class';
import { Text } from './text.class';

export class Player extends Actor {
  private keyW: Phaser.Input.Keyboard.Key;
  private keyA: Phaser.Input.Keyboard.Key;
  private keyS: Phaser.Input.Keyboard.Key;
  private keyD: Phaser.Input.Keyboard.Key;

  private hpValue: Text;
  private velocity = 100;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'knight-m');

    // KEYS
    this.keyW = this.scene.input.keyboard.addKey('W');
    this.keyA = this.scene.input.keyboard.addKey('A');
    this.keyS = this.scene.input.keyboard.addKey('S');
    this.keyD = this.scene.input.keyboard.addKey('D');

    this.setCircle(this.width / 2, 0, this.height / 2 - 2);

    this.hpValue = new Text(this.scene, x, y - this.height * 0.4, this.hp.toString()).setFontSize(12);

    this.initAnimations();

    this.on('destroy', () => { });
  }

  override update(): void {
    let playerVelocity = new Phaser.Math.Vector2();
    this.getBody().setVelocity(0);
    let isMoving = false;

    if (this.keyW?.isDown) {
      isMoving = true;
      playerVelocity.y = -this.velocity;
      this.anims.play('run', true);
    }

    if (this.keyA?.isDown) {
      isMoving = true;
      playerVelocity.x = -this.velocity;


      this.anims.play('run', true);
    }

    if (this.keyS?.isDown) {
      isMoving = true;
      playerVelocity.y = this.velocity;
      this.anims.play('run', true);
    }

    if (this.keyD?.isDown) {
      isMoving = true;
      playerVelocity.x = this.velocity;


      this.anims.play('run', true);
    }

    if (!isMoving) {
      this.anims.play('idle', true);
    } else {
      this.checkFlip(playerVelocity.x);
    }

    this.hpValue.setPosition(this.x, this.y - this.height * 0.4);
    this.hpValue.setOrigin(0.5, 1);

    this.setVelocity(playerVelocity.x, playerVelocity.y);

    playerVelocity.normalize();
  }

  public override getDamage(value?: number): void {
    super.getDamage(value);
    this.hpValue.setText(this.hp.toString());

    if (this.hp <= 0) {
      this.scene.game.events.emit(EVENTS_NAME.gameEnd, GameStatus.LOSE);
    }
  }

  private initAnimations(): void {
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNames('knight-m', {
        prefix: 'idle-',
        start: 0,
        end: 3,
      }),
      frameRate: 6,
    });
    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNames('knight-m', {
        prefix: 'run-',
        start: 0,
        end: 3,
      }),
      frameRate: 8,
    });
  }
}
