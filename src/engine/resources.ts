import { VoxelModel } from "./models/VoxelModel"
import { ShaderSource } from "./rendering/shader"
import { ResourceSpecification } from "./models/ResourceSpecification"
import { VoxEdJson } from "./voxEd/VoxEdJson"

export class Resources {
  private shaders = new Map<string,ShaderSource>()
  private voxelModels = new Map<string,VoxelModel>()

  constructor(shaders:{name:string,shaderSource:ShaderSource}[], voxelModels:{name:string, model:VoxelModel}[]) {
    shaders.forEach(s => this.shaders.set(s.name, s.shaderSource))
    voxelModels.forEach(v => this.voxelModels.set(v.name, v.model))
  }

  static async load(specification:ResourceSpecification) {
    const shaderNames = [
      "coloredVoxel"
    ]
    const loadedShaders = await Promise.all(shaderNames.map(sn => loadShaderSource(sn)))
    const loadedModels = await Promise.all(specification.voxelModels.map(vn => loadVoxelModel(vn)))

    return new Resources(loadedShaders, loadedModels)
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

async function loadVoxelModel(name:string) {
  const response = await fetch(`voxelModels/${name}.json`)
  const voxEdModel : VoxEdJson.Model  = await response.json()
  const model = VoxEdJson.createFromVoxEd(voxEdModel)
  return { name, model }
}