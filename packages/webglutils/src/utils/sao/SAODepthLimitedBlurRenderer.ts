// import {CustomProjection, View} from "@xeokit/viewer";
// import {inverseMat4, createMat4} from "@xeokit/matrix";
// import {GLArrayBuf, GLAttribute, GLProgram, GLRenderBuffer, WEBGL_INFO} from "@xeokit/webglutils";
//
//
//
// const blurStdDev = 4;
// const blurDepthCutoff = 0.01;
// const KERNEL_RADIUS = 16;
// const sampleOffsetsVert = new Float32Array(createSampleOffsets(KERNEL_RADIUS + 1, [0, 1]));
// const sampleOffsetsHor = new Float32Array(createSampleOffsets(KERNEL_RADIUS + 1, [1, 0]));
// const sampleWeights = new Float32Array(createSampleWeights(KERNEL_RADIUS + 1, blurStdDev));
// const tempVec2a = new Float32Array(2);
//
// /**
//  * SAO implementation inspired from previous SAO work in THREE.js by ludobaka / ludobaka.github.io and bhouston
//  */
// export class SAODepthLimitedBlurRenderer {
//
//     readonly #view: View;
//     readonly #gl: WebGL2RenderingContext;
//     #program: GLProgram;
//     #programError: boolean;
//     #aPosition: GLAttribute;
//     #aUV: GLAttribute;
//     #uDepthTexture: string;
//     #uOcclusionTexture: string;
//     #uViewport: WebGLUniformLocation;
//     #uCameraNear: WebGLUniformLocation;
//     #uCameraFar: WebGLUniformLocation;
//     #uvBuf: GLArrayBuf;
//     #positionsBuf: GLArrayBuf;
//     #indicesBuf: GLArrayBuf;
//     #uDepthCutoff: WebGLUniformLocation;
//     #uSampleOffsets: WebGLUniformLocation;
//     #uSampleWeights: WebGLUniformLocation;
//     #getInverseProjectMat: any;
//
//     constructor(view: View, gl: WebGL2RenderingContext) {
//         this.#view = view;
//         this.#gl = gl;
//         this.#registerViewer();
//     }
//
//     #registerViewer() {
//         const gl = this.#gl;
//         this.#program = new GLProgram(gl, {
//             vertex: [
//                 `#version 300 es
//                 precision highp float;
//                 precision highp int;
//
//                 in vec3 aPosition;
//                 in vec2 aUV;
//                 uniform vec2 uViewport;
//                 out vec2 vUV;
//                 out vec2 vInvSize;
//                 void main () {
//                     vUV = aUV;
//                     vInvSize = 1.0 / uViewport;
//                     gl_Position = vec4(aPosition, 1.0);
//                 }`
//             ],
//             fragment: [
//                 `#version 300 es
//                 precision highp float;
//                 precision highp int;
//
//                 #define PI 3.14159265359
//                 #define PI2 6.28318530718
//                 #define EPSILON 1e-6
//
//                 #define KERNEL_RADIUS ${KERNEL_RADIUS}
//
//                 in vec2        vUV;
//                 in vec2        vInvSize;
//
//                 uniform sampler2D   uDepthTexture;
//                 uniform sampler2D   uOcclusionTexture;
//
//                 uniform float       uCameraNear;
//                 uniform float       uCameraFar;
//                 uniform float       uDepthCutoff;
//
//                 uniform vec2        uSampleOffsets[ KERNEL_RADIUS + 1 ];
//                 uniform float       uSampleWeights[ KERNEL_RADIUS + 1 ];
//
//                 const float         unpackDownscale = 255. / 256.;
//
//                 const vec3          packFactors = vec3( 256. * 256. * 256., 256. * 256.,  256. );
//                 const vec4          unpackFactors = unpackDownscale / vec4( packFactors, 1. );
//
//                 const float packUpscale = 256. / 255.;
//
//                 const float shiftRights = 1. / 256.;
//
//                 float unpackRGBAToFloat( const in vec4 v ) {
//                     return dot( floor( v * 255.0 + 0.5 ) / 255.0, unpackFactors );
//                 }
//
//                 vec4 packFloatToRGBA( const in float v ) {
//                     vec4 r = vec4( fract( v * packFactors ), v );
//                     r.yzw -= r.xyz * shiftRights;
//                     return r * packUpscale;
//                 }
//
//                 float viewZToOrthographicDepth( const in float viewZ) {
//                     return ( viewZ + uCameraNear ) / ( uCameraNear - uCameraFar );
//                 }
//
//                 float orthographicDepthToViewZ( const in float linearClipZ) {
//                     return linearClipZ * ( uCameraNear - uCameraFar ) - uCameraNear;
//                 }
//
//                 float viewZToPerspectiveDepth( const in float viewZ) {
//                     return (( uCameraNear + viewZ ) * uCameraFar ) / (( uCameraFar - uCameraNear ) * viewZ );
//                 }
//
//                 float perspectiveDepthToViewZ( const in float invClipZ) {
//                     return ( uCameraNear * uCameraFar ) / ( ( uCameraFar - uCameraNear ) * invClipZ - uCameraFar );
//                 }
//
//                 float getDepth( const in vec2 screenPosition ) {
//                     return vec4(texture(uDepthTexture, screenPosition)).r;
//                 }
//
//                 float getViewZ( const in float depth ) {
//                      return perspectiveDepthToViewZ( depth );
//                 }
//
//                 out vec4 outColor;
//
//                 void main() {
//
//                     float depth = getDepth( vUV );
//                     if( depth >= ( 1.0 - EPSILON ) ) {
//                         discard;
//                     }
//
//                     float centerViewZ = -getViewZ( depth );
//                     bool rBreak = false;
//                     bool lBreak = false;
//
//                     float weightSum = uSampleWeights[0];
//                     float occlusionSum = unpackRGBAToFloat(texture( uOcclusionTexture, vUV )) * weightSum;
//
//                     for( int i = 1; i <= KERNEL_RADIUS; i ++ ) {
//
//                         float sampleWeight = uSampleWeights[i];
//                         vec2 sampleUVOffset = uSampleOffsets[i] * vInvSize;
//
//                         vec2 sampleUV = vUV + sampleUVOffset;
//                         float viewZ = -getViewZ( getDepth( sampleUV ) );
//
//                         if( abs( viewZ - centerViewZ ) > uDepthCutoff ) {
//                             rBreak = true;
//                         }
//
//                         if( ! rBreak ) {
//                             occlusionSum += unpackRGBAToFloat(texture( uOcclusionTexture, sampleUV )) * sampleWeight;
//                             weightSum += sampleWeight;
//                         }
//
//                         sampleUV = vUV - sampleUVOffset;
//                         viewZ = -getViewZ( getDepth( sampleUV ) );
//
//                         if( abs( viewZ - centerViewZ ) > uDepthCutoff ) {
//                             lBreak = true;
//                         }
//
//                         if( ! lBreak ) {
//                             occlusionSum += unpackRGBAToFloat(texture( uOcclusionTexture, sampleUV )) * sampleWeight;
//                             weightSum += sampleWeight;
//                         }
//                     }
//
//                     outColor = packFloatToRGBA(occlusionSum / weightSum);
//                 }`
//             ]
//         });
//         if (this.#program.errors) {
//             console.error(this.#program.errors.join("\n"));
//             this.#programError = true;
//             return;
//         }
//         const uv = new Float32Array([1, 1, 0, 1, 0, 0, 1, 0]);
//         const positions = new Float32Array([1, 1, 0, -1, 1, 0, -1, -1, 0, 1, -1, 0]);
//         const indices = new Uint8Array([0, 1, 2, 0, 2, 3]);
//         this.#positionsBuf = new GLArrayBuf(gl, gl.ARRAY_BUFFER, positions, positions.length, 3, gl.STATIC_DRAW);
//         this.#uvBuf = new GLArrayBuf(gl, gl.ARRAY_BUFFER, uv, uv.length, 2, gl.STATIC_DRAW);
//         this.#indicesBuf = new GLArrayBuf(gl, gl.ELEMENT_ARRAY_BUFFER, indices, indices.length, 1, gl.STATIC_DRAW);
//         this.#program.bind();
//         this.#uViewport = this.#program.getLocation("uViewport");
//         this.#uCameraNear = this.#program.getLocation("uCameraNear");
//         this.#uCameraFar = this.#program.getLocation("uCameraFar");
//         this.#uDepthCutoff = this.#program.getLocation("uDepthCutoff");
//         // @ts-ignore
//         this.#uSampleOffsets = gl.getUniformLocation(this.#program.handle, "uSampleOffsets");
//         // @ts-ignore
//         this.#uSampleWeights = gl.getUniformLocation(this.#program.handle, "uSampleWeights");
//         this.#aPosition = this.#program.getAttribute("aPosition");
//         this.#aUV = this.#program.getAttribute("aUV");
//         this.#uDepthTexture = "uDepthTexture";
//         this.#uOcclusionTexture = "uOcclusionTexture";
//     }
//
//     render(depthRenderBuffer: GLRenderBuffer, occlusionRenderBuffer: GLRenderBuffer, direction: number) {
//         if (this.#programError) {
//             return;
//         }
//         if (!this.#getInverseProjectMat) { // HACK: scene.camera not defined until render time
//             this.#getInverseProjectMat = (() => {
//                 let projMatDirty = true;
//                 this.#view.camera.onProjMatrix.subscribe(()=> {
//                     projMatDirty = true;
//                 });
//                 const inverseProjectMat = createMat4();
//                 return () => {
//                     if (projMatDirty) {
//                         inverseMat4(view.camera.projMatrix, inverseProjectMat);
//                     }
//                     return inverseProjectMat;
//                 }
//             })();
//         }
//         const gl = this.#gl;
//         const program = this.#program;
//         const view = this.#view;
//         const viewportWidth = gl.drawingBufferWidth;
//         const viewportHeight = gl.drawingBufferHeight;
//         const project = view.camera.project;
//         let near = 0.1;
//         let far = 10000;
//         if (!(project instanceof CustomProjection)) {
//             near = project.near;
//             far = project.far;
//         }
//         gl.viewport(0, 0, viewportWidth, viewportHeight);
//         gl.clearColor(0, 0, 0, 1);
//         gl.enable(gl.DEPTH_TEST);
//         gl.disable(gl.BLEND);
//         gl.frontFace(gl.CCW);
//         gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
//         program.bind();
//         tempVec2a[0] = viewportWidth;
//         tempVec2a[1] = viewportHeight;
//         gl.uniform2fv(this.#uViewport, tempVec2a);
//         gl.uniform1f(this.#uCameraNear, near);
//         gl.uniform1f(this.#uCameraFar, far);
//         gl.uniform1f(this.#uDepthCutoff, blurDepthCutoff);
//         if (direction === 0) {// Horizontal
//             gl.uniform2fv(this.#uSampleOffsets, sampleOffsetsHor);
//         } else { // Vertical
//             gl.uniform2fv(this.#uSampleOffsets, sampleOffsetsVert);
//         }
//         gl.uniform1fv(this.#uSampleWeights, sampleWeights);
//         const depthTexture = WEBGL_INFO.SUPPORTED_EXTENSIONS["WEBGL_depth_texture"]
//             ? depthRenderBuffer.getDepthTexture()
//             : depthRenderBuffer.getTexture();
//         const occlusionTexture = occlusionRenderBuffer.getTexture();
//         // program.bindTexture(this.#uDepthTexture, depthTexture, 0);
//         // program.bindTexture(this.#uOcclusionTexture, occlusionTexture, 1);
//         this.#aUV.bindArrayBuffer(this.#uvBuf);
//         this.#aPosition.bindArrayBuffer(this.#positionsBuf);
//         this.#indicesBuf.bind();
//         gl.drawElements(gl.TRIANGLES, this.#indicesBuf.numItems, this.#indicesBuf.itemType, 0);
//     }
//
//     destroy() {
//         this.#program.destroy();
//     }
// }
//
// function createSampleWeights(kernelRadius: number, stdDev: number): number[] {
//     const weights = [];
//     for (let i = 0; i <= kernelRadius; i++) {
//         weights.push(gaussian(i, stdDev));
//     }
//     return weights; // TODO: Optimize
// }
//
// function gaussian(x: number, stdDev: number): number {
//     return Math.exp(-(x * x) / (2.0 * (stdDev * stdDev))) / (Math.sqrt(2.0 * Math.PI) * stdDev);
// }
//
// function createSampleOffsets(kernelRadius: number, uvIncrement: number[]): number[] {
//     const offsets = [];
//     for (let i = 0; i <= kernelRadius; i++) {
//         offsets.push(uvIncrement[0] * i);
//         offsets.push(uvIncrement[1] * i);
//     }
//     return offsets;
// }
//
