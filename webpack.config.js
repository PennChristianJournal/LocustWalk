const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path');
const webpack = require('webpack');
const fs = require('fs');

const nconf = require('nconf');
nconf.argv().env().file({file: path.join(__dirname, './config.json')}).overrides({
    APP_ENV: 'browser'
});

function walk(dir, action) {
    let list = fs.readdirSync(dir);
    list.forEach(function (file) {
        let path = dir + "/" + file;
        let stat = fs.statSync(path);
        if (stat && stat.isDirectory()) {
            walk(path, action);
        } else {
            action(path);
        }
    });
}

var entries = {};
walk(path.join(__dirname, 'src/react/views'), function(file) {
    let relativePath = path.relative(path.join(__dirname, 'src/react'), file);
    let target = path.join(path.dirname(relativePath), path.basename(relativePath, '.js'));
    if (process.env.NODE_ENV !== 'production') {
        entries[target] = ['webpack-hot-middleware/client', file];
    } else {
        entries[target] = file;
    }
});

module.exports = {
    devtool: process.env.NODE_ENV !== 'production' ? 'source-map' : false,
    entry: entries,
    output: {
        path: path.join(__dirname, 'public'),
        filename: '[name].js',
        chunkFilename: '[name]-chunk.js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: [{
                loader: 'babel-loader',
                query: {
                    presets: [
                        [ 'es2015', { modules: false } ],
                        'react',
                        'stage-2'
                    ],
                },
            }]
        }, {
            // test: /\.svg$/,
            // loader: "url-loader?limit=10000&mimetype=image/svg+xml"
        }, {
            test: require.resolve('medium-editor-insert-plugin'),
            loader: 'imports-loader?define=>false'
        }]
    },

    resolve: {
        modules: [
            path.join(__dirname, 'src'),
            'node_modules'
        ],
        extensions: ['.js', '.json'],
        alias: {
            'jquery-ui/widget': 'blueimp-file-upload/js/vendor/jquery.ui.widget.js'
        }
    },

    plugins: [
        // new BundleAnalyzerPlugin({
        //     analyzerMode: 'static'
        // }),
        process.env.NODE_ENV !== 'production' ? new webpack.HotModuleReplacementPlugin() : null,
        new webpack.DefinePlugin({
            'process.env': ['APP_ENV', 'SERVER_ROOT', 'NODE_ENV']
            .reduce((acc, cur, i, arr) => {
                acc[cur] = JSON.stringify(nconf.get(cur));
                return acc;
            }, {})
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
        new webpack.optimize.CommonsChunkPlugin({
            name: 'js/client',
            chunks: Object.keys(entries).filter(entry => entry.indexOf('admin') === -1),
            minChunks: 3
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'js/admin',
            chunks: Object.keys(entries).filter(entry => entry.indexOf('admin') !== -1),
            minChunks: 3
        }),
    ].filter(plugin => plugin)
}