import fs from 'fs';

import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import { babel } from '@rollup/plugin-babel';

// import UserscriptPlugin from './webpack/userscriptPlugin';

function createRollupConfig(userscriptName) {
    return [{
        input: `./src/${userscriptName}/index.js`,
        output: {
            dir: `./tmp_build/${userscriptName}`,
            format: 'es',
        },
        manualChunks(id) {
            if (id.includes('node_modules') || id.includes('rollupPluginBabelHelpers')) {
                return 'vendor';
            }
        },
        plugins: [
            nodeResolve(),
            commonjs(),
            babel({
                babelHelpers: 'bundled',
                exclude: 'node_modules/**',
            }),
            {
            name: 'test',

            async renderChunk(code, chunk, options) {
                if (chunk.name !== 'vendor') return;
                let terserInst = terser();
                let result = await terserInst.renderChunk(code, chunk, {});
                return result;
            }
        }]
    },
    {
        input: `./tmp_build/${userscriptName}/index.js`,
        output: {
            file: `./dist/${userscriptName}.user.js`,
            format: 'iife',
        },
    }];
}

export default async () => {
    const userscriptDirs = await fs.promises.readdir('./src');

    return userscriptDirs
        .filter((name) => name !== 'lib' && !name.startsWith('.'))
        .flatMap(createRollupConfig);
};


/*// Could have used webpack-userscript instead of rolling a custom solutions,
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
*/
