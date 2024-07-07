import { VoxelModel } from "../models/VoxelModel"
import { vec2, vec3 } from "gl-matrix"
import { Voxel } from "../models/Voxel"

export interface VoxelRenderingModel {
  vertices: WebGLBuffer
  colors: WebGLBuffer
  normals: WebGLBuffer
  textureCoordinates: WebGLBuffer
  indices: WebGLBuffer
  vertexCount: number
}

// In a future game we'll also look at using instanced rendering which is more efficient but keeping this simple
// for an initial demo
export function createVoxelRenderingModel<TModelType>(gl:WebGL2RenderingContext, source: VoxelModel<TModelType>) : VoxelRenderingModel {
  const vertices: number[] = []
  const indices: number[] = []
  const vertexColors: number[] = []
  const vertexNormals: number[] = []
  const textureCoordinates: number[] = []
  let indexOffset = 0

  for(let z=0; z < source.depth; z++) {
    for (let y=0; y < source.height; y++) {
      for (let x = 0; x < source.width; x++) {
        let voxel = source.voxels[z][y][x]
        if (voxel !== null) {
          const offset = vec3.fromValues(
            x+0.5-source.width/2+0.002,
            y+0.5-source.height/2+0.002,
            -z+0.5-source.depth/2+0.002)
          appendDataForVoxel(vertices, vertexColors, vertexNormals, textureCoordinates, indices, voxel, offset, indexOffset)
          indexOffset += baseVertices.length
        }
      }
    }
  }

  const vertexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

  const colorBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW)

  const normalBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW)

  const textureCoordinateBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordinateBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW)

  const indexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)

  return {
    vertices: vertexBuffer!,
    colors: colorBuffer!,
    normals: normalBuffer!,
    textureCoordinates: textureCoordinateBuffer!,
    indices: indexBuffer!,
    vertexCount: indices.length
  }
}

function appendDataForVoxel(
  vertices:number[],
  vertexColors:number[],
  vertexNormals: number[],
  textureCoordinates:number[],
  indices: number[],
  voxel:Voxel,
  offset:vec3,
  indexOffset:number) {

  baseVertices.forEach(v => {
    const adjustedVertex = vec3.add(vec3.create(), v, offset)
    vertices.push(adjustedVertex[0])
    vertices.push(adjustedVertex[1])
    vertices.push(adjustedVertex[2])

    vertexColors.push(voxel.color.r)
    vertexColors.push(voxel.color.g)
    vertexColors.push(voxel.color.b)
    vertexColors.push(voxel.color.a)
  })
  baseNormals.forEach(n => {
    vertexNormals.push(n[0])
    vertexNormals.push(n[1])
    vertexNormals.push(n[2])
  })
  baseTextureCoordinates.forEach(tc => {
    textureCoordinates.push(tc[0])
    textureCoordinates.push(tc[1])
  })
  baseIndices.forEach(i => indices.push(i + indexOffset))
}

const baseVertices = [
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
const baseNormals = [
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

const baseTextureCoordinates = [
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

const baseIndices = [
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