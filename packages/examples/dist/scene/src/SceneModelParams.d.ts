import type { FloatArrayParam } from "@xeokit/math";
import type { GeometryCompressedParams } from "./GeometryCompressedParams";
import type { TextureParams } from "./TextureParams";
import type { TextureSetParams } from "./TextureSetParams";
import type { MeshParams } from "./MeshParams";
import type { GeometryParams } from "./GeometryParams";
import type { SceneObjectParams } from "./SceneObjectParams";
/**
 * {@link @xeokit/scene!SceneModel | SceneModel} creation parameters for {@link Scene.createModel | Scene.createModel}.
 *
 * See {@link "@xeokit/scene"} for usage.
 */
export interface SceneModelParams {
    /**
     * Unique ID for the SceneModel.
     *
     * The SceneModel is stored with this ID in {@link Scene.models | Scene.models}
     */
    id: string;
    /**
     * 4x4 transform matrix.
     */
    matrix?: FloatArrayParam;
    /**
     * Scale of the SceneModel.
     *
     * Default is ````[1,1,1]````.
     */
    scale?: FloatArrayParam;
    /**
     * Quaternion defining the orientation of the SceneModel.
     */
    quaternion?: FloatArrayParam;
    /**
     * Orientation of the SceneModel, given as Euler angles in degrees for X, Y and Z axis.
     */
    rotation?: FloatArrayParam;
    /**
     * World-space position of the SceneModel.
     */
    position?: FloatArrayParam;
    /**
     * {@link GeometryParams} in the SceneModel.
     */
    geometries?: GeometryParams[];
    /**
     * {@link GeometryCompressedParams} in the SceneModel.
     */
    geometriesCompressed?: GeometryCompressedParams[];
    /**
     * {@link Texture | Textures} in the SceneModel.
     */
    textures?: TextureParams[];
    /**
     * {@link TextureSet | TextureSets} in the SceneModel.
     */
    textureSets?: TextureSetParams[];
    /**
     * {@link Mesh | Meshes} in the SceneModel.
     */
    meshes?: MeshParams[];
    /**
     * {@link SceneObject | SceneObjects} in the SceneModel.
     */
    objects?: SceneObjectParams[];
    /**
     * If we want to view the SceneModel with a {@link @xeokit/viewer!Viewer}, an
     * optional ID of the {@link @xeokit/viewer!ViewLayer | ViewLayer} to view the SceneModel in.
     *
     * Will be "default" by default.
     */
    layerId?: string;
}
