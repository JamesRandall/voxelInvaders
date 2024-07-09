import { vec3 } from "gl-matrix"

export interface AxisAlignedBox {
  min: vec3
  max: vec3
}