import { VoxelModel } from "./VoxelModel"
import { vec3 } from "gl-matrix"
import { WorldObject } from "./WorldObject"
import { AxisAlignedBox } from "./AxisAlignedBox"
import { Voxel } from "./Voxel"
import { createVoxelRenderingModel, VoxelRenderingModel } from "../rendering/VoxelRenderingModel"

export interface SpriteOptions {
  isDestructible?: boolean
  animationFrameDuration?: number
  unitBasedMovement?: boolean // if set to true then the sprite will move on the voxel grid
  gl?: WebGL2RenderingContext
}

export interface SpriteMutation {
  voxels: ReadonlyArray<ReadonlyArray<ReadonlyArray<Voxel | null>>>
  addVoxel(x:number, y:number, z:number, voxel: Voxel): void
  removeVoxel(x:number, y:number, z:number): void
}

export class VoxelSprite<TModelType, TWorldObjectType> extends WorldObject<TWorldObjectType>  {
  private readonly _frames:VoxelModel<TModelType>[]
  // if a sprite is destructible then we need rendering models dedicated to each frame as they may be modified
  private _frameRenderModels:VoxelRenderingModel[] = []
  private readonly _animationFrameDuration:number|null
  private _timeToNextFrame:number
  private _currentFrameIndex = 0
  public isRemoved = false
  private _isDestructible:boolean

  constructor(frames:VoxelModel<TModelType>[], position: vec3, options?:SpriteOptions) {
    super(position, options?.unitBasedMovement ?? true)
    // If a sprite is destructible then we want to copy the models as they will be modified
    // in response to destruction
    this._frames = (options?.isDestructible ?? false) ? frames.map(VoxelModel.copy) : frames
    this._animationFrameDuration = (options?.animationFrameDuration ?? 0)
    this._timeToNextFrame = this._animationFrameDuration
    this._isDestructible = options?.isDestructible ?? false

    if (this._isDestructible)  {
      if (options?.gl === undefined) {
        throw new Error("A destructible sprite must have a WebGL context")
      }
      this._frameRenderModels = this._frames.map(m => createVoxelRenderingModel(options!.gl!, m))
    }

  }

  public frame(index: number) { return this._frames[index] }

  public get currentFrame() { return this._frames[this._currentFrameIndex] }

  public get currentRenderModel() { return this._frameRenderModels.length > this._currentFrameIndex ? this._frameRenderModels[this._currentFrameIndex] : null }

  public update(frameLength:number) {
    this.updateAnimationFrame(frameLength)
    this.updatePosition(frameLength)
  }

  private updateAnimationFrame(frameLength:number) {
    if (this._animationFrameDuration === null) return
    this._timeToNextFrame -= frameLength
    if (this._timeToNextFrame <= 0) {
      this._timeToNextFrame += this._animationFrameDuration
      if (this._timeToNextFrame <= 0) {
        this._timeToNextFrame = this._animationFrameDuration
      }
      this._currentFrameIndex++
      if (this._currentFrameIndex > this._frames.length - 1) {
        this._currentFrameIndex = 0
      }
    }
  }

  public getBoundingBox(): AxisAlignedBox {
    const halfSize = vec3.div(vec3.create(), this.currentFrame.size, [2,2,2])

    // TODO: we need to make sure this rounding is consistent with positioning on odd numbered dimensions
    const minCoords = vec3.ceil(vec3.create(), vec3.subtract(vec3.create(), this.position, halfSize))
    const maxCoords = vec3.floor(vec3.create(), vec3.add(vec3.create(), this.position, halfSize))

    return new AxisAlignedBox(minCoords, maxCoords);
  }

  public mutateCurrentFrame(mutation:(mutation:SpriteMutation) => void) {
    if (!this._isDestructible) { return }
    let didAdd = false
    mutation({
      voxels: this.currentFrame.voxels,
      addVoxel: (x:number, y:number, z:number, voxel: Voxel) => {
        // TODO: a possible performance improvement is to add the voxels into a new model rather than
        // rebuild the current model then just draw both models as part of the current frame
        this._frames[this._currentFrameIndex].voxels[z][y][x] = voxel
        didAdd = true
      },
      removeVoxel: (x:number, y:number, z:number) => {
        let voxel = this._frames[this._currentFrameIndex].voxels[z][y][x]
        if (voxel) {
          // soft deleting voxels makes for a much quicker model update
          voxel.isDeleted = true
        }
      }
    })
  }
}