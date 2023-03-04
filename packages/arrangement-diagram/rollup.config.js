import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { getBabelOutputPlugin } from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';
import image from '@rollup/plugin-image';
import dts from 'rollup-plugin-dts';

const config = [
    {
        input: 'src/index.ts',
        output: {
            file: 'dist/index.umd.js',
            format: 'umd',
            name: 'ArrangementDiagram',
            sourcemap: true,
            globals: {
                '@antv/g6': 'G6',
            },
            plugins: [getBabelOutputPlugin({ presets: ['@babel/preset-env'], allowAllFormats: true })],
        },
        plugins: [image(), resolve(), commonjs(), typescript(), babel({ exclude: 'node_modules/**' })],
        // external: ['lodash', '@antv/g6', 'eventemitter3'],
        external: ['@antv/g6'],
    },
    {
        input: 'src/index.ts',
        output: {
            file: 'dist/index.mjs',
            format: 'esm',
            name: 'ArrangementDiagram',
            sourcemap: true,
            globals: {
                '@antv/g6': 'G6',
            },
            plugins: [getBabelOutputPlugin({ presets: ['@babel/preset-env'], allowAllFormats: true })],
        },
        plugins: [image(), resolve(), commonjs(), typescript({ declaration: true, declarationDir: 'dist' }), babel({ exclude: 'node_modules/**' })],
        external: ['@antv/g6'],
    },
    // {
    //     input: 'src/index.ts',
    //     output: {
    //         file: 'dist/bundle.d.ts',
    //         format: 'es',
    //     },
    //     plugins: [dts()],
    // },
];

export default config;
