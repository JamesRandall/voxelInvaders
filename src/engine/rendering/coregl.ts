import { mat4, vec3 } from "gl-matrix"
import { VoxelModel } from "../models/VoxelModel"

export function setupGl(gl: WebGL2RenderingContext) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clearDepth(1.0)
  gl.enable(gl.DEPTH_TEST)
  gl.disable(gl.CULL_FACE)
  gl.depthFunc(gl.LEQUAL)
  gl.enable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  gl.viewport(0,0,gl.canvas.width, gl.canvas.height)
}

export function createFrameBufferTexture(gl: WebGL2RenderingContext, width: number, height: number) {
  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)

  const level = 0
  const internalFormat = gl.RGBA
  const border = 0
  const format = gl.RGBA
  const type = gl.UNSIGNED_BYTE
  const data = null

  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, format, type, data)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

  return texture
}

export function createProjectionMatrix(width: number, height: number, zFar: number, zNear: number = 0.01) {
  const fieldOfView = (45 * Math.PI) / 180 // in radians
  const aspect = width / height
  const projectionMatrix = mat4.create()

  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar)
  return projectionMatrix
}

export function createProjectionViewMatrix(width: number, height: number, zFar: number, cameraPosition: vec3, lookAt: vec3, zNear: number = 0.01) {
  const projectionMatrix = createProjectionMatrix(width, height, zFar, zNear)
  const viewMatrix = mat4.create()
  mat4.lookAt(viewMatrix, cameraPosition, lookAt, [0, 1, 0])
  return mat4.multiply(mat4.create(), projectionMatrix, viewMatrix)
}

export function modelSpaceToWorldSpace(x:number, y:number, z:number, modelSize: vec3) {
  return vec3.fromValues(
    x+0.5,
    y+0.5,
    -z+0.5)
}