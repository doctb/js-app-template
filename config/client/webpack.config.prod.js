const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, '../../src/client/index.js'),
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, '../../dist/client/'),
  },
  watch: false,
  mode: 'production',
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
              IS_STAGING: false,
              IS_PRODUCTION: true
            }
          }
        ],
      },

      // ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
      // css rules
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
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
