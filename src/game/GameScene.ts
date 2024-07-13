import { Scene } from "../engine/Scene"
import { RenderingModelProvider, Resources, ShaderProvider } from "../engine/Resources"
import { ModelType } from "./startup"
import { GameSceneRenderer } from "./GameSceneRenderer"
import { AbstractRenderer } from "../engine/rendering/AbstractRenderer"
import { vec3 } from "gl-matrix"
import { PhongLightingModel } from "../engine/rendering/lightingModels/PhongLightingModel"
import { Player } from "./Player"
import { MarchingInvaders } from "./MarchingInvaders"
import { Shields } from "./Shields"
import { GameSprite } from "./GameSprite"
import { AxisAlignedBox } from "../engine/models/AxisAlignedBox"
import { VoxelParticleSetRenderer } from "../engine/rendering/VoxelParticleSetRenderer"

const maxSceneDepth = 90.0

export enum GameObjectType {
  Bullet,
  Shield,
  Player,
  Invader
}

export class GameScene extends Scene<ModelType,GameObjectType> {
  private _player:Player
  private _marchingInvaders:MarchingInvaders
  private _shields:Shields

  constructor(
    public readonly resources:Resources<ModelType>)
  {
    super()
    // closely fitting the near and far limits to the scene helps to minimise any z fighting type issues
    this.view.zFar = Math.abs(this.view.camera.position[2]) + maxSceneDepth/2
    this.view.zNear = Math.abs(this.view.camera.position[2]) - maxSceneDepth/2

    this._player = new Player(this)
    this._marchingInvaders = new MarchingInvaders(this)
    this._shields = new Shields(this, this._marchingInvaders.totalInvaderRowWidth)

    // constrain the player to the space taken up by the marching invaders
    this._player.sprite.positionConstraint = {
      min: vec3.fromValues(Math.floor(-this._marchingInvaders.totalInvaderRowWidth/2),-65,0),
      max: vec3.fromValues(Math.ceil(this._marchingInvaders.totalInvaderRowWidth/2),-65,0),
    }

    this.registerCollisionType(
      GameObjectType.Bullet,
      [GameObjectType.Invader, GameObjectType.Shield, GameObjectType.Player],
      (a,b,intersection) => this.handleBulletCollision(a,b,intersection))
  }

  private getRotation() {
    const maxRotation = 0.4
    const proportion = this._player.position[0]/(this._marchingInvaders.totalInvaderRowWidth/2.0)
    return maxRotation*proportion*-1
  }

  private createLightingModel(gl: WebGL2RenderingContext, shaders: ShaderProvider,) {
    return new PhongLightingModel(
      gl,
      shaders, {
        lightDirection: vec3.normalize(vec3.create(), [0.4,-0.4,0.4]),
        ambientLight: vec3.fromValues(0.6,0.6,0.6),
        diffuseLight: vec3.fromValues(0.6,0.6,0.6),
        specularLight: vec3.fromValues(0.5,0.5,0.5),
        shininess: 32.0
      })
  }

  public override createSpriteRenderer(
    gl: WebGL2RenderingContext,
    shaders: ShaderProvider,
    renderingModels: RenderingModelProvider<ModelType>)  : AbstractRenderer<ModelType, GameObjectType> {
    const lightingModel = this.createLightingModel(gl, shaders)
    return new GameSceneRenderer(renderingModels, lightingModel, () => this.getRotation())

    // Just to illustrate the different lighting models
    //const uniformLightingModel = new UniformLightingModel(gl, shaders)
    //return new GameSceneRenderer(renderingModels, uniformLightingModel, () => this.getRotation())
  }

  override createParticleRenderer(gl: WebGL2RenderingContext, shaders: ShaderProvider): AbstractRenderer<ModelType, GameObjectType> {
    const lightingModel = this.createLightingModel(gl, shaders)
    return super.createParticleRenderer(gl, shaders)
  }


  override update(frameLength: number) {
    super.update(frameLength)
    this._marchingInvaders.updateInvaders(this, frameLength)
    this._player.applyControlState(this)
    return this
  }

  private handleBulletCollision(sourceSprite: GameSprite, targetSprite: GameSprite, intersection:AxisAlignedBox) {
    if (targetSprite.tag === GameObjectType.Invader) {
      sourceSprite.isRemoved = true
      targetSprite.isRemoved = true
    }
  }
}