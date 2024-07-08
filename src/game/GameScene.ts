import { Scene } from "../engine/Scene"
import { RenderingModelProvider, Resources, ShaderProvider } from "../engine/Resources"
import { ModelType } from "./startup"
import { VoxelSprite } from "../engine/models/VoxelSprite"
import { GameSceneRenderer } from "./GameSceneRenderer"
import { AbstractRendererBase } from "../engine/rendering/AbstractRendererBase"
import { VoxelRenderer } from "../engine/rendering/VoxelRenderer"

export class GameScene extends Scene<ModelType> {
  constructor(private player:VoxelSprite<ModelType>) {
    super()
    this.sprites.push(player)
  }

  static create(gl:WebGL2RenderingContext, resources:Resources<ModelType>) {
    const player = new VoxelSprite<ModelType>(
      [resources.getModel(ModelType.Player)!],
      [0,-65,0]
    )
    const invaderModel = resources.getModel(ModelType.InvaderFrame1)!
    const spacing = 3
    const invadersAcross = 11
    const totalWidth = (invaderModel.width+spacing)*(invadersAcross-1)-spacing
    const scene = new GameScene(player)

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

  public override createRenderer(gl: WebGL2RenderingContext, shaders: ShaderProvider, renderingModels: RenderingModelProvider<ModelType>)  : AbstractRendererBase<ModelType> {
    return new GameSceneRenderer(gl, shaders, renderingModels)
  }

  override processKeyboardInput(key: string, isPressed: boolean) {
    super.processKeyboardInput(key, isPressed)
    switch(key) {
      case "A":
      case "a":
        this.player.velocity = isPressed ? [-64.0,0.0,0.0] : [0.0,0.0,0.0]
        break
      case "D":
      case "d":
        this.player.velocity = isPressed ? [64.0,0.0,0.0] : [0.0,0.0,0.0]
        break
    }
  }

  override update(now: number) {
    super.update(now)
    return this
  }
}