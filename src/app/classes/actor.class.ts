import { Physics } from 'phaser';

export class Actor extends Physics.Arcade.Sprite {
  protected hp = 100;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.getBody().setBounce(1, 1).setCollideWorldBounds(true);

    this.setPushable(true);
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

  protected checkFlip(x: number): void {
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
