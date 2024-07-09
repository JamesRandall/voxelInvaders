import { VoxelModel } from "./VoxelModel"

export interface ResourceSpecification<TModelType> {
  voxelModels: { type:TModelType, source: string | VoxelModel<TModelType> }[]
}