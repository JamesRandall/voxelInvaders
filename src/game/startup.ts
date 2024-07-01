import { mount } from "../engine/engine"
import { GameScene } from "./GameScene"

(async () => await mount({
  voxelModels: [
    "invader1"
  ]
}, GameScene.create))()