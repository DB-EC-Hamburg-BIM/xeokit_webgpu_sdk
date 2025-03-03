const path = require('path');

module.exports = {
    transform: {
        "^.+\\.(t|j)sx?$": ["@swc/jest"],
    },
    moduleNameMapper: {

        "@xeokit/data/(.*)$": path.join(__dirname, "../data/src/$1"),
        "@xeokit/core(.*)$": path.join(__dirname, "../core/src/components$1"),
        "@xeokit/utils(.*)$": path.join(__dirname, "../core/src/utils$1"),
        "@xeokit/constants(.*)$": path.join(__dirname, "../core/src/constants$1"),
        "@xeokit/math(.*)$": path.join(__dirname, "../math/src/math$1"),
        "@xeokit/boundaries(.*)$": path.join(__dirname, "../math/src/boundaries$1"),
        "@xeokit/curves(.*)$": path.join(__dirname, "../math/src/curves$1"),
        "@xeokit/frustum(.*)$": path.join(__dirname, "../math/src/frustum$1"),
        "@xeokit/compression(.*)$": path.join(__dirname, "../math/src/compression$1"),
        "@xeokit/matrix(.*)$": path.join(__dirname, "../math/src/matrix$1"),
        "@xeokit/ray(.*)$": path.join(__dirname, "../math/src/ray$1"),
        "@xeokit/rtc(.*)$": path.join(__dirname, "../math/src/rtc$1"),

        //
        // "@xeokit/rtc": ["math/src/rtc"],
        // "@xeokit/viewer": ["viewer/src"],
        // "@xeokit/webglutils": ["webglutils/src"],
        // "@xeokit/webglrenderer": ["webglrenderer/src"],

        "@xeokit/datatypes/basicTypes": path.join(__dirname, "../datatypes/src/basicTypes"),
        "@xeokit/datatypes/ifcTypes(.*)$": path.join(__dirname, "../datatypes/src/ifcTypes"),
        //
        // "@xeokit/xkt": ["xkt/src"],
        // "@xeokit/las": ["las/src"],
        // "@xeokit/gltf": ["gltf/src"],
        // "@xeokit/locale": ["locale/src"],
        // "@xeokit/compression": ["compression/src"],
        // "@xeokit/procgen/geometry": ["procgen/src/geometry"],
        // "@xeokit/ktx2": ["ktx2/src"],
        // "@xeokit/bcf": ["bcf/src"],
        // "@xeokit/controls": ["controls/src"],
        // "@xeokit/scene": ["scene/src"],
//        "@xeokit/treeview": ["treeview/src"]
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    resolver: undefined,
    silent: false,
    testEnvironment: 'jsdom',
    testEnvironmentOptions: {
        html: '<html lang="zh-cmn-Hant"></html>',
        url: 'https://jestjs.io/',
        userAgent: 'Agent/007',
    },
};