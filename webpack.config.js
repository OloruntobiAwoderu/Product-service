const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  name: 'deployment',
  mode: 'production',
  entry: './src/index.ts',
  target: 'node',
  externals: [nodeExternals()],
  devtool: 'hidden-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'build'),
  },
  optimization: {
    usedExports: true,
    minimize: false
  },
};