import { Physics } from 'phaser';

export class Actor extends Physics.Arcade.Sprite {
  hp = 100;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);

    // Needed other wise no animation
    scene.add.existing(this);
  }

  override setState(state: string) {
    this.anims.play(state, true);
    return this;
  }

  public getDamage(value?: number): void {
    this.scene.tweens.add({
      targets: this,
      duration: 100,
      repeat: 3,
      yoyo: true,
      alpha: 0.5,
      onStart: () => {
        if (value) {
          this.hp = this.hp - value;
        }
      },
      onComplete: () => {
        this.setAlpha(1);
      },
    });
  }

  public getHPValue(): number {
    return this.hp;
  }

  public checkFlip(x: number): void {
    if (x < 0) {
      this.scaleX = -1;
      this.body.offset.x = this.body.width;
    } else if (x > 0) {
      this.scaleX = 1;
      this.body.offset.x = 0;
    }
  }

  protected getBody(): Physics.Arcade.Body {
    return this.body as Physics.Arcade.Body;
  }
}
