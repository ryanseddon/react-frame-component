const webpack = require('webpack');
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
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'React Frame Component Simple Example'
    }),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  module: {
    rules: [
        // { test: /\.css$/, use: CSS_LOADERS },
        // { test: /\.scss$/, use: [...CSS_LOADERS, 'sass-loader'] },
        { test: /\.js(x|)/, use: ['babel-loader'], exclude: /node_modules/ }
    ]
  }
};
