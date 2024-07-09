import { Voxel } from "./Voxel"

export class VoxelModel<TModelType> {
  constructor(public type: TModelType, public width:number, public height:number, public depth:number, public voxels:(Voxel|null)[][][]) {

  }

  static copy<TModelType>(src: VoxelModel<TModelType>): VoxelModel<TModelType> {
    const copiedVoxels = src.voxels.map(z =>
      z.map(y => y.map(x => x === null ? null : Voxel.copy(x)))
    )
    return new VoxelModel<TModelType>(src.type, src.width, src.height, src.depth, copiedVoxels)
  }
}