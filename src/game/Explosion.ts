import { VoxelParticleSet } from "../engine/rendering/VoxelParticleSet"
import { GameSprite } from "./GameSprite"
import { VoxelParticle } from "../engine/models/VoxelParticle"
import { vec3, vec4 } from "gl-matrix"
import { modelSpaceToWorldSpace } from "../engine/rendering/coregl"

export class Explosion extends VoxelParticleSet {
  constructor(gl:WebGL2RenderingContext, sprite: GameSprite) {
    const model = sprite.currentFrame
    const particles:VoxelParticle[] = []
    const maxInitialSpeedRange = 16
    const randomFactor = 16
    for (let z=0; z < model.depth; z++) {
      for (let y=0; y < model.height; y++) {
        for (let x=0; x < model.width; x++) {
          const voxel = model.voxels[z][y][x]
          if (voxel === null) { continue }
          const startingVelocity = vec3.multiply(vec3.create(),vec3.normalize(vec3.create(), [x-model.width/2,y-model.height/2,z-model.depth/2]),[maxInitialSpeedRange,maxInitialSpeedRange,maxInitialSpeedRange])
          vec3.add(startingVelocity,startingVelocity,[Math.random()*randomFactor-randomFactor/2,Math.random()*randomFactor-randomFactor/2,Math.random()*randomFactor-randomFactor/2])
          const particle = {
            startingPosition: modelSpaceToWorldSpace(x, y, z, model.size),
            startingVelocity: startingVelocity,
            startingColor: voxel.color.values,
            endingColor: vec4.fromValues(voxel.color.r,voxel.color.g,voxel.color.b,0),
            life: 2.0
          }
          particles.push(particle)
        }
      }
    }
    super(gl, particles, sprite.position)
  }
}