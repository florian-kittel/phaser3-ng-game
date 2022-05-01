import { Scene } from "phaser";


export function initCamera(scene: Scene, follow: any): Scene {
  const cam = scene.cameras.main;
  cam.setSize(scene.game.scale.width, scene.game.scale.height);
  cam.setBounds(-40, -40, scene.game.scale.width + 80, scene.game.scale.height + 80);
  if (follow) {
    cam.startFollow(follow, true, 0.09, 0.09);
  }
  cam.setZoom(2);
  cam.roundPixels = true;

  return scene;
}
