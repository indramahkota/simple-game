const base = require("./base");
const merge = require("webpack-merge");
const TerserPlugin = require("terser-webpack-plugin");
const FileManagerPlugin = require('filemanager-webpack-plugin');

module.exports = merge(base, {
  mode: "production",
  output: {
    filename: "bundle.min.js",
    chunkFilename: '[name].min.js',
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
    ],
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/](phaser)[\\/]/,
          name: 'vendors/phaser',
          chunks: 'all',
        }
      }
    }
  },
  plugins: [
    new FileManagerPlugin({
      onEnd: {
        copy: [
          { source: 'dist', destination: '../NyusunBuku/app/src/main/assets/' }
        ]
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/i,
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
