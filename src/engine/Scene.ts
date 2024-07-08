import { VoxelSprite } from "./models/VoxelSprite"
import { Camera } from "./Camera"
import { RenderingModelProvider, ShaderProvider } from "./Resources"
import { VoxelRenderer } from "./rendering/VoxelRenderer"
import { AbstractRendererBase } from "./rendering/AbstractRendererBase"

export class Scene<TModelType> {
  public sprites : VoxelSprite<TModelType>[] = []
  public view = {
    camera: Camera.default(),
    zFar: 220.0,
    zNear: 180.0
  }
  private _previousTime : number|null = null

  constructor() {
    window.addEventListener("keydown", e => this.keyDown(e))
    window.addEventListener("keyup", e => this.keyDown(e))
  }

  private keyDown(e: KeyboardEvent) {
    this.processKeyboardInput(e.key, true)
  }

  private keyUp(e: KeyboardEvent) {
    this.processKeyboardInput(e.key, false)
  }

  public resize() {

  }

  public processKeyboardInput(key: string, isPressed: boolean) {

  }

  public update(now: number) : Scene<TModelType> | null {
    // This prevents a big stutter on the first frame
    if (this._previousTime === null) {
      this._previousTime = now
      return this
    }
    const frameTime = (now - this._previousTime) / 1000
    this._previousTime = now
    this.updateSprites(frameTime)
    return this
  }

  protected updateSprites(frameTime: number) {
    this.sprites.forEach(sprite => sprite.update(frameTime))
  }

  public createRenderer(gl: WebGL2RenderingContext, shaders: ShaderProvider, renderingModels: RenderingModelProvider<TModelType>)  : AbstractRendererBase<TModelType> {
    return new VoxelRenderer(gl, shaders, renderingModels)
  }
}

