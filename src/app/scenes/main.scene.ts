import Phaser from 'phaser';

export class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'main' });
  }

  create() {
    console.log('create method');
  }

  preload() {
    console.log('preload method');
  }

  override update() {
    console.log('update method');
  }
}
