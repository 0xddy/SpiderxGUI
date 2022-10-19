const {defineConfig} = require('@vue/cli-service')
const TerserPlugin = require("terser-webpack-plugin")
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const {ElementPlusResolver} = require('unplugin-vue-components/resolvers')

module.exports = defineConfig({
    transpileDependencies: true,
    lintOnSave: false,
    // configureWebpack: (config) => {
    //     config.mode = 'production'
    //
    //     // 将每个依赖包打包成单独的js文件
    //     let optimization = {
    //         minimize: true,
    //         minimizer: [new TerserPlugin({
    //             terserOptions: {
    //                 ecma: undefined,
    //                 parse: {},
    //                 compress: true,
    //                 mangle: true, // Note `mangle.properties` is `false` by default.
    //                 module: false,
    //                 // Deprecated
    //                 output: null,
    //                 format: null,
    //                 toplevel: false,
    //                 nameCache: null,
    //                 ie8: false,
    //                 keep_classnames: undefined,
    //                 keep_fnames: false,
    //                 safari10: false,
    //             },
    //         })]
    //     }
    //
    //     // config.plugins = [
    //     //     AutoImport({
    //     //         resolvers: [ElementPlusResolver()],
    //     //     }),
    //     //     Components({
    //     //         resolvers: [ElementPlusResolver()],
    //     //     }),
    //     // ]
    //
    //     // Object.assign(config, {
    //     //     optimization
    //     // })
    // }
})
