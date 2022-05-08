import { } from 'phaser';
import { EVENTS_NAME } from '../helpers/consts';
import { ActorContainer } from './actor-container.class';

import { Actor } from './actor.class';
import { Player } from './player.class';
import { Text } from './text.class';
export class Enemy extends Actor {
  private target!: Player | ActorContainer;
  private AGRESSOR_RADIUS = 200;
  private attackHandler: () => void;
  private hpValue: Text;
  private textureName: string;

  public isAttacked = false;
  public speed = 50;
  private playAttackSound = false;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    textureName: string,
    frame?: string | number,
  ) {
    super(scene, x, y, textureName, frame);
    this.textureName = textureName;

    // ADD TO SCENE
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.bounce.set(1,1);
    this.body.setMass(0.5);

    // PHYSICS MODEL
    this.setCircle(this.width / 2, 0, Math.floor(this.height / 6));

    this.attackHandler = () => {
      if (Phaser.Math.Distance.BetweenPoints(
        { x: this.x, y: this.y },
        { x: this.target.x, y: this.target.y },
      ) < this.target.width
      ) {
        this.getDamage(10);
        this.scene.sound.play('monsterGrow1Sfx');
      }
    }

    this.hpValue = new Text(this.scene, this.x, this.y - this.height, this.hp.toString())
      .setFontSize(12)
      .setOrigin(0.5, 1);

    // EVENTS
    this.scene.game.events.on(EVENTS_NAME.attack, this.attackHandler, this);
    this.on('destroy', () => {
      this.scene.game.events.removeListener(EVENTS_NAME.attack, this.attackHandler);
    });

    this.initAnimations();
  }

  override preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);

    if (!this.isHit && this.target && (
      this.isAttacked ||
      Phaser.Math.Distance.BetweenPoints(
        { x: this.x, y: this.y },
        { x: this.target.x, y: this.target.y },
      ) < this.AGRESSOR_RADIUS
    )) {
      this.move(true);
    } else {
      this.move(false);
    }

    this.hpValue.setPosition(this.x, this.y - this.height * 0.4);
  }

  move(active = false) {
    if (!active) {
      this.getBody().setVelocity(0);
      this.anims.play('idle', true);
    } else {
      let speedX = this.target.x - this.x;
      let speedY = this.target.y - this.y;

      speedX = speedX > this.speed ? this.speed : speedX;
      speedX = speedX < -this.speed ? -this.speed : speedX;
      speedY = speedY > this.speed ? this.speed : speedY;
      speedY = speedY < -this.speed ? -this.speed : speedY;

      this.getBody().setVelocityX(speedX);
      this.getBody().setVelocityY(speedY);
      this.anims.play('run', true);
      this.checkFlip(speedX);
    }

  }

  attack() {
    if (!this.playAttackSound) {
      this.playAttackSound = true;
      this.scene.sound.play('monsterGrowSfx');
      this.scene.time.addEvent({ delay: 500, callback: () => { this.playAttackSound = false; } });
    }
  }

  public override getDamage(value?: number): void {
    super.getDamage(value);


    this.hpValue.setText(this.hp.toString());

    if (this.hp <= 0) {
      this.disableBody(true, false);
      this.scene.time.delayedCall(300, () => {
        this.destroy();
        this.hpValue.destroy();
      });

      this.scene.sound.play('monsterDeadSfx');
    }
  }

  public setTarget(target:any): Enemy {
    this.target = target;

    return this;
  }

  private initAnimations(): void {
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNames(this.textureName, {
        prefix: 'idle-',
        start: 0,
        end: 3,
      }),
      frameRate: 6,
    });
    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNames(this.textureName, {
        prefix: 'run-',
        start: 0,
        end: 3,
      }),
      frameRate: 8,
    });
  }
}
