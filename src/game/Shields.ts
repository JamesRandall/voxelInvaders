import { GameSprite } from "./GameSprite"
import { GameScene } from "./GameScene"
import { ModelType } from "./startup"

export class Shields {
  private _sprites:GameSprite[] = []

  constructor(scene:GameScene, invaderRowWidth:number) {
    const model = scene.resources.getModel(ModelType.Shield)!
    let shieldX = -Math.floor(invaderRowWidth/2 - model.width/2)
    let totalSpace = invaderRowWidth-(4*model.width)
    let space = Math.floor(totalSpace/3)
    for(let i = 0; i < 4; i++) {
      const sprite = new GameSprite(
        [model],
        [shieldX,-46,0]
      )
      scene.sprites.push(sprite)
      this._sprites.push(sprite)
      shieldX += sprite.currentFrame.width + space
    }

  }
}