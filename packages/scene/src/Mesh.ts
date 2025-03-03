import type {FloatArrayParam} from "@xeokit/math";
import {createMat4, createVec3, identityMat4} from "@xeokit/matrix";
import type {RendererMesh} from "./RendererMesh";
import type {Geometry} from "./Geometry";
import type {TextureSet} from "./TextureSet";
import type {SceneObject} from "./SceneObject";

/**
 * A mesh in a {@link SceneModel}.
 *
 * * Stored in {@link @xeokit/scene!SceneModel.meshes | SceneModel.meshes}
 * * Created with {@link @xeokit/scene!SceneModel.createMesh | SceneModel.createMesh}
 * * Referenced by {@link @xeokit/scene!SceneModel.meshes | SceneObject.meshes}
 *
 * See {@link "@xeokit/scene"} for usage.
 */
export class Mesh {

    /**
     * Unique ID of this Mesh.
     *
     * Mesh is stored by this ID in {@link @xeokit/scene!SceneModel.meshes}.
     */
    id: string;

    /**
     * {@link @xeokit/scene!Geometry} used by this Mesh.
     */
    geometry: Geometry;

    /**
     * {@link @xeokit/scene!TextureSet} used by this Mesh.
     */
    textureSet?: TextureSet;

    /**
     *  Internal interface through which a {@link Mesh} can load property updates into a renderer.
     *
     *  This is defined when the owner {@link @xeokit/scene!SceneModel} has been added to a {@link @xeokit/viewer!Viewer | Viewer}.
     *
     * @internal
     */
    rendererMesh: RendererMesh | null;

    /**
     * The {@link @xeokit/scene!SceneObject} that uses this Mesh.
     */
    object: SceneObject | null;

    #color: FloatArrayParam;
    #matrix: FloatArrayParam;
    #metallic: number;
    #roughness: number;
    #opacity: number;

    /**
     * @private
     */
    constructor(meshParams: {
        id: string;
        geometry: Geometry;
        textureSet?: TextureSet;
        matrix?: FloatArrayParam;
        color?: FloatArrayParam;
        opacity?: number;
        roughness?: number;
        metallic?: number;
    }) {
        this.id = meshParams.id;
        this.#matrix = meshParams.matrix ? createMat4(meshParams.matrix) : identityMat4();
        this.geometry = meshParams.geometry;
        this.textureSet = meshParams.textureSet;
        this.rendererMesh = null;

        this.color = meshParams.color || createVec3([1, 1, 1]);
        this.metallic = (meshParams.metallic !== null && meshParams.metallic !== undefined) ? meshParams.metallic : 0;
        this.roughness = (meshParams.roughness !== null && meshParams.roughness !== undefined) ? meshParams.roughness : 1;
        this.opacity = (meshParams.opacity !== undefined && meshParams.opacity !== null) ? meshParams.opacity : 1.0;
    }

    /**
     * Gets the RGB color for this Mesh.
     *
     * Each element of the color is in range ````[0..1]````.
     */
    get color(): FloatArrayParam {
        return this.#color;
    }

    /**
     * Sets the RGB color for this Mesh.
     *
     * Each element of the color is in range ````[0..1]````.
     */
    set color(value: FloatArrayParam) {
        let color = this.#color;
        if (!color) {
            color = this.#color = new Float32Array(4);
            color[3] = 1;
        }
        if (value) {
            color[0] = value[0];
            color[1] = value[1];
            color[2] = value[2];
        } else {
            color[0] = 1;
            color[1] = 1;
            color[2] = 1;
        }
        if (this.rendererMesh) {
            this.rendererMesh.setColor(this.#color);
        }
    }

    /**
     * Gets this Mesh's local modeling transform matrix.
     *
     * Default value is ````[1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]````.
     *
     * @type {FloatArrayParam}
     */
    get matrix(): FloatArrayParam {
        return this.#matrix;
    }

    /**
     * Updates this Mesh's local modeling transform matrix.
     *
     * Default value is ````[1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]````.
     *
     * @type {FloatArrayParam}
     */
    set matrix(matrix: FloatArrayParam) {
        if (matrix) {
            // @ts-ignore
            this.#matrix.set(matrix);
        } else {
            identityMat4(this.#matrix);
        }
        if (this.rendererMesh) {
            this.rendererMesh.setMatrix(this.#matrix);
        }
        if (this.object) {
            this.object.setAABBDirty();
        }
    }

    /**
     * Gets this Mesh's metallic factor.
     *
     * This is in the range ````[0..1]```` and indicates how metallic this Mesh is.
     *
     * ````1```` is metal, ````0```` is non-metal.
     *
     * Default value is ````1.0````.
     */
    get metallic(): number {
        return this.#metallic;
    }

    /**
     * Sets this Mesh's metallic factor.
     *
     * This is in the range ````[0..1]```` and indicates how metallic this Mesh is.
     *
     * ````1```` is metal, ````0```` is non-metal.
     *
     * Default value is ````1.0````.
     */
    set metallic(value: number) {
        value = (value !== undefined && value !== null) ? value : 1.0;
        if (this.#metallic === value) {
            return;
        }
        this.#metallic = value;
        if (this.rendererMesh) {
            this.rendererMesh.setMetallic(this.#metallic);
        }
    }

    /**
     * Gets this Mesh's roughness factor.
     *
     * This factor is in the range ````[0..1]````, where ````0```` is fully smooth,````1```` is fully rough.
     *
     * Default value is ````1.0````.
     */
    get roughness(): number {
        return this.#roughness;
    }

    /**
     * Sets this Mesh's roughness factor.
     *
     * This factor is in the range ````[0..1]````, where ````0```` is fully smooth,````1```` is fully rough.
     *
     * Default value is ````1.0````.
     */
    set roughness(value: number) {
        value = (value !== undefined && value !== null) ? value : 1.0;
        if (this.#roughness === value) {
            return;
        }
        this.#roughness = value;
        if (this.rendererMesh) {
            this.rendererMesh.setRoughness(this.#roughness);
        }
    }

    /**
     * Gets the opacity factor for this Mesh.
     *
     * This is a factor in range ````[0..1]````.
     */
    get opacity(): number {
        return this.#opacity;
    }

    /**
     * Sets the opacity factor for this Mesh.
     *
     * This is a factor in range ````[0..1]````.
     */
    set opacity(opacity: number) {
        opacity = (opacity !== undefined && opacity !== null) ? opacity : 1.0;
        if (this.#opacity === opacity) {
            return;
        }
        this.#opacity = opacity;
        if (this.rendererMesh) {
            //       this.rendererMesh.setOpacity(this.#opacity);
        }
    }
}
