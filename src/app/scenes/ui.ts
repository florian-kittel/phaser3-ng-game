import { GameObjects, Physics, Scene } from 'phaser';
import { gameConfig } from '../app.component';
import { Score, ScoreOperations } from '../classes/scores.class';
import { EVENTS_NAME, GameStatus } from '../helpers/consts';

import { Text } from '../classes/text.class';


export class UIScene extends Scene {
  private score!: Score;
  private chestLootHandler: () => void;

  private gameEndPhrase!: Text;
  private gameEndHandler: (status: GameStatus) => void;

  constructor() {
    super('ui-scene');

    this.chestLootHandler = () => {
      this.score.changeValue(ScoreOperations.INCREASE, 10);
      if (this.score.getValue() === gameConfig.winScore) {
        this.game.events.emit(EVENTS_NAME.gameEnd, 'win');
      }
    };

    this.gameEndHandler = (status, level?: string) => {
      this.cameras.main.setBackgroundColor('rgba(0,0,0,0.6)');
      this.game.scene.pause('level-1-scene');
      this.gameEndPhrase = new Text(
        this,
        this.game.scale.width / 2,
        this.game.scale.height * 0.4,
        status === GameStatus.LOSE
          ? `WASTED!\nCLICK TO RESTART`
          : `YOU ARE ROCK!\nCLICK TO RESTART`,
      )
        .setAlign('center')
        .setColor(status === GameStatus.LOSE ? '#ff0000' : '#ffffff');

      this.gameEndPhrase.setPosition(
        this.game.scale.width / 2 - this.gameEndPhrase.width / 2,
        this.game.scale.height * 0.4,
      );

      this.input.on('pointerdown', () => {
        this.game.events.off(EVENTS_NAME.chestLoot, this.chestLootHandler);
        this.game.events.off(EVENTS_NAME.gameEnd, this.gameEndHandler);
        this.scene.get(level || 'level-1-scene').scene.restart();
        this.scene.restart();
      });
    };

  }
  create(): void {
    this.score = new Score(this, 20, 20, 0);
    this.initListeners();

    const container = this.add.container(40, 100);
    const rowSize = 20;

    container.add(this.add.sprite(0, 0, 'bow', 0).setAngle(45).setInteractive());
    container.add(this.add.sprite(0, rowSize * 1, 'sword', 0).setAngle(45).setInteractive());
    container.add(this.add.sprite(0, rowSize * 2, 'knightSword', 0).setAngle(45).setInteractive());
    container.add(this.add.sprite(0, rowSize * 3, 'spear', 0).setAngle(45).setInteractive());
    container.add(this.add.sprite(0, rowSize * 4, 'hammer', 0).setAngle(45).setInteractive());
    container.add(this.add.sprite(0, rowSize * 5, 'axe', 0).setAngle(45).setInteractive());

    container.setScale(2);

    container.iterate((child: GameObjects.Sprite) => {
      child.on('pointerdown', () => {
        this.game.events.emit(EVENTS_NAME.setWeapon, child.texture.key);
      });

      child.on('pointerover', () => {
        child.setTint(0x44ff44);
      });

      child.on('pointerout', () => {
        child.clearTint();
      });
    })
  }

  private initListeners(): void {
    this.game.events.on(EVENTS_NAME.chestLoot, this.chestLootHandler, this);
    this.game.events.once(EVENTS_NAME.gameEnd, this.gameEndHandler, this);
  }

}
