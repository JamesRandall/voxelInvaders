import { Scene } from "../Scene"
import { createProjectionViewMatrix, setupGl } from "./coregl"
import { RenderingModelProvider, ShaderProvider } from "../Resources"
import { AbstractRendererBase } from "./AbstractRendererBase"
import { VoxelRenderingModel } from "./VoxelRenderingModel"
import { ProgramInfo } from "./ProgramInfo"
import { mat4 } from "gl-matrix"

export class VoxelRenderer<TModelType> extends AbstractRendererBase {
  private _shaderProgram : WebGLProgram
  private _renderingModels : RenderingModelProvider<TModelType>
  private _programInfo: ProgramInfo

  constructor(gl: WebGL2RenderingContext, shaders: ShaderProvider, renderingModels: RenderingModelProvider<TModelType>) {
    super()
    const shaderProgram = shaders.getShader('voxel')
    if (!shaderProgram) { throw new Error("Unable to find voxel shader")}
    this._shaderProgram = shaderProgram
    this._renderingModels = renderingModels
    this._programInfo = this.createProgramInfo(gl, this._shaderProgram)
  }

  private setAttributes(gl: WebGL2RenderingContext, model: VoxelRenderingModel) {
    this.setVertexAttribute(gl, model.vertices, this._programInfo.attributes.position)
    this.setVertexAttribute(gl, model.normals, this._programInfo.attributes.normal)
    this.setColorAttribute(gl, model.colors, this._programInfo.attributes.color)
  }

  private setUniforms(gl:WebGL2RenderingContext, projectionViewMatrix: mat4) {
    gl.uniformMatrix4fv(this._programInfo.uniforms.projectionViewMatrix, false, projectionViewMatrix)
  }

  render(gl: WebGL2RenderingContext, scene:Scene<TModelType>) {
    const width = gl.canvas.width
    const height = gl.canvas.height
    const projectionViewMatrix = createProjectionViewMatrix(width, height, scene.view.zFar, scene.view.camera.position, scene.view.camera.lookAt)
    setupGl(gl)
    gl.useProgram(this._shaderProgram)
    this.setUniforms(gl, projectionViewMatrix)

    scene.sprites.forEach(sprite => {
      const model = sprite.currentFrame
      const renderingModel = this._renderingModels.getRenderingModel(model.type)
      if (!renderingModel) { return }
      const translateMatrix = mat4.translate(mat4.create(), mat4.create(), sprite.position)
      gl.uniformMatrix4fv(this._programInfo.uniforms.transformMatrix, false, translateMatrix)
      this.setAttributes(gl, renderingModel)
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, renderingModel.indices)
      gl.drawElements(gl.TRIANGLES, renderingModel.vertexCount, gl.UNSIGNED_SHORT, 0)
    })
  }
}