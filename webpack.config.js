var path = require('path');
var webpack = require('webpack');

module.exports = {
    resolve: {
        extensions: ['.js', '.jsx']
    },

    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'build.js'
    },

    mode: 'development',

    entry: {
        root: [
            'babel-polyfill',
            path.join(__dirname, 'src', 'view', 'entry.jsx')
        ]
    },

    module: {
        rules: [
            {
                test: /(\.jsx|\.js)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015', 'stage-0']
                }
            }
        ]
    },

    watch: true,
    devtool: 'inline-source-map'
};
