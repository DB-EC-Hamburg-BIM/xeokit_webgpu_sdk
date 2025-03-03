import type {View, Viewer} from "@xeokit/viewer";
import {type GLAbstractTexture, GLDataTexture, WEBGL_INFO} from "@xeokit/webglutils";



/**
 * Provides rendering context within a WebGLRenderer.
 */
export class RenderContext {

    /**
     * The Viewer.
     */
    public viewer: Viewer;

    /**
     * The View we are rendering.
     */
    public view: View;

    /**
     * The WebGL rendering context.
     */
    public gl: WebGL2RenderingContext;

    public viewMatrixDataTexture: GLDataTexture;

    /**
     * Whether to render a quality representation for triangle surfaces.
     *
     * When ````false````, we'll render them with a fast vertex-shaded Gouraud-shaded representation, which
     * is great for zillions of objects.
     *
     * When ````true````, we'll render them at a better visual quality, using smooth, per-fragment shading
     * and a more realistic lighting model.
     */
    public pbrEnabled: boolean;

    /**
     * Whether SAO is currently enabled during the current frame.
     */
    public withSAO: boolean;

    /**
     * Whether backfaces are currently enabled during the current frame.
     */
    public backfaces: boolean;

    /**
     * The vertex winding order for what we currently consider to be a backface during current
     * frame: true == "cw", false == "ccw".
     */
    public frontface: boolean;

    /**
     * The next available texture unit to bind a {@link GLAbstractTexture} to.
     */
    public textureUnit: number;

    /**
     * Statistic that counts how many times ````gl.bindTexture()```` has been called so far within the current frame.
     */
    public bindTexture: number;

    /**
     * Indicates which pass the renderer is currently rendering.
     */
    public renderPass: number;

    /**
     * The 4x4 viewing transform matrix the renderer is currently using when rendering castsShadows.
     *
     * This sets the viewpoint to look from the point of view of each {@link DirLight}
     * or {@link PointLight} that casts a shadow.
     */
    public shadowViewMatrix: any;

    /**
     * The 4x4 viewing projection matrix the renderer is currently using when rendering shadows.
     */
    public shadowProjMatrix: any;

    /**
     * The 4x4 viewing transform matrix the renderer is currently using when rendering a ray-pick.
     *
     * This sets the viewpoint to look along the ray given to {@link Scene/pick:method"}}Scene#pick(){{/crossLink}}
     * when picking with a ray.
     */
    public pickViewMatrix: any;

    /**
     * The 4x4 orthographic projection transform matrix the renderer is currently using when rendering a ray-pick.
     */
    public pickProjMatrix: any;

    /**
     * Distance to the near clipping plane when rendering depth fragments for GPU-accelerated 3D picking.
     */
    public pickZNear: number;

    /**
     * Distance to the far clipping plane when rendering depth fragments for GPU-accelerated 3D picking.
     */
    public pickZFar: number;

    /**
     * Whether or not the renderer is currently picking invisible objects.
     */
    public pickInvisible: boolean;

    /** The current line width.
     */
    public lineWidth: number;

    /**
     * ID of the last {@link WebGLProgram} that was bound during the current frame.
     */
    public lastProgramId: number;

    /**
     * The occlusion rendering texture.
     */
    public occlusionTexture: GLAbstractTexture | null;

    constructor(viewer: Viewer, view: View, gl: WebGL2RenderingContext) {
        this.viewer = viewer;
        this.view = view;
        this.gl = gl;
        this.reset();
    }

    /**
     * Called by the renderer before each frame.
     */
    reset() {
        this.lastProgramId = -1;
        this.pbrEnabled = false;
        this.withSAO = false;
        this.backfaces = false;
        this.frontface = true;
        this.textureUnit = 0;
        this.shadowViewMatrix = null;
        this.shadowProjMatrix = null;
        this.pickViewMatrix = null;
        this.pickProjMatrix = null;
        this.pickZNear = 0.01;
        this.pickZFar = 5000;
        this.pickInvisible = false;
        this.lineWidth = 1;
        this.occlusionTexture = null;
    }

    /**
     * Gets the next available texture unit for this render
     */
    get nextTextureUnit() {
        const textureUnit = this.textureUnit;
        this.textureUnit = (this.textureUnit + 1) % WEBGL_INFO.MAX_TEXTURE_UNITS;
        return textureUnit;
    }
}
