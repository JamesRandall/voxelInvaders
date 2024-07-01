import { Scene } from "../engine/scene"
import { Resources } from "../engine/resources"

export class GameScene implements Scene {
  static create(gl:WebGL2RenderingContext, resources:Resources) {
    return new GameScene()
  }

  resize() {

  }

  update(now: number) {
    return this
  }
}