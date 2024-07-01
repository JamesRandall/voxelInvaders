import { VoxEdJson } from "../voxEd/VoxEdJson"
import { Voxel } from "./Voxel"
import { VoxelColor } from "./VoxelColor"

export class VoxelModel {
  public width: number
  public height: number
  public depth: number

  public voxels: (Voxel|null)[][][]

  constructor(width:number, height:number, depth:number, voxels:(Voxel|null)[][][]) {
    this.width = width
    this.height = height
    this.depth = depth
    this.voxels = voxels
  }

  static copy(src: VoxelModel): VoxelModel {
    const copiedVoxels = src.voxels.map(z =>
      z.map(y => y.map(x => x === null ? null : Voxel.copy(x)))
    )
    return new VoxelModel(src.width, src.height, src.depth, copiedVoxels)
  }
}