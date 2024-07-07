var gl:WebGL2RenderingContext

export interface ProgramInfo {
  attributes: {
    position: number
    color: number
    normal: number
  }
  uniforms: {
    projectionViewMatrix: WebGLUniformLocation
    transformMatrix: WebGLUniformLocation
  }
}