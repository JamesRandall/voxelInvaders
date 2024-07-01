import { VoxelColor } from "./VoxelColor"
import { VoxelPosition } from "./VoxelPosition"

export class Voxel {
  constructor(public color:VoxelColor) { }

  static copy(src: Voxel): Voxel {
    return new Voxel(new VoxelColor(src.color.r, src.color.g, src.color.b, src.color.a))
  }
}

