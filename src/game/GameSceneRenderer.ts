import { VoxelRenderer } from "../engine/rendering/VoxelRenderer"
import { ModelType } from "./startup"
import { VoxelSprite } from "../engine/models/VoxelSprite"
import { mat4 } from "gl-matrix"
import { RenderingModelProvider } from "../engine/Resources"
import { AbstractLightingModel } from "../engine/rendering/lightingModels/AbstractLightingModel"
import { GameObjectType } from "./GameScene"

export type GetRotationFunc = () => number

export class GameSceneRenderer extends VoxelRenderer<ModelType,GameObjectType> {
  constructor(renderingModels: RenderingModelProvider<ModelType>, lightingModel: AbstractLightingModel, private getRotationFunc: GetRotationFunc) {
    super(renderingModels, lightingModel)
  }

  public override getPreTranslateRotationMatrix(_: VoxelSprite<ModelType,GameObjectType>) {
    return mat4.rotateY(mat4.create(), mat4.create(), 0.0)
  }

  public override getPostTranslateRotationMatrix(_: VoxelSprite<ModelType,GameObjectType>) {
    return mat4.rotateY(mat4.create(), mat4.create(), this.getRotationFunc())
  }
}