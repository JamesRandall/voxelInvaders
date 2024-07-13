import { VoxelModel } from "../models/VoxelModel"
import { vec2, vec3 } from "gl-matrix"
import { Voxel } from "../models/Voxel"
import { VoxelRenderingGeometry } from "./VoxelRenderingGeometry"
import { modelSpaceToWorldSpace } from "./coregl"

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
          const offset = modelSpaceToWorldSpace(x, y, z, source.size)
          appendDataForVoxel(vertices, vertexColors, vertexNormals, textureCoordinates, indices, voxel, offset, indexOffset)
          indexOffset += VoxelRenderingGeometry.baseVertices.length
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

  VoxelRenderingGeometry.baseVertices.forEach(v => {
    const adjustedVertex = vec3.add(vec3.create(), v, offset)
    vertices.push(adjustedVertex[0])
    vertices.push(adjustedVertex[1])
    vertices.push(adjustedVertex[2])

    vertexColors.push(voxel.color.r)
    vertexColors.push(voxel.color.g)
    vertexColors.push(voxel.color.b)
    vertexColors.push(voxel.color.a)
  })
  VoxelRenderingGeometry.baseNormals.forEach(n => {
    vertexNormals.push(n[0])
    vertexNormals.push(n[1])
    vertexNormals.push(n[2])
  })
  VoxelRenderingGeometry.baseTextureCoordinates.forEach(tc => {
    textureCoordinates.push(tc[0])
    textureCoordinates.push(tc[1])
  })
  VoxelRenderingGeometry.baseIndices.forEach(i => indices.push(i + indexOffset))
}

