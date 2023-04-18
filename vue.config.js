const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      fallback: {
        "path": require.resolve("path-browserify"),
      }
    }
  },
  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload.ts',
      builderOptions: {
        appId: "cn.alexsunday.cropper",
        productName: "cropper",
        win: {
          icon: "./src/assets/logo.png"
        }
      }
    }
  }
})
