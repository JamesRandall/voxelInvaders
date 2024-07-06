import { vec3 } from "gl-matrix"

export class Camera {
  constructor(public position:vec3, public lookAt:vec3) { }

  public static default() {
    return new Camera([0,0,150], [0,0,0])
  }
}