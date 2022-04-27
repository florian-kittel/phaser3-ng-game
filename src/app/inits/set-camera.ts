import { Scene } from "phaser";
import { ActorContainer } from "../classes/actor-container.class";
import { Actor } from "../classes/actor.class";

export function initCamera(scene: Scene, follow: ActorContainer | Actor): Scene {
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
