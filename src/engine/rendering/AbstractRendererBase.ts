import { ProgramInfo } from "./ProgramInfo"

export abstract class AbstractRendererBase {
  private setAttribute(
    gl: WebGL2RenderingContext,
    buffer: WebGLBuffer,
    position: number,
    type: GLenum,
    numberOfComponents:number
  ) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.vertexAttribPointer(position, numberOfComponents, type, false, 0, 0)
  }

  protected setVertexAttribute(
    gl: WebGL2RenderingContext,
    buffer: WebGLBuffer,
    position: number) {
    this.setAttribute(gl, buffer, position, gl.FLOAT, 3)
  }

  protected setColorAttribute(
    gl: WebGL2RenderingContext,
    buffer: WebGLBuffer,
    position: number) {
    this.setAttribute(gl, buffer, position, gl.FLOAT, 4)
  }

  protected createProgramInfo(gl: WebGL2RenderingContext, shaderProgram:WebGLProgram) : ProgramInfo {
    return {
      attributes: {
        position: gl.getAttribLocation(shaderProgram, "aPosition"),
        color: gl.getAttribLocation(shaderProgram, "aColor"),
        normal: gl.getAttribLocation(shaderProgram, "aNormal"),
      },
      uniforms: {
        projectionViewMatrix: gl.getUniformLocation(shaderProgram, "uProjectionViewMatrix")!
      }
    }
  }
}