import {uglify} from 'rollup-plugin-uglify';

export default {
    input: 'src/promise',
    output: {
        file: 'dist/tp.js',
        format: 'umd',
        name:'TP'
    },
    plugins: [uglify()]

};