/**
 * Gets a WebGL2 extension.
 * @param gl
 * @param name
 */
export function getExtension(gl: WebGL2RenderingContext, name: string) {
    // @ts-ignore
    if (gl._cachedExtensions === undefined) {
        // @ts-ignore
        gl._cachedExtensions = {};
    }
    // @ts-ignore
    if (gl._cachedExtensions[name] !== undefined) {
        // @ts-ignore
        return gl._cachedExtensions[name];
    }
    let extension;
    switch (name) {
        case 'WEBGL_depth_texture':
            extension = gl.getExtension('WEBGL_depth_texture') || gl.getExtension('MOZ_WEBGL_depth_texture') || gl.getExtension('WEBKIT_WEBGL_depth_texture');
            break;
        case 'EXT_texture_filter_anisotropic':
            extension = gl.getExtension('EXT_texture_filter_anisotropic') || gl.getExtension('MOZ_EXT_texture_filter_anisotropic') || gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic');
            break;
        case 'WEBGL_compressed_texture_s3tc':
            extension = gl.getExtension('WEBGL_compressed_texture_s3tc') || gl.getExtension('MOZ_WEBGL_compressed_texture_s3tc') || gl.getExtension('WEBKIT_WEBGL_compressed_texture_s3tc');
            break;
        case 'WEBGL_compressed_texture_pvrtc':
            extension = gl.getExtension('WEBGL_compressed_texture_pvrtc') || gl.getExtension('WEBKIT_WEBGL_compressed_texture_pvrtc');
            break;
        default:
            extension = gl.getExtension(name);
    }
    // @ts-ignore
    gl._cachedExtensions[name] = extension;
    return extension;
}