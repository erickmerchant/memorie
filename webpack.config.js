var path = require('path')

module.exports = {
  entry: {
    app: ['./js/main.js']
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    publicPath: '/',
    filename: 'app.js'
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/
      },
      {
        test: /\.tag?$/,
        loader: 'tag-loader',
        exclude: /(node_modules|bower_components)/,
        query: {
          type: 'babel'
        }
      }
    ]
  }
}
