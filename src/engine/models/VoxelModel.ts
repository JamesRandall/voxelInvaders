import { Voxel } from "./Voxel"
import { vec3 } from "gl-matrix"
import { VoxelColor } from "./VoxelColor"

export class VoxelModel<TModelType> {
  public readonly size:vec3

  constructor(
    public type: TModelType,
    public readonly width:number,
    public readonly height:number,
    public readonly depth:number,
    public voxels:(Voxel|null)[][][] // TODO: make this a readonly public
  ) {
    this.size = vec3.fromValues(width, height, depth)
  }

  static copy<TModelType>(src: VoxelModel<TModelType>): VoxelModel<TModelType> {
    const copiedVoxels = src.voxels.map(z =>
      z.map(y => y.map(x => x === null ? null : Voxel.copy(x)))
    )
    return new VoxelModel<TModelType>(src.type, src.width, src.height, src.depth, copiedVoxels)
  }

  static fill<TModelType>(type: TModelType, width:number, height:number, depth:number, color:VoxelColor): VoxelModel<TModelType> {
    const voxels = new Array(depth).fill(null).map(() =>
      new Array(height).fill(null).map(() =>
        new Array(width).fill(null).map(() =>
          new Voxel(color)
        )
      )
    )
    return new VoxelModel<TModelType>(type, width, height, depth, voxels)
  }
}