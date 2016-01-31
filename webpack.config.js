var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: {
    app: ['./app/app.js']
  },
  output: {
    path: path.resolve(__dirname, 'static'),
    publicPath: '/',
    filename: 'app.js'
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/
      },
      {
        test: /\.tag?$/,
        loader: 'tag-loader',
        exclude: /(node_modules)/,
        query: {
          type: 'babel'
        }
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    })
  ]
}
