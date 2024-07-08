import { VoxelRenderer } from "../engine/rendering/VoxelRenderer"
import { ModelType } from "./startup"
import { VoxelSprite } from "../engine/models/VoxelSprite"
import { mat4 } from "gl-matrix"

export class GameSceneRenderer extends VoxelRenderer<ModelType> {
  public override getPreTranslateRotationMatrix(sprite: VoxelSprite<ModelType>) {
    return mat4.rotateY(mat4.create(), mat4.create(), 0.0)
  }

  public override getPostTranslateRotationMatrix(sprite: VoxelSprite<ModelType>) {
    return mat4.rotateY(mat4.create(), mat4.create(), 0.2)
  }
}