const merge = require("webpack-merge");
const base = require("./base");
const TerserPlugin = require("terser-webpack-plugin");
const FileManagerPlugin = require('filemanager-webpack-plugin');

module.exports = merge(base, {
  mode: "production",
  output: {
    filename: "bundle.min.js"
  },
  devtool: false,
  performance: {
    maxEntrypointSize: 900000,
    maxAssetSize: 900000
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ]
  },
  plugins: [
    new FileManagerPlugin({
      onEnd: {
        copy: [
          { source: 'dist', destination: '../NyusunBuku/app/src/main/assets/' }
        ]
      }
  })],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          }
        }
      }
    ]
  },
});
