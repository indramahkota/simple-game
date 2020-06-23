const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

/* 
  pada rule test: menggunakan regex untuk mencari file di directori
*/

module.exports = {
  entry: {
    index: './src/index.js'
  },
  mode: "development",
  devtool: "eval-source-map",
  module: {
    rules: [
      {
        test: /\.css$/i,
        include: /styles/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: [/\.vert$/i, /\.frag$/i],
        use: "raw-loader"
      },
      {
        test: /\.(gif|png|jpe?g|svg|xml|fnt|mp3|ogg|)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/[contenthash].[ext]',
            },
          },
        ],
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true)
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html"
    })
  ]
};
