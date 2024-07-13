import { vec3, vec4 } from "gl-matrix"

export interface VoxelParticle {
  startingPosition: vec3
  startingVelocity: vec3
  startingColor: vec4
  endingColor: vec4
  life: number
}
