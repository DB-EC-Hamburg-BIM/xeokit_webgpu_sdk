import type { FloatArrayParam } from "@xeokit/math";
/**
 * {@link Mesh} creation parameters for {@link @xeokit/scene!SceneModel.createMesh | SceneModel.createMesh}.
 */
export interface MeshParams {
    /**
     * ID for the new {@link Mesh}, unique within the {@link @xeokit/scene!SceneModel}.
     */
    id: string;
    /**
     * ID of a {@link TextureSet} that was created previously with {@link @xeokit/scene!SceneModel.createTextureSet | SceneModel.createTextureSet}.
     */
    textureSetId?: string;
    /**
     * ID of a {@link Geometry} that was created previously with {@link @xeokit/scene!SceneModel.createGeometry | SceneModel.createGeometry} or {@link @xeokit/scene!SceneModel.createGeometryCompressed | SceneModel.createGeometryCompressed}.
     */
    geometryId: string;
    /**
     * Optional ID of a {@link Transform} previously created with {@link @xeokit/scene!SceneModel.createTransform}.
     */
    transformId?: string;
    /**
     * RGB base color of the new {@link Mesh}.
     *
     * * Default is ````[1,1,1]````.
     */
    color?: FloatArrayParam;
    /**
     * RGB pick color of the new {@link Mesh}.
     *
     * This is used internally within {@link @xeokit/scene!SceneModel}.
     */
    pickColor?: FloatArrayParam;
    /**
     * Opacity of the new {@link Mesh}.
     *
     * Default is 1.
     */
    opacity?: number;
    /**
     * The metallic-ness of new {@link Mesh}.
     *
     * * This is a continuous factor in the range ````[0,1]````, where 0 is fully non-metallic and 1 is fully metallic.
     * * Default is 0.
     * * See [*Physically-Based Rendering*](/docs/pages/GLOSSARY.html#physically-based-rendering)
     */
    metallic?: number;
    /**
     * The roughness of new {@link Mesh}.
     *
     * * This is a continuous factor in the range ````[0,1]````, where 0 is fully rough and 1 is perfectly smooth.
     * * Default is 1.
     * * See [*Physically-Based Rendering*](/docs/pages/GLOSSARY.html#physically-based-rendering)
     */
    roughness?: number;
    /**
     * Optional local 3D translation vector.
     */
    position?: FloatArrayParam;
    /**
     * Optional local 3D scale vector.
     */
    scale?: FloatArrayParam;
    /**
     * Optional local 3D rotation quaternion.
     */
    quaternion?: FloatArrayParam;
    /**
     * Optional local 3D rotation as Euler angles given in degrees, for each of the X, Y and Z axis.
     */
    rotation?: FloatArrayParam;
    /**
     * Optional local 3D transform matrix.
     *
     * Overrides {@link MeshParams.position}, {@link MeshParams.scale}, {@link MeshParams.quaternion} and {@link MeshParams.rotation}.
     */
    matrix?: FloatArrayParam;
}
