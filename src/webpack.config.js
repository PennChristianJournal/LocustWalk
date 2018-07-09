import ViewEngine from './viewEngine';
import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer';
import path from 'path';
import webpack from 'webpack';
import nconf from 'nconf';

const TARGETS = {
  common: {
  },
  public: {
    'publicApp': path.resolve(__dirname, 'frontend/public/app'),
  },
  admin: {
    'adminApp': path.resolve(__dirname, 'frontend/admin/app'),
  },
};

const GROUPS = {};
const ENTRIES = {};

Object.keys(TARGETS).forEach(group => {
  const GROUP = TARGETS[group];
  GROUPS[group] = Object.keys(GROUP).map(target => `js/${target}`);
  Object.keys(GROUP).forEach(target => {
    if (process.env.NODE_ENV !== 'production') {
      ENTRIES[`js/${target}`] = [
        'react-hot-loader/patch',
        'webpack-hot-middleware/client',
        GROUP[target],
      ];
    } else {
      ENTRIES[`js/${target}`] = GROUP[target];
    }
  });
});

module.exports = {
  devtool: process.env.NODE_ENV !== 'production' ? 'source-map' : false,
  entry: ENTRIES,
  output: {
    path: path.join(__dirname, '../public'),
    filename: '[name].js',
    chunkFilename: '[name]-chunk.js',
    publicPath: nconf.get('SERVER_ROOT'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            query: {
              presets: [
                ['env', { modules: false }],
                'react',
                'stage-2',
              ],
              plugins: [
                ['babel-plugin-relative-import', {
                  rootPathSuffix: 'src',
                }],
                'dynamic-import-webpack',
              ],
            },
          }
        ],
      }, {
        test: require.resolve('medium-editor-insert-plugin'),
        loader: 'imports-loader?define=>false',
      },
    ],
  },

  resolve: {
    modules: [
      __dirname,
      '../node_modules',
      'node_modules',
    ],
    extensions: ['.js', '.json'],
    alias: {
      'jquery-ui/widget': 'blueimp-file-upload/js/vendor/jquery.ui.widget.js',
    },
  },

  plugins: [
    process.env.NODE_ENV !== 'production' ? new BundleAnalyzerPlugin({openAnalyzer: false}) : null,
    process.env.NODE_ENV !== 'production' ? new webpack.HotModuleReplacementPlugin() : null,
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': Object.assign(['SERVER_ROOT', 'NODE_ENV']
      .reduce((acc, cur, i, arr) => {
        acc[cur] = JSON.stringify(nconf.get(cur));
        return acc;
      }, {}), {
        'APP_ENV': JSON.stringify('browser'),
      }),
    }),
    new webpack.NormalModuleReplacementPlugin(/nconf/, function(resource) {
      resource.request = resource.request.replace(/nconf/, 'nconf-browser');
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'js/react',
      minChunks(module, count) {
        var context = module.context;
        return context && (
          context.indexOf(path.join('node_modules', 'react')) >= 0 ||
          context.indexOf(path.join('node_modules', 'react-dom')) >= 0 ||
          context.indexOf(path.join('node_modules', 'react-router')) >= 0 ||
          context.indexOf(path.join('node_modules', 'react-helmet')) >= 0 ||
          context.indexOf(path.join('node_modules', 'react-redux')) >= 0 ||
          context.indexOf(path.join('node_modules', 'redux')) >= 0 ||
          context.indexOf(path.join('node_modules', 'react-thunk')) >= 0 ||
          context.indexOf(path.join('node_modules', 'react-apollo')) >= 0 ||
          context.indexOf(path.join('node_modules', 'apollo-client')) >= 0 ||
          context.indexOf(path.join('node_modules', 'fbjs')) >= 0 ||
          context.indexOf(path.join('node_modules', 'prop-types')) >= 0
        );
      },
    }),
    new webpack.optimize.CommonsChunkPlugin({ name: 'js/manifest' }),
  ].concat(Object.keys(GROUPS).map(group => {
    return new webpack.optimize.CommonsChunkPlugin({
      name: `js/${group}`,
      chunks: GROUPS[group],
      minChunks: 2,
    });
  })).filter(plugin => plugin),
};
