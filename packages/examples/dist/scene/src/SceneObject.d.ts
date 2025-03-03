import type { Mesh } from "./Mesh";
import type { FloatArrayParam } from "@xeokit/math";
import type { RendererObject } from "./RendererObject";
import type { SceneModel } from "./SceneModel";
/**
 * An object in a {@link @xeokit/scene!SceneModel}.
 *
 * * Stored in {@link @xeokit/scene!SceneModel.objects | SceneModel.objects} and {@link @xeokit/scene!Scene.objects | Scene.objects}
 * * Created with {@link @xeokit/scene!SceneModel.createObject | SceneModel.createObject}
 *
 * See {@link "@xeokit/scene"} for usage.
 */
export declare class SceneObject {
    #private;
    /**
     * The {@link SceneModel} that contains this SceneObject.
     */
    readonly model: SceneModel;
    /**
     * Unique ID of this SceneObject.
     *
     * SceneObjects are stored by ID in {@link Scene.objects | Scene.objects} and {@link SceneModel.objects | SceneModel.objects}.
     */
    readonly id: string;
    /**
     * The {@link Mesh | Meshes} belonging to this SceneObject.
     */
    readonly meshes: Mesh[];
    /**
     * Optional layer ID for this SceneObject.
     */
    readonly layerId?: string;
    /**
     *  Internal interface through which a {@link SceneObject} can load property updates into a renderer.
     *
     *  This is defined while the owner {@link SceneModel} has been added to a {@link @xeokit/viewer!Viewer | Viewer}.
     *
     * @internal
     */
    rendererObject: RendererObject | null;
    /**
     * @private
     */
    constructor(cfg: {
        model: SceneModel;
        meshes: Mesh[];
        id: string;
        layerId?: string;
    });
    /**
     * Gets the axis-aligned 3D World-space boundary of this SceneObject.
     */
    get aabb(): FloatArrayParam;
    /**
     * @private
     */
    setAABBDirty(): void;
}
