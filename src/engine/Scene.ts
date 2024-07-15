import { VoxelSprite } from "./models/VoxelSprite"
import { Camera } from "./Camera"
import { RenderingModelProvider, ShaderProvider } from "./Resources"
import { VoxelRenderer } from "./rendering/VoxelRenderer"
import { AbstractRenderer } from "./rendering/AbstractRenderer"
import { UniformLightingModel } from "./rendering/lightingModels/UniformLightingModel"
import { CollisionHandler, Collisions } from "./Collisions"
import { VoxelParticleSet } from "./rendering/VoxelParticleSet"
import { VoxelParticleSetRenderer } from "./rendering/VoxelParticleSetRenderer"

export interface KeyboardHandler {
  processKeyboardInput(key: string, isPressed: boolean) : void
}

export class Scene<TModelType, TWorldObjectType> {
  private _keyboardHandlers:KeyboardHandler[] = []
  private readonly _collisions = new Collisions<TModelType, TWorldObjectType>()

  private _sprites : VoxelSprite<TModelType, TWorldObjectType>[] = []
  private _deferredSpriteAdditions : VoxelSprite<TModelType, TWorldObjectType>[]|null = null
  private _particleSets: VoxelParticleSet[] = []
  // By default the physics will update once per frame but this can be overridden
  protected physicsRefreshRate : number | null = null

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

  public get particleSets() : ReadonlyArray<VoxelParticleSet> { return this._particleSets }

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

  public update(gl: WebGL2RenderingContext, frameLength: number) : Scene<TModelType,TWorldObjectType> | null {
    let loopCount = 0
    const refreshRate = this.physicsRefreshRate ?? frameLength
    while(frameLength > 0) {
      const updateFrameLength = Math.min(frameLength,refreshRate)
      this.updateParticleSets(updateFrameLength)
      // When the game update loop is in progress we defer the addition and removal of sprites
      // this allows us to avoid modifying the array of sprites while it is being iterated over or taking
      // potentially expensive copies of the sprite array
      this.beginDeferredSpriteAdditions()
      this.updateSprites(updateFrameLength)
      this._collisions.evaluateCollisions(gl, this.sprites)
      this.removeSpritesMarkedForRemoval()
      this.endDeferredSpriteAdditions()
      frameLength -= refreshRate
      console.log("Loop count: ", loopCount++)
    }
    return this
  }

  protected updateSprites(frameLength: number) {
    this.sprites.forEach(sprite => sprite.update(frameLength))
  }

  protected updateParticleSets(frameLength: number) {
    this.particleSets.forEach(particleSet => particleSet.update(frameLength))
    this._particleSets = this._particleSets.filter(ps => ps.elapsedTime <= ps.maxLife)
  }

  public createSpriteRenderer(gl: WebGL2RenderingContext, shaders: ShaderProvider, renderingModels: RenderingModelProvider<TModelType>)  : AbstractRenderer<TModelType, TWorldObjectType> {
    const lightingModel = UniformLightingModel.createVoxelLighting(
      gl,
      shaders
    )
    return new VoxelRenderer(renderingModels, lightingModel)
  }

  public createParticleRenderer(gl: WebGL2RenderingContext, shaders: ShaderProvider) : AbstractRenderer<TModelType, TWorldObjectType> {
    const lightingModel = UniformLightingModel.createParticleLighting(
      gl,
      shaders
    )
    return new VoxelParticleSetRenderer(gl, lightingModel)
  }

  public addSprite(sprite:VoxelSprite<TModelType, TWorldObjectType>) {
    if (this._deferredSpriteAdditions !== null) {
      this._deferredSpriteAdditions.push(sprite)
    } else {
      this._sprites.push(sprite)
    }
  }

  public addParticleSet(particleSet: VoxelParticleSet) {
    this._particleSets.push(particleSet)
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

