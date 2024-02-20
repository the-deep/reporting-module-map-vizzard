import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import filesize from 'rollup-plugin-filesize';
import eslint from '@rollup/plugin-eslint';
import image from '@rollup/plugin-image';
// import copy from 'rollup-plugin-copy';
import postcssPresetEnv from 'postcss-preset-env';
import postcssNested from 'postcss-nested';
import postcssNormalize from 'postcss-normalize';

import pkg from './package.json' assert { type: 'json' };

const INPUT_FILE_PATH = 'src/index.ts';

const PLUGINS = [
    postcss({
        extract: true,
        modules: {
            localsConvention: 'camelCaseOnly',
        },
        autoModules: false,
        plugins: [
            // autoprefixer,
            postcssPresetEnv,
            postcssNested,
            postcssNormalize,
        ],
    }),
    eslint({
        throwOnError: true,
        include: ['**/*.jsx', '**/*.js', '**/*.ts', '**/*.tsx'],
    }),
    babel({
        babelHelpers: 'runtime',
        exclude: 'node_modules/**',
        extensions: ['.jsx', '.js', '.ts', '.tsx'],
    }),
    resolve({
        browser: true,
        extensions: ['.jsx', '.js', '.ts', '.tsx'],
    }),
    commonjs(),
    filesize(),
    image(),
    /*
    copy({
        targets: [
            { src: ['src/xxx.d.ts'], dest: 'build/esm' },
        ],
    }),
    */
];

const OUTPUT_DATA = [
    {
        dir: 'build/cjs',
        format: 'cjs',
    },
    {
        dir: 'build/esm',
        format: 'esm',
        preserveModules: true,
        preserveModulesRoot: 'src',
    },
];

const config = OUTPUT_DATA.map((options) => ({
    input: INPUT_FILE_PATH,
    output: {
        ...options,
        sourcemap: true,
        exports: 'named',
    },
    external: [
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {}),
    ],
    plugins: PLUGINS,
}));

export default config;
