import { Component, OnInit } from '@angular/core';
import { Types } from 'phaser';
import { Level1 } from './scenes/level-1';
import { MainScene } from './scenes/main.scene';
import { UIScene } from './scenes/ui';

type GameConfigExtended = Types.Core.GameConfig & {
  winScore: number;
};

export const gameConfig: GameConfigExtended = {
  type: Phaser.WEBGL,
  backgroundColor: '#351f1b',
  height: 480,
  width: 640,
  scene: [
    MainScene,
    Level1,
    UIScene,
  ],
  scale: {
    mode: Phaser.Scale.ScaleModes.NONE,
    width: window.innerWidth,
    height: window.innerHeight,
  },
  parent: 'gameContainer',
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
  callbacks: {
    postBoot: () => {
      // (window as any).sizeChanged();
    },
  },
  render: {
    antialiasGL: false,
    pixelArt: true,
  },
  canvasStyle: `display: block; width: 100%; height: 100%;`,
  autoFocus: true,
  audio: {
    disableWebAudio: false,
  },
  winScore: 40,
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'phaser-ng-game';
  phaserGame!: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;

  constructor() {
    this.config = gameConfig;
  }



  ngOnInit(): void {
    this.phaserGame = new Phaser.Game(this.config);

  }
}
