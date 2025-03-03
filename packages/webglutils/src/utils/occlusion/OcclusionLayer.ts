//
// import {GLArrayBuf} from "../../../webgl/GLArrayBuf";
// import {math, Scene} from "../../../../viewer/index";
//
// class OcclusionLayer {
//     private scene: any;
//     private aabb: any;
//     private origin: any;
//     private originHash: any;
//     private numMarkers: number;
//     private markers: {};
//     private markerList: any[];
//     private markerIndices: {};
//     private positions: any[];
//     private indices: any[];
//     private positionsBuf: null;
//     private lenPositionsBuf: number;
//     private indicesBuf: null;
//     private sectionPlanesActive: any[];
//     private culledBySectionPlanes: boolean;
//     private occlusionTestList: any[];
//     private lenOcclusionTestList: number;
//     private pixels: any[];
//     private aabbDirty: boolean;
//     private markerListDirty: boolean;
//     private positionsDirty: boolean;
//     private occlusionTestListDirty: boolean;
//
//     constructor(scene: Scene, origin: math.FloatArrayParam) {
//
//         this.scene = scene;
//         this.aabb = math.boundaries.createAABB3();
//         this.origin = math.createVec3(origin);
//         this.originHash = this.origin.join();
//         this.numMarkers = 0;
//         this.markers = {};
//         this.markerList = [];                  // Ordered array of Markers
//         this.markerIndices = {};               // ID map of Marker indices in _markerList
//         this.positions = [];                   // Packed array of World-space marker positions
//         this.indices = [];                     // Indices corresponding to array above
//         this.positionsBuf = null;
//         this.lenPositionsBuf = 0;
//         this.indicesBuf = null;
//         this.sectionPlanesActive = [];
//         this.culledBySectionPlanes = false;
//         this.occlusionTestList = [];           // List of
//         this.lenOcclusionTestList = 0;
//         this.pixels = [];
//         this.aabbDirty = false;
//         this.markerListDirty = false;
//         this.positionsDirty = true;
//         this.occlusionTestListDirty = false;
//     }
//
//     addMarker(marker) {
//         // @ts-ignore
//         this.markers[marker.id] = marker;
//         this.markerListDirty = true;
//         this.numMarkers++;
//     }
//
//     markerWorldPosUpdated(marker: Marker) {
//         if (!this.markers[marker.id]) { // Not added
//             return;
//         }
//         const i = this.markerIndices[marker.id];
//         this.positions[i * 3 + 0] = marker.worldPos[0];
//         this.positions[i * 3 + 1] = marker.worldPos[1];
//         this.positions[i * 3 + 2] = marker.worldPos[2];
//         this.positionsDirty = true; // TODO: avoid reallocating VBO each time
//     }
//
//     removeMarker(marker: Marker) {
//         delete this.markers[marker.id];
//         this.markerListDirty = true;
//         this.numMarkers--;
//     }
//
//     update() {
//         if (this.markerListDirty) {
//             this._buildMarkerList();
//             this.markerListDirty = false;
//             this.positionsDirty = true;
//             this.occlusionTestListDirty = true;
//         }
//         if (this.positionsDirty) { //////////////  TODO: Don't rebuild this when positions change, very wasteful
//             this._buildPositions();
//             this.positionsDirty = false;
//             this.aabbDirty = true;
//             this.vbosDirty = true;
//         }
//         if (this.aabbDirty) {
//             this._buildAABB();
//             this.aabbDirty = false;
//         }
//         if (this.vbosDirty) {
//             this._buildVBOs();
//             this.vbosDirty = false;
//         }
//         if (this.occlusionTestListDirty) {
//             this._buildOcclusionTestList();
//         }
//         this.#updateActiveSectionPlanes();
//     }
//
//     _buildMarkerList() {
//         this.numMarkers = 0;
//         for (var id in this.markers) {
//             if (this.markers.hasOwnProperty(id)) {
//                 this.markerList[this.numMarkers] = this.markers[id];
//                 this.markerIndices[id] = this.numMarkers;
//                 this.numMarkers++;
//             }
//         }
//         this.markerList.length = this.numMarkers;
//     }
//
//     _buildPositions() {
//         let j = 0;
//         for (let i = 0; i < this.numMarkers; i++) {
//             if (this.markerList[i]) {
//                 const marker = this.markerList[i];
//                 const worldPos = marker.worldPos;
//                 this.positions[j++] = worldPos[0];
//                 this.positions[j++] = worldPos[1];
//                 this.positions[j++] = worldPos[2];
//                 this.indices[i] = i;
//             }
//         }
//         this.positions.length = this.numMarkers * 3;
//         this.indices.length = this.numMarkers;
//     }
//
//     _buildAABB() {
//         const aabb = this.aabb;
//         math.boundaries.collapseAABB3(aabb);
//         math.boundaries.expandAABB3Points3(aabb, this.positions);
//         const origin = this.origin;
//         aabb[0] += origin[0];
//         aabb[1] += origin[1];
//         aabb[2] += origin[2];
//         aabb[3] += origin[0];
//         aabb[4] += origin[1];
//         aabb[5] += origin[2];
//     }
//
//     _buildVBOs() {
//         if (this.positionsBuf) {
//             if (this.lenPositionsBuf === this.positions.length) { // Just updating buffer elements, don't need to reallocate
//                 this.positionsBuf.setData(this.positions); // Indices don't need updating
//                 return;
//             }
//             this.positionsBuf.destroy();
//             this.positionsBuf = null;
//             this.indicesBuf.destroy();
//             this.indicesBuf = null;
//         }
//         const gl = this.scene.canvas.gl;
//         const lenPositions = this.numMarkers * 3;
//         const lenIndices = this.numMarkers;
//         this.positionsBuf = new GLArrayBuf(gl, gl.ARRAY_BUFFER, new Float32Array(this.positions), lenPositions, 3, gl.STATIC_DRAW);
//         this.indicesBuf = new GLArrayBuf(gl, gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), lenIndices, 1, gl.STATIC_DRAW);
//         this.lenPositionsBuf = this.positions.length;
//     }
//
//     _buildOcclusionTestList() {
//         const canvas = this.scene.canvas;
//         const near = this.scene.camera.perspective.near; // Assume near enough to ortho near
//         const boundary = canvas.boundary;
//         const canvasWidth = boundary[2];
//         const canvasHeight = boundary[3];
//         let lenPixels = 0;
//         this.lenOcclusionTestList = 0;
//         for (let i = 0; i < this.numMarkers; i++) {
//             const marker = this.markerList[i];
//             const viewPos = marker.viewPos;
//             if (viewPos[2] > -near) { // Clipped by near plane
//                 marker._setVisible(false);
//                 continue;
//             }
//             const canvasPos = marker.canvasPos;
//             const canvasX = canvasPos[0];
//             const canvasY = canvasPos[1];
//             if ((canvasX + 10) < 0 || (canvasY + 10) < 0 || (canvasX - 10) > canvasWidth || (canvasY - 10) > canvasHeight) {
//                 marker._setVisible(false);
//                 continue;
//             }
//             if (marker.entity && !marker.entity.visible) {
//                 marker._setVisible(false);
//                 continue;
//             }
//             if (marker.occludable) {
//                 this.occlusionTestList[this.lenOcclusionTestList++] = marker;
//                 this.pixels[lenPixels++] = canvasX;
//                 this.pixels[lenPixels++] = canvasY;
//                 continue;
//             }
//             marker._setVisible(true);
//         }
//     }
//
//     #updateActiveSectionPlanes() {
//         const sectionPlanes = this.scene.#sectionPlanesState.sectionPlanes;
//         const numSectionPlanes = sectionPlanes.length;
//         if (numSectionPlanes > 0) {
//             for (let i = 0; i < numSectionPlanes; i++) {
//                 const sectionPlane = sectionPlanes[i];
//                 if (!sectionPlane.active) {
//                     this.sectionPlanesActive[i] = false;
//                 } else {
//                     const intersect = math.planeAABB3Intersect(sectionPlane.dir, sectionPlane.dist, this.aabb);
//                     const outside = (intersect === -1);
//                     if (outside) {
//                         this.culledBySectionPlanes = true;
//                         return;
//                     }
//                     const intersecting = (intersect === 0);
//                     this.sectionPlanesActive[i] = intersecting;
//                 }
//             }
//         }
//         this.culledBySectionPlanes = false;
//     }
//
//     destroy() {
//         this.markers = {};
//         this.markerList.length = 0;
//         if (this.positionsBuf) {
//             this.positionsBuf.destroy();
//         }
//         if (this.indicesBuf) {
//             this.indicesBuf.destroy();
//         }
//     }
// }
//
//
// export {OcclusionLayer};