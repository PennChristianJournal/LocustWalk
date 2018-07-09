const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const nconf = require('./config/config.js');
nconf.set('APP_ENV', 'browser');

module.exports = {
  mode: nconf.get('NODE_ENV'),
  entry: {
    publicApp: path.resolve(__dirname, 'src/frontend/admin/app'),
    adminApp: path.resolve(__dirname, 'src/frontend/admin/app'),
    editingConsole: path.resolve(__dirname, 'src/frontend/admin/components/EditingConsole'),
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'public/js/[name].js',
    chunkFilename: 'public/js/[name]-chunk.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              localIdentName: '[name]__[local]___[hash:base64:5]',
              modules: true,
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },
    ]
  },
  plugins: [
    nconf.get('NODE_ENV') !== 'production' ? new webpack.HotModuleReplacementPlugin() : null,
    nconf.get('NODE_ENV') !== 'production' ? new webpack.NamedModulesPlugin() : null,
    new webpack.NoEmitOnErrorsPlugin(),
    new BundleAnalyzerPlugin({
      analyzerMode: nconf.get('NODE_ENV') === 'production' ? 'static' : 'server',
      openAnalyzer: false,
    }),
    new webpack.NormalModuleReplacementPlugin(/nconf/, ((resource) => {
      resource.request = resource.request.replace(/nconf/, path.resolve(__dirname, 'config/nconf-browser'));
    })),
    new MiniCssExtractPlugin({
      filename: 'public/css/[name].css',
      chunkFilename: 'public/css/[id].css',
      publicPath: '/public/css/',
    }),
  ].filter(p => p),
  resolve: {
    modules: [
      path.join(__dirname, 'src'),
      'node_modules'
    ]
  }
}
