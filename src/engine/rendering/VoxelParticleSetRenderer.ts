import { Scene } from "../Scene";
import { AbstractRenderer } from "./AbstractRenderer"
import { AbstractLightingModel } from "./lightingModels/AbstractLightingModel"

export class VoxelParticleSetRenderer<TModelType, TWorldObjectType> extends AbstractRenderer<TModelType, TWorldObjectType> {
    constructor(private _lightingModel: AbstractLightingModel) {
        super()
    }

    public render(gl: WebGL2RenderingContext, scene: Scene<TModelType, TWorldObjectType>): void {

    }
}