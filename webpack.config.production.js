var path = require('path');
var webpack = require('webpack');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    resolve: {
        extensions: [ '.js', '.jsx' ]
    },

    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'build.js'
    },

    entry: {
       root: path.join(
           __dirname, 'src', 'view', 'entry.jsx'
       )
    },

    module: {
        rules: [
           {
               test: /(\.jsx|\.js)$/,
               exclude: /node_modules/,
               loader: 'babel-loader',
               query: {
                   presets: [
                       'react',
                       'es2015',
                       'stage-0'
                   ]
               }
           }
       ]
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env': { 'NODE_ENV': JSON.stringify('production') }
        }), 
        new webpack.DefinePlugin({
            'process.nextTick': null
        }), 
        //new webpack.optimize.UglifyJsPlugin({ minimize: true }), 
        new UglifyJsPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.AggressiveMergingPlugin()
    ]
};

