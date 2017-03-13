const resolve = require('path').resolve;
const webpack = require('webpack');

module.exports = {
    entry: ['./index.js'],

    output: {
        filename: 'prod.js',
        path: resolve(__dirname, 'dist'),
        publicPath: '/'
    },

    context: resolve(__dirname, 'src'),

    devtool: 'cheap-module-source-map',

    devServer: {
        hot: true,
        contentBase: resolve(__dirname, 'dist'),
        publicPath: '/'
    },

    plugins: [
        /* we set NODE_ENV to production because it removes a lot of code added by
           react hot loader from non-dev bundles. more info here https://goo.gl/AO5M9B */
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true
        })
    ],

    module: {
        rules: [
            {
                test: /\.js$/,
                use: ['babel-loader'],
                exclude: /node_modules/
            }
        ],
    }
}