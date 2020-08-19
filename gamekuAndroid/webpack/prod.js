const base = require("./base");
const { merge } = require("webpack-merge");
const TerserPlugin = require("terser-webpack-plugin");
const FileManagerPlugin = require('filemanager-webpack-plugin');
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");

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
        test: /\.m?js$/,
        terserOptions: {
          output: {
            comments: false
          },
          compress: {
            drop_console: true
          }
        },
        extractComments: false
      }),
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require("cssnano"),
        cssProcessorPluginOptions: {
          preset: ["default", { discardComments: { removeAll: true } }]
        },
        canPrint: true
      })
    ],
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/](phaser)[\\/]/,
          name: 'phaser',
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
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  }
});
