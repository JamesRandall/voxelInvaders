import { mount } from "../engine/Engine"
import { GameScene } from "./GameScene"
import { VoxelModel } from "../engine/models/VoxelModel"
import { Voxel } from "../engine/models/Voxel"
import { VoxelColor } from "../engine/models/VoxelColor"

export enum ModelType {
  InvaderFrame1,
  InvaderFrame2,
  Player,
  Bullet,
  Shield
}

function createBullet() {
  return new VoxelModel(ModelType.Bullet, 1, 1, 1, [
    [
      [
        new Voxel(new VoxelColor(1,1,0,1))
      ]
    ]
  ])
}

(async () => await mount({
  voxelModels: [
    { type: ModelType.InvaderFrame1, source: "invader1" },
    { type: ModelType.Player, source: "player" },
    { type: ModelType.Shield, source: "shield" },
    { type: ModelType.Bullet, source: createBullet() },
  ]
}, (_,resources) => new GameScene(resources)))()