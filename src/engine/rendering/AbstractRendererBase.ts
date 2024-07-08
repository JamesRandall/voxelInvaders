import { PhongLightingProgramInfo } from "./PhongLightingProgramInfo"
import { Scene } from "../Scene"

export abstract class AbstractRendererBase<TModelType> {
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

  protected createProgramInfo(gl: WebGL2RenderingContext, shaderProgram:WebGLProgram) : PhongLightingProgramInfo {
    return {
      attributes: {
        position: gl.getAttribLocation(shaderProgram, "aPosition"),
        color: gl.getAttribLocation(shaderProgram, "aColor"),
        normal: gl.getAttribLocation(shaderProgram, "aNormal"),
        texCoord: gl.getAttribLocation(shaderProgram, "aTexCoord"),
      },
      uniforms: {
        projectionViewMatrix: gl.getUniformLocation(shaderProgram, "uProjectionViewMatrix")!,
        transformMatrix: gl.getUniformLocation(shaderProgram, "uTransformMatrix")!,
        lightDirection: gl.getUniformLocation(shaderProgram, "uLightDirection")!,
        lightAmbient: gl.getUniformLocation(shaderProgram, "uLightAmbient")!,
        lightDiffuse: gl.getUniformLocation(shaderProgram, "uLightDiffuse")!,
        lightSpecular: gl.getUniformLocation(shaderProgram, "uLightSpecular")!,
        cameraPosition: gl.getUniformLocation(shaderProgram, "uCameraPosition")!,
        showOutline: gl.getUniformLocation(shaderProgram, "uShowOutline")!,
        shininess: gl.getUniformLocation(shaderProgram, "uShininess")!,
      }
    }
  }

  public abstract render(gl: WebGL2RenderingContext, scene:Scene<TModelType>) : void
}