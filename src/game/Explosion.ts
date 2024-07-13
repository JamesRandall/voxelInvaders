import { VoxelParticleSet } from "../engine/rendering/VoxelParticleSet"
import { GameSprite } from "./GameSprite"
import { VoxelParticle } from "../engine/models/VoxelParticle"
import { vec3 } from "gl-matrix"
import { modelSpaceToWorldSpace } from "../engine/rendering/coregl"

export class Explosion extends VoxelParticleSet {
  constructor(gl:WebGL2RenderingContext, sprite: GameSprite) {
    const model = sprite.currentFrame
    const particles:VoxelParticle[] = []
    const initialSpeedRange = 32
    for (let z=0; z < model.depth; z++) {
      for (let y=0; y < model.height; y++) {
        for (let x=0; x < model.width; x++) {
          const voxel = model.voxels[z][y][x]
          if (voxel === null) { continue }
          const particle = {
            startingPosition: modelSpaceToWorldSpace(x, y, z, model.size),
            startingVelocity: vec3.fromValues(Math.random() * initialSpeedRange - initialSpeedRange/2, Math.random() * initialSpeedRange - initialSpeedRange/2, Math.random() * initialSpeedRange - initialSpeedRange/2),
            startingColor: voxel.color.values,
            endingColor: voxel.color.values,
            life: 2.0
          }
          particles.push(particle)
        }
      }
    }
    super(gl, particles, sprite.position)
  }
}