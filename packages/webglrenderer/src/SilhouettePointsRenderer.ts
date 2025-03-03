import {LayerRenderer} from "./LayerRenderer";

import type {RenderContext} from "./RenderContext";

/**
 * Renders triangles in a Layer as a flat, uniformly-colored silhouette.
 * Used for X-ray, highlight and selection effects.
 */
export class SilhouettePointsRenderer extends LayerRenderer {

    constructor(renderContext: RenderContext) {
        super(renderContext);
    }

    getHash(): string {
        return this.renderContext.view.getSectionPlanesHash();
    }

    buildVertexShader(): string {
        return `${this.vertHeader}   
        
                uniform int                 renderPass;   
               
                uniform highp   mat4        viewMatrix;
                uniform highp   mat4        projMatrix;
                uniform highp   mat4        worldMatrix;
                         
                uniform mediump usampler2D  eachPrimitiveMesh;
                uniform lowp    usampler2D  eachMeshAttributes;
                                
               
                uniform mediump sampler2D   eachMeshMatrices;

                uniform highp   sampler2D   eachMeshOffset;
                uniform mediump usampler2D  positions;
                uniform highp   usampler2D  indices;
   
                
                uniform  float  logDepthBufFC;
                 
                out vec4        worldPosition;
                flat out int    meshFlags2rr;                       
                out uvec4       meshColor;
                out float       fragDepth;
                
                bool isPerspectiveMatrix(mat4 m) {
                    return (m[2][3] == - 1.0);
                }
                
                out float enableLogDepthBuf;
                    
                void main(void) {
                                   
                    int triangleIndex      = gl_VertexID / 3;
                    
                    int hPackedMeshIdIndex = (triangleIndex >> 3) & 1023;
                    int vPackedMeshIdIndex = (triangleIndex >> 3) >> 10;
                    
                    int meshIndex          = int(texelFetch(eachPrimitiveMesh, ivec2(hPackedMeshIdIndex, vPackedMeshIdIndex), 0).r);                   
                    uvec4 meshFlags        = texelFetch (eachMeshAttributes, ivec2(2, meshIndex), 0);
                    
                    if (int(meshFlags.x) != renderPass) {
                        gl_Position = vec4(3.0, 3.0, 3.0, 1.0);
                        return;
                    } 
                 
                    mat4 viewMatrix  = mat4 (texelFetch (cameraMatrices,     ivec2(0, 0), 0), texelFetch (cameraMatrices,     ivec2(1, 0), 0), texelFetch (cameraMatrices,     ivec2(2, 0), 0), texelFetch (cameraMatrices,     ivec2(3, 0), 0));
                    mat4 projMatrix  = mat4 (texelFetch (cameraMatrices,     ivec2(0, 2), 0), texelFetch (cameraMatrices,     ivec2(1, 2), 0), texelFetch (cameraMatrices,     ivec2(2, 2), 0), texelFetch (cameraMatrices,     ivec2(3, 2), 0));
                    
                    mat4 worldMatrix = mat4 (texelFetch (sceneModelRendererMatrices, ivec2(0, 0), 0), texelFetch (sceneModelRendererMatrices, ivec2(1, 0), 0), texelFetch (sceneModelRendererMatrices, ivec2(2, 0), 0), texelFetch (sceneModelRendererMatrices, ivec2(3, 0), 0));
                
                    uvec4 meshFlags2 = texelFetch (eachMeshAttributes, ivec2(3, meshIndex), 0);

                    ivec4 packedVertexBase = ivec4(texelFetch (eachMeshAttributes, ivec2(4, meshIndex), 0));
                    ivec4 packedIndexBaseOffset = ivec4(texelFetch (eachMeshAttributes, ivec2(5, meshIndex), 0));
                    int indexBaseOffset = (packedIndexBaseOffset.r << 24) + (packedIndexBaseOffset.g << 16) + (packedIndexBaseOffset.b << 8) + packedIndexBaseOffset.a;

                    int hIndex = (triangleIndex - indexBaseOffset) & 1023;
                    int vIndex = (triangleIndex - indexBaseOffset) >> 10;

                    ivec3 vertexIndices = ivec3(texelFetch(indices, ivec2(hIndex, vIndex), 0));
                    ivec3 uniqueVertexIndexes = vertexIndices + (packedVertexBase.r << 24) + (packedVertexBase.g << 16) + (packedVertexBase.b << 8) + packedVertexBase.a;

                    ivec3 indexPositionH = uniqueVertexIndexes & 1023;
                    ivec3 indexPositionV = uniqueVertexIndexes >> 10;

                    mat4 positionsDecompressMatrix = mat4 (texelFetch (eachMeshMatrices, ivec2(0, meshIndex), 0), texelFetch (eachMeshMatrices, ivec2(1, meshIndex), 0), texelFetch (eachMeshMatrices, ivec2(2, meshIndex), 0), texelFetch (eachMeshMatrices, ivec2(3, meshIndex), 0));
                    mat4 meshMatrix = mat4 (texelFetch (eachMeshMatrices, ivec2(4, meshIndex), 0), texelFetch (eachMeshMatrices, ivec2(5, meshIndex), 0), texelFetch (eachMeshMatrices, ivec2(6, meshIndex), 0), texelFetch (eachMeshMatrices, ivec2(7, meshIndex), 0));

                    _positions[0] = vec3(texelFetch(positions, ivec2(indexPositionH.r, indexPositionV.r), 0));
                    _positions[1] = vec3(texelFetch(positions, ivec2(indexPositionH.g, indexPositionV.g), 0));
                    _positions[2] = vec3(texelFetch(positions, ivec2(indexPositionH.b, indexPositionV.b), 0));
  
                    vec3  position      = _positions[gl_VertexID % 3];
                   
                    vec4  _worldPosition = worldMatrix * ((meshMatrix * positionsDecompressMatrix) * vec4(position, 1.0)); 
                    vec4  viewPosition   = viewMatrix * _worldPosition;                   
                    vec4  clipPosition   = projMatrix * viewPosition;

                    meshFlags2rr     = meshFlags2.r;                     
                    meshColor      = texelFetch (eachMeshAttributes, ivec2(0, meshIndex), 0);                          
                    fragDepth      = 1.0 + clipPosition.w;");
                    enableLogDepthBuf  = float (isPerspectiveMatrix(projMatrix));
                    worldPosition  = _worldPosition;");                                                 
                    gl_Position    = clipPosition;
                }`;
    }

    buildFragmentShader(): string {
        return `${this.fragHeader}           
                
                in int         meshFlags2rr;                 
                in uvec4       meshColor;
                in float       fragDepth;
                in float       enableLogDepthBuf;    
                in vec4        worldPosition;                      
                
                uniform vec4   colorize;      
                uniform float  logDepthBufFC;                                       
                
                ${this.fragSectionPlaneDefs}                                
                
                out vec4 outColor;            
                
                void main(void) { 
                                                   
                    ${this.fragSectionPlanesSlice}                                                                      
                
                    outColor = vec4(meshColor.rgb, colorize.a);                   
                    gl_FragDepth = enableLogDepthBuf == 0.0 ? gl_FragCoord.z : log2( fragDepth ) * logDepthBufFC * 0.5;                        
                }`;
    }
}