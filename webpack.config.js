/*
 *  __dirname refers to the diretory where this webpack.config.js lives
 * https://julienrenaux.fr/2015/03/30/introduction-to-webpack-with-practical-examples/
 */

require('babel-polyfill');
const path = require('path');
const webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = [
  // https://github.com/webpack/webpack/issues/2764
  // http://stackoverflow.com/questions/29210325/webpack-sass-where-is-the-css-file
  // http://stackoverflow.com/questions/35637184/minify-css-from-webpacks-extracttextplugin-and-style-loader
  // http://stackoverflow.com/questions/40356445/webpack-how-to-compile-scss-into-a-separate-css-file
  // https://blog.madewithenvy.com/getting-started-with-webpack-2-ed2b86c68783#.k9j27f5vs
  // https://robinwieruch.de/react-eslint-webpack-babel/#eslintBabel
  // http://blog.brew.com.hk/getting-started-with-webpack/
  // https://www.sitepoint.com/javascript-modules-bundling-transpiling/
  // https://qconsf.com/system/files/presentation-slides/webpack-_one_build_step_to_rule_them_all.pdf
  // https://www.codementor.io/javascript/tutorial/module-bundler-webpack-getting-started-guide
  // https://www.gitbook.com/book/abhijeetnmishra/webpack-step-by-step/details
  // https://www.bensmithett.com/smarter-css-builds-with-webpack/
  // https://gist.github.com/nkbt/9efd4facb391edbf8048
  // https://robinwieruch.de/react-eslint-webpack-babel/
  // http://krasimirtsonev.com/blog/article/javascript-library-starter-using-webpack-es6
  // https://www.sitepoint.com/transpiling-es6-modules-to-amd-commonjs-using-babel-gulp/
  // http://guybedford.com/practical-workflows-for-es6-modules
  {
    name: 'scss-to-css',
    entry: {
      styles: [
       './css/scss/style.scss'
      ]
    },
    output: {
        path: path.resolve(__dirname, 'css'),
        filename: 'style.css'
    },
    module: {
      loaders: [{
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          fallback: "style-loader",
          loader: "css-loader!sass-loader",
        })
      }]
    },
    plugins: [
      new ExtractTextPlugin("style.css"),
    ],
    devtool: 'source-map'
  },
  {
    name: 'minify-css',
    entry: {
      styles: [
       './css/style.css'
      ]
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'style.min.css'
    },
    module: {
      loaders: [{ 
        test: /\.css$/, 
        loader: ExtractTextPlugin.extract({
          fallback: "style-loader",
          loader: "css-loader",
        }) 
      }]
    },
    plugins: [
      new ExtractTextPlugin("style.min.css"),
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require('cssnano'),
        cssProcessorOptions: { discardComments: {removeAll: true } },
        canPrint: true
      })
    ],
    devtool: 'source-map'
  },
  {
    name: "bundle-js",
    entry: {
      deslider: [
        // configuration for babel6
        'babel-polyfill',
        './js/main.js'
      ]
    },
    output: {
      path: path.resolve(__dirname, 'build'),  // ./build
      filename: '[name].bundle.js',
      library: 'deslider',
      libraryTarget: 'umd'
    },
    module: {
      rules: [{
        test: /\.js$/,
        loader: ['babel-loader', 'eslint-loader'],
        exclude: /node_modules/,
        // query: {
        //   presets: ['es2015']
        // }
      }]
    },
    stats: {
      colors: true
    },
    devtool: 'source-map'
  }
];
 