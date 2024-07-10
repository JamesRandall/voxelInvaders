import { VoxelSprite } from "./models/VoxelSprite"
import { Camera } from "./Camera"
import { RenderingModelProvider, ShaderProvider } from "./Resources"
import { VoxelRenderer } from "./rendering/VoxelRenderer"
import { AbstractRenderer } from "./rendering/AbstractRenderer"
import { PhongLightingModel } from "./rendering/lightingModels/PhongLightingModel"
import { vec3 } from "gl-matrix"
import { UniformLightingModel } from "./rendering/lightingModels/UniformLightingModel"

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

  public update(frameLength: number) : Scene<TModelType,TWorldObjectType> | null {
    this.updateSprites(frameLength)
    return this
  }

  protected updateSprites(frameLength: number) {
    this.sprites.forEach(sprite => sprite.update(frameLength))
  }

  public createRenderer(gl: WebGL2RenderingContext, shaders: ShaderProvider, renderingModels: RenderingModelProvider<TModelType>)  : AbstractRenderer<TModelType, TWorldObjectType> {
    const lightingModel = new UniformLightingModel(
      gl,
      shaders
    )
    return new VoxelRenderer(renderingModels, lightingModel)
  }
}

