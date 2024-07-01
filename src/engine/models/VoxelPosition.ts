import { vec3 } from "gl-matrix"

export class VoxelPosition {
  public voxels: vec3

  constructor(x: number, y: number, z: number) {
    this.voxels = [x, y, z];
  }

  get x() { return this.voxels[0] }
  set x(v: number) { this.voxels[0] = v }
  get y() { return this.voxels[1] }
  set y(v: number) { this.voxels[1] = v }
  get z() { return this.voxels[2] }
  set z(v: number) { this.voxels[2] = v }
}