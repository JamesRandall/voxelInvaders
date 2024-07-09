import { startingControlState } from "./ControlState"
import { GameSprite } from "./GameSprite"
import { KeyboardHandler } from "../engine/Scene"
import { ModelType } from "./startup"
import { vec3 } from "gl-matrix"
import { GameScene } from "./GameScene"

const playerSpeed = 64.0

export class Player implements KeyboardHandler {
  private _controlState = startingControlState()
  private _repeatFireTimer : number|null = null
  public sprite:GameSprite

  constructor(scene:GameScene) {
    this.sprite = new GameSprite(
      [scene.resources.getModel(ModelType.Player)!],
      [0,-65,0]
    )
    scene.sprites.push(this.sprite)
    scene.registerKeyboardHandler(this)
  }

  public get position() { return this.sprite.position }

  public processKeyboardInput(key: string, isPressed: boolean) {
    switch(key) {
      case "A":
      case "a":
        this._controlState.current.leftPressed = isPressed
        break
      case "D":
      case "d":
        this._controlState.current.rightPressed = isPressed
        break
      case " ":
        this._controlState.current.firePressed = isPressed
        break
    }
  }

  private fireBullet(scene:GameScene) {
    this._repeatFireTimer = 0.5
    const bullet = new GameSprite(
      [scene.resources.getModel(ModelType.Bullet)!],
      vec3.copy(vec3.create(),this.position)
    )
    bullet.velocity = vec3.fromValues(0,100,0)
    scene.sprites.push(bullet)
  }

  public applyControlState(scene:GameScene) {
    if (this._controlState.current.leftPressed) {
      this.sprite.velocity = [-playerSpeed,0.0,0.0]
    } else if (this._controlState.current.rightPressed) {
      this.sprite.velocity = [playerSpeed,0.0,0.0]
    }
    else { this.sprite.velocity = [0,0,0] }

    if (this._controlState.current.firePressed && !this._controlState.previous.firePressed) {
      console.log("Fire")
      this.fireBullet(scene)
    } else if (!this._controlState.current.firePressed && this._controlState.previous.firePressed) {
      //stopFiring()
    }

    this._controlState.previous = { ...this._controlState.current }
  }
}