const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

/** @type { import('webpack').Configuration } */
module.exports = {
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                        }
                    }
                ]
            },
            {
                test: /\.svg$/,
                use: ['@svgr/webpack']
            }
        ]
    },
    resolve: {
        alias: {
            '@app': path.resolve(__dirname, 'src'),
        }
    },
    devServer: {
        publicPath: '/dist/',
        open: true
    },
    plugins: [
        new MiniCssExtractPlugin()
    ]
};