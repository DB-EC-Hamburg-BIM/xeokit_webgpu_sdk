import type { FloatArrayParam } from "@xeokit/math";
import type { ViewLayer } from "./ViewLayer";
import type { SceneObject } from "@xeokit/scene";
import type { RendererViewObject } from "./RendererViewObject";
/**
 * Represents and controls the visual state of a {@link @xeokit/scene!SceneModel | SceneObject} in
 * a {@link @xeokit/viewer!View |View's} canvas.
 *
 * ## Summary
 *
 * * Stored in {@link View.objects | View.objects} and {@link ViewLayer.objects | ViewLayer.objects}
 * * Viewer automatically creates one of these in each existing {@link @xeokit/viewer!View} for each {@link @xeokit/scene!SceneModel | SceneObject} created
 * * {@link SceneObject.layerId | SceneObject.layerId} determines which of the View's {@link ViewLayer | ViewLayers} to put the ViewObject in
 *
 * ## Overview
 *
 * Every View automatically maintains within itself a ViewObject for each {@link @xeokit/scene!SceneModel | SceneObject} that exists in the {@link @xeokit/viewer!Viewer}.
 *
 * Whenever we create a SceneObject, each View will automatically create a corresponding ViewObject within itself. When
 * we destroy a SceneObject, each View will automatically destroy its corresponding ViewObject. The ViewObjects in a View
 * are therefore a manifest of the ViewerObjects in the View.
 *
 * {@link ViewLayer}.
 */
