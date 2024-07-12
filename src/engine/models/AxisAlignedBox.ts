import { vec3 } from "gl-matrix"

export class  AxisAlignedBox {
  constructor(public readonly min: vec3,  public readonly max: vec3) { }

  public static intersection(boxA: AxisAlignedBox, boxB: AxisAlignedBox) {
    const minX = Math.max(boxA.min[0], boxB.min[0])
    const minY = Math.max(boxA.min[1], boxB.min[1])
    const minZ = Math.max(boxA.min[2], boxB.min[2])
    const maxX = Math.min(boxA.max[0], boxB.max[0])
    const maxY = Math.min(boxA.max[1], boxB.max[1])
    const maxZ = Math.min(boxA.max[2], boxB.max[2])
    if (minX <= maxX && minY <= maxY && minZ <= maxZ) {
      return new AxisAlignedBox(vec3.fromValues(minX, minY, minZ), vec3.fromValues(maxX, maxY, maxZ))
    }
    return null
  }
}
