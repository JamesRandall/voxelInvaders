import { Scene } from "../engine/Scene"
import { Resources } from "../engine/Resources"
import { ModelType } from "./startup"
import { VoxelSprite } from "../engine/models/VoxelSprite"

export class GameScene extends Scene<ModelType> {


  static create(gl:WebGL2RenderingContext, resources:Resources<ModelType>) {
    const scene = new GameScene()
    const player = new VoxelSprite<ModelType>(
      [resources.getModel(ModelType.Player)!],
      [0,-65,0]
    )
    const invaderModel = resources.getModel(ModelType.InvaderFrame1)!
    const spacing = 3
    const invadersAcross = 11
    const totalWidth = (invaderModel.width+spacing)*(invadersAcross-1)-spacing
    scene.sprites.push(player)
    for(let y=0; y < 5; y++) {
      const spriteY = 65 - (y * (invaderModel.height+spacing))
      for(let x=0; x< invadersAcross; x++) {
        const spriteX = totalWidth/2 - (x * (invaderModel.width+spacing))
        const invader = new VoxelSprite<ModelType>(
          [invaderModel],
          [spriteX,spriteY,0]
        )
        scene.sprites.push(invader)
      }
    }
    return scene
  }

  resize() {

  }

  update(now: number) {
    return this
  }
}