export declare class ViewObject {
    #private;
    /**
     * Unique ID of this ViewObject within {@link ViewLayer.objects}.
     */
    readonly id: string;
    /**
     * The ViewLayer to which this ViewObject belongs.
     */
    readonly layer: ViewLayer;
    /**
     * The corresponding {@link SceneObject}.
     */
    readonly sceneObject: SceneObject;
    /**
     * @private
     */
    constructor(layer: ViewLayer, sceneObject: SceneObject, rendererViewObject: RendererViewObject);
    /**
     * Gets the World-space axis-aligned 3D boundary of this ViewObject.
     */
    get aabb(): FloatArrayParam;
    /**
     * Gets if this ViewObject is visible.
     *
     * * When {@link ViewObject.visible} is ````true```` the ViewObject will be registered by {@link ViewObject.id} in {@link ViewLayer.visibleObjects}.
     * * Each ViewObject is only rendered when {@link ViewObject.visible} is ````true```` and {@link ViewObject.culled} is ````false````.
     * * Use {@link ViewLayer.setObjectsVisible} to batch-update the visibility of ViewObjects, which fires a single event for the batch.
     */
    get visible(): boolean;
    /**
     * Sets if this ViewObject is visible.
     *
     * * When {@link ViewObject.visible} is ````true```` the ViewObject will be registered by {@link ViewObject.id} in {@link ViewLayer.visibleObjects}.
     * * Each ViewObject is only rendered when {@link ViewObject.visible} is ````true```` and {@link ViewObject.culled} is ````false````.
     * * Fires an "objectVisibility" event on associated {@link ViewLayer}s.
     * * Use {@link ViewLayer.setObjectsVisible} to batch-update the visibility of ViewObjects, which fires a single event for the batch.
     */
    set visible(visible: boolean);
    /**
     * Gets if this ViewObject is X-rayed.
     *
     * * When {@link ViewObject.xrayed} is ````true```` the ViewObject will be registered by {@link ViewObject.id} in {@link ViewLayer.xrayedObjects | ViewLayer.xrayedObjects}.
     * * Use {@link ViewLayer.setObjectsXRayed} to batch-update the X-rayed state of ViewObjects.
     */
    get xrayed(): boolean;
    /**
     * Sets if this ViewObject is X-rayed.
     *
     * * When {@link ViewObject.xrayed} is ````true```` the ViewObject will be registered by {@link ViewObject.id} in {@link ViewLayer.xrayedObjects | ViewLayer.xrayedObjects}.
     * * Use {@link ViewLayer.setObjectsXRayed} to batch-update the X-rayed state of ViewObjects.
     */
    set xrayed(xrayed: boolean);
    /**
     * Gets if this ViewObject shows edges.
     */
    get edges(): boolean;
    /**
     * Sets if this ViewObject shows edges.
     */
    set edges(edges: boolean);
    /**
     * Gets if this ViewObject is highlighted.
     *
     * * When {@link ViewObject.highlighted} is ````true```` the ViewObject will be registered by {@link ViewObject.id} in {@link ViewLayer.highlightedObjects | ViewLayer.highlightedObjects}.
     * * Use {@link ViewLayer.setObjectsHighlighted} to batch-update the highlighted state of ViewObjects.
     */
    get highlighted(): boolean;
    /**
     * Sets if this ViewObject is highlighted.
     *
     * * When {@link ViewObject.highlighted} is ````true```` the ViewObject will be registered by {@link ViewObject.id} in {@link ViewLayer.highlightedObjects | ViewLayer.highlightedObjects}.
     * * Use {@link ViewLayer.setObjectsHighlighted} to batch-update the highlighted state of ViewObjects.
     */
    set highlighted(highlighted: boolean);
    /**
     * Gets if this ViewObject is selected.
     *
     * * When {@link ViewObject.selected} is ````true```` the ViewObject will be registered by {@link ViewObject.id} in {@link ViewLayer.selectedObjects | ViewLayer.selectedObjects}.
     * * Use {@link ViewLayer.setObjectsSelected} to batch-update the selected state of ViewObjects.
     */
    get selected(): boolean;
    /**
     * Sets if this ViewObject is selected.
     *
     * * When {@link ViewObject.selected} is ````true```` the ViewObject will be registered by {@link ViewObject.id} in {@link ViewLayer.selectedObjects | ViewLayer.selectedObjects}.
     * * Use {@link ViewLayer.setObjectsSelected} to batch-update the selected state of ViewObjects.
     */
    set selected(selected: boolean);
    /**
     * Gets if this ViewObject is culled.
     *
     * * The ViewObject is only rendered when {@link ViewObject.visible} is ````true```` and {@link ViewObject.culled} is ````false````.
     * * Use {@link ViewLayer.setObjectsCulled} to batch-update the culled state of ViewObjects.
     */
    get culled(): boolean;
    /**
     * Sets if this ViewObject is culled.
     *
     * * The ViewObject is only rendered when {@link ViewObject.visible} is ````true```` and {@link ViewObject.culled} is ````false````.
     * * Use {@link ViewLayer.setObjectsCulled} to batch-update the culled state of ViewObjects.
     */
    set culled(culled: boolean);
    /**
     * Gets if this ViewObject is clippable.
     *
     * * Clipping is done by the {@link SectionPlane}s in {@link ViewLayer.sectionPlanes}.
     * * Use {@link ViewLayer.setObjectsClippable} to batch-update the clippable state of ViewObjects.
     */
    get clippable(): boolean;
    /**
     * Sets if this ViewObject is clippable.
     *
     * * Clipping is done by the {@link SectionPlane}s in {@link ViewLayer.sectionPlanes}.
     * * Use {@link ViewLayer.setObjectsClippable} to batch-update the clippable state of ViewObjects.
     */
    set clippable(value: boolean);
    /**
     * Gets if this ViewObject is included in boundary calculations.
     *
     * * When ````true````, the 3D World boundaries returned by {@link ViewLayer.aabb} will include this ViewObject's boundary.
     * * The ViewObject's 3D boundary is held in {@link SceneObject.aabb}.
     * * Use {@link ViewLayer.setObjectsCollidable} to batch-update the collidable state of ViewObjects.
     */
    get collidable(): boolean;
    /**
     * Sets if this ViewObject included in boundary calculations.
     *
     * * When ````true````, the 3D World boundaries returned by {@link ViewLayer.aabb} will include this ViewObject's boundary.
     * * The ViewObject's 3D boundary is held in {@link SceneObject.aabb}.
     * * Use {@link ViewLayer.setObjectsCollidable} to batch-update the collidable state of ViewObjects.
     */
    set collidable(value: boolean);
    /**
     * Gets if this ViewObject is pickable.
     *
     * * Picking is done with {@link ViewLayer.pick}.
     * * Use {@link ViewLayer.setObjectsPickable} to batch-update the pickable state of ViewObjects.
     */
    get pickable(): boolean;
    /**
     * Sets if this ViewObject is pickable.
     *
     * * Picking is done with {@link ViewLayer.pick}.
     * * Use {@link ViewLayer.setObjectsPickable} to batch-update the pickable state of ViewObjects.
     */
    set pickable(pickable: boolean);
    /**
     * Gets the RGB colorize color for this ViewObject.
     *
     * * Multiplies by rendered fragment colors.
     * * Each element of the color is in range ````[0..1]````.
     * * Use {@link ViewLayer.setObjectsColorized} to batch-update the colorized state of ViewObjects.
     */
    get colorize(): Float32Array;
    /**
     * Sets the RGB colorize color for this ViewObject.
     *
     * * Multiplies by rendered fragment colors.
     * * Each element of the color is in range ````[0..1]````.
     * * Set to ````null```` or ````undefined```` to reset the colorize color to its default value of ````[1,1,1]````.
     * * Use {@link ViewLayer.setObjectsColorized} to batch-update the colorized state of ViewObjects.
     */
    set colorize(value: FloatArrayParam | undefined | null);
    /**
     * Gets the opacity factor for this ViewObject.
     *
     * * This is a factor in range ````[0..1]```` which multiplies by the rendered fragment alphas.
     * * Use {@link ViewLayer.setObjectsOpacity} to batch-update the opacities of ViewObjects.
     */
    get opacity(): number;
    /**
     * Sets the opacity factor for this ViewObject.
     *
     * * This is a factor in range ````[0..1]```` which multiplies by the rendered fragment alphas.
     * * Set to ````null```` or ````undefined```` to reset the opacity to its default value of ````1````.
     * * Use {@link ViewLayer.setObjectsOpacity} to batch-update the opacities of ViewObjects.
     */
    set opacity(opacity: number | undefined | null);
    /**
     * @private
     */
    _destroy(): void;
}
