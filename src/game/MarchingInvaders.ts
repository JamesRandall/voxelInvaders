import { GameObjectType, GameScene } from "./GameScene"
import { vec3 } from "gl-matrix"
import { GameSprite } from "./GameSprite"
import { ModelType } from "./startup"
import { WorldObject } from "../engine/models/WorldObject"

const startingInvaderSpeed = 4.0
const invaderSpeedChange = 1.0

export class MarchingInvaders {
  private _invaderSpeed = startingInvaderSpeed
  private _invaderReferencePoint = new WorldObject([0,0,0])
  private _maxInvaderMovement : number
  public totalInvaderRowWidth : number

  constructor(scene:GameScene) {
    const invaderModel = scene.resources.getModel(ModelType.InvaderFrame1)!
    const invaderSpacing = 3
    const invadersAcross = 11
    this.totalInvaderRowWidth = (invaderModel.width+invaderSpacing)*(invadersAcross-1)-invaderSpacing
    this._maxInvaderMovement = Math.ceil((invaderModel.width+invaderSpacing)*1.75)

    for(let y=0; y < 5; y++) {
      const spriteY = 65 - (y * (invaderModel.height+invaderSpacing))
      for(let x=0; x< invadersAcross; x++) {
        const spriteX = this.totalInvaderRowWidth/2 - (x * (invaderModel.width+invaderSpacing))
        const invader = new GameSprite(
          [invaderModel],
          [spriteX,spriteY,0]
        )
        invader.tag = GameObjectType.Invader
        invader.velocity = vec3.fromValues(startingInvaderSpeed,0,0)
        scene.sprites.push(invader)
      }
    }
    this._invaderReferencePoint.velocity = vec3.fromValues(startingInvaderSpeed,0,0)
  }

  public updateInvaders(scene:GameScene, frameLength:number) {
    this._invaderReferencePoint.updatePosition(frameLength)
    const referenceX = this._invaderReferencePoint.position[0]
    if ((this._invaderSpeed > 0 && referenceX > this._maxInvaderMovement) || (this._invaderSpeed < 0 && referenceX < -this._maxInvaderMovement)) {
      this._invaderSpeed = (this._invaderSpeed > 0 ? -invaderSpeedChange : invaderSpeedChange) + -this._invaderSpeed
      scene.sprites.forEach(sprite => {
        if (sprite.tag === GameObjectType.Invader) {
          sprite.velocity = vec3.fromValues(this._invaderSpeed,0,0)
          sprite.moveBy([0,-1,0])
        }
      })

      this._invaderReferencePoint.velocity = vec3.fromValues(this._invaderSpeed,0,0)
    }
  }
}