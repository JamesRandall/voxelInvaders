import { AxisAlignedBox } from "./models/AxisAlignedBox"
import { VoxelSprite } from "./models/VoxelSprite"
import { vec3 } from "gl-matrix"

export type CollisionHandler<TModelType, TWorldObjectType> = (
  gl: WebGL2RenderingContext,
  a:VoxelSprite<TModelType,TWorldObjectType>,
  b:VoxelSprite<TModelType,TWorldObjectType>,
  intersection:AxisAlignedBox) => void

// There is a LOT of scope to do work here, this is a very simple implementation.
export class Collisions<TModelType, TWorldObjectType> {
  private readonly _collisionTypes = new Map<TWorldObjectType, Map<TWorldObjectType,CollisionHandler<TModelType,TWorldObjectType>>>()

  public registerCollisionType(type:TWorldObjectType, collidesWith:TWorldObjectType|TWorldObjectType[], handler:CollisionHandler<TModelType,TWorldObjectType>) {
    if (!this._collisionTypes.has(type)) {
      this._collisionTypes.set(type, new Map())
    }
    const map = this._collisionTypes.get(type)!
    if (Array.isArray(collidesWith)) {
      collidesWith.forEach(c => map.set(c, handler))
    }
    else {
      map.set(collidesWith, handler)
    }
  }

  private broadRangeIntersection(a: VoxelSprite<TModelType, TWorldObjectType>, b: VoxelSprite<TModelType, TWorldObjectType>): AxisAlignedBox | null {
    // Assuming both sprites have a method to get their AxisAlignedBox bounding box
    const boxA = a.getBoundingBox();
    const boxB = b.getBoundingBox();

    return AxisAlignedBox.intersection(boxA, boxB)
  }

  private narrowRangeIntersection(a: VoxelSprite<TModelType, TWorldObjectType>, b: VoxelSprite<TModelType, TWorldObjectType>, broadRangeIntersection: AxisAlignedBox): AxisAlignedBox | null {
    const boxA = a.getBoundingBox();
    const boxB = b.getBoundingBox();

    let minX = null, minY = null, minZ = null, maxX = null, maxY = null, maxZ = null

    for(let z=broadRangeIntersection.min[2]; z<=broadRangeIntersection.max[2]; z++) {
      let aZ = z - boxA.min[2]
      let bZ = z - boxB.min[2]
      for (let y=broadRangeIntersection.min[1]; y<=broadRangeIntersection.max[1]; y++) {
        let aY = y - boxA.min[1]
        let bY = y - boxB.min[1]
        for (let x=broadRangeIntersection.min[0]; x<=broadRangeIntersection.max[0]; x++) {
          let aX = x - boxA.min[0]
          let bX = x - boxB.min[0]

          let voxelA = a.currentFrame.voxels[aZ][aY][aX]
          let voxelB = b.currentFrame.voxels[bZ][bY][bX]

          if (voxelA && voxelB) {
            minX = minX === null ? x : Math.min(minX, x)
            minY = minY === null ? y : Math.min(minY, y)
            minZ = minZ === null ? z : Math.min(minZ, z)
            maxX = maxX === null ? x : Math.max(maxX, x)
            maxY = maxY === null ? y : Math.max(maxY, y)
            maxZ = maxZ === null ? z : Math.max(maxZ, z)
          }
        }
      }
    }

    if (minX === null) { return null }
    return { min: [minX!, minY!, minZ!], max: [maxX!, maxY!, maxZ!]}
  }

  public evaluateCollisions(gl: WebGL2RenderingContext, sprites:ReadonlyArray<VoxelSprite<TModelType, TWorldObjectType>>) {
    if (this._collisionTypes.size === 0) { return }
    sprites.forEach(sprite => {
      if (sprite.tag === null || sprite.isRemoved) { return }
      const collisionType = this._collisionTypes.get(sprite.tag)
      if (!collisionType) { return }
      sprites.forEach(otherSprite => {
        if (otherSprite.tag === null || sprite.isRemoved) { return }
        const handler = collisionType.get(otherSprite.tag)
        if (!handler) { return }
        const broadRangeIntersection = this.broadRangeIntersection(sprite, otherSprite)
        if (broadRangeIntersection) {
          const narrowRangeIntersection = this.narrowRangeIntersection(sprite, otherSprite, broadRangeIntersection)
          if (narrowRangeIntersection) {
            handler(gl, sprite, otherSprite, narrowRangeIntersection)
          }
        }
      })
    })
  }
}