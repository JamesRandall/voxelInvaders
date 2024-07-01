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
    )

  export const createFromVoxEd = (model: Model) => {
    const [width, height, depth] = size(model)

    let voxels: (EngineVoxel | null)[][][] = Array.from({ length: depth }, () =>
      Array.from({ length: height }, () =>
        Array.from({ length: width }, () => null)
      )
    )

    model.voxels.forEach(jsonVoxel =>
      voxels[jsonVoxel.position[0]][jsonVoxel.position[1]][jsonVoxel.position[2]] =
        new EngineVoxel(new VoxelColor(jsonVoxel.color[0], jsonVoxel.color[1], jsonVoxel.color[2], jsonVoxel.color[3]))
    )

    return new VoxelModel(width, height, depth, voxels)
  }
}

