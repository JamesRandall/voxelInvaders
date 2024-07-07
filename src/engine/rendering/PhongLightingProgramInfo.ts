var gl:WebGL2RenderingContext

export interface PhongLightingProgramInfo {
  attributes: {
    position: number
    color: number
    normal: number
    texCoord: number
  }
  uniforms: {
    projectionViewMatrix: WebGLUniformLocation
    transformMatrix: WebGLUniformLocation
    lightDirection: WebGLUniformLocation
    lightAmbient: WebGLUniformLocation
    lightDiffuse: WebGLUniformLocation
    lightSpecular: WebGLUniformLocation
    cameraPosition: WebGLUniformLocation
    showOutline: WebGLUniformLocation
  }
}