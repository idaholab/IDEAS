// Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

const webpack = require('webpack');

// Load .env variables
const EnvironmentPluginConfig = new webpack.DefinePlugin({
    'process.env.HOST': JSON.stringify(process.env.HOST),
    'process.env.EXPRESS_PORT': JSON.stringify(process.env.EXPRESS_PORT),
    'process.env.WEBPACK_HOST': JSON.stringify(process.env.WEBPACK_HOST),
    'process.env.WEBPACK_PORT': JSON.stringify(process.env.WEBPACK_PORT),
    'STATIC_ASSETS_PATH': JSON.stringify(process.env.STATIC_ASSETS_PATH)
  });

// Webpack Config
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

const HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
    template: __dirname + '/src/index.html',
    filename: 'index.html',
    inject: 'body'
});

// Vue Config
const VueLoaderPluginConfig = new VueLoaderPlugin();

module.exports = {
    entry: [__dirname + '/src/main.js'],
    mode: 'development',
    devtool: 'eval-source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                }
            },
            {
                test: /\.vue$/,
                use: {
                    loader: "vue-loader",
                }
            },
            { 
                test: /\.xml$/, 
                use: {
                    loader: 'xml-loader',
                }
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: {
                    loader: 'file-loader',
                  }
            },
            {
                test: /\.css$/,
                use: {
                    loader: "css-loader",
                }
            },
            {
                test: /\.s(c|a)ss$/,
                use: [
                  'vue-style-loader',
                  'css-loader',
                  {
                    loader: 'sass-loader',
                    // Requires sass-loader@^7.0.0
                    options: {
                      implementation: require('sass'),
                      indentedSyntax: true // optional
                    },
                    // Requires sass-loader@^8.0.0
                    options: {
                      implementation: require('sass'),
                      sassOptions: {
                        indentedSyntax: true // optional
                      },
                    },
                    },
                ]
            },
        ]},
    output: {
        filename: 'index.js',
        path: __dirname + '/dist'
    },
    plugins: [HTMLWebpackPluginConfig, VueLoaderPluginConfig, EnvironmentPluginConfig],
    resolve: {
        alias: {
            vue$: "vue/dist/vue.runtime.esm.js"
        },
        extensions: ["*", ".js", ".vue", ".json"],
    },
    devServer: {
        contentBase: __dirname + '/dist',
        compress: true,
        host: process.env.WEBPACK_HOST,
        port: process.env.WEBPACK_PORT,
        watchOptions: {
            aggregateTimeout: 500, 
            poll: 1000,
            ignored: /node_modules/
        }
      }
}