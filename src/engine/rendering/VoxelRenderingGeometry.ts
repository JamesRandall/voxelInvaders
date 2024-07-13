import { vec2, vec3 } from "gl-matrix"

export namespace VoxelRenderingGeometry {
  export const baseVertices = [
    // Front
    vec3.fromValues(-0.5, -0.5, -0.5),
    vec3.fromValues(0.5, -0.5, -0.5),
    vec3.fromValues(0.5,  0.5, -0.5),
    vec3.fromValues(-0.5,  0.5, -0.5),
    // Rear
    vec3.fromValues(-0.5, -0.5,  0.5),
    vec3.fromValues(0.5, -0.5,  0.5),
    vec3.fromValues(0.5,  0.5,  0.5),
    vec3.fromValues(-0.5,  0.5,  0.5),
    // Left
    vec3.fromValues(-0.5,  0.5, -0.5),
    vec3.fromValues(-0.5, -0.5, -0.5),
    vec3.fromValues(-0.5, -0.5,  0.5),
    vec3.fromValues(-0.5,  0.5,  0.5),
    // Right
    vec3.fromValues(0.5,  0.5, -0.5),
    vec3.fromValues(0.5, -0.5, -0.5),
    vec3.fromValues(0.5, -0.5,  0.5),
    vec3.fromValues(0.5,  0.5,  0.5),
    // Bottom
    vec3.fromValues(-0.5, -0.5, -0.5),
    vec3.fromValues(0.5, -0.5, -0.5),
    vec3.fromValues(0.5, -0.5,  0.5),
    vec3.fromValues(-0.5, -0.5,  0.5),
    // Top
    vec3.fromValues(-0.5,  0.5, -0.5),
    vec3.fromValues(0.5,  0.5, -0.5),
    vec3.fromValues(0.5,  0.5,  0.5),
    vec3.fromValues(-0.5,  0.5,  0.5)
  ]
  export const baseNormals = [
    // Front
    vec3.fromValues(0.0,0.0,1.0),
    vec3.fromValues(0.0,0.0,1.0),
    vec3.fromValues(0.0,0.0,1.0),
    vec3.fromValues(0.0,0.0,1.0),
    // Rear
    vec3.fromValues(0.0,0.0,-1.0),
    vec3.fromValues(0.0,0.0,-1.0),
    vec3.fromValues(0.0,0.0,-1.0),
    vec3.fromValues(0.0,0.0,-1.0),
    // Left
    vec3.fromValues(-1.0,0.0,0.0),
    vec3.fromValues(-1.0,0.0,0.0),
    vec3.fromValues(-1.0,0.0,0.0),
    vec3.fromValues(-1.0,0.0,0.0),
    // Right
    vec3.fromValues(1.0,0.0,0.0),
    vec3.fromValues(1.0,0.0,0.0),
    vec3.fromValues(1.0,0.0,0.0),
    vec3.fromValues(1.0,0.0,0.0),
    // Bottom
    vec3.fromValues(0.0,-1.0,0.0),
    vec3.fromValues(0.0,-1.0,0.0),
    vec3.fromValues(0.0,-1.0,0.0),
    vec3.fromValues(0.0,-1.0,0.0),
    // Top
    vec3.fromValues(0.0,1.0,0.0),
    vec3.fromValues(0.0,1.0,0.0),
    vec3.fromValues(0.0,1.0,0.0),
    vec3.fromValues(0.0,1.0,0.0),
  ]

  export const baseTextureCoordinates = [
    // Front
    vec2.fromValues(0.0,1.0),
    vec2.fromValues(1.0,1.0),
    vec2.fromValues(1.0,0.0),
    vec2.fromValues(0.0,0.0),
    // Rear
    vec2.fromValues(0.0,1.0),
    vec2.fromValues(1.0,1.0),
    vec2.fromValues(1.0,0.0),
    vec2.fromValues(0.0,0.0),
    // Left
    vec2.fromValues(0.0,1.0),
    vec2.fromValues(1.0,1.0),
    vec2.fromValues(1.0,0.0),
    vec2.fromValues(0.0,0.0),
    // Right
    vec2.fromValues(0.0,1.0),
    vec2.fromValues(1.0,1.0),
    vec2.fromValues(1.0,0.0),
    vec2.fromValues(0.0,0.0),
    // Bottom
    vec2.fromValues(0.0,1.0),
    vec2.fromValues(1.0,1.0),
    vec2.fromValues(1.0,0.0),
    vec2.fromValues(0.0,0.0),
    // Top
    vec2.fromValues(0.0,1.0),
    vec2.fromValues(1.0,1.0),
    vec2.fromValues(1.0,0.0),
    vec2.fromValues(0.0,0.0),
  ]

  export const baseIndices = [
    // Front
    0, 3, 2,
    2, 1, 0,

    // Rear
    4, 5, 6,
    6, 7 ,4,

    // Left
    11, 8, 9,
    9, 10, 11,

    // Right
    12, 13, 14,
    14, 15, 12,

    // Bottom
    16, 17, 18,
    18, 19, 16,

    // Top
    20, 21, 22,
    22, 23, 20
  ]
}