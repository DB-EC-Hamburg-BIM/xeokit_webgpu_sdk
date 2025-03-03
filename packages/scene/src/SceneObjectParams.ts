/**
 * {@link SceneObject} creation parameters for {@link @xeokit/scene!SceneModel.createObject | SceneModel.createObject}.
 */
export interface SceneObjectParams {

    /**
     * Unique ID for the SceneObject.
     */
    id: string;

    /**
     * IDs of meshes previously created with {@link @xeokit/scene!SceneModel.createMesh | SceneModel.createMesh}.
     */
    meshIds: string[];

    /**
     * Causes each {@link @xeokit/viewer!View} to put the corresponding {@link ViewObject} into a {@link ViewLayer} with this ID.
     *
     * When you create an object in a model, each {@link @xeokit/viewer!View} will automatically create a {@link ViewObject} to
     * represent it. When the object has a {@link SceneObjectParams.layerId} property, then each View will first ensure that it
     * has a {@link ViewLayer} with this ID, and will register the ViewObject in that ViewLayer.
     *
     * Overrides {@link SceneObjectParams.layerId}.
     */
    layerId?: string;
}