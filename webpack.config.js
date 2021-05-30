const fs = require('fs');
const path = require('path');

const TerserPlugin = require('terser-webpack-plugin');

const UserscriptPlugin = require('./webpack/userscriptPlugin');

const userscripts = fs
    .readdirSync(path.resolve(__dirname, 'src'))
    .filter((name) => name !== 'lib' && !name.startsWith('.'));

// Could have used webpack-userscript instead of rolling a custom solutions,
// but there are some problems with installing it with webpack 5.
module.exports = {
    entry: userscripts
        .reduce((acc, curr) => {
            acc[curr] = path.resolve(__dirname, 'src', curr, 'index.js');
            return acc;
        }, {}),
    output: {
        filename: '[name].user.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    optimization: {
        minimize: false,
    },
    target: 'es5',
    plugins: [
        new UserscriptPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
        ]
    }
};
