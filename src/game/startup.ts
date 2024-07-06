import { mount } from "../engine/engine"
import { GameScene } from "./GameScene"

export enum ModelType {
  InvaderFrame1,
  InvaderFrame2,
  Player
}

(async () => await mount({
  voxelModels: [
    { type: ModelType.InvaderFrame1, source: "invader1" },
    { type: ModelType.Player, source: "player" }
  ]
}, GameScene.create))()