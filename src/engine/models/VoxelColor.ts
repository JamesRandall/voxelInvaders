import { vec4 } from "gl-matrix"

export class VoxelColor {
  public values: vec4

  constructor(r: number, g: number, b: number, a:number) {
    this.values = vec4.fromValues(r,g,b,a)
  }

  get r() { return this.values[0] }
  set r(v: number) { this.values[0] = v }
  get g() { return this.values[1] }
  set g(v: number) { this.values[1] = v }
  get b() { return this.values[2] }
  set b(v: number) { this.values[2] = v }
  get a() { return this.values[3] }
  set a(v: number) { this.values[3] = v }
}