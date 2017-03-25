var path = require('path');

var webpack = require('webpack');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var path = require('path');
var env = require('yargs').argv.mode;

var libraryName = 'Deslider';

const ExtractTextPlugin = require('extract-text-webpack-plugin');
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

var plugins = [];

var outputFile;

if (env === 'build') {
  plugins.push(new UglifyJsPlugin({ minimize: true }));
  outputFile = libraryName + '.min.js';

  plugins.push(new ExtractTextPlugin("../css/style.min.css"));

  plugins.push(new OptimizeCssAssetsPlugin({
      //assetNameRegExp: /\.min\.css$/,
      // default is /\.css$/g
      cssProcessorOptions: { discardComments: { removeAll: true } }
  }));
} else {
  plugins.push(new ExtractTextPlugin("../css/style.css"));
  outputFile = libraryName + '.js';
}

var config = {
  watch: true,
  entry: [ __dirname + '/src/main.js' ],
  devtool: 'source-map',
  output: {
    path: __dirname + '/lib',
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd'
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'jshint-loader'
      }
    ],
    loaders: [
      {
        test: /(\.jsx|\.js)$/,
        loader: "babel!eslint-loader",
        exclude: /(node_modules|bower_components)/
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader!autoprefixer-loader")
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader!autoprefixer-loader!sass-loader")
      },
    ]
  },
  resolve: {
    // root: path.resolve('./src'),
    extensions: ['', '.js']
  },
  plugins: plugins
};

module.exports = config;

/*
 *  __dirname refers to the diretory where this webpack.config.js lives
 * https://julienrenaux.fr/2015/03/30/introduction-to-webpack-with-practical-examples/
 */
/*

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
 
*/