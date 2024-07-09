import { VoxelSprite } from "./models/VoxelSprite"
import { Camera } from "./Camera"
import { RenderingModelProvider, ShaderProvider } from "./Resources"
import { VoxelRenderer } from "./rendering/VoxelRenderer"
import { AbstractRenderer } from "./rendering/AbstractRenderer"
import { PhongLightingModel } from "./rendering/lightingModels/PhongLightingModel"
import { vec3 } from "gl-matrix"

export interface KeyboardHandler {
  processKeyboardInput(key: string, isPressed: boolean) : void
}

export class Scene<TModelType, TWorldObjectType> {
  private _keyboardHandlers:KeyboardHandler[] = []
  public sprites : VoxelSprite<TModelType, TWorldObjectType>[] = []
  public view = {
    camera: Camera.default(),
    zFar: 100.0,
    zNear: 0.1
  }
  private _previousTime : number|null = null
  protected frameLength : number|null = null

  constructor() {
    window.addEventListener("keydown", e => this.keyDown(e))
    window.addEventListener("keyup", e => this.keyUp(e))
  }

  private keyDown(e: KeyboardEvent) {
    this._keyboardHandlers.forEach(h => h.processKeyboardInput(e.key, true))
  }

  private keyUp(e: KeyboardEvent) {
    this._keyboardHandlers.forEach(h => h.processKeyboardInput(e.key, false))
  }

  public resize() {

  }

  public registerKeyboardHandler(handler:KeyboardHandler) {
    this._keyboardHandlers.push(handler)
  }

  public update(now: number) : Scene<TModelType,TWorldObjectType> | null {
    // This prevents a big stutter on the first frame
    if (this._previousTime === null) {
      this._previousTime = now
      return this
    }
    this.frameLength = (now - this._previousTime) / 1000
    this._previousTime = now

    this.updateSprites(this.frameLength)
    return this
  }

  protected updateSprites(frameTime: number) {
    this.sprites.forEach(sprite => sprite.update(frameTime))
  }

  public createRenderer(gl: WebGL2RenderingContext, shaders: ShaderProvider, renderingModels: RenderingModelProvider<TModelType>)  : AbstractRenderer<TModelType, TWorldObjectType> {
    const lightingModel = new PhongLightingModel(
      gl,
      shaders,
      vec3.normalize(vec3.create(), [0.4,-0.4,0.4]),
      vec3.fromValues(0.4,0.4,0.4),
      vec3.fromValues(1.0,1.0,1.0),
      vec3.fromValues(0.5,0.5,0.5),
      16.0
    )
    return new VoxelRenderer(renderingModels, lightingModel)
  }
}

