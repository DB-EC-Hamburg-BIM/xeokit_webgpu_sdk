import * as utils from "@xeokit/utils";
import type {GeometryArrays} from "./GeometryArrays";

/**
 * Creates a grid-shaped {@link @xeokit/scene!GeometryBucketHandle}.
 *
 * ## Usage
 *
 * Creating a {@link Mesh} with a GridGeometry and a {@link PhongMaterial}:
 *
 * [[Run this example](http://xeokit.github.io/xeokit-sdk/examples/#geometry_builders_buildGridGeometry)]
 *
 * ````javascript
 * import {Viewer, Mesh, buildGridGeometry, GeometryBucketHandle, PhongMaterial, Texture} from "xeokit-viewer.es.js";
 *
 * const viewer = new Viewer({
 *      canvasId: "myView"
 * });
 *
 * viewer.camera.eye = [0, 0, 5];
 * viewer.camera.look = [0, 0, 0];
 * viewer.camera.up = [0, 1, 0];
 *
 * new Mesh(viewer.scene, {
 *      geometry: new GeometryBucketHandle(viewer.scene, buildGridGeometry({
 *          size: 1000,
 *          divisions: 500
 *      })),
 *      material: new PhongMaterial(viewer.scene, {
 *          color: [0.0, 0.0, 0.0],
 *          emissive: [0.4, 0.4, 0.4]
 *      }),
 *      position: [0, -1.6, 0]
 * });
 * ````
 *
 * @function buildGridGeometry
 * @param cfg Configs
 * @param [cfg.id] Optional ID for the {@link @xeokit/scene!GeometryBucketHandle}, unique among all components in the parent {@link Scene}, generated automatically when omitted.
 * @param [cfg.size=1] Dimension on the X and Z-axis.
 * @param [cfg.divisions=1] Number of divisions on X and Z axis..
 * @returns {Object} Configuration for a {@link @xeokit/scene!GeometryBucketHandle} subtype.
 */
export function buildGridGeometry(cfg = {
    size: 1,
    divisions: 1
}): GeometryArrays  {

    let size = cfg.size || 1;
    if (size < 0) {
        console.error("negative size not allowed - will invert");
        size *= -1;
    }

    let divisions = cfg.divisions || 1;
    if (divisions < 0) {
        console.error("negative divisions not allowed - will invert");
        divisions *= -1;
    }
    if (divisions < 1) {
        divisions = 1;
    }

    size = size || 10;
    divisions = divisions || 10;

    const step = size / divisions;
    const halfSize = size / 2;

    const positions = [];
    const indices = [];
    let l = 0;

    for (let i = 0, j = 0, k = -halfSize; i <= divisions; i++, k += step) {

        positions.push(-halfSize);
        positions.push(0);
        positions.push(k);

        positions.push(halfSize);
        positions.push(0);
        positions.push(k);

        positions.push(k);
        positions.push(0);
        positions.push(-halfSize);

        positions.push(k);
        positions.push(0);
        positions.push(halfSize);

        indices.push(l++);
        indices.push(l++);
        indices.push(l++);
        indices.push(l++);
    }

    return utils.apply(cfg, {
        primitive: "lines",
        positions: positions,
        indices: indices
    });
}

