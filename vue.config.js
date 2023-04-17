const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
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
