import { Scene } from "../Scene";
import { AbstractRenderer } from "./AbstractRenderer"
import { AbstractLightingModel } from "./lightingModels/AbstractLightingModel"
import { VoxelSprite } from "../models/VoxelSprite"
import { mat4 } from "gl-matrix"
import { createProjectionViewMatrix } from "./coregl"
import { VoxelParticleSet } from "./VoxelParticleSet"

interface ParticleSetUniforms {
  time: WebGLUniformLocation
  particleSetPosition: WebGLUniformLocation
}

interface ParticleSetAttributes {
  startingColor: number
  endingColor: number
  startingVelocity: number
  life: number
}

export class VoxelParticleSetRenderer<TModelType, TWorldObjectType> extends AbstractRenderer<TModelType, TWorldObjectType> {
  private _uniforms : ParticleSetUniforms
  private _attributes : ParticleSetAttributes

  constructor(gl:WebGL2RenderingContext, private _lightingModel: AbstractLightingModel) {
    super()
    this._uniforms = {
      time: gl.getUniformLocation(_lightingModel.shaderProgram, "uTime")!,
      particleSetPosition: gl.getUniformLocation(_lightingModel.shaderProgram, "uParticleSetPosition")!
    }
    this._attributes = {
      startingColor: gl.getAttribLocation(_lightingModel.shaderProgram, "aStartingColor"),
      endingColor: gl.getAttribLocation(_lightingModel.shaderProgram, "aEndingColor"),
      startingVelocity: gl.getAttribLocation(_lightingModel.shaderProgram, "aStartingVelocity"),
      life: gl.getAttribLocation(_lightingModel.shaderProgram, "aLife")
    }
  }

  public override getPreTranslateRotationMatrix(particleSet: VoxelParticleSet) {
    return mat4.create()
  }

  public override getPostTranslateRotationMatrix(particleSet: VoxelParticleSet) {
    return mat4.create()
  }

  private setAttributes(gl:WebGL2RenderingContext, particleSet: VoxelParticleSet) {
    this._lightingModel.setAttributes(gl)
    this.setVertexAttribute(gl, particleSet.verticesBuffer, this._lightingModel.programInfo.attributes.position)
    this.setVertexAttribute(gl, particleSet.normalsBuffer, this._lightingModel.programInfo.attributes.normal)
    this.setTextureAttribute(gl, particleSet.textureCoordinatesBuffer, this._lightingModel.programInfo.attributes.texCoord)

    this.setInstancedColorAttribute(gl, particleSet.startingColorBuffer, this._attributes.startingColor)
    this.setInstancedColorAttribute(gl, particleSet.endingColorBuffer, this._attributes.endingColor)
    this.setInstancedVertexAttribute(gl, particleSet.startingVelocityBuffer, this._attributes.startingVelocity)
    this.setInstancedFloatAttribute(gl, particleSet.lifeBuffer, this._attributes.life)
  }

  private setUniforms(gl:WebGL2RenderingContext, scene:Scene<TModelType, TWorldObjectType>, projectionViewMatrix: mat4) {
    this._lightingModel.setUniforms(gl, scene.view.camera, projectionViewMatrix)
    gl.uniformMatrix4fv(this._lightingModel.programInfo.uniforms.projectionViewMatrix, false, projectionViewMatrix)
    gl.uniform1f(this._lightingModel.programInfo.uniforms.showOutlines, 0.0)
  }

  public render(gl: WebGL2RenderingContext, scene: Scene<TModelType, TWorldObjectType>): void {
    const width = gl.canvas.width
    const height = gl.canvas.height
    const projectionViewMatrix = createProjectionViewMatrix(width, height, scene.view.zFar, scene.view.camera.position, scene.view.camera.lookAt, scene.view.zNear)

    gl.useProgram(this._lightingModel.shaderProgram)
    this.setUniforms(gl, scene, projectionViewMatrix)

    scene.particleSets.forEach(particleSet => {
      gl.uniform1f(this._uniforms.time, particleSet.elapsedTime)
      gl.uniform3fv(this._uniforms.particleSetPosition, particleSet.position)
      const translateMatrix = mat4.translate(mat4.create(), mat4.create(), particleSet.position)
      const preTranslateRotateMatrix = this.getPreTranslateRotationMatrix(particleSet)
      const postTranslateRotateMatrix = this.getPostTranslateRotationMatrix(particleSet)
      const worldMatrix = mat4.multiply(mat4.create(),
        mat4.multiply(mat4.create(), postTranslateRotateMatrix, translateMatrix),
        preTranslateRotateMatrix
      )
      gl.uniformMatrix4fv(this._lightingModel.programInfo.uniforms.transformMatrix, false, worldMatrix)
      this.setAttributes(gl, particleSet)

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, particleSet.indicesBuffer)
      gl.drawElements(gl.TRIANGLES, particleSet.vertexCount, gl.UNSIGNED_SHORT, 0)
      gl.drawElementsInstanced(gl.TRIANGLES, particleSet.vertexCount, gl.UNSIGNED_SHORT, 0, particleSet.numberOfParticles)
    })
  }
}