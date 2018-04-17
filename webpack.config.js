const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  devtool: 'source-map',
  context: path.join(__dirname),
  entry: {
    javascript: './example/app.jsx'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'appbundle.js'
  },
  resolve: {
    extensions: ['.js', '.jsx', '']
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'React Frame Component Simple Example',
      template: './example/index.html'
    })
  ],
  module: {
    loaders: [
      { test: /\.js(x|)/, loaders: ['babel-loader'], exclude: /node_modules/ }
    ]
  }
};
