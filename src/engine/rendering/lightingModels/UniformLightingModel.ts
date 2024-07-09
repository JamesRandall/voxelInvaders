import { mat4, vec3 } from "gl-matrix"
import { AbstractLightingModel } from "./AbstractLightingModel"
import { ShaderProvider } from "../../Resources"
import { CoreProgramInfo, getCoreAttributes, getCoreUniforms } from "../CoreProgramInfo"
import { Camera } from "../../Camera"

export class UniformLightingModel extends AbstractLightingModel {
  private _programInfo : CoreProgramInfo

  constructor(
    gl: WebGL2RenderingContext,
    shaders: ShaderProvider
  ) {
    super('uniform', shaders)
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