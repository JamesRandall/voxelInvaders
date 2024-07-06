import { Voxel as EngineVoxel } from "../models/Voxel"
import { VoxelColor } from "../models/VoxelColor"
import { VoxelModel } from "../models/VoxelModel"

export namespace VoxEdJson {
  export interface Voxel {
    color: [number, number, number, number]
    position: [number, number, number]
  }

  export interface Model {
    name: string
    version: [number, number, number]
    voxels: Voxel[]
  }

  export const size = (model: Model) =>
    model.voxels.reduce((pv, cv) =>
        [Math.max(pv[0], cv.position[0]), Math.max(pv[1], cv.position[1]), Math.max(pv[2], cv.position[2])],
      [-1, -1, -1]
    ).map(v => v+1)

  export function createFromVoxEd<TModelType>(type: TModelType, model: Model) {
    const [width, height, depth] = size(model)

    let voxels: (EngineVoxel | null)[][][] = Array.from({ length: depth }, () =>
      Array.from({ length: height }, () =>
        Array.from({ length: width }, () => null)
      )
    )

    model.voxels.forEach(jsonVoxel =>
      voxels[jsonVoxel.position[2]][jsonVoxel.position[1]][jsonVoxel.position[0]] =
        new EngineVoxel(new VoxelColor(jsonVoxel.color[0], jsonVoxel.color[1], jsonVoxel.color[2], jsonVoxel.color[3]))
    )

    return new VoxelModel(type, width, height, depth, voxels)
  }
}

