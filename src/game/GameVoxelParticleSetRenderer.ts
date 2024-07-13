import { VoxelParticleSetRenderer } from "../engine/rendering/VoxelParticleSetRenderer"
import { ModelType } from "./startup"
import { GameObjectType } from "./GameScene"
import { AbstractLightingModel } from "../engine/rendering/lightingModels/AbstractLightingModel"
import { GetRotationFunc } from "./GameSceneRenderer"
import { mat4 } from "gl-matrix"
import { VoxelParticleSet } from "../engine/rendering/VoxelParticleSet"

export class GameVoxelParticleSetRenderer extends VoxelParticleSetRenderer<ModelType,GameObjectType> {
  constructor(gl:WebGL2RenderingContext, lightingModel: AbstractLightingModel, private getRotationFunc: GetRotationFunc) {
    super(gl, lightingModel)
  }

  public override getPreTranslateRotationMatrix(_: VoxelParticleSet) {
    return mat4.rotateY(mat4.create(), mat4.create(), 0.0)
  }

  public override getPostTranslateRotationMatrix(_: VoxelParticleSet) {
    return mat4.rotateY(mat4.create(), mat4.create(), this.getRotationFunc())
  }
}