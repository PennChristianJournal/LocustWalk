import ViewEngine from './viewEngine';
import path from 'path';
import webpack from 'webpack';
import nconf from 'nconf';

nconf.argv().env('__').file({file: path.join(__dirname, '../config.json')}).overrides({
  APP_ENV: 'browser',
});

const GROUPS = {};
const ENTRIES = {};

Object.keys(ViewEngine.TARGETS).forEach(group => {
  const GROUP = ViewEngine.TARGETS[group];
  GROUPS[group] = Object.keys(GROUP).map(target => `js/${target}`);
  Object.keys(GROUP).forEach(target => {
    const mountTarget = GROUP[target].mountTarget;
    if (process.env.NODE_ENV !== 'production') {
      ENTRIES[`js/${target}`] = ['react-hot-loader/patch', 'webpack-hot-middleware/client', mountTarget];
    } else {
      ENTRIES[`js/${target}`] = mountTarget;
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
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: [{
        loader: 'react-hot-loader/webpack',
      }, {
        loader: 'babel-loader',
        query: {
          presets: [
            ['es2015', { modules: false }],
            'react',
            'stage-2',
          ],
          plugins: [
            ['babel-plugin-relative-import', {
              rootPathSuffix: 'src',
            }],
          ],
        },
      }],
    }, {
      test: require.resolve('medium-editor-insert-plugin'),
      loader: 'imports-loader?define=>false',
    }],
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
    process.env.NODE_ENV !== 'production' ? new (require('webpack-bundle-analyzer').BundleAnalyzerPlugin)({openAnalyzer: false}) : null,
    process.env.NODE_ENV !== 'production' ? new webpack.HotModuleReplacementPlugin() : null,
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': ['APP_ENV', 'SERVER_ROOT', 'NODE_ENV']
      .reduce((acc, cur, i, arr) => {
        acc[cur] = JSON.stringify(nconf.get(cur));
        return acc;
      }, {}),
    }),
    new webpack.NormalModuleReplacementPlugin(/nconf/, function(resource) {
      resource.request = resource.request.replace(/nconf/, 'nconf-browser');
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'js/react',
      minChunks(module, count) {
        var context = module.context;
        return context && (
          context.indexOf('node_modules/react/') >= 0 ||
          context.indexOf('node_modules/react-dom/') >= 0 ||
          context.indexOf('node_modules/react-redux/') >= 0 ||
          context.indexOf('node_modules/redux/') >= 0 ||
          context.indexOf('node_modules/react-thunk/') >= 0
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
