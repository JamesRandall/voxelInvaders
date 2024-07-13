import { Scene } from "../Scene"
import { VoxelSprite } from "../models/VoxelSprite"
import { mat4 } from "gl-matrix"
import { ModelType } from "../../game/startup"
import { GameObjectType } from "../../game/GameScene"
import { VoxelParticleSet } from "./VoxelParticleSet"

export abstract class AbstractRenderer<TModelType, TWorldObjectType> {
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

  protected setInstancedVertexAttribute(
    gl: WebGL2RenderingContext,
    buffer: WebGLBuffer,
    position: number) {
    this.setAttribute(gl, buffer, position, gl.FLOAT, 3)
    gl.vertexAttribDivisor(position, 1)
  }

  protected setColorAttribute(
    gl: WebGL2RenderingContext,
    buffer: WebGLBuffer,
    position: number) {
    this.setAttribute(gl, buffer, position, gl.FLOAT, 4)
  }

  protected setInstancedColorAttribute(
    gl: WebGL2RenderingContext,
    buffer: WebGLBuffer,
    position: number) {
    this.setAttribute(gl, buffer, position, gl.FLOAT, 4)
    gl.vertexAttribDivisor(position, 1)
  }

  protected setTextureAttribute(
    gl: WebGL2RenderingContext,
    buffer: WebGLBuffer,
    position: number
  ) {
    this.setAttribute(gl, buffer, position, gl.FLOAT, 2)
  }

  protected setInstancedFloatAttribute(
    gl: WebGL2RenderingContext,
    buffer: WebGLBuffer,
    position: number) {
    this.setAttribute(gl, buffer, position, gl.FLOAT, 1)
    gl.vertexAttribDivisor(position, 1)
  }

  public abstract render(gl: WebGL2RenderingContext, scene:Scene<TModelType, TWorldObjectType>) : void

  public abstract getPreTranslateRotationMatrix(sprite: VoxelSprite<TModelType, TWorldObjectType> | VoxelParticleSet) : mat4

  public abstract getPostTranslateRotationMatrix(sprite: VoxelSprite<TModelType,TWorldObjectType> | VoxelParticleSet) : mat4

  }
