import { Scene } from "../engine/Scene"
import { Resources } from "../engine/Resources"
import { ModelType } from "./startup"
import { VoxelSprite } from "../engine/models/VoxelSprite"

export class GameScene extends Scene<ModelType> {


  static create(gl:WebGL2RenderingContext, resources:Resources<ModelType>) {
    const scene = new GameScene()
    const player = new VoxelSprite<ModelType>(
      [resources.getModel(ModelType.Player)!],
      [0,0,0]
    )
    scene.sprites.push(player)
    return scene
  }

  resize() {

  }

  update(now: number) {
    return this
  }
}