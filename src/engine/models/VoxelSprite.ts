import { VoxelModel } from "./VoxelModel"

export class VoxelSprite {
  frames: VoxelModel[]
  currentFrame = 0

  constructor(frames:VoxelModel[], isDestructible:boolean) {
    // If a sprite is destructible then we want to copy the models as they will be modified
    // in response to destruction
    this.frames = isDestructible ? frames.map(VoxelModel.copy) : frames
  }
}