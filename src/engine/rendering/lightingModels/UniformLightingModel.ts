import { mat4, vec3 } from "gl-matrix"
import { AbstractLightingModel } from "./AbstractLightingModel"
import { ShaderProvider } from "../../Resources"
import { CoreProgramInfo, getCoreAttributes, getCoreUniforms } from "../CoreProgramInfo"
import { Camera } from "../../Camera"

abstract class AbstractUniformLightingModel extends AbstractLightingModel {
  private _programInfo : CoreProgramInfo

  protected constructor(
    gl: WebGL2RenderingContext,
    shaders: ShaderProvider,
    shaderName: string
  ) {
    super(shaderName, shaders)
    this._programInfo = this.createProgramInfo(gl)
  }

  public override get programInfo() : CoreProgramInfo { return this._programInfo }

  private createProgramInfo(gl: WebGL2RenderingContext) : CoreProgramInfo {
    return {
      attributes: {
        ...getCoreAttributes(gl, this.shaderProgram)
      },
      uniforms: {
        ...getCoreUniforms(gl, this.shaderProgram),
      }
    }
  }

  public setAttributes(gl: WebGL2RenderingContext): void {

  }

  public setUniforms(gl: WebGL2RenderingContext, camera: Camera, projectionViewMatrix: mat4): void {

  }
}

export class UniformLightingModel extends AbstractUniformLightingModel {
  constructor(
    gl: WebGL2RenderingContext,
    shaders: ShaderProvider
  ) {
    super(gl, shaders, 'voxel_uniform')
  }
}

// TODO: When we've implemented the particle rendering, we'll look again at the lighting model abstractions
export class ParticleUniformLightingModel extends AbstractUniformLightingModel {
  constructor(
    gl: WebGL2RenderingContext,
    shaders: ShaderProvider
  ) {
    super(gl, shaders, 'particle_uniform')
  }
}