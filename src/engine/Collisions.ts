import { AxisAlignedBox } from "./models/AxisAlignedBox"
import { VoxelSprite } from "./models/VoxelSprite"
import { vec3 } from "gl-matrix"

export type CollisionHandler<TModelType, TWorldObjectType> = (
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

  public evaluateCollisions(sprites:ReadonlyArray<VoxelSprite<TModelType, TWorldObjectType>>) {
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
          handler(sprite, otherSprite, broadRangeIntersection)
        }
      })
    })
  }
}