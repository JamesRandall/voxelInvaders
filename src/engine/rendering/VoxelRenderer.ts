import { Scene } from "../Scene"
import { createProjectionViewMatrix, setupGl } from "./coregl"
import { RenderingModelProvider } from "../Resources"
import { AbstractRenderer } from "./AbstractRenderer"
import { VoxelRenderingModel } from "./VoxelRenderingModel"
import { mat4 } from "gl-matrix"
import { VoxelSprite } from "../models/VoxelSprite"
import { AbstractLightingModel } from "./lightingModels/AbstractLightingModel"

export class VoxelRenderer<TModelType,TWorldObjectType> extends AbstractRenderer<TModelType, TWorldObjectType> {
  private _renderingModels : RenderingModelProvider<TModelType>

  constructor(renderingModels: RenderingModelProvider<TModelType>, private lightingModel: AbstractLightingModel) {
    super()
    this._renderingModels = renderingModels
  }

  private setAttributes(gl: WebGL2RenderingContext, model: VoxelRenderingModel) {
    this.lightingModel.setAttributes(gl)
    this.setVertexAttribute(gl, model.vertices, this.lightingModel.programInfo.attributes.position)
    this.setVertexAttribute(gl, model.normals, this.lightingModel.programInfo.attributes.normal)
    this.setColorAttribute(gl, model.colors, this.lightingModel.programInfo.attributes.color)
    this.setTextureAttribute(gl, model.textureCoordinates, this.lightingModel.programInfo.attributes.texCoord)
  }

  private setUniforms(gl:WebGL2RenderingContext, scene:Scene<TModelType, TWorldObjectType>, projectionViewMatrix: mat4) {
    this.lightingModel.setUniforms(gl, scene.view.camera, projectionViewMatrix)
    gl.uniformMatrix4fv(this.lightingModel.programInfo.uniforms.projectionViewMatrix, false, projectionViewMatrix)
    gl.uniform1f(this.lightingModel.programInfo.uniforms.showOutlines, 0.0)
  }

  public getPreTranslateRotationMatrix(sprite: VoxelSprite<TModelType, TWorldObjectType>) {
    return mat4.create()
  }

  public getPostTranslateRotationMatrix(sprite: VoxelSprite<TModelType, TWorldObjectType>) {
    return mat4.create()
  }

  public override render(gl: WebGL2RenderingContext, scene:Scene<TModelType, TWorldObjectType>) {
    const width = gl.canvas.width
    const height = gl.canvas.height
    const projectionViewMatrix = createProjectionViewMatrix(width, height, scene.view.zFar, scene.view.camera.position, scene.view.camera.lookAt, scene.view.zNear)
    setupGl(gl)

    gl.useProgram(this.lightingModel.shaderProgram)
    this.setUniforms(gl, scene, projectionViewMatrix)

    scene.sprites.forEach(sprite => {
      const model = sprite.currentFrame
      const renderingModel = this._renderingModels.getRenderingModel(model.type)
      if (!renderingModel) { return }
      const translateMatrix = mat4.translate(mat4.create(), mat4.create(), sprite.position)
      const preTranslateRotateMatrix = this.getPreTranslateRotationMatrix(sprite)
      const postTranslateRotateMatrix = this.getPostTranslateRotationMatrix(sprite)
      const worldMatrix = mat4.multiply(mat4.create(),
        mat4.multiply(mat4.create(), postTranslateRotateMatrix, translateMatrix),
        preTranslateRotateMatrix
      )
      gl.uniformMatrix4fv(this.lightingModel.programInfo.uniforms.transformMatrix, false, worldMatrix)
      this.setAttributes(gl, renderingModel)
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, renderingModel.indices)
      gl.drawElements(gl.TRIANGLES, renderingModel.vertexCount, gl.UNSIGNED_SHORT, 0)
    })
  }
}