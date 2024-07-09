import { vec3 } from "gl-matrix"
import { AxisAlignedBox } from "./AxisAlignedBox"

const zeroVelocity = vec3.create()

export class WorldObject<TWorldObjectType> {
  public velocity = vec3.fromValues(0,0,0)
  public positionConstraint : AxisAlignedBox|null = null
  private _unitMovementDelta = vec3.fromValues(0,0,0)
  public tag:TWorldObjectType|null = null

  constructor(private _position:vec3, private readonly _unitBasedMovement:boolean=true) { }

  public get position() { return this._position }

  private constrainPosition() {
    if (this.positionConstraint === null) return
    for(let index=0; index < this._position.length; index++) {
      if (this._position[index] < this.positionConstraint.min[index]) { this._position[index] = this.positionConstraint.min[index] }
      else if (this._position[index] > this.positionConstraint.max[index]) { this._position[index] = this.positionConstraint.max[index] }
    }
  }

  public moveBy(delta:vec3) {
    vec3.add(this.position,this.position,delta)
    this.constrainPosition()
  }

  public updatePosition(frameLength: number) {
    const applyUnitMovementComponent = (component:number) => {
      if (this._unitMovementDelta[component] > 1) {
        const delta = Math.floor(this._unitMovementDelta[component])
        this._position[component] += delta
        this._unitMovementDelta[component] -= delta
      }
      else if (this._unitMovementDelta[component] < -1) {
        const delta = Math.ceil(this._unitMovementDelta[component])
        this._position[component] += delta
        this._unitMovementDelta[component] -= delta
      }
    }

    if (this.velocity == zeroVelocity) { return }

    const delta = vec3.multiply(vec3.create(), this.velocity, [frameLength,frameLength,frameLength])
    if (this._unitBasedMovement) {
      vec3.add(this._unitMovementDelta, this._unitMovementDelta, delta)
      applyUnitMovementComponent(0)
      applyUnitMovementComponent(1)
      applyUnitMovementComponent(2)
    }
    else {
      vec3.add(this._position, this._position, delta)
    }
    this.constrainPosition()
  }
}