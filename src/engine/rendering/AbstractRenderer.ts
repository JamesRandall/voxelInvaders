import { Scene } from "../Scene"

export abstract class AbstractRenderer<TModelType, TWorldObjectType> {
  private setAttribute(
    gl: WebGL2RenderingContext,
    buffer: WebGLBuffer,
    position: number,
    type: GLenum,
    numberOfComponents:number
  ) {
    if (position < 0) { return }
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.vertexAttribPointer(position, numberOfComponents, type, false, 0, 0)
    gl.enableVertexAttribArray(position)
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

  protected setTextureAttribute(
    gl: WebGL2RenderingContext,
    buffer: WebGLBuffer,
    position: number
  ) {
    this.setAttribute(gl, buffer, position, gl.FLOAT, 2)
  }

  public abstract render(gl: WebGL2RenderingContext, scene:Scene<TModelType, TWorldObjectType>) : void
}