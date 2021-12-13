const HtmlWebpackPlugin = require('html-webpack-plugin');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const webpack = require('webpack');
const path = require('path');

const MODE = 'production';

module.exports = {
  entry: path.resolve(__dirname, '../../src/client/index.js'),
  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].bundle.js',
    path: path.resolve(__dirname, '../../dist/client/'),
  },
  watch: false,
  mode: MODE,
	plugins: [
		new NodePolyfillPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'foo': JSON.stringify('bar')
      }
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../../src/webpackTemplate/index.html')
    })
	],
  module : {
    rules : [

      // ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
      // js rules
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          // Babel
          {
            loader : 'babel-loader',
            options: {
              presets: [[
                '@babel/preset-env',
                { targets: { 'browsers': [ 'Chrome >= 59' ] }} // prevents transpiling of async and co
              ]]
            }
          },
          // ifdef
          {
            loader: "ifdef-loader",
            options: {
              IS_DEVELOPMENT: false,
              IS_STAGING: true,
              IS_PRODUCTION: false
            }
          }
        ],
      },

      // ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
      // css rules
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { url: false }}
        ],
      },

      // ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
      // fonts files
      {
        test: /\.(png|jpg|jpeg|woff|woff2|eot|ttf|svg)$/,
        use: [{
          loader: 'url-loader',
          options: { limit: 100000 }
        }]
      }
    ]
  }
};
