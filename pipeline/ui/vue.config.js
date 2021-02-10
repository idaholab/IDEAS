module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  configureWebpack: {
    devtool: 'source-map'
  },
  devServer: {
    host: process.env.PIPELINE_HOST,
    port: process.env.PIPELINE_PORT,
    progress: false
    }
}
