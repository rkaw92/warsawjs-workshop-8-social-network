'use strict';

const path = require('path');
module.exports = {
  entry: './client/index.js',
  output: {
    path: path.resolve('client'),
    filename: 'bundle.js'
  },
  devtool: 'source-map',
  module: {
    loaders: [
      { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ }
    ]
  }
}
