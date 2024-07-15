import { mat4, vec3 } from "gl-matrix"
import { AbstractLightingModel } from "./AbstractLightingModel"
import { ShaderProvider } from "../../Resources"
import { CoreProgramInfo, getCoreAttributes, getCoreUniforms } from "../CoreProgramInfo"
import { Camera } from "../../Camera"

export abstract class UniformLightingModel extends AbstractLightingModel {
  private readonly _programInfo : CoreProgramInfo

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

  public static createParticleLighting(gl: WebGL2RenderingContext, shaders: ShaderProvider) {
    return new ParticleUniformLightingModel(gl, shaders)
  }

  public static createVoxelLighting(gl: WebGL2RenderingContext, shaders: ShaderProvider) {
    return new VoxelUniformLightingModel(gl, shaders)
  }
}

class VoxelUniformLightingModel extends UniformLightingModel {
  constructor(
    gl: WebGL2RenderingContext,
    shaders: ShaderProvider
  ) {
    super(gl, shaders, 'voxel_uniform')
  }
}

// TODO: When we've implemented the particle rendering, we'll look again at the lighting model abstractions
class ParticleUniformLightingModel extends UniformLightingModel {
  constructor(
    gl: WebGL2RenderingContext,
    shaders: ShaderProvider
  ) {
    super(gl, shaders, 'particle_uniform')
  }
}