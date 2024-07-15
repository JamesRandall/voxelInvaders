import { GameObjectType, GameScene } from "./GameScene"
import { vec3 } from "gl-matrix"
import { GameSprite } from "./GameSprite"
import { ModelType } from "./startup"
import { WorldObject } from "../engine/models/WorldObject"
import { Explosion } from "./Explosion"
import { playerBulletSpeed } from "./Player"

const startingInvaderSpeed = 4.0
const invaderSpeedChange = 1.0
export const invaderTopRowY = 65

export class MarchingInvaders {
  private _invaderSpeed = startingInvaderSpeed
  private _invaderReferencePoint = new WorldObject([0,0,0])
  private _maxInvaderMovement : number
  private _invaderColumns: GameSprite[][] = []
  public totalInvaderRowWidth : number
  private _timeUntilNextInvaderFires = this.setTimeUntilNextInvaderFires()

  constructor(scene:GameScene) {
    const invaderModel = scene.resources.getModel(ModelType.InvaderFrame1)!
    const invaderSpacing = 4
    const invadersAcross = 11
    this.totalInvaderRowWidth = (invaderModel.width+invaderSpacing)*(invadersAcross-1)-invaderSpacing
    this._maxInvaderMovement = Math.ceil((invaderModel.width+invaderSpacing)*1.75)

    for(let x=0; x< invadersAcross; x++) {
      const spriteX = this.totalInvaderRowWidth/2 - (x * (invaderModel.width+invaderSpacing)) - Math.floor(invaderModel.width/2)
      const invaderColumn:GameSprite[] = []
      this._invaderColumns.push(invaderColumn)
      for(let y=0; y < 5; y++) {
        const spriteY = invaderTopRowY - (y * (invaderModel.height + invaderSpacing))
        const invader = new GameSprite(
          [invaderModel],
          [spriteX, spriteY, 0]
        )
        invader.type = GameObjectType.Invader
        invader.velocity = vec3.fromValues(startingInvaderSpeed, 0, 0)
        scene.addSprite(invader)
        invaderColumn.push(invader)
        invader.tag = x * 20 + y
      }
    }
    this._invaderReferencePoint.velocity = vec3.fromValues(startingInvaderSpeed,0,0)
  }

  public updateInvaders(scene:GameScene, frameLength:number) {
    this.moveInvaders(scene, frameLength)
    this.fire(scene, frameLength)
  }

  private moveInvaders(scene:GameScene, frameLength:number) {
    this._invaderReferencePoint.updatePosition(frameLength)
    const referenceX = this._invaderReferencePoint.position[0]
    if ((this._invaderSpeed > 0 && referenceX > this._maxInvaderMovement) || (this._invaderSpeed < 0 && referenceX < -this._maxInvaderMovement)) {
      // I have the Invaders speeding up as they move down the screen. The invaders in the original game speeded up "naturally".
      // As each invader was destroyed their was less work for the game loop to do and so each remaining Invader was updated
      // more frequently. This had the effect of speeding up the game.
      this._invaderSpeed = (this._invaderSpeed > 0 ? -invaderSpeedChange : invaderSpeedChange) + -this._invaderSpeed
      scene.sprites.forEach(sprite => {
        if (sprite.type === GameObjectType.Invader) {
          sprite.velocity = vec3.fromValues(this._invaderSpeed,0,0)
          sprite.moveBy([0,-1,0])
        }
      })
      this._invaderReferencePoint.velocity = vec3.fromValues(this._invaderSpeed,0,0)
    }
  }

  private fire(scene:GameScene, frameLength:number) {
    this._timeUntilNextInvaderFires -= frameLength
    if (this._timeUntilNextInvaderFires > 0) { return }
    this._timeUntilNextInvaderFires = this.setTimeUntilNextInvaderFires()
    const columnIndexes = this._invaderColumns.map((col, index) => col.length > 0 ? index : -1).filter(i => i !== -1)
    const columnIndex = columnIndexes[Math.floor(Math.random()*columnIndexes.length)]
    const firingInvader = this._invaderColumns[columnIndex][this._invaderColumns[columnIndex].length-1]

    const bullet = new GameSprite(
      [scene.resources.getModel(ModelType.InvaderBullet)!],
      [firingInvader.position[0], firingInvader.position[1], 0]
    )
    bullet.type = GameObjectType.InvaderBullet
    bullet.velocity = vec3.fromValues(0,-playerBulletSpeed/2,0)
    scene.addSprite(bullet)
  }

  private setTimeUntilNextInvaderFires() {
    return Math.max(0.75,Math.random()*3)
  }

  handleInvaderHitByBullet(gl:WebGL2RenderingContext, scene: GameScene, invader: GameSprite) {
    const invaderColumnIndex = Math.floor((invader.tag as number)/20)
    const invaderColumn = this._invaderColumns[invaderColumnIndex]
    const invaderIndex = invaderColumn.findIndex(i => i.tag === invader.tag)
    if (invaderIndex !== -1) {
      invaderColumn.splice(invaderIndex, 1)
    }
    invader.isRemoved = true
    scene.addParticleSet(Explosion.createFromSprite(gl, invader))
  }
}