export interface ResourceSpecification<TModelType> {
  voxelModels: { type:TModelType, source: string }[]
}