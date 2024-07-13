export function getCoreAttributes(gl:WebGL2RenderingContext, shaderProgram:WebGLProgram) {
  return {
    position: gl.getAttribLocation(shaderProgram, "aPosition"),
    color: gl.getAttribLocation(shaderProgram, "aColor"),
    normal: gl.getAttribLocation(shaderProgram, "aNormal"),
    texCoord: gl.getAttribLocation(shaderProgram, "aTexCoord"),
  }
}

export function getCoreUniforms(gl:WebGL2RenderingContext, shaderProgram:WebGLProgram) {
  return {
    projectionViewMatrix: gl.getUniformLocation(shaderProgram, "uProjectionViewMatrix")!,
    showOutlines: gl.getUniformLocation(shaderProgram, "uShowOutline")!,
    transformMatrix: gl.getUniformLocation(shaderProgram, "uTransformMatrix")!,
  }
}

export interface CoreProgramInfo {
  attributes: {
    position: number
    color: number
    normal: number
    texCoord: number
  }
  uniforms: {
    projectionViewMatrix: WebGLUniformLocation
    showOutlines: WebGLUniformLocation
    transformMatrix: WebGLUniformLocation
  }
}
