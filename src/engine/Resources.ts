import { VoxelModel } from "./models/VoxelModel"
import { compileShaderProgram } from "./rendering/shader"
import { ResourceSpecification } from "./models/ResourceSpecification"
import { VoxEdJson } from "./voxEd/VoxEdJson"
import { createVoxelRenderingModel, VoxelRenderingModel } from "./rendering/VoxelRenderingModel"

export interface ShaderProvider {
  getShader(name:string) : WebGLProgram|null
}

export interface RenderingModelProvider<TModelType> {
  getRenderingModel(type: TModelType) : VoxelRenderingModel | null
}

export class Resources<TModelType> implements ShaderProvider, RenderingModelProvider<TModelType> {
  private shaders = new Map<string,WebGLProgram>()
  private voxelModels = new Map<TModelType,VoxelModel<TModelType>>()
  private renderingModels = new Map<TModelType, VoxelRenderingModel>()

  constructor(shaders:{name:string,shader:WebGLProgram}[], voxelModels:{type:TModelType, model:VoxelModel<TModelType>, renderingModel:VoxelRenderingModel}[]) {
    shaders.forEach(s => this.shaders.set(s.name, s.shader))
    voxelModels.forEach(v => {
      this.voxelModels.set(v.type, v.model)
      this.renderingModels.set(v.type, v.renderingModel)
    })
  }

  public getShader(name:string) {
    return this.shaders.get(name) ?? null
  }

  public getRenderingModel(type:TModelType) {
    return this.renderingModels.get(type) ?? null
  }

  public getModel(type:TModelType) {
    return this.voxelModels.get(type) ?? null
  }

  static async load<TModelType>(gl: WebGL2RenderingContext, specification:ResourceSpecification<TModelType>) {
    const shaderNames = [
      "voxel_phong",
      "voxel_uniform",
      "particle_uniform",
      "particle_phong",
    ]
    const loadedShaderSource = await Promise.all(shaderNames.map(sn => loadShaderSource(sn)))
    const loadedModels = await Promise.all(specification.voxelModels.map(vn => loadVoxelModel(gl, vn)))
    const loadedShaders = loadedShaderSource.map(s => ({
      name: s.name,
      shader: compileShaderProgram(gl, s.shaderSource)
    })).filter(s => s.shader !== null).map(s => ({name:s.name, shader:s.shader!}))

    return new Resources<TModelType>(loadedShaders, loadedModels)
  }
}

async function loadShaderSource(name: string) {
  const fragResponse = await fetch(`shaders/${name}.frag`)
  const vertResponse = await fetch(`shaders/${name}.vert`)
  return {
    name,
    shaderSource: {
      frag: await fragResponse.text(),
      vert: await vertResponse.text()
    }
  }
}

async function loadVoxelModel<TModelType>(gl: WebGL2RenderingContext, src:{type: TModelType,source:string|VoxelModel<TModelType>}) {
  if (typeof src.source === 'string') {
    const response = await fetch(`voxelModels/${src.source}.json`)
    const voxEdModel: VoxEdJson.Model = await response.json()
    const model = VoxEdJson.createFromVoxEd<TModelType>(src.type, voxEdModel)
    const renderingModel = createVoxelRenderingModel(gl, model)
    return { type: src.type, model, renderingModel }
  }
  else {
    const renderingModel = createVoxelRenderingModel(gl, src.source)
    return { type: src.type, model: src.source, renderingModel }
  }
}