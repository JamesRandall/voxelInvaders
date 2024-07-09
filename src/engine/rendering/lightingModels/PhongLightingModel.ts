import { mat4, vec3 } from "gl-matrix"
import { AbstractLightingModel } from "./AbstractLightingModel"
import { ShaderProvider } from "../../Resources"
import { CoreProgramInfo, getCoreAttributes, getCoreUniforms } from "../CoreProgramInfo"
import { Camera } from "../../Camera"

interface PhongLightingProgramInfo extends CoreProgramInfo {
  uniforms: {
    projectionViewMatrix: WebGLUniformLocation
    showOutlines: WebGLUniformLocation
    transformMatrix: WebGLUniformLocation
    lightDirection: WebGLUniformLocation
    lightAmbient: WebGLUniformLocation
    lightDiffuse: WebGLUniformLocation
    lightSpecular: WebGLUniformLocation
    cameraPosition: WebGLUniformLocation
    shininess: WebGLUniformLocation
  }
}

export class PhongLightingModel extends AbstractLightingModel {
  private _programInfo : PhongLightingProgramInfo

  constructor(
    gl: WebGL2RenderingContext,
    shaders: ShaderProvider,
    public options: {
      lightDirection: vec3
      ambientLight: vec3
      diffuseLight: vec3
      specularLight: vec3
      shininess: number
    }
  ) {
    super('phong', shaders)
    this._programInfo = this.createProgramInfo(gl)
  }

  public override get programInfo() : CoreProgramInfo { return this._programInfo }

  private createProgramInfo(gl: WebGL2RenderingContext) : PhongLightingProgramInfo {
    return {
      attributes: {
        ...getCoreAttributes(gl, this.shaderProgram)
      },
      uniforms: {
        ...getCoreUniforms(gl, this.shaderProgram),
        transformMatrix: gl.getUniformLocation(this.shaderProgram, "uTransformMatrix")!,
        lightDirection: gl.getUniformLocation(this.shaderProgram, "uLightDirection")!,
        lightAmbient: gl.getUniformLocation(this.shaderProgram, "uLightAmbient")!,
        lightDiffuse: gl.getUniformLocation(this.shaderProgram, "uLightDiffuse")!,
        lightSpecular: gl.getUniformLocation(this.shaderProgram, "uLightSpecular")!,
        cameraPosition: gl.getUniformLocation(this.shaderProgram, "uCameraPosition")!,
        shininess: gl.getUniformLocation(this.shaderProgram, "uShininess")!,
      }
    }
  }

  public setAttributes(gl: WebGL2RenderingContext): void {

  }

  public setUniforms(gl: WebGL2RenderingContext, camera: Camera, projectionViewMatrix: mat4): void {
    gl.uniform1f(this._programInfo.uniforms.shininess, this.options.shininess)
    gl.uniform3fv(this._programInfo.uniforms.lightDirection, this.options.lightDirection)
    gl.uniform3fv(this._programInfo.uniforms.lightAmbient, this.options.ambientLight)
    gl.uniform3fv(this._programInfo.uniforms.lightDiffuse, this.options.diffuseLight)
    gl.uniform3fv(this._programInfo.uniforms.lightSpecular, this.options.specularLight)
    gl.uniform3fv(this._programInfo.uniforms.cameraPosition, camera.position)
  }
}