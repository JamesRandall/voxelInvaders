import { GameSprite } from "./GameSprite"
import { GameObjectType, GameScene } from "./GameScene"
import { ModelType } from "./startup"
import { AxisAlignedBox } from "../engine/models/AxisAlignedBox"
import { Voxel } from "../engine/models/Voxel"
import { Explosion } from "./Explosion"
import { VoxelModel } from "../engine/models/VoxelModel"

export class Shields {
  constructor(gl: WebGL2RenderingContext, scene:GameScene, invaderRowWidth:number) {
    const model = scene.resources.getModel(ModelType.Shield)!
    let shieldX = -Math.floor(invaderRowWidth/2)
    let totalSpace = invaderRowWidth-(4*model.width)
    let space = Math.floor(totalSpace/3)
    for(let i = 0; i < 4; i++) {
      const sprite = new GameSprite(
        [model],
        [shieldX,-46,0],
        { isDestructible: true, gl }
      )
      sprite.type = GameObjectType.Shield
      scene.addSprite(sprite)
      shieldX += sprite.currentFrame.width + space
    }
  }

  public handlePlayerBulletCollision(gl:WebGL2RenderingContext, scene:GameScene, shield:GameSprite, intersection: AxisAlignedBox) {
    const boundingBox = shield.getBoundingBox()
    shield.mutateCurrentFrame(gl, mutation => {
      const x = intersection.min[0]-boundingBox.min[0]
      const y = intersection.min[1]-boundingBox.min[1]
      for(let z=0; z < shield.currentFrame.depth; z++) {
        mutation.removeVoxel(x, y, z)
      }
    })
  }

  // needs simplifying, its late!
  public handleInvaderBulletCollision(gl:WebGL2RenderingContext, scene:GameScene, shield:GameSprite, intersection: AxisAlignedBox) {
    shield.mutateCurrentFrame(gl, mutation => {
      const startX = Math.max(0, intersection.min[0]-shield.position[0]-1)
      const endX = Math.min(shield.currentFrame.width-1,startX+2)
      const endY = intersection.min[1]-shield.position[1]
      const startY = Math.max(0,endY-2)
      console.log(`startX: ${startX}, endX: ${endX}, startY: ${startY}, endY: ${endY}`)

      const width = endX-startX
      const height = endY-startY
      const depth = shield.currentFrame.depth

      let voxels: (Voxel|null)[][][] = []

      for(let z=0; z < shield.currentFrame.depth; z++) {
        let zVoxels: (Voxel|null)[][] = []
        voxels.push(zVoxels)
        for(let y= startY; y <= endY; y++) {
          let yVoxels: (Voxel|null)[] = []
          zVoxels.push(yVoxels)
          for (let x = startX; x <= endX; x++) {
            let voxel = mutation.voxels[z][y][x]
            if (voxel !== null) {
              mutation.removeVoxel(x, y, z)
              yVoxels.push(new Voxel(voxel.color))
            }
            else {
              yVoxels.push(null)
            }
          }
        }
      }

      const model = new VoxelModel(ModelType.ShieldExplostion, width, height, depth, voxels)
      for(let explosionCount=0; explosionCount < 4; explosionCount++) {
        scene.addParticleSet(Explosion.createFromModel(gl, model, [shield.position[0] + startX, shield.position[1] + startY, 0]))
      }
    })
  }
}