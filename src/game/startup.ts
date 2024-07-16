import { mount } from "../engine/Engine"
import { GameScene } from "./GameScene"
import { VoxelModel } from "../engine/models/VoxelModel"
import { VoxelColor } from "../engine/models/VoxelColor"

export enum ModelType {
  Invader1,
  Invader2,
  Invader3,
  Invader4,
  Player,
  PlayerBullet,
  InvaderBullet,
  Shield,
  ShieldExplostion,
}

function createPlayerBullet() {
  return VoxelModel.fill(ModelType.PlayerBullet, 1, 1, 4, new VoxelColor(1,1,1,1))
}

function createInvaderBullet() {
  return VoxelModel.fill(ModelType.InvaderBullet, 1, 4, 4, new VoxelColor(1,0,0,1))
}

(async () => await mount({
  voxelModels: [
    { type: ModelType.Invader1, source: "invader1" },
    { type: ModelType.Invader2, source: "invader2" },
    { type: ModelType.Invader3, source: "invader3" },
    { type: ModelType.Invader4, source: "invader4" },
    { type: ModelType.Player, source: "player" },
    { type: ModelType.Shield, source: "shield" },
    { type: ModelType.PlayerBullet, source: createPlayerBullet() },
    { type: ModelType.InvaderBullet, source: createInvaderBullet() },
  ]
}, (gl,resources) => new GameScene(gl, resources)))()