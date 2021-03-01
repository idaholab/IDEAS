module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  configureWebpack: {
    devtool: 'source-map'
  },
  devServer: {
    host: process.env.VUE_APP_SERVER_HOST,
    port: process.env.VUE_APP_UI_PORT,
    progress: false
    }
}
