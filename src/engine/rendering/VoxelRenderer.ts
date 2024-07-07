import { Scene } from "../Scene"
import { createProjectionViewMatrix, setupGl } from "./coregl"
import { RenderingModelProvider, ShaderProvider } from "../Resources"
import { AbstractRendererBase } from "./AbstractRendererBase"
import { VoxelRenderingModel } from "./VoxelRenderingModel"
import { PhongLightingProgramInfo } from "./PhongLightingProgramInfo"
import { mat4, vec3 } from "gl-matrix"

export class VoxelRenderer<TModelType> extends AbstractRendererBase {
  private _shaderProgram : WebGLProgram
  private _renderingModels : RenderingModelProvider<TModelType>
  private _programInfo: PhongLightingProgramInfo

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
    this.setTextureAttribute(gl, model.textureCoordinates, this._programInfo.attributes.texCoord)
  }

  private setUniforms(gl:WebGL2RenderingContext, scene:Scene<TModelType>, projectionViewMatrix: mat4) {
    gl.uniformMatrix4fv(this._programInfo.uniforms.projectionViewMatrix, false, projectionViewMatrix)
    gl.uniform3fv(this._programInfo.uniforms.lightDirection, [0.3,-0.4,0.5])
    gl.uniform3f(this._programInfo.uniforms.lightAmbient, 0.4,0.4,0.4)
    gl.uniform3fv(this._programInfo.uniforms.lightDiffuse, [1.0,1.0,1.0])
    gl.uniform3fv(this._programInfo.uniforms.lightSpecular, [0.5,0.5,0.5])
    gl.uniform3fv(this._programInfo.uniforms.cameraPosition, scene.view.camera.position)
    gl.uniform1f(this._programInfo.uniforms.showOutline, 0.0)
  }

  render(gl: WebGL2RenderingContext, scene:Scene<TModelType>) {
    const width = gl.canvas.width
    const height = gl.canvas.height
    const projectionViewMatrix = createProjectionViewMatrix(width, height, scene.view.zFar, scene.view.camera.position, scene.view.camera.lookAt)
    setupGl(gl)

    // this prevents small lines appearing between the voxels
    gl.enable(gl.POLYGON_OFFSET_FILL)
    gl.polygonOffset(1.0, 1.0)

    gl.useProgram(this._shaderProgram)
    this.setUniforms(gl, scene, projectionViewMatrix)

    scene.sprites.forEach(sprite => {
      const model = sprite.currentFrame
      const renderingModel = this._renderingModels.getRenderingModel(model.type)
      if (!renderingModel) { return }
      // we make a slight adjustment to the
      //const adjustedPosition = vec3.add(vec3.create(), [0.002,0.002,0.002], sprite.position)
      const adjustedPosition = sprite.position
      const translateMatrix = mat4.translate(mat4.create(), mat4.create(), adjustedPosition)
      gl.uniformMatrix4fv(this._programInfo.uniforms.transformMatrix, false, translateMatrix)
      this.setAttributes(gl, renderingModel)
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, renderingModel.indices)
      gl.drawElements(gl.TRIANGLES, renderingModel.vertexCount, gl.UNSIGNED_SHORT, 0)
    })
  }
}