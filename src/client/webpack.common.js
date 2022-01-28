const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: {
        demo1: path.resolve(__dirname, './demo1.ts'),
        demo2: path.resolve(__dirname, './demo2.ts'),
        demo3: path.resolve(__dirname, './demo3.ts'),
        demo4: path.resolve(__dirname, './demo4.ts'),
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        alias: {
            three: path.resolve('./node_modules/three'),
        },
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, '../../dist/client'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './demo1.html'),
            filename: path.resolve(__dirname, '../../dist/client/demo1.html'),
            chunks: ['demo1'],
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './demo2.html'),
            filename: path.resolve(__dirname, '../../dist/client/demo2.html'),
            chunks: ['demo2'],
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './demo3.html'),
            filename: path.resolve(__dirname, '../../dist/client/demo3.html'),
            chunks: ['demo3'],
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './demo4.html'),
            filename: path.resolve(__dirname, '../../dist/client/demo4.html'),
            chunks: ['demo4'],
        }),
    ],
}
