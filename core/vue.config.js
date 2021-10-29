module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  configureWebpack: {
    devtool: 'source-map'
  },
  devServer: {
    host: process.env.VUE_APP_HOST,
    port: process.env.VUE_APP_PORT,
    public: process.env.VUE_APP_APP_URL,
    progress: false,
    proxy: {
      '/api': {
        target: `http://backend:${process.env.BACKEND_PORT}`,
        changeOrigin: true,
        secure:false,
        pathRewrite: {'^/api': ''},
        logLevel: 'debug'
      }
    },
    overlay: {
      warnings: true,
      errors: true
    },
    quiet: true,
    clientLogLevel: 'silent',
    watchOptions: {
      aggregateTimeout: 500,
      poll: 1000,
      ignored: /node_modules/
    }
  }
}
