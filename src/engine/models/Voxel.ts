import { VoxelColor } from "./VoxelColor"

export class Voxel {
  constructor(public color:VoxelColor) { }

  public isDeleted = false

  static copy(src: Voxel): Voxel {
    return new Voxel(new VoxelColor(src.color.r, src.color.g, src.color.b, src.color.a))
  }
}

