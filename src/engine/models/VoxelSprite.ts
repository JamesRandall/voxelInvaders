import { VoxelModel } from "./VoxelModel"
import { vec3 } from "gl-matrix"
import { WorldObject } from "./WorldObject"

export interface SpriteOptions {
  isDestructible?: boolean
  animationFrameDuration?: number
  unitBasedMovement?: boolean // if set to true then the sprite will move on the voxel grid
}

export class VoxelSprite<TModelType, TWorldObjectType> extends WorldObject<TWorldObjectType>  {
  private readonly _frames:VoxelModel<TModelType>[]
  private readonly _animationFrameDuration:number|null
  private _timeToNextFrame:number
  private _currentFrameIndex = 0

  constructor(frames:VoxelModel<TModelType>[], position: vec3, options?:SpriteOptions) {
    super(position, options?.unitBasedMovement ?? true)
    // If a sprite is destructible then we want to copy the models as they will be modified
    // in response to destruction
    this._frames = (options?.isDestructible ?? false) ? frames.map(VoxelModel.copy) : frames
    this._animationFrameDuration = (options?.animationFrameDuration ?? 0)
    this._timeToNextFrame = this._animationFrameDuration
  }

  public frame(index: number) { return this._frames[index] }

  public get currentFrame() { return this._frames[this._currentFrameIndex] }

  public update(frameLength:number) {
    this.updateAnimationFrame(frameLength)
    this.updatePosition(frameLength)
  }

  private updateAnimationFrame(frameLength:number) {
    if (this._animationFrameDuration === null) return
    this._timeToNextFrame -= frameLength
    if (this._timeToNextFrame < 0) {
      this._timeToNextFrame += this._animationFrameDuration
      if (this._timeToNextFrame < 0) {
        this._timeToNextFrame = this._animationFrameDuration
      }
      this._currentFrameIndex++
      if (this._currentFrameIndex > this._frames.length - 1) {
        this._currentFrameIndex = 0
      }
    }
  }
}