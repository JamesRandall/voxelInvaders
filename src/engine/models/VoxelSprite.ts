import { VoxelModel } from "./VoxelModel"
import { vec3 } from "gl-matrix"

export interface SpriteOptions {
  isDestructible?: boolean
  animationFrameDuration?: number
  unitBasedMovement?: boolean // if set to true then the sprite will move on the voxel grid
}

export class VoxelSprite {
  private readonly _frames:VoxelModel[]
  private readonly _animationFrameDuration:number|null
  private readonly _unitBasedMovement:boolean
  private _position:vec3
  private _timeToNextFrame:number
  private _currentFrameIndex = 0
  private _unitMovementDelta = vec3.fromValues(0,0,0)

  public velocity = vec3.fromValues(0,0,0)


  constructor(frames:VoxelModel[], position: vec3, options?:SpriteOptions) {
    // If a sprite is destructible then we want to copy the models as they will be modified
    // in response to destruction
    this._frames = (options?.isDestructible ?? false) ? frames.map(VoxelModel.copy) : frames
    this._animationFrameDuration = (options?.animationFrameDuration ?? 0)
    this._unitBasedMovement = (options?.unitBasedMovement ?? true)
    this._position = position
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

  private updatePosition(frameLength: number) {
    const applyUnitMovementComponent = (component:number) => {
      if (this._unitMovementDelta[component] > 1) {
        const delta = Math.floor(this._unitMovementDelta[component])
        this._position[component] += delta
        this._unitMovementDelta[component] -= delta
      }
      else if (this._unitMovementDelta[component] < -1) {
        const delta = Math.ceil(this._unitMovementDelta[component])
        this._position[component] += delta
        this._unitMovementDelta[component] -= delta
      }
    }

    const delta = vec3.multiply(vec3.create(), this.velocity, [frameLength,frameLength,frameLength])
    if (this._unitBasedMovement) {
      vec3.add(this._unitMovementDelta, this._position, delta)
      applyUnitMovementComponent(0)
      applyUnitMovementComponent(1)
      applyUnitMovementComponent(2)
    }
    else {
      vec3.add(this._position, this._position, delta)
    }
  }
}