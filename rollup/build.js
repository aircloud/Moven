const rollup = require('rollup');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const path = require('path')
// see below for details on the options
const inputOptions = {
    input: path.join(__dirname, '../src/index.js'),
    plugins: [ resolve(), commonjs() ],
};
const outputOptions =  {
    file: path.join(__dirname, '../../../../public/lib/moven.js'),
    format: 'iife',
    name: 'Moven',
};

async function build() {
    // create a bundle
    const bundle = await rollup.rollup(inputOptions);

    // generate code and a sourcemap
    const { code, map } = await bundle.generate(outputOptions);

    // or write the bundle to disk
    await bundle.write(outputOptions);
}

build();