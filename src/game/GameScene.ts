import { Scene } from "../engine/scene"
import { Resources } from "../engine/Resources"
import { ModelType } from "./startup"

export class GameScene extends Scene {


  static create(gl:WebGL2RenderingContext, resources:Resources<ModelType>) {
    const scene = new GameScene()
    scene.sprites.push()
    return scene
  }

  resize() {

  }

  update(now: number) {
    return this
  }
}