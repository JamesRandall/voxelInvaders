import { VoxelSprite } from "./models/VoxelSprite"
import { Camera } from "./Camera"
import { RenderingModelProvider, ShaderProvider } from "./Resources"
import { VoxelRenderer } from "./rendering/VoxelRenderer"
import { AbstractRenderer } from "./rendering/AbstractRenderer"
import { UniformLightingModel } from "./rendering/lightingModels/UniformLightingModel"
import { CollisionHandler, Collisions } from "./Collisions"

export interface KeyboardHandler {
  processKeyboardInput(key: string, isPressed: boolean) : void
}

export class Scene<TModelType, TWorldObjectType> {
  private _keyboardHandlers:KeyboardHandler[] = []
  private readonly _collisions = new Collisions<TModelType, TWorldObjectType>()

  private _sprites : VoxelSprite<TModelType, TWorldObjectType>[] = []
  private _deferredSpriteAdditions : VoxelSprite<TModelType, TWorldObjectType>[]|null = null

  public view = {
    camera: Camera.default(),
    zFar: 100.0,
    zNear: 0.1
  }

  constructor() {
    window.addEventListener("keydown", e => this.keyDown(e))
    window.addEventListener("keyup", e => this.keyUp(e))
  }

  public get sprites() : ReadonlyArray<VoxelSprite<TModelType, TWorldObjectType>> { return this._sprites }

  private keyDown(e: KeyboardEvent) {
    this._keyboardHandlers.forEach(h => h.processKeyboardInput(e.key, true))
  }

  private keyUp(e: KeyboardEvent) {
    this._keyboardHandlers.forEach(h => h.processKeyboardInput(e.key, false))
  }

  public resize() {

  }

  public registerCollisionType(type:TWorldObjectType, collidesWith:TWorldObjectType|TWorldObjectType[], handler:CollisionHandler<TModelType,TWorldObjectType>) {
    this._collisions.registerCollisionType(type, collidesWith, handler)
  }

  public registerKeyboardHandler(handler:KeyboardHandler) {
    this._keyboardHandlers.push(handler)
  }

  public update(frameLength: number) : Scene<TModelType,TWorldObjectType> | null {
    // When the game update loop is in progress we defer the addition and removal of sprites
    // this allows us to avoid modifying the array of sprites while it is being iterated over or taking
    // potentially expensive copies of the sprite array
    this.beginDeferredSpriteAdditions()
    this.updateSprites(frameLength)
    this._collisions.evaluateCollisions(this.sprites)
    this.removeSpritesMarkedForRemoval()
    this.endDeferredSpriteAdditions()
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

  public addSprite(sprite:VoxelSprite<TModelType, TWorldObjectType>) {
    if (this._deferredSpriteAdditions !== null) {
      this._deferredSpriteAdditions.push(sprite)
    } else {
      this._sprites.push(sprite)
    }
  }

  public beginDeferredSpriteAdditions() {
    this._deferredSpriteAdditions = []
  }

  public endDeferredSpriteAdditions() {
    if (this._deferredSpriteAdditions === null) return
    this._sprites = this._sprites.concat(this._deferredSpriteAdditions)
    this._deferredSpriteAdditions = null
  }

  private removeSpritesMarkedForRemoval() {
    this._sprites = this._sprites.filter(s => !s.isRemoved)
  }
}

