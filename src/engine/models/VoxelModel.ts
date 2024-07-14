import { Voxel } from "./Voxel"
import { vec3 } from "gl-matrix"

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


}