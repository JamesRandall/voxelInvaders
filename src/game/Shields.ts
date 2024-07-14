import { GameSprite } from "./GameSprite"
import { GameObjectType, GameScene } from "./GameScene"
import { ModelType } from "./startup"
import { AxisAlignedBox } from "../engine/models/AxisAlignedBox"



export class Shields {
  constructor(gl: WebGL2RenderingContext, scene:GameScene, invaderRowWidth:number) {
    const model = scene.resources.getModel(ModelType.Shield)!
    let shieldX = -Math.floor(invaderRowWidth/2 - model.width/2)
    let totalSpace = invaderRowWidth-(4*model.width)
    let space = Math.floor(totalSpace/3)
    for(let i = 0; i < 4; i++) {
      const sprite = new GameSprite(
        [model],
        [shieldX,-46,0],
        { isDestructible: true, gl }
      )
      sprite.type = GameObjectType.Shield
      scene.addSprite(sprite)
      shieldX += sprite.currentFrame.width + space
    }
  }

  public handleBulletCollision(gl:WebGL2RenderingContext, scene:GameScene, shield:GameSprite, intersection: AxisAlignedBox) {

  }
}