var path = require('path');
var webpack = require('webpack');

module.exports = {
    resolve: {
        extensions: [ '.js', '.jsx' ]
    },

    output: {
        path: 'build',
        library: '[name]',
        filename: 'build.js'
    },

    entry: {
       root: path.join(
           __dirname, 'src', 'view', 'entry.jsx'
       )
    },

    module: {
        loaders: [
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

    watch: true,
    devtool: 'inline-source-map'
};

