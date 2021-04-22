module.exports = {
  transpileDependencies: [
    'vuetify'
  ],  
  devServer: {
    host: process.env.VUE_APP_UI_HOST,
    port: process.env.VUE_APP_UI_PORT,
    progress: false,
    watchOptions: {
      aggregateTimeout: 500, 
      poll: 1000,
      ignored: /node_modules/
    }
  }
}
