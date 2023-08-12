//@ts-check

'use strict'

const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

/** @type {import('webpack').Configuration} */
const config = {
    target: 'node', // https://webpack.js.org/configuration/node/
    // https://webpack.js.org/configuration/entry-context/
    entry: {
        extension: {import: './src/extension.ts', filename: '[name].js'},
        SlkGrid: {import: './src/slk/js/main.ts', filename: '[name].js'},
        BinaryEditor: {import: './src/binary/js/main.ts', filename: '[name].js'},
        tabulator: './src/utils/css/tabulator.scss',
    },
    output: { // https://webpack.js.org/configuration/output/
        path: path.resolve(__dirname, 'out'),
        //filename: 'extension.js',
        compareBeforeEmit: false,
        library: {
            type: 'commonjs2'
        },
        devtoolModuleFilenameTemplate: '../[resource-path]',
        clean: true,
        environment: {
            bigIntLiteral: true
        }
    },
    //devtool: 'source-map',
    devtool: 'inline-source-map',
    externals: {
        // https://webpack.js.org/configuration/externals
        vscode: 'commonjs vscode',
        fs: 'commonjs fs',
        path: 'commonjs path',
    },
    resolve: { // https://github.com/TypeStrong/ts-loader
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'ts-loader',
                    options: {
                        compilerOptions: {
                            module: 'esnext',
                            target: 'esnext',
                            esModuleInterop: true,
                        }
                    }
                }]
            },
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css'
        })
    ],
}

module.exports = config
