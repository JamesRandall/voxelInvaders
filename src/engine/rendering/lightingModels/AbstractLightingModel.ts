import { mat4 } from "gl-matrix"
import { Camera } from "../../Camera"
import { CoreProgramInfo } from "../CoreProgramInfo"
import { ShaderProvider } from "../../Resources"

// TODO: Need to revist how the type system is structured around lighting to make it impossible to assign
// a particle lighting model to voxel rendering and vice-versa.
export abstract class AbstractLightingModel {
  public shaderProgram: WebGLProgram

  protected constructor(shaderName: string, shaders:ShaderProvider) {
    const shaderProgram = shaders.getShader(shaderName)
    if (!shaderProgram) { throw new Error("Unable to find voxel shader")}
    this.shaderProgram = shaderProgram
  }

  public abstract get programInfo() : CoreProgramInfo
  public abstract setAttributes(gl: WebGL2RenderingContext) : void
  public abstract setUniforms(gl:WebGL2RenderingContext, camera: Camera, projectionViewMatrix: mat4) : void
}