import { VoxelSprite } from "./models/VoxelSprite"
import { Camera } from "./Camera"

export class Scene<TModelType> {
  public sprites : VoxelSprite<TModelType>[] = []
  public view = {
    camera: Camera.default(),
    zFar: 300.0
  }

  private _previousTime : number|null = null

  public resize() {

  }

  public update(now: number) : Scene<TModelType> | null {
    // This prevents a big stutter on the first frame
    if (this._previousTime === null) {
      this._previousTime = now
      return this
    }
    const frameTime = (now - this._previousTime) / 1000
    this._previousTime = now
    this.updateSprites(frameTime)
    return this
  }

  protected updateSprites(frameTime: number) {
    this.sprites.forEach(sprite => sprite.update(frameTime))
  }
}

//export type RendererFunc = (projectionMatrix: mat4, game: Game, timeDelta: number) => void
